import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Custom hook for countup animation on scroll
 * @param {React.RefObject} triggerRef - Ref to the trigger element for ScrollTrigger
 * @param {Array} metrics - Array of metric objects with { value, prefix, suffix, elementRef, index }
 * @param {string} start - ScrollTrigger start position (default: "top 70%")
 * @param {number} duration - Animation duration in seconds (default: 2)
 */
export const useCountupAnimation = (
  triggerRef,
  metrics,
  start = "top 70%",
  duration = 2
) => {
  useEffect(() => {
    if (!triggerRef?.current || !metrics || metrics.length === 0) return;

    let scrollTrigger = null;

    const timeoutId = setTimeout(() => {
      ScrollTrigger.refresh();

      // Create a copy of metrics to avoid closure issues
      const metricsCopy = [...metrics];

      scrollTrigger = ScrollTrigger.create({
        trigger: triggerRef.current,
        start,
        once: true,
        onEnter: () => {
          metricsCopy.forEach((metric) => {
            // Get element from ref array using index
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
        },
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (scrollTrigger) {
        scrollTrigger.kill();
      }
    };
  }, [triggerRef, metrics, start, duration]);
};

