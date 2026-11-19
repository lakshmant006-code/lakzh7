import React, { useEffect, useRef, useState } from "react";

/* From MORPH: a protected value (a passcode or card number) with a reveal and a copy button.
   It shows only the last four digits behind dots. The eye turns the dots into the real digits one after another;
   the copy button puts the whole number on the clipboard and shows a tick. */
const M = { base: "#161616", line: "#333333", strong: "#454545", ink: "#f5f5f3", muted: "#a8a8a4", faint: "#7c7c78", accent: "#e68a42" };
const eye = (off) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" />{off && <path d="M4 4l16 16" />}</svg>;
const copy = (done) => done
  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={M.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h9" /></svg>;

export default function MorphPasscode({ number = "4821 7390 6615 9204", label = "Passcode", sub = "Number", speed = 5 }) {
  const [shown, setShown] = useState(false), [done, setDone] = useState(false), [tick, setTick] = useState(0);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);
  const chars = number.split("");
  const lastFour = chars.length - 4;
  const copyIt = async () => { try { await navigator.clipboard.writeText(number.replace(/\s/g, "")); } catch { /* clipboard blocked: still show the tick */ } setDone(true); clearTimeout(timer.current); timer.current = setTimeout(() => setDone(false), 1400); };
  const btn = { all: "unset", cursor: "pointer", width: 54, alignSelf: "stretch", display: "grid", placeItems: "center", color: M.muted, borderLeft: `1px solid ${M.line}`, transition: "color .15s, background .15s" };
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
      <div style={{ width: "88%", maxWidth: 380, color: M.ink, fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
        <div style={{ font: "500 12px/1 inherit", color: M.muted, marginBottom: 8 }}>{label}</div>
        <div style={{ font: "400 8.5px/1 ui-monospace, Menlo, monospace", letterSpacing: ".12em", color: M.faint, marginBottom: 6, textTransform: "uppercase" }}>{sub}</div>
        <div style={{ display: "flex", alignItems: "center", background: M.base, borderRadius: 4, boxShadow: `inset 0 0 0 1px ${M.line}`, minHeight: 58, overflow: "hidden" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 22px", font: "500 21px/1 ui-monospace, Menlo, Consolas, monospace", letterSpacing: ".02em", whiteSpace: "pre" }} aria-label={shown ? number : `Hidden, ends in ${number.slice(-4)}`}>
            {chars.map((ch, i) => {
              const secret = ch !== " " && i < lastFour, visible = !secret || shown;
              return (
                <span key={i + "-" + tick} style={{ display: "inline-block", width: ch === " " ? "0.7em" : "0.62em", textAlign: "center", color: M.ink, transition: `transform .35s cubic-bezier(.3,1.5,.5,1) ${i * (12 - speed) * 5}ms, opacity .25s ${i * (12 - speed) * 5}ms, filter .3s ${i * (12 - speed) * 5}ms`,
                  transform: secret && shown ? "translateY(0) scale(1)" : "none", filter: "none" }}>
                  {visible ? ch : "•"}
                </span>
              );
            })}
          </div>
          <button type="button" style={btn} aria-label={shown ? "Hide" : "Reveal"} aria-pressed={shown} onClick={() => { setShown((v) => !v); setTick((t) => t + 1); }} onMouseEnter={(e) => (e.currentTarget.style.color = M.ink)} onMouseLeave={(e) => (e.currentTarget.style.color = M.muted)}>{eye(shown)}</button>
          <button type="button" style={btn} aria-label="Copy" onClick={copyIt} onMouseEnter={(e) => (e.currentTarget.style.color = M.ink)} onMouseLeave={(e) => (e.currentTarget.style.color = M.muted)}>{copy(done)}</button>
        </div>
      </div>
    </div>
  );
}
