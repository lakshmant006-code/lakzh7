/**
 * Reveal an element (fade + rise) when it scrolls into view — GSAP-free.
 *
 * IntersectionObserver + the Web Animations API, mirroring the old GSAP
 * fade-up (opacity 0→1, translateY 30px→0, fires once). Drop-in replacement
 * for the per-page `createScrollAnimation` helpers; keeps the same element
 * refs and CSS initial states.
 *
 * @param {HTMLElement} el - Element to reveal
 * @param {Object} [options]
 * @param {number} [options.delay=0] - Delay in seconds
 * @param {string} [options.start="top 80%"] - ScrollTrigger-style start; the
 *   "%" maps to an IntersectionObserver rootMargin
 * @param {number} [options.duration=1] - Duration in seconds
 * @returns {() => void} cleanup
 */
const EASE = "cubic-bezier(0.25, 0.46, 0.45, 0.94)"; // ≈ power2.out

function bottomMarginFromStart(start) {
  const m = /(\d+)%/.exec(start || "");
  const pct = m ? parseInt(m[1], 10) : 80;
  return -(100 - pct);
}

export function revealOnScroll(el, options = {}) {
  if (!el) return () => {};
  const { delay = 0, start = "top 80%", duration = 1 } = options;

  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    el.style.opacity = "1";
    el.style.transform = "none";
    return () => {};
  }

  el.style.opacity = "0";
  el.style.transform = "translateY(30px)";
  el.style.willChange = "opacity, transform";

  let anim = null;
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        obs.unobserve(entry.target);
        anim = el.animate(
          [
            { opacity: 0, transform: "translateY(30px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          {
            duration: duration * 1000,
            delay: Math.max(0, delay) * 1000,
            easing: EASE,
            fill: "forwards",
          },
        );
        anim.addEventListener("finish", () => {
          el.style.opacity = "1";
          el.style.transform = "none";
          el.style.willChange = "auto";
        });
      });
    },
    { rootMargin: `0px 0px ${bottomMarginFromStart(start)}% 0px`, threshold: 0 },
  );
  observer.observe(el);

  return () => {
    observer.disconnect();
    if (anim) anim.cancel();
  };
}
