import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLenis } from "@studio-freight/react-lenis";
import "./PokemonIntro.css";

const DIALOGUES = [
  "Hey Google Creative!",
  "I heard you're looking for a Creative Technologist...",
];

const TYPE_MS = 40;
const FADE_MS = 500;

/**
 * @param {{ onComplete: () => void }} props
 */
const PokemonIntro = ({ onComplete }) => {
  const lenis = useLenis();
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const typeIntervalRef = useRef(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const fullLine = DIALOGUES[lineIndex];
  const isTyping = charIndex < fullLine.length;
  const displayedText = fullLine.slice(0, charIndex);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    if (lenis) {
      lenis.stop();
    }
    return () => {
      document.body.style.overflow = "";
      if (lenis) {
        lenis.start();
      }
    };
  }, [lenis]);

  useEffect(() => {
    if (isExiting) return;

    setCharIndex(0);
    const full = DIALOGUES[lineIndex];

    if (typeIntervalRef.current) {
      window.clearInterval(typeIntervalRef.current);
      typeIntervalRef.current = null;
    }

    let i = 0;
    typeIntervalRef.current = window.setInterval(() => {
      i += 1;
      setCharIndex(i);
      if (i >= full.length) {
        if (typeIntervalRef.current) {
          window.clearInterval(typeIntervalRef.current);
          typeIntervalRef.current = null;
        }
      }
    }, TYPE_MS);

    return () => {
      if (typeIntervalRef.current) {
        window.clearInterval(typeIntervalRef.current);
        typeIntervalRef.current = null;
      }
    };
  }, [lineIndex, isExiting]);

  const finishTypingCurrentLine = useCallback(() => {
    if (typeIntervalRef.current) {
      window.clearInterval(typeIntervalRef.current);
      typeIntervalRef.current = null;
    }
    setCharIndex(DIALOGUES[lineIndex].length);
  }, [lineIndex]);

  const goToNextOrExit = useCallback(() => {
    if (lineIndex < DIALOGUES.length - 1) {
      setLineIndex((i) => i + 1);
      setCharIndex(0);
      return;
    }
    setIsExiting(true);
    setOverlayVisible(false);
    window.setTimeout(() => {
      onCompleteRef.current?.();
    }, FADE_MS);
  }, [lineIndex]);

  const handleAdvance = useCallback(() => {
    if (isExiting) return;
    const full = DIALOGUES[lineIndex];
    if (charIndex < full.length) {
      finishTypingCurrentLine();
      return;
    }
    goToNextOrExit();
  }, [charIndex, lineIndex, finishTypingCurrentLine, goToNextOrExit, isExiting]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (isExiting) return;
      if (
        e.code === "Space" ||
        e.key === " " ||
        e.key === "Enter" ||
        e.key === "ArrowDown"
      ) {
        e.preventDefault();
        handleAdvance();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleAdvance, isExiting]);

  return (
    <div
      className={`pokemon-intro-overlay${!overlayVisible ? " pokemon-intro-overlay--hidden" : ""}`}
      style={{ opacity: overlayVisible ? 1 : 0 }}
      role="presentation"
    >
      <div
        className="dialogue-box"
        role="dialog"
        aria-live="polite"
        aria-label="Introduction"
      >
        <div className="dialogue-text-column">
          <p className="dialogue-line dialogue-line--measure" aria-hidden="true">
            {fullLine}
          </p>
          <p className="dialogue-line dialogue-line--typed">{displayedText}</p>
        </div>
        <div className="dialogue-arrow-row">
          <button
            type="button"
            className="dialogue-arrow-button"
            aria-label={
              isTyping ? "Skip to end of line or continue" : "Continue"
            }
            onClick={(e) => {
              e.stopPropagation();
              handleAdvance();
            }}
            disabled={isExiting}
            tabIndex={isExiting ? -1 : 0}
          >
            <span className="arrow" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PokemonIntro;
