import React, { useEffect, useRef } from "react";

/* Scroll parallax: a strip of picture cards you scroll sideways. Each picture slides inside its frame as the card passes through the middle,
   so the pictures seem to sit behind the frames. Cards snap to the centre and, where the browser can (-webkit-box-reflect), reflect below.
   Travel is how far the picture moves; Gap and Padding space the strip; Animate turns the parallax off.
   It is scroll driven: the mouse wheel or trackpad (up and down too) and dragging with the mouse move the strip, easing after you (Smoothness is how long it
   takes to catch up, Ratio how far one scroll goes), and Snap settles it on the nearest card. Scroll drive off leaves only the browser's own sideways scroll. */
const PICS = Array.from({ length: 8 }, (_, i) => `/library/art-${i + 1}.webp`);   // swap these for your own pictures

export default function ScrollParallax({ travel = 0.75, gap = 1.5, padding = 1.5, reflect = 1, animate = 1, cards = 8, drive = 1, ratio = 1, smoothness = 0.22, snap = 1 }) {
  const box = useRef(null), imgs = useRef([]), cfg = useRef({});
  cfg.current = { drive, ratio, smoothness, snap };
  useEffect(() => {
    const el = box.current; let raf = 0;
    const update = () => { raf = 0; const r = el.getBoundingClientRect(), mid = r.left + r.width / 2;
      imgs.current.forEach((img) => { if (!img) return; const c = img.parentNode.getBoundingClientRect(), p = (c.left + c.width / 2 - mid) / (r.width / 2);   // -1 at the left edge, 0 in the middle, 1 at the right
        img.style.transform = animate ? `translateX(${(-p * travel * 32).toFixed(2)}%) scale(${1.45})` : "scale(1.45)"; }); };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update(); el.addEventListener("scroll", on, { passive: true }); const ro = new ResizeObserver(on); ro.observe(el);
    // start in the middle of the strip
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2; update();
    return () => { cancelAnimationFrame(raf); el.removeEventListener("scroll", on); ro.disconnect(); };
  }, [travel, animate, cards]);
  // scroll drive: wheel and mouse drag set a target; the strip eases to it frame by frame, then settles on a card
  useEffect(() => {
    const el = box.current, S = { t: el.scrollLeft, idle: 0, drag: null, own: false };
    const max = () => el.scrollWidth - el.clientWidth, clamp = (v) => Math.max(0, Math.min(max(), v));
    const wheel = (e) => { const c = cfg.current; if (!c.drive) return; const d = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if ((d < 0 && el.scrollLeft <= 0) || (d > 0 && el.scrollLeft >= max() - 1)) return;       // at the end: let the page scroll on
      e.preventDefault(); e.stopPropagation(); S.t = clamp((S.own ? S.t : el.scrollLeft) + d * c.ratio); S.own = true; S.idle = performance.now(); };
    const near = () => { const r = el.getBoundingClientRect(), mid = r.left + r.width / 2; let best = 0, bd = 1e9; [...el.children].forEach((k) => { const b = k.getBoundingClientRect(), d = b.left + b.width / 2 - mid; if (Math.abs(d) < Math.abs(bd)) { bd = d; best = d; } }); return best; };
    const down = (e) => { if (!cfg.current.drive || e.pointerType !== "mouse") return; S.drag = { x: e.clientX, s: el.scrollLeft }; S.own = true; S.t = el.scrollLeft; el.setPointerCapture(e.pointerId); el.style.cursor = "grabbing"; };
    const move = (e) => { if (!S.drag) return; S.t = clamp(S.drag.s - (e.clientX - S.drag.x)); S.idle = performance.now(); };
    const up = () => { if (!S.drag) return; S.drag = null; el.style.cursor = ""; S.idle = performance.now(); };
    const native = () => { if (!S.own) S.t = el.scrollLeft; };
    el.addEventListener("wheel", wheel, { passive: false }); el.addEventListener("pointerdown", down); el.addEventListener("pointermove", move); el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up); el.addEventListener("scroll", native, { passive: true });
    let raf, last = performance.now();
    const frame = (now) => { raf = requestAnimationFrame(frame); const dt = Math.min(0.05, (now - last) / 1000), c = cfg.current; last = now;
      if (!S.own) return;
      if (c.snap && !S.drag && now - S.idle > 140) { S.t = clamp(el.scrollLeft + near()); S.idle = now + 1e9; }   // settle on the nearest card once
      const diff = S.t - el.scrollLeft; el.style.scrollSnapType = "none";
      if (Math.abs(diff) < 0.4) { el.scrollLeft = S.t; if (!S.drag && now - S.idle > 1e8 - 1) { S.own = false; el.style.scrollSnapType = ""; } return; }
      el.scrollLeft += diff * (1 - Math.exp(-dt / Math.max(0.02, c.smoothness))); };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); el.removeEventListener("wheel", wheel); el.removeEventListener("pointerdown", down); el.removeEventListener("pointermove", move); el.removeEventListener("pointerup", up); el.removeEventListener("pointercancel", up); el.removeEventListener("scroll", native); };
  }, []);
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", alignItems: "center", background: "transparent" }}>
      <div ref={box} style={{ display: "flex", gap: `${gap}rem`, overflowX: "auto", overflowY: "hidden", scrollSnapType: snap ? "x mandatory" : "none", touchAction: "pan-x", userSelect: "none", scrollbarWidth: "none", padding: `1.2rem calc(50% - 3.1rem)`, paddingInline: `max(${padding}rem, calc(50% - 3.1rem))`, WebkitOverflowScrolling: "touch" }}>
        {Array.from({ length: cards }, (_, i) => (
          <div key={i} style={{ flex: "none", width: "6.2rem", height: "8.2rem", borderRadius: 8, overflow: "hidden", scrollSnapAlign: "center", position: "relative", background: "#111", boxShadow: "0 8px 22px rgba(0,0,0,.35)", WebkitBoxReflect: reflect ? "below 4px linear-gradient(transparent 62%, rgba(255,255,255,.26))" : "none" }}>
            <div ref={(n) => (imgs.current[i] = n)} style={{ position: "absolute", inset: 0, backgroundImage: `url(${PICS[i % PICS.length]})`, backgroundSize: "cover", backgroundPosition: "center", willChange: "transform" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
