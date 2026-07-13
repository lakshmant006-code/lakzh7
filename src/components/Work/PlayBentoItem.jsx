import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ExternalLink,
  Github,
  Play,
  Maximize2,
  Code2,
  FileText,
  GraduationCap,
} from "lucide-react";

const FigmaIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
    <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
    <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" />
    <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" />
    <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" />
  </svg>
);

const XIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const actionConfig = {
  live: {
    icon: ExternalLink,
    color: "text-blue-500",
    hoverBg: "hover:bg-blue-50",
  },
  github: {
    icon: Github,
    color: "text-gray-700",
    hoverBg: "hover:bg-gray-100",
  },
  video: {
    icon: Play,
    color: "text-red-500",
    hoverBg: "hover:bg-red-50",
  },
  interactive: {
    icon: Maximize2,
    color: "text-purple-500",
    hoverBg: "hover:bg-purple-50",
  },
  sketch: {
    icon: Code2,
    color: "text-green-500",
    hoverBg: "hover:bg-green-50",
  },
  notion: {
    icon: FileText,
    color: "text-orange-500",
    hoverBg: "hover:bg-orange-50",
  },
  thesis: {
    icon: GraduationCap,
    color: "text-violet-600",
    hoverBg: "hover:bg-violet-50",
  },
  figma: {
    icon: FigmaIcon,
    color: "text-pink-500",
    hoverBg: "hover:bg-pink-50",
  },
  X: {
    icon: XIcon,
    color: "text-black",
    hoverBg: "hover:bg-gray-100",
  },
};

