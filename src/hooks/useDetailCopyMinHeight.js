import { useLayoutEffect, useRef, useState } from "react";

/**
 * Measures hidden copies of per-stage detail copy and returns the tallest height
 * so the visible copy area can use minHeight without hardcoded values.
 */
export function useDetailCopyMinHeight(stages) {
  const measureRef = useRef(null);
  const [minHeight, setMinHeight] = useState(0);
  const stageKey = stages.map((stage) => stage.id).join(",");

  useLayoutEffect(() => {
    const measure = () => {
      const root = measureRef.current;
      if (!root) {
        return;
      }

      const items = root.querySelectorAll("[data-detail-copy-measure]");
      let max = 0;

      items.forEach((element) => {
        max = Math.max(max, Math.ceil(element.getBoundingClientRect().height));
      });

      setMinHeight((current) => (current === max ? current : max));
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    const root = measureRef.current;

    if (root) {
      resizeObserver.observe(root);
    }

    window.addEventListener("resize", measure);

    let cancelled = false;

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) {
          measure();
        }
      });
    }

    return () => {
      cancelled = true;
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [stageKey]);

  return { measureRef, minHeight };
}

export function getStageBlurbs(stage) {
  if (!stage?.blurb) {
    return [];
  }

  return Array.isArray(stage.blurb) ? stage.blurb : [stage.blurb];
}
