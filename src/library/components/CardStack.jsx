import React, { useRef, useState } from "react";

/* Card stack: a small fan of cards. Drag the top one away and let go; it springs back under the pile. */
const COLORS = [["#ff6b6b", "#ffd36b"], ["#6b8bff", "#6bf0ff"], ["#b36bff", "#ff6bd0"], ["#2fd39a", "#c6ff6b"], ["#ff9a4d", "#ff4d8d"], ["#4dc6ff", "#7a4dff"]];

export default function CardStack({ cards = 4, spread = 18, corner = 14, bounce = 5 }) {
  const [order, setOrder] = useState(() => Array.from({ length: 6 }, (_, i) => i));
  const [drag, setDrag] = useState(null);
  const start = useRef(null);
  const shown = order.slice(0, cards);
  const down = (e) => { start.current = [e.clientX, e.clientY]; e.currentTarget.setPointerCapture(e.pointerId); setDrag({ x: 0, y: 0 }); };
  const move = (e) => { if (start.current) setDrag({ x: e.clientX - start.current[0], y: e.clientY - start.current[1] }); };
  const up = () => { if (!start.current) return; const far = drag && Math.hypot(drag.x, drag.y) > 90; start.current = null; setDrag(null); if (far) setOrder((o) => [...o.slice(1), o[0]]); };
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "grid", placeItems: "center", touchAction: "none" }}>
      {shown.map((id, k) => {
        const top = k === 0, d = top && drag ? drag : { x: 0, y: 0 };
        const depth = shown.length - 1 - k, rot = (k % 2 ? 1 : -1) * k * (spread / 4);
        return (
          <div key={id} onPointerDown={top ? down : undefined} onPointerMove={top ? move : undefined} onPointerUp={top ? up : undefined} onPointerCancel={top ? up : undefined}
            style={{ position: "absolute", width: "46%", aspectRatio: "3 / 4", borderRadius: corner, background: `linear-gradient(145deg, ${COLORS[id][0]}, ${COLORS[id][1]})`, cursor: top ? "grab" : "default",
              boxShadow: "0 14px 30px rgba(0,0,0,.35)", border: "3px solid rgba(255,255,255,.9)", zIndex: depth,
              transform: `translate(${d.x + k * spread}px, ${d.y - k * spread * 0.4}px) rotate(${rot + d.x * 0.05}deg) scale(${1 - k * 0.03})`,
              transition: drag && top ? "none" : `transform .55s cubic-bezier(.3, ${1 + bounce * 0.18}, .4, 1)` }} />
        );
      })}
    </div>
  );
}
