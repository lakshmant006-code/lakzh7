import React, { useState } from "react";

/* From MORPH: the layers panel. A tree with indent, collapse, select (shift or cmd toggles), hover, double-click to rename, and a hide toggle. */
const M = { raised: "#2c2c2c", accent: "#e68a42", accentSoft: "rgba(230,138,66,.14)", ink: "#f5f5f3", muted: "#a8a8a4", faint: "#7c7c78", surface: "#242424", line: "#333" };
const TREE = [
  { id: "frame", name: "Card", type: "frame", children: [
    { id: "img", name: "Cover", type: "image" },
    { id: "text", name: "Title", type: "text" },
    { id: "row", name: "Actions", type: "frame", children: [{ id: "btn", name: "Button", type: "rect" }, { id: "dot", name: "Status", type: "ellipse" }] },
  ] },
  { id: "bg", name: "Background", type: "rect" },
];
const ICON = { frame: "M4 8h16M4 16h16M8 4v16M16 4v16", rect: "M4 6h16v12H4z", ellipse: "M12 5a7 7 0 1 0 0 14 7 7 0 0 0 0-14z", text: "M5 6h14M12 6v13", image: "M4 5h16v14H4zM4 15l5-5 4 4 3-3 4 4" };

export default function MorphLayers({ indent = 14 }) {
  const [collapsed, setCollapsed] = useState(new Set()), [sel, setSel] = useState(new Set(["text"])), [hover, setHover] = useState(null), [hidden, setHidden] = useState(new Set()), [names, setNames] = useState({}), [renaming, setRenaming] = useState(null);
  const flip = (set, id) => { const n = new Set(set); n.has(id) ? n.delete(id) : n.add(id); return n; };
  const Row = ({ n, depth }) => {
    const kids = n.children, closed = collapsed.has(n.id), on = sel.has(n.id), name = names[n.id] ?? n.name;
    return (
      <li role="treeitem" aria-selected={on} aria-expanded={kids ? !closed : undefined} style={{ listStyle: "none" }}>
        <div onPointerEnter={() => setHover(n.id)} onPointerLeave={() => setHover(null)} onClick={(e) => setSel((s) => (e.shiftKey || e.metaKey || e.ctrlKey ? flip(s, n.id) : new Set([n.id])))} onDoubleClick={() => setRenaming(n.id)}
          style={{ display: "flex", alignItems: "center", gap: 6, height: 28, paddingLeft: 4 + depth * indent, paddingRight: 8, borderRadius: 6, cursor: "default", background: on ? M.accentSoft : hover === n.id ? M.raised : "transparent", color: on || hover === n.id ? M.ink : M.muted, opacity: hidden.has(n.id) ? 0.4 : 1, transition: "background .12s" }}>
          <button type="button" aria-label={kids ? (closed ? "Expand" : "Collapse") : undefined} onClick={(e) => { e.stopPropagation(); if (kids) setCollapsed((c) => flip(c, n.id)); }} style={{ all: "unset", width: 16, height: 16, display: "grid", placeItems: "center", cursor: kids ? "pointer" : "default", color: M.faint }}>
            {kids && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transform: closed ? "none" : "rotate(90deg)", transition: "transform .15s" }}><path d="M9 6l6 6-6 6" /></svg>}
          </button>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: on ? M.accent : M.faint, flex: "none" }}><path d={ICON[n.type]} /></svg>
          {renaming === n.id
            ? <input autoFocus defaultValue={name} onClick={(e) => e.stopPropagation()} onBlur={(e) => { setNames((x) => ({ ...x, [n.id]: e.target.value.trim() || n.name })); setRenaming(null); }} onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") e.currentTarget.blur(); }} style={{ all: "unset", flex: 1, minWidth: 0, color: M.ink, font: "400 12px/1 system-ui, sans-serif", boxShadow: `0 0 0 1px ${M.accent}`, borderRadius: 3, padding: "2px 4px" }} />
            : <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", font: "400 12px/1 system-ui, sans-serif" }}>{name}</span>}
          <button type="button" aria-label={hidden.has(n.id) ? "Show" : "Hide"} onClick={(e) => { e.stopPropagation(); setHidden((h) => flip(h, n.id)); }} style={{ all: "unset", cursor: "pointer", color: M.faint, opacity: hover === n.id || hidden.has(n.id) ? 1 : 0, display: "grid", placeItems: "center" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" />{hidden.has(n.id) && <path d="M4 4l16 16" />}</svg>
          </button>
        </div>
        {kids && !closed && <ul role="group" style={{ margin: 0, padding: 0 }}>{kids.map((k) => <Row key={k.id} n={k} depth={depth + 1} />)}</ul>}
      </li>
    );
  };
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
      <div style={{ width: "86%", maxWidth: 280, padding: 6, borderRadius: 10, background: M.surface, boxShadow: `inset 0 0 0 1px ${M.line}` }}>
        <div style={{ padding: "6px 8px 8px", color: M.faint, font: "500 10px/1 ui-monospace, Menlo, monospace", letterSpacing: ".1em" }}>LAYERS</div>
        <ul role="tree" style={{ margin: 0, padding: 0 }}>{TREE.map((n) => <Row key={n.id} n={n} depth={0} />)}</ul>
      </div>
    </div>
  );
}
