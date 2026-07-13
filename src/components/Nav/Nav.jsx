import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { useLenis } from "@studio-freight/react-lenis";
import { useLenisScroll } from "../../hooks/useLenisScroll";
import { LANDING_NAV_DELAY, LANDING_NAV_DURATION } from "../../pages/Home/Home";
import {
  isHomePath,
  isGoogleCreativePath,
  isDefaultHomePath,
} from "../../constants/homeRoutes";
import "./Nav.css";
import darkLogo from "../../assets/img/dark-logo.png";
import lightLogo from "../../assets/img/light-logo.png";
import flowerIcon from "../../assets/img/spiraL.png";

const Nav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const lenis = useLenis();
  const { scrollToTop, scrollToElement } = useLenisScroll();
  const circleRefs = useRef([]);
  const tlRefs = useRef([]);
  const activeTweenRefs = useRef([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );
  const hamburgerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navItemsRef = useRef(null);
  const navRef = useRef(null);

  const navItems = [
    { label: "work", href: "/", isLink: true },
    { label: "playground", href: "/", isLink: true },
    { label: "about", href: "/about", isLink: true },
    {
      label: "flower",
      href: "/flower",
      isLink: true,
      image: flowerIcon,
      imageAlt: "Plant your flower",
    },
  ];

  const handleLogoClick = (e) => {
    if (isHomePath(location.pathname)) {
      e.preventDefault();
      window.history.pushState(null, "", location.pathname);
      scrollToTop({ duration: 1.2 });
    } else {
      navigate("/");
      setTimeout(() => scrollToTop({ duration: 1.2 }), 100);
    }
  };

  const isNavItemActive = (item) => {
    const path = location.pathname;
    if (isGoogleCreativePath(path)) return false;
    // Main home only: "work" represents the home page itself; /google-creative never highlights
    if (isDefaultHomePath(path)) {
      if (item.label === "work") return true;
      if (item.label === "about") return false;
    }
    if (item.label === "about") return path === "/about";
    if (item.label === "flower") return path === "/flower";
    return false;
  };

  const renderPillLabel = (item) => {
    if (item.image) {
      return (
        <span className="pill-label">
          <img
            src={item.image}
            alt={item.imageAlt ?? item.label}
            className="pill-flower-icon"
          />
        </span>
      );
    }

    return (
      <>
        <span className="pill-label">{item.label}</span>
        <span className="pill-label-hover" aria-hidden="true">
          {item.label}
        </span>
      </>
    );
  };

  // Nav fade-in: same timing on all non–case-study pages; case studies show nav immediately
  const CASE_STUDY_PATHS = [
    "/venmo",
    "/time-management",
    "/wholefoods",
    "/quizai",
    "/hiku",
    "/blockparty",
  ];
  const NAV_FADE_DELAY = isDefaultHomePath(location.pathname)
    ? LANDING_NAV_DELAY
    : 0.5;

  useEffect(() => {
    if (!navRef.current) return;

    const path = location.pathname;
    const isWorkPage = path === "/work";
    const isCaseStudyPage = CASE_STUDY_PATHS.includes(path);

    // Set initial state - position above viewport
    gsap.set(navRef.current, {
      y: -100,
      opacity: 0,
    });

    // Work page: let the Work component control the navbar animation
    if (isWorkPage) {
      return;
    }

    // Case study pages: show nav immediately (no fade-in)
    if (isCaseStudyPage) {
      gsap.set(navRef.current, { y: 0, opacity: 1 });
      return;
    }

    // All other pages (home, about, pixel-cat, not-found): unified fade-in timing
    const navTl = gsap.timeline({
      defaults: { ease: "power2.out" },
    });

    navTl.to(navRef.current, {
      y: 0,
      opacity: 1,
      duration: LANDING_NAV_DURATION,
      ease: "power2.out",
      delay: NAV_FADE_DELAY,
    });

    return () => {
      navTl.kill();
    };
  }, [location.pathname]);

  useEffect(() => {
    const layout = () => {
      const isDesktop = window.innerWidth > 768;
      const isLastPill = (index) => index === navItems.length - 1;

      circleRefs.current.forEach((circle, index) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta =
          Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;
        const shouldAnimateCircle = !isDesktop || isLastPill(index);

        if (shouldAnimateCircle) {
          circle.style.width = `${D}px`;
          circle.style.height = `${D}px`;
          circle.style.bottom = `-${delta}px`;

          gsap.set(circle, {
            xPercent: -50,
            scale: 0,
            transformOrigin: `50% ${originY}px`,
          });
        } else {
          gsap.set(circle, {
            opacity: 0,
            scale: 0,
            display: "none",
          });
        }

        const label = pill.querySelector(".pill-label");
        const white = pill.querySelector(".pill-label-hover");
        const isFlowerPill = pill.classList.contains("pill-flower");
        const flowerIcon = isFlowerPill
          ? pill.querySelector(".pill-flower-icon")
          : null;

        if (label) gsap.set(label, { y: 0 });
        if (white && !isFlowerPill) gsap.set(white, { y: h + 12, opacity: 0 });

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        if (shouldAnimateCircle && !isFlowerPill) {
          tl.to(
            circle,
            {
              scale: 1.2,
              xPercent: -50,
              duration: 2,
              ease: "power1.easeOut",
              overwrite: "auto",
            },
            0,
          );
        }

        if (isFlowerPill && flowerIcon) {
          gsap.set(flowerIcon, { rotation: 0, transformOrigin: "50% 50%" });
          tl.to(
            flowerIcon,
            {
              rotation: 180,
              duration: 1,
              ease: "power1.easeOut",
              overwrite: "auto",
            },
            0,
          );
        } else {
          if (label) {
            tl.to(
              label,
              {
                y: -(h + 8),
                duration: 2,
                ease: "power1.easeOut",
                overwrite: "auto",
              },
              0,
            );
          }

          if (white) {
            gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
            tl.to(
              white,
              {
                y: 0,
                opacity: 1,
                duration: 2,
                ease: "power1.easeOut",
                overwrite: "auto",
              },
              0,
            );
          }
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();

    const onResize = () => layout();
    window.addEventListener("resize", onResize);

    if (document.fonts?.ready) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    const menu = mobileMenuRef.current;
    if (menu) {
      gsap.set(menu, { visibility: "hidden", opacity: 0, y: "-100%" });
    }

    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Effect to sync hamburger lines with menu state
  useEffect(() => {
    const hamburger = hamburgerRef.current;
    if (!hamburger) return;

    const lines = hamburger.querySelectorAll(".hamburger-line");
    if (lines.length >= 2) {
      if (isMobileMenuOpen) {
        gsap.set(lines[0], { rotation: 45, y: 3 });
        gsap.set(lines[1], { rotation: -45, y: -3 });
      } else {
        gsap.set(lines[0], { rotation: 0, y: 0 });
        gsap.set(lines[1], { rotation: 0, y: 0 });
      }
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // On desktop: always show nav items and keep hamburger hidden (no scroll collapse).
  // On small screens, CSS handles collapse via .desktop-only / .mobile-only.
  useEffect(() => {
    const isDesktop = windowWidth > 768;
    if (!isDesktop) return;

    const navItems = navItemsRef.current?.children;
    const hamburger = hamburgerRef.current;

    if (!navItems || navItems.length === 0 || !hamburger) return;

    gsap.set(navItems, { x: 0, opacity: 1 });
    Array.from(navItems).forEach((item) => {
      item.style.pointerEvents = "auto";
    });
    gsap.set(hamburger, { opacity: 0, scale: 0.8, display: "flex" });
    hamburger.style.pointerEvents = "none";

    const lines = hamburger.querySelectorAll(".hamburger-line");
    if (lines.length >= 2 && !isMobileMenuOpen) {
      gsap.set(lines[0], { rotation: 0, y: 0 });
      gsap.set(lines[1], { rotation: 0, y: 0 });
    }
  }, [isMobileMenuOpen, location.pathname, lenis, windowWidth]);

  const handleEnter = (i) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease: "power3.easeOut",
      overwrite: "auto",
    });
  };

  const handleLeave = (i) => {
    if (isGoogleCreativePath(location.pathname)) return;
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease: "power3.easeOut",
      overwrite: "auto",
    });
  };

  const handleWorkClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      navigate("/", { replace: true });
      scrollToTop({ duration: 1.2 });
    } else {
      navigate("/");
      setTimeout(() => scrollToTop({ duration: 1.2 }), 100);
    }
  };

  const handlePlaygroundClick = (e) => {
    e.preventDefault();
    const scrollToPlay = () => {
      const el = document.getElementById("play");
      if (el) scrollToElement(el, { duration: 1.2, offset: -80 });
    };
    if (location.pathname === "/") {
      scrollToPlay();
    } else {
      navigate("/");
      setTimeout(scrollToPlay, 300);
    }
  };

  const handleResumeClick = (e) => {
    e.preventDefault();
    window.open(
      "https://drive.google.com/file/d/1t8BBP__xqK7TDSD1hLv0WFaMLLgeufTK/view?usp=sharing",
      "_blank",
      "noopener,noreferrer",
    );
  };

  useEffect(() => {
    return () => {
      if (isMobileMenuOpen) {
        if (lenis) {
          lenis.start();
        } else {
          document.body.classList.remove("mobile-menu-open");
        }
      }
    };
  }, [isMobileMenuOpen, lenis]);

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;

    if (newState) {
      if (lenis) {
        lenis.stop();
      } else {
        document.body.classList.add("mobile-menu-open");
      }
    } else {
      if (lenis) {
        lenis.start();
      } else {
        document.body.classList.remove("mobile-menu-open");
      }
    }

    if (hamburger) {
      if (newState) {
        gsap.set(hamburger, { opacity: 1, scale: 1, zIndex: 1000 });
        hamburger.style.pointerEvents = "auto";
      }

      const lines = hamburger.querySelectorAll(".hamburger-line");
      if (newState) {
        gsap.to(lines[0], {
          rotation: 45,
          y: 3,
          duration: 0.3,
          ease: "power3.easeOut",
        });
        gsap.to(lines[1], {
          rotation: -45,
          y: -3,
          duration: 0.3,
          ease: "power3.easeOut",
        });
      } else {
        gsap.to(lines[0], {
          rotation: 0,
          y: 0,
          duration: 0.3,
          ease: "power3.easeOut",
        });
        gsap.to(lines[1], {
          rotation: 0,
          y: 0,
          duration: 0.3,
          ease: "power3.easeOut",
        });
      }
    }

    if (menu) {
      if (newState) {
        gsap.set(menu, { visibility: "visible", opacity: 1 });
        gsap.fromTo(
          menu,
          { y: "-100%" },
          {
            y: "0%",
            duration: 0.9,
            ease: "power3.easeOut",
          },
        );
      } else {
        gsap.to(menu, {
          y: "-100%",
          duration: 0.7,
          ease: "power3.easeOut",
          onComplete: () => {
            gsap.set(menu, { visibility: "hidden" });
          },
        });
      }
    }
  };

  return (
    <nav
      ref={navRef}
      className="site-nav top-0 z-[100] relative"
      style={{
        opacity: 0,
        transform: "translateY(-100px)",
      }}
    >
      <div className="page-content-shell">
        <div className="flex items-center justify-between py-5 z-[1000] gap-6 lg:h-16 relative min-h-[32px]">
          <Link to="/" onClick={handleLogoClick} className="logo-link">
            <img
              src={isMobileMenuOpen ? lightLogo : darkLogo}
              alt="Beverly Yip"
              className="logo-image"
            />
          </Link>
          <ul className="pill-list desktop-only" ref={navItemsRef}>
            {navItems.map((item, i) => (
              <li key={item.label}>
                <Link
                  to={item.href}
                  className={`pill${item.image ? " pill-flower" : ""}${isNavItemActive(item) ? " pill-active" : ""}`}
                  onMouseEnter={() => handleEnter(i)}
                  onMouseLeave={() => handleLeave(i)}
                  onClick={item.label === "work" ? handleWorkClick : item.label === "playground" ? handlePlaygroundClick : undefined}
                >
                  <span
                    className="hover-circle"
                    aria-hidden="true"
                    ref={(el) => {
                      circleRefs.current[i] = el;
                    }}
                  />
                  <span className="pill-active-dot" aria-hidden="true" />
                  <span className="label-stack">{renderPillLabel(item)}</span>
                </Link>
              </li>
            ))}
          </ul>
          <button
            className={`mobile-menu-button ${
              isMobileMenuOpen ? "menu-open" : ""
            }`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            ref={hamburgerRef}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>
      </div>
      <div className="mobile-menu-popover" ref={mobileMenuRef}>
        <ul className="mobile-menu-list">
          {navItems.map((item, i) => (
            <li key={`mobile-${item.label}`}>
              <Link
                to={item.href}
                className={`mobile-menu-link${isNavItemActive(item) ? " mobile-menu-link-active" : ""}`}
                onClick={(e) => {
                  if (item.label === "work") {
                    handleWorkClick(e);
                  } else if (item.label === "playground") {
                    handlePlaygroundClick(e);
                  }
                  setIsMobileMenuOpen(false);
                  toggleMobileMenu();
                }}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.imageAlt ?? item.label}
                    className="mobile-menu-flower-icon"
                  />
                ) : (
                  item.label
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
