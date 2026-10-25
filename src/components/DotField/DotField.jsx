import React, { useEffect, useRef } from "react";

/**
 * A section background: a lattice of tiny dots (it fills its parent, which must
 * be positioned). Dots near the pointer swell on a spring and join their
 * neighbours with rounded bridges into small circuit-like clumps, then spring
 * back, so nothing stays swollen for more than about a second.
 *
 * - protectRef: an element whose content box stays clear of dots, so the field
 *   only lives in the margins on either side of it.
 * - onActiveChange(bool): true while the pointer is moving over the field, for
 *   things like music.
 *
 * With no pointer (touch, or an idle mouse) a ghost cursor wanders the margins.
 */
const SPACING = 18; // px between dots
const SPACING_SMALL = 15;
const REACH = 150; // how far the pointer's influence reaches (px)
const BASE_R = 1.25; // resting dot radius
const IDLE_MS = 2500; // pointer idle time before the ghost cursor takes over
const ACTIVE_MS = 700; // how recently the pointer moved to count as "hovering"
const BRIDGE = 0.7; // bridge thickness relative to the smaller dot
// Spring: stiffness and damping. Slightly under-damped, so dots pop a little,
// and settle in about half a second after the pointer leaves.
const STIFFNESS = 170;
const DAMPING = 15;
const INK = "0, 0, 0";

// Small, stable pseudo-random value for a cell or an edge.
const hash = (a, b, c = 0) => {
  let h = (a * 374761393 + b * 668265263 + c * 2147483647) | 0;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};

export default function DotField({ protectRef, onActiveChange }) {
  const canvasRef = useRef(null);
  const activeCb = useRef(onActiveChange);
  activeCb.current = onActiveChange;

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
    let velocity = new Float32Array(0);
    let raf = 0;
    let running = true;
    let onScreen = true;
    let lastTime = 0;
    let active = false;

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
      velocity = new Float32Array(cols * rows);
    };

    const onMove = (e) => {
      const t = e.touches ? e.touches[0] : e;
      if (!t) return;
      pointer.x = t.clientX;
      pointer.y = t.clientY;
      pointer.last = performance.now();
    };

    // The columns of dots that are covered by the protected content (kept clear).
    const clearColumns = (box) => {
      const el = protectRef?.current;
      if (!el) return [1, 0];
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const left = r.left + parseFloat(cs.paddingLeft || 0) - box.left;
      const right = r.right - parseFloat(cs.paddingRight || 0) - box.left;
      // Dots whose centre lies inside the content box (plus half a gap) are off.
      const from = Math.ceil((left - spacing * 0.5) / spacing);
      const to = Math.floor((right + spacing * 0.5) / spacing);
      return [from, to];
    };

    // Stable decision whether the bridge between two neighbours exists, so the
    // clumps look drawn rather than a full grid.
    const edgeOn = (c, r, dir) => hash(c, r, dir + 1) > 0.32;

    const setActive = (next) => {
      if (next === active) return;
      active = next;
      activeCb.current?.(next);
    };

    const frame = (now) => {
      if (!running || !onScreen) return;
      raf = requestAnimationFrame(frame);

      const dt = Math.min(0.05, Math.max(0.001, (now - (lastTime || now - 16)) / 1000));
      lastTime = now;

      const box = canvas.getBoundingClientRect();
      const [clearFrom, clearTo] = clearColumns(box);

      // Where the field is being "touched": the pointer, or a wandering ghost.
      let px = pointer.x - box.left;
      let py = pointer.y - box.top;
      const idle = now - pointer.last > IDLE_MS;
      if (idle) {
        const t = now / 1000;
        // Wander up and down one of the two margins, switching sides slowly.
        const leftMargin = Math.max(0, clearFrom * spacing);
        const rightStart = (clearTo + 1) * spacing;
        const side = Math.sin(t * 0.21) > 0 ? 1 : 0;
        px = side
          ? rightStart + (width - rightStart) * (0.5 + 0.35 * Math.sin(t * 0.9))
          : leftMargin * (0.5 + 0.35 * Math.sin(t * 0.9 + 2));
        const top = Math.max(0, -box.top);
        const bottom = Math.min(height, window.innerHeight - box.top);
        py = top + Math.max(0, bottom - top) * (0.5 + 0.34 * Math.sin(t * 0.29 + 1.3));
      }

      // Hovering = the pointer recently moved over a margin of the field.
      const overField =
        !idle &&
        pointer.x >= box.left &&
        pointer.x <= box.right &&
        pointer.y >= box.top &&
        pointer.y <= box.bottom &&
        (Math.round((pointer.x - box.left) / spacing) < clearFrom ||
          Math.round((pointer.x - box.left) / spacing) > clearTo);
      setActive(overField && now - pointer.last < ACTIVE_MS);

      // Spring each dot toward how much the pointer is "touching" it.
      const r2 = REACH * REACH;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          if (c >= clearFrom && c <= clearTo) {
            energy[i] = 0;
            velocity[i] = 0;
            continue;
          }
          const dx = c * spacing - px;
          const dy = r * spacing - py;
          const d2 = dx * dx + dy * dy;
          let target = 0;
          if (d2 < r2) {
            // Each dot has its own appetite, so clumps are uneven.
            target = Math.exp(-d2 / (r2 * 0.45)) * (0.55 + 0.45 * hash(c, r));
          }
          let e = energy[i];
          let v = velocity[i];
          if (target === 0 && Math.abs(e) < 0.02 && Math.abs(v) < 0.08) {
            energy[i] = 0;
            velocity[i] = 0;
            continue;
          }
          v += (STIFFNESS * (target - e) - DAMPING * v) * dt;
          e += v * dt;
          if (e < 0) {
            e = 0;
            v = Math.max(0, v);
          }
          energy[i] = e;
          velocity[i] = v;
        }
      }

      ctx.clearRect(0, 0, width, height);
      const maxR = spacing * 0.34;
      const radius = (e) => (e < 0.04 ? BASE_R : BASE_R + Math.pow(Math.min(e, 1.25), 1.1) * (maxR - BASE_R));

      // Resting dots, all in one path (there are thousands of them).
      ctx.fillStyle = `rgba(${INK}, 0.22)`;
      ctx.beginPath();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (c >= clearFrom && c <= clearTo) continue;
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
      const box = canvas.getBoundingClientRect();
      const [clearFrom, clearTo] = clearColumns(box);
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = `rgba(${INK}, 0.16)`;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (c >= clearFrom && c <= clearTo) continue;
          ctx.beginPath();
          ctx.arc(c * spacing, r * spacing, BASE_R, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const start = () => {
      cancelAnimationFrame(raf);
      lastTime = 0;
      if (running && onScreen && !reduced) raf = requestAnimationFrame(frame);
    };

    const onVisibility = () => {
      running = !document.hidden;
      if (!running) setActive(false);
      start();
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
      if (!onScreen) setActive(false);
      start();
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
      document.documentElement.addEventListener("mouseleave", () => setActive(false));
      raf = requestAnimationFrame(frame);
    }

    return () => {
      running = false;
      setActive(false);
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
  }, [protectRef]);

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
