import React, { useEffect, useRef } from "react";

/* Scroll parallax: a strip of picture cards you scroll sideways. Each picture slides inside its frame as the card passes through the middle,
   so the pictures seem to sit behind the frames. Cards snap to the centre and, where the browser can (-webkit-box-reflect), reflect below.
   Travel is how far the picture moves; Gap and Padding space the strip; Animate turns the parallax off. */
const PICS = Array.from({ length: 8 }, (_, i) => `/library/art-${i + 1}.webp`);   // swap these for your own pictures

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
            <div ref={(n) => (imgs.current[i] = n)} style={{ position: "absolute", inset: 0, backgroundImage: `url(${PICS[i % PICS.length]})`, backgroundSize: "cover", backgroundPosition: "center", willChange: "transform" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
