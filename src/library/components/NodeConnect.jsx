import React, { useEffect, useRef, useState } from "react";

/* Node connect: two cards, each with a port. Drag a wire from the first card to the second. As it gets close the second card starts to
   shiver; let go on its port and the wire snaps, the card jitters for a moment, then a solid tab forms between the two. Tap the tab to undo. */
const C = { card: "#242523", line: "#363733", ink: "#E2E3DD", muted: "#a8a8a4", faint: "#83857D", accent: "#15FF00", bg: "#191A18", port: "#91948A" };
const CSS = (a, t) => `
@keyframes ncNear{0%,100%{transform:translate(0,0) rotate(0)}25%{transform:translate(calc(var(--a)*-.35px),calc(var(--a)*.2px)) rotate(-.25deg)}50%{transform:translate(calc(var(--a)*.3px),calc(var(--a)*-.25px)) rotate(.2deg)}75%{transform:translate(calc(var(--a)*-.2px),calc(var(--a)*-.15px)) rotate(.15deg)}}
@keyframes ncSnap{0%{transform:translate(0,0) rotate(0) scale(1)}12%{transform:translate(calc(var(--a)*-1px),calc(var(--a)*.5px)) rotate(-1.1deg) scale(1.03)}26%{transform:translate(calc(var(--a)*1px),calc(var(--a)*-.6px)) rotate(1deg) scale(1.02)}40%{transform:translate(calc(var(--a)*-.8px),calc(var(--a)*-.4px)) rotate(-.7deg)}55%{transform:translate(calc(var(--a)*.6px),calc(var(--a)*.5px)) rotate(.5deg)}72%{transform:translate(calc(var(--a)*-.3px),calc(var(--a)*.2px)) rotate(-.25deg)}100%{transform:translate(0,0) rotate(0) scale(1)}}
@keyframes ncTab{0%{transform:scaleX(0)}70%{transform:scaleX(1.04)}100%{transform:scaleX(1)}}
@keyframes ncRing{0%{opacity:.9;transform:translate(-50%,-50%) scale(.6)}100%{opacity:0;transform:translate(-50%,-50%) scale(2.4)}}
.nc-near{animation:ncNear .13s linear infinite}.nc-snap{animation:ncSnap ${t}s cubic-bezier(.3,.7,.4,1) both}`;

