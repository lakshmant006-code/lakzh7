import React, { useEffect, useState } from "react";

/* Typewriter: types a line, holds it, erases it, then moves to the next. */
const LINES = ["Design with curiosity.", "Build the small details.", "Ship it, then make it better."];

export default function Typewriter({ speed = 5, hold = 1.4 }) {
  const [line, setLine] = useState(0); const [text, setText] = useState(""); const [erase, setErase] = useState(false);
  useEffect(() => {
    const full = LINES[line % LINES.length]; let t;
    if (!erase && text.length < full.length) t = setTimeout(() => setText(full.slice(0, text.length + 1)), 140 - speed * 11);
    else if (!erase) t = setTimeout(() => setErase(true), hold * 1000);
    else if (text.length) t = setTimeout(() => setText(full.slice(0, text.length - 1)), 50 - speed * 3);
    else { setErase(false); setLine((l) => l + 1); }
    return () => clearTimeout(t);
  }, [text, erase, line, speed, hold]);
  return <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", color: "#fff", font: "500 17px/1.3 ui-monospace, Menlo, monospace", padding: "0 18px", textAlign: "center" }}><span>{text}<i style={{ display: "inline-block", width: 2, height: "1em", background: "#fff", marginLeft: 3, verticalAlign: "-2px", animation: "tw 1s steps(1) infinite" }} /><style>{"@keyframes tw{50%{opacity:0}}"}</style></span></div>;
}
