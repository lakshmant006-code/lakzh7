// Drawings people make on the hand (accessories, nail paints): each is a transparent PNG of just the strokes, drawn over
// the open-hand picture again when it is shown.
// Where they live, in order of preference:
//   1. Supabase (SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY): the PNG in the private "hands" bucket, a row in hand_drawings
//      (see supabase/migrations). Called with plain fetch against its REST API; the key never leaves the server.
//   2. Vercel Blob (BLOB_READ_WRITE_TOKEN), as before.
//   3. Memory, in local development only, so the page can be tried with nothing set up. Production never falls back to it.
import { randomUUID } from "node:crypto";

const MAX_BYTES = 1.5 * 1024 * 1024;
const MAX_W = 1400, MAX_H = 2000;
export const ID_RE = /^[0-9a-f-]{36}$/;

const memory = new Map();                                  // id -> { buffer, uploadedAt }
const SB_URL = () => (process.env.SUPABASE_URL || "").replace(/\/$/, "");
const SB_KEY = () => process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const useSupabase = () => !!(SB_URL() && SB_KEY());
const useMemory = () => !useSupabase() && !process.env.BLOB_READ_WRITE_TOKEN && process.env.NODE_ENV !== "production";
export const isConfigured = () => useSupabase() || !!process.env.BLOB_READ_WRITE_TOKEN || process.env.NODE_ENV !== "production";
// New-style keys (sb_secret_...) go in the apikey header only; old-style keys are JWTs and also go in Authorization
const sbAuth = () => (SB_KEY().startsWith("eyJ") ? { apikey: SB_KEY(), Authorization: `Bearer ${SB_KEY()}` } : { apikey: SB_KEY() });
const sb = (path, init = {}) => fetch(`${SB_URL()}${path}`, { ...init, headers: { ...sbAuth(), ...(init.headers || {}) } });

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
  if (useSupabase()) {
    const up = await sb(`/storage/v1/object/hands/${id}.png`, { method: "POST", headers: { "Content-Type": "image/png", "x-upsert": "false" }, body: buffer });
    if (!up.ok) throw new Error(`storage ${up.status} ${await up.text()}`);
    const row = await sb("/rest/v1/hand_drawings", { method: "POST", headers: { "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify({ id, bytes: buffer.length }) });
    if (!row.ok) throw new Error(`table ${row.status} ${await row.text()}`);
    return id;
  }
  const { put } = await import("@vercel/blob");
  await put(`hands/${id}.png`, buffer, { access: "private", contentType: "image/png", token: process.env.BLOB_READ_WRITE_TOKEN, addRandomSuffix: false });
  return id;
}

export async function listDrawings(limit = 80) {
  if (useMemory()) return [...memory.entries()].map(([id, v]) => ({ id, uploadedAt: v.uploadedAt })).sort((a, b) => b.uploadedAt - a.uploadedAt).slice(0, limit);
  if (useSupabase()) {
    const r = await sb(`/rest/v1/hand_drawings?select=id,created_at&order=created_at.desc&limit=${limit}`);
    if (!r.ok) throw new Error(`table ${r.status} ${await r.text()}`);
    return (await r.json()).filter((d) => ID_RE.test(d.id)).map((d) => ({ id: d.id, uploadedAt: d.created_at }));
  }
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
  if (useSupabase()) {
    const r = await sb(`/storage/v1/object/hands/${id}.png`);
    if (r.status === 404 || r.status === 400) return null;
    if (!r.ok) throw new Error(`storage ${r.status}`);
    return Buffer.from(await r.arrayBuffer());
  }
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
