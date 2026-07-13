import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { isGoogleCreativePath, isDefaultHomePath } from "../../constants/homeRoutes";
import { useLenisScroll } from "../../hooks/useLenisScroll";
import { gsap } from "gsap";
import Footer from "../../components/Footer/Footer";
import WorkBentoGrid from "../../components/Work/WorkBentoGrid";
import PlayBentoGridNatural from "../../components/Work/PlayBentoGrid";
import PokemonIntro from "../../components/PokemonIntro/PokemonIntro";
import MarioGame from "../../components/MarioGame/MarioGame";
import "./Home.css";

const HERO_BIO_LINE =
  "Research-led UX work spanning custom residential clients and university digital systems — from comprehension and presentation clarity to navigation, support access, and engagement.";

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

  // Landing: rise-from-baseline for title and bio (same style as Play), start on mount to avoid lag
  useEffect(() => {
    const titleEl = heroTitleRef.current;
    const bioEl = bioRef.current;
    const cat = landingCatRef.current;
    if (!titleEl || !bioEl || !cat) return;

    const titleLines = titleEl.querySelectorAll(".home-hero-line-inner");
    const bioLine = bioEl.querySelector(".home-bio-line-inner");
    if (!titleLines.length || !bioLine) return;

    gsap.set(titleLines, { y: "100%" });
    gsap.set(bioLine, { y: "100%" });

    const navFadeDelay = isDefaultHomePath(location.pathname)
      ? LANDING_NAV_DELAY
      : 0.5;

    const tl = gsap.timeline();
    tl.to(titleLines, {
      y: 0,
      duration: LANDING_FADE_DURATION,
      ease: LANDING_EASE,
    })
      .to(
        bioLine,
        {
          y: 0,
          duration: LANDING_FADE_DURATION,
          ease: LANDING_EASE,
        },
        "-=0.2",
      )
      .to(
        cat,
        {
          opacity: 1,
          y: 0,
          duration: LANDING_NAV_DURATION,
          ease: LANDING_EASE,
        },
        navFadeDelay,
      );

    return () => tl.kill();
  }, [location.pathname]);

  const workSection = (
    <section id="work" className="home-work">
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

  const playSection = (
    <section id="play" className="home-play">
      <div className="home-play-inner page-content-shell">
        <PlayBentoGridNatural
          sectionIntro={
            <div className="home-play-section-intro">
              <h2 className="home-play-title">Playground</h2>
              <p className="home-play-subtitle">
                Side projects I build for fun using Figma and Cursor.
              </p>
            </div>
          }
        />
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
        style={{ backgroundColor: "#fafafa" }}
      >
        <section id="landing" className="home-landing">
          <div className="home-landing-content page-content-shell">
            <div className="home-landing-grid">
              <h1 ref={heroTitleRef} className="home-hero">
                <span className="home-hero-line">
                  <span className="home-hero-line-inner">
                    Hi, I am Lakshman, a{" "}
                    <em>UX Researcher and Designer</em>
                  </span>
                </span>
                <span className="home-hero-line">
                  <span className="home-hero-line-inner">
                    turning research into tested, interactive prototypes.
                  </span>
                </span>
              </h1>
              <p ref={bioRef} className="home-bio">
                <span className="home-bio-line">
                  <span className="home-bio-line-inner">
                    {isGoogleCreative ? (
                      <>
                        I love building and experimenting — asking{" "}
                        <strong>'what if?'</strong> through tools, artifacts,
                        and everything in between.
                      </>
                    ) : (
                      HERO_BIO_LINE
                    )}
                  </span>
                </span>
              </p>
              <div ref={landingCatRef} className="home-landing-cat">
                <MarioGame />
              </div>
            </div>
          </div>
        </section>

        {workSection}

        {playSection}

        <Footer />
      </main>
    </>
  );
};

export default Home;
