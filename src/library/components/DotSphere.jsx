import React, { useEffect, useRef } from "react";

/* Dot sphere: a ball made of dots that turns on its own and swirls toward your pointer. */
export default function DotSphere({ density = 22, speed = 6, size = 70 }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current, ctx = cv.getContext("2d"); let raf, a = 0, mx = 0, my = 0, w = 0, h = 0;
    const fit = () => { const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2); w = r.width; h = r.height; cv.width = w * d; cv.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
    fit(); const ro = new ResizeObserver(fit); ro.observe(cv);
    const pts = []; for (let i = 0; i < density; i++) { const lat = Math.PI * (i + 0.5) / density - Math.PI / 2, n = Math.max(4, Math.round(density * 1.6 * Math.cos(lat)));
      for (let j = 0; j < n; j++) pts.push([lat, (j / n) * Math.PI * 2]); }
    const frame = () => { raf = requestAnimationFrame(frame); a += speed * 0.0015; ctx.clearRect(0, 0, w, h); const R = Math.min(w, h) * size / 200;
      for (const [lat, lon0] of pts) { const lon = lon0 + a + mx * 0.6, x = Math.cos(lat) * Math.cos(lon), y = Math.sin(lat) + my * 0.2, z = Math.cos(lat) * Math.sin(lon);
        const k = (z + 1) / 2; ctx.fillStyle = `rgba(255,255,255,${0.12 + k * 0.88})`; ctx.beginPath(); ctx.arc(w / 2 + x * R, h / 2 + y * R, 0.7 + k * 1.6, 0, 6.2832); ctx.fill(); } };
    frame();
    const mv = (e) => { const r = cv.getBoundingClientRect(); mx = ((e.clientX - r.left) / r.width - 0.5) * 2; my = ((e.clientY - r.top) / r.height - 0.5) * 2; };
    cv.addEventListener("pointermove", mv);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); cv.removeEventListener("pointermove", mv); };
  }, [density, speed, size]);
  return <canvas ref={ref} style={{ width: "100%", height: "100%", display: "block" }} />;
}
