import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  AWARD_VINYL_PALETTE,
  TOP_ROW_COUNT,
  awards,
  buildAwardRows,
} from "../../data/awards";
import VinylCover from "./VinylCover";
import VinylOverlay from "./VinylOverlay";
import VinylStack from "./VinylStack";
import "./AwardsRack.css";

gsap.registerPlugin(ScrollTrigger);

const ROW_PHASE = {
  WAITING: "waiting",
  REVEALING: "revealing",
  DROPPING: "dropping",
  DONE: "done",
};

const ROW_DROP_MS = 520;

function getVinylIntroState(rowPhase, rowIndex, revealedCount) {
  if (rowPhase === ROW_PHASE.DONE) return "done";
  if (rowPhase === ROW_PHASE.DROPPING) return "dropping";
  if (rowPhase === ROW_PHASE.WAITING) return "hidden";
  if (rowIndex < revealedCount) return "revealed";
  if (rowIndex === revealedCount) return "revealing";
  return "hidden";
}

function AwardsRackTier({
  rowAwards,
  rowStartIndex,
  shouldAnimate,
  skipAnimation,
  onTierComplete,
  selectedAwardId,
  returningAwardId,
  onVinylSelect,
  onOverlayReturnComplete,
}) {
  const tierCompletedRef = useRef(false);
  const [rowPhase, setRowPhase] = useState(() =>
    skipAnimation ? ROW_PHASE.DONE : ROW_PHASE.WAITING,
  );
  const [revealedCount, setRevealedCount] = useState(() =>
    skipAnimation ? rowAwards.length : 0,
  );

  useEffect(() => {
    if (skipAnimation) {
      setRowPhase(ROW_PHASE.DONE);
      setRevealedCount(rowAwards.length);
      if (!tierCompletedRef.current) {
        tierCompletedRef.current = true;
        onTierComplete?.();
      }
      return;
    }

    if (shouldAnimate && rowPhase === ROW_PHASE.WAITING) {
      setRowPhase(ROW_PHASE.REVEALING);
    }
  }, [shouldAnimate, skipAnimation, rowPhase, onTierComplete, rowAwards.length]);

  const handleVinylRevealComplete = useCallback(() => {
    setRevealedCount((count) => {
      const next = count + 1;
      if (next >= rowAwards.length) {
        setRowPhase(ROW_PHASE.DROPPING);
      }
      return next;
    });
  }, [rowAwards.length]);

  const handleRowDropComplete = useCallback(() => {
    if (tierCompletedRef.current) return;
    tierCompletedRef.current = true;
    setRowPhase(ROW_PHASE.DONE);
    onTierComplete?.();
  }, [onTierComplete]);

  useEffect(() => {
    if (rowPhase !== ROW_PHASE.DROPPING) return;

    const id = window.setTimeout(handleRowDropComplete, ROW_DROP_MS);

    return () => window.clearTimeout(id);
  }, [rowPhase, handleRowDropComplete]);

  return (
    <div className="awards-rack-tier">
      <div className="awards-rack-row">
        {rowAwards.map((award, i) => (
          <VinylCover
            key={award.id}
            award={award}
            index={rowStartIndex + i}
            placeholderColor={
              AWARD_VINYL_PALETTE[(rowStartIndex + i) % AWARD_VINYL_PALETTE.length]
            }
            vinylIntroState={getVinylIntroState(rowPhase, i, revealedCount)}
            onVinylRevealComplete={handleVinylRevealComplete}
            onSelect={onVinylSelect}
            isOverlayActive={selectedAwardId === award.id}
            isReturningFromOverlay={returningAwardId === award.id}
            onOverlayReturnComplete={
              returningAwardId === award.id ? onOverlayReturnComplete : undefined
            }
          />
        ))}
      </div>
      <div className="awards-rack-shelf-block" aria-hidden="true">
        <div className="awards-rack-shelf" />
        <div className="awards-rack-shelf-shadow" />
      </div>
    </div>
  );
}

function useMobileVinylStack(breakpoint = 640) {
  const [isMobileStack, setIsMobileStack] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(`(max-width: ${breakpoint}px)`).matches
      : false,
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const update = () => setIsMobileStack(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);

  return isMobileStack;
}

export default function AwardsRack() {
  const sectionRef = useRef(null);
  const isMobileStack = useMobileVinylStack();
  const [introStarted, setIntroStarted] = useState(false);
  const [bottomRowActive, setBottomRowActive] = useState(false);
  const [overlayState, setOverlayState] = useState(null);
  const [returningAwardId, setReturningAwardId] = useState(null);
  const [reducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const { topRow, bottomRow } = useMemo(
    () => buildAwardRows(awards, TOP_ROW_COUNT),
    [],
  );

  const handleTopTierComplete = useCallback(() => setBottomRowActive(true), []);

  const handleVinylSelect = useCallback((award, sourceRects) => {
    const index = awards.findIndex((entry) => entry.id === award.id);
    const placeholderColor =
      AWARD_VINYL_PALETTE[index % AWARD_VINYL_PALETTE.length];

    setReturningAwardId(null);
    setOverlayState({ award, sourceRects, placeholderColor });
  }, []);

  const handleOverlayCloseComplete = useCallback(() => {
    const awardId = overlayState?.award?.id;
    setOverlayState(null);
    if (!awardId) return;

    setReturningAwardId(awardId);
  }, [overlayState]);

  const handleOverlayReturnComplete = useCallback(() => {
    setReturningAwardId(null);
  }, []);

  useEffect(() => {
    if (reducedMotion || isMobileStack || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 82%",
        once: true,
        onEnter: () => setIntroStarted(true),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion, isMobileStack]);

  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="awards-section"
      className="awards-section awards-rack-section"
      aria-label="Awards and certifications"
    >
      <div className="awards-rack-inner">
        {isMobileStack ? (
          <VinylStack
            awards={awards}
            selectedAwardId={overlayState?.award?.id ?? null}
            returningAwardId={returningAwardId}
            onVinylSelect={handleVinylSelect}
            onOverlayReturnComplete={handleOverlayReturnComplete}
          />
        ) : (
          <div className="awards-rack awards-rack--desktop">
            <AwardsRackTier
              rowAwards={topRow}
              rowStartIndex={0}
              shouldAnimate={introStarted}
              skipAnimation={reducedMotion}
              onTierComplete={handleTopTierComplete}
              selectedAwardId={overlayState?.award?.id ?? null}
              returningAwardId={returningAwardId}
              onVinylSelect={handleVinylSelect}
              onOverlayReturnComplete={handleOverlayReturnComplete}
            />
            <AwardsRackTier
              rowAwards={bottomRow}
              rowStartIndex={TOP_ROW_COUNT}
              shouldAnimate={bottomRowActive}
              skipAnimation={reducedMotion}
              selectedAwardId={overlayState?.award?.id ?? null}
              returningAwardId={returningAwardId}
              onVinylSelect={handleVinylSelect}
              onOverlayReturnComplete={handleOverlayReturnComplete}
            />
          </div>
        )}
      </div>

      {overlayState ? (
        <VinylOverlay
          award={overlayState.award}
          sourceRects={overlayState.sourceRects}
          placeholderColor={overlayState.placeholderColor}
          onCloseComplete={handleOverlayCloseComplete}
        />
      ) : null}
    </section>
  );
}
