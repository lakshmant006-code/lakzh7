import { useEffect } from "react";

/**
 * Rise-up-from-baseline reveal (fade + translateY), GSAP-free.
 *
 * Uses IntersectionObserver to detect entry and the Web Animations API to run
 * the tween — the CSS/native approach (no animation library). Keeps the same
 * API as before so existing call sites are unchanged.
 *
 * @param {React.RefObject} ref - Ref to the element to reveal
 * @param {Object} options
 * @param {string} [options.start="top 80%"] - When to fire, expressed the old
 *   ScrollTrigger way; the "%" is mapped to an IntersectionObserver rootMargin.
 * @param {number} [options.delay=0] - Delay in seconds before the reveal runs
 * @param {boolean} [options.triggerOnMount=false] - Run on mount (hero at top)
 */
const EASE = "cubic-bezier(0.25, 0.46, 0.45, 0.94)"; // ≈ power2.out

function bottomMarginFromStart(start) {
  const m = /(\d+)%/.exec(start || "");
  const pct = m ? parseInt(m[1], 10) : 80;
  // "top 80%" → reveal when the element is 20% up from the viewport bottom.
  return -(100 - pct);
}

export default function useRiseUpOnScroll(ref, options = {}) {
  const { start = "top 80%", delay = 0, triggerOnMount = false } = options;

  useEffect(() => {
    const el = ref?.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }

    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.willChange = "opacity, transform";

    const play = (delaySeconds) => {
      const anim = el.animate(
        [
          { opacity: 0, transform: "translateY(30px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 1000,
          delay: Math.max(0, delaySeconds) * 1000,
          easing: EASE,
          fill: "forwards",
        },
      );
      anim.addEventListener("finish", () => {
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.willChange = "auto";
      });
      return anim;
    };

    if (triggerOnMount) {
      const anim = play(0.15 + delay);
      return () => anim.cancel();
    }

    let anim = null;
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          obs.unobserve(entry.target);
          anim = play(delay);
        });
      },
      { rootMargin: `0px 0px ${bottomMarginFromStart(start)}% 0px`, threshold: 0 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      if (anim) anim.cancel();
    };
  }, [ref, start, delay, triggerOnMount]);
}
