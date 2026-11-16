import React, { useState } from "react";

/* From MORPH: the toolbar icon button. 28 px, quiet until hovered, soft orange when active. */
const M = { elevated: "#363636", accent: "#e68a42", accentSoft: "rgba(230,138,66,.14)", ink: "#f5f5f3", muted: "#a8a8a4" };
const TOOLS = [["Move", "V", "M5 3l14 7-6 2-2 6z"], ["Frame", "F", "M4 8h16M4 16h16M8 4v16M16 4v16"], ["Rectangle", "R", "M4 6h16v12H4z"], ["Ellipse", "O", "M12 5a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"], ["Text", "T", "M5 6h14M12 6v13"], ["Pen", "B", "M4 20l4-1 11-11-3-3L5 16z"]];

export default function MorphIconButtons({ size = 28 }) {
  const [on, setOn] = useState(0), [hover, setHover] = useState(-1);
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
      <div style={{ display: "flex", gap: 4, padding: 6, borderRadius: 10, background: "#242424", boxShadow: "inset 0 0 0 1px #333" }}>
        {TOOLS.map(([label, key, d], i) => (
          <button key={label} aria-label={label} aria-pressed={on === i} title={`${label} (${key})`} onClick={() => setOn(i)} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(-1)}
            style={{ all: "unset", cursor: "pointer", width: size, height: size, display: "grid", placeItems: "center", borderRadius: 6, transition: "background .15s, color .15s", background: on === i ? M.accentSoft : hover === i ? M.elevated : "transparent", color: on === i ? M.accent : hover === i ? M.ink : M.muted }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
          </button>
        ))}
      </div>
    </div>
  );
}
