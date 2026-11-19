import React, { useState } from "react";

/* From MORPH: the segmented control and the select. A row of radio buttons in a recessed track with the active one raised, and a quiet dropdown beside it. */
const M = { raised: "#2c2c2c", elevated: "#363636", surface: "#242424", ink: "#f5f5f3", muted: "#a8a8a4", line: "#333" };
const ALIGN = [["left", "M4 6h16M4 12h10M4 18h14"], ["center", "M4 6h16M7 12h10M5 18h14"], ["right", "M4 6h16M10 12h10M6 18h14"]];

export function Segmented({ options, value, onChange, label }) {
  return (
    <div role="radiogroup" aria-label={label} style={{ display: "flex", gap: 2, height: 28, padding: 2, borderRadius: 6, background: M.raised, boxSizing: "border-box" }}>
      {options.map((o) => (
        <button key={o.value} type="button" role="radio" aria-checked={value === o.value} aria-label={o.label} title={o.label} onClick={() => onChange(o.value)}
          style={{ all: "unset", cursor: "pointer", flex: 1, display: "grid", placeItems: "center", minWidth: 34, borderRadius: 4, font: "400 12px/1 system-ui, sans-serif", background: value === o.value ? M.elevated : "transparent", color: value === o.value ? M.ink : M.muted, transition: "background .15s, color .15s" }}>{o.icon ?? o.label}</button>
      ))}
    </div>
  );
}

export default function MorphSegmented({ weight = 500 }) {
  const [align, setAlign] = useState("center"), [style, setStyle] = useState("solid"), [font, setFont] = useState("sans");
  const fam = { sans: "system-ui, sans-serif", serif: "Georgia, serif", mono: "ui-monospace, Menlo, monospace" }[font];
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
      <div style={{ width: "86%", maxWidth: 320, display: "grid", gap: 8 }}>
        <div style={{ padding: 16, borderRadius: 10, background: M.surface, boxShadow: `inset 0 0 0 1px ${M.line}`, color: M.ink, textAlign: align, font: `${weight} 15px/1.4 ${fam}`, minHeight: 64, border: style === "dashed" ? "1px dashed #666" : style === "none" ? "1px solid transparent" : "1px solid transparent" }}>Design the appearance. Engineer the behavior.</div>
        <Segmented label="Text align" value={align} onChange={setAlign} options={ALIGN.map(([v, d]) => ({ value: v, label: v, icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d={d} /></svg> }))} />
        <Segmented label="Border" value={style} onChange={setStyle} options={[{ value: "solid", label: "Solid" }, { value: "dashed", label: "Dashed" }, { value: "none", label: "None" }]} />
        <div style={{ height: 28, borderRadius: 6, background: M.raised, border: "1px solid transparent" }}>
          <select aria-label="Font" value={font} onChange={(e) => setFont(e.target.value)} style={{ all: "unset", width: "100%", height: "100%", padding: "0 8px", boxSizing: "border-box", cursor: "pointer", color: M.ink, font: "400 12px/1 system-ui, sans-serif" }}>
            {["sans", "serif", "mono"].map((f) => <option key={f} value={f} style={{ background: M.surface }}>{f[0].toUpperCase() + f.slice(1)}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
