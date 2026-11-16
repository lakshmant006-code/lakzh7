import React, { useRef, useState } from "react";

/* Swipe to confirm: drag the handle all the way across; let go early and it slides back. */
export default function SwipeToConfirm({ threshold = 85, label = "Slide to confirm" }) {
  const [x, setX] = useState(0); const [done, setDone] = useState(false); const box = useRef(null); const drag = useRef(false);
  const max = () => (box.current ? box.current.clientWidth - 52 : 200);
  const move = (e) => { if (!drag.current) return; const r = box.current.getBoundingClientRect(); setX(Math.max(0, Math.min(max(), e.clientX - r.left - 26))); };
  const up = () => { drag.current = false; if (x / max() * 100 >= threshold) { setX(max()); setDone(true); setTimeout(() => { setDone(false); setX(0); }, 1400); } else setX(0); };
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", touchAction: "none" }}>
      <div ref={box} style={{ position: "relative", width: "84%", maxWidth: 300, height: 52, borderRadius: 26, background: done ? "#1f9d55" : "#222225", transition: "background .3s", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "#999", font: "500 13px/1 system-ui, sans-serif", opacity: done ? 0 : 1 - x / max() }}>{label}</div>
        {done && <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "#fff", font: "600 13px/1 system-ui, sans-serif" }}>Confirmed ✓</div>}
        <div onPointerDown={(e) => { drag.current = true; e.currentTarget.setPointerCapture(e.pointerId); }} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
          style={{ position: "absolute", left: 4, top: 4, width: 44, height: 44, borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center", cursor: "grab", color: "#111", transform: `translateX(${x}px)`, transition: drag.current ? "none" : "transform .45s cubic-bezier(.3, 1.4, .5, 1)" }}>→</div>
      </div>
    </div>
  );
}
