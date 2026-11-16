import React, { useState } from "react";

/* Segmented pill: pick one option and a pill slides under it. */
const OPTIONS = ["Day", "Week", "Month", "Year"];

export default function SegmentedPill({ radius = 12, speed = 4 }) {
  const [i, setI] = useState(1);
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
      <div role="tablist" style={{ position: "relative", display: "grid", gridTemplateColumns: `repeat(${OPTIONS.length}, 1fr)`, padding: 4, borderRadius: radius + 4, background: "#222225", width: "84%", maxWidth: 320 }}>
        <div style={{ position: "absolute", top: 4, bottom: 4, left: 4, width: `calc((100% - 8px) / ${OPTIONS.length})`, borderRadius: radius, background: "#fff", transform: `translateX(${i * 100}%)`, transition: `transform ${0.6 - speed * 0.05}s cubic-bezier(.3, 1.4, .5, 1)` }} />
        {OPTIONS.map((o, k) => <button key={o} role="tab" aria-selected={i === k} onClick={() => setI(k)} style={{ all: "unset", cursor: "pointer", position: "relative", textAlign: "center", padding: "9px 0", font: "500 12px/1 system-ui, sans-serif", color: i === k ? "#111" : "#aaa", transition: "color .2s" }}>{o}</button>)}
      </div>
    </div>
  );
}
