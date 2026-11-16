import React, { useEffect, useMemo, useRef, useState } from "react";

/* From MORPH: the response curve of a damped spring. Change Response and Bounce and watch the motion play back,
   a dot riding the curve while a second dot on the rail moves the way a layer would. Click the plot to replay. */
const M = { base: "#181818", line: "#333333", strong: "#454545", accent: "#e68a42", ink: "#f5f5f3", faint: "#7c7c78", muted: "#a8a8a4" };
const W = 260, H = 84, PX = 2, PT = 6, PB = 14, RAIL = 16;

function simulate(k, c, m = 1) {
  const dt = 1 / 120, out = []; let x = 0, v = 0, t = 0, peak = 0, settle = null;
  for (let i = 0; i < 720; i++) { const a = (-k * (x - 1) - c * v) / m; v += a * dt; x += v * dt; t += dt; out.push([t, x]); peak = Math.max(peak, x);
    if (Math.abs(x - 1) < 0.01 && Math.abs(v) < 0.1) { if (settle === null) settle = t; if (t > settle + 0.2) break; } else settle = null; }
  return { samples: out, peak, settle, duration: out[out.length - 1][0] };
}

export default function MorphSpringCurve({ response = 0.45, bounce = 0.25 }) {
  const k = (2 * Math.PI / response) ** 2, c = (1 - bounce) * 2 * Math.sqrt(k);          // response (seconds) and bounce (0 to 1) as a designer thinks of them
  const r = useMemo(() => simulate(k, c), [k, c]);
  const dot = useRef(null), bob = useRef(null); const [run, setRun] = useState(0);
  const top = Math.max(1.25, r.peak * 1.06), pw = W - PX * 2 - RAIL, ph = H - PT - PB, railX = W - RAIL / 2 - PX + 1;
  const toX = (t) => PX + (t / r.duration) * pw, toY = (p) => PT + ph * (1 - Math.max(0, p) / top);
  const path = r.samples.map(([t, p], i) => `${i ? "L" : "M"}${toX(t).toFixed(1)} ${toY(p).toFixed(1)}`).join(" ");
  useEffect(() => {
    let raf; const t0 = performance.now();
    const tick = (now) => { const t = Math.max(0, Math.min(r.duration, (now - t0) / 1000)), i = Math.min(r.samples.length - 1, Math.round((t / r.duration) * (r.samples.length - 1))), y = toY(r.samples[i][1]);
      dot.current?.setAttribute("cx", toX(t)); dot.current?.setAttribute("cy", y); bob.current?.setAttribute("cy", y); if (t < r.duration) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [r, run]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <figure style={{ margin: 0, width: "88%", maxWidth: 340 }}>
      <button onClick={() => setRun((n) => n + 1)} aria-label="Replay the motion" style={{ all: "unset", display: "block", width: "100%", cursor: "pointer", borderRadius: 6, background: M.base }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ display: "block", width: "100%" }}>
          <line x1={PX} x2={PX + pw} y1={toY(1)} y2={toY(1)} stroke={M.strong} strokeDasharray="3 3" />
          <line x1={PX} x2={PX + pw} y1={toY(0)} y2={toY(0)} stroke={M.line} />
          {r.settle && <line x1={toX(r.settle)} x2={toX(r.settle)} y1={PT} y2={toY(0)} stroke={M.strong} />}
          <path d={path} fill="none" stroke={M.accent} strokeWidth="1.75" strokeLinejoin="round" />
          <circle ref={dot} r="2.75" cx={toX(0)} cy={toY(0)} fill={M.ink} />
          <line x1={railX} x2={railX} y1={PT} y2={toY(0)} stroke={M.strong} /><line x1={railX - 4} x2={railX + 4} y1={toY(1)} y2={toY(1)} stroke={M.faint} />
          <circle ref={bob} r="4" cx={railX} cy={toY(0)} fill={M.accent} />
          <text x={PX + 2} y={H - 3} fill={M.faint} fontSize="9" fontFamily="ui-monospace, monospace">0s</text>
          <text x={PX + pw - 2} y={H - 3} textAnchor="end" fill={M.faint} fontSize="9" fontFamily="ui-monospace, monospace">{r.duration.toFixed(2)}s</text>
        </svg>
      </button>
      <figcaption style={{ marginTop: 6, color: M.muted, font: "400 11px/1.3 ui-monospace, Menlo, monospace" }}>{r.settle ? `settles in ${r.settle.toFixed(2)}s` : "does not settle"} · {r.peak > 1.005 ? `overshoots ${Math.round((r.peak - 1) * 100)}%` : "no overshoot"}</figcaption>
    </figure>
  );
}
