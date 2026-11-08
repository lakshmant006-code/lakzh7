import React, { useEffect, useRef, useState } from "react";
import "./FlowRoute.css";

/* A user flow that plays itself: things arrive one at a time at the top, drop down to the decision, the line to the
   right branch lights up, and the thing lands in that branch's column. When everything has landed it clears and goes again. */
const STEP = [520, 560, 1000];                                // appears, drops to the decision, routed and landed (ms)
const HOLD = 2600;

export default function FlowRoute({ node, question, yes, no, items }) {
  const [k, setK] = useState(0);                              // which arrival
  const [p, setP] = useState(0);                              // 0 appears, 1 drops, 2 routed
  const [shown, setShown] = useState(false);
  const [calm] = useState(() => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches);
  const root = useRef(null);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setShown(e.isIntersecting), { threshold: 0.3 });
    io.observe(root.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (calm || !shown) return undefined;
    const last = k === items.length - 1;
    const t = setTimeout(() => {
      if (p < 2) setP(p + 1);
      else if (!last) { setK(k + 1); setP(0); }
      else { setK(-1); setP(0); }                              // the clear-out before the next round
    }, k === -1 ? 700 : p === 2 && last ? HOLD : STEP[p]);
    return () => clearTimeout(t);
  }, [k, p, shown, calm, items.length]);

  useEffect(() => { if (k === -1) { const t = setTimeout(() => { setK(0); setP(0); }, 700); return () => clearTimeout(t); } return undefined; }, [k]);

  const done = calm ? items.length : k === -1 ? 0 : k + (p === 2 ? 1 : 0);
  const landed = items.slice(0, done);
  const cur = !calm && k >= 0 ? items[k] : null;
  const route = cur && p === 2 ? cur.to : null;
  const rows = Math.max(items.filter((i) => i.to === "yes").length, items.filter((i) => i.to === "no").length);
  const col = (side, cfg) => {
    const mine = landed.filter((i) => i.to === side);
    return (
      <div className={`fr-col${route === side ? " is-hot" : ""}`} style={{ minHeight: 56 + rows * 62 }}>
        <div className="fr-col-head">
          <span className="fr-col-title">{cfg.icon && <i className="fr-col-icon">{cfg.icon}</i>}{cfg.title}</span>
          <span className={`fr-tag${mine.length ? " on" : ""}`}>{mine.length ? cfg.active.replace("{n}", mine.length) : cfg.idle.replace("{n}", 0)}</span>
        </div>
        <ul className="fr-rows">
          {mine.map((it) => (
            <li key={it.title} className="fr-row"><i className="fr-ico">{it.icon || "•"}</i><span><b>{it.title}</b><em>{it.sub}</em></span></li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="fr" ref={root} role="img" aria-label={`${question} A flow that routes ${items.length} things to ${yes.title} or ${no.title}.`}>
      <div className="fr-slot">
        {cur && (
          <div key={k} className={`fr-card p${p}`}>
            <i className="fr-ico">{cur.icon || "•"}</i><span><b>{cur.title}</b><em>{cur.sub}</em></span>
          </div>
        )}
      </div>
      <div className={`fr-stem${cur && p >= 1 ? " lit" : ""}`} />
      <div className="fr-nodeRow">
        <span className={`fr-node${cur && p >= 1 ? " pulse" : ""}`} key={`${k}-${p >= 1}`}>{node}</span>
        <span className="fr-q">{question}</span>
      </div>
      <div className="fr-branches">
        <svg viewBox="0 0 600 84" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <path d="M300 0 V16 Q300 28 288 28 H162 Q150 28 150 40 V84" className={route === "yes" ? "hot" : ""} />
          <path d="M300 0 V16 Q300 28 312 28 H438 Q450 28 450 40 V84" className={route === "no" ? "hot" : ""} />
        </svg>
        <span className="fr-lab fr-lab-yes">{yes.label || "YES"}</span>
        <span className="fr-lab fr-lab-no">{no.label || "NO"}</span>
      </div>
      <div className="fr-cols">{col("yes", yes)}{col("no", no)}</div>
    </div>
  );
}
