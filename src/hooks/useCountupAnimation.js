import { useEffect } from "react";

/**
 * Count-up animation on scroll — GSAP-free.
 *
 * Uses IntersectionObserver to detect when the trigger element enters the
 * viewport (ScrollTrigger caches pixel start-positions that go stale on pages
 * with async-loading images below the fold; IntersectionObserver reflects live
 * layout). The number tween runs on requestAnimationFrame with an ease-out
 * curve — no animation library required.
 *
 * @param {React.RefObject} triggerRef - Ref to the trigger element
 * @param {Array} metrics - Array of { value, prefix, suffix, elementRef, index }
 * @param {number} threshold - Fraction of the trigger visible before firing (default 0.3)
 * @param {number} duration - Animation duration in seconds (default 2)
 */
export const useCountupAnimation = (
  triggerRef,
  metrics,
  threshold = 0.3,
  duration = 2,
) => {
  useEffect(() => {
    if (!triggerRef?.current || !metrics || metrics.length === 0) return;

    const metricsCopy = [...metrics];
    const setFinal = () => {
      metricsCopy.forEach((metric) => {
        const el = metric.elementRef?.current?.[metric.index];
        if (el) el.textContent = `${metric.prefix}${metric.value}${metric.suffix}`;
      });
    };

    // Respect reduced-motion: show final values, no animation.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFinal();
      return;
    }

    let hasFired = false;
    const rafs = [];
    const easeOut = (t) => 1 - Math.pow(1 - t, 2); // ≈ power2.out
    const durationMs = duration * 1000;

    const runCountup = () => {
      if (hasFired) return;
      hasFired = true;

      metricsCopy.forEach((metric) => {
        const element = metric.elementRef?.current?.[metric.index];
        if (!element) return;

        const startTime = performance.now();
        const tick = (now) => {
          const p = Math.min((now - startTime) / durationMs, 1);
          const displayValue = Math.round(metric.value * easeOut(p));
          element.textContent = `${metric.prefix}${displayValue}${metric.suffix}`;
          if (p < 1) rafs.push(requestAnimationFrame(tick));
        };
        rafs.push(requestAnimationFrame(tick));
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          runCountup();
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(triggerRef.current);

    return () => {
      observer.disconnect();
      rafs.forEach((id) => cancelAnimationFrame(id));
    };
  }, [triggerRef, metrics, threshold, duration]);
};
