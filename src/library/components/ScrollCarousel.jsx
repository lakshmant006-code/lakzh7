import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

/* Scroll carousel: picture cards stood round a 3D barrel that you see from the front, so three or so show flat and the rest curve away.
   Scroll (wheel, drag, swipe or arrow keys) and the barrel turns; the cards coming round are lit, the ones turning away dim.
   It has its own config panel in the corner (click a section title to fold it). The same settings can be passed in as props.
     Animate: keeps drifting when you are not scrolling. Scroll drive: lets you scroll it. Vertical: turns it top to bottom. Infinite: spins round
     forever (off: it stops at the first and last card). Ratio: how far one scroll turns it. Debug: draws the scroll sections.
     Rotation X / Z: lean the whole barrel. Backface: show the backs of cards. Perspective: how strong the depth is. Gap: space between cards.
     Items: how many cards. Sort them: keep the pictures in order. Grid: the scroll ruler (lines one card apart, sliding with the barrel). */
const PICS = Array.from({ length: 8 }, (_, i) => `/library/art-${i + 1}.webp`);   // swap these for your own pictures
const W = 96, H = 128;                                                              // one card, before the stage scales it
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const SHUFFLE = [3, 6, 1, 7, 0, 4, 2, 5];
const DEFAULTS = { animate: 0, drive: 1, vertical: 0, infinite: 1, ratio: 1, debug: 1, rotX: 0, rotZ: 0, backface: 1, perspective: 320, gap: 0.1, items: 16, sort: 1, grid: 1, smoothness: 0.28, snap: 0, panel: 1 };

const SECTIONS = [
  ["Config", [["animate", "Animate", "check"]]],
  ["Scrolling", [["drive", "Scroll drive", "check"], ["vertical", "Vertical", "check"], ["infinite", "Infinite", "check"], ["ratio", "Ratio", "range", 0.3, 3, 0.1], ["debug", "Debug", "check"]]],
  ["Rotation", [["rotX", "X", "range", -60, 60, 1], ["rotZ", "Z", "range", -90, 90, 1]]],
  ["Mask", [["backface", "Backface", "check"], ["perspective", "Perspective (px)", "range", 150, 1200, 10], ["gap", "Gap (%)", "range", 0, 1, 0.05], ["items", "Items", "range", 6, 24, 1], ["sort", "Sort them", "check"]]],
];

