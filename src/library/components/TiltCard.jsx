import React, { useRef } from "react";

/* Tilt card: a card that leans toward your pointer, with a soft light that follows it. */
export default function TiltCard({ tilt = 14, glare = 40 }) {
  const el = useRef(null);
  const move = (e) => { const r = e.currentTarget.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
    el.current.style.transform = `perspective(700px) rotateX(${-py * tilt}deg) rotateY(${px * tilt}deg) scale(1.04)`; el.current.style.setProperty("--gx", `${(px + 0.5) * 100}%`); el.current.style.setProperty("--gy", `${(py + 0.5) * 100}%`); };
  const leave = () => { el.current.style.transform = "perspective(700px) rotateX(0) rotateY(0) scale(1)"; };
  return (
    <div onPointerMove={move} onPointerLeave={leave} style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
      <div ref={el} style={{ width: "52%", aspectRatio: "3 / 4", borderRadius: 18, background: `radial-gradient(circle at var(--gx, 50%) var(--gy, 30%), rgba(255,255,255,${glare / 100}), transparent 55%), linear-gradient(150deg, #7a4dff, #ff4d8d)`, boxShadow: "0 20px 40px rgba(0,0,0,.4)", transition: "transform .25s ease-out", display: "grid", alignItems: "end", padding: 14, color: "#fff", font: "600 14px/1.2 system-ui, sans-serif" }}>Tilt</div>
    </div>
  );
}
