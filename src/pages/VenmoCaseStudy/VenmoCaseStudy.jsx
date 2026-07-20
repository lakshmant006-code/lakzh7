import React, { useRef, useMemo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useScrollReset from "../../hooks/useScrollReset";
import { useLenisScroll } from "../../hooks/useLenisScroll";
import { useCountupAnimation } from "../../hooks/useCountupAnimation";
import { useCardUnfurling } from "../../hooks/useCardUnfurling";
import Footer from "../../components/Footer/Footer";
import CursorPill from "../../components/CursorPill/CursorPill";
import CaseStudyLayout from "../../components/CaseStudyLayout/CaseStudyLayout";
import {
  CaseStudyStatement,
  CaseStudyStatementBody,
  CaseStudyStatementHeadline,
} from "../../components/CaseStudyStatement/CaseStudyStatement";
import "./VenmoCaseStudy.css";

gsap.registerPlugin(ScrollTrigger);

const VenmoCaseStudy = () => {
  useScrollReset();
  const [isHoveringSeeNextCard, setIsHoveringSeeNextCard] = useState(false);
  const { scrollToElement } = useLenisScroll();

  const impactSectionRef = useRef(null);
  const metricRefs = useRef([]);

  // Refs for scroll animations
  const contextWhatIsVenmoRef = useRef(null);
  const contextMyRoleRef = useRef(null);
  const contextImpactTitleRef = useRef(null);
  const contextImpactMetricsRefs = useRef([]);
  const contextStatementTitleRef = useRef(null);
  const contextStatementContentRef = useRef(null);
  const contextImageRef = useRef(null);
  const researchTitleRef = useRef(null);
  const researchOverviewSubtitleRef = useRef(null);
  const researchOverviewImageRef = useRef(null);
  const researchFinding1TitleRef = useRef(null);
  const researchFinding1ContentRef = useRef(null);
  const researchFinding1ImageRef = useRef(null);
  const researchFinding2TitleRef = useRef(null);
  const researchFinding2ContentRef = useRef(null);
  const researchFinding2Image1Ref = useRef(null);
  const researchFinding2Image2Ref = useRef(null);
  const researchFinding3TitleRef = useRef(null);
  const researchFinding3ContentRef = useRef(null);
  const researchFinding3ImageRef = useRef(null);
  const solutionTitleRef = useRef(null);
  const solutionOverviewSubtitleRef = useRef(null);
  const solutionOverviewImageRef = useRef(null);
  const solution1TitleRef = useRef(null);
  const solution1ContentRef = useRef(null);
  const solution1VideoRef = useRef(null);
  const solution1CaptionRef = useRef(null);
  const solution2TitleRef = useRef(null);
  const solution2ContentRef = useRef(null);
  const solution2VideoRef = useRef(null);
  const solution2CaptionRef = useRef(null);
  const solution3TitleRef = useRef(null);
  const solution3ContentRef = useRef(null);
  const solution3VideoRef = useRef(null);
  const solution3CaptionRef = useRef(null);
  const takeawaysTitleRef = useRef(null);
  const takeawaysItemsRefs = useRef([]);
  const nextStepsTitleRef = useRef(null);
  const nextStepsItemsRefs = useRef([]);
  const seeNextTitleRef = useRef(null);
  const seeNextGridRef = useRef(null);
  const seeNextCardsRefs = useRef([]);

  // Use card unfurling hook for See Next section
  useCardUnfurling({
    gridRef: seeNextGridRef,
    cardRefs: seeNextCardsRefs,
    options: {
      peekOffset: 40,
      start: "top 70%",
      end: "top 20%",
      minWidth: 768,
      layoutDelay: 100,
    },
  });

  const handleSkipToSolution = () => {
    scrollToElement(document.getElementById("solution-section"), { duration: 1.2 });
  };

  // Countup animation for metrics - memoize to prevent hook re-runs
  const metrics = useMemo(
    () => [
      { value: 100, prefix: "", suffix: "%", elementRef: metricRefs, index: 0 },
      {
        value: 5,
        prefix: "<",
        suffix: " sec",
        elementRef: metricRefs,
        index: 1,
      },
      { value: 75, prefix: "", suffix: "%", elementRef: metricRefs, index: 2 },
    ],
    []
  );

  useCountupAnimation(impactSectionRef, metrics);

  // Scroll-triggered animations for all sections
  useEffect(() => {
    // Match hero section animation exactly: fadeInUp 1s cubic-bezier(0.4, 0, 0.2, 1)
    // Initial: opacity: 0, transform: translateY(30px)
    // Final: opacity: 1, transform: translateY(0)
    const scrollTriggers = [];

    // Helper function to create scroll trigger animation
    const createScrollAnimation = (ref, delay = 0) => {
      if (!ref || !ref.current) return;
      gsap.set(ref.current, { opacity: 0, y: 30 });
      const trigger = ScrollTrigger.create({
        trigger: ref.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(ref.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out", // Close approximation to cubic-bezier(0.4, 0, 0.2, 1)
            delay: delay,
          });
        },
      });
      scrollTriggers.push(trigger);
    };

    // Context Section
    createScrollAnimation(contextWhatIsVenmoRef);
    createScrollAnimation(contextMyRoleRef, 0.1);
    createScrollAnimation(contextImpactTitleRef, 0.2);
    // Impact metrics with stagger
    contextImpactMetricsRefs.current.forEach((ref, index) => {
      if (ref) {
        gsap.set(ref, { opacity: 0, y: 30 });
        const trigger = ScrollTrigger.create({
          trigger: ref,
          start: "top 80%",
          once: true,
          onEnter: () => {
            gsap.to(ref, {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power2.out",
              delay: 0.3 + index * 0.1,
            });
          },
        });
        scrollTriggers.push(trigger);
      }
    });
    createScrollAnimation(contextStatementTitleRef);
    createScrollAnimation(contextStatementContentRef, 0.1);
    createScrollAnimation(contextImageRef, 0.2);

    // Research Section
    createScrollAnimation(researchTitleRef);
    createScrollAnimation(researchOverviewSubtitleRef, 0.1);
    createScrollAnimation(researchOverviewImageRef, 0.2);
    // Finding 1
    createScrollAnimation(researchFinding1TitleRef);
    createScrollAnimation(researchFinding1ContentRef, 0.1);
    createScrollAnimation(researchFinding1ImageRef, 0.2);
    // Finding 2
    createScrollAnimation(researchFinding2TitleRef);
    createScrollAnimation(researchFinding2ContentRef, 0.1);
    createScrollAnimation(researchFinding2Image1Ref, 0.2);
    createScrollAnimation(researchFinding2Image2Ref, 0.3);
    // Finding 3
    createScrollAnimation(researchFinding3TitleRef);
    createScrollAnimation(researchFinding3ContentRef, 0.1);
    createScrollAnimation(researchFinding3ImageRef, 0.2);

    // Solution Section
    createScrollAnimation(solutionTitleRef);
    createScrollAnimation(solutionOverviewSubtitleRef, 0.1);
    createScrollAnimation(solutionOverviewImageRef, 0.2);
    // Solution 1
    createScrollAnimation(solution1TitleRef);
    createScrollAnimation(solution1ContentRef, 0.1);
    createScrollAnimation(solution1VideoRef, 0.2);
    createScrollAnimation(solution1CaptionRef, 0.3);
    // Solution 2
    createScrollAnimation(solution2TitleRef);
    createScrollAnimation(solution2ContentRef, 0.1);
    createScrollAnimation(solution2VideoRef, 0.2);
    createScrollAnimation(solution2CaptionRef, 0.3);
    // Solution 3
    createScrollAnimation(solution3TitleRef);
    createScrollAnimation(solution3ContentRef, 0.1);
    createScrollAnimation(solution3VideoRef, 0.2);
    createScrollAnimation(solution3CaptionRef, 0.3);

    // Takeaways Section
    createScrollAnimation(takeawaysTitleRef);
    takeawaysItemsRefs.current.forEach((ref, index) => {
      if (ref) {
        gsap.set(ref, { opacity: 0, y: 30 });
        const trigger = ScrollTrigger.create({
          trigger: ref,
          start: "top 80%",
          once: true,
          onEnter: () => {
            gsap.to(ref, {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power2.out",
              delay: index * 0.1,
            });
          },
        });
        scrollTriggers.push(trigger);
      }
    });

    // Next Steps Section
    createScrollAnimation(nextStepsTitleRef);
    nextStepsItemsRefs.current.forEach((ref, index) => {
      if (ref) {
        gsap.set(ref, { opacity: 0, y: 30 });
        const trigger = ScrollTrigger.create({
          trigger: ref,
          start: "top 80%",
          once: true,
          onEnter: () => {
            gsap.to(ref, {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power2.out",
              delay: index * 0.1,
            });
          },
        });
        scrollTriggers.push(trigger);
      }
    });

    // See Next Section - Custom unfurling animation
    createScrollAnimation(seeNextTitleRef);

    return () => {
      scrollTriggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="venmo-case-study">
      <CursorPill isHovering={isHoveringSeeNextCard} text="View case study" />
      <CaseStudyLayout projectId="venmo">
      {/* Hero Section */}
      <section className="venmo-hero-section">
        {/* Hero Before Image - Visual welcome */}
        <div className="venmo-hero-image-container venmo-hero-before">
          <img
            src="/work/venmo/hero-before.png"
            alt="Venmo Privacy Controls Redesign"
            className="venmo-hero-image"
          />
        </div>

        {/* Hero Text Content */}
        <div className="venmo-hero-content">
          {/* Left Column */}
          <div className="venmo-hero-left">
            <h1 className="venmo-hero-title">
              Redesigning Venmo's Privacy Controls
            </h1>
            <div className="venmo-hero-details">
              <div className="venmo-hero-detail-item">
                <div className="venmo-hero-detail-label">ROLE</div>
                <div className="venmo-hero-detail-value">Product Designer</div>
              </div>
              <div className="venmo-hero-detail-item">
                <div className="venmo-hero-detail-label">DURATION</div>
                <div className="venmo-hero-detail-value">
                  Aug — Oct 2025 (7 Weeks)
                </div>
              </div>
              <div className="venmo-hero-detail-item">
                <div className="venmo-hero-detail-label">TOOLS</div>
                <div className="venmo-hero-detail-value">Figma, LaTeX</div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="venmo-hero-right">
            <p className="venmo-hero-subtitle">
              Transforming Venmo's public-by-default privacy model to help users
              make informed choices without confusion.
            </p>
            <div className="venmo-hero-tags">
              <span className="venmo-hero-tag">Mobile</span>
              <span className="venmo-hero-tag">User Research</span>
              <span className="venmo-hero-tag">FinTech</span>
            </div>
            <button
              className="venmo-skip-to-solution-btn"
              onClick={handleSkipToSolution}
            >
              <div className="venmo-skip-icon-container">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="venmo-skip-arrow"
                >
                  <path
                    d="M10 5V15M10 15L5 10M10 15L15 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="venmo-skip-text">SKIP TO SOLUTION</span>
            </button>
          </div>
        </div>

        {/* Hero After Image - After all text */}
        <div className="venmo-hero-image-container venmo-hero-after">
          <img
            src="/work/venmo/hero-after.png"
            alt="Venmo Privacy Controls Redesign"
            className="venmo-hero-image"
          />
        </div>
      </section>

      {/* Context Section */}
      <section id="venmo-context" className="venmo-context-section">
        <div className="venmo-context-content">
          {/* Top Row - Two Columns */}
          <div className="venmo-context-top">
            <div className="venmo-context-item" ref={contextWhatIsVenmoRef}>
              <h2 className="venmo-context-title">What is Venmo?</h2>
              <p className="venmo-context-description">
                Venmo is a peer-to-peer payment app with social features that
                defaults to making all transactions public—unlike every other
                major payment app.
              </p>
            </div>
            <div className="venmo-context-item" ref={contextMyRoleRef}>
              <h2 className="venmo-context-title">My Role</h2>
              <p className="venmo-context-description">
                As a product designer, I led user research (6 interviews),
                competitive benchmarking (4 apps), and redesigned Venmo's
                privacy model from paper prototypes to high-fidelity interactive
                mockups.
              </p>
            </div>
          </div>

          {/* Bottom Row - Impact Metrics */}
          <div className="venmo-context-impact" ref={impactSectionRef}>
            <h3 className="venmo-impact-title" ref={contextImpactTitleRef}>
              Impact
            </h3>
            <div className="venmo-impact-metrics">
              <div
                className="venmo-impact-metric"
                ref={(el) => (contextImpactMetricsRefs.current[0] = el)}
              >
                <div
                  className="venmo-impact-value"
                  ref={(el) => (metricRefs.current[0] = el)}
                >
                  100%
                </div>
                <div className="venmo-impact-label">
                  of users make an active privacy choice during onboarding
                </div>
              </div>
              <div
                className="venmo-impact-metric"
                ref={(el) => (contextImpactMetricsRefs.current[1] = el)}
              >
                <div
                  className="venmo-impact-value"
                  ref={(el) => (metricRefs.current[1] = el)}
                >
                  &lt;5 sec
                </div>
                <div className="venmo-impact-label">
                  to find privacy settings (down from 2–3 min)
                </div>
              </div>
              <div
                className="venmo-impact-metric"
                ref={(el) => (contextImpactMetricsRefs.current[2] = el)}
              >
                <div
                  className="venmo-impact-value"
                  ref={(el) => (metricRefs.current[2] = el)}
                >
                  75%
                </div>
                <div className="venmo-impact-label">
                  of competing apps default to private — Venmo was the only outlier
                </div>
              </div>
            </div>
          </div>

          {/* Context Statement Section */}
          <div className="venmo-context-statement">
            <h3
              className="venmo-context-statement-title"
              ref={contextStatementTitleRef}
            >
              CONTEXT
            </h3>
            <CaseStudyStatement ref={contextStatementContentRef}>
              <CaseStudyStatementHeadline>
                Public-by-default settings expose{" "}
                <span className="venmo-accent-text">millions</span> to
                unintended data leaks.
              </CaseStudyStatementHeadline>
              <CaseStudyStatementBody>
                When Biden's Venmo was found through public search in 2021, it
                exposed a flaw affecting <i>10.5%</i> of all transactions.
              </CaseStudyStatementBody>
            </CaseStudyStatement>
            <div
              className="venmo-context-image-container"
              ref={contextImageRef}
            >
              <img
                src="/work/venmo/biden.jpg"
                alt="Biden Venmo privacy issue"
                className="venmo-context-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Research Section */}
      <section id="venmo-research" className="venmo-research-section">
        <div className="venmo-research-content">
          <h3 className="venmo-research-title" ref={researchTitleRef}>
            RESEARCH
          </h3>

          <div className="venmo-research-overview">
            <CaseStudyStatement ref={researchOverviewSubtitleRef}>
              <CaseStudyStatementHeadline as="h4">
                A Two-Part Approach
              </CaseStudyStatementHeadline>
            </CaseStudyStatement>
            <div
              className="venmo-research-image-container"
              ref={researchOverviewImageRef}
            >
              <img
                src="/work/venmo/research-overview.png"
                alt="Research Overview"
                className="venmo-research-image"
              />
            </div>
          </div>

          {/* Key Finding #1 */}
          <div className="venmo-research-finding">
            <h4
              className="venmo-research-finding-title"
              ref={researchFinding1TitleRef}
            >
              Key Finding #1: Industry Outlier
            </h4>
            <CaseStudyStatement ref={researchFinding1ContentRef}>
              <CaseStudyStatementHeadline>
                <span className="venmo-accent-text">75%</span> of competing apps
                default to private.
              </CaseStudyStatementHeadline>
              <CaseStudyStatementBody>
                Venmo is the only app requiring users to manage their
                privacy—everyone else eliminates this mental burden.
              </CaseStudyStatementBody>
            </CaseStudyStatement>
            <div
              className="venmo-research-image-container"
              ref={researchFinding1ImageRef}
            >
              <img
                src="/work/venmo/comparison-matrix.png"
                alt="Comparison Matrix"
                className="venmo-research-image"
              />
            </div>
          </div>

          {/* Key Finding #2 */}
          <div className="venmo-research-finding">
            <h4
              className="venmo-research-finding-title"
              ref={researchFinding2TitleRef}
            >
              Key Finding #2: Users Don't Recall Being Asked About Privacy
            </h4>
            <CaseStudyStatement ref={researchFinding2ContentRef}>
              <CaseStudyStatementHeadline>
                <span className="venmo-accent-text">0 out of 6 users</span>{" "}
                remembered being asked about privacy during signup.
              </CaseStudyStatementHeadline>
              <CaseStudyStatementBody>
                Most assumed their transactions were private by default.
              </CaseStudyStatementBody>
            </CaseStudyStatement>
            <div
              className="venmo-research-image-container"
              ref={researchFinding2Image1Ref}
            >
              <img
                src="/work/venmo/quote-grid.png"
                alt="Quote Grid"
                className="venmo-research-image"
              />
            </div>
            <div
              className="venmo-research-image-container"
              ref={researchFinding2Image2Ref}
            >
              <a
                href="https://viterbischool.usc.edu/news/2022/04/i-know-what-you-did-on-venmo/"
                target="_blank"
                rel="noopener noreferrer"
                className="venmo-research-stat-link"
              >
                <img
                  src="/work/venmo/stat.png"
                  alt="41 million Venmo notes leak sensitive data - USC Viterbi Research"
                  className="venmo-research-image"
                />
              </a>
            </div>
          </div>

          {/* Key Finding #3 */}
          <div className="venmo-research-finding">
            <h4
              className="venmo-research-finding-title"
              ref={researchFinding3TitleRef}
            >
              Key Finding #3: Privacy Controls Are Hard to Find
            </h4>
            <CaseStudyStatement ref={researchFinding3ContentRef}>
              <CaseStudyStatementHeadline>
                Average time to locate settings:{" "}
                <span className="venmo-accent-text">2-3 minutes</span>.
              </CaseStudyStatementHeadline>
              <CaseStudyStatementBody>
                Privacy controls are buried in menus and appear after users
                press "Pay".
              </CaseStudyStatementBody>
            </CaseStudyStatement>
            <div
              className="venmo-research-image-container"
              ref={researchFinding3ImageRef}
            >
              <img
                src="/work/venmo/hidden-controls.png"
                alt="Annotated Current Flow"
                className="venmo-research-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution-section" className="venmo-solution-section">
        <div className="venmo-solution-content">
          <h3 className="venmo-solution-title" ref={solutionTitleRef}>
            SOLUTION
          </h3>

          <div className="venmo-solution-overview">
            <CaseStudyStatement ref={solutionOverviewSubtitleRef}>
              <CaseStudyStatementHeadline as="h4">
                Four Core Principles
              </CaseStudyStatementHeadline>
            </CaseStudyStatement>
            <div
              className="venmo-solution-image-container"
              ref={solutionOverviewImageRef}
            >
              <img
                src="/work/venmo/principle-cards.png"
                alt="Four Core Principles"
                className="venmo-solution-image"
              />
            </div>
          </div>

          {/* Solution #1 */}
          <div className="venmo-solution-item">
            <h4 className="venmo-solution-item-title" ref={solution1TitleRef}>
              Solution #1: Onboarding That Educates
            </h4>
            <CaseStudyStatement ref={solution1ContentRef}>
              <CaseStudyStatementHeadline>
                Users <span className="venmo-accent-text">choose</span> their
                default privacy level before making their first payment.
              </CaseStudyStatementHeadline>
            </CaseStudyStatement>
            <div className="venmo-solution-media">
              <div
                className="venmo-solution-video-container"
                ref={solution1VideoRef}
              >
                <video
                  src="/work/venmo/sol-1.mp4"
                  className="venmo-solution-video"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
              <p className="venmo-solution-caption" ref={solution1CaptionRef}>
                Privacy education during onboarding ensures{" "}
                <span className="venmo-solution-caption-bold">100%</span> of
                users make informed decisions before their first transaction.
              </p>
            </div>
          </div>

          {/* Solution #2 */}
          <div className="venmo-solution-item">
            <h4 className="venmo-solution-item-title" ref={solution2TitleRef}>
              Solution #2: Controls That Appear Early
            </h4>
            <CaseStudyStatement ref={solution2ContentRef}>
              <CaseStudyStatementHeadline>
                Users <span className="venmo-accent-text">set</span> their
                transaction privacy while entering payment details.
              </CaseStudyStatementHeadline>
            </CaseStudyStatement>
            <div className="venmo-solution-media">
              <div
                className="venmo-solution-video-container"
                ref={solution2VideoRef}
              >
                <video
                  src="/work/venmo/sol-2.mp4"
                  className="venmo-solution-video"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
              <p className="venmo-solution-caption" ref={solution2CaptionRef}>
                Privacy controls{" "}
                <span className="venmo-solution-caption-bold">
                  appears before "Pay"
                </span>
                , making it a conscious choice rather than an afterthought.
              </p>
            </div>
          </div>

          {/* Solution #3 */}
          <div className="venmo-solution-item">
            <h4 className="venmo-solution-item-title" ref={solution3TitleRef}>
              Solution #3: Status You Can See
            </h4>
            <CaseStudyStatement ref={solution3ContentRef}>
              <CaseStudyStatementHeadline>
                Users <span className="venmo-accent-text">see</span> their
                privacy setting directly on their profile.
              </CaseStudyStatementHeadline>
            </CaseStudyStatement>
            <div className="venmo-solution-media">
              <div
                className="venmo-solution-video-container"
                ref={solution3VideoRef}
              >
                <video
                  src="/work/venmo/sol-3.mp4"
                  className="venmo-solution-video"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
              <p className="venmo-solution-caption" ref={solution3CaptionRef}>
                Users find settings in{" "}
                <span className="venmo-solution-caption-bold">
                  under 5 seconds
                </span>{" "}
                instead of 2-3 minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Next Steps Section */}
      <section id="venmo-next-steps" className="venmo-next-steps-section">
        <div className="venmo-next-steps-content">
          <h3 className="venmo-next-steps-title" ref={nextStepsTitleRef}>
            NEXT STEPS
          </h3>
          <ul className="venmo-next-steps-list">
            <li
              className="venmo-next-steps-item"
              ref={(el) => (nextStepsItemsRefs.current[0] = el)}
            >
              <span style={{ fontWeight: 600 }}>Validate</span> with larger user
              groups to measure comprehension and identify edge cases before
              full implementation.
            </li>
            <li
              className="venmo-next-steps-item"
              ref={(el) => (nextStepsItemsRefs.current[1] = el)}
            >
              <span style={{ fontWeight: 600 }}>Design</span> for complex
              scenarios including business transactions, group payments, and
              international privacy requirements.
            </li>
            <li
              className="venmo-next-steps-item"
              ref={(el) => (nextStepsItemsRefs.current[2] = el)}
            >
              <span style={{ fontWeight: 600 }}>Monitor</span> post-launch
              metrics like privacy setting adoption rates and support ticket
              volume to validate real-world impact.
            </li>
          </ul>
        </div>
      </section>

      {/* Key Takeaways Section */}
      <section id="venmo-takeaways" className="venmo-takeaways-section">
        <div className="venmo-takeaways-content">
          <h3 className="venmo-takeaways-title" ref={takeawaysTitleRef}>
            KEY TAKEAWAYS
          </h3>
          <div
            className="venmo-takeaways-item"
            ref={(el) => (takeawaysItemsRefs.current[0] = el)}
          >
            <h4 className="venmo-takeaways-title-text">
              Research reveals root causes.
            </h4>
            <p className="venmo-takeaways-description">
              Spending 70% of my time on research revealed that the issue wasn't
              the UI, but a privacy model misaligned with industry standards and
              user expectations.
            </p>
          </div>
          <div
            className="venmo-takeaways-item"
            ref={(el) => (takeawaysItemsRefs.current[1] = el)}
          >
            <h4 className="venmo-takeaways-title-text">
              Align designs with user behavior.
            </h4>
            <p className="venmo-takeaways-description">
              Users rarely explored hidden privacy settings. I shifted privacy
              to be private-by-default and surfaced controls where decisions
              naturally occur.
            </p>
          </div>
        </div>
      </section>

      {/* See Next Section */}
      <section id="venmo-see-next" className="venmo-see-next-section">
        <div className="venmo-see-next-content">
          <h3 className="venmo-see-next-title" ref={seeNextTitleRef}>
            SEE NEXT
          </h3>
          <div
            className="venmo-see-next-grid"
            ref={seeNextGridRef}
            data-case-study-nav-boundary
          >
            <Link
              to="/time-management"
              className="venmo-see-next-card-link"
              onMouseEnter={() => setIsHoveringSeeNextCard(true)}
              onMouseLeave={() => setIsHoveringSeeNextCard(false)}
            >
              <div
                className="venmo-see-next-card"
                ref={(el) => (seeNextCardsRefs.current[0] = el)}
              >
                <div className="venmo-see-next-image-container">
                  <video
                    src="/work/time-management/thumbnail.mp4"
                    className="venmo-see-next-image"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
                <h4 className="venmo-see-next-card-title">
                  Time Management: A Productivity Tracking Web App
                </h4>
                <p className="venmo-see-next-card-description">
                  Helping a company track employee productivity through an
                  intuitive, easy-to-navigate time management dashboard.
                </p>
              </div>
            </Link>
            <Link
              to="/quizai"
              className="venmo-see-next-card-link"
              onMouseEnter={() => setIsHoveringSeeNextCard(true)}
              onMouseLeave={() => setIsHoveringSeeNextCard(false)}
            >
              <div
                className="venmo-see-next-card"
                ref={(el) => (seeNextCardsRefs.current[1] = el)}
              >
                <div className="venmo-see-next-image-container">
                  <video
                    src="/work/quizai/thumbnail.mp4"
                    className="venmo-see-next-image"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
                <h4 className="venmo-see-next-card-title">
                  QuizAI: AI Powered Notetaking Application
                </h4>
                <p className="venmo-see-next-card-description">
                  Helping students turn uploaded notes into personalized
                  quizzes and summaries through a centralized study dashboard.
                </p>
              </div>
            </Link>
            <Link
              to="/hiku"
              className="venmo-see-next-card-link"
              onMouseEnter={() => setIsHoveringSeeNextCard(true)}
              onMouseLeave={() => setIsHoveringSeeNextCard(false)}
            >
              <div
                className="venmo-see-next-card"
                ref={(el) => (seeNextCardsRefs.current[2] = el)}
              >
                <div className="venmo-see-next-image-container">
                  <video
                    src="/work/Hiku/thumbnail.mp4"
                    className="venmo-see-next-image"
                    autoPlay
                    loop
                    muted
                    playsInline
                    aria-label="Hiku: A Mobile Application for Hiking Enthusiasts — preview"
                  />
                </div>
                <h4 className="venmo-see-next-card-title">
                  Hiku: A Mobile Application for Hiking Enthusiasts
                </h4>
                <p className="venmo-see-next-card-description">
                  Connecting hiking enthusiasts through community, shared
                  experiences, and a convenient way to buy or rent outdoor gear.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      </CaseStudyLayout>
      <Footer />
    </div>
  );
};

export default VenmoCaseStudy;

