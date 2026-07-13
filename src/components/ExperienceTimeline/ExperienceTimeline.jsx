import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experiences } from "../../data/experiences";

import TimelineItem from "./TimelineItem";
import "./ExperienceTimeline.css";

gsap.registerPlugin(ScrollTrigger);

const ExperienceTimeline = ({ revealEarlier = false }) => {
  const headerRef = useRef(null);
  const timelineItemRefs = useRef([]);

  // Animate timeline items one by one (scroll-scrubbed)
  useEffect(() => {
    if (!headerRef.current) return;

    let timeline;

    // Wait a bit to ensure refs are populated
    const timeoutId = setTimeout(() => {
      // Filter out null refs
      const validRefs = timelineItemRefs.current.filter((ref) => ref !== null);
      if (validRefs.length === 0) return;

      // Set initial state for all items
      validRefs.forEach((itemRef) => {
        gsap.set(itemRef, {
          opacity: 0,
          y: 30,
        });
      });

      // Force ScrollTrigger refresh to ensure accurate positioning
      ScrollTrigger.refresh();

      // When revealEarlier (e.g. light/sandbox), trigger sooner but keep same scroll range (animation duration)
      const startY = revealEarlier ? "top 98%" : "top 60%";
      const endY = revealEarlier ? "top 10%" : "top 2%";
      timeline = gsap.timeline({
        scrollTrigger: {
          trigger: headerRef.current,
          start: startY,
          end: endY,
          scrub: 1,
        },
      });

      // Add staggered animations to timeline - items appear one by one from top to bottom
      // Calculate total duration based on number of items
      const staggerDelay = 30; // Large delay between each item starting
      const itemDuration = 10; // Long duration for each item animation

      // Animate items in order (first item first, then second, etc.)
      validRefs.forEach((itemRef, index) => {
        const startTime = index * staggerDelay;
        timeline.to(
          itemRef,
          {
            opacity: 1,
            y: 0,
            duration: itemDuration,
            ease: "ease-out",
          },
          startTime, // Position in timeline based on stagger
        );
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (timeline) {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      }
    };
  }, [experiences.length, revealEarlier]);

  return (
    <section
      id="experience-timeline-section"
      className="experience-timeline-section"
    >
      <div className="page-content-shell">
        <header ref={headerRef} className="md:mb-16">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10">
            <h2 className="experience-timeline-title">
              <span className="experience-timeline-title-wrapper">
                <span className="experience-timeline-title-text">
                  <span className="experience-timeline-title-where">Where</span>{" "}
                  <span className="experience-timeline-title-ivebeen">
                    I've been
                  </span>
                </span>
              </span>
            </h2>
          </div>
        </header>

        {/* 
          Timeline Grid: 
          - Column 1: Width determined by the longest date.
          - Column 2: 1px for the vertical line.
          - Column 3: Main content.
          - gap-x-10 (40px) for balanced spacing.
        */}
        <div className="grid grid-cols-1 md:grid-cols-[max-content_1px_1fr] md:gap-x-10">
          {experiences.map((exp, index) => (
            <TimelineItem
              key={exp.id}
              experience={exp}
              ref={(el) => {
                timelineItemRefs.current[index] = el;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceTimeline;
