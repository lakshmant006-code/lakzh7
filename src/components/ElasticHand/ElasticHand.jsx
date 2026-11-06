import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { playSound } from "../../utils/uiSounds";
import "./ElasticHand.css";

/* The hand cursor. The drawing (public/hand/hand.png) is used exactly as it is; an elastic arm in its colour is
   attached to the bottom of it and runs back to the edge of the screen.
   - the arm is a chain of points (Verlet): it swings, lags and wobbles behind the finger
   - the chain's resting length stretches and relaxes with the distance, so far away it pulls long and thin
     (like rubber) and close to its shoulder it bunches back up
   - the shoulder sits on whichever edge anchor is nearest to the pointer, and slides there on a spring
   - the fingertip is the real pointer: clicking a project pops comic click-lines and a small card to open it */

const SPRITE = { w: 58, h: 80, pivot: [45.5, 80], tip: [6, 1], axis: [-17, -40], scale: 1.6 };
const N = 26;                                   // points in the arm
const STEP = 1 / 120;

const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const rotate = (v, a) => [v[0] * Math.cos(a) - v[1] * Math.sin(a), v[0] * Math.sin(a) + v[1] * Math.cos(a)];

function anchorsFor(W, H) {
  return [
    [-60, H + 60], [W * 0.25, H + 80], [W * 0.5, H + 80], [W * 0.75, H + 80], [W + 60, H + 60],
    [-70, H * 0.62], [W + 70, H * 0.62], [-70, H * 0.3], [W + 70, H * 0.3],
  ];
}

