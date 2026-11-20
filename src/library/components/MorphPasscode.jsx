import React, { useEffect, useRef } from "react";

/* From MORPH, "Passcode reveal". A protected number behind dots, with an eye and a copy button.
   Press the eye: the dots turn into digits one after another (12 of 16; the last four are always shown), the eye closes, the border lights up
   and the copy icon brightens. Press again and the whole thing runs back. While the eye is open its pupil follows the cursor; hover the eye
   for its soft square. It is the MORPH timeline (0.34 s, eased key to key) played forward and back; Duration stretches it. */
const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';
const STARTS = [0, 0.018, 0.036, 0.054, 0.072, 0.089, 0.106, 0.122, 0.138, 0.153, 0.167, 0.18], FADE = 0.12, END = 0.34;
const ss = (x) => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
// a track is [time, value] keys; smoothstep between neighbours
const at = (keys, t) => { if (t <= keys[0][0]) return keys[0][1]; for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) { const [t0, v0] = keys[i - 1], [t1, v1] = keys[i]; return v0 + (v1 - v0) * ss((t - t0) / (t1 - t0 || 1)); } return keys[keys.length - 1][1]; };
const T = {
  eyeOpenO: [[0, 1], [0.14, 0]], eyeOpenS: [[0, 1], [0.14, 0.15]],
  eyeClosedO: [[0, 0], [0.06, 0], [0.16, 1]], eyeClosedS: [[0, 0.2], [0.06, 0.2], [0.16, 1]],
  border: [[0, 0], [0.14, 1]], copy: [[0, 1], [0.14, 0]], copyOn: [[0, 0], [0.14, 1]],
};

