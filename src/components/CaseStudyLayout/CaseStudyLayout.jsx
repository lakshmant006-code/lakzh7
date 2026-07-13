import React, { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { caseStudyNavConfig } from "../../data/caseStudyNavConfig";
import { CASE_STUDY_SCROLL_OFFSET } from "../../constants/caseStudyScroll";
import { useLenisScroll } from "../../hooks/useLenisScroll";
import { usePinnedSpyNav } from "../../hooks/usePinnedSpyNav";
import { useScrollSpy } from "../../hooks/useScrollSpy";
import BlockPartySpyNavSprite from "../../pages/BlockPartyCaseStudy/BlockPartySpyNavSprite";
import "./CaseStudyLayout.css";

function CaseStudySpyNav({
  sections,
  accentColor,
  slotRef,
  mainRef,
  projectId,
}) {
  const navRef = useRef(null);
  const trackRef = useRef(null);
  const listRef = useRef(null);
  const linkRefs = useRef([]);
  const settleTimerRef = useRef(null);
  const sectionIds = sections.map((section) => section.id);
  const activeId = useScrollSpy(sectionIds);
  const { lenis, scrollToTop, scrollToElement } = useLenisScroll();
  const { pinStyle, atBottom } = usePinnedSpyNav(slotRef, mainRef, navRef);
  const isBlockParty = projectId === "blockparty";

  useEffect(() => {
    return () => window.clearTimeout(settleTimerRef.current);
  }, []);

  const handleClick = (id, index) => {
    window.clearTimeout(settleTimerRef.current);

    if (index === 0) {
      scrollToTop({ duration: 1.2, force: true });
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;

    ScrollTrigger.refresh();
    lenis?.resize?.();

    const duration = 1.2;
    scrollToElement(el, {
      offset: -CASE_STUDY_SCROLL_OFFSET,
      duration,
      force: true,
    });

    // Some pages briefly resettle scroll position right as this animation
    // completes (e.g. async layout in embedded iframes), landing past the
    // intended section. Re-verify once settled and snap back if it drifted.
    settleTimerRef.current = window.setTimeout(() => {
      const settledEl = document.getElementById(id);
      if (!settledEl) return;
      const targetY =
        settledEl.getBoundingClientRect().top +
        window.scrollY -
        CASE_STUDY_SCROLL_OFFSET;
      if (Math.abs(window.scrollY - targetY) > 24) {
        if (lenis) {
          lenis.scrollTo(targetY, { immediate: true, force: true });
        } else {
          window.scrollTo({ top: targetY, behavior: "auto" });
        }
      }
    }, duration * 1000 + 200);
  };

  return (
    <div ref={slotRef} className="case-study-spy-nav-slot">
      <div
        ref={navRef}
        className={`case-study-spy-nav${pinStyle ? " is-pinned" : ""}${
          atBottom ? " is-at-bottom" : ""
        }${isBlockParty ? " case-study-spy-nav--blockparty" : ""}`}
        role="navigation"
        aria-label="Case study sections"
        style={{
          "--case-study-spy-accent": accentColor,
          ...pinStyle,
        }}
      >
        <div ref={trackRef} className="case-study-spy-nav__track">
          {isBlockParty ? (
            <BlockPartySpyNavSprite
              activeId={activeId}
              sectionIds={sectionIds}
              linkRefs={linkRefs}
              trackRef={trackRef}
            />
          ) : null}
          <ul ref={listRef} className="case-study-spy-nav__list">
            {sections.map((section, index) => (
              <li
                key={section.id}
                className="case-study-spy-nav__item"
                style={{ "--nav-stagger-index": index }}
              >
                <button
                  ref={(el) => {
                    linkRefs.current[index] = el;
                  }}
                  type="button"
                  className={`case-study-spy-nav__link${
                    activeId === section.id ? " is-active" : ""
                  }`}
                  onClick={() => handleClick(section.id, index)}
                  aria-current={activeId === section.id ? "true" : undefined}
                >
                  {isBlockParty ? (
                    <span
                      className="blockparty-spy-nav__sprite-slot"
                      aria-hidden="true"
                    />
                  ) : (
                    <span
                      className="case-study-spy-nav__dot"
                      aria-hidden="true"
                    />
                  )}
                  <span className="case-study-spy-nav__label">
                    {section.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function CaseStudyLayout({ projectId, children }) {
  const config = caseStudyNavConfig[projectId];
  const mainRef = useRef(null);
  const slotRef = useRef(null);

  if (!config) {
    return children;
  }

  return (
    <div className="case-study-layout">
      <CaseStudySpyNav
        projectId={projectId}
        sections={config.sections}
        accentColor={config.accentColor}
        slotRef={slotRef}
        mainRef={mainRef}
      />
      <div ref={mainRef} className="case-study-layout__main">{children}</div>
    </div>
  );
}
