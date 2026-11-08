import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./ElasticHand.css";

/* The hand cursor. It is made only from the drawing (public/hand/hand.png): the hand and finger stay exactly as drawn
   at the end, and the forearm part of the same picture is stretched along an elastic rope back to the edge of the screen.
   - the rope is a chain of points that swings, lags and wobbles behind the finger
   - its resting length follows the reach, so pulled far it gets long and thin like rubber, and near its shoulder it relaxes
   - the shoulder is fixed to the middle of the bottom edge (see SIDE)
   - the fingertip is the real pointer, so clicks land exactly where it points */

const SPRITE = { w: 58, h: 80, headRows: 32, tip: [6, 1], scale: 1.9 };   // rows 0-32 are the hand, the rest is forearm
const WIN = 24;                                                           // width of the forearm window cut from the drawing
const N = 26;
const STEP = 1 / 120;
const K = 8;                                                              // the drawing is used at 8x (public/hand/hand-hd.png), the same picture cleaned up at high resolution

const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

/* The shoulder is stuck to one place: the middle of the bottom edge.
   Change SIDE to move it ("bottom", "bottom-right", "bottom-left", "right", "left"). */
const SIDE = "bottom";
function anchorsFor(W, H) {
  const at = { bottom: [W * 0.5, H + 70], "bottom-right": [W + 50, H + 50], "bottom-left": [-50, H + 50], right: [W + 60, H * 0.7], left: [-60, H * 0.7] }[SIDE];
  return [at];
}

// on the case studies the hand steps back (to this strength) so it never sits over the reading; set to 0 to hide it there
const CASE_STUDIES = ["/keep", "/quizai", "/hiku", "/time-management", "/pro-move"];
const CASE_OPACITY = 0.25;
// pages where there is no hand at all, just the normal pointer
const NO_HAND = ["/scenes"];

