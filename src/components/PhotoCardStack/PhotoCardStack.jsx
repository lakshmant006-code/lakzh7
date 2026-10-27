import React, { useCallback, useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import "./PhotoCardStack.css";

// How each card sits by depth (0 = the card on top): the stack fans out to
// the right, each card behind turned a little further.
const POSES = [
  { x: 0, y: 0, rotate: -4, scale: 1 },
  { x: 22, y: -8, rotate: 5, scale: 0.98 },
  { x: 42, y: -14, rotate: 11, scale: 0.96 },
  { x: 58, y: -18, rotate: 17, scale: 0.94 },
];
const MAX_DEPTH = POSES.length - 1;
const EXIT_MS = 460;
// The flung card leaves quickly, then eases out: it carries the speed of the flick.
const EXIT_EASE = [0.18, 0.75, 0.3, 1];
const SNAP_BACK = { type: "spring", stiffness: 420, damping: 32 };

const StackCard = React.memo(function StackCard({
  src,
  alt,
  depth,
  isTop,
  leavingDir,
  onFling,
  reduced,
  enter,
}) {
  // The finger's offset stays on the card from touch to exit, so releasing it
  // never makes the card jump: the exit animation just carries on from there.
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const dragRotate = useTransform(dragX, [-240, 0, 240], [-12, 0, 12]);
  const dragged = useRef(false);

  const pose = POSES[Math.min(depth, MAX_DEPTH)];
  const leaving = leavingDir !== 0;

  const animateTo = leaving
    ? {
        x: leavingDir * 560,
        y: -30,
        rotate: leavingDir * 26,
        opacity: 0,
        scale: 1,
      }
    : { ...pose, opacity: 1 };

  const transition = leaving
    ? {
        default: { duration: EXIT_MS / 1000, ease: EXIT_EASE },
        opacity: { duration: 0.26, delay: 0.16, ease: "easeIn" },
      }
    : reduced
      ? { duration: 0.15 }
      : { type: "spring", stiffness: 260, damping: 26 };

  return (
    <motion.div
      className="pcs-card-pose"
      style={{ zIndex: leaving ? 100 : 50 - depth }}
      initial={enter ? { ...POSES[MAX_DEPTH], opacity: 0 } : false}
      animate={animateTo}
      transition={transition}
    >
      <motion.div
        className={`pcs-card${isTop ? " pcs-card--top" : ""}`}
        style={{ x: dragX, y: dragY, rotate: dragRotate }}
        drag={isTop && !leaving && !reduced}
        dragMomentum={false}
        dragElastic={1}
        onDragStart={() => {
          dragged.current = true;
        }}
        onDragEnd={(_, info) => {
          const far = Math.abs(info.offset.x) > 110 || Math.abs(info.offset.y) > 140;
          const fast = Math.abs(info.velocity.x) > 600;
          if (far || fast) {
            onFling(info.offset.x >= 0 ? 1 : -1);
          } else {
            animate(dragX, 0, SNAP_BACK);
            animate(dragY, 0, SNAP_BACK);
          }
          setTimeout(() => {
            dragged.current = false;
          }, 0);
        }}
        onTap={() => {
          if (isTop && !dragged.current) onFling(1);
        }}
      >
        <img src={src} alt={alt} draggable={false} decoding="async" />
      </motion.div>
    </motion.div>
  );
});

/**
 * A fanned stack of photo cards. Drag, flick or click the top card away and
 * it goes to the back while the next one comes forward.
 */
export default function PhotoCardStack({ photos, label = "Photos" }) {
  const reduced = useReducedMotion();
  const [order, setOrder] = useState(() => photos.map((_, i) => i));
  const [leaving, setLeaving] = useState(null); // { idx, dir }
  const [cycles, setCycles] = useState(() => photos.map(() => 0));
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const fling = useCallback(
    (dir) => {
      if (leaving) return;
      const idx = order[0];
      setLeaving({ idx, dir });
      timer.current = setTimeout(
        () => {
          // Back of the stack, remounted so it fades in from there.
          setOrder((o) => [...o.filter((i) => i !== idx), idx]);
          setCycles((c) => c.map((n, i) => (i === idx ? n + 1 : n)));
          setLeaving(null);
        },
        reduced ? 150 : EXIT_MS,
      );
    },
    [leaving, order, reduced],
  );

  // A stable handle for the cards, so a flick doesn't re-render every card.
  const flingRef = useRef(fling);
  flingRef.current = fling;
  const flingStable = useCallback((dir) => flingRef.current(dir), []);

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fling(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      fling(-1);
    }
  };

  // Depth counts the stack as if the leaving card were already gone, so the
  // next card comes forward while the top one flies off.
  const rest = order.filter((i) => !leaving || i !== leaving.idx);

  return (
    <div
      className="pcs"
      data-sound="pop"
      tabIndex={0}
      role="group"
      aria-roledescription="card stack"
      aria-label={`${label}: ${photos.length} photos. Press the right arrow, or drag or click the top photo, to see the next one.`}
      onKeyDown={onKeyDown}
    >
      <div className="pcs-stage">
        {photos.map((photo, idx) => {
          const isLeaving = leaving && leaving.idx === idx;
          const depth = isLeaving ? 0 : rest.indexOf(idx);
          return (
            <StackCard
              key={`${idx}-${cycles[idx]}`}
              src={photo.src}
              alt={photo.alt || ""}
              depth={depth}
              isTop={!leaving && depth === 0}
              leavingDir={isLeaving ? leaving.dir : 0}
              onFling={flingStable}
              reduced={reduced}
              enter={cycles[idx] > 0}
            />
          );
        })}
      </div>
      <p className="pcs-hint" aria-hidden="true">
        Drag, flick or click
      </p>
    </div>
  );
}
