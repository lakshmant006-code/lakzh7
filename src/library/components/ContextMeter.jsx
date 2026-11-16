import React, { useEffect, useState } from "react";

/* Context meter: a number that counts up and a bar made of segments that fill in. */
const SEGS = [["#2dd4bf", 0.42], ["#6366f1", 0.2], ["#3b82f6", 0.12], ["#a78bfa", 0.08], ["#f472b6", 0.05]];

export default function ContextMeter({ used = 175, total = 200, compact = 0 }) {
  const [n, setN] = useState(0);
  useEffect(() => { let raf, t0; const run = (t) => { t0 = t0 || t; const k = Math.min(1, (t - t0) / 1100); setN(used * (1 - (1 - k) ** 3)); if (k < 1) raf = requestAnimationFrame(run); }; raf = requestAnimationFrame(run); return () => cancelAnimationFrame(raf); }, [used]);
  const fill = Math.min(1, n / total);
  return (
    <div style={{ width: "86%", maxWidth: 360, padding: 16, borderRadius: 14, background: "#1a1a1c", color: "#fff", font: "500 12px/1.3 system-ui, sans-serif", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#aaa" }}><span>Context</span><span style={{ background: "#fff", color: "#111", borderRadius: 99, padding: "3px 9px", fontSize: 10 }}>{compact ? "Compact" : "Full"}</span></div>
      <div style={{ margin: "10px 0 12px", fontSize: compact ? 22 : 30, fontWeight: 600 }}>{n.toFixed(1)}K <span style={{ fontSize: 11, color: "#777", fontWeight: 400 }}>of {total}K</span></div>
      <div style={{ display: "flex", height: 12, borderRadius: 3, overflow: "hidden", background: "#2a2a2d", gap: 1 }}>
        {SEGS.map(([c, w], i) => <div key={c} style={{ width: `${w * 100 * fill / 0.87}%`, background: c, transition: "width .2s" }} />)}
      </div>
      <div style={{ display: "flex", gap: 14, marginTop: 12, color: "#999", fontSize: 10 }}>{["Chat", "Files", "Tools", "Memory"].map((s, i) => <span key={s}><i style={{ display: "inline-block", width: 6, height: 6, borderRadius: 9, marginRight: 5, background: SEGS[i][0] }} />{s}</span>)}</div>
    </div>
  );
}
