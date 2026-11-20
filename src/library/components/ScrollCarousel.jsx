import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

/* Scroll carousel: picture cards stood round a 3D barrel. Scroll (wheel, drag, swipe or arrow keys) and the barrel turns; the cards that
   come round to the front are lit, the ones turning away dim. Rotation X and Z lean the whole barrel (Z is what makes it run diagonally),
   Gap spaces the cards round it, Perspective is how strong the depth is, Ratio how far one scroll turns it. Vertical turns it about its
   other axis, Infinite lets it spin round forever (off: it stops at the first and last card), Animate keeps it drifting when you are not
   scrolling, Backface shows the backs of cards, Sort them keeps the pictures in order, Debug draws the scroll area. */
const PICS = Array.from({ length: 8 }, (_, i) => `/library/art-${i + 1}.webp`);   // swap these for your own pictures
const W = 96, H = 128;                                                              // one card, before the stage scales it
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const SHUFFLE = [3, 6, 1, 7, 0, 4, 2, 5];

export default function ScrollCarousel({ animate = 0, vertical = 0, infinite = 1, ratio = 1, rotX = 15, rotZ = 37, backface = 1, perspective = 900, gap = 0.1, items = 16, sort = 1, debug = 0, smoothness = 0.28, snap = 0 }) {
  const wrap = useRef(null), ring = useRef(null), els = useRef([]);
  const S = useRef({ a: 0, t: 0, idle: 0, drag: null, vel: 0 }), cfg = useRef({});
  const [scale, setScale] = useState(1);
  const half = (vertical ? H : W) / 2, radius = Math.round(half / Math.tan(Math.PI / items) * (1 + gap));
  cfg.current = { animate, vertical, infinite, ratio, rotX, rotZ, backface, perspective, gap, items, sort, debug, smoothness, snap, radius };
  useLayoutEffect(() => { const el = wrap.current, f = () => setScale(clamp(Math.min(el.clientWidth / (radius * 2 + 130), el.clientHeight / 300), 0.3, 1.5)); f(); const ro = new ResizeObserver(f); ro.observe(el); return () => ro.disconnect(); }, [radius]);
  useEffect(() => {
    const el = wrap.current, s = S.current;
    const add = (d) => { const c = cfg.current, lim = ((c.items - 1) * Math.PI * 2) / c.items; s.t += d; if (!c.infinite) s.t = clamp(s.t, 0, lim); s.idle = performance.now(); };
    const wheel = (e) => { e.preventDefault(); e.stopPropagation(); add((Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX) * 0.004 * cfg.current.ratio); };
    el.addEventListener("wheel", wheel, { passive: false });
    let raf, last = performance.now();
    const frame = (now) => { raf = requestAnimationFrame(frame); const dt = Math.min(0.05, (now - last) / 1000); last = now; const c = cfg.current, step = (Math.PI * 2) / c.items;
      if (c.animate && !s.drag && now - s.idle > 900) s.t += dt * 0.35;
      if (c.snap && !s.drag && now - s.idle > 140) s.t = Math.round(s.t / step) * step;
      s.a += (s.t - s.a) * (1 - Math.exp(-dt / Math.max(0.03, c.smoothness)));
      const r = ring.current; if (!r) return;
      r.style.transform = `translateZ(${-c.radius}px) rotateZ(${c.rotZ}deg) rotateX(${c.rotX}deg) ${c.vertical ? `rotateX(${(s.a * 57.3).toFixed(2)}deg)` : `rotateY(${(-s.a * 57.3).toFixed(2)}deg)`}`;
      els.current.forEach((n, i) => { if (!n) return; const f = Math.cos(i * step - s.a), lit = clamp(0.28 + 0.72 * (f * 0.5 + 0.5), 0, 1);
        n.style.filter = `brightness(${lit.toFixed(3)})`; });
    };
    raf = requestAnimationFrame(frame); return () => { cancelAnimationFrame(raf); el.removeEventListener("wheel", wheel); };
  }, []);
  const down = (e) => { const s = S.current; e.currentTarget.setPointerCapture(e.pointerId); s.drag = { p: cfg.current.vertical ? e.clientY : e.clientX, t0: s.t, lp: cfg.current.vertical ? e.clientY : e.clientX, lt: performance.now() }; };
  const move = (e) => { const s = S.current, d = s.drag; if (!d) return; const c = cfg.current, pos = c.vertical ? e.clientY : e.clientX, lim = ((c.items - 1) * Math.PI * 2) / c.items;
    s.t = d.t0 - (pos - d.p) * 0.012 * c.ratio; if (!c.infinite) s.t = clamp(s.t, 0, lim); s.vel = (pos - d.lp) / Math.max(1, performance.now() - d.lt); d.lp = pos; d.lt = performance.now(); };
  const up = () => { const s = S.current; if (!s.drag) return; const c = cfg.current, lim = ((c.items - 1) * Math.PI * 2) / c.items; s.t -= s.vel * 120 * 0.012 * c.ratio; if (!c.infinite) s.t = clamp(s.t, 0, lim); s.drag = null; s.idle = performance.now(); };
  const key = (e) => { const step = (Math.PI * 2) / cfg.current.items, k = e.key; if (["ArrowRight", "ArrowDown"].includes(k)) { e.preventDefault(); const c = cfg.current; S.current.t = c.infinite ? S.current.t + step : clamp(S.current.t + step, 0, (c.items - 1) * step); S.current.idle = performance.now(); } if (["ArrowLeft", "ArrowUp"].includes(k)) { e.preventDefault(); const c = cfg.current; S.current.t = c.infinite ? S.current.t - step : clamp(S.current.t - step, 0, (c.items - 1) * step); S.current.idle = performance.now(); } };
  const step = 360 / items;
  return (
    <div ref={wrap} tabIndex={0} role="group" aria-label="Scroll carousel: scroll, drag or use the arrow keys" onKeyDown={key} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
      style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", touchAction: "none", cursor: "grab", outline: "none", display: "grid", placeItems: "center", background: "#0d0d0d", borderRadius: 10, backgroundImage: "linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)", backgroundSize: "24px 24px" }}>
      {debug ? <>
        <i style={{ position: "absolute", left: 0, right: 0, top: "34%", height: 0, borderTop: "1px dashed #ff2b2b", pointerEvents: "none" }} /><i style={{ position: "absolute", left: 0, right: 0, bottom: "14%", height: 0, borderTop: "1px dashed #ff2b2b", pointerEvents: "none" }} />
        {[8, 28, 50, 72].map((x) => <i key={x} style={{ position: "absolute", top: "34%", bottom: "14%", left: x + "%", width: 0, borderLeft: "1px dashed #ff2b2b", pointerEvents: "none" }} />)}
      </> : null}
      <span aria-hidden="true" style={{ position: "absolute", right: 14, bottom: 18, writingMode: "vertical-rl", transform: "rotate(180deg)", font: "700 15px/1 system-ui, sans-serif", letterSpacing: "-.01em", color: "rgba(255,255,255,.55)", pointerEvents: "none" }}>scroll.</span>
      <div style={{ width: 0, height: 0, perspective: perspective * scale, perspectiveOrigin: "50% 50%", transform: `scale(${scale})`, transformOrigin: "center", pointerEvents: "none" }}>
        <div ref={ring} style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, transformStyle: "preserve-3d", transform: `translateZ(${-radius}px)` }}>
          {Array.from({ length: items }, (_, i) => (
            <div key={i} ref={(n) => (els.current[i] = n)} style={{ position: "absolute", left: -W / 2, top: -H / 2, width: W, height: H, borderRadius: 7, overflow: "hidden", transform: `${vertical ? "rotateX" : "rotateY"}(${i * step}deg) translateZ(${radius}px)`, backfaceVisibility: backface ? "visible" : "hidden", WebkitBackfaceVisibility: backface ? "visible" : "hidden", backgroundImage: `url(${PICS[(sort ? i : SHUFFLE[i % 8] + Math.floor(i / 8)) % PICS.length]})`, backgroundSize: "cover", backgroundPosition: "center", boxShadow: "0 6px 18px rgba(0,0,0,.45)" }} />
          ))}
        </div>
      </div>
    </div>
  );
}
