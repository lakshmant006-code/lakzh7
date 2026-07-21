import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useScrollReset from "../../hooks/useScrollReset";
import { useLenisScroll } from "../../hooks/useLenisScroll";
import { useCardUnfurling } from "../../hooks/useCardUnfurling";
import Footer from "../../components/Footer/Footer";
import CursorPill from "../../components/CursorPill/CursorPill";
import CaseStudyLayout from "../../components/CaseStudyLayout/CaseStudyLayout";
import {
  CaseStudyStatement,
  CaseStudyStatementBody,
} from "../../components/CaseStudyStatement/CaseStudyStatement";
import "./ArcadiaCaseStudy.css";

gsap.registerPlugin(ScrollTrigger);

/** Dashed placeholder block for media that hasn't been added yet. */
function ArcadiaPlaceholder({ label, aspectRatio = "16 / 9" }) {
  return (
    <div className="arcadia-placeholder-block" style={{ aspectRatio }}>
      <span className="arcadia-placeholder-label">{label}</span>
    </div>
  );
}

const ArcadiaCaseStudy = () => {
  useScrollReset();
  const [isHoveringSeeNextCard, setIsHoveringSeeNextCard] = useState(false);
  const { scrollToElement } = useLenisScroll();

  // Refs for scroll animations
  const contextGoalRef = useRef(null);
  const contextRoleRef = useRef(null);
  const contextStatementTitleRef = useRef(null);
  const contextStatementContentRef = useRef(null);
  const researchTitleRef = useRef(null);
  const researchOverviewRef = useRef(null);
  const researchKpiImageRef = useRef(null);
  const researchMethodologyRef = useRef(null);
  const researchAuditImageRef = useRef(null);
  const solutionTitleRef = useRef(null);
  const solutionIntroRef = useRef(null);
  const solutionAffinityImageRef = useRef(null);
  const solutionStakeholderRef = useRef(null);
  const solutionPairsImageRef = useRef(null);
  const impactTitleRef = useRef(null);
  const impactMetricsRefs = useRef([]);
  const impactSummaryRef = useRef(null);
  const seeNextTitleRef = useRef(null);
  const seeNextGridRef = useRef(null);
  const seeNextCardsRefs = useRef([]);

  const handleSkipToSolution = () => {
    scrollToElement(document.getElementById("solution-section"), {
      duration: 1.2,
    });
  };

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

  // Scroll-triggered animations
  useEffect(() => {
    const scrollTriggers = [];

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
            delay,
          });
        },
      });
      scrollTriggers.push(trigger);
    };

    // Context Section
    createScrollAnimation(contextGoalRef);
    createScrollAnimation(contextRoleRef, 0.1);
    createScrollAnimation(contextStatementTitleRef, 0.15);
    createScrollAnimation(contextStatementContentRef, 0.2);

    // Research Section
    createScrollAnimation(researchTitleRef);
    createScrollAnimation(researchOverviewRef, 0.1);
    createScrollAnimation(researchKpiImageRef, 0.15);
    createScrollAnimation(researchMethodologyRef, 0.2);
    createScrollAnimation(researchAuditImageRef, 0.25);

    // Solution Section
    createScrollAnimation(solutionTitleRef);
    createScrollAnimation(solutionIntroRef, 0.1);
    createScrollAnimation(solutionAffinityImageRef, 0.15);
    createScrollAnimation(solutionStakeholderRef, 0.2);
    createScrollAnimation(solutionPairsImageRef, 0.25);

    // Impact Section
    createScrollAnimation(impactTitleRef);
    impactMetricsRefs.current.forEach((ref, index) => {
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
              delay: 0.1 + index * 0.1,
            });
          },
        });
        scrollTriggers.push(trigger);
      }
    });
    createScrollAnimation(impactSummaryRef, 0.4);

    // See Next Section
    createScrollAnimation(seeNextTitleRef);

    return () => {
      scrollTriggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="arcadia-case-study">
      <CursorPill isHovering={isHoveringSeeNextCard} text="View case study" />
      <CaseStudyLayout projectId="arcadia">
        {/* Hero Section */}
        <section className="arcadia-hero-section">
          <div className="arcadia-hero-image-container arcadia-hero-before">
            <img
              src="/work/arcadia/Arcadia-Hero.png"
              alt="Arcadia Custom Builders"
              className="arcadia-hero-image"
              style={{ aspectRatio: "1523 / 617" }}
            />
          </div>

          <div className="arcadia-hero-content">
            {/* Left Column */}
            <div className="arcadia-hero-left">
              <h1 className="arcadia-hero-title">Arcadia Custom Builders</h1>
              <p className="arcadia-hero-category">
                Internal Workflow Tool — Revolution Steel
              </p>
              <div className="arcadia-hero-details">
                <div className="arcadia-hero-detail-item">
                  <div className="arcadia-hero-detail-label">TIMELINE</div>
                  <div className="arcadia-hero-detail-value">
                    August 2025 — July 2026
                  </div>
                </div>
                <div className="arcadia-hero-detail-item">
                  <div className="arcadia-hero-detail-label">ROLE</div>
                  <div className="arcadia-hero-detail-value">
                    UX Researcher
                  </div>
                </div>
                <div className="arcadia-hero-detail-item">
                  <div className="arcadia-hero-detail-label">TOOLS</div>
                  <div className="arcadia-hero-detail-value">TheyDo</div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="arcadia-hero-right">
              <p className="arcadia-hero-subtitle">
                Helping Revolution Steel, a steel production shop within
                Arcadia Custom Builders, formulate a user workflow so work
                gets distributed clearly and tasks are streamlined across the
                team.
              </p>
              <div className="arcadia-hero-tags">
                <span className="arcadia-hero-tag">UX Research</span>
                <span className="arcadia-hero-tag">Qualitative Study</span>
                <span className="arcadia-hero-tag">Workflow Design</span>
                <span className="arcadia-hero-tag">Competitive Audit</span>
              </div>
              <button
                className="arcadia-skip-to-solution-btn"
                onClick={handleSkipToSolution}
              >
                <div className="arcadia-skip-icon-container">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="arcadia-skip-arrow"
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
                <span className="arcadia-skip-text">SKIP TO SOLUTION</span>
              </button>
            </div>
          </div>

          <div className="arcadia-hero-image-container arcadia-hero-after">
            <ArcadiaPlaceholder
              label="Secondary hero image"
              aspectRatio="1360 / 400"
            />
          </div>
        </section>

        {/* Context Section */}
        <section id="arcadia-context" className="arcadia-context-section">
          <div className="arcadia-context-content">
            <div className="arcadia-context-top">
              <div className="arcadia-context-item" ref={contextGoalRef}>
                <h2 className="arcadia-context-title">Goal</h2>
                <p className="arcadia-context-description">
                  Revolution Steel's team needed a clearer way to distribute
                  work and move tasks through their production shop. My goal
                  was to formulate a user workflow that streamlines how work
                  gets assigned and tracked, by setting goals in planning,
                  conducting research, and synthesizing and sharing insights
                  with the team.
                </p>
              </div>
              <div className="arcadia-context-item" ref={contextRoleRef}>
                <h2 className="arcadia-context-title">Problem Statements</h2>
                <p className="arcadia-context-description">
                  Three pain points surfaced across the journey — from intake
                  through delivery — that were costing the team the most time
                  and rework.
                </p>
              </div>
            </div>

            {/* Problem statements / pain points */}
            <div className="arcadia-context-statement">
              <h3
                className="arcadia-context-statement-title"
                ref={contextStatementTitleRef}
              >
                PAIN POINTS
              </h3>
              <CaseStudyStatement
                ref={contextStatementContentRef}
                variant="wide"
              >
                <CaseStudyStatementBody>
                  <span className="arcadia-requirements-label">
                    NO OWNER AT INTAKE
                  </span>
                  <br />
                  Incoming specs and RFIs arrive with no assigned owner, so
                  questions sit unanswered until the team finds out too late
                  that nothing moved.
                </CaseStudyStatementBody>
                <CaseStudyStatementBody>
                  <span className="arcadia-requirements-label">
                    NO SHARED TASK LIST
                  </span>
                  <br />
                  Modelers block out walls with no predefined daily tasks —
                  each person decides ad hoc what to work on, causing
                  duplicated effort and missed handoffs.
                </CaseStudyStatementBody>
                <CaseStudyStatementBody>
                  <span className="arcadia-requirements-label">
                    LATE FIELD COMMUNICATION
                  </span>
                  <br />
                  Field crews hear about changes late, and with no end-of-day
                  completion check, no one has visibility into what was
                  actually finished.
                </CaseStudyStatementBody>
              </CaseStudyStatement>
              <div className="arcadia-painpoints-tags">
                <span className="arcadia-painpoint-tag">Unowned intake</span>
                <span className="arcadia-painpoint-tag">Ad hoc task planning</span>
                <span className="arcadia-painpoint-tag">
                  Late field visibility
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Research Section */}
        <section id="arcadia-research" className="arcadia-research-section">
          <div className="arcadia-research-content">
            <h3 className="arcadia-research-title" ref={researchTitleRef}>
              RESEARCH
            </h3>

            <CaseStudyStatement ref={researchOverviewRef}>
              <CaseStudyStatementBody>
                I used{" "}
                <span style={{ fontWeight: 600 }}>drop-off rates</span> as the
                key KPI to identify where the workflow was breaking down for
                the team.
              </CaseStudyStatementBody>
              <CaseStudyStatementBody>
                To dig into why, I ran a{" "}
                <span style={{ fontWeight: 600 }}>qualitative study</span> and
                used{" "}
                <span style={{ fontWeight: 600 }}>TheyDo</span> to map
                personas, opportunities, pain points, insights, and solutions
                across the team's journey.
              </CaseStudyStatementBody>
            </CaseStudyStatement>

            <div className="arcadia-research-image-container" ref={researchKpiImageRef}>
              <img
                src="/work/arcadia/They Do User Journey.png"
                alt="TheyDo journey map showing phases, opportunities, pain-point insights, and solutions across the team's workflow"
                className="arcadia-userflow-image"
                style={{ aspectRatio: "1297 / 720" }}
              />
            </div>

            <CaseStudyStatement ref={researchMethodologyRef}>
              <CaseStudyStatementBody>
                After understanding the pain points, I ran a{" "}
                <span style={{ fontWeight: 600 }}>competitive audit</span> of
                what other companies in the space are doing — observing
                patterns and figuring out what needed to change to make the
                team more effective.
              </CaseStudyStatementBody>
            </CaseStudyStatement>

            <div className="arcadia-research-image-container" ref={researchAuditImageRef}>
              <ArcadiaPlaceholder
                label="Competitive audit findings"
                aspectRatio="1360 / 500"
              />
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section id="solution-section" className="arcadia-solution-section">
          <div className="arcadia-solution-content">
            <h3 className="arcadia-solution-title" ref={solutionTitleRef}>
              SOLUTION
            </h3>

            <div
              className="arcadia-solution-visual-identity-content"
              ref={solutionIntroRef}
            >
              <p className="arcadia-solution-visual-identity-text">
                Once the research was synthesized, I organized the trends
                into an{" "}
                <span className="arcadia-solution-visual-identity-medium-bold">
                  affinity map
                </span>
                , grouped by what mattered most to{" "}
                <span className="arcadia-solution-visual-identity-medium-bold">
                  stakeholders
                </span>{" "}
                — they had invested a lot of time into this project, so
                keeping their priorities front and center in how the insights
                were organized was important.
              </p>
            </div>

            <div className="arcadia-solution-subsection">
              <h4 className="arcadia-solution-subheading">Affinity Map</h4>
              <div
                className="arcadia-research-image-container"
                ref={solutionAffinityImageRef}
              >
                <ArcadiaPlaceholder
                  label="Affinity map — trends organized by stakeholder priority"
                  aspectRatio="1360 / 600"
                />
              </div>
            </div>

            <div className="arcadia-solution-subsection" ref={solutionStakeholderRef}>
              <h4 className="arcadia-solution-subheading">
                Stakeholder Synthesis
              </h4>
              <p className="arcadia-ideation-text">
                Placeholder — insights and takeaways from stakeholder
                conversations will go here.
              </p>
            </div>

            <div className="arcadia-solution-subsection">
              <h4 className="arcadia-solution-subheading">
                Problem → Solution Pairs
              </h4>
              <div
                className="arcadia-pairs-grid"
                ref={solutionPairsImageRef}
              >
                <div className="arcadia-pair-card">
                  <div className="arcadia-pair-phase">AEC INTAKE</div>
                  <div className="arcadia-pair-problem">
                    Incoming specs and RFIs have no assigned owner.
                  </div>
                  <div className="arcadia-pair-insight">
                    Questions raised in meetings never reach the person who
                    could actually answer them.
                  </div>
                  <div className="arcadia-pair-solution">
                    <span className="arcadia-pair-solution-label">
                      SOLUTION
                    </span>{" "}
                    Assign a named owner to every incoming spec and RFI on
                    arrival, tracked with a recurring review cadence.
                  </div>
                </div>
                <div className="arcadia-pair-card">
                  <div className="arcadia-pair-phase">PRE-MODELING</div>
                  <div className="arcadia-pair-problem">
                    No predefined daily tasks — each modeler decides ad hoc
                    what to work on.
                  </div>
                  <div className="arcadia-pair-insight">
                    This causes duplicated effort and missed handoffs between
                    modelers.
                  </div>
                  <div className="arcadia-pair-solution">
                    <span className="arcadia-pair-solution-label">
                      SOLUTION
                    </span>{" "}
                    Publish a shared daily task list before blockout starts,
                    so each modeler gets clear, predefined work.
                  </div>
                </div>
                <div className="arcadia-pair-card">
                  <div className="arcadia-pair-phase">FIELD / DELIVERY</div>
                  <div className="arcadia-pair-problem">
                    Field crews hear about changes late, with no end-of-day
                    completion check.
                  </div>
                  <div className="arcadia-pair-insight">
                    No one has visibility into what was actually finished on
                    site each day.
                  </div>
                  <div className="arcadia-pair-solution">
                    <span className="arcadia-pair-solution-label">
                      SOLUTION
                    </span>{" "}
                    Run an end-of-day completion check with field crews to
                    confirm what was actually completed.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section id="arcadia-impact" className="arcadia-impact-section">
          <div className="arcadia-impact-content">
            <h3 className="arcadia-impact-section-title" ref={impactTitleRef}>
              IMPACT
            </h3>
            <div className="arcadia-impact-metrics">
              <div
                className="arcadia-impact-metric arcadia-impact-metric--placeholder"
                ref={(el) => (impactMetricsRefs.current[0] = el)}
              >
                <div className="arcadia-impact-value arcadia-impact-value--placeholder">
                  —
                </div>
                <div className="arcadia-impact-label">Add metric</div>
              </div>
              <div
                className="arcadia-impact-metric arcadia-impact-metric--placeholder"
                ref={(el) => (impactMetricsRefs.current[1] = el)}
              >
                <div className="arcadia-impact-value arcadia-impact-value--placeholder">
                  —
                </div>
                <div className="arcadia-impact-label">Add metric</div>
              </div>
              <div
                className="arcadia-impact-metric arcadia-impact-metric--placeholder"
                ref={(el) => (impactMetricsRefs.current[2] = el)}
              >
                <div className="arcadia-impact-value arcadia-impact-value--placeholder">
                  —
                </div>
                <div className="arcadia-impact-label">Add metric</div>
              </div>
            </div>
            <p className="arcadia-impact-summary" ref={impactSummaryRef}>
              Placeholder — results and real numbers from this project will
              go here once available.
            </p>
          </div>
        </section>

        {/* See Next Section */}
        <section id="arcadia-see-next" className="arcadia-see-next-section">
          <div className="arcadia-see-next-content">
            <h3 className="arcadia-see-next-title" ref={seeNextTitleRef}>
              SEE NEXT
            </h3>
            <div
              className="arcadia-see-next-grid"
              ref={seeNextGridRef}
              data-case-study-nav-boundary
            >
              <Link
                to="/venmo"
                className="arcadia-see-next-card-link"
                onMouseEnter={() => setIsHoveringSeeNextCard(true)}
                onMouseLeave={() => setIsHoveringSeeNextCard(false)}
              >
                <div
                  className="arcadia-see-next-card"
                  ref={(el) => (seeNextCardsRefs.current[0] = el)}
                >
                  <div className="arcadia-see-next-image-container">
                    <video
                      src="/work/venmo/thumbnail.mp4"
                      className="arcadia-see-next-image"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  </div>
                  <h4 className="arcadia-see-next-card-title">
                    Redesigning Venmo's Privacy Controls
                  </h4>
                  <p className="arcadia-see-next-card-description">
                    Transforming Venmo's public-by-default privacy model to
                    help users make informed choices without confusion.
                  </p>
                </div>
              </Link>
              <Link
                to="/quizai"
                className="arcadia-see-next-card-link"
                onMouseEnter={() => setIsHoveringSeeNextCard(true)}
                onMouseLeave={() => setIsHoveringSeeNextCard(false)}
              >
                <div
                  className="arcadia-see-next-card"
                  ref={(el) => (seeNextCardsRefs.current[1] = el)}
                >
                  <div className="arcadia-see-next-image-container">
                    <video
                      src="/work/quizai/thumbnail.mp4"
                      className="arcadia-see-next-image"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  </div>
                  <h4 className="arcadia-see-next-card-title">
                    QuizAI: AI Powered Notetaking Application
                  </h4>
                  <p className="arcadia-see-next-card-description">
                    Helping students turn uploaded notes into personalized
                    quizzes and summaries through a centralized study
                    dashboard.
                  </p>
                </div>
              </Link>
              <Link
                to="/time-management"
                className="arcadia-see-next-card-link"
                onMouseEnter={() => setIsHoveringSeeNextCard(true)}
                onMouseLeave={() => setIsHoveringSeeNextCard(false)}
              >
                <div
                  className="arcadia-see-next-card"
                  ref={(el) => (seeNextCardsRefs.current[2] = el)}
                >
                  <div className="arcadia-see-next-image-container">
                    <video
                      src="/work/time-management/thumbnail.mp4"
                      className="arcadia-see-next-image"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  </div>
                  <h4 className="arcadia-see-next-card-title">
                    Time Management: A Productivity Tracking Web App
                  </h4>
                  <p className="arcadia-see-next-card-description">
                    Helping a company track employee productivity through an
                    intuitive, easy-to-navigate dashboard.
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

export default ArcadiaCaseStudy;
