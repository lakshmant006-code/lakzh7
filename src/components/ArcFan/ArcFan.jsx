import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import "./ArcFan.css";

/* A hand of photos fanned out along a semicircle. Move across it (or drag a finger across it) and the card under the pointer lifts out
   of the fan, straightens up and gets a name tag; its neighbours step aside to make room, and everything settles back when you leave. */
const SPAN = 132;                                                     // degrees the whole fan covers, left to right
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

  // sizes follow the width of the page: the fan is a bit under a semicircle of cards, each card about a sixth of the width
  const g = useMemo(() => {
    const cw = Math.max(64, Math.min(132, w * 0.15)), ch = cw * 1.32, r0 = cw * 1.0, padB = ch * 0.55;
    const angles = photos.map((_, i) => (n === 1 ? 0 : -SPAN / 2 + (SPAN * i) / (n - 1)));
    return { cw, ch, r0, padB, angles, height: ch * 1.45 + r0 + padB + 40 };
  }, [w, n, photos]);

  const pose = (i) => {
    const th = g.angles[i];
    if (!open) return { x: 0, y: 0, rotate: 0, scale: 0.7, opacity: 0 };
    let rot = th, lift = 0, scale = 1;
    if (active !== null) {
      const d = i - active, step = SPAN / (n - 1);
      if (d === 0) { rot = th * 0.3; lift = g.ch * 0.2; scale = 1.22; }
      else rot = th + Math.sign(d) * Math.min(16, 26 / Math.abs(d + 0.0001) ** 0.9) * (step / 18);   // neighbours step aside, the further the less
    }
    const rad = (th * Math.PI) / 180, r = g.r0 + lift;
    return { x: Math.sin(rad) * r, y: -Math.cos(rad) * r * 0.92, rotate: rot, scale, opacity: 1 };
  };

  // which card is the pointer over: the one whose direction (seen from the centre of the fan) is closest
  const pick = useCallback((e) => {
    const rect = box.current.getBoundingClientRect();
    const px = e.clientX - (rect.left + rect.width / 2), py = rect.bottom - g.padB - e.clientY;
    if (py < -g.padB - 10 || py > rect.height + 20) return null;
    let ang = (Math.atan2(px, Math.max(py, 1)) * 180) / Math.PI;
    ang = Math.max(-SPAN / 2, Math.min(SPAN / 2, ang * 1.0));
    let best = 0, bd = 1e9;
    g.angles.forEach((a, i) => { const d = Math.abs(a - ang); if (d < bd) { bd = d; best = i; } });
    return best;
  }, [g]);

  const onMove = (e) => { clearTimeout(leaveTimer.current); setActive(pick(e)); };
  const onLeave = (e) => { if (e.pointerType && e.pointerType !== "mouse") return;      // a finger lifting also "leaves": that is handled by onUp
    clearTimeout(leaveTimer.current); leaveTimer.current = setTimeout(() => setActive(null), 80); };
  const onUp = (e) => { if (e.pointerType !== "mouse") { clearTimeout(leaveTimer.current); leaveTimer.current = setTimeout(() => setActive(null), 1400); } };
  useEffect(() => () => clearTimeout(leaveTimer.current), []);

  const tip = active === null ? null : (() => {
    const p = pose(active), rad = (g.angles[active] * Math.PI) / 180;
    const reach = g.ch * p.scale + 10;
    return { x: p.x + Math.sin(rad * 0.3) * reach, y: p.y - Math.cos(rad * 0.3) * reach };
  })();

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
        animate={tip ? { x: tip.x, y: tip.y, opacity: 1, scale: 1 } : { x: 0, y: -g.r0, opacity: 0, scale: 0.85 }} transition={reduced ? { duration: 0.1 } : { ...SPRING, stiffness: 420 }}>
        {active !== null ? photos[active].caption : ""}
      </motion.span>
    </div>
  );
}
