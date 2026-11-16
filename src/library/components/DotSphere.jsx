import React, { useEffect, useRef } from "react";

/* Dot sphere: a ball made of dots that turns on its own. Move over it and it swirls toward your pointer, and the dots jitter, most of all
   right under the pointer. */
export default function DotSphere({ density = 22, speed = 6, size = 70, jitter = 5 }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current, ctx = cv.getContext("2d"); let raf, a = 0, mx = 0, my = 0, w = 0, h = 0, px = -1e4, py = -1e4, hov = 0, over = false;
    const fit = () => { const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2); w = r.width; h = r.height; cv.width = w * d; cv.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
    fit(); const ro = new ResizeObserver(fit); ro.observe(cv);
    const pts = []; for (let i = 0; i < density; i++) { const lat = Math.PI * (i + 0.5) / density - Math.PI / 2, n = Math.max(4, Math.round(density * 1.6 * Math.cos(lat)));
      for (let j = 0; j < n; j++) pts.push([lat, (j / n) * Math.PI * 2]); }
    const frame = () => { raf = requestAnimationFrame(frame); a += speed * 0.0015; ctx.clearRect(0, 0, w, h); const R = Math.min(w, h) * size / 200;
      hov += ((over ? 1 : 0) - hov) * 0.12;                                        // eases in and out as the pointer arrives and leaves
      for (const [lat, lon0] of pts) { const lon = lon0 + a + mx * 0.6, x = Math.cos(lat) * Math.cos(lon), y = Math.sin(lat) + my * 0.2, z = Math.cos(lat) * Math.sin(lon);
        let sx = w / 2 + x * R, sy = h / 2 + y * R; const k = (z + 1) / 2;
        // jitter: every dot shakes a little while you hover, and the ones near the pointer shake hard and glow
        const near = Math.max(0, 1 - Math.hypot(sx - px, sy - py) / (R * 0.55)), amp = jitter * hov * (0.25 + near * 1.6);
        sx += (Math.random() - 0.5) * amp; sy += (Math.random() - 0.5) * amp;
        ctx.fillStyle = `rgba(255,255,255,${Math.min(1, 0.12 + k * 0.88 + near * hov * 0.5)})`; ctx.beginPath(); ctx.arc(sx, sy, 0.7 + k * 1.6 + near * hov * 1.1, 0, 6.2832); ctx.fill(); } };
    frame();
    const mv = (e) => { const r = cv.getBoundingClientRect(); px = e.clientX - r.left; py = e.clientY - r.top; mx = (px / r.width - 0.5) * 2; my = (py / r.height - 0.5) * 2;
      const R = Math.min(r.width, r.height) * size / 200; over = Math.hypot(px - r.width / 2, py - r.height / 2) < R * 1.08; };   // hovering means over the ball itself
    const out = () => { over = false; px = py = -1e4; };
    cv.addEventListener("pointermove", mv); cv.addEventListener("pointerleave", out);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); cv.removeEventListener("pointermove", mv); cv.removeEventListener("pointerleave", out); };
  }, [density, speed, size, jitter]);
  return <canvas ref={ref} style={{ width: "100%", height: "100%", display: "block" }} />;
}
