import { ID_RE, readDrawing } from "../server/hand-store.js";

// GET /api/hand-drawing?id=... -> the PNG of one drawing
export default async function handler(req, res) {
  const id = String(req.query?.id || "");
  if (req.method !== "GET" || !ID_RE.test(id)) { res.status(400).end(); return; }
  try {
    const buf = await readDrawing(id);
    if (!buf) { res.status(404).end(); return; }
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");   // an id never changes what it shows
    res.status(200).send(buf);
  } catch (err) {
    console.error("[hand-drawing]", err);
    res.status(502).end();
  }
}
