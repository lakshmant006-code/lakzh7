import React, { useRef, useState } from "react";

/* Node connect: two cards, each with a port. Drag a wire from the first card to the second. As it gets close the second card starts to
   shiver; let go on its port and the wire snaps, the card jitters for a moment, then a solid tab forms between the two. Tap the tab to undo. */
const C = { card: "#242424", line: "#3a3a3a", ink: "#f5f5f3", muted: "#a8a8a4", faint: "#7c7c78", accent: "#e68a42" };
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
  const [snap, setSnap] = useState(0);                   // counts connects so the jitter replays each time
  const centre = (el) => { const r = el.getBoundingClientRect(), b = box.current.getBoundingClientRect(); return [r.left + r.width / 2 - b.left, r.top + r.height / 2 - b.top]; };
  const down = (e) => { if (phase === "connected") return; e.currentTarget.setPointerCapture(e.pointerId); setPhase("dragging"); move(e); };
  const move = (e) => { if (phase === "idle" && !e.buttons) return; const b = box.current.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top; setP([x, y]);
    const [bx, by] = centre(portB.current); setNear(Math.hypot(x - bx, y - by) < 90); };
  const up = (e) => { if (phase !== "dragging") return; const b = box.current.getBoundingClientRect(), [bx, by] = centre(portB.current);
    if (Math.hypot(e.clientX - b.left - bx, e.clientY - b.top - by) < 40) { setPhase("connected"); setSnap((n) => n + 1); } else setPhase("idle"); setP(null); setNear(false); };
  const [ax, ay] = box.current && portA.current ? centre(portA.current) : [0, 0], [bx, by] = box.current && portB.current ? centre(portB.current) : [0, 0];
  const wireEnd = phase === "dragging" && p ? p : [bx, by];
  const d = `M${ax} ${ay} C${ax + Math.max(40, Math.abs(wireEnd[0] - ax) / 2)} ${ay} ${wireEnd[0] - Math.max(40, Math.abs(wireEnd[0] - ax) / 2)} ${wireEnd[1]} ${wireEnd[0]} ${wireEnd[1]}`;
  const card = (title, sub, side, cls) => (
    <div className={cls} style={{ "--a": shiver, position: "absolute", top: "50%", [side]: "7%", width: "36%", minWidth: 110, marginTop: -44, height: 88, boxSizing: "border-box", padding: 12, borderRadius: 10, background: C.card, boxShadow: `inset 0 0 0 1px ${C.line}, 0 10px 24px rgba(0,0,0,.35)`, font: "500 12px/1.3 system-ui, sans-serif", color: C.ink }}>
      <div>{title}</div><div style={{ marginTop: 3, color: C.faint, fontWeight: 400, fontSize: 11 }}>{sub}</div>
      <div style={{ marginTop: 10, height: 5, borderRadius: 3, background: "#333", width: "70%" }} /><div style={{ marginTop: 5, height: 5, borderRadius: 3, background: "#2d2d2d", width: "46%" }} />
    </div>
  );
  const portStyle = (side, on) => ({ position: "absolute", top: "50%", [side]: -7, width: 14, height: 14, marginTop: -7, borderRadius: "50%", boxSizing: "border-box", background: on ? C.accent : "#1c1c1c", border: `2px solid ${on ? C.accent : "#8a8a85"}`, cursor: side === "right" ? "crosshair" : "default", transition: "background .2s, border-color .2s, transform .2s", transform: on ? "scale(1.15)" : near && side === "left" ? "scale(1.5)" : "none", zIndex: 3, touchAction: "none" });
  return (
    <div ref={box} onPointerMove={phase === "dragging" ? move : undefined} style={{ position: "relative", width: "100%", height: "100%", touchAction: "none", userSelect: "none" }}>
      <style>{CSS(shiver, duration)}</style>
      <div style={{ position: "absolute", inset: 0 }}>
        <div style={{ position: "absolute", top: "50%", left: "7%", width: "36%", minWidth: 110 }} />
        {card("Trigger", "On press", "left", "")}
        <div className={phase === "connected" ? "nc-snap" : near ? "nc-near" : ""} key={snap} style={{ "--a": shiver, position: "absolute", top: "50%", right: "7%", width: "36%", minWidth: 110, marginTop: -44, height: 88, boxSizing: "border-box", padding: 12, borderRadius: 10, background: C.card, boxShadow: `inset 0 0 0 1px ${phase === "connected" || near ? C.accent : C.line}, 0 10px 24px rgba(0,0,0,.35)`, font: "500 12px/1.3 system-ui, sans-serif", color: C.ink, transition: "box-shadow .2s" }}>
          <div>Action</div><div style={{ marginTop: 3, color: C.faint, fontWeight: 400, fontSize: 11 }}>Spring scale</div>
          <div style={{ marginTop: 10, height: 5, borderRadius: 3, background: "#333", width: "70%" }} /><div style={{ marginTop: 5, height: 5, borderRadius: 3, background: "#2d2d2d", width: "46%" }} />
        </div>
      </div>
      <div ref={portA} role="button" aria-label="Output port: drag to the other card" onPointerDown={down} onPointerMove={phase === "dragging" ? move : undefined} onPointerUp={up} onPointerCancel={up}
        style={{ ...portStyle("right", phase === "connected"), position: "absolute", left: "calc(7% + max(36%, 110px) - 7px)", right: "auto", top: "50%" }} />
      <div ref={portB} aria-hidden="true" style={{ ...portStyle("left", phase === "connected"), position: "absolute", right: "calc(7% + max(36%, 110px) - 7px)", left: "auto", top: "50%" }} />
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2, overflow: "visible" }}>
        {phase === "dragging" && p && <path d={d} fill="none" stroke={near ? C.accent : "#8a8a85"} strokeWidth="2" strokeLinecap="round" strokeDasharray={near ? "0" : "5 5"} />}
      </svg>
      {phase === "connected" && <>
        <div key={snap} role="button" aria-label="Connected. Tap to disconnect" onClick={() => { setPhase("idle"); }} style={{ position: "absolute", left: ax, top: ay - tab / 2, width: Math.max(0, bx - ax), height: tab, borderRadius: tab / 2, background: `linear-gradient(${C.accent}, #c9742f)`, boxShadow: "0 4px 14px rgba(230,138,66,.35), inset 0 1px 0 rgba(255,255,255,.35)", transformOrigin: "left center", animation: "ncTab .32s cubic-bezier(.3,1.4,.5,1) both", cursor: "pointer", zIndex: 1 }} />
        <i key={"r" + snap} style={{ position: "absolute", left: bx, top: by, width: 40, height: 40, borderRadius: "50%", border: `2px solid ${C.accent}`, animation: "ncRing .6s ease-out both", pointerEvents: "none", zIndex: 4 }} />
      </>}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 10, textAlign: "center", color: C.faint, font: "400 10.5px/1 ui-monospace, Menlo, monospace", pointerEvents: "none" }}>{phase === "connected" ? "connected · tap the tab to undo" : "drag from the dot"}</div>
    </div>
  );
}
