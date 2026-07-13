import { useCallback, useEffect, useRef, useState } from "react";
import { useGesture } from "@use-gesture/react";
import "./TakeawaysCarousel.css";

const SLIDE_COUNT = 7;
const DRAG_THRESHOLD_PX = 44;
const DRAG_VELOCITY = 0.45;

/** Shortest signed distance around the ring (e.g. active 0 → index 6 is -1, not +6). */
export function getCircularOffset(index, activeIndex, count) {
  if (!count) return 0;
  let offset = (index - activeIndex + count) % count;
  if (offset > count / 2) offset -= count;
  return offset;
}

export const TAKEAWAY_SLIDES = Array.from(
  { length: SLIDE_COUNT },
  (_, index) => {
    const number = index + 1;
    return {
      id: `bad-${number}`,
      src: `/projects/block-party/bad-${number}.png`,
      alt: `Block Party takeaway ${number}`,
    };
  },
);

function getSlideMotion(offset, reduceMotion, maxSide) {
  const distance = Math.abs(offset);

  if (distance > maxSide) {
    return {
      opacity: 0,
      visibility: "hidden",
      pointerEvents: "none",
      transform: "translate(-50%, -50%) scale(0.6)",
      zIndex: 0,
    };
  }

  if (reduceMotion) {
    return {
      opacity: offset === 0 ? 1 : 0,
      visibility: offset === 0 ? "visible" : "hidden",
      pointerEvents: offset === 0 ? "auto" : "none",
      transform: "translate(-50%, -50%)",
      zIndex: offset === 0 ? 2 : 0,
    };
  }

  const xRem = offset * 8.25;
  const rotateY = offset * -34;
  const scale = offset === 0 ? 1 : Math.max(0.58, 1 - distance * 0.14);
  const opacity = offset === 0 ? 1 : Math.max(0.35, 0.75 - distance * 0.14);
  const zTranslate = -distance * 40;

  return {
    opacity,
    visibility: "visible",
    pointerEvents: "none",
    transform: `translate(-50%, -50%) translate3d(${xRem}rem, 0, ${zTranslate}px) rotateY(${rotateY}deg) scale(${scale})`,
    zIndex: 10 - distance,
  };
}

export default function TakeawaysCarousel({
  slides = TAKEAWAY_SLIDES,
  className = "",
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const viewportRef = useRef(null);

  const slideCount = slides.length;
  const maxSide = Math.floor(slideCount / 2);
  const activeSlide = slides[activeIndex] ?? slides[0];

  const goTo = useCallback(
    (index) => {
      if (!slideCount) return;
      const next = ((index % slideCount) + slideCount) % slideCount;
      setActiveIndex(next);
    },
    [slideCount],
  );

  const goPrev = useCallback(() => {
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  const goNext = useCallback(() => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReduceMotion(mediaQuery.matches);
    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);
    return () => mediaQuery.removeEventListener("change", syncPreference);
  }, []);

  useGesture(
    {
      onDragStart: () => {
        setIsDragging(true);
      },
      onDrag: ({ movement: [mx], velocity: [vx], direction: [dirX], last }) => {
        if (!last) return;

        setIsDragging(false);
        const crossed = Math.abs(mx) >= DRAG_THRESHOLD_PX;
        const flick = Math.abs(vx) >= DRAG_VELOCITY;

        if (!crossed && !flick) return;

        if (mx < 0 || (flick && dirX < 0)) {
          goNext();
        } else if (mx > 0 || (flick && dirX > 0)) {
          goPrev();
        }
      },
      onDragEnd: () => {
        setIsDragging(false);
      },
    },
    {
      target: viewportRef,
      drag: {
        axis: "x",
        filterTaps: true,
      },
      eventOptions: { passive: true },
    },
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  if (!slideCount) {
    return null;
  }

  return (
    <div
      className={`takeaways-carousel${className ? ` ${className}` : ""}`}
      aria-roledescription="carousel"
      aria-label="Block Party takeaways"
    >
      <div
        ref={viewportRef}
        className={`takeaways-carousel__viewport${
          isDragging ? " takeaways-carousel__viewport--dragging" : ""
        }`}
      >
        <div className="takeaways-carousel__stage-wrap">
          <div className="takeaways-carousel__sizer" aria-hidden="true">
            <img
              src={activeSlide.src}
              alt=""
              className="takeaways-carousel__image"
              decoding="async"
            />
          </div>

          <div
            className={`takeaways-carousel__stage${
              reduceMotion ? " takeaways-carousel__stage--flat" : ""
            }`}
          >
            {slides.map((slide, index) => {
              const offset = getCircularOffset(index, activeIndex, slideCount);
              const motion = getSlideMotion(offset, reduceMotion, maxSide);
              const isActive = offset === 0;

              return (
                <div
                  key={slide.id}
                  className={`takeaways-carousel__slide${
                    isActive ? " takeaways-carousel__slide--active" : ""
                  }`}
                  style={motion}
                  aria-hidden={!isActive}
                >
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    className="takeaways-carousel__image"
                    loading={Math.abs(offset) <= 1 ? "eager" : "lazy"}
                    decoding="async"
                    draggable={false}
                  />
                </div>
              );
            })}
          </div>

          <div
            role="button"
            tabIndex={0}
            className="takeaways-carousel__hitzone takeaways-carousel__hitzone--prev"
            onClick={goPrev}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                goPrev();
              }
            }}
            aria-label="Previous takeaway"
          />
          <div
            role="button"
            tabIndex={0}
            className="takeaways-carousel__hitzone takeaways-carousel__hitzone--next"
            onClick={goNext}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                goNext();
              }
            }}
            aria-label="Next takeaway"
          />
        </div>
      </div>

      <div
        className="takeaways-carousel__pagination"
        role="tablist"
        aria-label="Takeaway slides"
      >
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={slide.id}
              type="button"
              role="tab"
              className={`takeaways-carousel__indicator${
                isActive ? " takeaways-carousel__indicator--active" : ""
              }`}
              aria-selected={isActive}
              aria-label={`Go to takeaway ${index + 1}`}
              onClick={() => goTo(index)}
            />
          );
        })}
      </div>

      <p className="takeaways-carousel__caption">
        AI is terrible at understanding contextual direction & sizing.
      </p>
    </div>
  );
}
