import { useMemo, useId, useState, useRef, useEffect } from "react";
import "./StickerPeel.css";

const StickerPeel = ({
  imageSrc,
  rotate = 0,
  peelBackHoverPct = 15,
  width = 60,
  shadowIntensity = 0.28,
  peelDirection = 0,
  className = "",
}) => {
  const defaultPadding = 10;
  const uniqueId = useId();
  const dropShadowId = `dropShadow-${uniqueId}`;
  const expandAndFillId = `expandAndFill-${uniqueId}`;

  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [peelAmount, setPeelAmount] = useState(0);
  const [isPeeled, setIsPeeled] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);

  const peelThreshold = 80; // Percentage to fully peel

  // Update container class based on drag state
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (isDragging && !isPeeled) {
      container.classList.add("dragging");
    } else {
      container.classList.remove("dragging");
    }
  }, [isDragging, isPeeled]);

  // Handle drag interactions
  useEffect(() => {
    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    if (!container || !wrapper) return;

    const handleMouseDown = (e) => {
      // Clear reset state to allow peeling again
      if (wrapper.classList.contains("sticker-reset")) {
        wrapper.classList.remove("sticker-reset");
        wrapper.style.animation = "";
      }
      setIsDragging(true);
      setStartY(e.clientY);
      setCurrentY(e.clientY);
      e.preventDefault();
    };

    const handleMouseMove = (e) => {
      if (!isDragging || isPeeled) return;

      const newY = e.clientY;
      setCurrentY(newY);

      const rect = container.getBoundingClientRect();
      const dragDistance = newY - startY;

      // Only allow downward dragging
      if (dragDistance < 0) return;

      const maxDrag = rect.height * 0.8; // Max drag distance
      const newPeelAmount = Math.min(
        100,
        Math.max(0, (dragDistance / maxDrag) * 100)
      );

      setPeelAmount(newPeelAmount);

      if (newPeelAmount >= peelThreshold && !isPeeled) {
        setIsPeeled(true);
        container.classList.add("peeled");

        // Delay falling animation to allow flap to fully invert
        setTimeout(() => {
          // Capture current position before making it fixed
          const rect = wrapper.getBoundingClientRect();
          wrapper.style.left = `${rect.left}px`;
          wrapper.style.top = `${rect.top}px`;
          wrapper.style.width = `${rect.width}px`;
          wrapper.style.height = `${rect.height}px`;
          wrapper.classList.add("falling");
        }, 500);

        // Reset after animation completes (500ms delay + 600ms fall + buffer)
        setTimeout(() => {
          setIsPeeled(false);
          setPeelAmount(0);
          setIsDragging(false);
          setStartY(0);
          setCurrentY(0);
          container.classList.remove("peeled");
          wrapper.classList.remove("falling");
          // Reset inline styles
          wrapper.style.left = "";
          wrapper.style.top = "";
          wrapper.style.width = "";
          wrapper.style.height = "";
          // Add class to prevent fade-in animation from re-triggering
          wrapper.classList.add("sticker-reset");
          // Ensure sticker reappears instantly without fade-in animation
          wrapper.style.opacity = "1";
          wrapper.style.animation = "none";
          // Force a reflow to ensure styles are applied
          void wrapper.offsetHeight;
        }, 1200);
      }
    };

    const handleMouseUp = () => {
      if (isDragging && !isPeeled) {
        // If not fully peeled, snap back
        setPeelAmount(0);
      }
      setIsDragging(false);
    };

    const handleTouchStart = (e) => {
      // Clear reset state to allow peeling again
      if (wrapper.classList.contains("sticker-reset")) {
        wrapper.classList.remove("sticker-reset");
        wrapper.style.animation = "";
      }
      setIsDragging(true);
      setStartY(e.touches[0].clientY);
      setCurrentY(e.touches[0].clientY);
      container.classList.add("touch-active");
    };

    const handleTouchMove = (e) => {
      if (!isDragging || isPeeled) return;

      e.preventDefault(); // Prevent scrolling

      const newY = e.touches[0].clientY;
      setCurrentY(newY);

      const rect = container.getBoundingClientRect();
      const dragDistance = newY - startY;

      // Only allow downward dragging
      if (dragDistance < 0) return;

      const maxDrag = rect.height * 0.8;
      const newPeelAmount = Math.min(
        100,
        Math.max(0, (dragDistance / maxDrag) * 100)
      );

      setPeelAmount(newPeelAmount);

      if (newPeelAmount >= peelThreshold && !isPeeled) {
        setIsPeeled(true);
        container.classList.add("peeled");

        // Delay falling animation to allow flap to fully invert
        setTimeout(() => {
          // Capture current position before making it fixed
          const rect = wrapper.getBoundingClientRect();
          wrapper.style.left = `${rect.left}px`;
          wrapper.style.top = `${rect.top}px`;
          wrapper.style.width = `${rect.width}px`;
          wrapper.style.height = `${rect.height}px`;
          wrapper.classList.add("falling");
        }, 500);

        // Reset after animation completes (500ms delay + 600ms fall + buffer)
        setTimeout(() => {
          setIsPeeled(false);
          setPeelAmount(0);
          setIsDragging(false);
          setStartY(0);
          setCurrentY(0);
          container.classList.remove("peeled");
          wrapper.classList.remove("falling");
          // Reset inline styles
          wrapper.style.left = "";
          wrapper.style.top = "";
          wrapper.style.width = "";
          wrapper.style.height = "";
          // Add class to prevent fade-in animation from re-triggering
          wrapper.classList.add("sticker-reset");
          // Ensure sticker reappears instantly without fade-in animation
          wrapper.style.opacity = "1";
          wrapper.style.animation = "none";
          // Force a reflow to ensure styles are applied
          void wrapper.offsetHeight;
        }, 1200);
      }
    };

    const handleTouchEnd = () => {
      if (isDragging && !isPeeled) {
        setPeelAmount(0);
      }
      setIsDragging(false);
      container.classList.remove("touch-active");
    };

    wrapper.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    wrapper.addEventListener("touchstart", handleTouchStart);
    wrapper.addEventListener("touchmove", handleTouchMove);
    wrapper.addEventListener("touchend", handleTouchEnd);
    wrapper.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      wrapper.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      wrapper.removeEventListener("touchstart", handleTouchStart);
      wrapper.removeEventListener("touchmove", handleTouchMove);
      wrapper.removeEventListener("touchend", handleTouchEnd);
      wrapper.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [isDragging, isPeeled, startY, peelThreshold, currentY]);

  const cssVars = useMemo(
    () => ({
      "--sticker-rotate": `${rotate}deg`,
      "--sticker-p": `${defaultPadding}px`,
      "--sticker-peelback-hover": `${peelBackHoverPct}%`,
      "--sticker-peelback-drag": `${peelAmount}%`,
      "--sticker-width": `${width}px`,
      "--sticker-shadow-opacity": shadowIntensity,
      "--peel-direction": `${peelDirection}deg`,
    }),
    [
      rotate,
      peelBackHoverPct,
      peelAmount,
      width,
      shadowIntensity,
      peelDirection,
    ]
  );

  return (
    <div
      className={`sticker-peel-wrapper ${className}`}
      style={cssVars}
      ref={wrapperRef}
    >
      <svg width="0" height="0">
        <defs>
          <filter id={dropShadowId}>
            <feDropShadow
              dx="2"
              dy="4"
              stdDeviation={3 * shadowIntensity}
              floodColor="black"
              floodOpacity={shadowIntensity}
            />
          </filter>

          <filter id={expandAndFillId}>
            <feOffset dx="0" dy="0" in="SourceAlpha" result="shape" />
            <feFlood floodColor="rgb(179,179,179)" result="flood" />
            <feComposite operator="in" in="flood" in2="shape" />
          </filter>
        </defs>
      </svg>

      <div className="sticker-container" ref={containerRef}>
        <div
          className="sticker-main"
          style={{ filter: `url(#${dropShadowId})` }}
        >
          <img
            src={imageSrc}
            alt=""
            className="sticker-image"
            draggable="false"
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>

        <div className="flap">
          <img
            src={imageSrc}
            alt=""
            className="flap-image"
            style={{ filter: `url(#${expandAndFillId})` }}
            draggable="false"
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
      </div>
    </div>
  );
};

export default StickerPeel;
