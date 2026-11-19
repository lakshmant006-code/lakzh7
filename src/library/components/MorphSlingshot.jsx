import React, { useEffect, useRef } from "react";

/* From MORPH: the whole Slingshot interaction. A ball rests in an elastic socket. Pull it back and let go: it flies on an arc under gravity,
   bounces off the walls and ceiling, settles on the floor and comes back to the band.
   - the band is the socket stretched: the hull of the socket circle and the ball circle; let go and its free end snaps back on a spring
   - how far you pull sets the speed it leaves with, straight back the other way, and it grows faster than the pull: a full stretch throws hardest
   - the ball trembles at full strain, is drawn stretched along its flight, and a burst of sparks comes off the sling as it leaves
   - the arrow on the ball turns to where it will go
   The simulation (class Slingshot) has no dependencies; the component just feeds it pointer positions and paints what view() returns. */
const SLING = { R: 29, SOCKET: 38, PULL: 118, FREE: 0.6, SHAKE: 0.7, K: 13, G: 700, POOL: 36 };
const W = 360, H = 260;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
/** how far the ball goes for how far the hand goes, both over PULL: one for one at first, then a steep rubber curve */
const give = (u) => (u <= SLING.FREE ? u : SLING.FREE + (1 - SLING.FREE) * Math.tanh(((u - SLING.FREE) / (1 - SLING.FREE)) * 0.7));
const strainOf = (m) => clamp((m - 0.9) / 0.08, 0, 1);

/** two circles and the outer tangents between them: a capsule that hugs both, or the bigger circle alone when one holds the other */
function slingHull(ax, ay, ra, bx, by, rb) {
  const d = Math.hypot(bx - ax, by - ay);
  const circle = `M${ax - ra},${ay}a${ra},${ra} 0 1,0 ${ra * 2},0a${ra},${ra} 0 1,0 ${-ra * 2},0Z`;
  if (d <= Math.abs(ra - rb) + 0.5) return circle;
  const th = Math.atan2(by - ay, bx - ax), ph = Math.acos(clamp((ra - rb) / d, -1, 1));
  const P = (cx, cy, r, t) => `${(cx + r * Math.cos(t)).toFixed(2)},${(cy + r * Math.sin(t)).toFixed(2)}`;
  return `M${P(ax, ay, ra, th + ph)}L${P(bx, by, rb, th + ph)}A${rb},${rb} 0 0,0 ${P(bx, by, rb, th - ph)}L${P(ax, ay, ra, th - ph)}A${ra},${ra} 0 1,0 ${P(ax, ay, ra, th + ph)}Z`;
}

