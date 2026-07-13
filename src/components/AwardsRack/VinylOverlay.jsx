import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useLenis } from "@studio-freight/react-lenis";
import { gsap } from "gsap";
import useCardTiltShine from "../../hooks/useCardTiltShine";
import "../../styles/cardTiltShine.css";
import "./VinylOverlay.css";

const ENTER_MS = 0.62;
const EXIT_MS = 0.48;

function getTargetRect() {
  const size = Math.min(
    window.innerWidth * 0.72,
    520,
    window.innerHeight * 0.82,
  );
  const left = (window.innerWidth - size) / 2;
  const top = (window.innerHeight - size) / 2;
  return { top, left, width: size, height: size };
}

/** Lock scroll without shifting layout — Lenis owns scroll on this site. */
function lockPageScroll(lenis) {
  const { documentElement: html, body } = document;

  if (lenis) {
    const scroll = lenis.scroll;
    lenis.stop();

    return () => {
      lenis.start();
      lenis.scrollTo(scroll, { immediate: true });
    };
  }

  const prev = {
    htmlOverflow: html.style.overflow,
    bodyOverflow: body.style.overflow,
  };

  html.style.overflow = "hidden";
  body.style.overflow = "hidden";

  const preventScroll = (e) => e.preventDefault();

  window.addEventListener("wheel", preventScroll, { passive: false });
  window.addEventListener("touchmove", preventScroll, { passive: false });

  return () => {
    html.style.overflow = prev.htmlOverflow;
    body.style.overflow = prev.bodyOverflow;
    window.removeEventListener("wheel", preventScroll);
    window.removeEventListener("touchmove", preventScroll);
  };
}

export default function VinylOverlay({
  award,
  sourceRects,
  placeholderColor,
  onCloseComplete,
}) {
  const lenis = useLenis();
  const backdropRef = useRef(null);
  const cardRef = useRef(null);
  const tiltRef = useRef(null);
  const closingRef = useRef(false);

  const { style: tiltStyle, handlers: tiltHandlers, reset: resetTilt } =
    useCardTiltShine(tiltRef, { maxTilt: 12 });

  const animateClose = useCallback(() => {
    if (closingRef.current || !cardRef.current || !sourceRects?.shelf) return;
    closingRef.current = true;

    const card = cardRef.current;
    const backdrop = backdropRef.current;
    const { shelf } = sourceRects;

    resetTilt();

    gsap.to(backdrop, {
      opacity: 0,
      duration: EXIT_MS,
      ease: "power2.inOut",
    });

    gsap.to(card, {
      top: shelf.top,
      left: shelf.left,
      width: shelf.width,
      height: shelf.height,
      duration: EXIT_MS,
      ease: "power3.in",
      onComplete: () => {
        onCloseComplete?.();
      },
    });
  }, [sourceRects, onCloseComplete, resetTilt]);

  useEffect(() => {
    const root = document.getElementById("root");
    const previousInert = root?.inert ?? false;

    document.body.classList.add("vinyl-overlay-active");
    if (root) root.inert = true;

    const unlockScroll = lockPageScroll(lenis);

    return () => {
      document.body.classList.remove("vinyl-overlay-active");
      if (root) root.inert = previousInert;
      unlockScroll();
    };
  }, [lenis]);

  useEffect(() => {
    if (!cardRef.current || !backdropRef.current || !sourceRects?.lifted) return;

    const card = cardRef.current;
    const backdrop = backdropRef.current;
    const target = getTargetRect();
    const { lifted } = sourceRects;

    gsap.set(backdrop, { opacity: 0, zIndex: 1 });
    gsap.set(card, {
      position: "fixed",
      top: lifted.top,
      left: lifted.left,
      width: lifted.width,
      height: lifted.height,
      margin: 0,
      zIndex: 2,
    });

    const enterTl = gsap.timeline();

    enterTl
      .to(backdrop, {
        opacity: 1,
        duration: ENTER_MS * 0.85,
        ease: "power2.out",
      })
      .to(
        card,
        {
          top: target.top,
          left: target.left,
          width: target.width,
          height: target.height,
          duration: ENTER_MS,
          ease: "power3.out",
        },
        0,
      );

    return () => {
      enterTl.kill();
    };
  }, [sourceRects]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") animateClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [animateClose]);

  const label = `${award.title}, ${award.organization}, ${award.year}`;

  return createPortal(
    <div
      className="vinyl-overlay-root"
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <div
        ref={backdropRef}
        className="vinyl-overlay-backdrop"
        role="presentation"
        onClick={animateClose}
      />
      <div
        ref={cardRef}
        className="vinyl-overlay-card-wrap"
        style={{ "--vinyl-placeholder-bg": placeholderColor }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          ref={tiltRef}
          className="vinyl-overlay-tilt"
          style={tiltStyle}
          {...tiltHandlers}
        >
          <div className="vinyl-overlay-card">
            <span className="vinyl-overlay-shadow-side" aria-hidden="true" />
            <span className="vinyl-overlay-face">
              {award.vinylImage ? (
                <img
                  className="vinyl-overlay-image"
                  src={award.vinylImage}
                  alt=""
                />
              ) : (
                <span className="vinyl-overlay-placeholder" aria-hidden="true" />
              )}
              <span className="card-tilt-shine__glare" aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
