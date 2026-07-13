import { useState, useEffect } from "react";
import { useLenis } from "@studio-freight/react-lenis";
import { useLenisScroll } from "../../hooks/useLenisScroll";
import "./BackToTop.css";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isInFooter, setIsInFooter] = useState(false);
  const lenis = useLenis();
  const { scrollToTop } = useLenisScroll();

  useEffect(() => {
    const checkScrollPosition = () => {
      const scrollPosition = lenis
        ? lenis.scroll
        : window.scrollY || document.documentElement.scrollTop;
      setIsVisible(scrollPosition > 300);

      // Check if viewport has entered the footer (button would sit over footer)
      const footer = document.querySelector(".footer");
      if (footer) {
        const footerTop = footer.getBoundingClientRect().top;
        const viewportHeight = window.innerHeight;
        const buttonBottomOffset = 32 + 42; // 2rem + button height
        setIsInFooter(footerTop < viewportHeight - buttonBottomOffset);
      }
    };

    checkScrollPosition();

    if (lenis) {
      lenis.on("scroll", checkScrollPosition);
    } else {
      window.addEventListener("scroll", checkScrollPosition);
    }

    return () => {
      if (lenis) {
        lenis.off("scroll", checkScrollPosition);
      } else {
        window.removeEventListener("scroll", checkScrollPosition);
      }
    };
  }, [lenis]);

  const handleClick = () => {
    scrollToTop({ duration: 1.2 });
  };

  return (
    <button
      className={`back-to-top-button ${isVisible ? "visible" : ""} ${isInFooter ? "in-footer" : ""}`}
      onClick={handleClick}
      aria-label="Back to top"
    >
      <svg
        className="back-to-top-arrow"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M8 3v10M4 7l4-4 4 4"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="square"
          strokeLinejoin="square"
        />
      </svg>
    </button>
  );
};

export default BackToTop;
