import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLenis } from "@studio-freight/react-lenis";
import { playProjects } from "../../data/playProjects";
import "./Craft.css";

/* Everything on the craft wall: the experiments, then prototype clips from the case studies. */
const EXTRAS = [
  { id: "portfolio-reel", title: "Portfolio reel", tags: ["Motion", "Remotion"], media: { video: "/projects/portfolio-reel/portfolio-reel.mp4", poster: "/projects/portfolio-reel/poster.jpg" } },
  { id: "prayerbox", title: "Prayer Box", tags: ["Web app", "Motion"], media: { video: "/projects/prayerbox/prayerbox.mp4", poster: "/projects/prayerbox/poster.jpg" }, href: "https://www.prayerbox.site" },
  { id: "chime", title: "Chime · noise complaints", tags: ["NYC challenge", "Interactive prototype", "3D city map"], media: { image: "/projects/chime/media/chime-app.webp" }, about: "A voice-first concept for NYC noise complaints. Every complaint gets a heartbeat: a sound wave that changes as the city acts on it, a live 3D map built on the city's own building model, and a last word for you on whether it got quieter. Open the working prototype inside the case study.", to: "/craft/chime", toLabel: "Open case study →" },
  { id: "keep-relive", title: "Keep · Re-live", tags: ["Meta AI concept", "Prototype"], media: { video: "/work/keep/sol-relive.mp4" }, to: "/keep" },
  { id: "keep-ask", title: "Keep · Ask", tags: ["Meta AI concept", "Prototype"], media: { video: "/work/keep/sol-ask.mp4" }, to: "/keep" },
];
/* the playful ones: tap and the real thing loads right there, to play with */
const LIVE = [
  { id: "live-bollywood", title: "Bollywood · the dupatta", tags: ["XPBD cloth", "Web Worker"], media: { image: "/projects/craft-live/bollywood.jpg" }, live: "/nature/bollywood.html" },
];
/* drawings: a little screen on the wall that drifts from one to the next; tap it and they all spill out */
const ILLUSTRATIONS = [
  { src: "/projects/illustrations/scrap-metal.webp", w: 1600, h: 1600, title: "Pine Metalworks" },
  { src: "/projects/illustrations/lucky-13.webp", w: 1600, h: 1600, title: "Lucky 13 Cycles" },
  { src: "/projects/illustrations/road-trip.webp", w: 1600, h: 1600, title: "Everything we own" },
  { src: "/projects/illustrations/wilshire.webp", w: 1200, h: 1600, title: "Something on Wilshire" },
  { src: "/projects/illustrations/believe.webp", w: 1600, h: 1112, title: "Believe, humble, peace" },
];
/* a concept: Procreate animating a drawing from the camera */
const PROCREATE_MOTION = {
  id: "procreate-motion", title: "Motion tracking in Procreate", tags: ["Concept", "Pose tracking", "On-device"],
  media: { video: "/projects/procreate-motion/procreate-motion.mp4", poster: "/projects/procreate-motion/poster.jpg" },
  about: "A concept for bringing motion tracking into Procreate. You open a Reference window, the front camera follows your shoulders, elbows and head, and the character you drew copies you live on the canvas. Hit Add Frame to keep a pose, and a gesture becomes a frame-by-frame animation without drawing every in-between. The tracking stays on the iPad, and the artwork stays yours.",
  to: "/pro-move",
};
/* the first time people got their hands on pro-move: testing sessions around the studio */
const PROMOVE_TESTING = {
  id: "promove-testing", title: "pro-move · user testing", tags: ["Prototype testing", "SVSD hackathon"],
  media: { video: "/projects/promove-testing/promove-testing.mp4", poster: "/projects/promove-testing/poster.jpg" },
  about: "First hands on pro-move. We handed the iPad prototype to people around the studio and watched them perform, draw and laugh as their characters copied them. What they tried first, where they hesitated and what made them smile shaped the next round of the design.",
  to: "/pro-move",
};
const GALLERY = { id: "illustrations", title: "Illustrations", tags: ["Procreate", "Ink & watercolour"], media: {}, gallery: ILLUSTRATIONS };
const REST = [
  ...playProjects.map((p) => ({ id: p.id, title: p.title, tags: p.tags || [], media: p.media || {}, href: p.actions?.[0]?.url })),
  ...EXTRAS,
];
// woven together: a playful one, then a piece of work, so the wall reads as one body of craft
const ITEMS = [];
for (let i = 0; i < Math.max(LIVE.length, REST.length); i++) { if (LIVE[i]) ITEMS.push(LIVE[i]); if (REST[i]) ITEMS.push(REST[i]); }
ITEMS.splice(1, 0, GALLERY);
ITEMS.unshift(PROCREATE_MOTION);
ITEMS.splice(1, 0, PROMOVE_TESTING);
const srcOf = (m) => m.video || m.image || m.thumbnail || m.poster;

