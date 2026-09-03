import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import CursorPill from "../CursorPill/CursorPill";
import "./WorkBentoGrid.css";
import "./WorkBentoItem.css";

// Work projects data (4 case studies only)
// thumbnailImage: used as thumbnail in mobile view instead of video
const workProjects = [
  {
    id: "arcadia-custom-builders",
    title: "Revolution Steel - Construction Workflow Optimisation",
    role: "UX Researcher",
    tags: ["UX Research", "Workflow Design"],
    summary:
      "Work stalled and duplicated at every handoff. One clear workflow gave the steel shop owners, tasks, and visibility — and a 30% faster process.",
    shortSummary: "Work stalled at every handoff — one workflow made it 30% faster.",
    video: "/work/arcadia/arcadia custom.mp4",
    category: "case-study",
  },
  {
    id: "quizai-approval-flow",
    title: "AI Powered Notetaking Application",
    role: "Product Designer",
    tags: [
      "Human Interface Design",
      "UX Research",
      "Data Application",
      "Web Development",
    ],
    summary:
      "Students capture a third of a lecture, then never reopen the notes. QuizAI turns any upload into instant summaries and self-scoring quizzes — so studying actually happens.",
    shortSummary: "Notes pile up; studying doesn't. QuizAI turns uploads into quizzes.",
    video: "/work/quizai/quizai-thumb.mp4",
    liveUrl: "https://quizai.help",
    category: "case-study",
  },
  {
    id: "hiku-bio-smart-wearable",
    title: "Hiku: A Mobile Application for Hiking Enthusiasts",
    role: "UX Researcher, UX Designer",
    tags: ["Mobile", "Outdoor Recreation"],
    summary:
      "Great trails are no fun alone, and gear is a hassle to track down. Hiku connects hikers around shared routes and makes buying or renting outdoor gear effortless.",
    shortSummary: "Trails are better shared — Hiku connects hikers and their gear.",
    video: "/work/Hiku/thumbnail.mp4",
    thumbnailImage: "/work/Hiku/thumbnail-frame.png",
    category: "case-study",
  },
  {
    id: "time-management-pain-detection",
    title: "Time Management: A Productivity Tracking Web App",
    role: "UX Researcher, Full Stack Developer",
    tags: ["UX Research", "Web Development"],
    summary:
      "A company couldn't see where the workday went. A clean tracking dashboard turned scattered hours into clear productivity insights the team could act on.",
    shortSummary: "Where did the workday go? A dashboard makes it visible.",
    video: "/work/time-management/thumbnail.mp4",
    thumbnailImage: "/work/time-management/thumbnail-frame.jpg",
    category: "case-study",
  },
];

const routeMap = {
  "time-management-pain-detection": "/time-management",
  "quizai-approval-flow": "/quizai",
  "hiku-bio-smart-wearable": "/hiku",
  "arcadia-custom-builders": "/arcadia-custom-builders",
};

