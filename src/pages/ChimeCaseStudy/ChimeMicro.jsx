import React, { useEffect, useRef, useState } from "react";

/* Four of Chime's own micro-interactions, rebuilt from the prototype: the listening orb, the notification banner,
   the five-stage heartbeat and the last-word check. Each one is tappable. */

const TRANSCRIPT = "Loud music from the apartment upstairs, going since 11 PM.";

/** the orb: tap and rings leave it, then the words arrive */
const Listen = () => {
  const [rings, setRings] = useState([]);
  const [text, setText] = useState("");
  const timer = useRef(null);
  const tap = () => {
    const k = Date.now();
    setRings((r) => [...r.slice(-3), k, k + 1, k + 2]);
    clearInterval(timer.current); setText("");
    let i = 0;
    timer.current = setInterval(() => { i += 2; setText(TRANSCRIPT.slice(0, i)); if (i >= TRANSCRIPT.length) clearInterval(timer.current); }, 38);
  };
  useEffect(() => () => clearInterval(timer.current), []);
  return (
    <div className="cm-card">
      <p className="cm-eyebrow">Say it out loud</p>
      <div className="cm-stage cm-stage--orb">
        {rings.map((k, n) => <i key={k} className="cm-ring" style={{ animationDelay: `${(n % 3) * 0.28}s` }} />)}
        <button type="button" className="cm-orb" onClick={tap} aria-label="Tap the orb to listen">
          <svg viewBox="0 0 48 48" aria-hidden="true"><path className="cm-ear" d="M24 8c-6 0-10 4.5-10 10v2.5c0 3 1.5 4.6 3 6.4 1.4 1.7 1.8 3 1.8 4.6 0 2.6 2 5 4.7 5 2.8 0 5-2.2 5-5 0-3.4 4-4.6 4-10.5C32.5 13 29 8 24 8Z M24 17c-2.4 0-3.6 1.6-3.6 3.4" /></svg>
        </button>
      </div>
      <p className="cm-line" aria-live="polite">{text ? `“${text}”` : "Tap the orb"}</p>
    </div>
  );
};

/** the banner drops in with a small overshoot, and goes again on replay */
const Banner = () => {
  const [k, setK] = useState(1);
  return (
    <div className="cm-card">
      <p className="cm-eyebrow">A case update arrives</p>
      <div className="cm-stage cm-stage--banner">
        <div key={k} className="cm-banner" role="status">
          <span className="cm-banner-icon" aria-hidden="true" />
          <span className="cm-banner-copy"><b>Someone is on the way</b><em>CHM-48213 · Williamsburg</em></span>
          <span className="cm-banner-now">now</span>
        </div>
      </div>
      <button type="button" className="cm-btn" onClick={() => setK((v) => v + 1)}>Replay notification</button>
    </div>
  );
};

const STAGES = ["Received", "Assigned", "On the way", "Visited", "Outcome"];
const AMP = [34, 26, 20, 11, 4];
const wavePath = (a) => {
  let d = "M0 40";
  for (let x = 0; x <= 300; x += 6) d += ` L${x} ${(40 + Math.sin(x / 11 + a) * a * Math.sin((x / 300) * Math.PI)).toFixed(1)}`;
  return d;
};
/** five stages: the wave steadies as the city acts on the case */
const Stages = () => {
  const [s, setS] = useState(0);
  const [t, setT] = useState(0);
  const raf = useRef(0);
  useEffect(() => {
    const loop = () => { setT((v) => v + 0.05); raf.current = requestAnimationFrame(loop); };
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, []);
  return (
    <div className="cm-card">
      <p className="cm-eyebrow">Five stages, one wave</p>
      <div className="cm-stage cm-stage--wave">
        <svg viewBox="0 0 300 80" preserveAspectRatio="none" aria-hidden="true"><path d={wavePath(AMP[s] * 0.7 + t * 0)} style={{ transform: `translateX(${(-(t * 6) % 12).toFixed(1)}px)` }} /></svg>
        <span className="cm-stage-name">{STAGES[s]}</span>
      </div>
      <div className="cm-steps" role="group" aria-label="Case stage">
        {STAGES.map((n, i) => <button key={n} type="button" className={i <= s ? "on" : ""} aria-pressed={i === s} onClick={() => setS(i)}>{i + 1}</button>)}
      </div>
    </div>
  );
};

/** the last word: yes closes the case, the wave goes flat and a check fills in */
const LastWord = () => {
  const [state, setState] = useState("open");
  return (
    <div className="cm-card">
      <p className="cm-eyebrow">The last word</p>
      <div className={`cm-stage cm-stage--close ${state}`}>
        <svg viewBox="0 0 300 80" preserveAspectRatio="none" aria-hidden="true">
          <path className="cm-loud" d={wavePath(26)} />
          <path className="cm-flat" d="M0 40 L300 40" />
        </svg>
        <span className="cm-check" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></span>
      </div>
      <p className="cm-line">{state === "open" ? "Did it actually get quieter?" : state === "quiet" ? "Glad it's quiet. Case closed." : "Sent back to the city."}</p>
      <div className="cm-actions">
        <button type="button" className="cm-btn cm-btn--primary" onClick={() => setState("quiet")}>Yes, it's quiet</button>
        <button type="button" className="cm-btn" onClick={() => setState(state === "open" ? "loud" : "open")}>{state === "open" ? "No, still loud" : "Start over"}</button>
      </div>
    </div>
  );
};

export default function ChimeMicro() {
  return (
    <div className="cm-grid">
      <Listen />
      <Banner />
      <Stages />
      <LastWord />
    </div>
  );
}
