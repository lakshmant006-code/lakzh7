import React, { useRef, useState } from "react";

/* Vertical sliders: three tall pills you drag up and down, like the ones in a control centre. The fill rises from the bottom, the icon
   follows the level (the speaker goes quiet at zero), the pill swells a little under your finger, and a dot marks the exact level while you drag. */
const ITEMS = [
  { id: "light", label: "Brightness", color: "#f5b700", icon: () => <><circle cx="12" cy="12" r="4" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" /></> },
  { id: "sound", label: "Volume", color: "#38bdf8", icon: (v) => <><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z" fill="currentColor" />{v === 0 ? <path d="M16 9.5l5 5M21 9.5l-5 5" /> : <><path d="M15.5 9a4 4 0 0 1 0 6" />{v > 0.55 && <path d="M18 6.5a7.5 7.5 0 0 1 0 11" />}</>}</> },
  { id: "torch", label: "Flashlight", color: "#e5e7eb", icon: () => <><path d="M8 3h8l-1.5 6h-5z" fill="currentColor" /><path d="M10 9v11a2 2 0 0 0 4 0V9" /></> },
];

function Slider({ item, height, radius, value, setValue }) {
  const ref = useRef(null), [down, setDown] = useState(false);
  const set = (e) => { const r = ref.current.getBoundingClientRect(); setValue(Math.max(0, Math.min(1, 1 - (e.clientY - r.top) / r.height))); };
  return (
    <div ref={ref} role="slider" aria-label={item.label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value * 100)} tabIndex={0} aria-orientation="vertical"
      onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setDown(true); set(e); }} onPointerMove={(e) => down && set(e)} onPointerUp={() => setDown(false)} onPointerCancel={() => setDown(false)}
      onKeyDown={(e) => { if (e.key === "ArrowUp") setValue(Math.min(1, value + 0.05)); if (e.key === "ArrowDown") setValue(Math.max(0, value - 0.05)); }}
      style={{ position: "relative", width: 44, height, borderRadius: radius, background: "#2a2a2c", overflow: "hidden", cursor: "pointer", touchAction: "none", outline: "none", transform: down ? "scale(1.07)" : "none", transition: "transform .25s cubic-bezier(.3,1.5,.5,1)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.05)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${value * 100}%`, background: "linear-gradient(#d4d4d8, #a1a1aa)", transition: down ? "none" : "height .2s ease-out" }} />
      {down && value > 0.04 && value < 0.98 && <i style={{ position: "absolute", left: "50%", bottom: `calc(${value * 100}% - 5px)`, width: 4, height: 4, marginLeft: -2, borderRadius: "50%", background: "#111", opacity: 0.8 }} />}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: 12, bottom: 12, color: item.color, filter: "drop-shadow(0 1px 2px rgba(0,0,0,.35))" }}>{item.icon(value)}</svg>
    </div>
  );
}

export default function VerticalSliders({ height = 120, radius = 14 }) {
  const [v, setV] = useState([0.8, 0.4, 0]);
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-end" }}>
        {ITEMS.map((it, i) => <Slider key={it.id} item={it} height={height} radius={radius} value={v[i]} setValue={(n) => setV((a) => a.map((x, k) => (k === i ? n : x)))} />)}
      </div>
    </div>
  );
}