/** Single work card (full layout on Work page; compact footer on Home) */
function WorkCard({
  project,
  onHoverChange,
  onVideoReady,
  compactLayout = false,
}) {
  const videoRef = useRef(null);
  const readyFired = useRef(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleVideoReady = () => {
    if (readyFired.current) return;
    readyFired.current = true;
    onVideoReady?.();
  };

  const isClickable =
    project.id === "time-management-pain-detection" ||
    project.id === "quizai-approval-flow" ||
    project.id === "hiku-bio-smart-wearable" ||
    project.id === "arcadia-custom-builders";

  const videoSource = project.video;
  const useThumbnailImage = isMobile && project.thumbnailImage;

  useEffect(() => {
    if (useThumbnailImage) {
      handleVideoReady();
    }
  }, [useThumbnailImage]);

  useEffect(() => {
    if (useThumbnailImage || !videoRef.current || !videoSource) return;
    const video = videoRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0 },
    );

    observer.observe(video);
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [videoSource, useThumbnailImage]);

  const cardClassName = compactLayout
    ? "work-bento-item group relative work-bento-item--compact case-study-card block no-underline text-inherit cursor-pointer"
    : "work-bento-item group relative overflow-hidden rounded-[var(--bento-card-radius)] bg-[#1a1a1a] shadow-[0_2px_8px_rgba(0,0,0,0.3)] min-[1026px]:hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition-all duration-300 ease-out h-full min-h-[200px] flex flex-col case-study-card";

  const mediaBlock = (
    <div
      className={`work-bento-image-container${compactLayout ? " work-bento-image-container--compact" : ""}`}
    >
      {useThumbnailImage ? (
        <img
          src={project.thumbnailImage}
          alt={project.title}
          className="work-bento-image"
          loading="lazy"
          onLoad={handleVideoReady}
        />
      ) : videoSource ? (
        <video
          ref={videoRef}
          src={videoSource}
          className="work-bento-image"
          loop
          muted
          playsInline
          preload="none"
          controls={false}
          aria-label={project.title}
          onCanPlay={handleVideoReady}
          onLoadedData={handleVideoReady}
        />
      ) : (
        project.image && (
          <img
            src={project.image}
            alt={project.title}
            className="work-bento-image"
            loading="lazy"
            onLoad={handleVideoReady}
          />
        )
      )}
      {project.liveUrl ? (
        <button
          type="button"
          className="work-bento-live-link"
          aria-label={`Open the ${project.title} live site in a new tab`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.open(project.liveUrl, "_blank", "noopener,noreferrer");
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M7 17L17 7M17 7H9M17 7V15"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ) : null}
      {compactLayout && project.awardLine ? (
        <span className="work-bento-compact-award-pill">
          {project.awardLine}
        </span>
      ) : null}
      {compactLayout && project.tags.length > 0 ? (
        <div className="work-bento-compact-tags">
          {project.tags.map((tag, index) => (
            <span key={index} className="work-bento-compact-tag">
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );

  const content = compactLayout ? (
    <>
      {mediaBlock}
      <div className="work-bento-compact-footer">
        <h3 className="work-bento-compact-title">{project.title}</h3>
        <p className="work-bento-compact-role">{project.role}</p>
      </div>
      {project.shortSummary ? (
        <p className="work-bento-compact-summary">{project.shortSummary}</p>
      ) : null}
    </>
  ) : (
    <>
      {mediaBlock}
      <div
        className={`work-bento-content case-study-visible${
          project.awardLine ? " work-bento-content--with-award" : ""
        }`}
      >
        <h3 className="work-bento-title">{project.title}</h3>
        <p className="work-bento-role">{project.role}</p>
        <div className="work-bento-tags">
          {project.tags.map((tag, index) => (
            <span key={index} className="work-bento-tag">
              {tag}
            </span>
          ))}
        </div>
        <p className="work-bento-summary">{project.summary}</p>
        {project.awardLine ? (
          <p className="work-bento-award-line">{project.awardLine}</p>
        ) : null}
      </div>
    </>
  );

  const hoverProps = {
    onMouseEnter: () => onHoverChange?.(true),
    onMouseLeave: () => onHoverChange?.(false),
  };

  if (isClickable) {
    return (
      <Link
        to={routeMap[project.id]}
        className={cardClassName}
        data-project-id={project.id}
        {...hoverProps}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className={cardClassName} data-project-id={project.id} {...hoverProps}>
      {content}
    </div>
  );
}

/**
 * Simple 2x2 grid (full width) or single column on small devices.
 * Renders the 4 case study cards only. No filters, no play projects.
 */
const WorkBentoGrid = ({
  onHoverChange,
  isHoveringWorkCard: controlledHover,
  gridClassName = "work-bento-grid",
  containerRef,
  onReady,
  compactLayout = false,
}) => {
  const [localHover, setLocalHover] = useState(false);
  const isHovering =
    controlledHover !== undefined ? controlledHover : localHover;
  const handleHover = (hovered) => (onHoverChange ?? setLocalHover)(hovered);

  const readyCountRef = useRef(0);
  const readyCalledRef = useRef(false);

  const fireReady = useCallback(() => {
    if (readyCalledRef.current) return;
    readyCalledRef.current = true;
    onReady?.();
  }, [onReady]);

  const handleVideoReady = useCallback(() => {
    readyCountRef.current += 1;
    if (readyCountRef.current >= workProjects.length) {
      fireReady();
    }
  }, [fireReady]);

  useEffect(() => {
    if (!onReady) return;
    const fallback = setTimeout(fireReady, 3000);
    return () => clearTimeout(fallback);
  }, [onReady, fireReady]);

  return (
    <div ref={containerRef} className={gridClassName} aria-label="Case studies">
      <CursorPill isHovering={isHovering} text="View case study" />
      {workProjects.map((project) => (
        <WorkCard
          key={project.id}
          project={project}
          onHoverChange={handleHover}
          onVideoReady={handleVideoReady}
          compactLayout={compactLayout}
        />
      ))}
    </div>
  );
};

export default WorkBentoGrid;

