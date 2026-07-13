import { useEffect } from "react";

/**
 * Custom hook to reset scroll position to top on page load/refresh
 * Handles hard refreshes, soft refreshes, and auto-reloads
 * 
 * @param {Object} options - Configuration options
 * @param {number} options.delay - Additional delay in ms for late scroll restoration (default: 100)
 */
const useScrollReset = (options = {}) => {
  const {
    delay = 100,
  } = options;

  useEffect(() => {
    // Disable browser's automatic scroll restoration
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Comprehensive scroll reset - reset all possible scroll positions
    const resetScroll = () => {
      window.scrollTo(0, 0);
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.documentElement.scrollLeft = 0;
      document.body.scrollTop = 0;
      document.body.scrollLeft = 0;
      if (document.documentElement.scrollHeight > 0) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body.scrollHeight > 0) {
        document.body.scrollTop = 0;
      }
    };

    // Reset immediately on mount (page load/refresh)
    resetScroll();

    // Reset after a short delay to catch any late scroll restoration
    const timeoutId = setTimeout(() => {
      resetScroll();
    }, 0);

    // Reset after a slightly longer delay to catch browser restoration
    const timeoutId2 = setTimeout(() => {
      resetScroll();
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(timeoutId2);
    };
  }, [delay]);
};

export default useScrollReset;

