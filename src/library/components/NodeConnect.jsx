import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

/* Node connect: two cards, each with a port. Drag either card anywhere. Drag a wire from the first card's dot to the second. As it gets close the second card starts to
   shiver; let go on its port and the wire snaps, the card jitters for a moment, then a solid tab forms between the two. Tap the tab to undo. */
const C = { card: "#242523", line: "#363733", ink: "#E2E3DD", muted: "#a8a8a4", faint: "#83857D", accent: "#15FF00", bg: "#191A18", port: "#91948A" };
const CSS = (a, t) => `
@keyframes ncNear{0%,100%{transform:translate(0,0) rotate(0)}25%{transform:translate(calc(var(--a)*-.35px),calc(var(--a)*.2px)) rotate(-.25deg)}50%{transform:translate(calc(var(--a)*.3px),calc(var(--a)*-.25px)) rotate(.2deg)}75%{transform:translate(calc(var(--a)*-.2px),calc(var(--a)*-.15px)) rotate(.15deg)}}
@keyframes ncSnap{0%{transform:translate(0,0) rotate(0) scale(1)}9%{transform:translate(calc(var(--a)*-1px),calc(var(--a)*.5px)) rotate(-1.1deg) scale(1.12)}15%{transform:translate(calc(var(--a)*1px),calc(var(--a)*-.6px)) rotate(1deg) scale(1)}30%{transform:translate(calc(var(--a)*-.8px),calc(var(--a)*-.4px)) rotate(-.7deg)}45%{transform:translate(calc(var(--a)*.6px),calc(var(--a)*.5px)) rotate(.5deg)}65%{transform:translate(calc(var(--a)*-.3px),calc(var(--a)*.2px)) rotate(-.25deg)}100%{transform:translate(0,0) rotate(0) scale(1)}}
@keyframes ncTab{0%{stroke-dashoffset:1}100%{stroke-dashoffset:0}}
@keyframes ncRing{0%{opacity:.9;transform:translate(-50%,-50%) scale(.6)}100%{opacity:0;transform:translate(-50%,-50%) scale(2.4)}}
.nc-near{animation:ncNear .13s linear infinite}.nc-snap{animation:ncSnap ${t}s cubic-bezier(.3,.7,.4,1) both}`;