export default function ElasticHand() {
  const { pathname } = useLocation();
  const dimRef = useRef(1), hideRef = useRef(false), awayRef = useRef(false);
  // the hand is the cursor wherever there is a mouse or trackpad; touch screens (phone, iPad) have no cursor, so they keep their finger
  const [want, setOn] = useState(() => typeof matchMedia === "function" && matchMedia("(hover: hover) and (pointer: fine)").matches);
  const on = want && !NO_HAND.includes(pathname);
  const canvasRef = useRef(null);
  const S = useRef(null);

  // no browser menu on right click on a desktop (the right click belongs to the hand), so a screen recording stays clean; text fields keep theirs
  useEffect(() => {
    if (!want) return undefined;
    const quiet = (e) => { if (!e.target.closest?.("input, textarea, [contenteditable=true]")) e.preventDefault(); };
    addEventListener("contextmenu", quiet);
    return () => removeEventListener("contextmenu", quiet);
  }, [want]);
  useEffect(() => {
    dimRef.current = CASE_STUDIES.includes(pathname) ? CASE_OPACITY : 1;
    if (canvasRef.current) canvasRef.current.style.opacity = hideRef.current ? "0" : String(dimRef.current);
  }, [pathname]);
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("hand:state", { detail: on }));
    document.documentElement.classList.toggle("hand-mode", on);
    return () => document.documentElement.classList.remove("hand-mode");
  }, [on]);
  useEffect(() => {
    if (!on) return undefined;
    const canvas = canvasRef.current, ctx = canvas.getContext("2d");
    let W = innerWidth, H = innerHeight, dpr = Math.min(devicePixelRatio || 1, 2);
    const fit = () => { W = innerWidth; H = innerHeight; dpr = Math.min(devicePixelRatio || 1, 2); canvas.width = W * dpr; canvas.height = H * dpr; canvas.style.width = W + "px"; canvas.style.height = H + "px"; };
    fit(); canvas.style.opacity = awayRef.current ? "0" : String(dimRef.current); document.documentElement.classList.toggle("hand-away", awayRef.current);

    /* from the drawing: the forearm straightened (each row centred), then smoothed up lengthways, ready to be stretched */
    const img = new Image(); img.src = "/hand/hand-hd.png";
    const strip = { canvas: null, wrist: SPRITE.tip[0] };
    img.onload = () => {
      const HW = SPRITE.w * K, HH = SPRITE.h * K, rows = (SPRITE.h - SPRITE.headRows) * K, y0 = SPRITE.headRows * K;
      const src = document.createElement("canvas"); src.width = HW; src.height = HH;
      const sg = src.getContext("2d"); sg.drawImage(img, 0, 0, HW, HH);
      const px = sg.getImageData(0, 0, HW, HH).data;
      const tall = document.createElement("canvas"); tall.width = WIN * K; tall.height = rows; const tg = tall.getContext("2d");
      tg.imageSmoothingEnabled = true; tg.imageSmoothingQuality = "high";
      for (let r = 0; r < rows; r++) {
        const y = y0 + r; let xl = -1, xr = -1;
        for (let x = 0; x < HW; x++) if (px[(y * HW + x) * 4 + 3] > 100) { if (xl < 0) xl = x; xr = x; }
        if (xl < 0) continue;
        const c = (xl + xr + 1) / 2; if (r === 0) strip.wrist = c / K;
        tg.drawImage(img, 0, y, HW, 1, (WIN * K) / 2 - c, r, HW, 1);   // each row of the forearm re-centred, so it runs straight
      }
      strip.canvas = tall;
    };

    const A = anchorsFor(W, H);
    const st = S.current = {
      x: new Float32Array(N), y: new Float32Array(N), px: new Float32Array(N), py: new Float32Array(N),
      anchor: 0, bx: A[0][0], by: A[0][1], ptr: { x: W * 0.55, y: H * 0.6 }, rest: 360, retract: false, retractT: 0, acc: 0, last: performance.now(), dirx: -0.4, diry: -1,
    };
    for (let i = 0; i < N; i++) { st.x[i] = st.px[i] = st.bx; st.y[i] = st.py[i] = st.by; }

    /* a click flicks out two to four short lines either side of the fingertip, which fade straight away */
    const burst = [];
    const click = () => {
      const I = N - 1, ang = Math.atan2(st.y[I] - st.y[I - 2], st.x[I] - st.x[I - 2]);   // the way the finger points
      const n = 2 + Math.floor(Math.random() * 3), spread = 1.25;
      for (let i = 0; i < n; i++) {
        const f = n === 1 ? 0 : i / (n - 1) - 0.5;                                            // -0.5 .. 0.5 across the fan
        const a = ang + f * 2 * spread + (Math.random() - 0.5) * 0.18 + (Math.abs(f) < 0.05 ? 0.5 : 0);   // never straight ahead of the finger
        burst.push({ a, r0: 16 + Math.random() * 4, len: 11 + Math.random() * 7, t: 0, w: 2.4 + Math.random() * 1.2 });
      }
    };
    /* a right click sends the hand away (the normal pointer is back for the menu); the next right click brings it back */
    const html = document.documentElement;
    const apply = () => { html.classList.toggle("hand-away", awayRef.current); if (awayRef.current) hideRef.current = true; canvas.style.opacity = awayRef.current || hideRef.current ? "0" : String(dimRef.current); };
    const contextmenu = () => { awayRef.current = !awayRef.current; if (!awayRef.current) hideRef.current = false; apply(); };
    /* on a Mac a double click does the same (it is easier than a right click on a trackpad); links, buttons and fields keep their own double click */
    const isMac = (/Mac/i.test(navigator.platform) || /Macintosh/.test(navigator.userAgent)) && !(navigator.maxTouchPoints > 1);
    const dbl = (e) => {
      if (!isMac || e.target.closest?.("a, button, input, textarea, select, summary, [role=button], .hand-studio")) return;
      getSelection()?.removeAllRanges(); contextmenu();
    };
    if (isMac) addEventListener("dblclick", dbl);
    const move = (e) => {
      st.ptr.x = e.clientX; st.ptr.y = e.clientY;
      // over an embedded page (the memories, a live piece) this page stops receiving the pointer: the hand steps aside and the page's own cursor shows
      hideRef.current = awayRef.current || !!(e.target && (e.target.tagName === "IFRAME" || e.target.closest?.(".hand-studio")));
      canvas.style.opacity = hideRef.current ? "0" : String(dimRef.current);
    };
    addEventListener("pointermove", move, { passive: true });
    const down = (e) => { if (e.button === 2 || (e.button === 0 && e.ctrlKey)) return; move(e); if (!awayRef.current) click(); };
    addEventListener("pointerdown", down, true);
    addEventListener("contextmenu", contextmenu, true);
    addEventListener("resize", fit);

    // the vector from the wrist to the fingertip in the drawing
    const tipVec = () => [(SPRITE.tip[0] - strip.wrist) * SPRITE.scale, (SPRITE.tip[1] - SPRITE.headRows) * SPRITE.scale];

    const step = (dt) => {
      const A2 = anchorsFor(W, H), p = st.ptr;
      let best = st.anchor, bd = Math.hypot(p.x - A2[best][0], p.y - A2[best][1]);
      A2.forEach((a, i) => { const d = Math.hypot(p.x - a[0], p.y - a[1]); if (d < bd * 0.62) { best = i; bd = d; } });
      st.anchor = best;
      const kb = 1 - Math.exp(-dt / 0.4);
      st.bx += (A2[best][0] - st.bx) * kb; st.by += (A2[best][1] - st.by) * kb;

      const tx = st.retract ? st.bx : p.x, ty = st.retract ? st.by : p.y, I = N - 1;
      const ex = tx - st.x[I - 2], ey = ty - st.y[I - 2], el = Math.hypot(ex, ey) || 1;
      st.dirx += (ex / el - st.dirx) * 0.2; st.diry += (ey / el - st.diry) * 0.2;
      const dl = Math.hypot(st.dirx, st.diry) || 1, dx = st.dirx / dl, dy = st.diry / dl;
      // the wrist sits behind the fingertip, along the way the hand points
      const tv = tipVec(), tl = Math.hypot(tv[0], tv[1]);
      const wx = tx - dx * tl, wy = ty - dy * tl;

      const reach = Math.hypot(wx - st.bx, wy - st.by);
      st.rest += (Math.max(240, Math.min(3000, reach * 0.95)) - st.rest) * (1 - Math.exp(-dt / 0.16));
      const seg = st.rest / (N - 1);

      const damp = 0.985, g = 260;
      for (let i = 1; i < N; i++) {
        const vx = (st.x[i] - st.px[i]) * damp, vy = (st.y[i] - st.py[i]) * damp;
        st.px[i] = st.x[i]; st.py[i] = st.y[i]; st.x[i] += vx; st.y[i] += vy + g * dt * dt;
      }
      { const k = 7000, c = 2 * Math.sqrt(k), vx = (st.x[I] - st.px[I]) / dt, vy = (st.y[I] - st.py[I]) / dt;
        st.x[I] += ((wx - st.x[I]) * k - vx * c) * dt * dt; st.y[I] += ((wy - st.y[I]) * k - vy * c) * dt * dt; }
      st.x[0] = st.px[0] = st.bx; st.y[0] = st.py[0] = st.by;
      for (let it = 0; it < 9; it++) {
        for (let i = 0; i < N - 1; i++) {
          const ax = st.x[i + 1] - st.x[i], ay = st.y[i + 1] - st.y[i], d = Math.hypot(ax, ay) || 1e-4, diff = (d - seg) / d * 0.5 * 0.7;
          const wa = i === 0 ? 0 : 1;
          st.x[i] += ax * diff * wa; st.y[i] += ay * diff * wa; st.x[i + 1] -= ax * diff; st.y[i + 1] -= ay * diff;
        }
      }
      st.x[I] += (wx - st.x[I]) * 0.4; st.y[I] += (wy - st.y[I]) * 0.4;      // the hand lands on the pointer; only the arm behind it stretches and lags
      for (let i = 1; i < N - 1; i++) { st.x[i] += ((st.x[i - 1] + st.x[i + 1]) * 0.5 - st.x[i]) * 0.3; st.y[i] += ((st.y[i - 1] + st.y[i + 1]) * 0.5 - st.y[i]) * 0.3; }
      if (st.retract) st.retractT += dt;
    };

    const catmull = () => {
      const out = [];
      for (let i = 0; i < N - 1; i++) {
        const p0 = [st.x[Math.max(0, i - 1)], st.y[Math.max(0, i - 1)]], p1 = [st.x[i], st.y[i]], p2 = [st.x[i + 1], st.y[i + 1]], p3 = [st.x[Math.min(N - 1, i + 2)], st.y[Math.min(N - 1, i + 2)]];
        for (let s = 0; s < 5; s++) {
          const t = s / 5, t2 = t * t, t3 = t2 * t;
          out.push([0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
                    0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)]);
        }
      }
      out.push([st.x[N - 1], st.y[N - 1]]);
      return out;
    };

    const drawBurst = (dt) => {
      if (!burst.length) return;
      const I = N - 1, ox = st.ptr.x, oy = st.ptr.y;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.lineCap = "round"; ctx.strokeStyle = "#2a1508";
      for (const b of burst) {
        b.t += dt; const k = Math.min(1, b.t / 0.36), e = 1 - Math.pow(1 - k, 3);
        const a0 = b.r0 + e * 12, a1 = a0 + b.len * (1 - k * 0.6);
        ctx.globalAlpha = 1 - k * k; ctx.lineWidth = b.w;
        ctx.beginPath(); ctx.moveTo(ox + Math.cos(b.a) * a0, oy + Math.sin(b.a) * a0); ctx.lineTo(ox + Math.cos(b.a) * a1, oy + Math.sin(b.a) * a1); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      for (let i = burst.length - 1; i >= 0; i--) if (burst[i].t >= 0.36) burst.splice(i, 1);
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      if (!strip.canvas || !img.complete) return;
      const pts = catmull(), M = pts.length;
      let len = 0; const cum = [0];
      for (let i = M - 1; i > 0; i--) { len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); cum.push(len); }   // measured from the hand back to the shoulder
      const thinAll = Math.max(0.4, Math.min(1, Math.sqrt(170 / Math.max(len, 1))));
      const tall = strip.canvas, th = tall.height, tw = tall.width, sc = SPRITE.scale;

      ctx.save();
      ctx.shadowColor = "rgba(40,20,5,.2)"; ctx.shadowBlur = 10; ctx.shadowOffsetY = 5; ctx.shadowOffsetX = 2;
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
      // the forearm: the drawing's own forearm, slice by slice, stretched along the rope
      for (let k = 0; k < M - 1; k++) {
        const i = M - 1 - k;                                       // k = 0 at the hand
        const a = pts[i], b = pts[i - 1];
        const yx = b[0] - a[0], yy = b[1] - a[1], sl = Math.hypot(yx, yy) || 1;
        const t0 = cum[k] / len, t1 = cum[k + 1] / len;
        // sharp bends narrow the arm a little, so a fold never looks lumpy
        const prev = pts[Math.min(M - 1, i + 3)], nxt = pts[Math.max(0, i - 3)];
        let da = Math.abs(Math.atan2(nxt[1] - a[1], nxt[0] - a[0]) - Math.atan2(a[1] - prev[1], a[0] - prev[0])); if (da > Math.PI) da = 2 * Math.PI - da;
        const w = sc * (1 - (1 - thinAll) * smooth(0.02, 0.3, t0)) / (1 + da * 1.2);
        const ux = yx / sl, uy = yy / sl;                          // along the arm, away from the hand
        const xx = uy, xy = -ux;                                   // across it
        ctx.setTransform(dpr * xx * w, dpr * xy * w, dpr * ux * (sl + 0.8), dpr * uy * (sl + 0.8), dpr * a[0], dpr * a[1]);
        const sy = Math.min(th - 1, t0 * th);
        ctx.drawImage(tall, 0, sy, tw, Math.max(1, Math.min(th - sy, (t1 - t0) * th + 1)), -WIN / 2, 0, WIN, 1);
      }
      ctx.restore();

      // the hand itself, exactly as drawn, on the end of the arm
      const I = N - 1, dx = st.x[I] - st.x[I - 2], dy = st.y[I] - st.y[I - 2];
      const tv = [(SPRITE.tip[0] - strip.wrist), (SPRITE.tip[1] - SPRITE.headRows)], rot = Math.atan2(dy, dx) - Math.atan2(tv[1], tv[0]);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.save(); ctx.translate(st.x[I], st.y[I]); ctx.rotate(rot); ctx.scale(sc, sc);
      ctx.shadowColor = "rgba(40,20,5,.2)"; ctx.shadowBlur = 8; ctx.shadowOffsetY = 4;
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, SPRITE.w * K, (SPRITE.headRows + 2) * K, -strip.wrist, -SPRITE.headRows, SPRITE.w, SPRITE.headRows + 2);
      ctx.restore();
    };

    let raf = 0;
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      st.acc += Math.min(0.05, (now - st.last) / 1000); st.last = now;
      let n = 0; while (st.acc >= STEP && n < 12) { step(STEP); st.acc -= STEP; n++; }
      draw(); drawBurst(Math.min(0.05, (now - (st.lastDraw || now)) / 1000)); st.lastDraw = now;
      if (st.retract && st.retractT > 1.1) setOn(false);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", move); removeEventListener("pointerdown", down, true); removeEventListener("contextmenu", contextmenu, true); removeEventListener("dblclick", dbl); removeEventListener("resize", fit);
    };
  }, [on]);

  if (!on) return null;
  return <canvas ref={canvasRef} className="elastic-hand" aria-hidden="true" />;
}
