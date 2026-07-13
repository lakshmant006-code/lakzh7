import { useEffect, useMemo, useState } from "react";
import { useLenis } from "@studio-freight/react-lenis";
import { CASE_STUDY_SCROLL_OFFSET } from "../constants/caseStudyScroll";

export function useScrollSpy(sectionIds) {
  const lenis = useLenis();
  const sectionKey = sectionIds.join("|");
  const stableSectionIds = useMemo(() => sectionIds, [sectionKey]);
  const [activeId, setActiveId] = useState(stableSectionIds[0] ?? null);

  useEffect(() => {
    if (!stableSectionIds.length) return;

    let rafId = null;

    const updateActiveSection = () => {
      if (rafId != null) return;

      rafId = requestAnimationFrame(() => {
        rafId = null;

        let currentId = stableSectionIds[0];

        for (const id of stableSectionIds) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= CASE_STUDY_SCROLL_OFFSET) {
            currentId = id;
          }
        }

        setActiveId((prev) => (prev === currentId ? prev : currentId));
      });
    };

    updateActiveSection();

    if (lenis) {
      lenis.on("scroll", updateActiveSection);
      return () => {
        if (rafId != null) cancelAnimationFrame(rafId);
        lenis.off("scroll", updateActiveSection);
      };
    }

    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [lenis, stableSectionIds]);

  return activeId;
}
