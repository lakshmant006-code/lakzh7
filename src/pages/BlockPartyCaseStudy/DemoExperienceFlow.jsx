import { useCallback, useEffect, useRef, useState } from "react";
import {
  getStageBlurbs,
  useDetailCopyMinHeight,
} from "../../hooks/useDetailCopyMinHeight";
import "./DemoExperienceFlow.css";

const VIDEO_BASE = "/projects/block-party";

export const DEMO_EXPERIENCE_STAGES = [
  {
    id: "start",
    title: "Stage 1",
    durationMs: 11000,
    src: `${VIDEO_BASE}/start.mp4`,
    blurb:
      "Participants start with the act of making, of creating on the Lite Brite.",
  },
  {
    id: "mid",
    title: "Stage 2",
    durationMs: 32000,
    src: `${VIDEO_BASE}/mid.mp4`,
    blurb: [
      "An image of the completed creation is captured and sent to Gemini. While AI is working behind the scenes, participants see a particle canvas slowly forming loose shapes.",
      <>
        The shapes you see aren&apos;t random — they&apos;re pulled from what
        Gemini has already captured about your creation. Its mood. Its traits.
        Its <em>essence</em>.
      </>,
      "And then, your character is revealed. A version of you steps into this digital world, finding its place among everyone who came before it.",
    ],
  },
  {
    id: "end",
    title: "Stage 3",
    durationMs: 7000,
    src: `${VIDEO_BASE}/end.mp4`,
    blurb: [
      "Participants can then pull up the digital archive on any device, find their collectible character card, see what everyone else created, and save an image of their card to their device.",
      <>
        View all previously created characters:{" "}
        <a
          href="https://block-party-thesis.vercel.app/sprites"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://block-party-thesis.vercel.app/sprites
        </a>
      </>,
    ],
  },
];

const TOTAL_DURATION_MS = DEMO_EXPERIENCE_STAGES.reduce(
  (sum, stage) => sum + stage.durationMs,
  0,
);

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

function getStageDurationSec(video, stage) {
  if (video && Number.isFinite(video.duration) && video.duration > 0) {
    return video.duration;
  }
  return (stage?.durationMs ?? 1) / 1000;
}

