import React, { useRef, useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useScrollReset from "../../hooks/useScrollReset";
import { useCountupAnimation } from "../../hooks/useCountupAnimation";
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
  const researchQuantitizeRef = useRef(null);
  const researchMethodologyRef = useRef(null);
  const researchAuditImageRef = useRef(null);
  const solutionTitleRef = useRef(null);
  const solutionIntroRef = useRef(null);
  const solutionAffinityImageRef = useRef(null);
  const solutionStakeholderRef = useRef(null);
  const solutionPairsImageRef = useRef(null);
  const impactTitleRef = useRef(null);
  const impactMetricsRefs = useRef([]);
  const impactStatsRef = useRef(null);
  const impactValueRefs = useRef([]);
  const impactSummaryRef = useRef(null);

  // Animated outcome numbers for the Impact section (count up on scroll).
  const impactMetrics = useMemo(
    () => [
      { value: 30, prefix: "", suffix: "%", elementRef: impactValueRefs, index: 0 },
      { value: 20, prefix: "", suffix: "%", elementRef: impactValueRefs, index: 1 },
    ],
    [],
  );
  useCountupAnimation(impactStatsRef, impactMetrics, 0.3, 2);
  const seeNextTitleRef = useRef(null);
  const seeNextGridRef = useRef(null);
  const seeNextCardsRefs = useRef([]);

  const handleSkipToSolution = () => {
    scrollToElement(document.getElementById("solution-section"), {
      duration: 1.2,
    });
  };

  // KPI framework — metrics grouped by journey phase and mapped solution.
  const kpiGroups = [
    {
      phase: "Program-level",
      solution: "S0 Pain-Point Tracker + S7 TaskFlow",
      rows: [
        { metric: "Weekly update rate", mapped: "S7 TaskFlow", target: "≥ 90%", dir: "up" },
        { metric: "Average task progress", mapped: "S7 TaskFlow", target: "Steady rise", dir: "up" },
        { metric: "Issue resolution rate", mapped: "S0 Tracker", target: "Closing ≥ opening", dir: "up" },
        { metric: "Issue recurrence rate", mapped: "S0 Tracker", target: "Downward", dir: "down" },
      ],
    },
    {
      phase: "AEC Intake",
      solution: "S1 Named owner + deadline",
      rows: [
        { metric: "Intake ownership rate", mapped: "S1 Intake", target: "100%", dir: "up" },
        { metric: "Intake response adherence", mapped: "S1 Intake", target: "≥ 90%", dir: "up" },
      ],
    },
    {
      phase: "Fabrication",
      solution: "S5 Model-change sign-off gate",
      rows: [
        { metric: "Sign-off compliance", mapped: "S5 Gate", target: "100%", dir: "up" },
        { metric: "Rework rate", mapped: "S5 Gate", target: "Downward", dir: "down" },
      ],
    },
    {
      phase: "Field / Delivery",
      solution: "S6 EOD check + same-day alerts",
      rows: [
        { metric: "End-of-day check rate", mapped: "S6 Field", target: "≥ 95%", dir: "up" },
        { metric: "Change-alert latency", mapped: "S6 Field", target: "Same day", dir: "down" },
      ],
    },
  ];

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
    createScrollAnimation(researchQuantitizeRef, 0.2);
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
              src="/work/arcadia/Revolution Steel Hero.png"
              alt="Revolution Steel"
              className="arcadia-hero-image"
              style={{ aspectRatio: "1200 / 356" }}
            />
          </div>

          <div className="arcadia-hero-content">
            {/* Left Column */}
            <div className="arcadia-hero-left">
              <h1 className="arcadia-hero-title">Revolution Steel</h1>
              <p className="arcadia-hero-category">
                Internal Workflow Tool, Arcadia Custom Builders
              </p>
              <div className="arcadia-hero-details">
                <div className="arcadia-hero-detail-item">
                  <div className="arcadia-hero-detail-label">TIMELINE</div>
                  <div className="arcadia-hero-detail-value">
                    August 2025 to July 2026
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
            <img
              src="/work/arcadia/Revolution Steel Shop.jpg"
              alt="Revolution Steel shop floor — the team working across steel framing stations"
              className="arcadia-hero-image"
              style={{ aspectRatio: "16 / 9", objectPosition: "center" }}
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
                  Three pain points surfaced across the journey, from intake
                  through delivery, that were costing the team the most time
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
                  Modelers block out walls with no predefined daily tasks, so
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
                I treated this as an embedded piece of{" "}
                <span style={{ fontWeight: 600 }}>qualitative research</span>.
                I ran semi-structured interviews with the leads who own each
                stage and the operators who model and build, sat in on the
                team's recurring meetings where problems surface out loud, and
                mapped the whole quote-to-fabrication journey in{" "}
                <span style={{ fontWeight: 600 }}>TheyDo</span>.
              </CaseStudyStatementBody>
              <CaseStudyStatementBody>
                Working the way the tool encourages, I coded what I heard into{" "}
                <span style={{ fontWeight: 600 }}>insights</span>, framed each
                as an <span style={{ fontWeight: 600 }}>opportunity</span>, and
                tied it to a concrete{" "}
                <span style={{ fontWeight: 600 }}>solution</span>, keeping
                every pain point anchored to the phase and the person it hits.
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

            <div className="arcadia-quantitize" ref={researchQuantitizeRef}>
              <p className="arcadia-ideation-text">
                To keep the study from ending at opinion, I quantitized the
                coded data,{" "}
                <span style={{ fontWeight: 600 }}>7 pain points</span> mapped
                across <span style={{ fontWeight: 600 }}>6 journey phases</span>{" "}
                and{" "}
                <span style={{ fontWeight: 600 }}>
                  5 thematic categories
                </span>
                . Communication and ownership carried the heaviest weight, and
                both cluster at the handoffs between phases rather than inside
                any one person's work.
              </p>
              <div className="arcadia-coding-breakdown">
                <span className="arcadia-coding-chip">
                  Communication{" "}
                  <span className="arcadia-coding-chip-count">×2</span>
                </span>
                <span className="arcadia-coding-chip">
                  Ownership{" "}
                  <span className="arcadia-coding-chip-count">×2</span>
                </span>
                <span className="arcadia-coding-chip">
                  Information currency{" "}
                  <span className="arcadia-coding-chip-count">×1</span>
                </span>
                <span className="arcadia-coding-chip">
                  Tracking &amp; accountability{" "}
                  <span className="arcadia-coding-chip-count">×1</span>
                </span>
                <span className="arcadia-coding-chip">
                  Visibility &amp; planning{" "}
                  <span className="arcadia-coding-chip-count">×1</span>
                </span>
              </div>
            </div>

            <CaseStudyStatement ref={researchMethodologyRef}>
              <CaseStudyStatementBody>
                After understanding the pain points, I ran a{" "}
                <span style={{ fontWeight: 600 }}>competitive audit</span> of
                what other companies in the space are doing, observing
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
                </span>
                , who had invested a lot of time into this project, so
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
                <img
                  src="/work/arcadia/Affinity mapping.png"
                  alt="Affinity mapping board organizing trends and pain points by stakeholder priority"
                  className="arcadia-userflow-image"
                  style={{ aspectRatio: "1147 / 395" }}
                />
              </div>
              <p className="arcadia-context-image-caption">
                One of the research sprints with the client from FigJam
                Workshop
              </p>
            </div>

            <div className="arcadia-solution-subsection" ref={solutionStakeholderRef}>
              <h4 className="arcadia-solution-subheading">
                Stakeholder Synthesis
              </h4>
              <p className="arcadia-ideation-text">
                In an affinity mapping workshop with the client, I clustered
                the raw observations by theme and re-ordered them by what
                stakeholders said was costing the most rework and delay.
                Distilled down, the 7 coded pain points pointed to three core
                insights that shaped the solution set.
              </p>
              <CaseStudyStatement variant="wide">
                <CaseStudyStatementBody>
                  <span className="arcadia-insight-evidence arcadia-insight-evidence--validated">
                    Validated
                  </span>
                  <br />
                  <span className="arcadia-requirements-label">
                    NO SYSTEM OF RECORD
                  </span>
                  <br />
                  The team surfaces friction verbally but has nowhere to log
                  it, so raised issues are never tracked to a close and tend
                  to recur, and talking about a problem had become a
                  substitute for solving it.
                </CaseStudyStatementBody>
                <CaseStudyStatementBody>
                  <span className="arcadia-insight-evidence arcadia-insight-evidence--emerging">
                    Emerging · observed
                  </span>
                  <br />
                  <span className="arcadia-requirements-label">
                    FRICTION LIVES AT THE HANDOFFS
                  </span>
                  <br />
                  Trouble concentrates in the seams between phases, not inside
                  any one person's work. Where ownership passes from one role
                  to the next, accountability blurs and information loses
                  currency, the origin of most rework.
                </CaseStudyStatementBody>
                <CaseStudyStatementBody>
                  <span className="arcadia-insight-evidence arcadia-insight-evidence--emerging">
                    Emerging · observed
                  </span>
                  <br />
                  <span className="arcadia-requirements-label">
                    VISIBILITY, NOT EFFORT
                  </span>
                  <br />
                  Work suffers less from a lack of effort than from the
                  absence of shared, up-front visibility. When the day's
                  tasks, owners, and completion bar aren't set before work
                  begins, people optimize locally and the sequence drifts.
                </CaseStudyStatementBody>
              </CaseStudyStatement>
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
                    No predefined daily tasks, so each modeler decides ad hoc
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

            <div
              className="arcadia-impact-metrics arcadia-impact-metrics--outcomes"
              ref={impactStatsRef}
            >
              <div
                className="arcadia-impact-metric"
                ref={(el) => (impactMetricsRefs.current[0] = el)}
              >
                <div
                  className="arcadia-impact-value"
                  ref={(el) => (impactValueRefs.current[0] = el)}
                >
                  30%
                </div>
                <div className="arcadia-impact-label">
                  Faster process once communication was streamlined and work
                  stopped stalling and duplicating at the handoffs.
                </div>
              </div>
              <div
                className="arcadia-impact-metric"
                ref={(el) => (impactMetricsRefs.current[1] = el)}
              >
                <div
                  className="arcadia-impact-value"
                  ref={(el) => (impactValueRefs.current[1] = el)}
                >
                  20%
                </div>
                <div className="arcadia-impact-label">
                  Gain in team effectiveness after setting clear goals and
                  tasks for every employee.
                </div>
              </div>
            </div>

            <p className="arcadia-ideation-text">
              With the workflow flowing seamlessly and no duplicated builds,
              the shop saved the company a meaningful amount of money, the
              time and material that used to disappear into rework and
              repeated effort. Each gain is tracked against the KPI framework
              below, so the improvement holds instead of drifting back.
            </p>

            <div
              className="arcadia-kpi-index"
              ref={(el) => (impactMetricsRefs.current[2] = el)}
            >
              <div className="arcadia-kpi-head">
                <div>
                  <h4 className="arcadia-kpi-title">KPI Index</h4>
                  <p className="arcadia-kpi-sub">
                    Revolution Steel workflow framework: metric, mapped
                    solution, target, and direction of improvement.
                  </p>
                </div>
                <div className="arcadia-kpi-legend">
                  <span className="arcadia-kpi-legend-item">
                    <span className="arcadia-kpi-arrow arcadia-kpi-arrow--up">
                      ▲
                    </span>{" "}
                    higher is better
                  </span>
                  <span className="arcadia-kpi-legend-item">
                    <span className="arcadia-kpi-arrow arcadia-kpi-arrow--down">
                      ▼
                    </span>{" "}
                    lower is better
                  </span>
                </div>
              </div>

              <div className="arcadia-kpi-colhead">
                <span>Metric</span>
                <span>Mapped to</span>
                <span>Target</span>
              </div>

              {kpiGroups.map((group) => (
                <div className="arcadia-kpi-group" key={group.phase}>
                  <div className="arcadia-kpi-group-bar">
                    {group.phase} · {group.solution}
                  </div>
                  {group.rows.map((row) => (
                    <div className="arcadia-kpi-row" key={row.metric}>
                      <div className="arcadia-kpi-metric">
                        <span
                          className={`arcadia-kpi-arrow arcadia-kpi-arrow--${row.dir}`}
                        >
                          {row.dir === "up" ? "▲" : "▼"}
                        </span>
                        <span>{row.metric}</span>
                      </div>
                      <div className="arcadia-kpi-mapped">{row.mapped}</div>
                      <div className="arcadia-kpi-target">
                        <span
                          className={`arcadia-kpi-pill arcadia-kpi-pill--${row.dir}`}
                        >
                          {row.target}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              <p className="arcadia-kpi-foot">
                KPI index for the quote-to-fabrication workflow study. Targets
                are baselining goals; values are collected via TaskFlow and
                the Pain-Point Tracker.
              </p>
            </div>

            <p className="arcadia-impact-summary" ref={impactSummaryRef}>
              Targets are baselining goals; as tracking data accrues, these
              move from targets to measured outcomes.
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
                to="/hiku"
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
                      src="/work/Hiku/thumbnail.mp4"
                      className="arcadia-see-next-image"
                      autoPlay
                      loop
                      muted
                      playsInline
                      aria-label="Hiku: A Mobile Application for Hiking Enthusiasts — preview"
                    />
                  </div>
                  <h4 className="arcadia-see-next-card-title">
                    Hiku: A Mobile Application for Hiking Enthusiasts
                  </h4>
                  <p className="arcadia-see-next-card-description">
                    Connecting hiking enthusiasts through community, shared
                    experiences, and a convenient way to buy or rent outdoor
                    gear.
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
