import { useEffect, useLayoutEffect, useRef, useState } from "react";
import useCardTiltShine from "../../hooks/useCardTiltShine";
import "../../styles/cardTiltShine.css";

const MAX_TILT = 10;
const VINYL_REVEAL_MS = 110;
/** Must allow lifted pose to paint before drop transition (matches hover leave). */
const OVERLAY_RETURN_LIFT_MS = 48;

const INTRO_MOTION = {
  hidden: "intro",
  revealing: "intro-revealing",
  revealed: "intro-revealed",
  dropping: "intro-dropping",
};

export default function VinylCover({
  award,
  index,
  placeholderColor,
  onSelect,
  isOverlayActive,
  isReturningFromOverlay,
  onOverlayReturnComplete,
  vinylIntroState,
  onVinylRevealComplete,
}) {
  const wrapRef = useRef(null);
  const vinylRef = useRef(null);
  const revealDoneRef = useRef(false);
  const motionRef = useRef("idle");
  const [motionState, setMotionState] = useState("idle");
  const [returnPhase, setReturnPhase] = useState(null);

  const { style: tiltStyle, handlers: tiltHandlers, reset: resetTilt } =
    useCardTiltShine(vinylRef, { maxTilt: MAX_TILT });

  const introDone = vinylIntroState === "done";
  const displayMotion = INTRO_MOTION[vinylIntroState] ?? motionState;

  const finishReveal = () => {
    if (revealDoneRef.current || vinylIntroState !== "revealing") return;
    revealDoneRef.current = true;
    onVinylRevealComplete?.();
  };

  useEffect(() => {
    revealDoneRef.current = false;
    if (vinylIntroState !== "revealing") return;

    const id = window.setTimeout(finishReveal, VINYL_REVEAL_MS);
    return () => window.clearTimeout(id);
  }, [vinylIntroState]);

  const setMotion = (next) => {
    motionRef.current = next;
    setMotionState(next);
  };

  const handlePointerEnter = (e) => {
    if (!introDone || isOverlayActive || isReturningFromOverlay) return;
    if (motionRef.current === "dropping") return;
    setMotion("lifted");
    tiltHandlers.onPointerEnter(e);
  };

  const handlePointerMove = (e) => {
    if (!introDone || isOverlayActive || isReturningFromOverlay) return;
    if (motionRef.current !== "lifted") return;
    tiltHandlers.onPointerMove(e);
  };

  const handlePointerLeave = () => {
    if (!introDone || isOverlayActive || isReturningFromOverlay) return;
    if (motionRef.current !== "lifted") return;
    resetTilt();
    setMotion("dropping");
  };

  const handleTransitionEnd = (e) => {
    if (vinylIntroState === "revealing" && e.propertyName === "opacity") {
      finishReveal();
      return;
    }

    if (e.target !== e.currentTarget) return;
    if (e.propertyName !== "transform") return;

    if (isReturningFromOverlay && returnPhase === "drop") {
      setReturnPhase(null);
      setMotion("idle");
      onOverlayReturnComplete?.();
      return;
    }

    if (motionRef.current !== "dropping") return;

    setMotion("idle");
  };

  const handleClick = (e) => {
    if (!introDone || isOverlayActive || isReturningFromOverlay) return;
    const shelfRect = wrapRef.current?.getBoundingClientRect();
    const liftedRect = e.currentTarget.getBoundingClientRect();
    if (!shelfRect || !liftedRect) return;
    onSelect?.(award, { shelf: shelfRect, lifted: liftedRect });
  };

  useLayoutEffect(() => {
    if (!isReturningFromOverlay) {
      setReturnPhase(null);
      return;
    }

    resetTilt();
    setReturnPhase("lift");

    const el = vinylRef.current;
    if (el) void el.getBoundingClientRect();

    const dropTimer = window.setTimeout(() => {
      setReturnPhase("drop");
    }, OVERLAY_RETURN_LIFT_MS);

    return () => window.clearTimeout(dropTimer);
  }, [isReturningFromOverlay, resetTilt]);

  const label = `${award.title}, ${award.organization}, ${award.year}`;

  const wrapMotion = isOverlayActive
    ? "overlay-hidden"
    : isReturningFromOverlay
      ? returnPhase === "drop"
        ? "dropping"
        : "overlay-return-lift"
      : displayMotion;

  return (
    <div
      ref={wrapRef}
      className="awards-vinyl-wrap"
      data-motion={wrapMotion}
      data-award-id={award.id}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <span className="awards-vinyl-shadow" aria-hidden="true">
        <span className="awards-vinyl-shadow-base" />
        <span className="awards-vinyl-shadow-float" />
      </span>
      <button
        ref={vinylRef}
        type="button"
        className="awards-vinyl"
        style={{
          ...tiltStyle,
          "--vinyl-placeholder-bg": placeholderColor,
        }}
        aria-label={label}
        aria-hidden={!introDone ? true : undefined}
        tabIndex={introDone ? 0 : -1}
        onTransitionEnd={handleTransitionEnd}
        onClick={handleClick}
      >
        <span className="awards-vinyl-shadow-side" aria-hidden="true" />
        <span className="awards-vinyl-face">
          {award.vinylImage ? (
            <img className="awards-vinyl-image" src={award.vinylImage} alt="" />
          ) : (
            <span className="awards-vinyl-placeholder" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
          <span className="card-tilt-shine__glare" aria-hidden="true" />
        </span>
      </button>
    </div>
  );
}
