import React, { useEffect, useRef } from "react";

/* Letter scatter: a name that breaks apart and puts itself back together, every letter on its own spring. Tap to scatter or gather it,
   move the pointer through the scattered letters to push them, and change Response and Bounce to tune the motion live (the panel in the
   corner draws the spring's curve). Letters tumble, flip and drift while they are loose, then snap home with a staggered settle. */
const SIM = (k, c) => { const out = []; let x = 0, v = 0, t = 0; for (let i = 0; i < 360; i++) { v += (-k * (x - 1) - c * v) * (1 / 120); x += v * (1 / 120); t += 1 / 120; out.push([t, x]); if (t > 0.4 && Math.abs(x - 1) < 0.004 && Math.abs(v) < 0.05) break; } return out; };

export default function LetterScatter({ text = "LAKSHMAN", response = 0.6, bounce = 0.3, spread = 0.8, hold = 2.6 }) {
  const box = useRef(null), row = useRef(null), spans = useRef([]), panel = useRef(null), bar = useRef(null);
  const st = useRef({ scattered: false, t0: 0, ptr: null, home: [], L: [] });
  const k = (2 * Math.PI / response) ** 2, c = (1 - bounce) * 2 * Math.sqrt(k);
  const curve = SIM(k, c), top = Math.max(1.2, ...curve.map((p) => p[1])), dur = curve[curve.length - 1][0];
  const path = curve.map(([t, x], i) => `${i ? "L" : "M"}${(2 + (t / dur) * 112).toFixed(1)} ${(36 - (x / top) * 30).toFixed(1)}`).join(" ");

  useEffect(() => {
    const s = st.current, el = box.current; let raf, last = performance.now(), W = 0, H = 0, timer;
    const measure = () => { const r = el.getBoundingClientRect(); W = r.width; H = r.height;
      const rr = row.current.getBoundingClientRect(); s.home = [...row.current.children].map((ch) => { const b = ch.getBoundingClientRect(); return [b.left - r.left + b.width / 2 - W / 2, b.top - r.top + b.height / 2 - H / 2]; }); void rr; };
    const init = () => { s.L = text.split("").map((_, i) => ({ x: 0, y: 0, r: 0, sx: 1, vx: 0, vy: 0, vr: 0, tx: 0, ty: 0, tr: 0, tsx: 1, delay: 0, seed: Math.random() * 6 })); };
    const targets = () => { s.L.forEach((l, i) => { const h = s.home[i] || [0, 0];
      if (s.scattered) { const a = Math.random() * 6.28, rad = (0.25 + Math.random() * 0.75) * spread; l.tx = Math.cos(a) * (W / 2 - 24) * rad; l.ty = Math.sin(a) * (H / 2 - 30) * rad; l.tr = (Math.random() - 0.5) * 1000; l.tsx = Math.random() < 0.3 ? -1 : 1; l.delay = i * 0.025; }
      else { l.tx = h[0]; l.ty = h[1]; l.tr = Math.round(l.r / 360) * 360; l.tsx = 1; l.delay = i * 0.035; } }); s.t0 = performance.now(); };
    measure(); init(); s.L.forEach((l, i) => { l.x = l.tx = s.home[i]?.[0] || 0; l.y = l.ty = s.home[i]?.[1] || 0; });
    const ro = new ResizeObserver(() => { measure(); if (!s.scattered) targets(); }); ro.observe(el);
    document.fonts?.ready?.then(() => { measure(); if (!s.scattered) s.L.forEach((l, i) => { l.tx = l.x = s.home[i]?.[0] || 0; l.ty = l.y = s.home[i]?.[1] || 0; }); });
    const toggle = () => { s.scattered = !s.scattered; targets(); };
    const kk = () => (2 * Math.PI / response) ** 2, cc = () => (1 - bounce) * 2 * Math.sqrt(kk());
    const frame = (now) => { raf = requestAnimationFrame(frame); let dt = Math.min(0.05, (now - last) / 1000); last = now; const K = kk(), C = cc(), age = (now - s.t0) / 1000;
      while (dt > 0) { const h = Math.min(dt, 1 / 120); dt -= h;
        s.L.forEach((l) => { if (age < l.delay) return; const wob = s.scattered ? Math.sin(now / 900 + l.seed) * 6 : 0, wob2 = s.scattered ? Math.cos(now / 1100 + l.seed) * 6 : 0;
          let fx = K * (l.tx + wob - l.x) - C * l.vx, fy = K * (l.ty + wob2 - l.y) - C * l.vy;
          if (s.scattered && s.ptr) { const dx = l.x - s.ptr[0], dy = l.y - s.ptr[1], d = Math.hypot(dx, dy) || 1; if (d < 120) { const f = (1 - d / 120) * 9000; fx += (dx / d) * f; fy += (dy / d) * f; } }
          l.vx += fx * h; l.vy += fy * h; l.x += l.vx * h; l.y += l.vy * h; l.vr += (K * (l.tr - l.r) - C * l.vr) * h * 0.6; l.r += l.vr * h; l.sx += (l.tsx - l.sx) * Math.min(1, h * 10); }); }
      s.L.forEach((l, i) => { const e = spans.current[i]; if (e) e.style.transform = `translate(-50%, -50%) translate(${l.x.toFixed(1)}px, ${l.y.toFixed(1)}px) rotate(${l.r.toFixed(1)}deg) scaleX(${l.sx.toFixed(2)})`; });
      if (bar.current) bar.current.style.transform = `scaleX(${Math.min(1, age / dur)})`;
    };
    raf = requestAnimationFrame(frame);
    const onMove = (e) => { const r = el.getBoundingClientRect(); s.ptr = [e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2]; };
    const onLeave = () => { s.ptr = null; };
    el.addEventListener("pointermove", onMove); el.addEventListener("pointerleave", onLeave); el.addEventListener("click", toggle);
    if (hold > 0) timer = setInterval(toggle, hold * 1000 + 1400);
    return () => { cancelAnimationFrame(raf); clearInterval(timer); ro.disconnect(); el.removeEventListener("pointermove", onMove); el.removeEventListener("pointerleave", onLeave); el.removeEventListener("click", toggle); };
  }, [text, response, bounce, spread, hold]); // eslint-disable-line react-hooks/exhaustive-deps

  const fs = `clamp(30px, ${(88 / (Math.max(4, text.length) * 0.74)).toFixed(1)}cqw, 130px)`;
  return (
    <div ref={box} style={{ position: "relative", width: "100%", height: "100%", background: "#0d0d0d", overflow: "hidden", containerType: "size", cursor: "pointer", touchAction: "manipulation", userSelect: "none" }}>
      <div ref={row} aria-hidden="true" style={{ position: "absolute", left: "50%", top: "46%", transform: "translate(-50%, -50%)", display: "flex", visibility: "hidden", font: `800 ${fs}/1 "Bricolage Grotesque", "Arial Black", system-ui, sans-serif`, letterSpacing: "-.02em" }}>
        {text.split("").map((ch, i) => <span key={i}>{ch}</span>)}
      </div>
      <div style={{ position: "absolute", left: "50%", top: "46%" }}>
        {text.split("").map((ch, i) => <span key={i} ref={(n) => (spans.current[i] = n)} style={{ position: "absolute", left: 0, top: 0, color: "#fff", font: `800 ${fs}/1 "Bricolage Grotesque", "Arial Black", system-ui, sans-serif`, letterSpacing: "-.02em", willChange: "transform", whiteSpace: "pre" }}>{ch}</span>)}
      </div>
      <div ref={panel} style={{ position: "absolute", left: 12, bottom: 12, width: 132, padding: 8, borderRadius: 6, background: "#181818", boxShadow: "inset 0 0 0 1px #333", pointerEvents: "none" }}>
        <div style={{ height: 6, borderRadius: 2, background: "#2c2c2c", overflow: "hidden", marginBottom: 6 }}><div ref={bar} style={{ height: "100%", background: "#ff4a1c", transformOrigin: "left", transform: "scaleX(0)" }} /></div>
        <svg viewBox="0 0 116 40" style={{ display: "block", width: "100%" }}><line x1="2" x2="114" y1={36 - (1 / top) * 30} y2={36 - (1 / top) * 30} stroke="#454545" strokeDasharray="3 3" /><path d={path} fill="none" stroke="#ff4a1c" strokeWidth="1.6" strokeLinejoin="round" /></svg>
        <div style={{ marginTop: 4, color: "#7c7c78", font: "400 9px/1 ui-monospace, Menlo, monospace" }}>response {response.toFixed(2)}s · bounce {bounce.toFixed(2)}</div>
      </div>
      <div style={{ position: "absolute", right: 12, bottom: 12, color: "#555", font: "400 10px/1 ui-monospace, Menlo, monospace", pointerEvents: "none" }}>tap to scatter</div>
    </div>
  );
}
