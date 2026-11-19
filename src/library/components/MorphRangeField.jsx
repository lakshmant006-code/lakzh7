import React, { useState } from "react";

/* From MORPH: the range field of the inspector. A label, a slider and the value in mono type, in a three-column grid, driving a live layer. */
const M = { raised: "#2c2c2c", line2: "#454545", accent: "#e68a42", ink: "#f5f5f3", muted: "#a8a8a4", surface: "#242424", line: "#333" };

function Range({ label, value, min, max, step = 1, onChange, suffix = "" }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "64px 1fr 44px", alignItems: "center", gap: 8, height: 24 }}>
      <label style={{ color: M.muted, font: "400 12px/1 system-ui, sans-serif" }}>{label}</label>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} aria-label={label} style={{ width: "100%", accentColor: M.accent, cursor: "pointer" }} />
      <span style={{ textAlign: "right", color: M.ink, font: "400 12px/1 ui-monospace, Menlo, monospace" }}>{Math.round(value * 100) / 100}{suffix}</span>
    </div>
  );
}

export default function MorphRangeField({ max = 100 }) {
  const [v, setV] = useState({ opacity: 100, radius: 18, blur: 0, rotate: 0 });
  const set = (k) => (n) => setV((s) => ({ ...s, [k]: n }));
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
      <div style={{ width: "86%", maxWidth: 320, display: "grid", gap: 10 }}>
        <div style={{ height: 90, display: "grid", placeItems: "center", borderRadius: 10, background: M.surface, boxShadow: `inset 0 0 0 1px ${M.line}` }}>
          <div style={{ width: 80, height: 56, background: M.accent, borderRadius: v.radius, opacity: v.opacity / 100, filter: `blur(${v.blur}px)`, transform: `rotate(${v.rotate}deg)`, transition: "border-radius .1s" }} />
        </div>
        <Range label="Opacity" value={v.opacity} min={0} max={max} onChange={set("opacity")} suffix="%" />
        <Range label="Radius" value={v.radius} min={0} max={40} onChange={set("radius")} />
        <Range label="Blur" value={v.blur} min={0} max={12} step={0.5} onChange={set("blur")} />
        <Range label="Rotate" value={v.rotate} min={-90} max={90} onChange={set("rotate")} suffix="°" />
      </div>
    </div>
  );
}
