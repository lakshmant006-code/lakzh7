import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./ScenesOverlay.css";

// The scenes open on top of whatever page you're on. The nav's grass icon (or Esc) toggles them,
// so there is never a page change: the page you were reading is still right underneath.
const ScenesOverlay = () => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { pathname } = useLocation();

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
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
    // keep the frame alive while it fades out, then drop it so the WebGL scene stops running
    const t = setTimeout(() => setMounted(false), 700);
    return () => clearTimeout(t);
  }, [open]);

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
