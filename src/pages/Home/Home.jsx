import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { isGoogleCreativePath, isDefaultHomePath } from "../../constants/homeRoutes";
import { useLenisScroll } from "../../hooks/useLenisScroll";
import Footer from "../../components/Footer/Footer";
import WorkBentoGrid from "../../components/Work/WorkBentoGrid";
import PokemonIntro from "../../components/PokemonIntro/PokemonIntro";
import "./Home.css";

const LANDING_FADE_DURATION = 1;
const LANDING_EASE = "power2.out";
// Pixel cat rises in with nav (matches Nav.jsx)
export const LANDING_NAV_DELAY = 0.85;
export const LANDING_NAV_DURATION = 0.7;

/** Placeholder grid matching .home-case-study-grid layout for skeleton state */
function SkeletonWorkGrid() {
  return (
    <div className="home-case-study-grid home-work-skeleton" aria-hidden="true">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="home-work-skeleton-card" />
      ))}
    </div>
  );
}

const Home = () => {
  const location = useLocation();
  const isGoogleCreative = isGoogleCreativePath(location.pathname);
  const [pokemonIntroDone, setPokemonIntroDone] = useState(
    () => !isGoogleCreativePath(location.pathname),
  );
  const { scrollToTop } = useLenisScroll();
  const [isHoveringWorkCard, setIsHoveringWorkCard] = useState(false);
  const [isWorkLoading, setIsWorkLoading] = useState(true);
  const heroTitleRef = useRef(null);
  const bioRef = useRef(null);
  const landingCatRef = useRef(null);
  const workGridRef = useRef(null);

  useEffect(() => {
    setPokemonIntroDone(!isGoogleCreative);
  }, [isGoogleCreative]);

  // "Work" breadcrumb from a case study: jump to the projects.
  useEffect(() => {
    if (!location.state?.showWork) return;
    requestAnimationFrame(() => {
      document.getElementById("work")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  // Landing: rise-from-baseline for title and bio (same style as Play), start on mount to avoid lag
  useEffect(() => {
    const titleEl = heroTitleRef.current;
    const bioEl = bioRef.current;
    const cat = landingCatRef.current;
    if (!titleEl || !bioEl || !cat) return;

    const titleLines = titleEl.querySelectorAll(".home-hero-line-inner");
    const bioLine = bioEl.querySelector(".home-bio-line-inner");
    if (!titleLines.length || !bioLine) return;

    const titleLinesArr = Array.from(titleLines);
    const EASE = "cubic-bezier(0.25, 0.46, 0.45, 0.94)"; // ≈ power2.out
    const navFadeDelay = isDefaultHomePath(location.pathname)
      ? LANDING_NAV_DELAY
      : 0.5;

    // Reduced motion: show everything, no reveal.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      titleLinesArr.forEach((l) => (l.style.transform = "none"));
      bioLine.style.transform = "none";
      cat.style.opacity = "1";
      return;
    }

    // Initial masked state (inner lines sit below their overflow-hidden mask).
    titleLinesArr.forEach((l) => (l.style.transform = "translateY(100%)"));
    bioLine.style.transform = "translateY(100%)";

    const anims = [];
    const riseKeyframes = [
      { transform: "translateY(100%)" },
      { transform: "translateY(0)" },
    ];
    const riseOpts = (delayMs) => ({
      duration: LANDING_FADE_DURATION * 1000,
      delay: delayMs,
      easing: EASE,
      fill: "forwards",
    });

    titleLinesArr.forEach((l) => {
      const a = l.animate(riseKeyframes, riseOpts(0));
      a.addEventListener("finish", () => (l.style.transform = "none"));
      anims.push(a);
    });

    // Bio starts 0.2s before the title finishes (old "-=0.2").
    const bioAnim = bioLine.animate(
      riseKeyframes,
      riseOpts(LANDING_FADE_DURATION * 1000 - 200),
    );
    bioAnim.addEventListener("finish", () => (bioLine.style.transform = "none"));
    anims.push(bioAnim);

    const catAnim = cat.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: LANDING_NAV_DURATION * 1000,
      delay: navFadeDelay * 1000,
      easing: EASE,
      fill: "forwards",
    });
    catAnim.addEventListener("finish", () => (cat.style.opacity = "1"));
    anims.push(catAnim);

    return () => anims.forEach((a) => a.cancel());
  }, [location.pathname]);

  const workSection = (
    <section
      id="work"
      className="home-work"
    >
      <div className="home-work-inner page-content-shell">
        {isGoogleCreative ? (
          <div className="home-work-section-intro">
            <h2 className="home-play-title">Design Case Studies</h2>
            <p className="home-play-subtitle">
              <span className="play-question">
                How I balance real user needs and business goals
              </span>{" "}
              — from research to shipped, across fintech, health AI, and
              enterprise.
            </p>
          </div>
        ) : null}
        <div className="home-work-loading-wrapper">
          <div
            style={{
              opacity: isWorkLoading ? 1 : 0,
              transition: "opacity 0.4s ease",
              pointerEvents: "none",
              position: isWorkLoading ? "relative" : "absolute",
              inset: 0,
            }}
          >
            <SkeletonWorkGrid />
          </div>
          <div
            style={{
              opacity: isWorkLoading ? 0 : 1,
              transition: "opacity 0.4s ease",
            }}
          >
            <WorkBentoGrid
              compactLayout
              gridClassName="home-case-study-grid"
              onHoverChange={setIsHoveringWorkCard}
              isHoveringWorkCard={isHoveringWorkCard}
              containerRef={workGridRef}
              onReady={() => setIsWorkLoading(false)}
            />
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <>
      {isGoogleCreative && !pokemonIntroDone ? (
        <PokemonIntro
          onComplete={() => {
            scrollToTop({ immediate: true });
            setPokemonIntroDone(true);
          }}
        />
      ) : null}
      <main
        className={`home${isGoogleCreative ? " home-google-creative" : ""}`}
        style={{ backgroundColor: "#ffffff" }}
      >
        {workSection}
        <Footer />
      </main>

    </>
  );
};

export default Home;
