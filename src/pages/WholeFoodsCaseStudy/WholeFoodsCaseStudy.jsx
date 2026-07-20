import React, { useRef, useMemo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLenisScroll } from "../../hooks/useLenisScroll";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useScrollReset from "../../hooks/useScrollReset";
import { useCountupAnimation } from "../../hooks/useCountupAnimation";
import { useCardUnfurling } from "../../hooks/useCardUnfurling";
import Footer from "../../components/Footer/Footer";
import CursorPill from "../../components/CursorPill/CursorPill";
import "./WholeFoodsCaseStudy.css";

gsap.registerPlugin(ScrollTrigger);

const WholeFoodsCaseStudy = () => {
  // Reset scroll position to top when page loads/refreshes
  useScrollReset();
  const [isHoveringSeeNextCard, setIsHoveringSeeNextCard] = useState(false);
  const { scrollToElement } = useLenisScroll();

  const impactSectionRef = useRef(null);
  const metricRefs = useRef([]);

  // Refs for scroll animations
  const contextWhatIsWholeFoodsRef = useRef(null);
  const contextMyRoleRef = useRef(null);
  const contextImpactTitleRef = useRef(null);
  const contextImpactMetricsRefs = useRef([]);
  const contextStatementTitleRef = useRef(null);
  const contextStatementContentRef = useRef(null);
  const contextImageRef = useRef(null);
  const problemTitleRef = useRef(null);
  const problemOverviewSubtitleRef = useRef(null);
  const problem1TitleRef = useRef(null);
  const problem1ContentRef = useRef(null);
  const problem1ImageRef = useRef(null);
  const problem2TitleRef = useRef(null);
  const problem2ContentRef = useRef(null);
  const problem2ImageRef = useRef(null);
  const problem3TitleRef = useRef(null);
  const problem3ImageRef = useRef(null);
  const problem3ContentRef = useRef(null);
  const problemIntroImageRef = useRef(null);
  const researchTitleRef = useRef(null);
  const researchOverviewSubtitleRef = useRef(null);
  const researchOverviewTextRef = useRef(null);
  const researchCompetitiveImageRef = useRef(null);
  const researchCompetitiveCaptionRef = useRef(null);
  const researchAffinityImageRef = useRef(null);
  const researchAffinityCaptionRef = useRef(null);
  const researchPersonasImageRef = useRef(null);
  const researchPersonasCaptionRef = useRef(null);
  const solutionTitleRef = useRef(null);
  const solutionPrinciplesSubtitleRef = useRef(null);
  const solutionPrinciplesTextRef = useRef(null);
  const solutionPrinciplesImageRef = useRef(null);
  const solutionProcessTitleRef = useRef(null);
  const solutionIteration1TitleRef = useRef(null);
  const solutionIteration1TextRef = useRef(null);
  const solutionIteration1ImageRef = useRef(null);
  const solutionIteration2TitleRef = useRef(null);
  const solutionIteration2TextRef = useRef(null);
  const solutionIteration2ImageRef = useRef(null);
  const solution1TitleRef = useRef(null);
  const solution1ContentRef = useRef(null);
  const solution1VideoRef = useRef(null);
  const solution1CaptionRef = useRef(null);
  const solution2TitleRef = useRef(null);
  const solution2ContentRef = useRef(null);
  const solution2VideoRef = useRef(null);
  const solution2CaptionRef = useRef(null);
  const takeawaysTitleRef = useRef(null);
  const takeawaysItemRef = useRef(null);
  const nextStepsTitleRef = useRef(null);
  const nextStepsItemsRefs = useRef([]);
  const seeNextTitleRef = useRef(null);
  const seeNextGridRef = useRef(null);
  const seeNextCardsRefs = useRef([]);

  useCardUnfurling({
    gridRef: seeNextGridRef,
    cardRefs: seeNextCardsRefs,
  });

  // Countup animation for metrics - memoize to prevent hook re-runs
  const metrics = useMemo(
    () => [
      { value: 77, prefix: "", suffix: "%", elementRef: metricRefs, index: 0 },
      {
        value: 61,
        prefix: "",
        suffix: "%",
        elementRef: metricRefs,
        index: 1,
      },
      { value: 100, prefix: "", suffix: "%", elementRef: metricRefs, index: 2 },
    ],
    []
  );

  useCountupAnimation(impactSectionRef, metrics);

  const handleSkipToSolution = () => {
    const solutionSection = document.getElementById("solution-section");
    scrollToElement(solutionSection, { offset: 0, duration: 1.2 });
  };

  // Scroll-triggered animations for context section
  useEffect(() => {
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
            ease: "power2.out",
            delay: delay,
          });
        },
      });
      scrollTriggers.push(trigger);
    };

    // Context Section
    createScrollAnimation(contextWhatIsWholeFoodsRef);
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

    // Problem Section
    createScrollAnimation(problemTitleRef);
    createScrollAnimation(problemOverviewSubtitleRef, 0.1);
    createScrollAnimation(problemIntroImageRef, 0.2);
    // Problem 1
    createScrollAnimation(problem1TitleRef);
    createScrollAnimation(problem1ContentRef, 0.1);
    createScrollAnimation(problem1ImageRef, 0.2);
    // Problem 2
    createScrollAnimation(problem2TitleRef);
    createScrollAnimation(problem2ContentRef, 0.1);
    createScrollAnimation(problem2ImageRef, 0.2);
    // Problem 3
    createScrollAnimation(problem3TitleRef);
    createScrollAnimation(problem3ImageRef, 0.1);
    createScrollAnimation(problem3ContentRef, 0.2);

    // Research Section
    createScrollAnimation(researchTitleRef);
    createScrollAnimation(researchOverviewSubtitleRef, 0.1);
    createScrollAnimation(researchOverviewTextRef, 0.2);
    // Competitive Analysis
    createScrollAnimation(researchCompetitiveImageRef, 0.3);
    createScrollAnimation(researchCompetitiveCaptionRef, 0.4);
    // Affinity Mapping
    createScrollAnimation(researchAffinityImageRef);
    createScrollAnimation(researchAffinityCaptionRef, 0.1);
    // User Personas
    createScrollAnimation(researchPersonasImageRef);
    createScrollAnimation(researchPersonasCaptionRef, 0.1);

    // Solution Section
    createScrollAnimation(solutionTitleRef);
    createScrollAnimation(solutionPrinciplesSubtitleRef, 0.1);
    createScrollAnimation(solutionPrinciplesTextRef, 0.2);
    createScrollAnimation(solutionPrinciplesImageRef, 0.3);
    // Design Process
    createScrollAnimation(solutionProcessTitleRef);
    createScrollAnimation(solutionIteration1TitleRef, 0.1);
    createScrollAnimation(solutionIteration1TextRef, 0.2);
    createScrollAnimation(solutionIteration1ImageRef, 0.3);
    createScrollAnimation(solutionIteration2TitleRef, 0.1);
    createScrollAnimation(solutionIteration2TextRef, 0.2);
    createScrollAnimation(solutionIteration2ImageRef, 0.3);
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
    // Key Takeaways
    createScrollAnimation(takeawaysTitleRef);
    createScrollAnimation(takeawaysItemRef, 0.1);
    // Next Steps (use DOM nodes like impact metrics — createScrollAnimation expects ref.current)
    createScrollAnimation(nextStepsTitleRef);
    nextStepsItemsRefs.current.forEach((el, index) => {
      if (el) {
        gsap.set(el, { opacity: 0, y: 30 });
        const trigger = ScrollTrigger.create({
          trigger: el,
          start: "top 80%",
          once: true,
          onEnter: () => {
            gsap.to(el, {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power2.out",
              delay: 0.1 * (index + 1),
            });
          },
        });
        scrollTriggers.push(trigger);
      }
    });
    // See Next
    createScrollAnimation(seeNextTitleRef);

    return () => {
      scrollTriggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="wholefoods-case-study">
      <CursorPill isHovering={isHoveringSeeNextCard} text="View case study" />
      {/* Hero Section */}
      <section className="wholefoods-hero-section">
        {/* Hero Before Image - Visual welcome */}
        <div className="wholefoods-hero-image-container wholefoods-hero-before">
          <img
            src="/work/wholefoods/hero-before.png"
            alt="Whole Foods Checkout Experience - Before"
            className="wholefoods-hero-image"
          />
        </div>

        {/* Hero Text Content */}
        <div className="wholefoods-hero-content">
          {/* Left Column */}
          <div className="wholefoods-hero-left">
            <h1 className="wholefoods-hero-title">
              Improving Whole Foods In-Store Checkout Experience
            </h1>
            <div className="wholefoods-hero-details">
              <div className="wholefoods-hero-detail-item">
                <div className="wholefoods-hero-detail-label">ROLE</div>
                <div className="wholefoods-hero-detail-value">
                  Product Designer
                </div>
              </div>
              <div className="wholefoods-hero-detail-item">
                <div className="wholefoods-hero-detail-label">DURATION</div>
                <div className="wholefoods-hero-detail-value">
                  Jan — Mar 2025 (7 Weeks)
                </div>
              </div>
              <div className="wholefoods-hero-detail-item">
                <div className="wholefoods-hero-detail-label">TOOLS</div>
                <div className="wholefoods-hero-detail-value">
                  Figma, Adobe Creative Suite, Marvel
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="wholefoods-hero-right">
            <p className="wholefoods-hero-subtitle">
              Surfacing a hidden checkout feature for an improved in-store
              experience by aligning interface design with user mental models.
            </p>
            <div className="wholefoods-hero-tags">
              <span className="wholefoods-hero-tag">Mobile</span>
              <span className="wholefoods-hero-tag">User Research</span>
              <span className="wholefoods-hero-tag">Retail Tech</span>
            </div>
            <button
              className="wholefoods-skip-to-solution-btn"
              onClick={handleSkipToSolution}
            >
              <div className="wholefoods-skip-icon-container">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="wholefoods-skip-arrow"
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
              <span className="wholefoods-skip-text">SKIP TO SOLUTION</span>
            </button>
          </div>
        </div>

        {/* Hero After Image - After all text */}
        <div className="wholefoods-hero-image-container wholefoods-hero-after">
          <img
            src="/work/wholefoods/hero-after.png"
            alt="Whole Foods Checkout Experience - After"
            className="wholefoods-hero-image"
          />
        </div>
      </section>

      {/* Context Section */}
      <section className="wholefoods-context-section">
        <div className="wholefoods-context-content">
          {/* Top Row - Two Columns */}
          <div className="wholefoods-context-top">
            <div
              className="wholefoods-context-item"
              ref={contextWhatIsWholeFoodsRef}
            >
              <h2 className="wholefoods-context-title">What is Whole Foods?</h2>
              <p className="wholefoods-context-description">
                Whole Foods partnered with Amazon to offer mobile
                checkout—customers scan items and pay directly through the app,
                skipping traditional lines. The feature promised convenience but
                had a critical flaw: the checkout code was nearly impossible to
                find.
              </p>
            </div>
            <div className="wholefoods-context-item" ref={contextMyRoleRef}>
              <h2 className="wholefoods-context-title">My Role</h2>
              <p className="wholefoods-context-description">
                I conducted user research (6 interviews, 2 usability test rounds
                with 5 participants each), analyzed 3 competitor platforms, and
                designed solutions from paper prototypes to high-fidelity
                interactive prototypes.
              </p>
            </div>
          </div>

          {/* Bottom Row - Impact Metrics */}
          <div className="wholefoods-context-impact" ref={impactSectionRef}>
            <h3 className="wholefoods-impact-title" ref={contextImpactTitleRef}>
              Impact Metrics
            </h3>
            <div className="wholefoods-impact-metrics">
              <div
                className="wholefoods-impact-metric"
                ref={(el) => (contextImpactMetricsRefs.current[0] = el)}
              >
                <div
                  className="wholefoods-impact-value"
                  ref={(el) => (metricRefs.current[0] = el)}
                >
                  77%
                </div>
                <div className="wholefoods-impact-label">
                  faster checkout completion
                </div>
              </div>
              <div
                className="wholefoods-impact-metric"
                ref={(el) => (contextImpactMetricsRefs.current[1] = el)}
              >
                <div
                  className="wholefoods-impact-value"
                  ref={(el) => (metricRefs.current[1] = el)}
                >
                  61%
                </div>
                <div className="wholefoods-impact-label">
                  reduction in user errors
                </div>
              </div>
              <div
                className="wholefoods-impact-metric"
                ref={(el) => (contextImpactMetricsRefs.current[2] = el)}
              >
                <div
                  className="wholefoods-impact-value"
                  ref={(el) => (metricRefs.current[2] = el)}
                >
                  100%
                </div>
                <div className="wholefoods-impact-label">
                  improvement in user satisfaction
                </div>
              </div>
            </div>
          </div>

          {/* Context Statement Section */}
          <div className="wholefoods-context-statement">
            <h3
              className="wholefoods-context-statement-title"
              ref={contextStatementTitleRef}
            >
              CONTEXT
            </h3>
            <div
              className="wholefoods-context-statement-content"
              ref={contextStatementContentRef}
            >
              <div className="wholefoods-context-statement-question-group">
                <p className="wholefoods-context-statement-text">
                  Are you{" "}
                  <span className="wholefoods-accent-text">
                    holding up the line
                  </span>{" "}
                  again?
                </p>
              </div>
              <p className="wholefoods-context-statement-description">
                At Whole Foods, users spent <i>2-3 minutes</i> searching for
                their checkout code—
                <span className="wholefoods-bold-text">
                  68% looked in wrong sections, 38% gave up entirely.
                </span>
              </p>
            </div>
            <div
              className="wholefoods-context-image-container"
              ref={contextImageRef}
            >
              <img
                src="/work/wholefoods/existing-experience.png"
                alt="Whole Foods existing checkout experience"
                className="wholefoods-context-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="wholefoods-problem-section">
        <div className="wholefoods-problem-content">
          <h3 className="wholefoods-problem-title" ref={problemTitleRef}>
            PROBLEM
          </h3>

          {/* Problem 0: Overview */}
          <div className="wholefoods-problem-item">
            <h4
              className="wholefoods-problem-subtitle"
              ref={problemOverviewSubtitleRef}
            >
              Where did they{" "}
              <span className="wholefoods-accent-text">hide</span> the code?
            </h4>
            <div className="wholefoods-problem-overview">
              <p className="wholefoods-problem-overview-text">
                Through 6 user interviews and 2 rounds of usability testing, I
                identified 3 critical problems preventing successful checkout.
              </p>
            </div>
            <div
              className="wholefoods-problem-image-container"
              ref={problemIntroImageRef}
            >
              <img
                src="/work/wholefoods/problem-intro.png"
                alt="Problem Introduction"
                className="wholefoods-problem-image"
              />
            </div>
          </div>

          {/* Problem 1 */}
          <div className="wholefoods-problem-item">
            <h4
              className="wholefoods-problem-item-title"
              ref={problem1TitleRef}
            >
              Problem #1: Nowhere to Be Found
            </h4>
            <div
              className="wholefoods-problem-item-content"
              ref={problem1ContentRef}
            >
              <p className="wholefoods-problem-item-description">
                The checkout code had{" "}
                <span className="wholefoods-accent-text">
                  no discoverable entry point
                </span>{" "}
                on the main screens.
              </p>
              <p className="wholefoods-problem-item-text">
                <span className="wholefoods-problem-bold">100% of users</span>{" "}
                failed to find the code on their first try, spending an average
                of <span className="wholefoods-problem-bold">2+ minutes</span>{" "}
                searching while feeling lost and confused.
              </p>
            </div>
            <div
              className="wholefoods-problem-image-container"
              ref={problem1ImageRef}
            >
              <img
                src="/work/wholefoods/problem-1.png"
                alt="Problem 1: Nowhere to Be Found"
                className="wholefoods-problem-image"
              />
            </div>
          </div>

          {/* Problem 2 */}
          <div className="wholefoods-problem-item">
            <h4
              className="wholefoods-problem-item-title"
              ref={problem2TitleRef}
            >
              Problem #2: In the Wrong Place
            </h4>
            <div
              className="wholefoods-problem-item-content"
              ref={problem2ContentRef}
            >
              <p className="wholefoods-problem-item-description">
                Users checked the Account page, tried the search bar—
                <span className="wholefoods-accent-text">nothing worked</span>.
              </p>
              <p className="wholefoods-problem-item-text">
                <span className="wholefoods-problem-bold">68% of users</span>{" "}
                looked for the code in areas you'd normally expect, and found
                nothing.
              </p>
            </div>
            <div
              className="wholefoods-problem-image-container"
              ref={problem2ImageRef}
            >
              <img
                src="/work/wholefoods/problem-2.png"
                alt="Problem 2: In the Wrong Place"
                className="wholefoods-problem-image"
              />
            </div>
          </div>

          {/* Problem 3 */}
          <div className="wholefoods-problem-item">
            <h4
              className="wholefoods-problem-item-title"
              ref={problem3TitleRef}
            >
              Problem #3: Hidden When Needed Most
            </h4>
            <div
              className="wholefoods-problem-item-content"
              ref={problem3ContentRef}
            >
              <p className="wholefoods-problem-item-description">
                <span className="wholefoods-accent-text">
                  No automatic surfacing
                </span>{" "}
                when entering Whole Foods stores.
              </p>
            </div>
            <div
              className="wholefoods-problem-image-container wholefoods-problem-3-image"
              ref={problem3ImageRef}
            >
              <img
                src="/work/wholefoods/problem-3.png"
                alt="Problem 3: Hidden When Needed Most"
                className="wholefoods-problem-image"
              />
            </div>
            <div className="wholefoods-problem-item-content">
              <p className="wholefoods-problem-item-text">
                <span className="wholefoods-problem-bold">38% of users</span>{" "}
                thought the feature didn't exist. Unlike competitors, the code
                didn't appear when users entered Whole Foods stores.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Research Section */}
      <section className="wholefoods-research-section">
        <div className="wholefoods-research-content">
          <h3 className="wholefoods-research-title" ref={researchTitleRef}>
            RESEARCH
          </h3>

          <div className="wholefoods-research-overview">
            <div
              className="wholefoods-research-overview-content"
              ref={researchOverviewSubtitleRef}
            >
              <h4 className="wholefoods-research-subtitle">
                Validating the Problems Through Research
              </h4>
              <p
                className="wholefoods-research-overview-text"
                ref={researchOverviewTextRef}
              >
                To understand why users struggled, I conducted competitive
                analysis and synthesized interview findings into actionable
                insights.
              </p>
            </div>
          </div>

          {/* Competitive Analysis */}
          <div className="wholefoods-research-finding">
            <div
              className="wholefoods-research-image-container"
              ref={researchCompetitiveImageRef}
            >
              <img
                src="/work/wholefoods/competitor-analysis.png"
                alt="Competitive Analysis"
                className="wholefoods-research-image"
              />
            </div>
            <p
              className="wholefoods-research-caption"
              ref={researchCompetitiveCaptionRef}
            >
              All competitors featured visible checkout access—
              <span className="wholefoods-problem-bold">
                Whole Foods was the only app that didn't.
              </span>
            </p>
          </div>

          {/* Affinity Mapping */}
          <div className="wholefoods-research-finding">
            <div
              className="wholefoods-research-image-container"
              ref={researchAffinityImageRef}
            >
              <img
                src="/work/wholefoods/affinity-mapping.png"
                alt="Affinity Mapping"
                className="wholefoods-research-image"
              />
            </div>
            <p
              className="wholefoods-research-caption"
              ref={researchAffinityCaptionRef}
            >
              <span className="wholefoods-problem-bold">6 interviews</span>{" "}
              synthesized into pain points, behaviors, and user needs.
            </p>
          </div>

          {/* User Personas */}
          <div className="wholefoods-research-finding">
            <div
              className="wholefoods-research-image-container"
              ref={researchPersonasImageRef}
            >
              <img
                src="/work/wholefoods/user-personas.png"
                alt="User Personas"
                className="wholefoods-research-image"
              />
            </div>
            <p
              className="wholefoods-research-caption"
              ref={researchPersonasCaptionRef}
            >
              <span className="wholefoods-problem-bold">3 personas</span>{" "}
              representing distinct user frustrations and checkout needs.
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution-section" className="wholefoods-solution-section">
        <div className="wholefoods-solution-content">
          <h3 className="wholefoods-solution-title" ref={solutionTitleRef}>
            SOLUTION
          </h3>

          <div className="wholefoods-solution-overview">
            <h4
              className="wholefoods-solution-subtitle"
              ref={solutionPrinciplesSubtitleRef}
            >
              Design Principles
            </h4>
            <p
              className="wholefoods-solution-overview-text"
              ref={solutionPrinciplesTextRef}
            >
              From my research, I established three core principles to guide the
              redesign:
            </p>
            <div
              className="wholefoods-solution-image-container"
              ref={solutionPrinciplesImageRef}
            >
              <img
                src="/work/wholefoods/key-opp.png"
                alt="Design Principles"
                className="wholefoods-solution-image"
              />
            </div>

            {/* Design Process */}
            <div className="wholefoods-solution-process">
              <h4
                className="wholefoods-solution-subtitle"
                ref={solutionProcessTitleRef}
              >
                Design Process
              </h4>

              {/* Iteration 1 */}
              <div className="wholefoods-solution-iteration">
                <h5
                  className="wholefoods-solution-iteration-title"
                  ref={solutionIteration1TitleRef}
                >
                  Paper Prototypes
                </h5>
                <p
                  className="wholefoods-solution-iteration-text"
                  ref={solutionIteration1TextRef}
                >
                  I translated these principles into design concepts, starting
                  with wireframes to test different placement and visibility
                  solutions.
                </p>
                <div
                  className="wholefoods-solution-image-container"
                  ref={solutionIteration1ImageRef}
                >
                  <img
                    src="/work/wholefoods/paper-prototypes.png"
                    alt="Paper Prototypes"
                    className="wholefoods-solution-image"
                  />
                </div>
              </div>

              {/* Iteration 2 */}
              <div className="wholefoods-solution-iteration">
                <h5
                  className="wholefoods-solution-iteration-title"
                  ref={solutionIteration2TitleRef}
                >
                  Low-Fidelity Wireframes
                </h5>
                <p
                  className="wholefoods-solution-iteration-text"
                  ref={solutionIteration2TextRef}
                >
                  I tested{" "}
                  <span className="wholefoods-bold-text">
                    2 solutions with 5 users
                  </span>
                  —a persistent QR button and Account section integration. Both
                  were well-received, so I combined them for redundancy.
                </p>
                <div
                  className="wholefoods-solution-image-container"
                  ref={solutionIteration2ImageRef}
                >
                  <img
                    src="/work/wholefoods/low-fi.png"
                    alt="Low-Fidelity Wireframes"
                    className="wholefoods-solution-image"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Solution 1 */}
          <div className="wholefoods-solution-item">
            <h4
              className="wholefoods-solution-item-title"
              ref={solution1TitleRef}
            >
              Solution #1: Location-Based QR Button
            </h4>
            <div
              className="wholefoods-solution-item-content"
              ref={solution1ContentRef}
            >
              <p className="wholefoods-solution-item-description">
                A <span className="wholefoods-accent-text">persistent</span> QR
                button that appears on the home screen when users enter the
                store.
              </p>
            </div>
            <div className="wholefoods-solution-media">
              <div
                className="wholefoods-solution-video-container"
                ref={solution1VideoRef}
              >
                <video
                  src="/work/wholefoods/sol-1.mp4"
                  className="wholefoods-solution-video"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
              <p
                className="wholefoods-solution-caption"
                ref={solution1CaptionRef}
              >
                This directly addresses Jane's need for one-handed navigation
                and Sarah's desire for automatic code surfacing during busy
                checkout periods—eliminating the{" "}
                <span className="wholefoods-solution-caption-bold">
                  2-3 minute search time
                </span>{" "}
                entirely.
              </p>
            </div>
          </div>

          {/* Solution 2 */}
          <div className="wholefoods-solution-item">
            <h4
              className="wholefoods-solution-item-title"
              ref={solution2TitleRef}
            >
              Solution #2: Persistent Account Access
            </h4>
            <div
              className="wholefoods-solution-item-content"
              ref={solution2ContentRef}
            >
              <p className="wholefoods-solution-item-description">
                A <span className="wholefoods-accent-text">dedicated</span>{" "}
                'In-Store Code' button under My Account.
              </p>
            </div>
            <div className="wholefoods-solution-media">
              <div
                className="wholefoods-solution-video-container"
                ref={solution2VideoRef}
              >
                <video
                  src="/work/wholefoods/sol-2.mp4"
                  className="wholefoods-solution-video"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
              <p
                className="wholefoods-solution-caption"
                ref={solution2CaptionRef}
              >
                This resolved John's confusion with UI elements and provided the
                clear, searchable location that{" "}
                <span className="wholefoods-solution-caption-bold">
                  68% of users
                </span>{" "}
                expected to find—matching established payment app patterns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Next Steps Section */}
      <section className="wholefoods-next-steps-section">
        <div className="wholefoods-next-steps-content">
          <h3 className="wholefoods-next-steps-title" ref={nextStepsTitleRef}>
            NEXT STEPS
          </h3>
          <ul className="wholefoods-next-steps-list">
            <li
              className="wholefoods-next-steps-item"
              ref={(el) => (nextStepsItemsRefs.current[0] = el)}
            >
              <span style={{ fontWeight: 600 }}>Conduct</span> extensive A/B testing with the new QR code button
              placement to optimize its visibility and accessibility.
            </li>
            <li
              className="wholefoods-next-steps-item"
              ref={(el) => (nextStepsItemsRefs.current[1] = el)}
            >
              <span style={{ fontWeight: 600 }}>Explore</span> integration possibilities with digital wallet systems for
              even faster checkout.
            </li>
            <li
              className="wholefoods-next-steps-item"
              ref={(el) => (nextStepsItemsRefs.current[2] = el)}
            >
              <span style={{ fontWeight: 600 }}>Implement</span> location-based triggers to automatically surface the
              checkout code when customers enter Whole Foods stores.
            </li>
            <li
              className="wholefoods-next-steps-item"
              ref={(el) => (nextStepsItemsRefs.current[3] = el)}
            >
              <span style={{ fontWeight: 600 }}>Gather</span> quantitative data on checkout times to measure the impact
              of these improvements.
            </li>
          </ul>
        </div>
      </section>

      {/* Key Takeaways Section */}
      <section className="wholefoods-takeaways-section">
        <div className="wholefoods-takeaways-content">
          <h3 className="wholefoods-takeaways-title" ref={takeawaysTitleRef}>
            KEY TAKEAWAYS
          </h3>
          <div className="wholefoods-takeaways-item" ref={takeawaysItemRef}>
            <h4 className="wholefoods-takeaways-title-text">
              Design for mental models, not features.
            </h4>
            <p className="wholefoods-takeaways-description">
              The problem wasn't that the checkout code didn't work—it's that it
              wasn't where users expected it. By studying competitor patterns
              and user expectations, I learned that successful design isn't
              about innovation for innovation's sake; it's about meeting users
              where they already are mentally.
            </p>
          </div>
        </div>
      </section>

      {/* See Next Section */}
      <section className="wholefoods-see-next-section">
        <div className="wholefoods-see-next-content">
          <h3 className="wholefoods-see-next-title" ref={seeNextTitleRef}>
            SEE NEXT
          </h3>
          <div className="wholefoods-see-next-grid" ref={seeNextGridRef}>
            <Link
              to="/time-management"
              className="wholefoods-see-next-card-link"
              onMouseEnter={() => setIsHoveringSeeNextCard(true)}
              onMouseLeave={() => setIsHoveringSeeNextCard(false)}
            >
              <div
                className="wholefoods-see-next-card"
                ref={(el) => (seeNextCardsRefs.current[0] = el)}
              >
                <div className="wholefoods-see-next-image-container">
                  <video
                    src="/work/time-management/thumbnail.mp4"
                    className="wholefoods-see-next-image"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
                <h4 className="wholefoods-see-next-card-title">
                  Time Management: A Productivity Tracking Web App
                </h4>
                <p className="wholefoods-see-next-card-description">
                  Helping a company track employee productivity through an
                  intuitive, easy-to-navigate time management dashboard.
                </p>
              </div>
            </Link>
            <Link
              to="/venmo"
              className="wholefoods-see-next-card-link"
              onMouseEnter={() => setIsHoveringSeeNextCard(true)}
              onMouseLeave={() => setIsHoveringSeeNextCard(false)}
            >
              <div
                className="wholefoods-see-next-card"
                ref={(el) => (seeNextCardsRefs.current[1] = el)}
              >
                <div className="wholefoods-see-next-image-container">
                  <video
                    src="/work/venmo/thumbnail.mp4"
                    className="wholefoods-see-next-image"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
                <h4 className="wholefoods-see-next-card-title">
                  Redesigning Venmo's Privacy Controls
                </h4>
                <p className="wholefoods-see-next-card-description">
                  Transforming Venmo's public-by-default privacy model to help
                  users make informed choices without confusion.
                </p>
              </div>
            </Link>
            <Link
              to="/quizai"
              className="wholefoods-see-next-card-link"
              onMouseEnter={() => setIsHoveringSeeNextCard(true)}
              onMouseLeave={() => setIsHoveringSeeNextCard(false)}
            >
              <div
                className="wholefoods-see-next-card"
                ref={(el) => (seeNextCardsRefs.current[2] = el)}
              >
                <div className="wholefoods-see-next-image-container">
                  <video
                    src="/work/quizai/thumbnail.mp4"
                    className="wholefoods-see-next-image"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
                <h4 className="wholefoods-see-next-card-title">
                  QuizAI: AI Powered Notetaking Application
                </h4>
                <p className="wholefoods-see-next-card-description">
                  Helping students turn uploaded notes into personalized
                  quizzes and summaries through a centralized study dashboard.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WholeFoodsCaseStudy;
