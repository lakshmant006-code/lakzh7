import React, { useRef, useState } from "react";

/* From MORPH: the selection box. A layer on a dotted canvas with eight resize handles (corners keep their cursor, edges stretch one side),
   a size badge, and a hover outline. Drag the layer to move it; Shift keeps the proportions while resizing. */
const M = { base: "#181818", accent: "#e68a42", ink: "#f5f5f3", faint: "#7c7c78" };
const HANDLES = [["nw", 0, 0, "nwse-resize"], ["n", 0.5, 0, "ns-resize"], ["ne", 1, 0, "nesw-resize"], ["e", 1, 0.5, "ew-resize"], ["se", 1, 1, "nwse-resize"], ["s", 0.5, 1, "ns-resize"], ["sw", 0, 1, "nesw-resize"], ["w", 0, 0.5, "ew-resize"]];

export default function MorphSelectionBox({ minSize = 24 }) {
  const stage = useRef(null), drag = useRef(null);
  const [r, setR] = useState({ x: 70, y: 56, w: 150, h: 96 }), [sel, setSel] = useState(true), [hover, setHover] = useState(false);
  const start = (mode) => (e) => { e.stopPropagation(); e.currentTarget.setPointerCapture(e.pointerId); drag.current = { mode, px: e.clientX, py: e.clientY, r: { ...r } }; setSel(true); };
  const move = (e) => {
    const d = drag.current; if (!d) return; const dx = e.clientX - d.px, dy = e.clientY - d.py, o = d.r; let { x, y, w, h } = o;
    if (d.mode === "move") { x = o.x + dx; y = o.y + dy; }
    else {
      if (d.mode.includes("e")) w = Math.max(minSize, o.w + dx); if (d.mode.includes("s")) h = Math.max(minSize, o.h + dy);
      if (d.mode.includes("w")) { w = Math.max(minSize, o.w - dx); x = o.x + (o.w - w); } if (d.mode.includes("n")) { h = Math.max(minSize, o.h - dy); y = o.y + (o.h - h); }
      if (e.shiftKey && d.mode.length === 2) { const k = o.w / o.h; h = w / k; if (d.mode.includes("n")) y = o.y + (o.h - h); }
    }
    setR({ x, y, w, h });
  };
  const up = () => { drag.current = null; };
  return (
    <div ref={stage} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onPointerDown={() => setSel(false)} style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: M.base, backgroundImage: "radial-gradient(circle, rgba(255,255,255,.07) 1px, transparent 1px)", backgroundSize: "24px 24px", touchAction: "none", userSelect: "none" }}>
      <div onPointerDown={start("move")} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)} style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, boxSizing: "border-box", background: "#2c2c2c", borderRadius: 4, cursor: "move", outline: sel ? `1px solid ${M.accent}` : hover ? `1px solid ${M.accent}aa` : "none", display: "grid", placeItems: "center", color: M.faint, font: "400 11px/1 system-ui, sans-serif" }}>Card
        {sel && HANDLES.map(([id, hx, hy, cur]) => <i key={id} onPointerDown={start(id)} style={{ position: "absolute", left: `${hx * 100}%`, top: `${hy * 100}%`, width: 8, height: 8, margin: -4, background: M.ink, borderRadius: 2, boxShadow: `0 0 0 1px ${M.accent}`, cursor: cur, touchAction: "none" }} />)}
        {sel && <span style={{ position: "absolute", left: "50%", top: "100%", transform: "translate(-50%, 10px)", padding: "2px 6px", borderRadius: 4, background: M.accent, color: M.base, font: "500 10px/1.3 ui-monospace, Menlo, monospace", whiteSpace: "nowrap", pointerEvents: "none" }}>{Math.round(r.w)} × {Math.round(r.h)}</span>}
      </div>
      <div style={{ position: "absolute", left: 12, bottom: 10, color: M.faint, font: "400 10.5px/1 ui-monospace, Menlo, monospace", pointerEvents: "none" }}>drag · resize · shift keeps the shape</div>
    </div>
  );
}
