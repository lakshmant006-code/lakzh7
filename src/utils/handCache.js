/* The list of hands is kept in the browser, so /hands can show the last list the instant it opens and refresh it in the background.
   It is also fetched once when the site is idle, with the first few drawings, so they are already there when the page is opened. */
const KEY = "hands:list:v1";
export const cachedHands = () => { try { const v = JSON.parse(localStorage.getItem(KEY) || "null"); return Array.isArray(v) ? v : null; } catch { return null; } };
const store = (list) => { try { localStorage.setItem(KEY, JSON.stringify(list.slice(0, 120))); } catch { /* storage full or blocked */ } };
export const drawingUrl = (id) => `/api/hand-drawing?id=${id}`;

export async function fetchHands(fresh = false) {                  // fresh: skip every cache (right after someone saves a drawing)
  const r = await fetch(fresh ? `/api/hand-drawings?t=${Date.now()}` : "/api/hand-drawings", fresh ? { cache: "no-store" } : undefined);
  if (!r.ok) throw new Error("bad");
  const list = (await r.json()).drawings || [];
  store(list);
  return list;
}

let warmed = false;
export function warmHands() {                                 // once per visit, when the browser has nothing better to do
  if (warmed) return; warmed = true;
  const go = () => fetchHands().then((list) => list.slice(0, 16).forEach((d) => { const i = new Image(); i.decoding = "async"; i.src = drawingUrl(d.id); })).catch(() => {});
  (window.requestIdleCallback || ((f) => setTimeout(f, 1500)))(go, { timeout: 4000 });
}
