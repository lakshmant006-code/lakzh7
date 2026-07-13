import { useCallback, useMemo, useState } from "react";

const INITIAL_VARS = {
  "--pointer-x": 0.5,
  "--pointer-y": 0.5,
  "--rotate-x": "0deg",
  "--rotate-y": "0deg",
  "--vinyl-tilt-x": "0deg",
  "--vinyl-tilt-y": "0deg",
  "--shine-opacity": 0,
};

/**
 * Cursor-driven 3D tilt + reflective shine (holographic card pattern).
 * Sets CSS variables on the target element for transform and glare positioning.
 */
export default function useCardTiltShine(elementRef, { maxTilt = 10, enabled = true } = {}) {
  const [style, setStyle] = useState(INITIAL_VARS);

  const applyPointer = useCallback(
    (clientX, clientY, shineOpacity = 1) => {
      if (!enabled) return;

      const el = elementRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const px = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
      const py = Math.min(Math.max((clientY - rect.top) / rect.height, 0), 1);
      const rotateY = (px - 0.5) * 2 * maxTilt;
      const rotateX = (0.5 - py) * 2 * maxTilt;

      setStyle({
        "--pointer-x": px,
        "--pointer-y": py,
        "--rotate-x": `${rotateX}deg`,
        "--rotate-y": `${rotateY}deg`,
        "--vinyl-tilt-x": `${rotateX}deg`,
        "--vinyl-tilt-y": `${rotateY}deg`,
        "--shine-opacity": shineOpacity,
      });
    },
    [elementRef, maxTilt, enabled],
  );

  const reset = useCallback(() => {
    setStyle(INITIAL_VARS);
  }, []);

  const handlers = useMemo(
    () => ({
      onPointerEnter: (e) => applyPointer(e.clientX, e.clientY, 1),
      onPointerMove: (e) => applyPointer(e.clientX, e.clientY, 1),
      onPointerLeave: reset,
      onPointerDown: (e) => applyPointer(e.clientX, e.clientY, 1),
    }),
    [applyPointer, reset],
  );

  return { style, handlers, applyPointer, reset };
}
