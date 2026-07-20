import { useEffect } from "react";
import { gsap } from "gsap";

/**
 * Custom hook for countup animation on scroll.
 *
 * Uses IntersectionObserver (not GSAP ScrollTrigger) to detect when the
 * trigger element enters the viewport. ScrollTrigger caches pixel
 * start-positions at creation time, which goes stale on pages with
 * asynchronously-loading images below the fold (a very common case here) —
 * once the page grows taller after that snapshot, the cached trigger point
 * no longer lines up with where the section actually is, so onEnter can
 * fail to fire and the counters stay stuck at their initial value forever
 * (each trigger only fires once). IntersectionObserver has no such cache;
 * it always reflects live layout.
 *
 * @param {React.RefObject} triggerRef - Ref to the trigger element
 * @param {Array} metrics - Array of metric objects with { value, prefix, suffix, elementRef, index }
 * @param {number} threshold - Fraction of the trigger element visible before firing (default: 0.3)
 * @param {number} duration - Animation duration in seconds (default: 2)
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
    let hasFired = false;

    const runCountup = () => {
      if (hasFired) return;
      hasFired = true;

      metricsCopy.forEach((metric) => {
        const element = metric.elementRef?.current?.[metric.index];
        if (!element) return;

        const obj = { count: 0 };
        gsap.to(obj, {
          count: metric.value,
          duration,
          ease: "power2.out",
          onUpdate: () => {
            const displayValue = Math.round(obj.count);
            element.textContent = `${metric.prefix}${displayValue}${metric.suffix}`;
          },
        });
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

    return () => observer.disconnect();
  }, [triggerRef, metrics, threshold, duration]);
};
