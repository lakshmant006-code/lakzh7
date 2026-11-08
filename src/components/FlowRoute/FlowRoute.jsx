import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import "./FlowRoute.css";

/* A flow that plays itself, built as a small constraint system rather than a keyframed picture.
   - The cards are laid out once and stay mounted; only what sits inside them changes.
   - Nothing flies across the diagram. The item arrives in the slot, dissolves, and a dot runs down the wire it was routed
     along; when the dot arrives, a new row is inserted at the top of that column and the rows below spring down to make room.
   - The connectors are not animated on their own: their geometry is measured from where the slot, the decision and the
     columns actually are, and redrawn whenever the layout moves (resize, fonts), so they can never drift off their cards.
   - Timing is staggered on purpose: the arrival, the drop, the line lighting up and the landing are separate beats. */
const SPRING = { type: "spring", stiffness: 220, damping: 28, mass: 1 };          // near-critical: quick, no visible bounce
const SOFT = { type: "spring", stiffness: 170, damping: 26, mass: 1 };
const ROW = 58;                                                                  // height of one row in a column
const R = 12;                                                                    // corner radius of the connectors
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function FlowRoute({ node, question, yes, no, items }) {
  const reduce = useReducedMotion();
  const root = useRef(null), slot = useRef(null), nodeEl = useRef(null), dot = useRef(null);
  const wire = { yes: useRef(null), no: useRef(null) };
  const cols = { yes: useRef(null), no: useRef(null) };
  const [landed, setLanded] = useState(items);                                    // it opens fully populated, like the finished state
  const [cur, setCur] = useState(null);
  const [route, setRoute] = useState(null);
  const [pulse, setPulse] = useState(0);
  const [geo, setGeo] = useState(null);
  const [faded, setFaded] = useState(false);
  const visible = useRef(false);
  const t = useMotionValue(0);

  const rel = (el) => { const a = el.getBoundingClientRect(), b = root.current.getBoundingClientRect(); return { left: a.left - b.left, top: a.top - b.top, width: a.width, height: a.height }; };

  /* the connectors, derived from where the pieces really are */
  const measure = () => {
    if (!root.current || !slot.current || !nodeEl.current || !cols.yes.current || !cols.no.current) return;
    const rb = root.current.getBoundingClientRect(), sl = rel(slot.current), nd = rel(nodeEl.current), cy = rel(cols.yes.current), cn = rel(cols.no.current);
    const nx = nd.left + nd.width / 2, nb = nd.top + nd.height, jy = nb + 24;
    const leg = (c) => { const cx = c.left + c.width / 2, d = cx < nx ? -1 : 1;
      return `M${nx} ${nb} V${jy - R} Q${nx} ${jy} ${nx + d * R} ${jy} H${cx - d * R} Q${cx} ${jy} ${cx} ${jy + R} V${c.top}`; };
    setGeo({
      w: rb.width, h: rb.height,
      stem: `M${nx} ${sl.top + sl.height} V${nd.top}`,
      yes: leg(cy), no: leg(cn),
      yesX: (cy.left + cy.width / 2 + nx) / 2, noX: (cn.left + cn.width / 2 + nx) / 2, labY: jy - 16,
    });
  };
  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure); ro.observe(root.current);
    document.fonts?.ready?.then(measure);
    return () => ro.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; }, { threshold: 0.3 });
    io.observe(root.current);
    return () => io.disconnect();
  }, []);

  /* the dot that runs down the wire from the decision to the column */
  const runDot = (side) => new Promise((done) => {
    const path = wire[side].current, d = dot.current;
    if (!path || !d) { done(); return; }
    const L = path.getTotalLength();
    const place = (v) => { const p = path.getPointAtLength(L * v); d.setAttribute("cx", p.x); d.setAttribute("cy", p.y); };
    place(0); d.style.opacity = 1; t.set(0);
    animate(t, 1, { duration: 0.6, ease: [0.45, 0, 0.2, 1], onUpdate: place, onComplete: () => { d.style.opacity = 0; done(); } });
  });

  useEffect(() => {
    if (reduce) return undefined;
    let stop = false;
    const gate = async () => { while (!stop && !visible.current) await sleep(200); };
    (async () => {
      await gate(); await sleep(1700);                                           // the finished state, held for a moment
      while (!stop) {
        setFaded(true); await sleep(650);                                        // everything fades, then starts again from empty
        setLanded([]); setCur(null); setRoute(null);
        await sleep(150); setFaded(false); await sleep(900);
        for (const it of items) {
          await gate(); if (stop) return;
          setCur(it);                                                            // 1. it arrives in the slot
          await sleep(1000);
          setPulse((p) => p + 1); setRoute(it.to);                                // 2. the decision fires and the wire darkens
          await sleep(160); setCur(null);                                        // 3. the item dissolves…
          await runDot(it.to);                                                   // 4. …and a dot runs down the wire
          setLanded((l) => [it, ...l]);                                          // 5. a row is inserted at the top, the rest spring down
          await sleep(900);
        }
        await sleep(2400);
      }
    })();
    return () => { stop = true; };
  }, [items, reduce]); // eslint-disable-line react-hooks/exhaustive-deps

  const rows = Math.max(items.filter((i) => i.to === "yes").length, items.filter((i) => i.to === "no").length);
  const col = (side, cfg) => {
    const mine = landed.filter((i) => i.to === side);
    return (
      <div className="fr-col" ref={cols[side]} style={{ minHeight: 50 + rows * ROW + 12 }}>
        <div className="fr-col-head">
          <span className="fr-col-title">{cfg.icon && <i className="fr-col-icon">{cfg.icon}</i>}{cfg.title}</span>
          <span className={`fr-tag${mine.length ? " on" : ""}`}>{mine.length ? cfg.active.replace("{n}", mine.length) : cfg.idle.replace("{n}", 0)}</span>
        </div>
        <ul className="fr-rows">
          <AnimatePresence initial={false}>
            {mine.map((it) => (
              <motion.li key={it.title} layout="position" className="fr-row" style={{ height: ROW }}
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.2 } }}
                transition={{ ...SPRING, opacity: { duration: 0.22 } }}>
                <i className="fr-ico">{it.icon || "•"}</i>
                <span><b>{it.title}</b><em>{it.sub}</em></span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    );
  };

  return (
    <motion.div className="fr" ref={root} animate={{ opacity: faded ? 0 : 1 }} transition={{ duration: 0.6, ease: "easeInOut" }}
      role="img" aria-label={`${question} A flow that routes ${items.length} things to ${yes.title} or ${no.title}.`}>
      <div className="fr-slot" ref={slot}>
        <AnimatePresence>
          {cur && (
            <motion.div key={cur.title} className="fr-slot-card"
              initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.3 } }} transition={SPRING}>
              <motion.i className="fr-ico" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05, duration: 0.2 }}>{cur.icon || "•"}</motion.i>
              <motion.span initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.22 }}><b>{cur.title}</b><em>{cur.sub}</em></motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="fr-nodeRow">
        <motion.span className="fr-node" ref={nodeEl} key={pulse} initial={{ scale: pulse ? 1.1 : 1 }} animate={{ scale: 1 }} transition={SPRING}>{node}</motion.span>
        <span className="fr-q">{question}</span>
      </div>
      <div className="fr-gap" />
      <div className="fr-cols">{col("yes", yes)}{col("no", no)}</div>

      {geo && (
        <svg className="fr-wires" width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`} aria-hidden="true">
          <path d={geo.stem} className="fr-wire" /><path d={geo.yes} className="fr-wire" ref={wire.yes} /><path d={geo.no} className="fr-wire" ref={wire.no} />
          <motion.path d={geo.stem} className="fr-wire hot" initial={false} animate={{ pathLength: route ? 1 : 0 }} transition={{ duration: 0.3 }} />
          <motion.path d={geo.yes} className="fr-wire hot" initial={false} animate={{ pathLength: route === "yes" ? 1 : 0, opacity: route === "yes" ? 1 : 0 }} transition={{ duration: 0.45, ease: [0.3, 0.8, 0.3, 1] }} />
          <motion.path d={geo.no} className="fr-wire hot" initial={false} animate={{ pathLength: route === "no" ? 1 : 0, opacity: route === "no" ? 1 : 0 }} transition={{ duration: 0.45, ease: [0.3, 0.8, 0.3, 1] }} />
          <circle ref={dot} r="4.5" className="fr-dot" cx="0" cy="0" />
        </svg>
      )}
      {geo && <span className="fr-lab" style={{ left: geo.yesX, top: geo.labY }}>{yes.label || "YES"}</span>}
      {geo && <span className="fr-lab" style={{ left: geo.noX, top: geo.labY }}>{no.label || "NO"}</span>}
    </motion.div>
  );
}
