import { validateDrawing, saveDrawing, listDrawings, allowed } from "../server/hand-store.js";

// GET  -> the newest drawings, [{ id, uploadedAt }]
// POST -> { imageDataUri } saves one more, returns { id }
export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      res.setHeader("Cache-Control", "public, s-maxage=5, stale-while-revalidate=20");
      res.status(200).json({ drawings: await listDrawings() });
      return;
    }
    if (req.method === "POST") {
      if (!process.env.BLOB_READ_WRITE_TOKEN && process.env.NODE_ENV === "production") {
        res.status(500).json({ error: "server not configured (missing BLOB_READ_WRITE_TOKEN)" });
        return;
      }
      const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress || "unknown";
      if (!allowed(ip)) { res.status(429).json({ error: "that's a lot of drawings, try again in a while" }); return; }
      const bad = validateDrawing(req.body?.imageDataUri);
      if (bad) { res.status(400).json({ error: bad }); return; }
      res.status(200).json({ ok: true, id: await saveDrawing(req.body.imageDataUri) });
      return;
    }
    res.status(405).json({ error: "method not allowed" });
  } catch (err) {
    console.error("[hand-drawings]", err);
    res.status(502).json({ error: "could not reach the drawing store" });
  }
}
