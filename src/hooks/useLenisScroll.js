import { useCallback } from "react";
import { useLenis } from "@studio-freight/react-lenis";

/**
 * Shared Lenis scroll helpers. Use this instead of duplicating lenis.scrollTo + fallback logic.
 * Returns stable callbacks that work with or without Lenis (fallback to native scroll).
 */
export function useLenisScroll() {
  const lenis = useLenis();

  const scrollToTop = useCallback(
    (opts = {}) => {
      const { immediate = false, duration = 1.2, force } = opts;
      if (lenis) {
        lenis.scrollTo(0, {
          duration: immediate ? 0 : duration,
          immediate: !!immediate,
          ...(force !== undefined && { force }),
        });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: immediate ? "auto" : "smooth" });
      }
    },
    [lenis]
  );

  const scrollToElement = useCallback(
    (el, opts = {}) => {
      if (!el) return;
      const { offset = 0, duration = 1.2, immediate = false, force } = opts;
      if (lenis) {
        lenis.scrollTo(el, {
          offset,
          duration: immediate ? 0 : duration,
          immediate: !!immediate,
          ...(force !== undefined && { force }),
        });
      } else {
        el.scrollIntoView({
          behavior: immediate ? "auto" : "smooth",
          block: "start",
        });
        if (offset !== 0) {
          const offsetPx = Math.abs(offset);
          setTimeout(() => window.scrollBy(0, offsetPx), 100);
        }
      }
    },
    [lenis]
  );

  return { lenis, scrollToTop, scrollToElement };
}
