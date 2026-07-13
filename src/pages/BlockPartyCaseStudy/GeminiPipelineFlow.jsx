import { useCallback, useEffect, useRef, useState } from "react";
import {
  getStageBlurbs,
  useDetailCopyMinHeight,
} from "../../hooks/useDetailCopyMinHeight";
import "./GeminiPipelineFlow.css";

const STAGE_IMAGE_BASE = "/projects/block-party";
const STAGE_DURATION_MS = 6000;

export const GEMINI_PIPELINE_STAGES = [
  {
    id: "what",
    title: "What Is This?",
    model: "Gemini 2.5 Flash",
    blurb:
      "At the start, a photo of the creation is uploaded to Gemini. It identifies what the object is, and figures out what colors were used.",
    images: [
      {
        src: `${STAGE_IMAGE_BASE}/stage1.png`,
        alt: "What Is This? stage output",
      },
    ],
  },
  {
    id: "essence",
    title: "Capturing The Essence",
    model: "Gemini 2.5 Flash",
    blurb: [
      "Gemini uses this blueprint to design a character around it. A hamburger creates a character with golden yellow hair and a sprinkle of sesame seeds on top. A rose creates a character with flowing red hair and a leafy dress.",
      <>
        This is essence.{" "}
        <span className="font-semibold">
          The soul of what was created inspires every visual detail of this new
          character.
        </span>
      </>,
    ],
    images: [
      {
        src: `${STAGE_IMAGE_BASE}/stage2-1.png`,
        alt: "Capturing The Essence stage output 1",
      },
      {
        src: `${STAGE_IMAGE_BASE}/stage2-2.png`,
        alt: "Capturing The Essence stage output 2",
      },
      {
        src: `${STAGE_IMAGE_BASE}/stage2-3.png`,
        alt: "Capturing The Essence stage output 3",
      },
    ],
  },
  {
    id: "first-look",
    title: "First Look",
    model: "Gemini 3.1 Flash (Nano Banana 2)",
    blurb:
      "Gemini then generates a visual preview of this character facing all 4 directions. This then becomes the visual anchor for the character\u2019s animation states.",
    images: [
      { src: `${STAGE_IMAGE_BASE}/stage3.png`, alt: "First Look stage output" },
    ],
  },
  {
    id: "life",
    title: "Bringing It To Life",
    model: "Gemini 3.1 Pro (Nano Banana Pro)",
    blurb:
      "The animation states are Idle, Walk, and a special animation that Gemini decides based on the character. A hamburger character eats. A flower character blooms.",
    images: [
      {
        src: `${STAGE_IMAGE_BASE}/stage4-1.png`,
        alt: "Bringing It To Life stage output 1",
      },
      {
        src: `${STAGE_IMAGE_BASE}/stage4-2.png`,
        alt: "Bringing It To Life stage output 2",
      },
      {
        src: `${STAGE_IMAGE_BASE}/stage4-3.png`,
        alt: "Bringing It To Life stage output 3",
      },
    ],
  },
];

function PlayIcon() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false">
      <path d="M3 1.5 10.5 6 3 10.5Z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false">
      <rect x="2" y="1.5" width="2.5" height="9" fill="currentColor" />
      <rect x="7.5" y="1.5" width="2.5" height="9" fill="currentColor" />
    </svg>
  );
}

function StageVisual({ stage }) {
  const images = stage.images ?? [];

  if (images.length === 0) {
    return null;
  }

  return (
    <div
      className="gemini-flow__media-row"
      data-image-count={images.length}
      data-stage={stage.id}
      aria-label={`${stage.title} outputs`}
    >
      {images.map((image, index) => (
        <img
          key={`${stage.id}-${index}`}
          src={image.src}
          alt={image.alt}
          className="gemini-flow__media-img"
          loading="lazy"
          decoding="async"
        />
      ))}
    </div>
  );
}

