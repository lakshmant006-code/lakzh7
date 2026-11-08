import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { newId } from "./handLook";
import { fetchHands, warmHands } from "../../utils/handCache";
import "./HandStudio.css";

/* Opens from the hand button in the nav: the open hand as a canvas, colours on the right, to draw
   any accessories or nail paints you like. */
const COLORS = [
  { name: "Red", c: "#e63946" }, { name: "Pink", c: "#ff6fa8" }, { name: "Purple", c: "#8b5cf6" },
  { name: "Blue", c: "#2f6bff" }, { name: "Teal", c: "#14b8a6" }, { name: "Green", c: "#3fae4a" },
  { name: "Yellow", c: "#ffd23f" }, { name: "Gold", c: "#d4a017" }, { name: "Silver", c: "#c0c4cc" },
  { name: "White", c: "#ffffff" }, { name: "Black", c: "#1a1a1a" },
];
const W = 860, H = 1160;                       // the drawing's own size: it matches the open hand (public/hand/open-hand-svg.webp, drawn from open-hand.svg)
const BRUSH = 14;

export default function HandStudio() {
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState(COLORS[0].c);
  const [erase, setErase] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [ink, setInk] = useState(false);                    // anything drawn yet
  const [sent, setSent] = useState("idle");                 // idle | saving | saved | error
  const [msg, setMsg] = useState("");
  const [id, setId] = useState(newId);                    // chosen up front: it decides which look the hand takes
  const navigate = useNavigate();
  const cv = useRef(null), undo = useRef([]), stroke = useRef(null);

  useEffect(() => { warmHands(); }, []);                    // the gallery is fetched while the browser is idle
  useEffect(() => {
    const show = () => setOpen(true);
    const key = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("hand:click", show);
    window.addEventListener("keydown", key);
    return () => { window.removeEventListener("hand:click", show); window.removeEventListener("keydown", key); };
  }, []);

  // the page behind stays put while this is open
  const shell = useRef(null);
  useEffect(() => {
    const el = shell.current; if (!open || !el) return undefined;
    const stop = (e) => e.stopPropagation();
    el.addEventListener("wheel", stop, { passive: true }); el.addEventListener("touchmove", stop, { passive: true });
    return () => { el.removeEventListener("wheel", stop); el.removeEventListener("touchmove", stop); };
  }, [open]);

  const pos = (e) => { const r = cv.current.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; };
  const snapshot = () => { const c = cv.current, g = c.getContext("2d"); undo.current.push(g.getImageData(0, 0, W, H)); if (undo.current.length > 30) undo.current.shift(); setCanUndo(true); };

  /* A stabilized brush. The brush does not sit on the pointer: it glides after it on a soft spring (so hand shake and
     the steps between pointer events melt away), and the line is a curve through the midpoints of the smoothed points,
     never straight pieces. When you lift, it finishes the last bit of the way to where you stopped. */
  const TAU = 0.055;                                       // seconds: how lazily the brush follows (higher = smoother, slower to catch up)
  const paint = (g, from, ctrl, to) => {
    g.globalCompositeOperation = erase ? "destination-out" : "source-over";
    g.strokeStyle = color; g.lineWidth = erase ? BRUSH * 1.8 : BRUSH; g.lineCap = g.lineJoin = "round";
    g.beginPath(); g.moveTo(from[0], from[1]); g.quadraticCurveTo(ctrl[0], ctrl[1], to[0], to[1]); g.stroke();
  };
  const follow = (st, x, y, t) => {
    const k = 1 - Math.exp(-Math.max(1, t - st.t) / 1000 / TAU); st.t = t;
    const px = st.sx, py = st.sy;
    // two stages: the first rope follows the pointer, the brush follows the first rope; wobble has to get through both
    st.ax += (x - st.ax) * k; st.ay += (y - st.ay) * k;
    st.sx += (st.ax - st.sx) * k; st.sy += (st.ay - st.sy) * k;
    const mid = [(px + st.sx) / 2, (py + st.sy) / 2];
    paint(cv.current.getContext("2d"), st.mid, [px, py], mid);
    st.mid = mid;
  };
  const down = (e) => {
    e.preventDefault(); cv.current.setPointerCapture(e.pointerId); snapshot();
    const g = cv.current.getContext("2d"), [x, y] = pos(e);
    stroke.current = { sx: x, sy: y, ax: x, ay: y, mid: [x, y], t: e.timeStamp, tx: x, ty: y };
    setInk(true); if (sent !== "idle") setSent("idle");
    g.globalCompositeOperation = erase ? "destination-out" : "source-over";
    g.fillStyle = color; g.beginPath(); g.arc(x, y, (erase ? BRUSH * 1.8 : BRUSH) / 2, 0, 6.2832); g.fill();   // a tap leaves a dot
  };
  const move = (e) => {
    const st = stroke.current; if (!st) return;
    const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];                // every sample the screen reported, not just the last
    for (const ev of (evs.length ? evs : [e])) { const [x, y] = pos(ev); st.tx = x; st.ty = y; follow(st, x, y, ev.timeStamp); }
  };
  const up = (e) => {
    const st = stroke.current; stroke.current = null; if (!st) return;
    for (let i = 0; i < 26; i++) follow(st, st.tx, st.ty, st.t + 16);               // let the brush glide on to the end of the stroke
    const g = cv.current.getContext("2d"); paint(g, st.mid, [st.sx, st.sy], [st.tx, st.ty]);
  };
  const doUndo = useCallback(() => { const p = undo.current.pop(); if (!p) return; cv.current.getContext("2d").putImageData(p, 0, 0); setCanUndo(undo.current.length > 0); }, []);
  const clear = () => { snapshot(); cv.current.getContext("2d").clearRect(0, 0, W, H); setInk(false); };

  // the strokes alone (transparent), a little smaller, are what gets shared; the gallery draws them back over the hand
  const share = async () => {
    setSent("saving"); setMsg("");
    try {
      const out = document.createElement("canvas"); out.width = 600; out.height = Math.round(600 * H / W);
      const g = out.getContext("2d"); g.imageSmoothingQuality = "high"; g.drawImage(cv.current, 0, 0, out.width, out.height);
      const r = await fetch("/api/hand-drawings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, imageDataUri: out.toDataURL("image/png") }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.id) throw new Error(j.error || "the drawing store did not answer, so nothing was saved");
      setSent("saved"); setId(newId()); fetchHands(true).catch(() => {}); window.dispatchEvent(new CustomEvent("hand:saved"));
    } catch (e) { setSent("error"); setMsg(e.message || "could not save"); }
  };
  const gallery = () => { setOpen(false); navigate("/hands"); };

  if (!open) return null;
  return (
    <div className="hand-studio" ref={shell} role="dialog" aria-label="Draw on the hand">
      <div className="hs-card">
        <button type="button" className="hs-x" aria-label="Close" onClick={() => setOpen(false)}>×</button>
        <div className="hs-stage">
          <div className="hs-art">
            <img className="hs-base" src="/hand/open-hand-svg.webp" alt="An open orange hand, ready to be drawn on" draggable="false" />
            <canvas ref={cv} width={W} height={H} className="hs-draw" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} />
          </div>
        </div>
        <aside className="hs-side">
          <h2 className="hs-title">Draw any accessories or nail paints you want it to be.</h2>
          <div className="hs-colors" role="radiogroup" aria-label="Colour">
            {COLORS.map((o) => (
              <button key={o.c} type="button" role="radio" aria-checked={!erase && color === o.c} aria-label={o.name} title={o.name}
                className={`hs-swatch${!erase && color === o.c ? " on" : ""}`} style={{ "--c": o.c }} onClick={() => { setColor(o.c); setErase(false); }} />
            ))}
            <button type="button" role="radio" aria-checked={erase} aria-label="Eraser" title="Eraser" className={`hs-swatch hs-eraser${erase ? " on" : ""}`} onClick={() => setErase(true)} />
          </div>
          <div className="hs-actions">
            <button type="button" onClick={doUndo} disabled={!canUndo}>Undo</button>
            <button type="button" onClick={clear}>Clear</button>
          </div>
          <button type="button" className="hs-share" onClick={share} disabled={!ink || sent === "saving" || sent === "saved"}>
            {sent === "saving" ? "Adding…" : sent === "saved" ? "Added ✓" : "Add to the gallery"}
          </button>
          {sent === "error" && <p className="hs-note hs-err">{msg}. Try again in a moment.</p>}
          {sent === "saved" && <p className="hs-note">It's in the gallery now.</p>}
          <button type="button" className="hs-link" onClick={gallery}>See what everyone drew →</button>
        </aside>
      </div>
    </div>
  );
}
