import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useLenis } from "@studio-freight/react-lenis";
import "./ScenesOverlay.css";

// The scenes open on top of whatever page you're on. The nav's grass icon (or Esc) toggles them,
// so there is never a page change: the page you were reading is still right underneath.
/* While the memories are open the page behind them stays exactly where it was: smooth scrolling stops, and the
   body is pinned in place (iPad Safari still scrolls an overflow-hidden body under a touch). */
function lockPage(lenis) {
  const { documentElement: html, body } = document;
  const y = lenis ? lenis.scroll : window.scrollY;
  lenis?.stop();
  const prev = { html: html.style.overflow, body: body.style.cssText };
  html.style.overflow = "hidden";
  Object.assign(body.style, { overflow: "hidden", position: "fixed", top: `-${y}px`, left: "0", right: "0", width: "100%" });
  const block = (e) => { if (!e.target.closest?.(".scenes-overlay-frame")) e.preventDefault(); };
  window.addEventListener("wheel", block, { passive: false });
  window.addEventListener("touchmove", block, { passive: false });
  return () => {
    html.style.overflow = prev.html; body.style.cssText = prev.body;
    window.removeEventListener("wheel", block); window.removeEventListener("touchmove", block);
    // put the page back exactly where it was, once smooth scrolling is running again (a stopped Lenis holds the page still)
    lenis?.start();
    // (while pinned it measured the page as one screen tall, so it re-measures first or it would clamp the page to the top)
    const back = () => { lenis?.resize?.(); window.scrollTo(0, y); lenis?.scrollTo(y, { immediate: true, force: true }); };
    back(); requestAnimationFrame(back); setTimeout(back, 120);
  };
}

const ScenesOverlay = () => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { pathname } = useLocation();
  const lenis = useLenis();

  // going to another page (or pressing the logo, work or about) puts the scenes away
  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    const toggle = () => setOpen((o) => !o);
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    const close = () => setOpen(false);
    window.addEventListener("scenes:toggle", toggle);
    window.addEventListener("scenes:close", close);
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("scenes:toggle", toggle); window.removeEventListener("scenes:close", close); window.removeEventListener("keydown", onKey); };
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("scenes:state", { detail: open }));
    if (open) {
      setMounted(true);
      return lockPage(lenis);
    }
    // keep the frame alive while it fades out, then drop it so the WebGL scene stops running
    const t = setTimeout(() => setMounted(false), 700);
    return () => clearTimeout(t);
  }, [open, lenis]);

  if (!mounted && !open) return null;
  return (
    <div className={`scenes-overlay${open ? " is-open" : ""}`} role="dialog" aria-label="Interactive scenes" aria-hidden={!open}>
      <iframe
        src="/nature/index.html?embed=1"
        title="Interactive scenes"
        className="scenes-overlay-frame"
        allow="fullscreen"
        data-lenis-prevent
      />
      <button type="button" className="scenes-overlay-close" aria-label="Close scenes" onClick={() => setOpen(false)}>
        close
      </button>
    </div>
  );
};

export default ScenesOverlay;