export default function NodeConnect({ shiver = 4, duration = 0.5, tab = 14 }) {
  const box = useRef(null), portA = useRef(null), portB = useRef(null);
  const [phase, setPhase] = useState("idle");           // idle, dragging, connected
  const [p, setP] = useState(null);                      // wire end while dragging, in box pixels
  const [near, setNear] = useState(false);
  const [, tick] = useState(0);                          // re-roll the electric jitter on the wire while dragging
  const [snap, setSnap] = useState(0);                   // counts connects so the jitter replays each time
  useEffect(() => { if (phase !== "dragging") return undefined; let id, last = 0;
    const f = (t) => { id = requestAnimationFrame(f); if (t - last > 45) { last = t; tick((n) => n + 1); } }; id = requestAnimationFrame(f); return () => cancelAnimationFrame(id); }, [phase]);
  const centre = (el) => { const r = el.getBoundingClientRect(), b = box.current.getBoundingClientRect(); return [r.left + r.width / 2 - b.left, r.top + r.height / 2 - b.top]; };
  const down = (e) => { if (phase === "connected") return; e.currentTarget.setPointerCapture(e.pointerId); setPhase("dragging"); move(e); };
  const move = (e) => { if (phase === "idle" && !e.buttons) return; const b = box.current.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top; setP([x, y]);
    const [bx, by] = centre(portB.current); setNear(Math.hypot(x - bx, y - by) < 90); };
  const up = (e) => { if (phase !== "dragging") return; const b = box.current.getBoundingClientRect(), [bx, by] = centre(portB.current);
    if (Math.hypot(e.clientX - b.left - bx, e.clientY - b.top - by) < 40) { setPhase("connected"); setSnap((n) => n + 1); } else setPhase("idle"); setP(null); setNear(false); };
  const [ax, ay] = box.current && portA.current ? centre(portA.current) : [0, 0], [bx, by] = box.current && portB.current ? centre(portB.current) : [0, 0];
  const wireEnd = phase === "dragging" && p ? p : [bx, by];
  const d = `M${ax} ${ay} C${ax + Math.max(40, Math.abs(wireEnd[0] - ax) / 2)} ${ay} ${wireEnd[0] - Math.max(40, Math.abs(wireEnd[0] - ax) / 2)} ${wireEnd[1]} ${wireEnd[0]} ${wireEnd[1]}`;
  // the wire is the bezier broken into short pieces, each nudged sideways at random: it crackles, and more so as it nears the card
  const crackle = (x0, y0, c1x, c1y, c2x, c2y, x1, y1, amp) => { const N = 46; let out = "";
    for (let i = 0; i <= N; i++) { const t = i / N, u = 1 - t, x = u * u * u * x0 + 3 * u * u * t * c1x + 3 * u * t * t * c2x + t * t * t * x1, y = u * u * u * y0 + 3 * u * u * t * c1y + 3 * u * t * t * c2y + t * t * t * y1;
      const k = i === 0 || i === N ? 0 : amp * (Math.random() * 2 - 1); out += `${i ? "L" : "M"}${(x + (Math.random() - 0.5) * k).toFixed(1)} ${(y + k * 0.8).toFixed(1)} `; } return out; };
  const card = (title, sub, side, cls) => (
    <div className={cls} style={{ "--a": shiver, position: "absolute", top: "50%", [side]: "7%", width: "36%", minWidth: 110, marginTop: -44, height: 88, boxSizing: "border-box", padding: 12, borderRadius: 11, background: C.card, boxShadow: `inset 0 0 0 1px ${C.line}, 0 8px 18px rgba(0,0,0,.24)`, font: "500 11.5px/1.3 system-ui, sans-serif", color: C.ink }}>
      <div>{title}</div><div style={{ marginTop: 3, color: C.faint, fontWeight: 400, fontSize: 11 }}>{sub}</div>
      <div style={{ marginTop: 10, height: 5, borderRadius: 3, background: "#343530", width: "70%" }} /><div style={{ marginTop: 5, height: 5, borderRadius: 3, background: "#2D2F2A", width: "46%" }} />
    </div>
  );
  const portStyle = (side, on) => ({ position: "absolute", top: "50%", [side]: -7, width: 14, height: 14, marginTop: -7, borderRadius: "50%", boxSizing: "border-box", background: on ? C.accent : C.bg, border: `1.4px solid ${on ? C.accent : C.port}`, cursor: side === "right" ? "crosshair" : "default", transition: "background .2s, border-color .2s, transform .2s", transform: on ? "scale(1.15)" : near && side === "left" ? "scale(1.5)" : "none", zIndex: 3, touchAction: "none" });
  return (
    <div ref={box} onPointerMove={phase === "dragging" ? move : undefined} style={{ position: "relative", width: "100%", height: "100%", touchAction: "none", userSelect: "none", background: `${C.bg} radial-gradient(circle, rgba(49,50,44,.9) 1px, transparent 1.4px) 17px 0 / 24px 24px` }}>
      <style>{CSS(shiver, duration)}</style>
      <div style={{ position: "absolute", inset: 0 }}>
        <div style={{ position: "absolute", top: "50%", left: "7%", width: "36%", minWidth: 110 }} />
        {card("Trigger", "On press", "left", "")}
        <div className={phase === "connected" ? "nc-snap" : near ? "nc-near" : ""} key={snap} style={{ "--a": shiver, position: "absolute", top: "50%", right: "7%", width: "36%", minWidth: 110, marginTop: -44, height: 88, boxSizing: "border-box", padding: 12, borderRadius: 11, background: C.card, boxShadow: `inset 0 0 0 1px ${phase === "connected" || near ? C.accent : C.line}, 0 8px 18px rgba(0,0,0,.24)`, font: "500 11.5px/1.3 system-ui, sans-serif", color: C.ink, transition: "box-shadow .2s" }}>
          <div>Action</div><div style={{ marginTop: 3, color: C.faint, fontWeight: 400, fontSize: 11 }}>Spring scale</div>
          <div style={{ marginTop: 10, height: 5, borderRadius: 3, background: "#343530", width: "70%" }} /><div style={{ marginTop: 5, height: 5, borderRadius: 3, background: "#2D2F2A", width: "46%" }} />
        </div>
      </div>
      <div ref={portA} role="button" aria-label="Output port: drag to the other card" onPointerDown={down} onPointerMove={phase === "dragging" ? move : undefined} onPointerUp={up} onPointerCancel={up}
        style={{ ...portStyle("right", phase === "connected"), position: "absolute", left: "calc(7% + max(36%, 110px) - 7px)", right: "auto", top: "50%" }} />
      <div ref={portB} aria-hidden="true" style={{ ...portStyle("left", phase === "connected"), position: "absolute", right: "calc(7% + max(36%, 110px) - 7px)", left: "auto", top: "50%" }} />
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2, overflow: "visible" }}>
        {phase === "dragging" && p && <path d={crackle(ax, ay, ax + Math.max(40, Math.abs(wireEnd[0] - ax) / 2), ay, wireEnd[0] - Math.max(40, Math.abs(wireEnd[0] - ax) / 2), wireEnd[1], wireEnd[0], wireEnd[1], near ? 5 : 2.4)} fill="none" stroke={C.accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 3px rgba(21,255,0,.55))" }} />}
      </svg>
      {phase === "connected" && <>
        <div key={snap} role="button" aria-label="Connected. Tap to disconnect" onClick={() => { setPhase("idle"); }} style={{ position: "absolute", left: ax, top: ay - tab / 2, width: Math.max(0, bx - ax), height: tab, borderRadius: tab / 2, background: `linear-gradient(${C.accent}, #0fd100)`, boxShadow: "0 4px 14px rgba(21,255,0,.35), inset 0 1px 0 rgba(255,255,255,.35)", transformOrigin: "left center", animation: "ncTab .32s cubic-bezier(.3,1.4,.5,1) both", cursor: "pointer", zIndex: 1 }} />
        <i key={"r" + snap} style={{ position: "absolute", left: bx, top: by, width: 40, height: 40, borderRadius: "50%", border: `2px solid ${C.accent}`, animation: "ncRing .6s ease-out both", pointerEvents: "none", zIndex: 4 }} />
      </>}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 10, textAlign: "center", color: C.faint, font: "400 10.5px/1 ui-monospace, Menlo, monospace", pointerEvents: "none" }}>{phase === "connected" ? "connected · tap the tab to undo" : "drag from the dot"}</div>
    </div>
  );
}
