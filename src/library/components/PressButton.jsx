import React, { useState } from "react";

/* Press button: a chunky key that sinks when you press it and springs back. */
export default function PressButton({ depth = 8, squish = 4, label = "Press me" }) {
  const [down, setDown] = useState(false);
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
      <button type="button" onPointerDown={() => setDown(true)} onPointerUp={() => setDown(false)} onPointerLeave={() => setDown(false)} onPointerCancel={() => setDown(false)}
        style={{ all: "unset", cursor: "pointer", padding: "16px 30px", borderRadius: 16, background: "linear-gradient(#ffd84d, #f5b700)", color: "#3a2800", font: "600 15px/1 system-ui, sans-serif", userSelect: "none", touchAction: "manipulation",
          boxShadow: down ? `0 1px 0 #b98200, 0 3px 10px rgba(0,0,0,.35)` : `0 ${depth}px 0 #b98200, 0 ${depth + 8}px 20px rgba(0,0,0,.35)`,
          transform: down ? `translateY(${depth - 1}px) scale(${1 + squish * 0.008}, ${1 - squish * 0.012})` : "none", transition: down ? "transform .06s, box-shadow .06s" : "transform .35s cubic-bezier(.3, 2, .5, 1), box-shadow .35s cubic-bezier(.3, 2, .5, 1)" }}>{label}</button>
    </div>
  );
}
