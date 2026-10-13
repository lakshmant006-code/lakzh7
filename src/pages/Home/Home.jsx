import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { isGoogleCreativePath, isDefaultHomePath } from "../../constants/homeRoutes";
import { useLenisScroll } from "../../hooks/useLenisScroll";
import Footer from "../../components/Footer/Footer";
import WorkBentoGrid from "../../components/Work/WorkBentoGrid";
import PokemonIntro from "../../components/PokemonIntro/PokemonIntro";
import EyeCursor from "../../components/EyeCursor/EyeCursor";
import "./Home.css";

// Full run time of the stitched intro gif (Frame 2 + F4), in ms.
const INTRO_GIF_MS = 11100;
// Black screen lifts over ~9 frames at F4's 90ms cadence.
const INTRO_LIFT_MS = 1400;

const LANDING_FADE_DURATION = 1;
const LANDING_EASE = "power2.out";
// Pixel cat rises in with nav (matches Nav.jsx)
export const LANDING_NAV_DELAY = 0.85;
export const LANDING_NAV_DURATION = 0.7;

// Warm welcome lines for the speech bubble. No hyphens, no dashes.
const WELCOME_LINES = [
  "hello, welcome to my portfolio",
  "i'm Lakshman, a UX designer",
  "i make tricky things simple",
  "i run on curiosity and coffee",
  "glad you're here, stay a while",
];

/** Typewriter that types a line, holds, erases, then moves to the next, looping. */
function Typewriter({ lines, typingSpeed = 55, erasingSpeed = 26, holdTime = 1800 }) {
  const [lineIdx, setLineIdx] = useState(0);
  const [text, setText] = useState("");
  const [mode, setMode] = useState("typing");

  useEffect(() => {
    const full = lines[lineIdx % lines.length];
    let timer;
    if (mode === "typing") {
      if (text.length < full.length) {
        timer = setTimeout(() => setText(full.slice(0, text.length + 1)), typingSpeed);
      } else {
        timer = setTimeout(() => setMode("erasing"), holdTime);
      }
    } else if (text.length > 0) {
      timer = setTimeout(() => setText(full.slice(0, text.length - 1)), erasingSpeed);
    } else {
      setLineIdx((i) => (i + 1) % lines.length);
      setMode("typing");
    }
    return () => clearTimeout(timer);
  }, [text, mode, lineIdx, lines, typingSpeed, erasingSpeed, holdTime]);

  return (
    <>
      <span className="home-type-text">{text}</span>
      <span className="home-type-caret" aria-hidden="true">|</span>
    </>
  );
}

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
  const [introOpen, setIntroOpen] = useState(false);
  const [introLifting, setIntroLifting] = useState(false);
  const [eyeCursor, setEyeCursor] = useState({ visible: false, text: "" });
  const heroTitleRef = useRef(null);
  const bioRef = useRef(null);
  const landingCatRef = useRef(null);
  const workGridRef = useRef(null);

  useEffect(() => {
    setPokemonIntroDone(!isGoogleCreative);
  }, [isGoogleCreative]);

  const closeIntro = () => {
    setIntroOpen(false);
    setIntroLifting(false);
  };

  // Intro overlay: lock scroll and allow Escape. The curtain lift is driven by
  // the video's 'ended' event (so it freezes on the last frame first); this
  // fallback only fires if the video never reports ending.
  useEffect(() => {
    if (!introOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeIntro();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const fallback = setTimeout(() => setIntroLifting(true), INTRO_GIF_MS + 2000);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      clearTimeout(fallback);
    };
  }, [introOpen]);

  // Once the black screen starts lifting, reveal the content when it finishes.
  useEffect(() => {
    if (!introLifting) return;
    const done = setTimeout(() => {
      closeIntro();
      const work = document.getElementById("work");
      if (work) work.scrollIntoView({ behavior: "smooth", block: "start" });
    }, INTRO_LIFT_MS);
    return () => clearTimeout(done);
  }, [introLifting]);

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
      onMouseEnter={() =>
        setEyeCursor({
          visible: true,
          text: "View the case study.",
          img: "/home/eye-cursor.webp",
        })
      }
      onMouseLeave={() => setEyeCursor({ visible: false, text: "" })}
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
        <section id="landing" className="home-landing">
          <div className="home-landing-content page-content-shell">
            <div
              ref={landingCatRef}
              className="home-hero-card"
              role="button"
              tabIndex={0}
              aria-label="Play the intro animation"
              onClick={() => setIntroOpen(true)}
              onMouseEnter={() =>
                setEyeCursor({ visible: true, text: "view", img: "/home/eye-cursor.webp" })
              }
              onMouseLeave={() => setEyeCursor({ visible: false, text: "" })}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setIntroOpen(true);
                }
              }}
            >
              <div className="home-hero-stage">
                <img
                  src="/home/bg-scene.webp"
                  alt="Isometric illustration of a small shop-house with a tree and dog"
                  className="home-layer home-layer-bg"
                />
                <img
                  src="/home/auto.webp"
                  alt=""
                  aria-hidden="true"
                  className="home-layer home-layer-auto"
                />
                <img
                  src="/home/house-front.webp"
                  alt=""
                  aria-hidden="true"
                  className="home-layer home-layer-house"
                />
              </div>
            </div>
          </div>
        </section>

        {workSection}

        <Footer />
      </main>

      {introOpen ? (
        <div
          className={`home-intro-overlay${introLifting ? " home-intro-overlay--lifting" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Intro animation"
          onClick={closeIntro}
        >
          {!introLifting ? (
            <button
              type="button"
              className="home-intro-close"
              aria-label="Skip"
              onClick={closeIntro}
            >
              ×
            </button>
          ) : null}
          <video
            className="home-intro-gif"
            autoPlay
            muted
            playsInline
            onEnded={() => setIntroLifting(true)}
            onClick={(e) => e.stopPropagation()}
          >
            <source src="/home/intro.webm" type="video/webm" />
            <source src="/home/intro.mp4" type="video/mp4" />
          </video>
        </div>
      ) : null}

      <EyeCursor visible={eyeCursor.visible} text={eyeCursor.text} img={eyeCursor.img} />
    </>
  );
};

export default Home;
