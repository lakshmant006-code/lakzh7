import React, { useRef, useState } from "react";

/* Slingshot: pull the ball back, let go, and it flies off and returns with a bounce. */
export default function Slingshot({ stretch = 60, bounce = 6 }) {
  const [p, setP] = useState({ x: 0, y: 0 }); const [fly, setFly] = useState(null); const start = useRef(null);
  const down = (e) => { start.current = [e.clientX, e.clientY]; e.currentTarget.setPointerCapture(e.pointerId); setFly(null); };
  const move = (e) => { if (!start.current) return; let dx = e.clientX - start.current[0], dy = e.clientY - start.current[1]; const d = Math.hypot(dx, dy); if (d > stretch) { dx *= stretch / d; dy *= stretch / d; } setP({ x: dx, y: dy }); };
  const up = () => { if (!start.current) return; start.current = null; setFly({ x: -p.x * 5, y: -p.y * 5 }); setP({ x: 0, y: 0 }); setTimeout(() => setFly(null), 380); };
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "grid", placeItems: "center", touchAction: "none" }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}><line x1="50%" y1="50%" x2={`calc(50% + ${p.x}px)`} y2={`calc(50% + ${p.y}px)`} stroke="rgba(255,255,255,.3)" strokeWidth="2" strokeLinecap="round" /></svg>
      <div onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
        style={{ width: 54, height: 54, borderRadius: "50%", background: "#fff", color: "#111", display: "grid", placeItems: "center", cursor: "grab", fontSize: 22, userSelect: "none",
          transform: fly ? `translate(${fly.x}px, ${fly.y}px) scale(.4)` : `translate(${p.x}px, ${p.y}px)`, opacity: fly ? 0 : 1,
          transition: start.current ? "none" : fly ? "transform .35s ease-in, opacity .35s" : `transform .6s cubic-bezier(.3, ${1 + bounce * 0.22}, .4, 1), opacity .2s` }}>↗</div>
    </div>
  );
}
