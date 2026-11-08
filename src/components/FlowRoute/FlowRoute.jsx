import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import "./FlowRoute.css";

/* A flow that plays itself, built as a small constraint system rather than a keyframed picture.
   - The cards are laid out once and stay mounted; only what sits inside them changes.
   - Nothing flies across the diagram. The step arrives in the slot, dissolves, and a dot runs down the wire to the flow card;
     when the dot arrives, the step is added to the list, in order.
   - The connectors are not animated on their own: their geometry is measured from where the slot, the decision and the
     columns actually are, and redrawn whenever the layout moves (resize, fonts), so they can never drift off their cards.
   - Timing is staggered on purpose: the arrival, the drop, the line lighting up and the landing are separate beats. */
const SPRING = { type: "spring", stiffness: 220, damping: 28, mass: 1 };          // near-critical: quick, no visible bounce
const SOFT = { type: "spring", stiffness: 170, damping: 26, mass: 1 };
const ROW = 58;                                                                  // height of one row in a column
const R = 12;                                                                    // corner radius of the connectors
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function FlowRoute({ node, title, icon, idle = "WAITING", active = "{n} STEPS", items }) {
  const reduce = useReducedMotion();
  const root = useRef(null), slot = useRef(null), nodeEl = useRef(null), dot = useRef(null), wire = useRef(null), card = useRef(null);
  const [landed, setLanded] = useState(items);                                    // it opens fully populated, like the finished state
  const [cur, setCur] = useState(null);
  const [lit, setLit] = useState(false);
  const [pulse, setPulse] = useState(0);
  const [geo, setGeo] = useState(null);
  const [faded, setFaded] = useState(false);
  const visible = useRef(false);
  const t = useMotionValue(0);

  const rel = (el) => { const a = el.getBoundingClientRect(), b = root.current.getBoundingClientRect(); return { left: a.left - b.left, top: a.top - b.top, width: a.width, height: a.height }; };

  /* the connectors, derived from where the pieces really are */
  const measure = () => {
    if (!root.current || !slot.current || !nodeEl.current || !card.current) return;
    const rb = root.current.getBoundingClientRect(), sl = rel(slot.current), nd = rel(nodeEl.current), c = rel(card.current);
    const nx = nd.left + nd.width / 2;
    setGeo({ w: rb.width, h: rb.height, stem: `M${nx} ${sl.top + sl.height} V${nd.top}`, leg: `M${nx} ${nd.top + nd.height} V${c.top}` });
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

  /* the dot that runs down the wire from the node to the card */
  const runDot = () => new Promise((done) => {
    const path = wire.current, d = dot.current;
    if (!path || !d) { done(); return; }
    const L = path.getTotalLength();
    const place = (v) => { const p = path.getPointAtLength(L * v); d.setAttribute("cx", p.x); d.setAttribute("cy", p.y); };
    place(0); d.style.opacity = 1; t.set(0);
    animate(t, 1, { duration: 0.55, ease: [0.45, 0, 0.2, 1], onUpdate: place, onComplete: () => { d.style.opacity = 0; done(); } });
  });

  useEffect(() => {
    if (reduce) return undefined;
    let stop = false;
    const gate = async () => { while (!stop && !visible.current) await sleep(200); };
    (async () => {
      await gate(); await sleep(1700);                                           // the finished state, held for a moment
      while (!stop) {
        setFaded(true); await sleep(650);                                        // everything fades, then starts again from empty
        setLanded([]); setCur(null); setLit(false);
        await sleep(150); setFaded(false); await sleep(900);
        for (const it of items) {
          await gate(); if (stop) return;
          setCur(it);                                                            // 1. a step arrives in the slot
          await sleep(1000);
          setPulse((p) => p + 1); setLit(true);                                   // 2. the node takes it and the wire darkens
          await sleep(160); setCur(null);                                        // 3. the step dissolves…
          await runDot();                                                        // 4. …and a dot runs down the wire
          setLanded((l) => [...l, it]);                                          // 5. the step is added to the flow
          await sleep(800); setLit(false);
        }
        await sleep(2400);
      }
    })();
    return () => { stop = true; };
  }, [items, reduce]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div className="fr" ref={root} animate={{ opacity: faded ? 0 : 1 }} transition={{ duration: 0.6, ease: "easeInOut" }}
      role="img" aria-label={`A user flow in ${items.length} steps: ${items.map((i) => i.title).join(", ")}.`}>
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
      </div>
      <div className="fr-gap" />
      <div className="fr-cols fr-cols--one">
        <div className="fr-col" ref={card} style={{ minHeight: 50 + items.length * ROW + 12 }}>
          <div className="fr-col-head">
            <span className="fr-col-title">{icon && <i className="fr-col-icon">{icon}</i>}{title}</span>
            <span className={`fr-tag${landed.length ? " on" : ""}`}>{landed.length ? active.replace("{n}", landed.length) : idle}</span>
          </div>
          <ul className="fr-rows">
            <AnimatePresence initial={false}>
              {landed.map((it) => (
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
      </div>

      {geo && (
        <svg className="fr-wires" width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`} aria-hidden="true">
          <path d={geo.stem} className="fr-wire" /><path d={geo.leg} className="fr-wire" ref={wire} />
          <motion.path d={geo.stem} className="fr-wire hot" initial={false} animate={{ pathLength: lit ? 1 : 0 }} transition={{ duration: 0.3 }} />
          <motion.path d={geo.leg} className="fr-wire hot" initial={false} animate={{ pathLength: lit ? 1 : 0, opacity: lit ? 1 : 0 }} transition={{ duration: 0.45, ease: [0.3, 0.8, 0.3, 1] }} />
          <circle ref={dot} r="4.5" className="fr-dot" cx="0" cy="0" />
        </svg>
      )}
    </motion.div>
  );
}
