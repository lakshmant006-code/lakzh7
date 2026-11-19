import React, { useEffect, useRef } from "react";

/* Scroll parallax: a strip of picture cards you scroll sideways. Each picture slides inside its frame as the card passes through the middle,
   so the pictures seem to sit behind the frames. Cards snap to the centre and, where the browser can (-webkit-box-reflect), reflect below.
   Travel is how far the picture moves; Gap and Padding space the strip; Animate turns the parallax off. */
const SCENES = [
  "linear-gradient(180deg, #e9ddc8 0 45%, #cdb892 45% 100%)", "linear-gradient(160deg, #ffffff, #dfe6ee 60%, #c9d4e0)", "radial-gradient(circle at 50% 30%, #6fbf5a 0 22%, transparent 23%), radial-gradient(circle at 30% 55%, #3f8f3a 0 18%, transparent 19%), radial-gradient(circle at 70% 55%, #4da542 0 18%, transparent 19%), linear-gradient(180deg, #2d3b2d, #8a6a45)",
  "linear-gradient(180deg, #cfe9ff 0 55%, #8fb7d8 55% 70%, #e9f3fb 70%)", "radial-gradient(ellipse at 50% 60%, #fff 0 18%, transparent 19%), linear-gradient(90deg, #1c2a1b 0 40%, #9bd08a 40% 55%, #1c2a1b 55%)", "linear-gradient(200deg, #ffffff 0 30%, #dbe8f8 30% 45%, #2f55c9 45% 60%, #ffffff 60% 70%, #1d3a99 70%)", "linear-gradient(180deg, #ffb27a, #ff6a3d 55%, #7a2d1c)", "linear-gradient(160deg, #b9e3d6, #4f8f9c 60%, #223d52)",
];

export default function ScrollParallax({ travel = 0.75, gap = 1.5, padding = 1.5, reflect = 1, animate = 1, cards = 8 }) {
  const box = useRef(null), imgs = useRef([]);
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
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", alignItems: "center", background: "transparent" }}>
      <div ref={box} style={{ display: "flex", gap: `${gap}rem`, overflowX: "auto", overflowY: "hidden", scrollSnapType: "x mandatory", scrollbarWidth: "none", padding: `1.2rem calc(50% - 3.1rem)`, paddingInline: `max(${padding}rem, calc(50% - 3.1rem))`, WebkitOverflowScrolling: "touch" }}>
        {Array.from({ length: cards }, (_, i) => (
          <div key={i} style={{ flex: "none", width: "6.2rem", height: "8.2rem", borderRadius: 8, overflow: "hidden", scrollSnapAlign: "center", position: "relative", background: "#111", boxShadow: "0 8px 22px rgba(0,0,0,.35)", WebkitBoxReflect: reflect ? "below 4px linear-gradient(transparent 62%, rgba(255,255,255,.26))" : "none" }}>
            <div ref={(n) => (imgs.current[i] = n)} style={{ position: "absolute", inset: 0, background: SCENES[i % SCENES.length], willChange: "transform" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
