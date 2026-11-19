import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* Arc fan: a hand of cards that opens along a semicircle when it scrolls into view. Move across it (or drag a finger across it) and the card under
   the pointer lifts out of the arc, straightens and gets a name tag while its neighbours step aside. The two ends melt into the page.
   Pass your own pictures as photos={[{ src, caption }]}; without them it shows coloured cards. Click the empty space to replay the reveal. */
const COLORS = [["#ff6b6b", "#ffd36b"], ["#6b8bff", "#6bf0ff"], ["#b36bff", "#ff6bd0"], ["#2fd39a", "#c6ff6b"], ["#ff9a4d", "#ff4d8d"], ["#4dc6ff", "#7a4dff"], ["#f7c948", "#f06543"], ["#8ee3c8", "#4f6bed"], ["#ff8fb1", "#7a5cff"]];
const NAMES = ["Sunrise", "Lagoon", "Violet hour", "Meadow", "Ember", "Glacier", "Marigold", "Tide", "Dusk"];

export default function ArcFan({ cards = 7, radius = 2.7, span = 132, blur = 3.4, photos }) {
  const box = useRef(null), leave = useRef(0);
  const [w, setW] = useState(720), [open, setOpen] = useState(false), [active, setActive] = useState(null), [run, setRun] = useState(0);
  const items = useMemo(() => Array.from({ length: cards }, (_, i) => photos?.[i % (photos?.length || 1)] || { caption: NAMES[i % NAMES.length], c: COLORS[i % COLORS.length] }), [cards, photos]);
  const n = items.length;

  useEffect(() => {
    const el = box.current; const ro = new ResizeObserver(() => setW(el.clientWidth || 720)); ro.observe(el); setW(el.clientWidth || 720);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setOpen(true); }, { threshold: 0.3 }); io.observe(el);
    return () => { ro.disconnect(); io.disconnect(); };
  }, []);
  useEffect(() => { if (!run) return undefined; setOpen(false); const t = setTimeout(() => setOpen(true), 260); return () => clearTimeout(t); }, [run]);
  useEffect(() => () => clearTimeout(leave.current), []);

  const g = useMemo(() => {
    const cw = Math.max(58, Math.min(120, w * 0.14)), ch = cw * 1.32, r0 = cw * radius, padB = ch * 0.5;
    return { cw, ch, r0, padB, angles: items.map((_, i) => (n === 1 ? 0 : -span / 2 + (span * i) / (n - 1))), height: ch * 1.5 + r0 * 0.95 + padB + 40 };
  }, [w, n, radius, span, items]);

  const pose = (i) => {
    const th = g.angles[i];
    if (!open) return { x: 0, y: 0, rot: 0, s: 0.6, o: 0, b: 6 };
    let rot = th, lift = 0, s = 1;
    if (active !== null) { const d = i - active, step = span / Math.max(1, n - 1); if (d === 0) { rot = th * 0.3; lift = g.ch * 0.2; s = 1.2; } else rot = th + Math.sign(d) * Math.min(16, 26 / Math.abs(d) ** 0.9) * (step / 18); }
    const rad = (th * Math.PI) / 180, r = g.r0 + lift, edge = Math.abs(th) / (span / 2);
    return { x: Math.sin(rad) * r, y: -Math.cos(rad) * r * 0.92, rot, s, o: active === i ? 1 : 1 - 0.42 * edge ** 2.4, b: active === i ? 0 : blur * edge ** 2 * (active === null ? 1 : 0.7) };
  };
  const pick = useCallback((e) => {
    const r = box.current.getBoundingClientRect(), px = e.clientX - (r.left + r.width / 2), py = r.bottom - g.padB - e.clientY;
    if (py < -g.padB - 10 || py > r.height + 20) return null;
    const ang = Math.max(-span / 2, Math.min(span / 2, (Math.atan2(px, Math.max(py, 1)) * 180) / Math.PI));
    let best = 0, bd = 1e9; g.angles.forEach((a, i) => { const d = Math.abs(a - ang); if (d < bd) { bd = d; best = i; } }); return best;
  }, [g, span]);

  const tip = active === null ? null : (() => { const p = pose(active), rad = (g.angles[active] * Math.PI) / 180; return { x: p.x + Math.sin(rad * 0.3) * (g.ch * p.s + 10), y: p.y - Math.cos(rad * 0.3) * (g.ch * p.s + 10) }; })();
  return (
    <div ref={box} style={{ position: "relative", width: "100%", maxWidth: 1040, height: g.height, margin: "0 auto", touchAction: "pan-y", userSelect: "none", WebkitMaskImage: "linear-gradient(90deg, transparent, #000 16%, #000 84%, transparent)", maskImage: "linear-gradient(90deg, transparent, #000 16%, #000 84%, transparent)" }}
      onClick={(e) => { if (e.target === e.currentTarget) setRun((x) => x + 1); }}
      onPointerMove={(e) => { clearTimeout(leave.current); setActive(pick(e)); }} onPointerDown={(e) => { clearTimeout(leave.current); setActive(pick(e)); }}
      onPointerUp={(e) => { if (e.pointerType !== "mouse") leave.current = setTimeout(() => setActive(null), 1400); }}
      onPointerLeave={(e) => { if (e.pointerType === "mouse") leave.current = setTimeout(() => setActive(null), 80); }}>
      {items.map((it, i) => { const p = pose(i), up = active === i;
        return (
          <div key={i + "-" + run} role="img" aria-label={it.caption} style={{ position: "absolute", left: "50%", bottom: g.padB, width: g.cw, height: g.ch, marginLeft: -g.cw / 2, boxSizing: "border-box", borderRadius: 10, overflow: "hidden", border: "3px solid #fff", background: it.src ? "#222" : `linear-gradient(150deg, ${it.c?.[0]}, ${it.c?.[1]})`, boxShadow: "0 10px 26px rgba(0,0,0,.35)", zIndex: up ? 50 : i + 1, transformOrigin: "50% 100%",
            transform: `translate(${p.x}px, ${p.y}px) rotate(${p.rot}deg) scale(${p.s})`, opacity: p.o, filter: `blur(${p.b.toFixed(2)}px)`,
            transition: `transform .7s cubic-bezier(.3, 1.35, .4, 1) ${open && active === null ? i * 0.045 : 0}s, opacity .5s ease ${open && active === null ? i * 0.045 : 0}s, filter .4s ease` }}>
            {it.src && <img src={it.src} alt="" draggable="false" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }} />}
          </div>); })}
      <span aria-hidden="true" style={{ position: "absolute", left: "50%", bottom: g.padB, zIndex: 60, pointerEvents: "none", whiteSpace: "nowrap", padding: "7px 12px 6px", borderRadius: 8, background: "#f5f5f3", color: "#151515", font: "500 10.5px/1 ui-monospace, Menlo, monospace", letterSpacing: ".1em", textTransform: "uppercase", boxShadow: "0 6px 18px rgba(0,0,0,.3)",
        transform: tip ? `translate(calc(-50% + ${tip.x}px), ${tip.y}px)` : `translate(-50%, ${-g.r0}px) scale(.85)`, opacity: tip ? 1 : 0, transition: "transform .3s cubic-bezier(.3,1.3,.4,1), opacity .2s" }}>{active !== null ? items[active].caption : ""}</span>
    </div>
  );
}
