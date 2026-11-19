import React, { useMemo, useRef, useState } from "react";

/* From MORPH: the command dashboard. Type to filter every command, arrow keys move through them, Enter runs the highlighted one.
   Each row shows what it does and the shortcut that triggers it. */
const M = { surface: "#242424", raised: "#2c2c2c", elevated: "#363636", line: "#333", accent: "#e68a42", accentSoft: "rgba(230,138,66,.14)", ink: "#f5f5f3", muted: "#a8a8a4", faint: "#7c7c78" };
const COMMANDS = [
  ["Move", "Tools", "V", "Select and drag layers"], ["Frame", "Tools", "F", "Draw a clipping container"], ["Rectangle", "Tools", "R", "Shift for a square"], ["Ellipse", "Tools", "O", "Shift for a circle"], ["Text", "Tools", "T", "Click and type"],
  ["Undo", "Edit", "⌘Z"], ["Redo", "Edit", "⇧⌘Z"], ["Duplicate", "Edit", "⌘D"], ["Group selection", "Edit", "⌘G", "Wraps layers in a frame"], ["Hide / show", "Edit", "⇧⌘H"], ["Lock / unlock", "Edit", "⇧⌘L", "Locked layers can't be picked"],
  ["Bring forward", "Arrange", "⌘]"], ["Send backward", "Arrange", "⌘["], ["Align left", "Arrange", "⌥A"], ["Align horizontal centers", "Arrange", "⌥H"],
  ["Select all", "Select", "⌘A"], ["Select parent", "Select", "⇧Enter"], ["Zoom to fit", "View", "⇧1"], ["Zoom to selection", "View", "⇧2"],
];

export default function MorphCommandPalette({ rows = 4 }) {
  const [q, setQ] = useState(""), [i, setI] = useState(0), [ran, setRan] = useState(""), t = useRef(0);
  const list = useMemo(() => COMMANDS.filter(([n, c, k, h]) => `${n} ${c} ${k} ${h || ""}`.toLowerCase().includes(q.toLowerCase())), [q]);
  const run = (c) => { if (!c) return; setRan(c[0]); clearTimeout(t.current); t.current = setTimeout(() => setRan(""), 1100); };
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
      <div style={{ width: "90%", maxWidth: 380, borderRadius: 10, background: M.surface, boxShadow: `0 20px 50px rgba(0,0,0,.4), inset 0 0 0 1px ${M.line}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, height: 40, padding: "0 12px", borderBottom: `1px solid ${M.line}` }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={M.faint} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          <input aria-label="Search commands" autoFocus value={q} placeholder="Search commands" onChange={(e) => { setQ(e.target.value); setI(0); }}
            onKeyDown={(e) => { if (e.key === "ArrowDown") { e.preventDefault(); setI((n) => Math.min(list.length - 1, n + 1)); } else if (e.key === "ArrowUp") { e.preventDefault(); setI((n) => Math.max(0, n - 1)); } else if (e.key === "Enter") run(list[i]); }}
            style={{ all: "unset", flex: 1, color: M.ink, font: "400 13px/1 system-ui, sans-serif" }} />
          <span style={{ color: ran ? M.accent : M.faint, font: "400 10.5px/1 ui-monospace, Menlo, monospace" }}>{ran ? `ran ${ran}` : `${list.length}`}</span>
        </div>
        <ul role="listbox" style={{ margin: 0, padding: 4, maxHeight: rows * 34, overflowY: "auto", listStyle: "none" }}>
          {list.map((c, n) => (
            <li key={c[0]} role="option" aria-selected={n === i} onMouseEnter={() => setI(n)} onClick={() => run(c)} style={{ display: "flex", alignItems: "center", gap: 10, height: 32, padding: "0 10px", borderRadius: 6, cursor: "pointer", background: n === i ? M.accentSoft : "transparent", color: n === i ? M.ink : M.muted }}>
              <span style={{ font: "400 12.5px/1 system-ui, sans-serif" }}>{c[0]}</span>
              {c[3] && <span style={{ color: M.faint, font: "400 11px/1 system-ui, sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{c[3]}</span>}
              {!c[3] && <span style={{ flex: 1 }} />}
              <kbd style={{ padding: "3px 6px", borderRadius: 4, background: M.raised, color: M.muted, font: "500 10.5px/1 ui-monospace, Menlo, monospace" }}>{c[2]}</kbd>
            </li>
          ))}
          {!list.length && <li style={{ padding: 14, color: M.faint, font: "400 12px/1 system-ui, sans-serif" }}>No command matches "{q}".</li>}
        </ul>
      </div>
    </div>
  );
}
