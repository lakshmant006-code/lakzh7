import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLenis } from "@studio-freight/react-lenis";
import { playProjects } from "../../data/playProjects";
import "./Craft.css";

/* Everything on the craft wall: the experiments, then prototype clips from the case studies. */
const EXTRAS = [
  { id: "promove", title: "pro-move", tags: ["Motion capture", "Prototype"], media: { video: "/projects/promove/promove.mp4", poster: "/projects/promove/poster.jpg" }, to: "/pro-move" },
  { id: "keep-relive", title: "Keep · Re-live", tags: ["Meta AI concept", "Prototype"], media: { video: "/work/keep/sol-relive.mp4" }, to: "/keep" },
  { id: "hiku-gear", title: "Hiku · Gear", tags: ["Onboarding", "Prototype"], media: { video: "/work/Hiku/onboarding-gear.mp4" }, to: "/hiku" },
  { id: "keep-ask", title: "Keep · Ask", tags: ["Meta AI concept", "Prototype"], media: { video: "/work/keep/sol-ask.mp4" }, to: "/keep" },
];
/* the playful ones: tap and the real thing loads right there, to play with */
const LIVE = [
  { id: "live-street", title: "Street · be the cow", tags: ["Three.js", "Traffic physics", "Indian honks"], media: { image: "/projects/craft-live/street.jpg" }, live: "/nature/street.html" },
  { id: "live-bollywood", title: "Bollywood · the dupatta", tags: ["XPBD cloth", "Web Worker"], media: { image: "/projects/craft-live/bollywood.jpg" }, live: "/nature/bollywood.html" },
  { id: "live-grass", title: "Grass · plant a flower", tags: ["WebGL2", "Walk cycles"], media: { image: "/projects/craft-live/grass.jpg" }, live: "/grass/index.html?inner=1" },
  { id: "live-focus", title: "Focus · the trial lens", tags: ["Liquid glass", "WebGL"], media: { image: "/projects/craft-live/focus.jpg" }, live: "/nature/focus.html" },
  { id: "live-mites", title: "Rainy velvets", tags: ["Insect gait", "Canvas"], media: { image: "/projects/craft-live/mites.jpg" }, live: "/nature/mites.html" },
  { id: "pixel-cat", title: "Boba, the pixel cat", tags: ["Pixel art", "Pet"], media: { image: "/projects/craft-live/pixel-cat.jpg" }, to: "/pixel-cat", toLabel: "Play with Boba →" },
];
const REST = [
  ...playProjects.map((p) => ({ id: p.id, title: p.title, tags: p.tags || [], media: p.media || {}, href: p.actions?.[0]?.url })),
  ...EXTRAS,
];
// woven together: a playful one, then a piece of work, so the wall reads as one body of craft
const ITEMS = [];
for (let i = 0; i < Math.max(LIVE.length, REST.length); i++) { if (LIVE[i]) ITEMS.push(LIVE[i]); if (REST[i]) ITEMS.push(REST[i]); }
const srcOf = (m) => m.video || m.image || m.thumbnail || m.poster;