export default function DemoExperienceFlow({
  stages = DEMO_EXPERIENCE_STAGES,
  className = "",
}) {
  const videoRefs = useRef([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [mediaAspect, setMediaAspect] = useState(null);

  const activeStage = stages[activeIndex] ?? stages[0];

  const handleVideoMetadata = useCallback((index) => {
    setMediaAspect((current) => {
      if (current) {
        return current;
      }

      const video = videoRefs.current[index];
      if (!video?.videoWidth || !video?.videoHeight) {
        return current;
      }

      const { videoWidth, videoHeight } = video;
      return {
        aspectRatio: `${videoWidth} / ${videoHeight}`,
        maxWidth: `calc(var(--demo-flow-max-height) * ${videoWidth} / ${videoHeight})`,
      };
    });
  }, []);

  const pauseAllVideos = useCallback(() => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.pause();
      }
    });
  }, []);

  const playVideoAtIndex = useCallback(async (index) => {
    const video = videoRefs.current[index];
    if (!video) {
      return;
    }

    try {
      await video.play();
    } catch {
      /* autoplay policies may block until user gesture */
    }
  }, []);

  const applyVideoTime = useCallback(
    (index, ratio, { showFrame = false } = {}) => {
      const video = videoRefs.current[index];
      const stage = stages[index];
      if (!video || !stage) {
        return;
      }

      const setTime = () => {
        const durationSec = getStageDurationSec(video, stage);
        const clampedRatio = Math.max(0, Math.min(1, ratio));
        const targetTime = clampedRatio * durationSec;
        video.currentTime = Math.min(
          Math.max(targetTime, 0),
          Math.max(durationSec - 0.001, 0),
        );

        if (showFrame && video.paused) {
          void video.play().then(() => {
            video.pause();
          });
        }
      };

      if (video.readyState >= 1) {
        setTime();
      } else {
        video.addEventListener("loadedmetadata", setTime, { once: true });
      }
    },
    [stages],
  );

  const seekToStage = useCallback(
    (index, ratio = 0, { autoplay = false } = {}) => {
      const clampedRatio = Math.max(0, Math.min(1, ratio));

      pauseAllVideos();
      setActiveIndex(index);
      setProgress(clampedRatio);
      setIsPlaying(autoplay && !reduceMotion);
      applyVideoTime(index, clampedRatio, { showFrame: !autoplay });
    },
    [applyVideoTime, pauseAllVideos, reduceMotion],
  );

  const advanceToNextStage = useCallback(() => {
    const nextIndex = (activeIndex + 1) % stages.length;
    seekToStage(nextIndex, 0, { autoplay: isPlaying && !reduceMotion });
  }, [activeIndex, isPlaying, reduceMotion, seekToStage, stages.length]);

  const handlePillSeek = useCallback(
    (event, index) => {
      const pill = event.currentTarget;
      const rect = pill.getBoundingClientRect();
      const ratio = Math.max(
        0,
        Math.min(1, (event.clientX - rect.left) / rect.width),
      );

      seekToStage(index, ratio, { autoplay: false });
    },
    [seekToStage],
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
    const video = videoRefs.current[activeIndex];
    if (!video) {
      return undefined;
    }

    if (isPlaying && !reduceMotion) {
      void playVideoAtIndex(activeIndex);
    } else {
      video.pause();
    }

    return undefined;
  }, [activeIndex, isPlaying, playVideoAtIndex, reduceMotion]);

  useEffect(() => {
    if (!isPlaying || reduceMotion) {
      return undefined;
    }

    let frameId = 0;

    const tick = () => {
      const video = videoRefs.current[activeIndex];
      if (video) {
        const durationSec = getStageDurationSec(video, stages[activeIndex]);
        const nextProgress = Math.min(video.currentTime / durationSec, 1);

        setProgress((prev) =>
          Math.abs(prev - nextProgress) < 0.0005 ? prev : nextProgress,
        );
      }

      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [activeIndex, isPlaying, reduceMotion, stages]);

  const handleVideoEnded = useCallback(
    (index) => {
      if (index !== activeIndex || !isPlaying || reduceMotion) {
        return;
      }

      setProgress(1);
      advanceToNextStage();
    },
    [activeIndex, advanceToNextStage, isPlaying, reduceMotion],
  );

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
    <div className={`demo-flow${className ? ` ${className}` : ""}`}>
      <div
        className="demo-flow__media"
        style={
          mediaAspect
            ? {
                "--demo-flow-aspect-ratio": mediaAspect.aspectRatio,
                "--demo-flow-media-max-width": mediaAspect.maxWidth,
              }
            : undefined
        }
      >
        <button
          type="button"
          className="demo-flow__media-toggle"
          onClick={handleMediaToggle}
          aria-label={
            isPlaying
              ? "Pause demo experience video"
              : "Play demo experience video"
          }
          aria-pressed={isPlaying}
          disabled={reduceMotion}
        />
        {!isPlaying && !reduceMotion ? (
          <div className="demo-flow__paused-indicator" aria-hidden="true">
            <span className="demo-flow__paused-badge">
              <PauseIcon />
            </span>
          </div>
        ) : null}
        <div className="demo-flow__media-inner">
          {stages.map((stage, index) => {
            const isActive = index === activeIndex;

            return (
              <video
                key={stage.id}
                ref={(node) => {
                  videoRefs.current[index] = node;
                }}
                className={`demo-flow__video${
                  isActive ? " demo-flow__video--active" : ""
                }`}
                src={stage.src}
                muted
                playsInline
                preload="auto"
                aria-hidden={!isActive}
                tabIndex={-1}
                onLoadedMetadata={() => handleVideoMetadata(index)}
                onEnded={() => handleVideoEnded(index)}
              />
            );
          })}
        </div>
      </div>

      <div className="demo-flow__pills">
        <button
          type="button"
          className="demo-flow__play-pause"
          onClick={togglePlayPause}
          aria-label={
            isPlaying ? "Pause demo experience" : "Play demo experience"
          }
          aria-pressed={isPlaying}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>

        <div
          className="demo-flow__pills-track"
          role="tablist"
          aria-label="Demo experience stages"
        >
          {stages.map((stage, index) => {
            const isActive = index === activeIndex;
            const pillProgress = getPillProgress(index);
            const pillFlex = stage.durationMs / TOTAL_DURATION_MS;

            return (
              <button
                key={stage.id}
                type="button"
                role="tab"
                id={`demo-flow-tab-${stage.id}`}
                className={`demo-flow__pill${
                  isActive ? " demo-flow__pill--active" : ""
                }${pillProgress >= 100 ? " demo-flow__pill--complete" : ""}`}
                style={{ flexGrow: pillFlex, flexBasis: 0 }}
                aria-selected={isActive}
                aria-controls="demo-flow-detail"
                aria-label={`${stage.title}, seek within segment`}
                onClick={(event) => handlePillSeek(event, index)}
              >
                <span
                  className="demo-flow__pill-fill"
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
        id="demo-flow-detail"
        className="demo-flow__detail"
        role="tabpanel"
        aria-labelledby={`demo-flow-tab-${activeStage?.id}`}
        aria-live="polite"
      >
        <div
          ref={measureRef}
          className="demo-flow__detail-measure"
          aria-hidden="true"
        >
          {stages.map((stage) => (
            <div
              key={stage.id}
              data-detail-copy-measure
              className="demo-flow__detail-copy"
            >
              {getStageBlurbs(stage).map((paragraph, index) => (
                <p
                  key={index}
                  className="demo-flow__detail-blurb blockparty-story-p"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>
        <div className="demo-flow__detail-header">
          <h4 className="demo-flow__detail-title">
            {activeIndex + 1}. {activeStage?.title}
          </h4>
        </div>
        <div
          className="demo-flow__detail-copy"
          style={
            detailCopyMinHeight > 0
              ? { minHeight: `${detailCopyMinHeight}px` }
              : undefined
          }
        >
          {getStageBlurbs(activeStage).map((paragraph, index) => (
            <p key={index} className="demo-flow__detail-blurb blockparty-story-p">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