export default function NodeConnect({ shiver = 4, duration = 0.5, tab = 14 }) {
  const box = useRef(null), portA = useRef(null), portB = useRef(null), wrapA = useRef(null), wrapB = useRef(null), mv = useRef(null);
  const [phase, setPhase] = useState("idle");           // idle, dragging, connected
  const [p, setP] = useState(null);                      // wire end while dragging, in box pixels
  const [near, setNear] = useState(false);
  const [off, setOff] = useState({ a: [0, 0], b: [0, 0] });   // how far each card has been moved from its starting place
  const [, tick] = useState(0);                          // re-roll the electric jitter while it is live
  const [zap, setZap] = useState(false);                 // the sparks also fire for a moment when the connection lands
  const [snap, setSnap] = useState(0);                   // counts connects so the jitter replays each time
  const live = (phase === "dragging" && near) || phase === "connected" || zap;
  useEffect(() => { if (phase === "idle" && !zap) return undefined; let id, last = 0;
    const f = (t) => { id = requestAnimationFrame(f); if (t - last > 38) { last = t; tick((n) => n + 1); } }; id = requestAnimationFrame(f); return () => cancelAnimationFrame(id); }, [phase, zap]);
  useEffect(() => { if (!zap) return undefined; const id = setTimeout(() => setZap(false), 900); return () => clearTimeout(id); }, [zap, snap]);
  useLayoutEffect(() => { tick((n) => n + 1); }, [off]);      // the ports move with the cards: measure again before the frame is drawn
  const centre = (el) => { const r = el.getBoundingClientRect(), b = box.current.getBoundingClientRect(); return [r.left + r.width / 2 - b.left, r.top + r.height / 2 - b.top]; };

  // moving a card: grab it anywhere that is not its dot; it stays inside the canvas
  const grab = (k) => (e) => { if (e.target.dataset.port) return; const w = (k === "a" ? wrapA : wrapB).current, r = w.getBoundingClientRect(), b = box.current.getBoundingClientRect();
    w.setPointerCapture(e.pointerId); mv.current = { k, x: e.clientX, y: e.clientY, o: off[k], minX: b.left - r.left, maxX: b.right - r.right, minY: b.top - r.top, maxY: b.bottom - r.bottom }; };
  const carry = (e) => { const m = mv.current; if (!m) return; const cl = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    setOff((o) => ({ ...o, [m.k]: [m.o[0] + cl(e.clientX - m.x, m.minX, m.maxX), m.o[1] + cl(e.clientY - m.y, m.minY, m.maxY)] })); };
  const drop = () => { mv.current = null; };

  const down = (e) => { e.stopPropagation(); if (phase === "connected") return; e.currentTarget.setPointerCapture(e.pointerId); setPhase("dragging"); move(e); };
  const move = (e) => { if (phase === "idle" && !e.buttons) return; const b = box.current.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top; setP([x, y]);
    const [bx, by] = centre(portB.current); setNear(Math.hypot(x - bx, y - by) < 90); };
  const up = (e) => { if (phase !== "dragging") return; const b = box.current.getBoundingClientRect(), [bx, by] = centre(portB.current);
    if (Math.hypot(e.clientX - b.left - bx, e.clientY - b.top - by) < 40) { setPhase("connected"); setSnap((n) => n + 1); setZap(true); } else setPhase("idle"); setP(null); setNear(false); };
  const [ax, ay] = box.current && portA.current ? centre(portA.current) : [0, 0], [bx, by] = box.current && portB.current ? centre(portB.current) : [0, 0];
  const wireEnd = phase === "dragging" && p ? p : [bx, by];
  const reach = Math.max(40, Math.abs(wireEnd[0] - ax) / 2);
  const d = `M${ax} ${ay} C${ax + reach} ${ay} ${wireEnd[0] - reach} ${wireEnd[1]} ${wireEnd[0]} ${wireEnd[1]}`;
  // the wire is the bezier broken into short pieces, each nudged sideways at random: it crackles, and more so as it nears the card
  const crackle = (amp) => { const N = 46; let out = "";
    for (let i = 0; i <= N; i++) { const t = i / N, u = 1 - t, x = u * u * u * ax + 3 * u * u * t * (ax + reach) + 3 * u * t * t * (wireEnd[0] - reach) + t * t * t * wireEnd[0], y = u * u * u * ay + 3 * u * u * t * ay + 3 * u * t * t * wireEnd[1] + t * t * t * wireEnd[1];
      const k = i === 0 || i === N ? 0 : amp * (Math.random() * 2 - 1); out += `${i ? "L" : "M"}${(x + (Math.random() - 0.5) * k).toFixed(1)} ${(y + k * 0.8).toFixed(1)} `; } return out; };
  // the connected link is a bolt: the same crackling line, drawn as a shape that is a point at both ends and fat in the middle. A new one every frame, so it keeps zapping.
  const bolt = (mid) => { const N = 64, pts = [];
    for (let i = 0; i <= N; i++) { const t = i / N, u = 1 - t, x = u * u * u * ax + 3 * u * u * t * (ax + reach) + 3 * u * t * t * (bx - reach) + t * t * t * bx, y = u * u * u * ay + 3 * u * u * t * ay + 3 * u * t * t * by + t * t * t * by, k = Math.sin(Math.PI * t);
      pts.push([x, y, k]); }
    const L = [], R = [];
    pts.forEach(([x, y, k], i) => { const a = pts[Math.max(0, i - 1)], c = pts[Math.min(N, i + 1)]; let tx = c[0] - a[0], ty = c[1] - a[1]; const m = Math.hypot(tx, ty) || 1; tx /= m; ty /= m;
      const nx = -ty, ny = tx, jig = (Math.random() * 2 - 1) * 5.5 * Math.pow(k, 0.6), w = (mid / 2) * Math.pow(k, 0.85) * (0.8 + Math.random() * 0.4);
      L.push(`${(x + nx * (jig + w)).toFixed(1)} ${(y + ny * (jig + w)).toFixed(1)}`); R.push(`${(x + nx * (jig - w)).toFixed(1)} ${(y + ny * (jig - w)).toFixed(1)}`); });
    return `M${L.join("L")}L${R.reverse().join("L")}Z`; };
  // sparks: forks that fan out of the input port and two arcs along the card's edge. They zap: every frame is a new bolt, some frames are dark, some flare.
  const fork = (x, y, ang, len) => { let out = `M${x.toFixed(1)} ${y.toFixed(1)}`, px = x, py = y; const n = 5;
    for (let i = 1; i <= n; i++) { const a = ang + (Math.random() - 0.5) * 1.5, l = (len / n) * (0.5 + Math.random()); px += Math.cos(a) * l; py += Math.sin(a) * l; out += `L${px.toFixed(1)} ${py.toFixed(1)}`; } return out; };
  const sparks = (x, y) => { const j = () => (Math.random() - 0.5) * 6, r = Math.random(), power = r < 0.18 ? 0.12 : r > 0.8 ? 1 : 0.55 + Math.random() * 0.35, n = 3 + Math.floor(Math.random() * 4);
    const forks = Array.from({ length: n }, () => fork(x - 3, y, Math.PI + (Math.random() - 0.5) * 2.1, (14 + Math.random() * 30) * (power > 0.9 ? 1.5 : 1)));
    return { power, forks, arcUp: `M${x - 1} ${y - 7} C${x - 6 + j()} ${y - 18} ${x - 6 + j()} ${y - 32} ${x + 12 + j()} ${y - 44 + j()}`, arcDown: `M${x - 1} ${y + 7} C${x - 6 + j()} ${y + 18} ${x - 6 + j()} ${y + 32} ${x + 12 + j()} ${y + 44 + j()}` }; };
  const sp = live ? sparks(bx, by) : null;

  const bar = (w, v) => <div style={{ marginTop: v ? 5 : 10, height: 5, borderRadius: 3, background: v ? "#2D2F2A" : "#343530", width: w }} />;
  const card = (k, title, sub, side, extra, cls) => (
    <div ref={k === "a" ? wrapA : wrapB} onPointerDown={grab(k)} onPointerMove={carry} onPointerUp={drop} onPointerCancel={drop}
      style={{ position: "absolute", top: "50%", [side]: "7%", width: "36%", minWidth: 110, marginTop: -44, height: 88, transform: `translate(${off[k][0]}px, ${off[k][1]}px)`, cursor: "grab", touchAction: "none", zIndex: 2 }}>
      <div className={cls} key={k === "b" ? snap : undefined} style={{ "--a": shiver, width: "100%", height: "100%", boxSizing: "border-box", padding: 12, borderRadius: 11, background: C.card, boxShadow: `inset 0 0 0 1px ${extra ? C.accent : C.line}, 0 8px 18px rgba(0,0,0,.24)`, font: "500 11.5px/1.3 system-ui, sans-serif", color: C.ink, transition: "box-shadow .2s" }}>
        <div>{title}</div><div style={{ marginTop: 3, color: C.faint, fontWeight: 400, fontSize: 11 }}>{sub}</div>{bar("70%", 0)}{bar("46%", 1)}
      </div>
      {k === "a"
        ? <div ref={portA} data-port="1" role="button" aria-label="Output port: drag to the other card" onPointerDown={down} onPointerMove={phase === "dragging" ? move : undefined} onPointerUp={up} onPointerCancel={up} style={port("right", phase === "connected")} />
        : <div ref={portB} data-port="1" aria-hidden="true" style={port("left", phase === "connected")} />}
    </div>
  );
  const port = (side, on) => ({ position: "absolute", top: "50%", [side]: -7, width: 14, height: 14, marginTop: -7, borderRadius: "50%", boxSizing: "border-box", background: on ? C.accent : C.bg, border: `1.4px solid ${on ? C.accent : C.port}`, cursor: side === "right" ? "crosshair" : "default", transition: "background .2s, border-color .2s, transform .2s", transform: on ? "scale(1.15)" : near && side === "left" ? "scale(1.5)" : "none", zIndex: 3, touchAction: "none" });
  return (
    <div ref={box} onPointerMove={phase === "dragging" ? move : undefined} style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", touchAction: "none", userSelect: "none", background: `${C.bg} radial-gradient(circle, rgba(49,50,44,.9) 1px, transparent 1.4px) 17px 0 / 24px 24px` }}>
      <style>{CSS(shiver, duration)}</style>
      {card("a", "Trigger", "On press", "left", false, "")}
      {card("b", "Action", "Spring scale", "right", phase === "connected" || near, phase === "connected" ? "nc-snap" : near ? "nc-near" : "")}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 4, overflow: "visible" }}>
        {phase === "dragging" && p && <path d={crackle(near ? 5 : 2.4)} fill="none" stroke={C.accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 3px rgba(21,255,0,.55))" }} />}
        {phase === "connected" && <g key={snap}>
          <path d={bolt(tab * 1.5)} fill={C.accent} stroke={C.accent} strokeWidth="1" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 7px rgba(21,255,0,.75))" }} />
          <path d={bolt(tab * 0.45)} fill="#eaffe6" opacity=".85" />
          <path d={d} fill="none" stroke="transparent" strokeWidth="26" strokeLinecap="round" role="button" aria-label="Connected. Tap to disconnect" onClick={() => setPhase("idle")} style={{ pointerEvents: "stroke", cursor: "pointer" }} />
        </g>}
        {sp && <g fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={sp.power}>
          <path d={sp.arcUp} stroke="rgba(21,255,0,.3)" strokeWidth="6" style={{ filter: "blur(2px)" }} /><path d={sp.arcDown} stroke="rgba(21,255,0,.3)" strokeWidth="6" style={{ filter: "blur(2px)" }} />
          <path d={sp.arcUp} stroke="rgba(21,255,0,.55)" strokeWidth="1" strokeDasharray="2 3" /><path d={sp.arcDown} stroke="rgba(21,255,0,.55)" strokeWidth="1" strokeDasharray="2 3" />
          {sp.forks.map((f, i) => <g key={i}><path d={f} stroke={C.accent} strokeWidth="1.8" style={{ filter: "drop-shadow(0 0 4px rgba(21,255,0,.8))" }} /><path d={f} stroke="#eaffe6" strokeWidth=".6" opacity=".8" /></g>)}
        </g>}
      </svg>
      {phase === "connected" && <i key={"r" + snap} style={{ position: "absolute", left: bx, top: by, width: 40, height: 40, borderRadius: "50%", border: `2px solid ${C.accent}`, animation: "ncRing .6s ease-out both", pointerEvents: "none", zIndex: 5 }} />}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 10, textAlign: "center", color: C.faint, font: "400 10.5px/1 ui-monospace, Menlo, monospace", pointerEvents: "none" }}>{phase === "connected" ? "connected · tap the wire to undo" : "drag the cards · drag from the dot"}</div>
    </div>
  );
}
