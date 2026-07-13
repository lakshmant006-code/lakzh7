import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useLenisScroll } from "../hooks/useLenisScroll";
import { isHomePath } from "../constants/homeRoutes";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const { scrollToTop } = useLenisScroll();
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    if (hash && isHomePath(pathname)) {
      prevPathnameRef.current = pathname;
      return;
    }
    if (pathname === prevPathnameRef.current) {
      prevPathnameRef.current = pathname;
      return;
    }

    scrollToTop({ immediate: true });
    prevPathnameRef.current = pathname;
  }, [pathname, hash, scrollToTop]);

  return null;
};

export default ScrollToTop;
