import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useLenis } from "@studio-freight/react-lenis";
import { gsap } from "gsap";
import { ExternalLink, X } from "lucide-react";
import "./CraftLightbox.css";

const ENTER_S = 0.62;
const EXIT_S = 0.46;
const BAR_H = 44;
const BAR_GAP = 14;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Lock page scroll — Lenis owns scroll on this site (same approach as VinylOverlay). */
function lockPageScroll(lenis) {
  if (lenis) {
    const scroll = lenis.scroll;
    lenis.stop();
    return () => {
      lenis.start();
      lenis.scrollTo(scroll, { immediate: true });
    };
  }
  const { documentElement: html, body } = document;
  const prev = { h: html.style.overflow, b: body.style.overflow };
  html.style.overflow = "hidden";
  body.style.overflow = "hidden";
  return () => {
    html.style.overflow = prev.h;
    body.style.overflow = prev.b;
  };
}

/** Centered target box for the media, leaving room for the tab bar above it. */
function getTarget(aspect, naturalWidth) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const small = vw < 700;
  const availW = vw * (small ? 0.94 : 0.9);
  const availH = vh - (BAR_H + BAR_GAP) - (small ? 56 : 96);
  const maxW = naturalWidth ? naturalWidth * 1.6 : 1600;
  const width = Math.max(
    120,
    Math.min(availW, availH * aspect, maxW, 1600),
  );
  const height = width / aspect;
  const total = BAR_H + BAR_GAP + height;
  const blockTop = Math.max(12, (vh - total) / 2);
  return {
    left: (vw - width) / 2,
    top: blockTop + BAR_H + BAR_GAP,
    width,
    height,
    barTop: blockTop,
  };
}

const prettify = (id = "") =>
  id.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function CraftLightbox({ project, origin, onClose }) {
  const lenis = useLenis();
  const rootRef = useRef(null);
  const backdropRef = useRef(null);
  const mediaRef = useRef(null);
  const barRef = useRef(null);
  const closeBtnRef = useRef(null);
  const closingRef = useRef(false);
  const targetRef = useRef(null);

  const { media = {}, tags = [], actions = [], id } = project;
  const title = project.title || prettify(id);
  const isVideo = !!media.video;
  const imgSrc = media.image || media.thumbnail || media.poster;

  // the grid renders a mobile and a desktop copy of each tile; use the visible one
  const cardEl = useCallback(
    () =>
      [...document.querySelectorAll(`[data-play-project-id="${id}"]`)].find(
        (el) => el.getClientRects().length > 0,
      ) || null,
    [id],
  );

  // open: zoom the media from the tile to the centered target
  useLayoutEffect(() => {
    const reduced = prefersReducedMotion();
    const card = cardEl();
    const target = getTarget(origin.aspect, origin.naturalWidth);
    targetRef.current = target;

    const media_ = mediaRef.current;
    const bar = barRef.current;
    const dur = reduced ? 0.01 : ENTER_S;

    gsap.set(media_, {
      top: origin.rect.top,
      left: origin.rect.left,
      width: origin.rect.width,
      height: origin.rect.height,
      borderRadius: origin.radius,
    });
    gsap.set(bar, { top: target.barTop, left: target.left, width: target.width, opacity: 0, y: 12 });
    if (card) card.style.visibility = "hidden";

    const tl = gsap.timeline();
    tl.to(backdropRef.current, { opacity: 1, duration: reduced ? 0.01 : 0.4, ease: "power2.out" }, 0)
      .to(media_, {
        top: target.top,
        left: target.left,
        width: target.width,
        height: target.height,
        borderRadius: 18,
        duration: dur,
        ease: "power3.out",
      }, 0)
      .to(bar, { opacity: 1, y: 0, duration: reduced ? 0.01 : 0.38, ease: "power2.out" }, reduced ? 0 : 0.3);

    return () => {
      tl.kill();
      const c = cardEl();
      if (c) c.style.visibility = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // page scroll lock + focus handling
  useEffect(() => {
    const unlock = lockPageScroll(lenis);
    const prevFocus = document.activeElement;
    closeBtnRef.current?.focus({ preventScroll: true });
    return () => {
      unlock();
      if (prevFocus && typeof prevFocus.focus === "function") {
        prevFocus.focus({ preventScroll: true });
      }
    };
  }, [lenis]);

  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    const reduced = prefersReducedMotion();
    const card = cardEl();
    const r = card?.getBoundingClientRect();
    const onScreen = r && r.bottom > 0 && r.top < window.innerHeight;
    const tl = gsap.timeline({
      onComplete: () => {
        if (card) card.style.visibility = "";
        onClose();
      },
    });
    tl.to(barRef.current, { opacity: 0, y: 8, duration: reduced ? 0.01 : 0.2, ease: "power2.in" }, 0);
    if (onScreen && !reduced) {
      tl.to(mediaRef.current, {
        top: r.top,
        left: r.left,
        width: r.width,
        height: r.height,
        borderRadius: origin.radius,
        duration: EXIT_S,
        ease: "power3.inOut",
      }, 0);
      tl.to(backdropRef.current, { opacity: 0, duration: EXIT_S * 0.9, ease: "power2.in" }, 0);
    } else {
      tl.to([mediaRef.current, backdropRef.current], { opacity: 0, duration: reduced ? 0.01 : 0.3 }, 0);
    }
  }, [cardEl, onClose, origin.radius]);

  // Esc to close, keep the box centered on resize
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") requestClose();
    };
    const onResize = () => {
      if (closingRef.current) return;
      const t = getTarget(origin.aspect, origin.naturalWidth);
      targetRef.current = t;
      gsap.set(mediaRef.current, { top: t.top, left: t.left, width: t.width, height: t.height });
      gsap.set(barRef.current, { top: t.barTop, left: t.left, width: t.width });
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [origin.aspect, origin.naturalWidth, requestClose]);

  return createPortal(
    <div
      ref={rootRef}
      className="craft-lb"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        ref={backdropRef}
        className="craft-lb-backdrop"
        onClick={requestClose}
        aria-hidden="true"
      />

      <div ref={barRef} className="craft-lb-bar">
        <div className="craft-lb-tab">
          <span className="craft-lb-tab-dot" aria-hidden="true" />
          <span className="craft-lb-tab-title">{title}</span>
          {tags.slice(0, 3).map((tag) => (
            <span key={tag} className="craft-lb-tab-tag">
              {tag}
            </span>
          ))}
        </div>
        <div className="craft-lb-bar-actions">
          {actions
            .filter((a) => a.url)
            .map((a) => (
              <a
                key={a.url}
                className="craft-lb-action"
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {a.tooltip || "Open"}
                <ExternalLink size={14} aria-hidden="true" />
              </a>
            ))}
          <button
            ref={closeBtnRef}
            type="button"
            className="craft-lb-close"
            onClick={requestClose}
            aria-label="Close"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div ref={mediaRef} className="craft-lb-media">
        {isVideo ? (
          <video
            className="craft-lb-video"
            src={media.video}
            poster={media.poster}
            autoPlay
            loop
            muted
            playsInline
            controls
          />
        ) : (
          <img className="craft-lb-img" src={imgSrc} alt={title} decoding="async" />
        )}
      </div>
    </div>,
    document.body,
  );
}
