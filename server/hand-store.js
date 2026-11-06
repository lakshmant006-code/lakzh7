// Drawings people make on the hand (accessories, nail paints): each is a transparent PNG of just the strokes, drawn over
// the open-hand picture again when it is shown. They live in Vercel Blob under hands/ (the same store as the portrait
// intake), so every visitor, on any device, reads and writes the same collection.
// With no BLOB_READ_WRITE_TOKEN, local development falls back to memory so the page can be tried; production never does.
import { randomUUID } from "node:crypto";

const MAX_BYTES = 1.5 * 1024 * 1024;
const MAX_W = 1400, MAX_H = 2000;
export const ID_RE = /^[0-9a-f-]{36}$/;

const memory = new Map();                                  // id -> { buffer, uploadedAt }
const useMemory = () => !process.env.BLOB_READ_WRITE_TOKEN && process.env.NODE_ENV !== "production";

export function validateDrawing(dataUri) {
  const m = typeof dataUri === "string" && dataUri.match(/^data:image\/png;base64,([A-Za-z0-9+/=]+)$/);
  if (!m) return "send the drawing as a PNG data URI";
  const buf = Buffer.from(m[1], "base64");
  if (buf.length > MAX_BYTES) return "drawing is too large";
  // PNG signature and the size in the header, so nothing else can be stored here
  if (buf.length < 33 || buf.readUInt32BE(0) !== 0x89504e47 || buf.toString("ascii", 12, 16) !== "IHDR") return "not a PNG";
  const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
  if (!w || !h || w > MAX_W || h > MAX_H) return "unexpected picture size";
  return null;
}

export async function saveDrawing(dataUri) {
  const buffer = Buffer.from(dataUri.slice(dataUri.indexOf(",") + 1), "base64");
  const id = randomUUID();
  if (useMemory()) { memory.set(id, { buffer, uploadedAt: new Date() }); return id; }
  const { put } = await import("@vercel/blob");
  await put(`hands/${id}.png`, buffer, { access: "private", contentType: "image/png", token: process.env.BLOB_READ_WRITE_TOKEN, addRandomSuffix: false });
  return id;
}

export async function listDrawings(limit = 80) {
  if (useMemory()) return [...memory.entries()].map(([id, v]) => ({ id, uploadedAt: v.uploadedAt })).sort((a, b) => b.uploadedAt - a.uploadedAt).slice(0, limit);
  const { list } = await import("@vercel/blob");
  const out = []; let cursor;
  do {
    const r = await list({ prefix: "hands/", limit: 1000, cursor, token: process.env.BLOB_READ_WRITE_TOKEN });
    for (const b of r.blobs) { const id = b.pathname.replace(/^hands\//, "").replace(/\.png$/, ""); if (ID_RE.test(id)) out.push({ id, uploadedAt: b.uploadedAt }); }
    cursor = r.hasMore ? r.cursor : undefined;
  } while (cursor && out.length < 2000);
  return out.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)).slice(0, limit);
}

export async function readDrawing(id) {
  if (useMemory()) return memory.get(id)?.buffer || null;
  const { get } = await import("@vercel/blob");
  const r = await get(`hands/${id}.png`, { access: "private", token: process.env.BLOB_READ_WRITE_TOKEN });
  if (!r || r.statusCode !== 200) return null;
  return Buffer.from(await new Response(r.stream).arrayBuffer());
}

// a modest, best-effort limit per visitor (single instance), the same approach as the portrait intake
const log = new Map();
export function allowed(key, max = 12, windowMs = 60 * 60 * 1000) {
  const now = Date.now(), ts = (log.get(key) || []).filter((t) => now - t < windowMs);
  if (ts.length >= max) { log.set(key, ts); return false; }
  ts.push(now); log.set(key, ts); return true;
}
