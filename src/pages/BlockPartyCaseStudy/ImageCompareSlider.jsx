import { useCallback, useRef, useState } from "react";
import "./ImageCompareSlider.css";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export default function ImageCompareSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = "Before",
  afterAlt = "After",
  beforeLabel,
  afterLabel,
  initialPosition = 50,
  className = "",
}) {
  const [position, setPosition] = useState(initialPosition);
  const containerRef = useRef(null);
  const draggingRef = useRef(false);

  const setPositionFromClientX = useCallback((clientX) => {
    const container = containerRef.current;
    if (!container) return;
    const { left, width } = container.getBoundingClientRect();
    if (width <= 0) return;
    setPosition(clamp(((clientX - left) / width) * 100, 0, 100));
  }, []);

  const handlePointerDown = useCallback(
    (event) => {
      draggingRef.current = true;
      containerRef.current?.setPointerCapture(event.pointerId);
      setPositionFromClientX(event.clientX);
    },
    [setPositionFromClientX],
  );

  const handlePointerMove = useCallback(
    (event) => {
      if (!draggingRef.current) return;
      setPositionFromClientX(event.clientX);
    },
    [setPositionFromClientX],
  );

  const endDrag = useCallback((event) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    try {
      containerRef.current?.releasePointerCapture(event.pointerId);
    } catch {
      /* already released */
    }
  }, []);

  const handleKeyDown = useCallback((event) => {
    const step = event.shiftKey ? 10 : 2;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setPosition((prev) => clamp(prev - step, 0, 100));
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setPosition((prev) => clamp(prev + step, 0, 100));
    } else if (event.key === "Home") {
      event.preventDefault();
      setPosition(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setPosition(100);
    }
  }, []);

  const roundedPosition = Math.round(position);

  return (
    <div
      ref={containerRef}
      className={`image-compare${className ? ` ${className}` : ""}`}
      style={{ "--compare-position": `${position}%` }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={handleKeyDown}
      role="slider"
      tabIndex={0}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={roundedPosition}
      aria-label="Drag to compare before and after"
    >
      <img
        src={afterSrc}
        alt={afterAlt}
        className="image-compare__img image-compare__img--after"
        draggable={false}
      />
      <div className="image-compare__before" aria-hidden="true">
        <img
          src={beforeSrc}
          alt=""
          className="image-compare__img image-compare__img--before"
          draggable={false}
        />
        {beforeLabel ? (
          <span className="image-compare__tag image-compare__tag--before">
            {beforeLabel}
          </span>
        ) : null}
      </div>
      {afterLabel ? (
        <div className="image-compare__after-overlay" aria-hidden="true">
          <span className="image-compare__tag image-compare__tag--after">
            {afterLabel}
          </span>
        </div>
      ) : null}
      <div className="image-compare__divider" aria-hidden="true">
        <span className="image-compare__handle">
          <svg
            className="image-compare__chevrons"
            width="20"
            height="12"
            viewBox="0 0 20 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M7 1L2 6L7 11"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13 1L18 6L13 11"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}
