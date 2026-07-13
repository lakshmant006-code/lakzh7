import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Rise-up-from-baseline animation (same as case study section titles).
 * Sets initial state opacity: 0, y: 30, then on scroll into view animates to opacity: 1, y: 0.
 * @param {React.RefObject} ref - Ref to the title/element
 * @param {Object} options
 * @param {string} [options.start="top 80%"] - ScrollTrigger start (e.g. "top 80%" when element enters view)
 * @param {number} [options.delay=0] - Delay in seconds before the rise animation runs
 * @param {boolean} [options.triggerOnMount=false] - If true, run animation on mount (for hero at top of page) instead of scroll
 */
export default function useRiseUpOnScroll(ref, options = {}) {
  const {
    start = "top 80%",
    delay = 0,
    triggerOnMount = false,
  } = options;

  useEffect(() => {
    if (!ref?.current) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(ref.current, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(ref.current, { opacity: 0, y: 30 });

    if (triggerOnMount) {
      const tween = gsap.to(ref.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.15 + delay,
        ease: "power2.out",
      });
      return () => tween.kill();
    }

    let scrollTrigger = null;
    const timeoutId = setTimeout(() => {
      ScrollTrigger.refresh();
      scrollTrigger = ScrollTrigger.create({
        trigger: ref.current,
        start,
        once: true,
        onEnter: () => {
          gsap.to(ref.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            delay,
          });
        },
      });
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (scrollTrigger) scrollTrigger.kill();
    };
  }, [ref, start, delay, triggerOnMount]);
}
