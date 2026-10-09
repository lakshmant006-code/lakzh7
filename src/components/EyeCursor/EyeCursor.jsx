import React, { useEffect, useRef } from "react";
import "./EyeCursor.css";

/**
 * A custom cursor that shows a small animated eye with a caption, following
 * the pointer. Only active on devices that actually have a hover pointer.
 */
export default function EyeCursor({ visible, text = "", img = "/home/eye-cursor.webp" }) {
  const ref = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const isDesktop = window.matchMedia("(hover: hover)").matches;
    if (!isDesktop) return;
    const el = ref.current;
    if (!el) return;

    const move = (e) => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      });
    };
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`eye-cursor${visible ? " eye-cursor--visible" : ""}`}
      aria-hidden="true"
    >
      <img src={img} alt="" className="eye-cursor-img" />
      <span className="eye-cursor-text">{text}</span>
    </div>
  );
}