class Slingshot {
  constructor({ width, height, power = 100, bounce = 30, reducedMotion = false, random = Math.random }) {
    this.width = width; this.height = height; this.restX = width / 2; this.restY = height / 2; this.power = power; this.bounce = bounce; this.reduced = reducedMotion; this.random = random;
    this.x = this.bx = this.restX; this.y = this.by = this.restY; this.vx = this.vy = 0; this.phase = "rest";   // rest, held, fly, gone
    this.bvx = this.bvy = 0; this.still = 0; this.gone = 0; this.appear = 1; this.jx = this.jy = 0; this.strain = 0; this.grip = null; this.specks = []; this.pull = 0; this.fired = true;
  }
  launch(x, y) { const u = clamp(Math.hypot(this.restX - x, this.restY - y) / SLING.PULL, 0, 1), k = SLING.K * (this.power / 100) * (0.7 + 1.1 * u * u); return { vx: (this.restX - x) * k, vy: (this.restY - y) * k }; }
  grab(x, y) { if (this.grip || this.phase !== "rest") return false; if (Math.hypot(x - this.x, y - this.y) > SLING.R + 14) return false; this.grip = { dx: this.x - x, dy: this.y - y }; this.phase = "held"; return true; }
  get holding() { return this.grip !== null; }
  move(x, y) {
    const g = this.grip; if (!g) return;
    let dx = x + g.dx - this.restX, dy = y + g.dy - this.restY; const d = Math.hypot(dx, dy), m = give(d / SLING.PULL);
    if (d > 0) { dx *= (m * SLING.PULL) / d; dy *= (m * SLING.PULL) / d; }
    this.x = this.restX + dx; this.y = this.restY + dy; this.strain = strainOf(m);
  }
  release() {
    if (!this.grip) return; this.grip = null; this.strain = 0;
    const pulled = Math.hypot(this.restX - this.x, this.restY - this.y);
    if (pulled < 8) { this.phase = "rest"; this.x = this.restX; this.y = this.restY; return; }
    const v = this.launch(this.x, this.y); this.vx = v.vx; this.vy = v.vy; this.phase = "fly"; this.pull = clamp(pulled / SLING.PULL, 0, 1); this.fired = false;   // the burst waits until the ball clears the sling
  }
  puff(x, y, dx, dy, n, speed, spread) {
    if (this.reduced) return; const aim = Math.atan2(dy, dx);
    for (let i = 0; i < n; i++) { const a = aim + (this.random() - 0.5) * spread, v = speed * (0.45 + this.random() * 0.9);
      this.specks.push({ x: x + (this.random() - 0.5) * 10, y: y + (this.random() - 0.5) * 10, vx: Math.cos(a) * v, vy: Math.sin(a) * v, t: 0, life: 0.35 + this.random() * 0.35, r: 1.1 + this.random() * 0.9 }); }
    if (this.specks.length > SLING.POOL) this.specks.splice(0, this.specks.length - SLING.POOL);
  }
  advance(dt) { const slice = Math.min(0.033, Math.max(0, dt)) / 3; let busy = false; for (let i = 0; i < 3; i++) busy = this.step(slice) || busy; return busy || this.phase === "held"; }
  respawn() { this.phase = "rest"; this.x = this.restX; this.y = this.restY; this.vx = this.vy = 0; this.appear = 0; }
  step(dt) {
    if (this.appear < 1) this.appear = Math.min(1, this.appear + dt * 5);
    let banding = false;
    if (this.phase === "held") { this.bx = this.x; this.by = this.y; this.bvx = this.bvy = 0; }
    else {
      const k = 900, c = 2 * Math.sqrt(k) * 0.32;                                    // the band's free end springs home, past its rest and back
      this.bvx += (-k * (this.bx - this.restX) - c * this.bvx) * dt; this.bvy += (-k * (this.by - this.restY) - c * this.bvy) * dt; this.bx += this.bvx * dt; this.by += this.bvy * dt;
      banding = Math.abs(this.bx - this.restX) + Math.abs(this.by - this.restY) + Math.abs(this.bvx) * 0.01 + Math.abs(this.bvy) * 0.01 > 0.05;
      if (!banding) { this.bx = this.restX; this.by = this.restY; this.bvx = this.bvy = 0; }
    }
    if (this.specks.length > 0) {                                                  // sparks drift on, slowing, sinking a touch, until they fade
      const drag = Math.exp(-4 * dt);
      for (const p of this.specks) { p.t += dt; p.vx *= drag; p.vy = p.vy * drag + 60 * dt; p.x += p.vx * dt; p.y += p.vy * dt; }
      this.specks = this.specks.filter((p) => p.t < p.life);
    }
    const dusty = this.specks.length > 0;
    if (this.phase === "gone") { this.gone += dt; if (this.gone >= 0.2) { this.gone = 0; this.respawn(); } return true; }
    if (this.phase !== "fly") return this.appear < 1 || banding || dusty;
    if (!this.fired && (this.x - this.restX) * this.vx + (this.y - this.restY) * this.vy >= 0) {   // the burst comes off the rim the ball leaves through
      this.fired = true; const sp = Math.hypot(this.vx, this.vy) || 1, ux = this.vx / sp, uy = this.vy / sp;
      this.puff(this.restX + ux * SLING.SOCKET, this.restY + uy * SLING.SOCKET, ux, uy, Math.round(12 + this.pull * 10), 150 + this.pull * 170, 1.7);
    }
    const e = 0.2 + (this.bounce / 100) * 0.6;
    this.vy += SLING.G * dt; this.x += this.vx * dt; this.y += this.vy * dt;
    const m = SLING.R * (1 + clamp(Math.hypot(this.vx, this.vy) / 2400, 0, 0.22));  // a fast ball is drawn stretched: meet the edge with the tip of the stretch
    if (this.x < m) { this.x = m; this.vx = Math.abs(this.vx) * e; }
    if (this.x > this.width - m) { this.x = this.width - m; this.vx = -Math.abs(this.vx) * e; }
    if (this.y < m) { this.y = m; this.vy = Math.abs(this.vy) * e; }
    if (this.y > this.height - SLING.R) { this.y = this.height - SLING.R; this.vy = -Math.abs(this.vy) * e; this.vx *= 0.8; if (Math.abs(this.vy) < 40) this.vy = 0; }
    if (this.y >= this.height - SLING.R - 0.5 && Math.abs(this.vx) < 12 && Math.abs(this.vy) < 1) { this.still += dt; if (this.still > 0.5) { this.still = 0; this.phase = "gone"; this.gone = 0; } } else this.still = 0;
    return true;
  }
  view(seconds) {
    const speed = Math.hypot(this.vx, this.vy), stretch = this.phase === "fly" ? clamp(speed / 2400, 0, 0.22) : 0, angle = Math.atan2(this.vy, this.vx);
    const tremble = this.phase === "held" && !this.reduced ? this.strain * SLING.SHAKE : 0;   // held at the limit, the ball trembles: two sines that never line up
    this.jx = tremble * Math.sin(seconds * 60); this.jy = tremble * Math.cos(seconds * 49);
    const direction = this.phase === "fly" ? Math.atan2(this.vy, this.vx) : this.phase === "held" && Math.hypot(this.restX - this.x, this.restY - this.y) > 4 ? Math.atan2(this.restY - this.y, this.restX - this.x) : -Math.PI / 4;
    const jitter = this.phase === "held";
    return {
      dx: this.x + this.jx - this.restX, dy: this.y + this.jy - this.restY, angle, sx: (1 + stretch) * this.appear, sy: (1 - stretch * 0.7) * this.appear, visible: this.phase !== "gone", arrow: direction + Math.PI / 4,
      band: slingHull(this.restX, this.restY, SLING.SOCKET, this.bx + (jitter ? this.jx : 0), this.by + (jitter ? this.jy : 0), SLING.R + 6),
      sparks: this.specks.map((p) => { const k = p.t / p.life, v = Math.hypot(p.vx, p.vy) || 1, len = clamp(v * 0.028, 1.5, 12); return { x1: p.x, y1: p.y, x2: p.x - (p.vx / v) * len, y2: p.y - (p.vy / v) * len, width: p.r, opacity: 0.6 * (1 - k) ** 1.4 }; }),
    };
  }
}

