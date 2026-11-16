import React, { useState } from "react";

/* From MORPH: a numeric field with a short prefix. Type and press Enter to commit, Escape to revert, arrow keys to step (Shift for ×10). */
const M = { raised: "#2c2c2c", strong: "#454545", accent: "#e68a42", ink: "#f5f5f3", faint: "#7c7c78" };

function Field({ label, value, onCommit, min = -1e9, max = 1e9, step = 1 }) {
  const [draft, setDraft] = useState(null), [focus, setFocus] = useState(false), [hover, setHover] = useState(false);
  const shown = draft ?? String(Math.round(value * 100) / 100);
  const commit = (raw) => { setDraft(null); const p = parseFloat(raw); if (Number.isFinite(p)) onCommit(Math.max(min, Math.min(max, p))); };
  return (
    <label onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ display: "flex", alignItems: "center", gap: 6, height: 28, padding: "0 8px", borderRadius: 6, background: M.raised, border: `1px solid ${focus ? M.accent : hover ? M.strong : "transparent"}`, transition: "border-color .15s" }}>
      <span style={{ width: 12, textAlign: "center", color: M.faint, font: "400 11px/1 ui-monospace, Menlo, monospace" }}>{label}</span>
      <input value={shown} inputMode="decimal" onChange={(e) => setDraft(e.target.value)} onFocus={(e) => { setFocus(true); e.target.select(); }} onBlur={(e) => { setFocus(false); if (draft !== null) commit(e.target.value); }}
        onKeyDown={(e) => { if (e.key === "Enter") commit(e.currentTarget.value); else if (e.key === "Escape") { setDraft(null); e.currentTarget.blur(); } else if (e.key === "ArrowUp" || e.key === "ArrowDown") { e.preventDefault(); commit(String((parseFloat(e.currentTarget.value) || 0) + (e.key === "ArrowUp" ? 1 : -1) * step * (e.shiftKey ? 10 : 1))); } }}
        style={{ all: "unset", width: "100%", minWidth: 0, color: M.ink, font: "400 12px/1 ui-monospace, Menlo, monospace" }} />
    </label>
  );
}

export default function MorphNumberField({ step = 1 }) {
  const [v, setV] = useState({ x: 120, y: 64, w: 240, h: 160 });
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, width: "78%", maxWidth: 260 }}>
        {[["X", "x"], ["Y", "y"], ["W", "w"], ["H", "h"]].map(([l, k]) => <Field key={k} label={l} value={v[k]} step={step} onCommit={(n) => setV((s) => ({ ...s, [k]: n }))} />)}
      </div>
    </div>
  );
}
