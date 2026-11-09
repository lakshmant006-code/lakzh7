import React, { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import DudeAsk from "../DudeAsk/DudeAsk";
import { createHotspotDetector } from "../../utils/heroHotspots";
import { playSoundOnClick } from "../../utils/uiSounds";
import "../../pages/Home/Home.css";

/* The illustrated shop-house with everything it does: the clouds drift, the typed greeting, the auto honks, the dog woofs and the
   person answers questions when you click them. It is used on the Work page and on the About page. */
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


const HomeHero = forwardRef(function HomeHero(_, outerRef) {
  const [askOpen, setAskOpen] = useState(false);
  const landingCatRef = useRef(null);
  const hotspotsRef = useRef(null);
  const setRefs = useCallback((node) => {                       // the page that uses it can also hold the card (for its own fade-in)
    landingCatRef.current = node;
    if (typeof outerRef === "function") outerRef(node); else if (outerRef) outerRef.current = node;
  }, [outerRef]);

  // Click targets in the house illustration: the auto honks, the dog woofs,
  // the person answers questions. Anywhere else does nothing.
  const heroSpots = () => {
    if (!hotspotsRef.current && landingCatRef.current) {
      hotspotsRef.current = createHotspotDetector(landingCatRef.current);
    }
    return hotspotsRef.current;
  };
  // Read the layers up front so the very first click or tap already works.
  useEffect(() => {
    const t = setTimeout(() => heroSpots()?.warm(), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleHeroClick = (e) => {
    if (e.target.closest(".dude-ask")) return;
    const spot = heroSpots()?.detect(e.clientX, e.clientY);
    if (spot === "auto") playSoundOnClick("horn");
    else if (spot === "dog") playSoundOnClick("woof");
    else if (spot === "dude") setAskOpen(true);
  };


  return (
            <div
              ref={setRefs}
              className="home-hero-card"
              role="group"
              aria-label="Illustration: click the auto, the dog or the person"
              data-sound="off"
              onClick={handleHeroClick}
              onMouseEnter={() => heroSpots()?.warm()}
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
                <img
                  src="/home/character.webp"
                  alt="A person sitting outside the shop working on a laptop"
                  className="home-layer home-layer-character"
                />
                <div className="home-hero-clouds" aria-hidden="true">
                  <div className="home-hero-clouds-track">
                    <img src="/home/clouds-strip.webp" alt="" className="home-clouds-copy" />
                    <img src="/home/clouds-strip.webp" alt="" className="home-clouds-copy" />
                  </div>
                </div>
                {askOpen ? (
                  <DudeAsk onClose={() => setAskOpen(false)} />
                ) : (
                  <p className="home-hero-caption">
                    <span>
                      <Typewriter lines={WELCOME_LINES} />
                    </span>
                  </p>
                )}
              </div>
            </div>
  );
});

export default HomeHero;
