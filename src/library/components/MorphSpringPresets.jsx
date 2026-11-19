import React, { useEffect, useRef, useState } from "react";

/* From MORPH: one-click feels. Pick Gentle, Snappy, Bouncy or Stiff and a ball runs along a rail on that exact spring, while the curve below
   shows its response. Each feel is a stiffness and a damping (mass 1): MORPH's own presets. */
const M = { base: "#181818", surface: "#242424", raised: "#2c2c2c", elevated: "#363636", line: "#333", strong: "#454545", accent: "#e68a42", ink: "#f5f5f3", muted: "#a8a8a4", faint: "#7c7c78" };
const FEELS = { Gentle: [120, 20], Snappy: [400, 32], Bouncy: [260, 12], Stiff: [700, 54] };   // MORPH's presets: [stiffness, damping], mass 1
const curveOf = (k, c) => { const o = []; let x = 0, v = 0; for (let i = 0; i < 300; i++) { v += (-k * (x - 1) - c * v) / 120; x += v / 120; o.push(x); if (i > 20 && Math.abs(x - 1) < 0.004 && Math.abs(v) < 0.05) break; } return o; };

export default function MorphSpringPresets({ distance = 70 }) {
  const [feel, setFeel] = useState("Bouncy"), [round, setRound] = useState(0);
  const ball = useRef(null), dot = useRef(null);
  const [k, c] = FEELS[feel], curve = curveOf(k, c), top = Math.max(1.2, ...curve);
  const path = curve.map((y, i) => `${i ? "L" : "M"}${(2 + (i / (curve.length - 1)) * 196).toFixed(1)} ${(46 - (y / top) * 40).toFixed(1)}`).join(" ");
  useEffect(() => {
    let raf, x = 0, v = 0, target = 1, last = performance.now(), idx = 0, flip = 0;
    const tick = (now) => { raf = requestAnimationFrame(tick); let dt = Math.min(0.05, (now - last) / 1000); last = now;
      while (dt > 0) { const h = Math.min(dt, 1 / 120); dt -= h; v += (-k * (x - target) - c * v) * h; x += v * h; }
      ball.current && (ball.current.style.transform = `translateX(${(x * distance * 2.2).toFixed(1)}px)`);
      if (Math.abs(x - target) < 0.004 && Math.abs(v) < 0.05 && now - flip > 700) { target = target ? 0 : 1; flip = now; }
      idx = Math.min(curve.length - 1, Math.round(((now % 1600) / 1600) * (curve.length - 1))); dot.current?.setAttribute("cx", 2 + (idx / (curve.length - 1)) * 196); dot.current?.setAttribute("cy", 46 - (curve[idx] / top) * 40); };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [k, c, round, distance]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
      <div style={{ width: "88%", maxWidth: 340, display: "grid", gap: 10 }}>
        <div role="radiogroup" aria-label="Feel" style={{ display: "flex", gap: 2, padding: 2, borderRadius: 6, background: M.raised }}>
          {Object.keys(FEELS).map((f) => <button key={f} role="radio" aria-checked={feel === f} onClick={() => { setFeel(f); setRound((n) => n + 1); }} style={{ all: "unset", cursor: "pointer", flex: 1, textAlign: "center", padding: "7px 0", borderRadius: 4, font: "400 12px/1 system-ui, sans-serif", background: feel === f ? M.elevated : "transparent", color: feel === f ? M.ink : M.muted, transition: "background .15s, color .15s" }}>{f}</button>)}
        </div>
        <div style={{ position: "relative", height: 54, borderRadius: 6, background: M.base, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 14, right: 14, top: 26, height: 1, background: M.strong }} />
          <div ref={ball} style={{ position: "absolute", left: 14, top: 15, width: 24, height: 24, borderRadius: "50%", background: M.accent }} />
        </div>
        <svg viewBox="0 0 200 52" style={{ display: "block", width: "100%", borderRadius: 6, background: M.base }}><line x1="2" x2="198" y1={46 - (1 / top) * 40} y2={46 - (1 / top) * 40} stroke={M.strong} strokeDasharray="3 3" /><path d={path} fill="none" stroke={M.accent} strokeWidth="1.6" strokeLinejoin="round" /><circle ref={dot} r="2.6" cx="2" cy="46" fill={M.ink} /></svg>
        <div style={{ color: M.faint, font: "400 11px/1 ui-monospace, Menlo, monospace" }}>stiffness {k} · damping {c} · mass 1</div>
      </div>
    </div>
  );
}
