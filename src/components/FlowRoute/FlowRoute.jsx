import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import "./FlowRoute.css";

/* A flow that plays itself, built as a small constraint system rather than a keyframed picture.
   - The cards are laid out once and stay mounted; only what sits inside them changes.
   - The traveller (the item in motion) is one element on springs: it keeps its velocity when its target changes, so each
     leg of the trip flows into the next. It never restarts from rest.
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
  const root = useRef(null), slot = useRef(null), nodeEl = useRef(null);
  const cols = { yes: useRef(null), no: useRef(null) }, lists = { yes: useRef(null), no: useRef(null) };
  const [landed, setLanded] = useState(() => (reduce ? items : []));
  const [cur, setCur] = useState(null);
  const [route, setRoute] = useState(null);
  const [pulse, setPulse] = useState(0);
  const [geo, setGeo] = useState(null);
  const visible = useRef(false);
  const x = useMotionValue(0), y = useMotionValue(0), w = useMotionValue(300), h = useMotionValue(60), o = useMotionValue(0), s = useMotionValue(1);

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

  useEffect(() => {
    if (reduce) return undefined;
    let stop = false;
    const gate = async () => { while (!stop && !visible.current) await sleep(200); };
    (async () => {
      await sleep(400);
      while (!stop) {
        const count = { yes: 0, no: 0 };
        for (const it of items) {
          await gate(); if (stop) return;
          const sl = rel(slot.current), nd = rel(nodeEl.current);
          setCur(it);                                                            // 1. it arrives in the slot
          x.set(sl.left); y.set(sl.top); w.set(sl.width); h.set(sl.height); s.set(0.94); o.set(0);
          animate(o, 1, { duration: 0.2 }); animate(s, 1, SPRING);
          await sleep(640);
          animate(x, nd.left + nd.width / 2 - 56, SPRING); animate(y, nd.top + nd.height / 2 - 17, SPRING);   // 2. it drops into the decision
          animate(w, 112, SPRING); animate(h, 34, SPRING); animate(s, 0.92, SPRING);
          await sleep(340);
          setPulse((p) => p + 1); setRoute(it.to);                                // 3. the decision fires and the line lights up
          await sleep(220);
          const ul = rel(lists[it.to].current), n = count[it.to]++;               // 4. it carries on, on the same spring, to its row
          animate(x, ul.left + 14, SOFT); animate(y, ul.top + 4 + n * ROW, SOFT);
          animate(w, ul.width - 28, SOFT); animate(h, ROW - 6, SOFT); animate(s, 1, SOFT);
          await sleep(520);
          setLanded((l) => [...l, it]);                                          // 5. the row takes over from the traveller
          animate(o, 0, { duration: 0.18 });
          await sleep(300); setRoute(null);
        }
        await sleep(2600);
        setLanded([]); setCur(null);
        await sleep(1000);
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
        <ul className="fr-rows" ref={lists[side]}>
          <AnimatePresence initial={false}>
            {mine.map((it) => (
              <motion.li key={it.title} className="fr-row" style={{ height: ROW }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.25 } }} transition={{ duration: 0.18 }}>
                <motion.i className="fr-ico" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.04 }}>{it.icon || "•"}</motion.i>
                <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.09 }}><b>{it.title}</b><em>{it.sub}</em></motion.span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    );
  };

  return (
    <div className="fr" ref={root} role="img" aria-label={`${question} A flow that routes ${items.length} things to ${yes.title} or ${no.title}.`}>
      <div className="fr-slot" ref={slot} />
      <div className="fr-nodeRow">
        <motion.span className="fr-node" ref={nodeEl} key={pulse} initial={{ scale: pulse ? 1.1 : 1 }} animate={{ scale: 1 }} transition={SPRING}>{node}</motion.span>
        <span className="fr-q">{question}</span>
      </div>
      <div className="fr-gap" />
      <div className="fr-cols">{col("yes", yes)}{col("no", no)}</div>

      {geo && (
        <svg className="fr-wires" width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`} aria-hidden="true">
          <path d={geo.stem} className="fr-wire" /><path d={geo.yes} className="fr-wire" /><path d={geo.no} className="fr-wire" />
          <motion.path d={geo.stem} className="fr-wire hot" initial={false} animate={{ pathLength: route ? 1 : 0 }} transition={{ duration: 0.3 }} />
          <motion.path d={geo.yes} className="fr-wire hot" initial={false} animate={{ pathLength: route === "yes" ? 1 : 0, opacity: route === "yes" ? 1 : 0 }} transition={{ duration: 0.5, ease: [0.3, 0.8, 0.3, 1] }} />
          <motion.path d={geo.no} className="fr-wire hot" initial={false} animate={{ pathLength: route === "no" ? 1 : 0, opacity: route === "no" ? 1 : 0 }} transition={{ duration: 0.5, ease: [0.3, 0.8, 0.3, 1] }} />
        </svg>
      )}
      {geo && <span className="fr-lab" style={{ left: geo.yesX, top: geo.labY }}>{yes.label || "YES"}</span>}
      {geo && <span className="fr-lab" style={{ left: geo.noX, top: geo.labY }}>{no.label || "NO"}</span>}

      <motion.div className="fr-trav" style={{ x, y, width: w, height: h, opacity: o, scale: s }} aria-hidden="true">
        {cur && <><i className="fr-ico">{cur.icon || "•"}</i><span><b>{cur.title}</b><em>{cur.sub}</em></span></>}
      </motion.div>
    </div>
  );
}
