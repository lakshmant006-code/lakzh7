import { validateImageDataUri, storePendingUpload, checkRateLimit } from "../server/upload-store.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method not allowed" });
    return;
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    res.status(500).json({ error: "server not configured (missing BLOB_READ_WRITE_TOKEN)" });
    return;
  }

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "unknown";
  if (!checkRateLimit(ip)) {
    res.status(429).json({ error: "rate limit exceeded, try again later" });
    return;
  }

  const { imageDataUri } = req.body || {};
  const validationError = validateImageDataUri(imageDataUri);
  if (validationError) {
    res.status(400).json({ error: validationError });
    return;
  }

  try {
    const result = await storePendingUpload(imageDataUri, token);
    res.status(200).json({ ok: true, id: result.id });
  } catch (err) {
    console.error("[upload-portrait]", err);
    res.status(502).json({ error: "upload failed" });
  }
}
