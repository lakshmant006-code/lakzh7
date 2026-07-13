import React, { useState, useRef, useEffect, useMemo } from "react";
import { useLenis } from "@studio-freight/react-lenis";
import NaturalPlayBentoItem from "./PlayBentoItem";
import CursorPill from "../CursorPill/CursorPill";
import { playProjects } from "../../data/playProjects";
import {
  preserveScrollAtBottom,
  scheduleScrollTriggerLayoutRefresh,
} from "../../utils/scrollTriggerLayout";
import {
  allPlayPositions,
  getWideSpanLaneColumns,
  groupPlayProjectsByColumn,
  sortPlayProjectsByReadingOrder,
} from "./playGridReadingOrder";
import "./PlayBentoGrid.css";

// Match grid breakpoint: below 1024px = tablet/mobile (poster only, no video)
const POSTER_ONLY_MEDIA = "(max-width: 1023px)";
const DESKTOP_LAYOUT_MEDIA = "(min-width: 1024px)";

/**
 * TEMP preview grid: same projects in the same top-to-bottom reading order,
 * but auto-placed in 3 columns with heights driven by media aspect ratio
 * (object-contain, no fixed row tracks).
 */
const PlayBentoGridNatural = ({ onProjectClick, sectionIntro = null }) => {
  const [hoveredCaseStudyId, setHoveredCaseStudyId] = useState(null);
  const [posterOnly, setPosterOnly] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(POSTER_ONLY_MEDIA).matches
      : false,
  );
  const lenis = useLenis();
  const wideSpanRef = useRef(null);
  const spacerHeightCommittedRef = useRef(0);
  const [wideLaneSpacerHeight, setWideLaneSpacerHeight] = useState(0);

  useEffect(() => {
    const mql = window.matchMedia(POSTER_ONLY_MEDIA);
    const handleChange = (e) => setPosterOnly(e.matches);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  const playProjectsInGrid = playProjects.filter(
    (p) => allPlayPositions[p.id],
  );

  const wideAnchorId = useMemo(
    () =>
      playProjectsInGrid.find(
        (p) => (allPlayPositions[p.id]?.colSpan ?? 1) > 1,
      )?.id ?? null,
    [playProjectsInGrid],
  );

  const wideSpanLaneColumns = useMemo(
    () => getWideSpanLaneColumns(allPlayPositions),
    [],
  );

  const wideAnchorRowEnd = wideAnchorId
    ? allPlayPositions[wideAnchorId]?.rowEnd
    : null;

  // Column 2 aligns with column 1 below Block Party: spacer = Block Party offsetHeight;
  // one flex `gap` sits under Block Party (col 1) and between spacer + first card (col 2).
  useEffect(() => {
    const wideEl = wideSpanRef.current;
    if (!wideEl || !wideAnchorId) return;

    let measureRaf = null;

    const measure = () => {
      if (!window.matchMedia(DESKTOP_LAYOUT_MEDIA).matches) {
        spacerHeightCommittedRef.current = 0;
        setWideLaneSpacerHeight(0);
        return;
      }

      // offsetHeight tracks layout box; matches flex column stacking with col 1 Block Party card
      const spacerHeight = Math.round(wideEl.offsetHeight);
      const prev = spacerHeightCommittedRef.current;
      const isFirstSize = prev === 0 && spacerHeight > 0;
      if (
        isFirstSize ||
        (spacerHeight > 0 &&
          prev > 0 &&
          Math.abs(spacerHeight - prev) >= 2)
      ) {
        spacerHeightCommittedRef.current = spacerHeight;
        setWideLaneSpacerHeight(spacerHeight);
        preserveScrollAtBottom(lenis);
        scheduleScrollTriggerLayoutRefresh();
      }
    };

    const scheduleMeasure = () => {
      if (measureRaf != null) cancelAnimationFrame(measureRaf);
      measureRaf = requestAnimationFrame(() => {
        measureRaf = null;
        measure();
      });
    };

    // Layout soon after paint (poster/video intrinsic height settles)
    const id2 = requestAnimationFrame(() =>
      requestAnimationFrame(measure),
    );

    measure();

    const ro = new ResizeObserver(scheduleMeasure);
    ro.observe(wideEl);

    const onWideMediaLoad = () => scheduleMeasure();
    wideEl.addEventListener("load", onWideMediaLoad, true);
    wideEl.addEventListener("loadeddata", onWideMediaLoad, true);
    wideEl.addEventListener("loadedmetadata", onWideMediaLoad, true);

    const desktopMql = window.matchMedia(DESKTOP_LAYOUT_MEDIA);
    desktopMql.addEventListener("change", scheduleMeasure);
    scheduleMeasure();

    return () => {
      cancelAnimationFrame(id2);
      if (measureRaf != null) cancelAnimationFrame(measureRaf);
      ro.disconnect();
      desktopMql.removeEventListener("change", scheduleMeasure);
      wideEl.removeEventListener("load", onWideMediaLoad, true);
      wideEl.removeEventListener("loadeddata", onWideMediaLoad, true);
      wideEl.removeEventListener("loadedmetadata", onWideMediaLoad, true);
      spacerHeightCommittedRef.current = 0;
      setWideLaneSpacerHeight(0);
    };
  }, [wideAnchorId, posterOnly, lenis]);

  const renderItem = (project, itemRef) => {
    const position = allPlayPositions[project.id];
    const wide = (position?.colSpan ?? 1) > 1;

    return (
      <NaturalPlayBentoItem
        key={project.id}
        ref={itemRef}
        project={project}
        onClick={onProjectClick}
        wide={wide}
        posterOnly={posterOnly}
        onMouseEnter={() => {
          if (project.caseStudyRoute) setHoveredCaseStudyId(project.id);
        }}
        onMouseLeave={() => {
          if (project.caseStudyRoute) setHoveredCaseStudyId(null);
        }}
      />
    );
  };

  const projectsByColumn = groupPlayProjectsByColumn(
    playProjectsInGrid,
    allPlayPositions,
  );

  const columnProjects = useMemo(() => {
    const byCol = { 1: [], 2: [], 3: [] };

    for (const col of [1, 2, 3]) {
      const laneCol = wideSpanLaneColumns.has(col);
      const items = projectsByColumn[col];

      if (!laneCol || wideAnchorRowEnd == null) {
        byCol[col] = items;
        continue;
      }

      // In span lanes (col 2 for block party), only show items that start after the wide card’s rows.
      byCol[col] = items.filter((project) => {
        const rowStart = allPlayPositions[project.id]?.rowStart;
        return rowStart == null || rowStart >= wideAnchorRowEnd;
      });
    }

    return byCol;
  }, [projectsByColumn, wideSpanLaneColumns, wideAnchorRowEnd]);

  const mobileStack = sortPlayProjectsByReadingOrder(
    playProjectsInGrid,
    allPlayPositions,
  );

  return (
    <>
      <CursorPill
        isHovering={hoveredCaseStudyId !== null}
        text="View case study"
      />
      {sectionIntro != null ? (
        <div className="home-play-bento-intro-outside">{sectionIntro}</div>
      ) : null}
      <div className="home-play-bento-grid-natural">
        <div className="home-play-bento-grid-natural-mobile">
          {mobileStack.map((project) => renderItem(project))}
        </div>
        <div className="home-play-bento-grid-natural-desktop">
          {[1, 2, 3].map((col) => (
            <div key={col} className="home-play-bento-natural-col">
              {wideSpanLaneColumns.has(col) ? (
                <div
                  className="home-play-bento-wide-span-spacer"
                  style={{ height: wideLaneSpacerHeight }}
                  aria-hidden="true"
                />
              ) : null}
              {columnProjects[col].map((project) =>
                renderItem(
                  project,
                  project.id === wideAnchorId ? wideSpanRef : undefined,
                ),
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PlayBentoGridNatural;