export default function ElasticHand() {
  const [on, setOn] = useState(false);
  const [pop, setPop] = useState(null);
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const S = useRef(null);                       // simulation state, kept out of React

  // the nav button (and Esc) switch the hand on and off
  useEffect(() => {
    const toggle = () => setOn((v) => !v);
    const key = (e) => { if (e.key === "Escape") setOn(false); };
    window.addEventListener("hand:toggle", toggle);
    window.addEventListener("keydown", key);
    return () => { window.removeEventListener("hand:toggle", toggle); window.removeEventListener("keydown", key); };
  }, []);
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("hand:state", { detail: on }));
    document.documentElement.classList.toggle("hand-mode", on);
    if (!on) setPop(null);
    return () => document.documentElement.classList.remove("hand-mode");
  }, [on]);

  useEffect(() => {
    if (!on) return undefined;
    const canvas = canvasRef.current, ctx = canvas.getContext("2d");
    let W = innerWidth, H = innerHeight, dpr = Math.min(devicePixelRatio || 1, 2);
    const fit = () => { W = innerWidth; H = innerHeight; dpr = Math.min(devicePixelRatio || 1, 2); canvas.width = W * dpr; canvas.height = H * dpr; canvas.style.width = W + "px"; canvas.style.height = H + "px"; };
    fit();

    const img = new Image(); img.src = "/hand/hand.png";
    let armColor = [226, 119, 19];
    img.onload = () => {                                         // the arm takes its colour from the drawing's own forearm
      const c = document.createElement("canvas"); c.width = SPRITE.w; c.height = SPRITE.h; const g = c.getContext("2d"); g.drawImage(img, 0, 0);
      const d = g.getImageData(40, 70, 14, 9).data; let r = 0, gg = 0, b = 0, n = 0;
      for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 250) { r += d[i]; gg += d[i + 1]; b += d[i + 2]; n++; }
      if (n) armColor = [r / n, gg / n, b / n];
    };
    // a little paper grain, so the arm matches the drawing's texture
    const grain = document.createElement("canvas"); grain.width = grain.height = 96;
    { const g = grain.getContext("2d"), id = g.createImageData(96, 96); for (let i = 0; i < id.data.length; i += 4) { const v = Math.random() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 34; } g.putImageData(id, 0, 0); }

    const A = anchorsFor(W, H);
    const st = S.current = {
      x: new Float32Array(N), y: new Float32Array(N), px: new Float32Array(N), py: new Float32Array(N),
      anchor: 4, bx: A[4][0], by: A[4][1], ptr: { x: W * 0.55, y: H * 0.6, seen: false }, rest: 360, retract: false, retractT: 0,
      poke: 0, hover: 0, burst: [], acc: 0, last: performance.now(), dirx: -0.4, diry: -1, over: false,
    };
    for (let i = 0; i < N; i++) { st.x[i] = st.px[i] = st.bx; st.y[i] = st.py[i] = st.by; }

    const move = (e) => { st.ptr.x = e.clientX; st.ptr.y = e.clientY; st.ptr.seen = true; st.over = !!e.target.closest?.("a, button, [role='button'], .work-bento-item"); };
    const down = (e) => {
      if (e.target.closest?.(".hand-pop")) return;
      st.ptr.x = e.clientX; st.ptr.y = e.clientY; st.ptr.seen = true;
      st.poke = 1; spawnBurst(e.clientX, e.clientY);
      try { playSound("pop"); } catch (_) { /* sound is optional */ }
    };
    const spawnBurst = (x, y) => {
      const n = 11, base = Math.random() * 6.28;
      for (let i = 0; i < n; i++) st.burst.push({ x, y, a: base + (i / n) * 6.283 + (Math.random() - 0.5) * 0.25, r0: 12 + Math.random() * 6, len: 14 + Math.random() * 16, t: 0, w: i % 2 ? 2.2 : 3.6, dark: i % 3 !== 0 });
    };
    // clicks on a project: stop the page from navigating and offer the case study in a little card instead
    const click = (e) => {
      if (e.target.closest?.(".hand-pop")) return;
      const link = e.target.closest?.("a[data-project-id], a.cs-next-card");
      if (!link) { setPop(null); return; }
      e.preventDefault(); e.stopPropagation();
      const title = (link.querySelector("h3, .cs-next-title, h4")?.textContent || "this project").split(":")[0].trim();
      const sub = link.querySelector(".work-bento-role, .work-bento-compact-role")?.textContent || "";
      const x = Math.min(W - 250, Math.max(16, e.clientX + 40)), y = Math.min(H - 170, Math.max(16, e.clientY - 150));
      setPop({ x, y, title, sub, href: link.getAttribute("href") });
    };
    addEventListener("pointermove", move, { passive: true });
    addEventListener("pointerdown", down, true);
    addEventListener("click", click, true);
    addEventListener("resize", fit);

    const step = (dt) => {
      const A2 = anchorsFor(W, H), p = st.ptr;
      // the shoulder: the nearest anchor, with a little stickiness so it doesn't flicker between two
      let best = st.anchor, bd = Math.hypot(p.x - A2[best][0], p.y - A2[best][1]);
      A2.forEach((a, i) => { const d = Math.hypot(p.x - a[0], p.y - a[1]); if (d < bd * 0.62) { best = i; bd = d; } });
      st.anchor = best;
      const tgx = A2[best][0], tgy = A2[best][1], kb = 1 - Math.exp(-dt / 0.4);
      st.bx += (tgx - st.bx) * kb; st.by += (tgy - st.by) * kb;

      // where the finger should be, and where the wrist has to be for that
      const tx = st.retract ? st.bx : p.x, ty = st.retract ? st.by : p.y;
      const lastI = N - 1, ex = tx - st.x[lastI - 2], ey = ty - st.y[lastI - 2], el = Math.hypot(ex, ey) || 1;
      st.dirx += (ex / el - st.dirx) * 0.2; st.diry += (ey / el - st.diry) * 0.2;
      const dl = Math.hypot(st.dirx, st.diry) || 1, dx = st.dirx / dl, dy = st.diry / dl;
      const rot = Math.atan2(dy, dx) - Math.atan2(SPRITE.axis[1], SPRITE.axis[0]);
      const off = rotate([(SPRITE.tip[0] - SPRITE.pivot[0]) * SPRITE.scale, (SPRITE.tip[1] - SPRITE.pivot[1]) * SPRITE.scale], rot);
      const pokeOut = st.poke * 16;
      const wx = tx - off[0] + dx * pokeOut, wy = ty - off[1] + dy * pokeOut;

      // the arm's resting length follows the reach with a lag: pull fast and it stretches, hold still and it relaxes
      const reach = Math.hypot(wx - st.bx, wy - st.by);
      const restTarget = Math.max(240, Math.min(3000, reach * 0.9));
      st.rest += (restTarget - st.rest) * (1 - Math.exp(-dt / 0.16));   // follows the reach closely: slack never piles up, yet it still stretches when yanked
      const seg = st.rest / (N - 1);

      // verlet
      const damp = 0.985, g = 260;
      for (let i = 1; i < N; i++) {
        const vx = (st.x[i] - st.px[i]) * damp, vy = (st.y[i] - st.py[i]) * damp;
        st.px[i] = st.x[i]; st.py[i] = st.y[i];
        st.x[i] += vx; st.y[i] += vy + g * dt * dt;
      }
      // the wrist is pulled to the pointer by a critically damped spring: firm, never jerky
      { const i = N - 1, k = 1500, c = 2 * Math.sqrt(k);
        const vx = (st.x[i] - st.px[i]) / dt, vy = (st.y[i] - st.py[i]) / dt;
        st.x[i] += ((wx - st.x[i]) * k - vx * c) * dt * dt; st.y[i] += ((wy - st.y[i]) * k - vy * c) * dt * dt; }
      st.x[0] = st.px[0] = st.bx; st.y[0] = st.py[0] = st.by;
      // soft distance constraints: stiff enough to be an arm, soft enough to stretch
      for (let it = 0; it < 9; it++) {
        for (let i = 0; i < N - 1; i++) {
          const ax = st.x[i + 1] - st.x[i], ay = st.y[i + 1] - st.y[i], d = Math.hypot(ax, ay) || 1e-4, diff = (d - seg) / d * 0.5 * 0.7;
          const wa = i === 0 ? 0 : 1, wb = 1, ws = wa + wb;
          st.x[i] += ax * diff * wa / ws * 2; st.y[i] += ay * diff * wa / ws * 2;
          st.x[i + 1] -= ax * diff * wb / ws * 2; st.y[i + 1] -= ay * diff * wb / ws * 2;
        }
      }
      // keep it a smooth arm: no kinks
      for (let i = 1; i < N - 1; i++) { st.x[i] += ((st.x[i - 1] + st.x[i + 1]) * 0.5 - st.x[i]) * 0.3; st.y[i] += ((st.y[i - 1] + st.y[i + 1]) * 0.5 - st.y[i]) * 0.3; }
      st.poke *= Math.exp(-dt * 9);
      st.hover += ((st.over && !st.retract ? 1 : 0) - st.hover) * (1 - Math.exp(-dt / 0.12));
      for (const b of st.burst) b.t += dt;
      st.burst = st.burst.filter((b) => b.t < 0.42);
      if (st.retract) { st.retractT += dt; }
    };

    const catmull = () => {                                      // a smooth curve through the points
      const out = [];
      for (let i = 0; i < N - 1; i++) {
        const p0 = [st.x[Math.max(0, i - 1)], st.y[Math.max(0, i - 1)]], p1 = [st.x[i], st.y[i]], p2 = [st.x[i + 1], st.y[i + 1]], p3 = [st.x[Math.min(N - 1, i + 2)], st.y[Math.min(N - 1, i + 2)]];
        for (let s = 0; s < 4; s++) {
          const t = s / 4, t2 = t * t, t3 = t2 * t;
          out.push([0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
                    0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3), (i + t) / (N - 1)]);
        }
      }
      out.push([st.x[N - 1], st.y[N - 1], 1]);
      return out;
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      const pts = catmull();
      // length and the thinning of a stretched band
      let len = 0; for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      const thin = Math.max(0.42, Math.min(1, Math.sqrt(430 / Math.max(len, 1))));
      const wrist = SPRITE.scale * 17, shoulder = 62 * Math.max(0.55, thin + 0.25);
      const L = [], R = [];
      const turn = (i) => {                                      // how sharply the arm bends here: folds draw thinner, so it never looks lumpy
        const a = pts[Math.max(0, i - 4)], c = pts[i], d = pts[Math.min(pts.length - 1, i + 4)];
        const a1 = Math.atan2(c[1] - a[1], c[0] - a[0]), a2 = Math.atan2(d[1] - c[1], d[0] - c[0]); let da = Math.abs(a2 - a1); if (da > Math.PI) da = 2 * Math.PI - da; return da;
      };
      for (let i = 0; i < pts.length; i++) {
        const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
        let tx = b[0] - a[0], ty = b[1] - a[1]; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
        const t = pts[i][2], tr = turn(i), w = Math.max(wrist * 0.32, (shoulder * thin + (wrist - shoulder * thin) * smooth(0.25, 1, t)) * 0.5 / (1 + tr * 1.6));
        L.push([pts[i][0] - ty * w, pts[i][1] + tx * w]); R.push([pts[i][0] + ty * w, pts[i][1] - tx * w]);
      }
      const [r, g, b] = armColor, fill = `rgb(${r | 0},${g | 0},${b | 0})`, edge = `rgb(${(r * 0.5) | 0},${(g * 0.4) | 0},${(b * 0.4) | 0})`;
      ctx.save();
      ctx.shadowColor = "rgba(40,20,5,.22)"; ctx.shadowBlur = 14; ctx.shadowOffsetY = 8; ctx.shadowOffsetX = 3;
      ctx.beginPath(); ctx.moveTo(L[0][0], L[0][1]); for (const p of L) ctx.lineTo(p[0], p[1]); for (let i = R.length - 1; i >= 0; i--) ctx.lineTo(R[i][0], R[i][1]); ctx.closePath();
      ctx.fillStyle = fill; ctx.fill();
      ctx.restore();
      ctx.save(); ctx.clip();
      // a darker underside and the paper grain
      ctx.strokeStyle = "rgba(120,52,6,.3)"; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); for (let i = 0; i < R.length; i++) i ? ctx.lineTo(R[i][0], R[i][1]) : ctx.moveTo(R[i][0], R[i][1]); ctx.stroke();
      ctx.fillStyle = ctx.createPattern(grain, "repeat"); ctx.globalCompositeOperation = "multiply"; ctx.fillRect(0, 0, W, H);
      ctx.restore();
      ctx.strokeStyle = edge; ctx.lineWidth = 2.2; ctx.lineJoin = "round";
      ctx.beginPath(); for (let i = 0; i < L.length; i++) i ? ctx.lineTo(L[i][0], L[i][1]) : ctx.moveTo(L[i][0], L[i][1]); ctx.stroke();
      ctx.beginPath(); for (let i = 0; i < R.length; i++) i ? ctx.lineTo(R[i][0], R[i][1]) : ctx.moveTo(R[i][0], R[i][1]); ctx.stroke();

      // the hand: the drawing itself, turned to follow the end of the arm
      const lastI = N - 1, dx = st.x[lastI] - st.x[lastI - 2], dy = st.y[lastI] - st.y[lastI - 2], ang = Math.atan2(dy, dx) - Math.atan2(SPRITE.axis[1], SPRITE.axis[0]);
      const sc = SPRITE.scale * (1 + 0.06 * st.hover + 0.05 * st.poke);
      if (img.complete && img.naturalWidth) {
        ctx.save(); ctx.translate(st.x[lastI], st.y[lastI]); ctx.rotate(ang); ctx.scale(sc, sc);
        ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
        ctx.shadowColor = "rgba(40,20,5,.2)"; ctx.shadowBlur = 8; ctx.shadowOffsetY = 4;
        ctx.drawImage(img, -SPRITE.pivot[0], -SPRITE.pivot[1] + 1, SPRITE.w, SPRITE.h);
        ctx.restore();
      }
      // click lines: short bold strokes that fly outward from the fingertip and fade
      for (const bst of st.burst) {
        const k = bst.t / 0.42, e = 1 - Math.pow(1 - k, 3), a0 = bst.r0 + e * 26, a1 = a0 + bst.len * (1 - k * 0.7);
        ctx.globalAlpha = 1 - k * k; ctx.strokeStyle = bst.dark ? "#2a1508" : fill; ctx.lineWidth = bst.w; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(bst.x + Math.cos(bst.a) * a0, bst.y + Math.sin(bst.a) * a0); ctx.lineTo(bst.x + Math.cos(bst.a) * a1, bst.y + Math.sin(bst.a) * a1); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    let raf = 0;
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      st.acc += Math.min(0.05, (now - st.last) / 1000); st.last = now;
      let n = 0; while (st.acc >= STEP && n < 12) { step(STEP); st.acc -= STEP; n++; }
      draw();
      if (st.retract && (st.retractT > 1.1)) { setOn(false); }
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", move); removeEventListener("pointerdown", down, true); removeEventListener("click", click, true); removeEventListener("resize", fit);
    };
  }, [on]);

  // switching off pulls the arm back to the edge before it goes
  useEffect(() => {
    const off = () => { if (S.current) { S.current.retract = true; S.current.retractT = 0; } };
    window.addEventListener("hand:retract", off);
    return () => window.removeEventListener("hand:retract", off);
  }, []);

  if (!on) return null;
  return (
    <>
      <canvas ref={canvasRef} className="elastic-hand" aria-hidden="true" />
      {pop && (
        <div className="hand-pop" style={{ left: pop.x, top: pop.y }} role="dialog" aria-label={`Open ${pop.title}`}>
          <svg className="hand-pop-lines l" viewBox="0 0 40 60" aria-hidden="true"><path d="M36 10 L6 2 M38 30 L2 30 M36 50 L6 58" /></svg>
          <svg className="hand-pop-lines r" viewBox="0 0 40 60" aria-hidden="true"><path d="M4 10 L34 2 M2 30 L38 30 M4 50 L34 58" /></svg>
          <button type="button" className="hand-pop-x" aria-label="Close" onClick={() => setPop(null)}>×</button>
          <span className="hand-pop-kicker">case study</span>
          <strong className="hand-pop-title">{pop.title}</strong>
          {pop.sub && <span className="hand-pop-sub">{pop.sub}</span>}
          <button type="button" className="hand-pop-go" onClick={() => { const h = pop.href; setPop(null); navigate(h); }}>Open it →</button>
        </div>
      )}
    </>
  );
}
