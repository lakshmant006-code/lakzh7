import React, { useState } from "react";

/* From MORPH: the colour field. A native swatch and a hex box in one field. Type a hex (3 or 6 digits, with or without #) and press Enter,
   Escape reverts. Dragging the swatch updates live. */
const M = { raised: "#2c2c2c", strong: "#454545", accent: "#e68a42", ink: "#f5f5f3", muted: "#a8a8a4" };
const HEX = /^#[0-9a-f]{6}$/i;

export default function MorphColorField({ swatches = 3 }) {
  const [fills, setFills] = useState(["#E68A42", "#4DC6FF", "#B36BFF"]);
  const [draft, setDraft] = useState([null, null, null]);
  const names = ["Fill", "Stroke", "Shadow"];
  const set = (i, v) => setFills((f) => f.map((x, k) => (k === i ? v : x)));
  const commit = (i, raw) => { setDraft((d) => d.map((x, k) => (k === i ? null : x))); let t = raw.trim(); if (/^[0-9a-f]{3}$|^[0-9a-f]{6}$/i.test(t)) t = "#" + t; if (/^#[0-9a-f]{3}$/i.test(t)) t = "#" + [...t.slice(1)].map((c) => c + c).join(""); if (HEX.test(t)) set(i, t.toUpperCase()); };
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
      <div style={{ width: "84%", maxWidth: 300, display: "grid", gap: 10 }}>
        <div style={{ height: 70, borderRadius: 10, background: `linear-gradient(135deg, ${fills[0]}, ${fills[1]})`, boxShadow: `0 10px 30px ${fills[2]}55`, transition: "box-shadow .2s" }} />
        {names.slice(0, swatches).map((n, i) => (
          <label key={n} style={{ display: "flex", alignItems: "center", gap: 8, height: 28, padding: "0 8px", borderRadius: 6, background: M.raised, border: "1px solid transparent", transition: "border-color .15s" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = M.accent)} onBlur={(e) => (e.currentTarget.style.borderColor = "transparent")}>
            <input type="color" aria-label={`${n} picker`} value={fills[i]} onChange={(e) => set(i, e.target.value.toUpperCase())} style={{ all: "unset", width: 16, height: 16, borderRadius: 3, background: fills[i], boxShadow: `0 0 0 1px ${M.strong}`, cursor: "pointer", flex: "none" }} />
            <span style={{ width: 44, color: M.muted, font: "400 11.5px/1 system-ui, sans-serif" }}>{n}</span>
            <input aria-label={n} value={draft[i] ?? fills[i]} spellCheck={false} onChange={(e) => setDraft((d) => d.map((x, k) => (k === i ? e.target.value : x)))} onFocus={(e) => e.target.select()}
              onBlur={(e) => { if (draft[i] !== null) commit(i, e.target.value); }} onKeyDown={(e) => { if (e.key === "Enter") commit(i, e.currentTarget.value); else if (e.key === "Escape") { setDraft((d) => d.map((x, k) => (k === i ? null : x))); e.currentTarget.blur(); } }}
              style={{ all: "unset", flex: 1, minWidth: 0, color: M.ink, textTransform: "uppercase", font: "400 12px/1 ui-monospace, Menlo, monospace" }} />
          </label>
        ))}
      </div>
    </div>
  );
}
