import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AWARD_VINYL_PALETTE } from "../../data/awards";
import "./VinylStack.css";

const DRAG_THRESHOLD = 48;
const TAP_MOVE_MAX = 10;
const TAB_PEEK = 42;
const CARD_STEP = TAB_PEEK + 8;
const MAX_DRAG = CARD_STEP * 1.15;

const EMPTY_DRAG_OFFSET = { x: 0, y: 0 };

function getDragAxisOffset({ x, y }) {
  if (Math.abs(x) > Math.abs(y)) return -x;
  return y;
}

function VinylStackCard({
  award,
  index,
  placeholderColor,
  stackPosition,
  dragOffset,
  isTransitioning,
  isOverlayActive,
  isReturningFromOverlay,
  onOverlayReturnComplete,
  onSelect,
  wrapRef,
  suppressClickRef,
}) {
  const returnTimerRef = useRef(null);
  const [returnPhase, setReturnPhase] = useState(null);

  const isFront = stackPosition === 0;
  const behindCount = stackPosition;

  const axisOffset = getDragAxisOffset(dragOffset);

  const dragProgress = isFront
    ? Math.min(1, Math.max(0, axisOffset / CARD_STEP))
    : 0;

  const peekOffset =
    behindCount === 1 ? TAB_PEEK * (1 - dragProgress) : TAB_PEEK * behindCount;

  const translateX = isFront ? dragOffset.x : 0;
  const translateY = isFront ? dragOffset.y : -peekOffset;

  const scale =
    behindCount === 0
      ? 1
      : 1 -
        behindCount * 0.018 +
        (behindCount === 1 ? dragProgress * 0.018 : 0);

  const zIndex = 100 - stackPosition;

  useEffect(() => {
    if (!isReturningFromOverlay) {
      setReturnPhase(null);
      return;
    }

    setReturnPhase("lift");
    returnTimerRef.current = window.setTimeout(() => {
      setReturnPhase("drop");
    }, 48);

    return () => {
      if (returnTimerRef.current) window.clearTimeout(returnTimerRef.current);
    };
  }, [isReturningFromOverlay]);

  const handleTransitionEnd = (e) => {
    if (e.target !== e.currentTarget) return;
    if (e.propertyName !== "transform") return;
    if (isReturningFromOverlay && returnPhase === "drop") {
      setReturnPhase(null);
      onOverlayReturnComplete?.();
    }
  };

  useEffect(() => {
    if (!isReturningFromOverlay || returnPhase !== "drop") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!prefersReducedMotion) return;

    const id = window.requestAnimationFrame(() => {
      setReturnPhase(null);
      onOverlayReturnComplete?.();
    });

    return () => window.cancelAnimationFrame(id);
  }, [isReturningFromOverlay, returnPhase, onOverlayReturnComplete]);

  const handleClick = (e) => {
    if (!isFront || isOverlayActive || isReturningFromOverlay) return;
    if (suppressClickRef?.current) return;
    const shelfRect = wrapRef.current?.getBoundingClientRect();
    const liftedRect = e.currentTarget.getBoundingClientRect();
    if (!shelfRect || !liftedRect) return;
    onSelect?.(award, { shelf: shelfRect, lifted: liftedRect });
  };

  const label = `${award.title}, ${award.organization}, ${award.year}`;

  const motionClass = isOverlayActive
    ? "vinyl-stack-card--overlay-hidden"
    : isReturningFromOverlay
      ? returnPhase === "drop"
        ? "vinyl-stack-card--return-drop"
        : "vinyl-stack-card--return-lift"
      : isFront && isTransitioning
        ? "vinyl-stack-card--advance"
        : "";

  const cardStyle = {
    zIndex,
    "--stack-scale": scale,
  };

  if (!isReturningFromOverlay) {
    cardStyle["--stack-translate-x"] = `${translateX}px`;
    cardStyle["--stack-translate-y"] = `${translateY}px`;
  }

  return (
    <div
      ref={isFront ? wrapRef : undefined}
      className={`vinyl-stack-card ${motionClass}`}
      style={cardStyle}
      onTransitionEnd={handleTransitionEnd}
    >
      <button
        type="button"
        className="vinyl-stack-card__btn"
        style={{ "--vinyl-placeholder-bg": placeholderColor }}
        aria-label={label}
        aria-hidden={!isFront}
        tabIndex={isFront ? 0 : -1}
        onClick={handleClick}
      >
        <span className="vinyl-stack-card__shadow" aria-hidden="true" />
        <span className="vinyl-stack-card__face">
          {award.vinylImage ? (
            <img
              className="vinyl-stack-card__image"
              src={award.vinylImage}
              alt=""
              draggable={false}
            />
          ) : (
            <span className="vinyl-stack-card__placeholder" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
        </span>
      </button>
    </div>
  );
}

export default function VinylStack({
  awards,
  selectedAwardId,
  returningAwardId,
  onVinylSelect,
  onOverlayReturnComplete,
}) {
  const stackRef = useRef(null);
  const frontWrapRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(EMPTY_DRAG_OFFSET);
  const [isDragging, setIsDragging] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const dragStateRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    pointerId: null,
  });
  const dragOffsetRef = useRef(EMPTY_DRAG_OFFSET);
  const movedRef = useRef(false);

  const resetDragState = useCallback(() => {
    const { pointerId } = dragStateRef.current;
    dragStateRef.current = { active: false, startX: 0, startY: 0, pointerId: null };
    dragOffsetRef.current = EMPTY_DRAG_OFFSET;
    movedRef.current = false;
    setIsDragging(false);
    setDragOffset(EMPTY_DRAG_OFFSET);

    if (pointerId != null) {
      try {
        stackRef.current?.releasePointerCapture(pointerId);
      } catch {
        /* already released */
      }
    }
  }, []);

  const orderedAwards = useMemo(() => {
    return awards.map((_, i) => awards[(activeIndex + i) % awards.length]);
  }, [awards, activeIndex]);

  const stackHeight =
    "calc(var(--stack-card-size) + (var(--stack-count) - 1) * var(--stack-tab-peek))";

  const advanceStack = useCallback(
    (direction) => {
      setIsTransitioning(true);
      setActiveIndex(
        (i) => (i + direction + awards.length) % awards.length,
      );
      window.setTimeout(() => setIsTransitioning(false), 320);
    },
    [awards.length],
  );

  const endDrag = useCallback(() => {
    const { active } = dragStateRef.current;
    if (!active) return;

    dragStateRef.current.active = false;
    setIsDragging(false);

    const { x, y } = dragOffsetRef.current;
    const absX = Math.abs(x);
    const absY = Math.abs(y);

    if (absX > absY) {
      if (x < -DRAG_THRESHOLD) advanceStack(1);
      else if (x > DRAG_THRESHOLD) advanceStack(-1);
    } else if (absY >= absX) {
      if (y > DRAG_THRESHOLD) advanceStack(1);
      else if (y < -DRAG_THRESHOLD) advanceStack(-1);
    }

    dragOffsetRef.current = EMPTY_DRAG_OFFSET;
    setDragOffset(EMPTY_DRAG_OFFSET);
  }, [advanceStack]);

  const handlePointerDown = useCallback(
    (e) => {
      if (selectedAwardId || returningAwardId) return;
      if (e.button !== 0) return;

      dragStateRef.current = {
        active: true,
        startX: e.clientX,
        startY: e.clientY,
        pointerId: e.pointerId,
      };
      movedRef.current = false;
      setIsDragging(true);
      stackRef.current?.setPointerCapture(e.pointerId);
    },
    [selectedAwardId, returningAwardId],
  );

  const handlePointerMove = useCallback((e) => {
    if (!dragStateRef.current.active) return;
    if (e.pointerId !== dragStateRef.current.pointerId) return;

    const dx = e.clientX - dragStateRef.current.startX;
    const dy = e.clientY - dragStateRef.current.startY;
    if (Math.hypot(dx, dy) > TAP_MOVE_MAX) movedRef.current = true;

    const nextOffset = {
      x: Math.max(-MAX_DRAG, Math.min(MAX_DRAG, dx)),
      y: Math.max(-MAX_DRAG, Math.min(MAX_DRAG, dy)),
    };
    dragOffsetRef.current = nextOffset;
    setDragOffset(nextOffset);
  }, []);

  const handlePointerUp = useCallback(
    (e) => {
      if (e.pointerId !== dragStateRef.current.pointerId) return;
      try {
        stackRef.current?.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
      endDrag();
    },
    [endDrag],
  );

  const handlePointerCancel = useCallback(
    (e) => {
      if (e.pointerId !== dragStateRef.current.pointerId) return;
      endDrag();
    },
    [endDrag],
  );

  useEffect(() => {
    const onLostCapture = () => {
      if (dragStateRef.current.active) endDrag();
    };
    const el = stackRef.current;
    el?.addEventListener("lostpointercapture", onLostCapture);
    return () => el?.removeEventListener("lostpointercapture", onLostCapture);
  }, [endDrag]);

  useEffect(() => {
    if (selectedAwardId || returningAwardId) {
      resetDragState();
    }
  }, [selectedAwardId, returningAwardId, resetDragState]);

  useEffect(() => {
    if (!returningAwardId) return;

    const id = window.setTimeout(() => {
      onOverlayReturnComplete?.();
    }, 420);

    return () => window.clearTimeout(id);
  }, [returningAwardId, onOverlayReturnComplete]);

  return (
    <div
      className="vinyl-stack-section"
      style={{
        "--stack-count": awards.length,
        "--stack-tab-peek": `${TAB_PEEK}px`,
      }}
    >
      <p className="vinyl-stack-hint">Drag To Browse</p>
      <div
        ref={stackRef}
        className={`vinyl-stack${isDragging ? " vinyl-stack--dragging" : ""}`}
        style={{ height: stackHeight }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        role="group"
        aria-roledescription="carousel"
        aria-label="Awards vinyl collection"
      >
        {[...orderedAwards].reverse().map((award, reverseIndex) => {
          const stackPosition = orderedAwards.length - 1 - reverseIndex;
          const awardIndex = awards.findIndex((a) => a.id === award.id);
          return (
            <VinylStackCard
              key={award.id}
              award={award}
              index={awardIndex}
              placeholderColor={
                AWARD_VINYL_PALETTE[awardIndex % AWARD_VINYL_PALETTE.length]
              }
              stackPosition={stackPosition}
              dragOffset={dragOffset}
              isTransitioning={isTransitioning}
              isOverlayActive={selectedAwardId === award.id}
              isReturningFromOverlay={returningAwardId === award.id}
              onOverlayReturnComplete={onOverlayReturnComplete}
              onSelect={onVinylSelect}
              wrapRef={frontWrapRef}
              suppressClickRef={movedRef}
            />
          );
        })}
      </div>
      <p className="vinyl-stack-counter" aria-live="polite">
        {activeIndex + 1} / {awards.length}
      </p>
    </div>
  );
}