/* one tile: plays only while on screen, and comes into focus as it scrolls in */
function Tile({ item, onOpen, hidden }) {
  const ref = useRef(null);
  const vid = useRef(null);
  const [inView, setInView] = useState(false);
  const [frame, setFrame] = useState(0);
  useEffect(() => {                                           // the little screen drifts to the next drawing every few seconds
    if (!item.gallery || !inView) return undefined;
    const id = setInterval(() => setFrame((f) => (f + 1) % item.gallery.length), 2600);
    return () => clearInterval(id);
  }, [inView, item.gallery]);
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
      {item.gallery ? (
        <span className="craft-tile-gallery">
          {item.gallery.map((g, i) => <img key={g.src} src={g.src} alt="" loading="lazy" decoding="async" className={i === frame ? "on" : ""} />)}
        </span>
      ) : m.video ? (
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
    const maxW = Math.min(vw * 0.92, item.live ? 940 : item.about ? 760 : 620), maxH = vh * (item.live ? 0.7 : item.about ? 0.46 : 0.64) - 40;
    let w = maxW, h = w / aspect;
    if (h > maxH) { h = maxH; w = h * aspect; }
    return { left: (vw - w) / 2, top: (vh - h) / 2 - (item.about ? Math.min(90, vh * 0.1) : 0), width: w, height: h };   // room for the words underneath
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
      <div className={`craft-detail-meta${item.about ? " has-about" : ""}`} ref={metaRef} onClick={(e) => e.stopPropagation()}>
        {item.about && <p className="craft-detail-about">{item.about}</p>}
        <span>{item.tags.join(" · ")}</span>
        {item.href && <a href={item.href} target="_blank" rel="noreferrer">Open ↗</a>}
        {item.to && <Link to={item.to}>{item.toLabel || "Case study →"}</Link>}
        {item.live && <span className="craft-live-tag">live · tap outside to close</span>}
      </div>
    </div>
  );
}

/* the drawings pop out of their card one after another and land scattered like prints; tap one to bring it up */
const TILTS = [-3, 2.5, -1.5, 3, -2, 1.5];
function Gallery({ open, onClose }) {
  const { item, el } = open;
  const imgs = item.gallery;
  const refs = useRef([]);
  const [shown, setShown] = useState(false);
  const [focus, setFocus] = useState(null);
  const closing = useRef(false);

  const layout = () => {
    const vw = window.innerWidth, vh = window.innerHeight, n = imgs.length;
    const cols = vw < 640 ? 2 : 3, rows = Math.ceil(n / cols), gap = vw < 640 ? 12 : 22, pad = vw < 640 ? 16 : 48;
    const top = 92, bottom = 70, cw = (vw - pad * 2 - gap * (cols - 1)) / cols, ch = (vh - top - bottom - gap * (rows - 1)) / rows;
    return imgs.map((g, i) => {
      const r = Math.floor(i / cols), inRow = Math.min(cols, n - r * cols), c = i % cols;
      const a = g.w / g.h; let w = cw * 0.94, h = w / a; if (h > ch * 0.94) { h = ch * 0.94; w = h * a; }
      const rowW = inRow * cw + (inRow - 1) * gap, x0 = (vw - rowW) / 2;
      const cx = x0 + c * (cw + gap) + cw / 2, cy = top + r * (ch + gap) + ch / 2;
      return { left: cx - w / 2, top: cy - h / 2, width: w, height: h, rot: TILTS[i % TILTS.length] };
    });
  };
  const big = (i) => {
    const vw = window.innerWidth, vh = window.innerHeight, a = imgs[i].w / imgs[i].h;
    let w = Math.min(vw * 0.9, 1100), h = w / a; if (h > vh * 0.76) { h = vh * 0.76; w = h * a; }
    return { left: (vw - w) / 2, top: (vh - h) / 2, width: w, height: h, rot: 0 };
  };
  const place = (node, t) => Object.assign(node.style, { left: `${t.left}px`, top: `${t.top}px`, width: `${t.width}px`, height: `${t.height}px`, transform: `rotate(${t.rot}deg)` });
  const fromTile = (t) => {
    const r = el.getBoundingClientRect(), s = Math.max(r.width / t.width, r.height / t.height);
    return `translate(${r.left + r.width / 2 - (t.left + t.width / 2)}px, ${r.top + r.height / 2 - (t.top + t.height / 2)}px) scale(${s})`;
  };

  useLayoutEffect(() => {
    const L = layout();
    refs.current.forEach((node, i) => {
      place(node, L[i]);
      const a = node.animate([{ transform: fromTile(L[i]), opacity: 0.4 }, { transform: `rotate(${L[i].rot}deg)`, opacity: 1 }],
        { duration: 760, delay: i * 85, easing: "cubic-bezier(.34,1.45,.55,1)", fill: "backwards" });
      a.onfinish = () => node.classList.add("settled");
    });
    requestAnimationFrame(() => setShown(true));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {                                            // bring one up, or put it back among the others
    const L = layout();
    refs.current.forEach((node, i) => { place(node, focus === i ? big(i) : L[i]); node.classList.toggle("dim", focus !== null && focus !== i); node.classList.toggle("up", focus === i); });
  }, [focus]); // eslint-disable-line react-hooks/exhaustive-deps

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true; setShown(false);
    const L = layout(), n = refs.current.length;
    let done = 0;
    refs.current.forEach((node, i) => {
      node.classList.remove("settled");
      const a = node.animate([{ transform: node.style.transform, opacity: 1 }, { transform: fromTile(L[i]), opacity: 0 }],
        { duration: 480, delay: (n - 1 - i) * 50, easing: "cubic-bezier(.5,0,.75,0)", fill: "forwards" });
      a.onfinish = () => { if (++done === n) onClose(); };
      place(node, L[i]);
    });
  }, [onClose]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const k = (e) => {
      if (e.key === "Escape") { if (focus !== null) setFocus(null); else close(); }
      if (focus !== null && e.key === "ArrowRight") setFocus((focus + 1) % imgs.length);
      if (focus !== null && e.key === "ArrowLeft") setFocus((focus - 1 + imgs.length) % imgs.length);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [close, focus, imgs.length]);

  return (
    <div className={`craft-detail craft-gallery${shown ? " on" : ""}`} role="dialog" aria-label={item.title} onClick={() => (focus !== null ? setFocus(null) : close())}>
      <h2 className="craft-detail-title" style={{ top: "4.4rem" }}>{focus === null ? item.title : imgs[focus].title}</h2>
      {imgs.map((g, i) => (
        <button key={g.src} type="button" ref={(n) => (refs.current[i] = n)} className="craft-print" aria-label={g.title}
          onClick={(e) => { e.stopPropagation(); setFocus(focus === i ? null : i); }}>
          <img src={g.src} alt={g.title} />
        </button>
      ))}
      <div className="craft-detail-meta" style={{ bottom: "1.6rem" }}>
        <span>{focus === null ? "tap a drawing to bring it up" : `${focus + 1} / ${imgs.length} · tap again to put it back`}</span>
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
      {open && (open.item.gallery ? <Gallery open={open} onClose={() => setOpen(null)} /> : <Detail open={open} onClose={() => setOpen(null)} />)}
    </main>
  );
};

export default Craft;
