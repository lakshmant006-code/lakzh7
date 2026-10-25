import React, { useEffect, useRef } from "react";

/**
 * A section background: a lattice of tiny dots (it fills its parent, which must
 * be positioned). Dots near the pointer swell and
 * join their neighbours with rounded bridges into small circuit-like clumps,
 * then shrink back as the pointer moves on. With no pointer (touch, or an idle
 * mouse) a ghost cursor wanders so the field stays alive.
 */
const SPACING = 18; // px between dots
const SPACING_SMALL = 15;
const REACH = 150; // how far the pointer's influence reaches (px)
const DECAY = 0.955; // per frame; how long a clump lingers
const BASE_R = 1.25; // resting dot radius
const IDLE_MS = 2500; // pointer idle time before the ghost cursor takes over
const BRIDGE = 0.7; // bridge thickness relative to the smaller dot
const INK = "0, 0, 0";

// Small, stable pseudo-random value for a cell or an edge.
const hash = (a, b, c = 0) => {
  let h = (a * 374761393 + b * 668265263 + c * 2147483647) | 0;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};

export default function DotField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let spacing = SPACING;
    let cols = 0;
    let rows = 0;
    let energy = new Float32Array(0);
    let raf = 0;
    let running = true;
    let onScreen = true;

    const pointer = { x: -9999, y: -9999, last: 0 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const box = canvas.parentElement.getBoundingClientRect();
      width = Math.max(1, Math.round(box.width));
      height = Math.max(1, Math.round(box.height));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      spacing = window.innerWidth < 640 ? SPACING_SMALL : SPACING;
      cols = Math.ceil(width / spacing) + 1;
      rows = Math.ceil(height / spacing) + 1;
      energy = new Float32Array(cols * rows);
    };

    const onMove = (e) => {
      const t = e.touches ? e.touches[0] : e;
      if (!t) return;
      pointer.x = t.clientX;
      pointer.y = t.clientY;
      pointer.last = performance.now();
    };

    // Stable decision whether the bridge between two neighbours exists, so the
    // clumps look drawn rather than a full grid.
    const edgeOn = (c, r, dir) => hash(c, r, dir + 1) > 0.32;

    const frame = (now) => {
      if (!running || !onScreen) return;
      raf = requestAnimationFrame(frame);

      // Where the field is being "touched": the pointer, or a wandering ghost.
      const box = canvas.getBoundingClientRect();
      let px = pointer.x - box.left;
      let py = pointer.y - box.top;
      if (now - pointer.last > IDLE_MS) {
        const t = now / 1000;
        px = width * (0.5 + 0.38 * Math.sin(t * 0.37) * Math.cos(t * 0.11));
        // Stay inside the part of the section that is on screen.
        const top = Math.max(0, -box.top);
        const bottom = Math.min(height, window.innerHeight - box.top);
        py = top + Math.max(0, bottom - top) * (0.5 + 0.34 * Math.sin(t * 0.29 + 1.3));
      }

      // Update the energy of each dot.
      const r2 = REACH * REACH;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const dx = c * spacing - px;
          const dy = r * spacing - py;
          const d2 = dx * dx + dy * dy;
          let e = energy[i] * DECAY;
          if (d2 < r2) {
            // Each dot has its own appetite, so clumps are uneven.
            const k = 0.55 + 0.45 * hash(c, r);
            e = Math.max(e, Math.exp(-d2 / (r2 * 0.45)) * k);
          }
          energy[i] = e;
        }
      }

      ctx.clearRect(0, 0, width, height);
      const maxR = spacing * 0.34;
      const radius = (e) => (e < 0.04 ? BASE_R : BASE_R + Math.pow(e, 1.1) * (maxR - BASE_R));

      // Resting dots, all in one path (there are thousands of them).
      ctx.fillStyle = `rgba(${INK}, 0.22)`;
      ctx.beginPath();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (energy[r * cols + c] >= 0.04) continue;
          const x = c * spacing;
          const y = r * spacing;
          ctx.moveTo(x + BASE_R, y);
          ctx.arc(x, y, BASE_R, 0, Math.PI * 2);
        }
      }
      ctx.fill();

      // Bridges (under the swollen dots).
      ctx.lineCap = "round";
      ctx.strokeStyle = `rgba(${INK}, 0.88)`;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const e = energy[i];
          if (e < 0.22) continue;
          const x = c * spacing;
          const y = r * spacing;
          if (c + 1 < cols && edgeOn(c, r, 0)) {
            const e2 = energy[i + 1];
            if (e2 >= 0.22) {
              ctx.lineWidth = Math.min(radius(e), radius(e2)) * BRIDGE;
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(x + spacing, y);
              ctx.stroke();
            }
          }
          if (r + 1 < rows && edgeOn(c, r, 1)) {
            const e2 = energy[i + cols];
            if (e2 >= 0.22) {
              ctx.lineWidth = Math.min(radius(e), radius(e2)) * BRIDGE;
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(x, y + spacing);
              ctx.stroke();
            }
          }
        }
      }

      // Swollen dots, with a small highlight so the bigger ones read as glossy beads.
      ctx.fillStyle = `rgba(${INK}, 0.88)`;
      ctx.beginPath();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const e = energy[r * cols + c];
          if (e < 0.04) continue;
          const rad = radius(e);
          const x = c * spacing;
          const y = r * spacing;
          ctx.moveTo(x + rad, y);
          ctx.arc(x, y, rad, 0, Math.PI * 2);
        }
      }
      ctx.fill();
      ctx.fillStyle = "rgba(255, 255, 255, 0.28)";
      ctx.beginPath();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const rad = radius(energy[r * cols + c]);
          if (rad <= 3.2) continue;
          const x = c * spacing - rad * 0.32;
          const y = r * spacing - rad * 0.34;
          ctx.moveTo(x + rad * 0.22, y);
          ctx.arc(x, y, rad * 0.22, 0, Math.PI * 2);
        }
      }
      ctx.fill();
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = `rgba(${INK}, 0.16)`;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          ctx.beginPath();
          ctx.arc(c * spacing, r * spacing, BASE_R, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const onVisibility = () => {
      running = !document.hidden;
      cancelAnimationFrame(raf);
      if (running && onScreen && !reduced) raf = requestAnimationFrame(frame);
    };

    resize();
    window.addEventListener("resize", resize);
    const sizeWatcher = new ResizeObserver(() => {
      resize();
      if (reduced) drawStatic();
    });
    sizeWatcher.observe(canvas.parentElement);
    // Only animate while the section is on screen.
    const watcher = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (onScreen && running && !reduced) raf = requestAnimationFrame(frame);
    });
    watcher.observe(canvas);
    if (reduced) {
      drawStatic();
      window.addEventListener("resize", drawStatic);
    } else {
      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("touchmove", onMove, { passive: true });
      window.addEventListener("touchstart", onMove, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
      raf = requestAnimationFrame(frame);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      sizeWatcher.disconnect();
      watcher.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("resize", drawStatic);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchstart", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