export default function GeminiPipelineFlow({
  stages = GEMINI_PIPELINE_STAGES,
  className = "",
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  const elapsedRef = useRef(0);
  const tickStartRef = useRef(performance.now());

  const activeStage = stages[activeIndex] ?? stages[0];

  const resetStageClock = useCallback(() => {
    elapsedRef.current = 0;
    tickStartRef.current = performance.now();
  }, []);

  const handleManualSelect = useCallback(
    (index) => {
      setActiveIndex(index);
      setProgress(0);
      resetStageClock();
      setIsPlaying(false);
    },
    [resetStageClock],
  );

  const togglePlayPause = useCallback(() => {
    setIsPlaying((playing) => !playing);
  }, []);

  const handleMediaToggle = useCallback(() => {
    if (reduceMotion) {
      return;
    }
    togglePlayPause();
  }, [reduceMotion, togglePlayPause]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => {
      const prefersReduced = mediaQuery.matches;
      setReduceMotion(prefersReduced);
      if (prefersReduced) {
        setIsPlaying(false);
      }
    };
    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);
    return () => mediaQuery.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    resetStageClock();
  }, [activeIndex, resetStageClock]);

  useEffect(() => {
    if (reduceMotion || !isPlaying) {
      return undefined;
    }

    if (!stages[activeIndex]) {
      return undefined;
    }

    tickStartRef.current = performance.now();

    let frameId = 0;

    const tick = (now) => {
      const elapsed = elapsedRef.current + (now - tickStartRef.current);
      const stageProgress = Math.min(elapsed / STAGE_DURATION_MS, 1);

      setProgress(stageProgress);

      if (stageProgress >= 1) {
        elapsedRef.current = 0;
        setActiveIndex((current) => (current + 1) % stages.length);
        setProgress(0);
        return;
      }

      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
      elapsedRef.current += performance.now() - tickStartRef.current;
    };
  }, [activeIndex, isPlaying, reduceMotion, stages]);

  const getPillProgress = (index) => {
    if (index < activeIndex) {
      return 100;
    }
    if (index > activeIndex) {
      return 0;
    }
    return progress * 100;
  };

  const { measureRef, minHeight: detailCopyMinHeight } =
    useDetailCopyMinHeight(stages);

  return (
    <div className={`gemini-flow${className ? ` ${className}` : ""}`}>
      <div className="gemini-flow__media">
        <button
          type="button"
          className="gemini-flow__media-toggle"
          onClick={handleMediaToggle}
          aria-label={
            isPlaying ? "Pause pipeline progress" : "Play pipeline progress"
          }
          aria-pressed={isPlaying}
          disabled={reduceMotion}
        />
        {activeStage ? (
          <div key={activeStage.id} className="gemini-flow__media-inner">
            <StageVisual stage={activeStage} />
          </div>
        ) : null}
      </div>

      <div className="gemini-flow__pills">
        <button
          type="button"
          className="gemini-flow__play-pause"
          onClick={togglePlayPause}
          aria-label={
            isPlaying ? "Pause pipeline progress" : "Play pipeline progress"
          }
          aria-pressed={isPlaying}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>

        <div
          className="gemini-flow__pills-track"
          role="tablist"
          aria-label="Gemini pipeline stages"
        >
          {stages.map((stage, index) => {
            const isActive = index === activeIndex;
            const pillProgress = getPillProgress(index);

            return (
              <button
                key={stage.id}
                type="button"
                role="tab"
                id={`gemini-flow-tab-${stage.id}`}
                className={`gemini-flow__pill${
                  isActive ? " gemini-flow__pill--active" : ""
                }${pillProgress >= 100 ? " gemini-flow__pill--complete" : ""}`}
                aria-selected={isActive}
                aria-controls="gemini-flow-detail"
                aria-label={`${index + 1}. ${stage.title}`}
                onClick={() => handleManualSelect(index)}
              >
                <span
                  className="gemini-flow__pill-fill"
                  style={{ width: `${pillProgress}%` }}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>
      </div>

      <div
        key={activeStage?.id}
        id="gemini-flow-detail"
        className="gemini-flow__detail"
        role="tabpanel"
        aria-labelledby={`gemini-flow-tab-${activeStage?.id}`}
        aria-live="polite"
      >
        <div
          ref={measureRef}
          className="gemini-flow__detail-measure"
          aria-hidden="true"
        >
          {stages.map((stage) => (
            <div
              key={stage.id}
              data-detail-copy-measure
              className="gemini-flow__detail-copy"
            >
              {getStageBlurbs(stage).map((paragraph, index) => (
                <p key={index} className="gemini-flow__detail-blurb">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>
        <div className="gemini-flow__detail-header">
          <h4 className="gemini-flow__detail-title">
            {activeIndex + 1}. {activeStage?.title}
          </h4>
          {activeStage?.model ? (
            <span className="gemini-flow__model-tag">{activeStage.model}</span>
          ) : null}
        </div>
        <div
          className="gemini-flow__detail-copy"
          style={
            detailCopyMinHeight > 0
              ? { minHeight: `${detailCopyMinHeight}px` }
              : undefined
          }
        >
          {getStageBlurbs(activeStage).map((paragraph, index) => (
            <p key={index} className="gemini-flow__detail-blurb">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
