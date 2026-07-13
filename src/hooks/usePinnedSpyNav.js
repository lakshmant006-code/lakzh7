import { useEffect, useState } from "react";
import { useLenis } from "@studio-freight/react-lenis";

const TOP_OFFSET = 112;
const DESKTOP_MIN_WIDTH = 1024;

function getDocumentBottom(el) {
  return el.getBoundingClientRect().bottom + window.scrollY;
}

function getDocumentTop(el) {
  return el.getBoundingClientRect().top + window.scrollY;
}

export function usePinnedSpyNav(slotRef, mainRef, navRef) {
  const lenis = useLenis();
  const [navPin, setNavPin] = useState({ pinStyle: null, atBottom: false });

  useEffect(() => {
    const slotEl = slotRef.current;
    const mainEl = mainRef.current;
    const navEl = navRef.current;
    if (!slotEl || !mainEl || !navEl) return;

    const mediaQuery = window.matchMedia(
      `(min-width: ${DESKTOP_MIN_WIDTH}px)`,
    );
    let rafId = null;
    let resizeObserver = null;

    const findBoundary = () =>
      mainEl.querySelector("[data-case-study-nav-boundary]");

    const clearSlotHeight = () => {
      slotEl.style.minHeight = "";
    };

    const syncSlotHeight = () => {
      if (!mediaQuery.matches) {
        clearSlotHeight();
        return;
      }

      const boundary = findBoundary();
      if (!boundary) {
        clearSlotHeight();
        return;
      }

      const slotTop = getDocumentTop(slotEl);
      const boundaryBottom = getDocumentBottom(boundary);
      const navHeight = navEl.offsetHeight;
      const height = Math.max(boundaryBottom - slotTop, navHeight);
      const nextHeight = `${Math.round(height)}px`;

      if (slotEl.style.minHeight !== nextHeight) {
        slotEl.style.minHeight = nextHeight;
      }
    };

    const updatePin = () => {
      if (rafId != null) return;

      rafId = requestAnimationFrame(() => {
        rafId = null;

        if (!mediaQuery.matches) {
          clearSlotHeight();
          setNavPin((prev) => {
            if (prev.pinStyle == null && !prev.atBottom) return prev;
            return { pinStyle: null, atBottom: false };
          });
          return;
        }

        syncSlotHeight();

        const boundary = findBoundary();
        const slotRect = slotEl.getBoundingClientRect();
        const navHeight = navEl.offsetHeight;
        const navBottom = TOP_OFFSET + navHeight;
        const boundaryBottom = boundary
          ? boundary.getBoundingClientRect().bottom
          : Infinity;

        if (boundaryBottom <= navBottom) {
          setNavPin((prev) => {
            const nextStyle = {
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
            };
            const unchanged =
              prev.atBottom &&
              prev.pinStyle?.position === "absolute" &&
              prev.pinStyle.bottom === 0;
            if (unchanged) return prev;
            return { pinStyle: nextStyle, atBottom: true };
          });
          return;
        }

        if (slotRect.top <= TOP_OFFSET) {
          const nextPinStyle = {
            position: "fixed",
            top: TOP_OFFSET,
            left: slotRect.left,
            width: slotRect.width,
          };

          setNavPin((prev) => {
            const pinUnchanged =
              !prev.atBottom &&
              prev.pinStyle?.position === "fixed" &&
              prev.pinStyle.top === nextPinStyle.top &&
              Math.abs(prev.pinStyle.left - nextPinStyle.left) < 0.5 &&
              Math.abs(prev.pinStyle.width - nextPinStyle.width) < 0.5;

            if (pinUnchanged) return prev;
            return { pinStyle: nextPinStyle, atBottom: false };
          });
          return;
        }

        setNavPin((prev) => {
          if (prev.pinStyle == null && !prev.atBottom) return prev;
          return { pinStyle: null, atBottom: false };
        });
      });
    };

    updatePin();

    if (lenis) {
      lenis.on("scroll", updatePin);
    } else {
      window.addEventListener("scroll", updatePin, { passive: true });
    }
    window.addEventListener("resize", updatePin);
    mediaQuery.addEventListener("change", updatePin);

    const boundary = findBoundary();
    if (boundary && "ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(updatePin);
      resizeObserver.observe(boundary);
      resizeObserver.observe(mainEl);
      resizeObserver.observe(navEl);
    }

    return () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      clearSlotHeight();
      if (lenis) lenis.off("scroll", updatePin);
      else window.removeEventListener("scroll", updatePin);
      window.removeEventListener("resize", updatePin);
      mediaQuery.removeEventListener("change", updatePin);
      resizeObserver?.disconnect();
    };
  }, [lenis, slotRef, mainRef, navRef]);

  return navPin;
}
