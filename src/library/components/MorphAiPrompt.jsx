import React, { useState } from "react";

/* From MORPH: the floating AI prompt. It knows what is selected (the chip), takes a plain sentence and sends it with Enter.
   As in MORPH today, no model is connected: it says so plainly and changes nothing. */
const M = { surface: "#242424", accent: "#e68a42", accentSoft: "rgba(230,138,66,.14)", ink: "#f5f5f3", faint: "#7c7c78", base: "#181818", line: "#333" };

export default function MorphAiPrompt({ target = "Card" }) {
  const [text, setText] = useState(""), [note, setNote] = useState(""), [focus, setFocus] = useState(false);
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
      <div style={{ width: "92%", maxWidth: 460, minWidth: 0 }}>
        <form aria-label="AI assistant" onSubmit={(e) => { e.preventDefault(); if (!text.trim()) return; setNote("The AI agent isn't connected yet. Nothing was changed."); setText(""); setTimeout(() => setNote(""), 3200); }}
          style={{ display: "flex", alignItems: "center", gap: 8, height: 38, width: "100%", boxSizing: "border-box", overflow: "hidden", padding: "0 6px 0 12px", borderRadius: 10, background: M.surface, boxShadow: `0 6px 20px rgba(0,0,0,.25), inset 0 0 0 1px ${focus ? M.accent : "transparent"}`, transition: "box-shadow .15s" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill={M.accent} aria-hidden="true"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" /><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" /></svg>
          <span style={{ maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", padding: "2px 6px", borderRadius: 4, background: M.accentSoft, color: M.accent, font: "400 11px/1.3 system-ui, sans-serif" }}>{target}</span>
          <input size={1} aria-label="Describe an interaction" value={text} onChange={(e) => setText(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} placeholder="Describe how this should behave…"
            style={{ all: "unset", flex: 1, minWidth: 0, height: "100%", color: M.ink, font: "400 13px/1 system-ui, sans-serif" }} />
          <button type="submit" aria-label="Send prompt" disabled={!text.trim()} style={{ all: "unset", cursor: text.trim() ? "pointer" : "default", width: 28, height: 28, borderRadius: 6, display: "grid", placeItems: "center", background: M.accent, color: M.base, opacity: text.trim() ? 1 : 0.3, transition: "opacity .15s" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
          </button>
        </form>
        <div style={{ height: 22, marginTop: 8, textAlign: "center", color: M.faint, font: "400 11px/1.3 system-ui, sans-serif", opacity: note ? 1 : 0, transition: "opacity .25s" }}>{note}</div>
      </div>
    </div>
  );
}
