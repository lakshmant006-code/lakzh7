import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

/* Scroll carousel: picture cards stood round a barrel in 3D. Scroll (wheel, drag, swipe or arrow keys) and the barrel turns; the cards that
   come round to the front are lit, the ones turning away dim. Tilt leans the barrel, Roll rolls it a little more the further you scroll, so it
   tumbles like a ring. Smoothness is how long the barrel takes to catch up with your scroll; Snap settles it on a card when you stop. */
const PICS = Array.from({ length: 8 }, (_, i) => `/library/art-${i + 1}.webp`);   // swap these for your own pictures
const W = 96, H = 128;                                                              // one card, before the stage scales it
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export default function ScrollCarousel({ cards = 12, radius = 210, tilt = 8, roll = 0.35, speed = 1, smoothness = 0.28, backs = 1, snap = 0 }) {
  const wrap = useRef(null), ring = useRef(null), els = useRef([]);
  const S = useRef({ a: 0, t: 0, idle: 0, drag: null, vel: 0 }), cfg = useRef({});
  const [scale, setScale] = useState(1);
  cfg.current = { cards, radius, tilt, roll, speed, smoothness, backs, snap };
  useLayoutEffect(() => { const el = wrap.current, f = () => setScale(clamp(Math.min(el.clientWidth / (radius * 2 + 120), el.clientHeight / 260), 0.35, 1.5)); f(); const ro = new ResizeObserver(f); ro.observe(el); return () => ro.disconnect(); }, [radius]);
  useEffect(() => {
    const el = wrap.current, s = S.current;
    const wheel = (e) => { e.preventDefault(); e.stopPropagation(); s.t += (Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX) * 0.004 * cfg.current.speed; s.idle = performance.now(); };
    el.addEventListener("wheel", wheel, { passive: false });
    let raf, last = performance.now();
    const frame = (now) => { raf = requestAnimationFrame(frame); const dt = Math.min(0.05, (now - last) / 1000); last = now; const c = cfg.current, step = (Math.PI * 2) / c.cards;
      if (c.snap && !s.drag && now - s.idle > 140) s.t = Math.round(s.t / step) * step;
      s.a += (s.t - s.a) * (1 - Math.exp(-dt / Math.max(0.03, c.smoothness)));
      const r = ring.current; if (!r) return;
      r.style.transform = `translateZ(${-c.radius}px) rotateX(${c.tilt}deg) rotateZ(${(s.a * c.roll * 57.3).toFixed(2)}deg) rotateY(${(-s.a * 57.3).toFixed(2)}deg)`;
      els.current.forEach((n, i) => { if (!n) return; const f = Math.cos(i * step - s.a), lit = clamp(0.28 + 0.72 * (f * 0.5 + 0.5), 0, 1);
        n.style.filter = `brightness(${lit.toFixed(3)})`; });
    };
    raf = requestAnimationFrame(frame); return () => { cancelAnimationFrame(raf); el.removeEventListener("wheel", wheel); };
  }, []);
  const down = (e) => { const s = S.current; e.currentTarget.setPointerCapture(e.pointerId); s.drag = { x: e.clientX, t0: s.t, lx: e.clientX, lt: performance.now() }; };
  const move = (e) => { const s = S.current, d = s.drag; if (!d) return; s.t = d.t0 - (e.clientX - d.x) * 0.012 * cfg.current.speed; s.vel = (e.clientX - d.lx) / Math.max(1, performance.now() - d.lt); d.lx = e.clientX; d.lt = performance.now(); };
  const up = () => { const s = S.current; if (!s.drag) return; s.t -= s.vel * 120 * 0.012 * cfg.current.speed; s.drag = null; s.idle = performance.now(); };
  const key = (e) => { const step = (Math.PI * 2) / cfg.current.cards; if (e.key === "ArrowRight" || e.key === "ArrowDown") { S.current.t += step; S.current.idle = performance.now(); e.preventDefault(); } if (e.key === "ArrowLeft" || e.key === "ArrowUp") { S.current.t -= step; S.current.idle = performance.now(); e.preventDefault(); } };
  const step = 360 / cards;
  return (
    <div ref={wrap} tabIndex={0} role="group" aria-label="Scroll carousel: scroll, drag or use the arrow keys" onKeyDown={key} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
      style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", touchAction: "none", cursor: "grab", outline: "none", display: "grid", placeItems: "center", background: "#0d0d0d", borderRadius: 10, backgroundImage: "linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)", backgroundSize: "24px 24px" }}>
      <div style={{ width: 0, height: 0, perspective: 900 * scale, perspectiveOrigin: "50% 50%", transform: `scale(${scale})`, transformOrigin: "center", pointerEvents: "none" }}>
        <div ref={ring} style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, transformStyle: "preserve-3d", transform: `translateZ(${-radius}px)` }}>
          {Array.from({ length: cards }, (_, i) => (
            <div key={i} ref={(n) => (els.current[i] = n)} style={{ position: "absolute", left: -W / 2, top: -H / 2, width: W, height: H, borderRadius: 7, overflow: "hidden", transform: `rotateY(${i * step}deg) translateZ(${radius}px)`, backfaceVisibility: backs ? "visible" : "hidden", WebkitBackfaceVisibility: backs ? "visible" : "hidden", backgroundImage: `url(${PICS[i % PICS.length]})`, backgroundSize: "cover", backgroundPosition: "center", boxShadow: "0 6px 18px rgba(0,0,0,.45)" }} />
          ))}
        </div>
      </div>
    </div>
  );
}
