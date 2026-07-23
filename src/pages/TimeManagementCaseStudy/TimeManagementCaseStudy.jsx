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
import "./TimeManagementCaseStudy.css";

gsap.registerPlugin(ScrollTrigger);

const TimeManagementCaseStudy = () => {
  useScrollReset();
  const [isHoveringSeeNextCard, setIsHoveringSeeNextCard] = useState(false);
  const { scrollToElement } = useLenisScroll();

  const impactSectionRef = useRef(null);
  const metricRefs = useRef([]);

  // Refs for scroll animations
  const contextWhatIsTimeManagementRef = useRef(null);
  const contextMyRoleRef = useRef(null);
  const userFlowImageRef = useRef(null);
  const contextImpactTitleRef = useRef(null);
  const contextImpactMetricsRefs = useRef([]);
  const contextStatementTitleRef = useRef(null);
  const contextStatementContentRef = useRef(null);
  const researchTitleRef = useRef(null);
  const researchOverviewSubtitleRef = useRef(null);
  const solutionTitleRef = useRef(null);
  const solutionVisualIdentityContentRef = useRef(null);
  const solutionItem1TitleRef = useRef(null);
  const solutionItem1ContentRef = useRef(null);
  const solutionItem1VideoRef = useRef(null);
  const solutionItem1CaptionRef = useRef(null);
  const solutionItem2TitleRef = useRef(null);
  const solutionItem2ContentRef = useRef(null);
  const solutionItem2VideoRef = useRef(null);
  const solutionItem2CaptionRef = useRef(null);
  const takeawaysTitleRef = useRef(null);
  const takeawaysItemsRefs = useRef([]);
  const seeNextTitleRef = useRef(null);
  const seeNextGridRef = useRef(null);
  const seeNextCardsRefs = useRef([]);

  const handleSkipToSolution = () => {
    scrollToElement(document.getElementById("time-management-solutions"), {
      duration: 1.2,
    });
  };

  // Countup animation for metrics - memoize to prevent hook re-runs
  const metrics = useMemo(
    () => [
      {
        value: 50,
        prefix: "",
        suffix: "+",
        elementRef: metricRefs,
        index: 0,
      },
      {
        value: 20,
        prefix: "",
        suffix: "%",
        elementRef: metricRefs,
        index: 1,
      },
      {
        value: 30,
        prefix: "",
        suffix: "%",
        elementRef: metricRefs,
        index: 2,
      },
    ],
    [],
  );

  useCountupAnimation(impactSectionRef, metrics);

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
    createScrollAnimation(contextWhatIsTimeManagementRef);
    createScrollAnimation(contextMyRoleRef, 0.1);
    createScrollAnimation(userFlowImageRef, 0.1);
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

    // Research Section
    createScrollAnimation(researchTitleRef);
    createScrollAnimation(researchOverviewSubtitleRef, 0.1);

    // Development Section
    createScrollAnimation(solutionTitleRef);
    createScrollAnimation(solutionVisualIdentityContentRef, 0.1);

    createScrollAnimation(solutionItem1TitleRef);
    createScrollAnimation(solutionItem1ContentRef, 0.1);
    createScrollAnimation(solutionItem1VideoRef, 0.2);
    createScrollAnimation(solutionItem1CaptionRef, 0.3);

    createScrollAnimation(solutionItem2TitleRef);
    createScrollAnimation(solutionItem2ContentRef, 0.1);
    createScrollAnimation(solutionItem2VideoRef, 0.2);
    createScrollAnimation(solutionItem2CaptionRef, 0.3);

    // Key Takeaways Section
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

    // See Next Section
    createScrollAnimation(seeNextTitleRef);

    return () => {
      scrollTriggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="time-management-case-study">
      <CursorPill isHovering={isHoveringSeeNextCard} text="View case study" />
      <CaseStudyLayout projectId="time-management">
        {/* Hero Section */}
        <section className="time-management-hero-section">
          {/* Hero Before Image - Visual welcome */}
          <div className="time-management-hero-image-container time-management-hero-before">
            <img
              src="/work/time-management/iMac_Mockup_3.png"
              alt="Time Management"
              className="time-management-hero-image"
              style={{ height: "450px" }}
            />
          </div>

          {/* Hero Text Content */}
          <div className="time-management-hero-content">
            {/* Left Column */}
            <div className="time-management-hero-left">
              <h1 className="time-management-hero-title">Time Management</h1>
              <p className="time-management-hero-category">
                Time tracking Web Application
              </p>
              <div className="time-management-hero-details">
                <div className="time-management-hero-detail-item">
                  <div className="time-management-hero-detail-label">TIMELINE</div>
                  <div className="time-management-hero-detail-value">
                    Feb — March 2024
                  </div>
                </div>
                <div className="time-management-hero-detail-item">
                  <div className="time-management-hero-detail-label">ROLE</div>
                  <div className="time-management-hero-detail-value">
                    UX Researcher
                    <br />
                    UX Designer
                    <br />
                    Interaction Designer
                    <br />
                    Full Stack Developer
                  </div>
                </div>
                <div className="time-management-hero-detail-item">
                  <div className="time-management-hero-detail-label">TOOLS</div>
                  <div className="time-management-hero-detail-value">
                    Figma
                    <br />
                    VS Code
                    <br />
                    Cursor AI
                    <br />
                    Supabase SQL
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="time-management-hero-right">
              <p className="time-management-hero-subtitle">
                This is a web application that allows the company to track
                their employees' productivity and helps analyze the insights
                and increase employees' productivity.
              </p>
              <div className="time-management-hero-tags">
                <span className="time-management-hero-tag">Human Interface Design</span>
                <span className="time-management-hero-tag">UX Research</span>
                <span className="time-management-hero-tag">Data Application</span>
                <span className="time-management-hero-tag">Web Development</span>
              </div>
              <button
                className="time-management-skip-to-solution-btn"
                onClick={handleSkipToSolution}
              >
                <div className="time-management-skip-icon-container">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="time-management-skip-arrow"
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
                <span className="time-management-skip-text">SKIP TO SOLUTIONS</span>
              </button>
            </div>
          </div>

          {/* Hero After Image - After all text */}
          <div className="time-management-hero-image-container time-management-hero-after">
            <img
              src="/work/time-management/hero.png"
              alt="Time Management"
              className="time-management-hero-image"
              style={{ height: "400px" }}
            />
          </div>
        </section>

        {/* Context Section */}
        <section id="time-management-context" className="time-management-context-section">
          <div className="time-management-context-content">
            {/* Top Row - Two Columns */}
            <div className="time-management-context-top">
              <div className="time-management-context-item" ref={contextWhatIsTimeManagementRef}>
                <h2 className="time-management-context-title">Goal</h2>
                <p className="time-management-context-description">
                  The goal is to create an intuitive and easy experience for
                  the company to track and oversee the logins and the work
                  load of their employees.
                </p>
              </div>
              <div className="time-management-context-item" ref={contextMyRoleRef}>
                <h2 className="time-management-context-title">User Research</h2>
                <p className="time-management-context-description">
                  The application was something I was pretty confident of
                  from the start. The client gave me all the requirements,
                  and I immediately started giving him ideas, but he wanted a{" "}
                  <span style={{ fontWeight: 600 }}>
                    simple, not sophisticated and easy to navigate
                  </span>{" "}
                  and intuitive design. So I made sure to apply minimalist
                  principles in designing the web application and started
                  designing in Figma.
                </p>
                <p className="time-management-context-description">
                  But before that, I had to decide the different roles of
                  employees that would be using the application. Then I
                  defined the user flow and came up with a development plan
                  for{" "}
                  <span style={{ fontWeight: 600 }}>over 3 weeks</span>.
                </p>
              </div>
            </div>

            {/* User Flow Diagram */}
            <div className="time-management-userflow-image-container" ref={userFlowImageRef}>
              <img
                src="/work/time-management/user-flow.png"
                alt="Time Management Requirements, User Flow, and Roles Diagram"
                className="time-management-userflow-image"
                style={{ aspectRatio: "1360 / 438" }}
              />
            </div>

            {/* Bottom Row - Impact Metrics */}
            <div className="time-management-context-impact" ref={impactSectionRef}>
              <h3 className="time-management-impact-title" ref={contextImpactTitleRef}>
                Impact
              </h3>
              <div className="time-management-impact-metrics">
                <div
                  className="time-management-impact-metric"
                  ref={(el) => (contextImpactMetricsRefs.current[0] = el)}
                >
                  <div
                    className="time-management-impact-value"
                    ref={(el) => (metricRefs.current[0] = el)}
                  >
                    50+
                  </div>
                  <div className="time-management-impact-label">
                    EMPLOYEES SUPPORTED
                  </div>
                </div>
                <div
                  className="time-management-impact-metric"
                  ref={(el) => (contextImpactMetricsRefs.current[1] = el)}
                >
                  <div
                    className="time-management-impact-value"
                    ref={(el) => (metricRefs.current[1] = el)}
                  >
                    20%
                  </div>
                  <div className="time-management-impact-label">
                    INCREASE IN WORKFORCE EFFICIENCY
                  </div>
                </div>
                <div
                  className="time-management-impact-metric"
                  ref={(el) => (contextImpactMetricsRefs.current[2] = el)}
                >
                  <div
                    className="time-management-impact-value"
                    ref={(el) => (metricRefs.current[2] = el)}
                  >
                    30%
                  </div>
                  <div className="time-management-impact-label">
                    REDUCTION IN ADMIN EFFORT
                  </div>
                </div>
              </div>
            </div>

            {/* Context Statement Section */}
            <div className="time-management-context-statement">
              <h3
                className="time-management-context-statement-title"
                ref={contextStatementTitleRef}
              >
                REQUIREMENTS & USERS
              </h3>
              <CaseStudyStatement
                ref={contextStatementContentRef}
                variant="wide"
              >
                <CaseStudyStatementBody>
                  <span className="time-management-requirements-label">
                    REQUIREMENTS
                  </span>
                  <img
                    src="/work/time-management/frame-145.png"
                    alt="Time Management Requirements"
                    className="time-management-requirements-image"
                    style={{ aspectRatio: "1336 / 400" }}
                  />
                </CaseStudyStatementBody>
                <CaseStudyStatementBody>
                  <span className="time-management-requirements-label">USERS</span>
                  <img
                    src="/work/time-management/frame-147.png"
                    alt="Time Management Users"
                    className="time-management-requirements-image"
                    style={{ aspectRatio: "1460 / 340" }}
                  />
                </CaseStudyStatementBody>
                <CaseStudyStatementBody>
                  <span className="time-management-requirements-label">
                    MOTIVATIONS
                  </span>
                  <br />
                  A platform that can handle multiple functions within a
                  single application to save time.
                </CaseStudyStatementBody>
                <CaseStudyStatementBody>
                  <span className="time-management-requirements-label">
                    PAINPOINTS
                  </span>
                </CaseStudyStatementBody>
              </CaseStudyStatement>
              <div className="time-management-painpoints-tags">
                <span className="time-management-painpoint-tag">Lack of good UX</span>
                <span className="time-management-painpoint-tag">
                  Better user flow
                </span>
                <span className="time-management-painpoint-tag">Save time</span>
                <span className="time-management-painpoint-tag">
                  Security concerns
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Research Section */}
        <section id="time-management-research" className="time-management-research-section">
          <div className="time-management-research-content">
            <h3 className="time-management-research-title" ref={researchTitleRef}>
              IDEATION
            </h3>

            <CaseStudyStatement ref={researchOverviewSubtitleRef}>
              <CaseStudyStatementBody>
                During the ideation process, I came up with different types
                of screens, but{" "}
                <span style={{ fontWeight: 600 }}>the client</span> wanted
                the most{" "}
                <span style={{ fontWeight: 600 }}>
                  simplistic and easy to navigate
                </span>{" "}
                and intuitive design.
              </CaseStudyStatementBody>
              <CaseStudyStatementBody>
                So I followed Apple's guidelines to provide the best
                experience for the client.
              </CaseStudyStatementBody>
              <CaseStudyStatementBody>
                But one interesting feature was to give our different{" "}
                <span style={{ fontWeight: 600 }}>
                  skillsets to employees
                </span>{" "}
                to improve the skill that they select over time. It helped
                the employees a lot to{" "}
                <span style={{ fontWeight: 600 }}>
                  focus on what they were actually lacking
                </span>{" "}
                in.
              </CaseStudyStatementBody>
            </CaseStudyStatement>

            <div className="time-management-ideation-subsection">
              <h4 className="time-management-ideation-subheading">Color Palette</h4>
              <p className="time-management-ideation-text">
                This project adopted a minimalistic visual style, using
                primary blue and white to build the brand and also convey
                trust. I also followed the 60-30-10 rule to maintain a
                better visual balance.
              </p>
              <div className="time-management-swatch-row">
                <div className="time-management-swatch">
                  <div
                    className="time-management-swatch-block"
                    style={{ background: "#1A56DB" }}
                  />
                  <div className="time-management-swatch-hex">#1A56DB</div>
                  <div className="time-management-swatch-label">PRIMARY</div>
                </div>
                <div className="time-management-swatch">
                  <div
                    className="time-management-swatch-block time-management-swatch-block-bordered"
                    style={{ background: "#FFFFFF" }}
                  />
                  <div className="time-management-swatch-hex">#FFFFFF</div>
                  <div className="time-management-swatch-label">PRIMARY</div>
                </div>
                <div className="time-management-swatch">
                  <div
                    className="time-management-swatch-block"
                    style={{ background: "#000000" }}
                  />
                  <div className="time-management-swatch-hex">#000000</div>
                  <div className="time-management-swatch-label">SECONDARY</div>
                </div>
                <div className="time-management-swatch">
                  <div
                    className="time-management-swatch-block"
                    style={{ background: "#D9D9D9" }}
                  />
                  <div className="time-management-swatch-hex">#D9D9D9</div>
                  <div className="time-management-swatch-label">SECONDARY</div>
                </div>
              </div>
            </div>

            <div className="time-management-ideation-subsection">
              <h4 className="time-management-ideation-subheading">Typography</h4>
              <p className="time-management-ideation-text">
                I used San Serif for this web application for its easy to
                understand, approachable design that aligns with the
                application's clean and emerging aesthetic.
              </p>
              <img
                src="/work/time-management/frame-156.png"
                alt="Time Management Typography"
                className="time-management-type-sample-image"
                style={{ aspectRatio: "807 / 575" }}
              />
            </div>
          </div>
        </section>

        {/* Development Section */}
        <section id="solution-section" className="time-management-solution-section">
          <div className="time-management-solution-content">
            <h3 className="time-management-solution-title" ref={solutionTitleRef}>
              DEVELOPMENT
            </h3>

            <div
              className="time-management-solution-visual-identity-content"
              ref={solutionVisualIdentityContentRef}
            >
              <p className="time-management-solution-visual-identity-text">
                I love{" "}
                <span className="time-management-solution-visual-identity-medium-bold">
                  designing applications
                </span>{" "}
                and seeing them come alive. But I'll tell you, development is
                something out of my league—at least that's what I thought
                until I worked on this project. I learned how databases
                work, and how to code while still maintaining the UI, so it
                doesn't compromise the client's vision.
              </p>
              <p className="time-management-solution-visual-identity-text">
                In this process I also learned how to{" "}
                <span className="time-management-solution-visual-identity-medium-bold">
                  vibe code
                </span>
                . Although I don't use AI for idea generation, using it as a
                tool to build a more functional web application was
                something I enjoyed experimenting with.
              </p>
            </div>

            <div className="time-management-solution-subsection">
              <h4 className="time-management-solution-subheading">
                Low Fidelity Prototypes
              </h4>
              <div className="time-management-wireframe-container">
                <iframe
                  src="/work/time-management/wireframe-lofi-prototypes.html"
                  title="Lo-Fi Wireframes – Time Management"
                  className="time-management-wireframe-frame"
                  style={{ height: "1130px" }}
                  scrolling="no"
                />
              </div>
            </div>

            <div className="time-management-solution-subsection">
              <h4 className="time-management-solution-subheading">
                High Fidelity Prototypes
              </h4>
              <div className="time-management-hifi-gallery">
                <img
                  src="/work/time-management/final-login.png"
                  alt="High-fidelity Login screen"
                  className="time-management-hifi-image"
                  style={{ aspectRatio: "1440 / 1024" }}
                />
                <img
                  src="/work/time-management/final-client-registration.png"
                  alt="High-fidelity Register New Client screen"
                  className="time-management-hifi-image"
                  style={{ aspectRatio: "1440 / 1668" }}
                />
                <img
                  src="/work/time-management/final-admin-client-registration.png"
                  alt="High-fidelity Register New Client screen, admin variant"
                  className="time-management-hifi-image"
                  style={{ aspectRatio: "1440 / 1484" }}
                />
                <img
                  src="/work/time-management/final-user-dashboard.png"
                  alt="High-fidelity User Dashboard screen"
                  className="time-management-hifi-image"
                  style={{ aspectRatio: "1440 / 1024" }}
                />
                <img
                  src="/work/time-management/final-admin-dashboard.png"
                  alt="High-fidelity Admin Dashboard screen"
                  className="time-management-hifi-image"
                  style={{ aspectRatio: "1440 / 1024" }}
                />
              </div>
              <p className="time-management-hifi-caption">
                These high-fidelity screens show the final, coded product: a
                branded login gate, two variations of the Register New Client
                form that capture company details, billing, and portal
                access, and role-specific dashboards for Users and Admins.
                The User Dashboard surfaces day-to-day tools like client and
                project registration, while the Admin Dashboard streamlines
                navigation down to Clients, Time Tracking, and Settings for
                higher-level oversight. Together they reflect the clean,
                minimal visual language defined earlier in the style guide,
                carried through from wireframe to working interface.
              </p>
            </div>

            <div id="time-management-solutions">
            <div className="time-management-solution-item">
              <h4
                className="time-management-solution-item-title"
                ref={solutionItem1TitleRef}
              >
                Solution #1: Centralized Organization & User Management
              </h4>
              <CaseStudyStatement ref={solutionItem1ContentRef}>
                <CaseStudyStatementHeadline>
                  Organization details and the full team roster live in{" "}
                  <span className="time-management-accent-text">one admin view</span>.
                </CaseStudyStatementHeadline>
              </CaseStudyStatement>
              <div className="time-management-solution-media">
                <div
                  className="time-management-solution-video-container"
                  ref={solutionItem1VideoRef}
                >
                  <video
                    src="/work/time-management/organization-user-management.mp4"
                    className="time-management-solution-video"
                    style={{ aspectRatio: "1920 / 1080" }}
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
                <p
                  className="time-management-solution-caption"
                  ref={solutionItem1CaptionRef}
                >
                  Admins can edit organization details and manage the entire
                  user roster from one screen, with the table{" "}
                  <span className="time-management-solution-caption-semi-bold">
                    updating live
                  </span>{" "}
                  as records change. This pulled what used to be scattered
                  admin tasks into the single application the client asked
                  for, saving time on everyday account management.
                </p>
              </div>
            </div>

            <div className="time-management-solution-item">
              <h4
                className="time-management-solution-item-title"
                ref={solutionItem2TitleRef}
              >
                Solution #2: Employee Skill Tracking
              </h4>
              <CaseStudyStatement ref={solutionItem2ContentRef}>
                <CaseStudyStatementHeadline>
                  Every employee profile tracks{" "}
                  <span className="time-management-accent-text">
                    real skills and proficiency
                  </span>
                  .
                </CaseStudyStatementHeadline>
              </CaseStudyStatement>
              <div className="time-management-solution-media">
                <div
                  className="time-management-solution-video-container"
                  ref={solutionItem2VideoRef}
                >
                  <video
                    src="/work/time-management/employee-skill-tracking.mp4"
                    className="time-management-solution-video"
                    style={{ aspectRatio: "1892 / 864" }}
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
                <p
                  className="time-management-solution-caption"
                  ref={solutionItem2CaptionRef}
                >
                  Every user profile includes a Skills section where admins
                  can add a skill and set a proficiency level, alongside
                  address and employment details in the same form. This was
                  one of the more interesting ideas to come out of
                  ideation:{" "}
                  <span className="time-management-solution-caption-semi-bold">
                    giving employees a clear view of where they stood
                  </span>{" "}
                  so they could focus on what they were actually lacking.
                </p>
              </div>
            </div>
            </div>
          </div>
        </section>

        {/* Key Takeaways Section */}
        <section id="time-management-takeaways" className="time-management-takeaways-section">
          <div className="time-management-takeaways-content">
            <h3 className="time-management-takeaways-title" ref={takeawaysTitleRef}>
              PROJECT TAKEAWAYS
            </h3>
            <div
              className="time-management-takeaways-item"
              ref={(el) => (takeawaysItemsRefs.current[0] = el)}
            >
              <p className="time-management-takeaways-description">
                Working in this application has really pushed my limits on
                how to execute a Web Application from the most early stages
                of designing to execution.
              </p>
            </div>
          </div>
        </section>

        {/* See Next Section */}
        <section id="time-management-see-next" className="time-management-see-next-section">
          <div className="time-management-see-next-content">
            <h3 className="time-management-see-next-title" ref={seeNextTitleRef}>
              SEE NEXT
            </h3>
            <div
              className="time-management-see-next-grid"
              ref={seeNextGridRef}
              data-case-study-nav-boundary
            >
              <Link
                to="/arcadia-custom-builders"
                className="time-management-see-next-card-link"
                onMouseEnter={() => setIsHoveringSeeNextCard(true)}
                onMouseLeave={() => setIsHoveringSeeNextCard(false)}
              >
                <div
                  className="time-management-see-next-card"
                  ref={(el) => (seeNextCardsRefs.current[0] = el)}
                >
                  <div className="time-management-see-next-image-container">
                    <video
                      src="/work/arcadia/arcadia custom.mp4"
                      className="time-management-see-next-image"
                      autoPlay
                      loop
                      muted
                      playsInline
                      aria-label="Revolution Steel: Construction Workflow Optimisation — preview"
                    />
                  </div>
                  <h4 className="time-management-see-next-card-title">
                    Revolution Steel: Construction Workflow Optimisation
                  </h4>
                  <p className="time-management-see-next-card-description">
                    Helping Revolution Steel formulate a user workflow so work
                    gets distributed clearly and tasks are streamlined across
                    the team.
                  </p>
                </div>
              </Link>
              <Link
                to="/quizai"
                className="time-management-see-next-card-link"
                onMouseEnter={() => setIsHoveringSeeNextCard(true)}
                onMouseLeave={() => setIsHoveringSeeNextCard(false)}
              >
                <div
                  className="time-management-see-next-card"
                  ref={(el) => (seeNextCardsRefs.current[1] = el)}
                >
                  <div className="time-management-see-next-image-container">
                    <video
                      src="/work/quizai/thumbnail.mp4"
                      className="time-management-see-next-image"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  </div>
                  <h4 className="time-management-see-next-card-title">
                    QuizAI: AI Powered Notetaking Application
                  </h4>
                  <p className="time-management-see-next-card-description">
                    Helping students turn uploaded notes into personalized
                    quizzes and summaries through a centralized study dashboard.
                  </p>
                </div>
              </Link>
              <Link
                to="/hiku"
                className="time-management-see-next-card-link"
                onMouseEnter={() => setIsHoveringSeeNextCard(true)}
                onMouseLeave={() => setIsHoveringSeeNextCard(false)}
              >
                <div
                  className="time-management-see-next-card"
                  ref={(el) => (seeNextCardsRefs.current[2] = el)}
                >
                  <div className="time-management-see-next-image-container">
                    <video
                      src="/work/Hiku/thumbnail.mp4"
                      className="time-management-see-next-image"
                      autoPlay
                      loop
                      muted
                      playsInline
                      aria-label="Hiku: A Mobile Application for Hiking Enthusiasts — preview"
                    />
                  </div>
                  <h4 className="time-management-see-next-card-title">
                    Hiku: A Mobile Application for Hiking Enthusiasts
                  </h4>
                  <p className="time-management-see-next-card-description">
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

export default TimeManagementCaseStudy;