export default function MorphPasscode({ number = "4829 1036 7753 9204", duration = 0.34, follow = 1 }) {
  const svg = useRef(null), refs = useRef({}), st = useRef({ p: 0, dir: 0, hover: 0, hoverTo: 0, look: { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 }, press: 0 }), cfg = useRef({});
  cfg.current = { duration, follow };
  const digits = number.replace(/\s/g, "").split("");
  const x = (i) => 22 + 10.95 * (i + Math.floor(i / 4));
  const set = (k) => (n) => { refs.current[k] = n; };
  useEffect(() => {
    const s = st.current, L = s.look, R = refs.current;
    const mv = (e) => { if (!cfg.current.follow) { L.tx = L.ty = 0; return; } const el = R.eyeOpen; if (!el) return; const r = el.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2), d = Math.hypot(dx, dy) || 1, k = Math.tanh(d / 90); L.tx = (dx / d) * k; L.ty = (dy / d) * k; };
    window.addEventListener("pointermove", mv, { passive: true });
    let raf, last = performance.now(), blink = -1, next = 2;
    const frame = (now) => { raf = requestAnimationFrame(frame); const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const speed = END / Math.max(0.05, cfg.current.duration);                         // timeline seconds per real second
      if (s.dir) { s.p = Math.max(0, Math.min(END, s.p + s.dir * dt * speed)); if (s.p === 0 || s.p === END) s.dir = 0; }
      s.hover += (s.hoverTo - s.hover) * (1 - Math.exp(-dt * 14)); s.press += (0 - s.press) * (1 - Math.exp(-dt * 16));
      L.vx += (220 * (L.tx - L.x) - 22 * L.vx) * dt; L.x += L.vx * dt; L.vy += (220 * (L.ty - L.y) - 22 * L.vy) * dt; L.y += L.vy * dt;
      next -= dt; if (next <= 0) { blink = now; next = 2.8 + Math.random() * 3.2; }
      let b = 1; if (blink >= 0) { const e = (now - blink) / 190; if (e >= 1) blink = -1; else b = 1 - Math.sin(Math.PI * e) * 0.9; }
      const p = s.p, o = (k, v) => R[k] && R[k].setAttribute("opacity", Math.max(0, Math.min(1, v)).toFixed(3));
      for (let i = 0; i < 12; i++) { const a = STARTS[i], t = (p - a) / FADE, f = ss(t); o("dot" + i, 1 - f); o("dig" + i, f); }
      const eo = at(T.eyeOpenS, p) * b; o("eyeOpen", at(T.eyeOpenO, p)); R.eyeOpen && R.eyeOpen.setAttribute("transform", `translate(262 30) translate(12 12) scale(1 ${eo.toFixed(3)}) translate(-12 -12)`);
      o("eyeClosed", at(T.eyeClosedO, p)); R.eyeClosed && R.eyeClosed.setAttribute("transform", `translate(262 30) translate(12 12) scale(1 ${at(T.eyeClosedS, p).toFixed(3)}) translate(-12 -12)`);
      o("borderOn", at(T.border, p)); o("copy", at(T.copy, p)); o("copyOn", at(T.copyOn, p));
      R.copyG && R.copyG.setAttribute("transform", `translate(307 30) translate(12 12) scale(${(1 - s.press * 0.12).toFixed(3)}) translate(-12 -12)`);
      o("cover", 1 - s.hover);
      R.pupil && R.pupil.setAttribute("transform", `translate(${(L.x * 3.6).toFixed(2)} ${(L.y * 1.6).toFixed(2)})`);
    };
    raf = requestAnimationFrame(frame); return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", mv); };
  }, []);
  const press = () => { const s = st.current; s.dir = s.dir ? -s.dir : (s.p <= 0 ? 1 : -1); };
  const copyIt = async () => { st.current.press = 1; try { await navigator.clipboard.writeText(digits.join("")); } catch { /* clipboard blocked */ } };
  const key = (fn) => (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fn(); } };
  const stroke = { fill: "none", strokeLinecap: "round", strokeLinejoin: "round", vectorEffect: "non-scaling-stroke" };
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
      <svg ref={svg} viewBox="0 0 342 76" role="group" aria-label="Passcode reveal" style={{ width: "min(92%, calc(100cqh * 342 / 76))", maxWidth: 560, height: "auto", overflow: "visible", userSelect: "none" }}>
        <defs><clipPath id="mp-almond"><path d="M2 12 Q12 2 22 12 Q12 22 2 12 Z" /></clipPath></defs>
        <rect width="342" height="76" fill="#141414" />
        <text x="1" y="4.5" fontFamily={MONO} fontSize="7" letterSpacing="1" fill="#7A7A7A" dominantBaseline="central">NUMBER</text>
        <rect x=".5" y="11.5" width="341" height="60" fill="none" stroke="#4A4A4A" strokeWidth="1" />
        <rect ref={set("borderOn")} x="1" y="12" width="340" height="59" fill="none" stroke="#F2F2F2" strokeWidth="2" opacity="0" />
        {digits.slice(0, 12).map((d, i) => (
          <g key={i} fontFamily={MONO} fontWeight="500" fill="#F2F2F2" textAnchor="middle" dominantBaseline="central">
            <text ref={set("dot" + i)} x={x(i) + 5.5} y="41" fontSize="14">•</text>
            <text ref={set("dig" + i)} x={x(i) + 5.5} y="41" fontSize="18" opacity="0">{d}</text>
          </g>
        ))}
        <text x="186.25" y="41" fontFamily={MONO} fontSize="18" fontWeight="500" fill="#F2F2F2" dominantBaseline="central" style={{ whiteSpace: "pre" }}>{digits.slice(12).join("")}</text>
        {/* the eye */}
        <rect x="256" y="24" width="36" height="36" fill="#3A3A3A" />
        <rect ref={set("cover")} x="256" y="24" width="36" height="36" fill="#141414" />
        <g ref={set("eyeOpen")} transform="translate(262 30)" {...stroke} stroke="#8C8C8C" strokeWidth="1.4">
          <path d="M2 12 Q12 2 22 12 Q12 22 2 12 Z" />
          <g clipPath="url(#mp-almond)"><g ref={set("pupil")}><circle cx="12" cy="12" r="2.8" /></g></g>
        </g>
        <path ref={set("eyeClosed")} transform="translate(262 30)" d="M3 10 Q12 20 21 10 M12 15.5 V18.5 M6.5 13.2 L4.6 15.4 M17.5 13.2 L19.4 15.4" {...stroke} stroke="#F2F2F2" strokeWidth="1.6" opacity="0" />
        <rect x="256" y="24" width="36" height="36" fill="transparent" role="button" tabIndex={0} aria-label="Reveal or hide the number" style={{ cursor: "pointer" }} onMouseDown={(e) => e.preventDefault()} onClick={press} onKeyDown={key(press)}
          onPointerEnter={() => (st.current.hoverTo = 1)} onPointerLeave={() => (st.current.hoverTo = 0)} />
        {/* copy */}
        <g ref={set("copyG")} transform="translate(307 30)">
          <path ref={set("copy")} d="M8.5 8.5 H18.5 V18.5 H8.5 Z M5.5 15.5 V5.5 H15.5" {...stroke} stroke="#6E6E6E" strokeWidth="1.4" />
          <path ref={set("copyOn")} d="M8.5 8.5 H18.5 V18.5 H8.5 Z M5.5 15.5 V5.5 H15.5" {...stroke} stroke="#F2F2F2" strokeWidth="1.6" opacity="0" />
        </g>
        <rect x="307" y="30" width="24" height="24" fill="transparent" role="button" tabIndex={0} aria-label="Copy the number" style={{ cursor: "pointer" }} onMouseDown={(e) => e.preventDefault()} onClick={copyIt} onKeyDown={key(copyIt)} />
      </svg>
    </div>
  );
}