const NaturalPlayBentoItem = React.forwardRef(function NaturalPlayBentoItem(
  {
    project,
    onClick,
    wide = false,
    posterOnly = false,
    onMouseEnter,
    onMouseLeave,
  },
  forwardedRef,
) {
  const {
    id,
    theme = "white",
    tags,
    actions,
    media,
    caseStudyRoute,
  } = project;
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const posterImgRef = useRef(null);
  const iframeObserverTargetRef = useRef(null);

  const isBlack = theme === "black";
  const hasVideo = media?.video;
  const hasPoster = hasVideo && media?.poster;
  const hasImage = media?.image || media?.thumbnail;
  const hasIframe = media?.iframe;
  const showVideoBlock = hasVideo && !posterOnly;
  const posterOnlyImage =
    posterOnly && hasVideo && (media?.poster || media?.thumbnail);
  const hasMedia = showVideoBlock || hasIframe || hasImage || !!posterOnlyImage;
  const disableHover = id === "draw-canvas";
  const lqip = media?.lqip ?? null;

  const setMediaLoadedDeferred = useCallback(() => {
    requestAnimationFrame(() => setIsMediaLoaded(true));
  }, []);

  const handleCardClick = useCallback(
    (e) => {
      if (caseStudyRoute || hasIframe) return;
      onClick?.(project);
    },
    [caseStudyRoute, hasIframe, onClick, project],
  );

  useEffect(() => {
    if (!posterOnly) return;
    const imgEl = posterImgRef.current;
    if (!imgEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        const src = imgEl.dataset.src;
        if (!src) {
          setMediaLoadedDeferred();
          observer.disconnect();
          return;
        }
        imgEl.src = src;
        imgEl
          .decode()
          .then(() => setMediaLoadedDeferred())
          .catch(() => setMediaLoadedDeferred());
        observer.disconnect();
      },
      { rootMargin: "1200px", threshold: 0 },
    );

    observer.observe(imgEl);
    return () => observer.disconnect();
  }, [posterOnly, setMediaLoadedDeferred]);

  useEffect(() => {
    if (posterOnly || !showVideoBlock || !media?.video) return;
    const container = videoContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = videoRef.current;
          if (!video) return;

          if (entry.isIntersecting) {
            if (video.dataset.src && !video.src) {
              video.src = video.dataset.src;
              video.load();
            }
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0 },
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      videoRef.current?.pause();
    };
  }, [posterOnly, showVideoBlock, media?.video]);

  useEffect(() => {
    if (!hasIframe) return;
    if (iframeReady) return;
    const target = iframeObserverTargetRef.current;
    if (!target) return;

    const isMobile = window.innerWidth <= 768;
    const rootMargin = isMobile ? "150px" : "250px";

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIframeReady(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin, threshold: 0 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasIframe, iframeReady]);

  const itemClassName = [
    "natural-play-bento-item group",
    isBlack ? "natural-play-bento-item--black" : "",
    hasIframe || disableHover ? "natural-play-bento-item--no-hover" : "",
    hasIframe ? "natural-play-bento-item--iframe" : "",
    wide ? "natural-play-bento-item--wide" : "",
    caseStudyRoute ? "block no-underline text-inherit cursor-pointer" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const CardWrapper = caseStudyRoute ? Link : "div";
  const wrapperProps = caseStudyRoute
    ? {
        className: itemClassName,
        to: caseStudyRoute,
        onMouseEnter,
        onMouseLeave,
        "data-play-project-id": id,
      }
    : {
        className: itemClassName,
        onClick: handleCardClick,
        onMouseEnter,
        onMouseLeave,
        "data-play-project-id": id,
      };

  const mediaOpacity = isMediaLoaded || !hasMedia ? 1 : 0;

  return (
    <CardWrapper ref={forwardedRef} {...wrapperProps}>
      <div className="natural-play-bento-media" ref={videoContainerRef}>
        {lqip && !isMediaLoaded && (
          <img
            className="natural-play-bento-lqip-inline"
            src={lqip}
            alt=""
            aria-hidden="true"
          />
        )}

        <div
          className="natural-play-bento-media-layer"
          style={{ opacity: mediaOpacity }}
        >
          {showVideoBlock && (
            <div className="natural-play-bento-media-stack">
              <video
                ref={videoRef}
                data-src={media.video}
                poster={hasPoster ? media.poster : undefined}
                loop
                muted
                playsInline
                preload="none"
                onCanPlay={setMediaLoadedDeferred}
                onLoadedData={setMediaLoadedDeferred}
                className="natural-play-bento-media-video"
              />
            </div>
          )}

          {!showVideoBlock && hasIframe && (
            <div className="natural-play-bento-iframe-wrap">
              {iframeReady ? (
                <iframe
                  src={media.iframe}
                  title=""
                  onLoad={setMediaLoadedDeferred}
                />
              ) : (
                <div
                  ref={iframeObserverTargetRef}
                  className="natural-play-bento-iframe-placeholder"
                  aria-hidden="true"
                />
              )}
            </div>
          )}

          {!showVideoBlock && !hasIframe && (hasImage || posterOnlyImage) && (
            <img
              ref={posterImgRef}
              className="natural-play-bento-media-static"
              {...(posterOnly
                ? {
                    "data-src":
                      media.image || media.thumbnail || media.poster,
                  }
                : {
                    src: media.image || media.thumbnail || media.poster,
                  })}
              alt=""
              decoding="async"
              onLoad={setMediaLoadedDeferred}
            />
          )}
        </div>
      </div>

      <div
        className={`
          absolute bottom-4 left-4 flex flex-wrap gap-2 z-10
          transition-all duration-300
          max-[1023px]:opacity-100 max-[1023px]:translate-y-0
          min-[1024px]:opacity-0 min-[1024px]:translate-y-2
          min-[1024px]:group-hover:opacity-100 min-[1024px]:group-hover:translate-y-0
        `}
      >
        {tags.slice(0, 3).map((tag, index) => (
          <span
            key={index}
            className={`
              px-3 py-1.5 rounded-[var(--bento-card-radius)]
              text-xs font-medium shadow-sm transition-all duration-200 cursor-default
              ${
                isBlack
                  ? "bg-white text-gray-800 border border-gray-200"
                  : "bg-white text-gray-700 border border-gray-300"
              }
            `}
          >
            {tag}
          </span>
        ))}
      </div>

      <div
        className={`
          absolute top-4 right-4 flex gap-2 z-10
          transition-all duration-300
          max-[1023px]:opacity-100 max-[1023px]:translate-y-0
          min-[1024px]:opacity-0 min-[1024px]:-translate-y-2
          min-[1024px]:group-hover:opacity-100 min-[1024px]:group-hover:translate-y-0
        `}
      >
        {actions.map((action, index) => {
          const config = actionConfig[action.type];
          if (!config) return null;
          const IconComponent = config.icon;

          return (
            <button
              key={index}
              type="button"
              className={`
                p-2.5 rounded-full bg-white shadow-md border border-gray-100
                ${config.color} ${config.hoverBg}
                transition-all duration-200 hover:scale-110 cursor-pointer
              `}
              onClick={(e) => {
                e.stopPropagation();
                if (action.url) {
                  window.open(action.url, "_blank", "noopener,noreferrer");
                }
              }}
              title={action.tooltip}
            >
              <IconComponent size={16} />
            </button>
          );
        })}
      </div>
    </CardWrapper>
  );
});

NaturalPlayBentoItem.displayName = "NaturalPlayBentoItem";

export default NaturalPlayBentoItem;