function Panel({ v, set }) {
  const [shut, setShut] = useState({ Rotation: true });
  const row = { display: "grid", gridTemplateColumns: "62px 1fr 26px", alignItems: "center", gap: 6, height: 17, padding: "0 6px", color: "#9a9a96", font: "400 8.5px/1 system-ui, sans-serif" };
  return (
    <div onPointerDown={(e) => e.stopPropagation()} onWheel={(e) => e.stopPropagation()} style={{ position: "absolute", top: 10, right: 10, width: 156, borderRadius: 5, background: "rgba(24,24,24,.94)", boxShadow: "inset 0 0 0 1px #2c2c2c, 0 10px 24px rgba(0,0,0,.45)", color: "#d6d6d2", overflow: "hidden", zIndex: 5, cursor: "default" }}>
      <div style={{ textAlign: "center", font: "500 8.5px/1 system-ui, sans-serif", padding: "6px 0 5px", color: "#b8b8b4", background: "#202020" }}>Config</div>
      {SECTIONS.map(([name, rows]) => (
        <div key={name}>
          {name !== "Config" && <button type="button" onClick={() => setShut((s) => ({ ...s, [name]: !s[name] }))} style={{ all: "unset", boxSizing: "border-box", display: "flex", justifyContent: "space-between", width: "100%", padding: "5px 6px", background: "#262626", font: "500 8.5px/1 system-ui, sans-serif", color: "#cfcfcb", cursor: "pointer" }}><span>{name}</span><span aria-hidden="true">{shut[name] ? "›" : "⌄"}</span></button>}
          {!shut[name] && rows.map(([k, label, kind, lo, hi, st]) => kind === "check"
            ? <button key={k} type="button" role="checkbox" aria-checked={!!v[k]} onClick={() => set(k, v[k] ? 0 : 1)} style={{ all: "unset", boxSizing: "border-box", display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", height: 17, padding: "0 6px", color: "#9a9a96", font: "400 8.5px/1 system-ui, sans-serif", cursor: "pointer" }}>
                <span>{label}</span><span style={{ width: 10, height: 10, borderRadius: 2, display: "grid", placeItems: "center", background: v[k] ? "#f2f2f0" : "#333", color: "#111", fontSize: 8, lineHeight: 1 }}>{v[k] ? "✓" : ""}</span></button>
            : <label key={k} style={row}><span>{label}</span><input type="range" min={lo} max={hi} step={st} value={v[k]} onChange={(e) => set(k, parseFloat(e.target.value))} style={{ width: "100%", height: 10, accentColor: "#e8e8e4", margin: 0 }} /><output style={{ textAlign: "right", color: "#d6d6d2", font: "400 8px/1 ui-monospace, Menlo, monospace" }}>{v[k]}</output></label>)}
        </div>
      ))}
    </div>
  );
}

export default function ScrollCarousel(props) {
  const [v, setV] = useState({ ...DEFAULTS, ...props });
  useEffect(() => { setV((o) => ({ ...o, ...props })); }, [JSON.stringify(props)]);          // eslint-disable-line react-hooks/exhaustive-deps
  const set = (k, val) => setV((o) => ({ ...o, [k]: val }));
  const { grid, animate, drive, vertical, infinite, ratio, rotX, rotZ, backface, perspective, gap, items, sort, debug, smoothness, snap, panel } = v;
  const wrap = useRef(null), ring = useRef(null), els = useRef([]);
  const S = useRef({ a: 0, t: 0, idle: 0, drag: null, vel: 0 }), cfg = useRef({});
  const [scale, setScale] = useState(1), sc = useRef(1); sc.current = scale;
  const half = (vertical ? H : W) / 2, radius = Math.round(half / Math.tan(Math.PI / items) * (1 + gap));
  cfg.current = { grid, animate, drive, vertical, infinite, ratio, rotX, rotZ, backface, perspective, gap, items, sort, debug, smoothness, snap, radius };
  useLayoutEffect(() => { const el = wrap.current, f = () => setScale(clamp(Math.min(el.clientWidth / 520, el.clientHeight / 300), 0.4, 1.8)); f(); const ro = new ResizeObserver(f); ro.observe(el); return () => ro.disconnect(); }, []);
  useEffect(() => {
    const el = wrap.current, s = S.current;
    const lim = () => ((cfg.current.items - 1) * Math.PI * 2) / cfg.current.items;
    const add = (d) => { const c = cfg.current; if (!c.drive) return; s.t += d; if (!c.infinite) s.t = clamp(s.t, 0, lim()); s.idle = performance.now(); };
    const wheel = (e) => { if (!cfg.current.drive) return; e.preventDefault(); e.stopPropagation(); add((Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX) * 0.004 * cfg.current.ratio); };
    el.addEventListener("wheel", wheel, { passive: false });
    let raf, last = performance.now();
    const frame = (now) => { raf = requestAnimationFrame(frame); const dt = Math.min(0.05, (now - last) / 1000); last = now; const c = cfg.current, step = (Math.PI * 2) / c.items;
      if (c.animate && !s.drag && now - s.idle > 900) s.t += dt * 0.35;
      if (c.snap && !s.drag && now - s.idle > 140) s.t = Math.round(s.t / step) * step;
      s.a += (s.t - s.a) * (1 - Math.exp(-dt / Math.max(0.03, c.smoothness)));
      // the grid is the scroll ruler: lines one card apart that slide with the barrel (fine lines in between), so you see how far and which way you have scrolled
      const w = wrap.current; if (w && c.grid) { const pitch = Math.max(16, step * c.radius * sc.current), off = -s.a * c.radius * sc.current, mid = (c.vertical ? w.clientHeight : w.clientWidth) / 2 - pitch / 2, q = pitch / 4;
        const P = (mid + off) % pitch; w.style.setProperty("--gp", `${pitch}px`); w.style.setProperty("--gq", `${q}px`); w.style.setProperty("--go", `${P.toFixed(1)}px`); }
      const r = ring.current; if (!r) return;
      r.style.transform = `translateZ(${-c.radius}px) rotateZ(${c.rotZ}deg) rotateX(${c.rotX}deg) ${c.vertical ? `rotateX(${(s.a * 57.3).toFixed(2)}deg)` : `rotateY(${(-s.a * 57.3).toFixed(2)}deg)`}`;
      els.current.forEach((n, i) => { if (!n) return; const f = Math.cos(i * step - s.a), lit = clamp(0.25 + 0.75 * (f * 0.5 + 0.5), 0, 1); n.style.filter = `brightness(${lit.toFixed(3)})`; });
    };
    raf = requestAnimationFrame(frame); return () => { cancelAnimationFrame(raf); el.removeEventListener("wheel", wheel); };
  }, []);
  const lim = () => ((cfg.current.items - 1) * Math.PI * 2) / cfg.current.items;
  const down = (e) => { const s = S.current, c = cfg.current; if (!c.drive) return; e.currentTarget.setPointerCapture(e.pointerId); const p = c.vertical ? e.clientY : e.clientX; s.drag = { p, t0: s.t, lp: p, lt: performance.now() }; };
  const move = (e) => { const s = S.current, d = s.drag; if (!d) return; const c = cfg.current, pos = c.vertical ? e.clientY : e.clientX;
    s.t = d.t0 - (pos - d.p) * 0.012 * c.ratio; if (!c.infinite) s.t = clamp(s.t, 0, lim()); s.vel = (pos - d.lp) / Math.max(1, performance.now() - d.lt); d.lp = pos; d.lt = performance.now(); };
  const up = () => { const s = S.current; if (!s.drag) return; const c = cfg.current; s.t -= s.vel * 120 * 0.012 * c.ratio; if (!c.infinite) s.t = clamp(s.t, 0, lim()); s.drag = null; s.idle = performance.now(); };
  const key = (e) => { const c = cfg.current, step = (Math.PI * 2) / c.items, k = e.key, s = S.current; if (!c.drive) return; const go = (d) => { e.preventDefault(); s.t = c.infinite ? s.t + d : clamp(s.t + d, 0, (c.items - 1) * step); s.idle = performance.now(); };
    if (["ArrowRight", "ArrowDown"].includes(k)) go(step); if (["ArrowLeft", "ArrowUp"].includes(k)) go(-step); };
  const step = 360 / items;
  const fine = "rgba(255,255,255,.045)", coarse = "rgba(255,255,255,.11)";
  return (
    <div ref={wrap} tabIndex={0} role="group" aria-label="Scroll carousel: scroll, drag or use the arrow keys" onKeyDown={key} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
      style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", touchAction: "none", cursor: drive ? "grab" : "default", outline: "none", display: "grid", placeItems: "center", background: "#0a0a0a", borderRadius: 10 }}>
      {grid ? <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", WebkitMaskImage: "radial-gradient(ellipse at 18% 0%, #000 0%, rgba(0,0,0,.55) 45%, transparent 85%)", maskImage: "radial-gradient(ellipse at 18% 0%, #000 0%, rgba(0,0,0,.55) 45%, transparent 85%)",
        backgroundImage: vertical
          ? `linear-gradient(${coarse} 1px, transparent 1px), linear-gradient(${fine} 1px, transparent 1px)`
          : `linear-gradient(90deg, ${coarse} 1px, transparent 1px), linear-gradient(90deg, ${fine} 1px, transparent 1px), linear-gradient(${fine} 1px, transparent 1px)`,
        backgroundSize: vertical ? "100% var(--gp), 100% var(--gq)" : "var(--gp) 100%, var(--gq) 100%, 100% var(--gq)", backgroundPosition: vertical ? "0 var(--go), 0 var(--go), 0 0" : "var(--go) 0, var(--go) 0, 0 0" }} /> : null}
      {debug ? <>
        <i style={{ position: "absolute", left: 0, right: 0, top: "30%", height: 0, borderTop: "1.5px dotted #ff2b2b", pointerEvents: "none" }} /><i style={{ position: "absolute", left: 0, right: 0, bottom: "20%", height: 0, borderTop: "1.5px dotted #ff2b2b", pointerEvents: "none" }} />
        {[14, 36, 59, 82].map((x) => <i key={x} style={{ position: "absolute", top: "30%", bottom: "20%", left: x + "%", width: 0, borderLeft: "1.5px dotted #ff2b2b", pointerEvents: "none" }} />)}
      </> : null}
      <span aria-hidden="true" style={{ position: "absolute", right: 16, top: "64%", writingMode: "vertical-rl", transform: "rotate(180deg)", font: "700 17px/1 system-ui, sans-serif", letterSpacing: "-.01em", color: "rgba(255,255,255,.62)", pointerEvents: "none" }}>scroll.</span>
      <div style={{ width: 0, height: 0, marginTop: "6%", perspective: perspective * scale, perspectiveOrigin: "50% 50%", transform: `translateX(${panel ? -64 * scale : 0}px) scale(${scale})`, transformOrigin: "center", pointerEvents: "none" }}>
        <div ref={ring} style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, transformStyle: "preserve-3d", transform: `translateZ(${-radius}px)` }}>
          {Array.from({ length: items }, (_, i) => (
            <div key={i} ref={(n) => (els.current[i] = n)} style={{ position: "absolute", left: -W / 2, top: -H / 2, width: W, height: H, borderRadius: 5, overflow: "hidden", transform: `${vertical ? "rotateX" : "rotateY"}(${i * step}deg) translateZ(${radius}px)`, backfaceVisibility: backface ? "visible" : "hidden", WebkitBackfaceVisibility: backface ? "visible" : "hidden", backgroundImage: `url(${PICS[(sort ? i : SHUFFLE[i % 8] + Math.floor(i / 8)) % PICS.length]})`, backgroundSize: "cover", backgroundPosition: "center", boxShadow: "0 6px 18px rgba(0,0,0,.5)" }} />
          ))}
        </div>
      </div>
      {panel ? <Panel v={v} set={set} /> : null}
    </div>
  );
}
