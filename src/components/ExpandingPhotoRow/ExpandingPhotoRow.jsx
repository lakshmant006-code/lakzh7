import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import enjoy1 from "../../assets/img/about-pictures/enjoy 1.jpeg";
import enjoy2 from "../../assets/img/about-pictures/enjoy 2.jpeg";
import enjoy3 from "../../assets/img/about-pictures/enjoy 3.jpeg";
import enjoy4 from "../../assets/img/about-pictures/enjoy 4.jpeg";
import enjoy5 from "../../assets/img/about-pictures/enjoy 5.jpeg";
import enjoy6 from "../../assets/img/about-pictures/enjoy 6.jpeg";
import enjoy7 from "../../assets/img/about-pictures/enjoy 7.jpeg";
import enjoy8 from "../../assets/img/about-pictures/enjoy 8.jpeg";
import "./ExpandingPhotoRow.css";

const images = [enjoy1, enjoy2, enjoy3, enjoy4, enjoy5, enjoy6, enjoy7, enjoy8];

const cardW = 200;
const gap = 8;
const slotW = cardW + gap; // 208
const rowW = images.length * cardW + (images.length - 1) * gap; // same in both states so x is one coordinate system
const ROW_HEIGHT = 260;
const cy = ROW_HEIGHT / 2 - cardW / 2; // 30

// Collapsed trio: center card must match expanded position so it doesn't jump; left/right symmetric around it
const centerIndex = Math.floor(images.length / 2); // middle index
const leftIndex = centerIndex - 1;
const rightIndex = centerIndex + 1;
const collapsedCenter = centerIndex * slotW; // same as expanded center index
const collapsedFanOffset = Math.round(110 * (cardW / 180)); // ~122 for 200px — spacing for fan
const collapsedLeft = collapsedCenter - collapsedFanOffset;
const collapsedRight = collapsedCenter + collapsedFanOffset;
const centerX = -rowW / 2;

function getCollapsedStyle(index) {
  if (index === leftIndex) return { opacity: 1, scale: 1, x: collapsedLeft, y: cy, rotateZ: -12, zIndex: 2 };
  if (index === centerIndex) return { opacity: 1, scale: 1, x: collapsedCenter, y: cy, rotateZ: 0, zIndex: 3 };
  if (index === rightIndex) return { opacity: 1, scale: 1, x: collapsedRight, y: cy, rotateZ: 12, zIndex: 2 };
  return { opacity: 0, scale: 1, x: collapsedCenter, y: cy, rotateZ: 0, zIndex: 1 };
}

function getExpandedStyle(index) {
  const zIndex = index === centerIndex ? 3 : index === leftIndex || index === rightIndex ? 2 : 1;
  return { opacity: 1, scale: 1, x: index * slotW, y: cy, rotateZ: 0, zIndex };
}

// Fade-out in place: same x,y as expanded, only opacity → 0
function getFadingOutStyle(index) {
  return { opacity: 0, scale: 1, x: index * slotW, y: cy, rotateZ: 0, zIndex: 1 };
}

const FADE_OUT_MS = 400;

function ExpandingPhotoRow() {
  const [isHovered, setIsHovered] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });
  const fadeOutTimeoutRef = useRef(null);
  const breakoutRef = useRef(null);
  const rowX = useMotionValue(centerX);

  const handleMouseLeave = () => {
    if (isHovered) {
      animate(rowX, centerX, { type: "tween", duration: 0.35, ease: "easeInOut" });
      setIsHovered(false);
      setIsFadingOut(true);
    }
  };

  useEffect(() => {
    if (!isFadingOut) return;
    fadeOutTimeoutRef.current = setTimeout(() => setIsFadingOut(false), FADE_OUT_MS);
    return () => {
      if (fadeOutTimeoutRef.current) clearTimeout(fadeOutTimeoutRef.current);
    };
  }, [isFadingOut]);

  useEffect(() => {
    if (!isHovered) return;
    const measure = () => {
      if (!breakoutRef.current) return;
      const w = breakoutRef.current.offsetWidth;
      const halfRange = w < rowW ? (rowW - w) / 2 : 0;
      setDragConstraints({ left: centerX - halfRange, right: centerX + halfRange });
    };
    measure();
    if (!breakoutRef.current) return;
    const ro = new ResizeObserver(measure);
    ro.observe(breakoutRef.current);
    return () => ro.disconnect();
  }, [isHovered]);

  const getStyle = (index) => {
    if (isHovered) return getExpandedStyle(index);
    if (isFadingOut && index !== leftIndex && index !== centerIndex && index !== rightIndex) return getFadingOutStyle(index);
    return getCollapsedStyle(index);
  };

  const getTransition = (index) => {
    const isSkewedCard = index === leftIndex || index === rightIndex;
    if (isSkewedCard) {
      return { type: "tween", ease: "easeInOut", duration: 0.35 };
    }
    // Fading out in place: only opacity, no move
    if (isFadingOut) {
      return {
        opacity: { type: "tween", ease: "easeInOut", duration: FADE_OUT_MS / 1000 },
        x: { duration: 0 },
        y: { duration: 0 },
        rotateZ: { duration: 0 },
        scale: { duration: 0 },
      };
    }
    // Collapsed: snap. Expanding: snap position, fade opacity
    if (!isHovered) {
      return { type: "tween", ease: "easeInOut", duration: 0.35 };
    }
    return {
      opacity: { type: "tween", ease: "easeInOut", duration: 0.4 },
      x: { duration: 0 },
      y: { duration: 0 },
      rotateZ: { duration: 0 },
      scale: { duration: 0 },
    };
  };

  return (
    <div className="expanding-photo-row-section">
      <div
        className="expanding-photo-row-wrapper"
        style={{ position: "relative", height: ROW_HEIGHT, width: "100%" }}
      >
        <div ref={breakoutRef} className="expanding-photo-row-breakout">
          <div className="expanding-photo-row-inner">
            <motion.div
              className={isHovered ? "row-expanded row-expanded-draggable" : "row-collapsed"}
              style={{ x: rowX, z: 0 }}
              drag={isHovered ? "x" : false}
              dragConstraints={isHovered ? dragConstraints : undefined}
              dragElastic={isHovered ? 0.1 : 0}
              dragMomentum={isHovered}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}
            >
              <div
                className={`expanding-photo-row-hitarea ${isHovered ? "expanding-photo-row-hitarea--expanded" : ""} ${isDragging ? "expanding-photo-row-hitarea--dragging" : ""}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
                aria-hidden
              />
              {images.map((src, index) => (
                <motion.div
                  key={index}
                  className="card-base card-absolute"
                  initial={false}
                  animate={getStyle(index)}
                  transition={getTransition(index)}
                >
                  <img src={src} alt="" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
      <p className="expanding-photo-row-hint">Hover/ Tap Me!</p>
    </div>
  );
}

export default ExpandingPhotoRow;
