import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import "./CursorPill.css";

const CursorPill = ({ isHovering, text = "View case study" }) => {
  const cursorPillRef = useRef(null);

  // Custom cursor pill: position via direct DOM transform (no React state) + rAF throttle to avoid re-renders on every mousemove
  const rafIdRef = useRef(null);
  useEffect(() => {
    const isDesktop = window.matchMedia("(hover: hover)").matches;
    if (!isDesktop) return;

    const pill = cursorPillRef.current;
    if (!pill) return;

    const offsetX = 12;
    const offsetY = 12;
    pill.style.left = "0";
    pill.style.top = "0";

    const handleMouseMove = (e) => {
      if (rafIdRef.current != null) return;
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        const x = e.clientX + offsetX;
        const y = e.clientY + offsetY;
        pill.style.transform = `translate(${x}px, ${y}px)`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  // Animate cursor pill width on hover
  useEffect(() => {
    const isDesktop = window.matchMedia("(hover: hover)").matches;
    if (!isDesktop) return;

    const cursorPill = cursorPillRef.current;
    const cursorPillText = cursorPill?.querySelector(".cursor-pill-text");
    if (!cursorPill || !cursorPillText) return;

    // Kill any existing animations on the text element
    gsap.killTweensOf(cursorPillText);

    if (isHovering) {
      // Show the pill container immediately
      cursorPill.style.display = "block";

      cursorPillText.style.width = "auto";
      const fullWidth = cursorPillText.offsetWidth;
      cursorPillText.style.width = "0px";

      gsap.to(cursorPillText, {
        width: fullWidth,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      gsap.to(cursorPillText, {
        width: 0,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          cursorPill.style.display = "none";
        },
      });
    }
  }, [isHovering]);

  return (
    <div ref={cursorPillRef} className="cursor-pill">
      <span className="cursor-pill-text">{text}</span>
    </div>
  );
};

export default CursorPill;
