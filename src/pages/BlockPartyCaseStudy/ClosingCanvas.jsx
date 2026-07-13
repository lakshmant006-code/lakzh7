import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useGesture } from "@use-gesture/react";
import "./ClosingCanvas.css";

const IMAGE_COUNT = 24;
const IMAGE_BASE = "/projects/block-party/closing";

const DEFAULT_INITIAL_ZOOM = 1.52;
const DRAG_SENSITIVITY = 1;
const INERTIA_FRICTION = 0.92;
const INERTIA_MIN_V = 0.35;
const INERTIA_VELOCITY_SCALE = 14;
const DRAG_DISTANCE_FOR_INERTIA = 6;

function shuffleClosingImages(images) {
  const shuffled = [...images];
  let seed = 2166136261;

  const random = () => {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    return (seed >>> 0) / 0xffffffff;
  };

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

const CLOSING_IMAGES = shuffleClosingImages(
  Array.from({ length: IMAGE_COUNT }, (_, index) => {
    const number = index + 1;
    return {
      src: `${IMAGE_BASE}/${number}.png`,
      alt: `Block Party user testing and contributors — photo ${number}`,
    };
  }),
);

function computePanBounds(viewportEl, worldEl) {
  const vw = viewportEl.clientWidth;
  const vh = viewportEl.clientHeight;
  const { width: sw, height: sh } = worldEl.getBoundingClientRect();

  if (!vw || !vh || !sw || !sh) {
    return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
  }

  let minX = vw / 2 - sw / 2;
  let maxX = sw / 2 - vw / 2;
  let minY = vh / 2 - sh / 2;
  let maxY = sh / 2 - vh / 2;

  if (minX > maxX) {
    minX = 0;
    maxX = 0;
  }
  if (minY > maxY) {
    minY = 0;
    maxY = 0;
  }

  return { minX, maxX, minY, maxY };
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function clampPanToBounds(pan, bounds) {
  return {
    x: Math.min(Math.max(pan.x, bounds.minX), bounds.maxX),
    y: Math.min(Math.max(pan.y, bounds.minY), bounds.maxY),
  };
}

function readCssNumber(rootEl, variable, fallback) {
  if (!rootEl) return fallback;
  const raw = getComputedStyle(rootEl).getPropertyValue(variable).trim();
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export default function ClosingCanvas({ className = "" }) {
  const images = useMemo(() => CLOSING_IMAGES, []);
  const canvasRef = useRef(null);
  const viewportRef = useRef(null);
  const worldRef = useRef(null);
  const tileRefs = useRef([]);
  const panRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });
  const inertiaRafRef = useRef(null);
  const boundsRef = useRef({ minX: 0, maxX: 0, minY: 0, maxY: 0 });
  const hasInitializedViewRef = useRef(false);
  const draggingRef = useRef(false);

  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [initialZoom, setInitialZoom] = useState(DEFAULT_INITIAL_ZOOM);

  const updateBounds = useCallback(() => {
    const viewport = viewportRef.current;
    const world = worldRef.current;
    if (!viewport || !world) return;
    boundsRef.current = computePanBounds(viewport, world);
  }, []);

  const applyPan = useCallback((nextPan) => {
    const clamped = clampPanToBounds(nextPan, boundsRef.current);
    panRef.current = clamped;
    setPan(clamped);
    return clamped;
  }, []);

  const centerViewOnCollage = useCallback(() => {
    const viewport = viewportRef.current;
    const tiles = tileRefs.current.filter(Boolean);
    if (!viewport || tiles.length === 0) return false;

    const vp = viewport.getBoundingClientRect();
    if (!vp.width || !vp.height) return false;

    const vcx = vp.left + vp.width / 2;
    const vcy = vp.top + vp.height / 2;

    let sumX = 0;
    let sumY = 0;
    tiles.forEach((tile) => {
      const rect = tile.getBoundingClientRect();
      sumX += rect.left + rect.width / 2;
      sumY += rect.top + rect.height / 2;
    });

    const collageCenterX = sumX / tiles.length;
    const collageCenterY = sumY / tiles.length;

    applyPan({
      x: panRef.current.x + (vcx - collageCenterX),
      y: panRef.current.y + (vcy - collageCenterY),
    });
    return true;
  }, [applyPan]);

  const syncLayout = useCallback(() => {
    updateBounds();

    if (!hasInitializedViewRef.current && !draggingRef.current) {
      const world = worldRef.current;
      const viewport = viewportRef.current;
      const { width: sw, height: sh } = world?.getBoundingClientRect() ?? { width: 0, height: 0 };

      if (viewport && world && sw > 0 && sh > 0 && centerViewOnCollage()) {
        hasInitializedViewRef.current = true;
        updateBounds();
      }
    }

    if (!draggingRef.current) {
      applyPan(panRef.current);
    }
  }, [applyPan, centerViewOnCollage, updateBounds]);

  const stopInertia = useCallback(() => {
    if (inertiaRafRef.current) {
      cancelAnimationFrame(inertiaRafRef.current);
      inertiaRafRef.current = null;
    }
  }, []);

  const startInertia = useCallback(
    (vx, vy) => {
      stopInertia();
      let velocityX = vx;
      let velocityY = vy;

      const step = () => {
        velocityX *= INERTIA_FRICTION;
        velocityY *= INERTIA_FRICTION;

        if (Math.hypot(velocityX, velocityY) < INERTIA_MIN_V) {
          inertiaRafRef.current = null;
          return;
        }

        const nextPan = {
          x: panRef.current.x + velocityX,
          y: panRef.current.y + velocityY,
        };
        const clamped = applyPan(nextPan);

        if (clamped.x !== nextPan.x) velocityX = 0;
        if (clamped.y !== nextPan.y) velocityY = 0;

        inertiaRafRef.current = requestAnimationFrame(step);
      };

      inertiaRafRef.current = requestAnimationFrame(step);
    },
    [applyPan, stopInertia],
  );

  useGesture(
    {
      onDragStart: () => {
        stopInertia();
        draggingRef.current = true;
        hasInitializedViewRef.current = true;
        panStartRef.current = { ...panRef.current };
      },
      onDrag: ({
        movement: [mx, my],
        last,
        velocity: [vMagX, vMagY] = [0, 0],
        direction: [dirX, dirY] = [0, 0],
      }) => {
        applyPan({
          x: panStartRef.current.x + mx * DRAG_SENSITIVITY,
          y: panStartRef.current.y + my * DRAG_SENSITIVITY,
        });

        if (last) {
          draggingRef.current = false;
          updateBounds();

          const dragDistance = Math.hypot(mx, my);
          let vx = vMagX * dirX;
          let vy = vMagY * dirY;

          if (Math.abs(vx) < 0.001 && Math.abs(vy) < 0.001) {
            vx = clamp((mx / DRAG_SENSITIVITY) * 0.02, -1.2, 1.2);
            vy = clamp((my / DRAG_SENSITIVITY) * 0.02, -1.2, 1.2);
          }

          if (
            dragDistance >= DRAG_DISTANCE_FOR_INERTIA ||
            Math.abs(vx) > 0.004 ||
            Math.abs(vy) > 0.004
          ) {
            startInertia(vx * INERTIA_VELOCITY_SCALE, vy * INERTIA_VELOCITY_SCALE);
          } else {
            applyPan(panRef.current);
          }
        }
      },
      onDragEnd: () => {
        if (!draggingRef.current) return;
        draggingRef.current = false;
        updateBounds();
        applyPan(panRef.current);
      },
    },
    { target: viewportRef, eventOptions: { passive: true } },
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const syncZoom = () => {
      setInitialZoom((prev) => {
        const next = readCssNumber(canvas, "--closing-initial-zoom", DEFAULT_INITIAL_ZOOM);
        return prev === next ? prev : next;
      });
    };

    syncZoom();
    const ro = new ResizeObserver(syncZoom);
    ro.observe(canvas);

    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    const world = worldRef.current;
    if (!viewport || !world) return undefined;

    syncLayout();

    const ro = new ResizeObserver(syncLayout);
    ro.observe(viewport);
    ro.observe(world);

    return () => ro.disconnect();
  }, [images.length, syncLayout, initialZoom]);

  useEffect(() => {
    return () => {
      stopInertia();
    };
  }, [stopInertia]);

  return (
    <div
      ref={canvasRef}
      className={`closing-canvas${className ? ` ${className}` : ""}`}
      aria-label="User testing and contributor photos — drag to pan"
    >
      <div ref={viewportRef} className="closing-canvas__viewport">
        <div
          ref={worldRef}
          className="closing-canvas__world"
          style={{
            transform: `translate3d(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px), 0) scale(${initialZoom})`,
          }}
        >
          {images.map((image, index) => (
            <figure
              key={image.src}
              ref={(node) => {
                tileRefs.current[index] = node;
              }}
              className="closing-canvas__tile"
            >
              <img
                src={image.src}
                alt={image.alt}
                draggable={false}
                loading="lazy"
                onLoad={syncLayout}
              />
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
