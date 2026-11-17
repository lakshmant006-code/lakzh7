import React, { useEffect, useState } from "react";
import "./SiteLoader.css";

/* A short loading screen the first time someone enters the portfolio in a visit. While it shows, the clips that open the Work page are
   fetched in the background, so they are ready (and the first scroll is smooth) when the page appears. It never waits longer than a few seconds. */
const CLIPS = [
  "/work/keep/keep-thumb.mp4",
  "/work/reef/reef-thumb.mp4",
  "/work/Hiku/hiku-promo.mp4",
  "/work/time-management/summer-launch.mp4",
  "/projects/promove/promove.mp4",
];
const KEY = "portfolio:loaded";
const MIN_MS = 700, MAX_MS = 4000;
const IOS = typeof navigator !== "undefined" && (/iPad|iPhone|iPod/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1));

export default function SiteLoader() {
  const [done, setDone] = useState(() => { try { return sessionStorage.getItem(KEY) === "1"; } catch { return false; } });
  const [gone, setGone] = useState(done);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (done) return undefined;
    let alive = true, loaded = 0; const t0 = performance.now(), vids = [];
    const finish = () => {
      if (!alive) return; alive = false;
      const wait = Math.max(0, MIN_MS - (performance.now() - t0));
      setTimeout(() => { try { sessionStorage.setItem(KEY, "1"); } catch { /* private mode */ } setDone(true); setTimeout(() => setGone(true), 600); vids.forEach((v) => { v.removeAttribute("src"); v.load(); }); }, wait);
    };
    const one = () => { loaded += 1; if (alive) setN(loaded); if (loaded >= CLIPS.length) finish(); };
    CLIPS.forEach((src) => {
      const v = document.createElement("video"); v.muted = true; v.preload = "auto"; v.playsInline = true; vids.push(v);
      let fired = false; const ok = () => { if (!fired) { fired = true; one(); } };
      v.addEventListener("canplaythrough", ok, { once: true }); v.addEventListener("error", ok, { once: true });
      if (IOS) { v.addEventListener("loadedmetadata", ok, { once: true }); }      // iPhone and iPad do not preload video, so metadata is as far as it goes
      v.src = src; v.load();
    });
    const cap = setTimeout(finish, MAX_MS);
    return () => { alive = false; clearTimeout(cap); };
  }, [done]);

  if (gone) return null;
  return (
    <div className={`site-loader${done ? " out" : ""}`} role="status" aria-live="polite" aria-label="Loading the portfolio">
      <div className="site-loader-inner">
        <p>Lakshman Thota</p>
        <div className="site-loader-bar"><i style={{ transform: `scaleX(${Math.max(0.08, n / CLIPS.length)})` }} /></div>
      </div>
    </div>
  );
}