export default function MorphSlingshot({ power = 145, bounce = 55 }) {
  const svg = useRef(null), band = useRef(null), ball = useRef(null), arrow = useRef(null), sparks = useRef([]), sim = useRef(null);
  useEffect(() => {
    sim.current = new Slingshot({ width: W, height: H, power, bounce, reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches });
    let raf, last = performance.now();
    const frame = (now) => {
      raf = requestAnimationFrame(frame); const s = sim.current; s.advance((now - last) / 1000); last = now;
      const v = s.view(now / 1000);
      ball.current?.setAttribute("transform", `translate(${(W / 2 + v.dx).toFixed(2)} ${(H / 2 + v.dy).toFixed(2)}) rotate(${(v.angle * 180 / Math.PI).toFixed(2)}) scale(${v.sx.toFixed(4)} ${v.sy.toFixed(4)}) rotate(${(-v.angle * 180 / Math.PI).toFixed(2)})`);
      ball.current?.setAttribute("opacity", v.visible ? "1" : "0");
      arrow.current?.setAttribute("transform", `rotate(${(v.arrow * 180 / Math.PI).toFixed(2)})`);
      band.current?.setAttribute("d", v.band);
      sparks.current.forEach((el, i) => { if (!el) return; const p = v.sparks[i]; if (p) { el.setAttribute("d", `M${p.x1.toFixed(1)} ${p.y1.toFixed(1)}L${p.x2.toFixed(1)} ${p.y2.toFixed(1)}`); el.setAttribute("stroke-width", p.width.toFixed(2)); el.setAttribute("opacity", p.opacity.toFixed(3)); } else el.setAttribute("opacity", "0"); });
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (sim.current) { sim.current.power = power; sim.current.bounce = bounce; } }, [power, bounce]);

  const pt = (e) => { const r = svg.current.getBoundingClientRect(); return [((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H]; };
  const down = (e) => { const [x, y] = pt(e); if (sim.current.grab(x, y)) e.currentTarget.setPointerCapture(e.pointerId); };
  const move = (e) => { if (sim.current.holding) { const [x, y] = pt(e); sim.current.move(x, y); } };
  const up = () => sim.current && sim.current.release();
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
      <div style={{ width: "min(92%, calc((100cqh) * 360 / 260))", aspectRatio: "360 / 260", background: "#1B1B1B", borderRadius: 10, overflow: "hidden", boxShadow: "inset 0 0 0 1px #333", touchAction: "none" }}>
        <svg ref={svg} viewBox={`0 0 ${W} ${H}`} style={{ display: "block", width: "100%", height: "100%", cursor: "grab" }} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
          <path ref={band} d={slingHull(W / 2, H / 2, SLING.SOCKET, W / 2, H / 2, SLING.R + 6)} fill="#fff" opacity="0.1" />
          {Array.from({ length: SLING.POOL }, (_, i) => <path key={i} ref={(n) => (sparks.current[i] = n)} d="M0 0L0 0" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity="0" fill="none" />)}
          <g ref={ball} transform={`translate(${W / 2} ${H / 2})`}>
            <circle r={SLING.R} fill="#fff" />
            <g ref={arrow} transform="rotate(0)"><path d="M0 8.5 L0 -8.5 M-5.5 -3 L0 -8.5 L5.5 -3" stroke="#1B1B1B" strokeWidth="2.3" fill="none" strokeLinecap="round" strokeLinejoin="round" transform="rotate(45)" /></g>
          </g>
        </svg>
      </div>
    </div>
  );
}