/* one tile: plays only while on screen, and comes into focus as it scrolls in */
function Tile({ item, onOpen, hidden }) {
  const ref = useRef(null);
  const vid = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setInView(true);
      const v = vid.current;
      if (v) { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.08 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const m = item.media;
  return (
    <button
      type="button"
      ref={ref}
      className={`craft-tile${inView ? " in" : ""}${hidden ? " is-hidden" : ""}`}
      onClick={() => onOpen(item, ref.current)}
      aria-label={`Open ${item.title}`}
    >
      {item.live && <span className="craft-tile-live" aria-hidden="true">play</span>}
      {m.video ? (
        <video ref={vid} src={m.video} poster={m.poster} muted loop playsInline preload="metadata" />
      ) : (
        <img src={srcOf(m)} alt="" loading="lazy" decoding="async" />
      )}
    </button>
  );
}

/* the open piece: it grows out of its tile to the middle of the screen, title above, details below */
function Detail({ open, onClose }) {
  const { item, rect, el } = open;
  const media = useRef(null);
  const vid = useRef(null);
  const titleRef = useRef(null);
  const metaRef = useRef(null);
  const [shown, setShown] = useState(false);
  const [liveOn, setLiveOn] = useState(false);
  const closing = useRef(false);
  const touch = useRef(null);

  const target = () => {
    const vw = window.innerWidth, vh = window.innerHeight;
    const aspect = rect.width / rect.height;
    const maxW = Math.min(vw * 0.92, item.live ? 940 : 620), maxH = vh * (item.live ? 0.7 : 0.64) - 40;
    let w = maxW, h = w / aspect;
    if (h > maxH) { h = maxH; w = h * aspect; }
    return { left: (vw - w) / 2, top: (vh - h) / 2, width: w, height: h };
  };
  const fromTile = (t) => {
    const r = el?.getBoundingClientRect() || rect;
    return `translate(${r.left - t.left}px, ${r.top - t.top}px) scale(${r.width / t.width}, ${r.height / t.height})`;
  };

  useLayoutEffect(() => {
    const t = target(), m = media.current;
    Object.assign(m.style, { left: `${t.left}px`, top: `${t.top}px`, width: `${t.width}px`, height: `${t.height}px` });
    titleRef.current.style.top = `${Math.max(8, t.top - 38)}px`;                 // the title sits just above, the details just below
    metaRef.current.style.top = `${t.top + t.height + 16}px`; metaRef.current.style.bottom = "auto";
    const tileVid = el?.querySelector("video");
    if (vid.current && tileVid) { try { vid.current.currentTime = tileVid.currentTime; } catch { /* not ready yet */ } vid.current.play().catch(() => {}); }
    m.animate([{ transform: fromTile(t), borderRadius: "12px" }, { transform: "none", borderRadius: "18px" }],
      { duration: 620, easing: "cubic-bezier(.2,.9,.25,1)", fill: "both" });
    requestAnimationFrame(() => setShown(true));
    if (item.live) { const id = setTimeout(() => setLiveOn(true), 640); return () => clearTimeout(id); }   // the real thing takes over once it has grown into place
    return undefined;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    setShown(false); setLiveOn(false);
    const t = target();
    const a = media.current.animate([{ transform: "none", borderRadius: "18px" }, { transform: fromTile(t), borderRadius: "12px" }],
      { duration: 480, easing: "cubic-bezier(.4,0,.2,1)", fill: "both" });
    a.onfinish = onClose;
  }, [onClose]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const k = (e) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [close]);

  const m = item.media;
  return (
    <div
      className={`craft-detail${shown ? " on" : ""}`}
      role="dialog"
      aria-label={item.title}
      onClick={close}
      onTouchStart={(e) => { touch.current = e.touches[0].clientY; }}
      onTouchMove={(e) => { if (touch.current != null && e.touches[0].clientY - touch.current > 70) { touch.current = null; close(); } }}
    >
      <h2 className="craft-detail-title" ref={titleRef}>{item.title}</h2>
      <div className="craft-detail-media" ref={media} onClick={item.live ? (e) => e.stopPropagation() : undefined}>
        {m.video ? <video ref={vid} src={m.video} poster={m.poster} muted loop playsInline autoPlay /> : <img src={srcOf(m)} alt={item.title} />}
        {item.live && liveOn && <iframe className="craft-live" src={item.live} title={item.title} allow="autoplay" onLoad={(e) => e.currentTarget.classList.add("on")} />}
      </div>
      <div className="craft-detail-meta" ref={metaRef} onClick={(e) => e.stopPropagation()}>
        <span>{item.tags.join(" · ")}</span>
        {item.href && <a href={item.href} target="_blank" rel="noreferrer">Open ↗</a>}
        {item.to && <Link to={item.to}>{item.toLabel || "Case study →"}</Link>}
        {item.live && <span className="craft-live-tag">live · tap outside to close</span>}
      </div>
    </div>
  );
}

const Craft = () => {
  const [open, setOpen] = useState(null);
  const wall = useRef(null);
  const lenis = useLenis(({ velocity }) => {
    // the faster the wall moves, the more it smears, like the camera can't keep up
    const b = Math.min(10, Math.abs(velocity) * 0.35);
    wall.current?.style.setProperty("--vblur", `${b.toFixed(2)}px`);
  });

  useEffect(() => {
    if (!open) return undefined;
    lenis?.stop();
    return () => lenis?.start();
  }, [open, lenis]);

  useEffect(() => {
    document.documentElement.classList.add("craft-dark");
    return () => document.documentElement.classList.remove("craft-dark");
  }, []);

  return (
    <main className="craft-wall-page">
      <h1 className="sr-only">Craft</h1>
      <div className={`craft-wall${open ? " is-behind" : ""}`} ref={wall}>
        {ITEMS.map((it) => (
          <Tile key={it.id} item={it} hidden={open?.item.id === it.id} onOpen={(item, el) => setOpen({ item, el, rect: el.getBoundingClientRect() })} />
        ))}
      </div>
      {open && <Detail open={open} onClose={() => setOpen(null)} />}
    </main>
  );
};

export default Craft;
