import React, { useState } from "react";

/* From MORPH: the three-way theme switch (dark, light, split). A small radio group in a recessed track. */
const M = { base: "#181818", elevated: "#363636", ink: "#f5f5f3", faint: "#7c7c78" };
const OPTIONS = [["dark", "Dark studio", "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"], ["light", "Light studio", "M12 4V2m0 20v-2m8-8h2M2 12h2m13.7-5.7 1.4-1.4M4.9 19.1l1.4-1.4m0-11.4L4.9 4.9m14.2 14.2-1.4-1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"], ["split", "Light tools around a dark canvas", "M12 3a9 9 0 1 0 0 18V3z"]];

export default function MorphThemeSwitch({ size = 28 }) {
  const [v, setV] = useState("dark");
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
      <div role="radiogroup" aria-label="Theme" style={{ display: "flex", gap: 2, padding: 2, borderRadius: 6, background: M.base, height: size }}>
        {OPTIONS.map(([id, hint, d]) => (
          <button key={id} role="radio" aria-checked={v === id} aria-label={id} title={hint} onClick={() => setV(id)}
            style={{ all: "unset", cursor: "pointer", width: size - 4, height: size - 4, display: "grid", placeItems: "center", borderRadius: 4, background: v === id ? M.elevated : "transparent", color: v === id ? M.ink : M.faint, transition: "background .15s, color .15s" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
          </button>
        ))}
      </div>
    </div>
  );
}
