import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

/* Morph sign-in: a small "Sign In" pill that grows into a sign-in card, and back. One box does all of it: its width, height, corner and colour
   follow a single spring, the pill's label blurs away, and the card's rows blur in one after another.
   Duration is how long the move takes, Bounce how far it overshoots, Blur how soft the swap of contents is, Stagger how far apart the rows arrive. */
const PILL = { w: 78, h: 28, r: 14 }, CARD = { w: 240, h: 218, r: 12 };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const X = <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
const GH = <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" /></svg>;

export default function MorphSignIn({ duration = 0.55, bounce = 0.15, blur = 6, stagger = 0.1 }) {
  const wrap = useRef(null), box = useRef(null), pillTxt = useRef(null), rows = useRef([]), shell = useRef(null);
  const st = useRef({ p: 0, v: 0, target: 0 }), [open, setOpen] = useState(false), cfg = useRef({});
  const [scale, setScale] = useState(1);
  cfg.current = { duration, bounce, blur, stagger };
  useLayoutEffect(() => { const el = wrap.current, f = () => setScale(clamp(Math.min(el.clientHeight / (CARD.h + 36), el.clientWidth / (CARD.w + 24)), 0.45, 1.4)); f(); const ro = new ResizeObserver(f); ro.observe(el); return () => ro.disconnect(); }, []);
  useEffect(() => {
    let raf, last = performance.now(), acc = 0;
    const draw = () => { const { p } = st.current, { blur: b, stagger: sg } = cfg.current, q = clamp(p, 0, 1.15);
      const el = box.current; if (!el) return;
      el.style.width = `${lerp(PILL.w, CARD.w, q)}px`; el.style.height = `${lerp(PILL.h, CARD.h, q)}px`; el.style.borderRadius = `${lerp(PILL.r, CARD.r, clamp(q, 0, 1))}px`;
      const c = clamp(p, 0, 1), g = Math.round(lerp(190, 255, clamp(c * 1.6, 0, 1)));
      el.style.background = `rgb(${g},${g},${g})`; el.style.boxShadow = `0 10px 30px rgba(0,0,0,${(0.12 * c).toFixed(3)}), 0 0 0 1px rgba(0,0,0,${(0.07 * c).toFixed(3)})`;
      const pl = clamp(1 - c * 3.2, 0, 1); pillTxt.current.style.opacity = pl; pillTxt.current.style.filter = `blur(${((1 - pl) * b).toFixed(2)}px)`;
      rows.current.forEach((r, i) => { if (!r) return; const t = clamp((c - 0.3 - i * sg * 0.55) / 0.4, 0, 1), e = 1 - Math.pow(1 - t, 3);
        r.style.opacity = e; r.style.filter = b > 0 ? `blur(${((1 - e) * b).toFixed(2)}px)` : "none"; r.style.transform = `translateY(${((1 - e) * 5).toFixed(2)}px)`; });
      shell.current.style.pointerEvents = c > 0.6 ? "auto" : "none"; pillTxt.current.parentNode.style.pointerEvents = c < 0.4 ? "auto" : "none";
    };
    const frame = (now) => { raf = requestAnimationFrame(frame); acc += Math.min(0.05, (now - last) / 1000); last = now;
      const { duration: d, bounce: bo } = cfg.current, z = clamp(1 - bo, 0.25, 1), w = 4 / (z * Math.max(0.12, d)), s = st.current;
      while (acc >= 1 / 120) { acc -= 1 / 120; const a = -w * w * (s.p - s.target) - 2 * z * w * s.v; s.v += a / 120; s.p += s.v / 120; if (Math.abs(s.p - s.target) < 0.0005 && Math.abs(s.v) < 0.0005) { s.p = s.target; s.v = 0; } }
      draw(); };
    raf = requestAnimationFrame(frame); return () => cancelAnimationFrame(raf);
  }, []);
  const go = (o) => { st.current.target = o ? 1 : 0; setOpen(o); };
  useEffect(() => { const k = (e) => { if (e.key === "Escape") go(false); }; window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, []);
  const row = (i) => (n) => (rows.current[i] = n);
  const btn = { display: "flex", alignItems: "center", justifyContent: "center", gap: 7, height: 32, borderRadius: 7, border: 0, background: "#e7e7fb", color: "#16161d", font: "500 11px/1 Inter, system-ui, sans-serif", cursor: "pointer", width: "100%" };
  return (
    <div ref={wrap} style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: "#fbfbfb", backgroundImage: "linear-gradient(rgba(0,0,0,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.045) 1px, transparent 1px)", backgroundSize: "22px 22px", borderRadius: 10, overflow: "hidden", color: "#111" }}>
      <div style={{ width: CARD.w + 24, height: CARD.h + 24, display: "grid", placeItems: "center", transform: `scale(${scale})`, transformOrigin: "center" }}>
        <div ref={box} style={{ position: "relative", width: PILL.w, height: PILL.h, borderRadius: PILL.r, background: "#bebebe", overflow: "hidden" }}>
          <button type="button" aria-label="Sign in" aria-expanded={open} onClick={() => go(true)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0, background: "transparent", cursor: "pointer", display: "grid", placeItems: "center", padding: 0 }}>
            <span ref={pillTxt} style={{ font: "500 11px/1 Inter, system-ui, sans-serif", color: "#16161d", whiteSpace: "nowrap" }}>Sign In</span>
          </button>
          <div ref={shell} style={{ position: "absolute", left: 0, top: 0, width: CARD.w, height: CARD.h, padding: 8, boxSizing: "border-box", pointerEvents: "none", font: "500 11px/1 Inter, system-ui, sans-serif" }}>
            <div ref={row(0)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 22, padding: "0 2px 0 4px", fontWeight: 600 }}>
              <span>Sign In</span><button type="button" aria-label="Close" onClick={() => go(false)} style={{ border: 0, background: "transparent", cursor: "pointer", fontSize: 14, lineHeight: 1, color: "#333", padding: 2 }}>×</button>
            </div>
            <div ref={row(1)} style={{ marginTop: 8 }}><button type="button" style={btn}>{X}Continue with X</button></div>
            <div ref={row(2)} style={{ marginTop: 6 }}><button type="button" style={btn}>{GH}Continue with GitHub</button></div>
            <div ref={row(3)} style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, color: "#222" }}><i style={{ flex: 1, height: 1, background: "rgba(0,0,0,.09)" }} />Or<i style={{ flex: 1, height: 1, background: "rgba(0,0,0,.09)" }} /></div>
            <div ref={row(4)} style={{ marginTop: 10 }}><input type="email" placeholder="Email" aria-label="Email" style={{ width: "100%", boxSizing: "border-box", height: 30, border: 0, borderBottom: "1px solid rgba(0,0,0,.08)", background: "transparent", padding: "0 4px", font: "400 11px/1 Inter, system-ui, sans-serif", outline: "none", color: "#111" }} /></div>
            <div ref={row(5)} style={{ marginTop: 10 }}><button type="button" style={{ ...btn, background: "#0a0a0a", color: "#fff", height: 34 }}>Continue <span aria-hidden="true">→</span></button></div>
          </div>
        </div>
      </div>
    </div>
  );
}
