import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import "./ArcFan.css";

/* A row of photos laid out in a straight line. Move across it (or drag a finger across it) and the card under the pointer lifts out of the
   row and gets a name tag; its neighbours step aside to make room, and everything settles back when you leave. */
const SPRING = { type: "spring", stiffness: 320, damping: 27, mass: 0.9 };

export default function ArcFan({ photos, label = "Photos" }) {
  const reduced = useReducedMotion();
  const box = useRef(null);
  const [w, setW] = useState(720);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const leaveTimer = useRef(0);
  const n = photos.length;

  useEffect(() => {
    const el = box.current; if (!el) return undefined;
    const ro = new ResizeObserver(() => setW(el.clientWidth || 720));
    ro.observe(el); setW(el.clientWidth || 720);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOpen(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el);
    return () => { ro.disconnect(); io.disconnect(); };
  }, []);

  // sizes follow the width of the page: each card about a seventh of the width, the row as wide as fits
  const g = useMemo(() => {
    const cw = Math.max(60, Math.min(128, w * 0.14)), ch = cw * 1.32, padB = ch * 0.3;
    const pitch = n === 1 ? 0 : Math.min(cw * 1.14, (w * 0.94 - cw) / (n - 1)), half = n === 1 ? 1 : ((n - 1) * pitch) / 2 + cw / 2;
    const xs = photos.map((_, i) => (i - (n - 1) / 2) * pitch);
    return { cw, ch, pitch, padB, xs, half, height: ch * 1.5 + padB + 44 };
  }, [w, n, photos]);

  const pose = (i) => {
    if (!open) return { x: g.xs[i], y: 14, rotate: 0, scale: 0.7, opacity: 0, filter: "blur(6px)" };
    let x = g.xs[i], lift = 0, scale = 1;
    if (active !== null) {
      const d = i - active;
      if (d === 0) { lift = g.ch * 0.22; scale = 1.22; }
      else x += Math.sign(d) * (g.cw * 0.42) / Math.abs(d) ** 0.9;                   // neighbours step aside, the further the less
    }
    // the cards at either end dissolve into the page: soft and a little faint, sharp again when the pointer is on them
    const edge = Math.abs(g.xs[i]) / (g.half || 1), soft = active === i ? 0 : edge ** 3 * (active === null ? 3 : 2.2);
    return { x, y: -lift, rotate: 0, scale, opacity: active === i ? 1 : 1 - 0.4 * edge ** 3, filter: `blur(${soft.toFixed(2)}px)` };
  };

  // which card is the pointer over: the one whose slot in the row is closest to it sideways
  const pick = useCallback((e) => {
    const rect = box.current.getBoundingClientRect();
    const px = e.clientX - (rect.left + rect.width / 2), py = rect.bottom - e.clientY;
    if (py < -10 || py > rect.height + 20) return null;
    let best = 0, bd = 1e9;
    g.xs.forEach((x, i) => { const d = Math.abs(x - px); if (d < bd) { bd = d; best = i; } });
    return best;
  }, [g]);

  const onMove = (e) => { clearTimeout(leaveTimer.current); setActive(pick(e)); };
  const onLeave = (e) => { if (e.pointerType && e.pointerType !== "mouse") return;      // a finger lifting also "leaves": that is handled by onUp
    clearTimeout(leaveTimer.current); leaveTimer.current = setTimeout(() => setActive(null), 80); };
  const onUp = (e) => { if (e.pointerType !== "mouse") { clearTimeout(leaveTimer.current); leaveTimer.current = setTimeout(() => setActive(null), 1400); } };
  useEffect(() => () => clearTimeout(leaveTimer.current), []);

  const tip = active === null ? null : (() => { const p = pose(active); return { x: p.x, y: p.y - g.ch * p.scale - 10 }; })();

  return (
    <div className="arcfan" ref={box} style={{ height: g.height }} role="group" aria-label={label}
      onPointerMove={onMove} onPointerDown={onMove} onPointerUp={onUp} onPointerLeave={onLeave} onPointerCancel={onLeave}>
      {photos.map((p, i) => {
        const t = pose(i);
        return (
          <motion.button key={p.src} type="button" className="arcfan-card" aria-label={p.caption || p.alt}
            style={{ width: g.cw, height: g.ch, marginLeft: -g.cw / 2, bottom: g.padB, zIndex: active === i ? 50 : i + 1, transformOrigin: "50% 100%" }}
            initial={false} animate={t} transition={reduced ? { duration: 0.12 } : { ...SPRING, delay: open && active === null ? 0.04 * i : 0 }}
            onFocus={() => setActive(i)} onBlur={() => setActive(null)}>
            <img src={p.src} alt={p.alt} draggable="false" loading="lazy" decoding="async" />
          </motion.button>
        );
      })}
      <motion.span className="arcfan-tag" aria-hidden="true" initial={false} style={{ bottom: g.padB }}
        animate={tip ? { x: tip.x, y: tip.y, opacity: 1, scale: 1 } : { x: 0, y: -g.ch, opacity: 0, scale: 0.85 }} transition={reduced ? { duration: 0.1 } : { ...SPRING, stiffness: 420 }}>
        {active !== null ? photos[active].caption : ""}
      </motion.span>
    </div>
  );
}
