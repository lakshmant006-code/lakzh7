import React, { useRef, useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useScrollReset from "../../hooks/useScrollReset";
import { useLenisScroll } from "../../hooks/useLenisScroll";
import { useCardUnfurling } from "../../hooks/useCardUnfurling";
import { useCountupAnimation } from "../../hooks/useCountupAnimation";
import Footer from "../../components/Footer/Footer";
import CursorPill from "../../components/CursorPill/CursorPill";
import CaseStudyLayout from "../../components/CaseStudyLayout/CaseStudyLayout";
import {
  CaseStudyStatement,
  CaseStudyStatementBody,
  CaseStudyStatementHeadline,
} from "../../components/CaseStudyStatement/CaseStudyStatement";
import "./QuizAICaseStudy.css";

gsap.registerPlugin(ScrollTrigger);

const QuizAICaseStudy = () => {
  useScrollReset();
  const [isHoveringSeeNextCard, setIsHoveringSeeNextCard] = useState(false);
  const { scrollToElement } = useLenisScroll();

  // Refs for scroll animations
  const contextWhatIsQuizAIRef = useRef(null);
  const contextMyRoleRef = useRef(null);
  const impactSectionRef = useRef(null);
  const metricRefs = useRef([]);
  const contextImpactMetricsRefs = useRef([]);
  const researchTitleRef = useRef(null);
  const researchOverviewSubtitleRef = useRef(null);
  const researchOverviewImageRef = useRef(null);
  const researchFindingImageRef = useRef(null);
  const designApproachTitleRef = useRef(null);
  const designApproach1TitleRef = useRef(null);
  const designApproach1ContentRef = useRef(null);
  const designApproach1ImageRef = useRef(null);
  const designApproach2TitleRef = useRef(null);
  const designApproach2ContentRef = useRef(null);
  const designApproach2Image1Ref = useRef(null);
  const designApproachHighFiTitleRef = useRef(null);
  const designApproachHighFiContentRef = useRef(null);
  const designApproachHighFiImagesRef = useRef(null);
  const solution1TitleRef = useRef(null);
  const solution1ContentRef = useRef(null);
  const solution1VideoRef = useRef(null);
  const solution1CaptionRef = useRef(null);
  const solution2TitleRef = useRef(null);
  const solution2ContentRef = useRef(null);
  const solution2VideoRef = useRef(null);
  const solution2CaptionRef = useRef(null);
  const reflectionTitleRef = useRef(null);
  const reflectionContentRef = useRef(null);
  const seeNextTitleRef = useRef(null);
  const seeNextGridRef = useRef(null);
  const seeNextCardsRefs = useRef([]);

  const metrics = useMemo(
    () => [
      {
        value: 24,
        prefix: "15-",
        suffix: "",
        elementRef: metricRefs,
        index: 0,
      },
      {
        value: 100,
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

  const handleSkipToSolution = () => {
    scrollToElement(document.getElementById("solution-section"), {
      duration: 1.2,
    });
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
    createScrollAnimation(contextWhatIsQuizAIRef);
    createScrollAnimation(contextMyRoleRef, 0.1);
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

    // Research Section
    createScrollAnimation(researchTitleRef);
    createScrollAnimation(researchOverviewSubtitleRef, 0.1);
    createScrollAnimation(researchOverviewImageRef, 0.2);
    createScrollAnimation(researchFindingImageRef);

    // Design Approach Section
    createScrollAnimation(designApproachTitleRef);
    // Design Approach 1
    createScrollAnimation(designApproach1TitleRef);
    createScrollAnimation(designApproach1ContentRef, 0.1);
    createScrollAnimation(designApproach1ImageRef, 0.2);
    // Design Approach 2
    createScrollAnimation(designApproach2TitleRef);
    createScrollAnimation(designApproach2ContentRef, 0.1);
    createScrollAnimation(designApproach2Image1Ref, 0.2);
    // Design Approach High-Fi Frames
    createScrollAnimation(designApproachHighFiTitleRef);
    createScrollAnimation(designApproachHighFiContentRef, 0.1);
    createScrollAnimation(designApproachHighFiImagesRef, 0.2);
    // Solution Section
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
    // Reflection Section
    createScrollAnimation(reflectionTitleRef);
    createScrollAnimation(reflectionContentRef, 0.1);

    // See Next Section
    createScrollAnimation(seeNextTitleRef);

    return () => {
      scrollTriggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="quizai-case-study">
      <CursorPill isHovering={isHoveringSeeNextCard} text="View case study" />
      <CaseStudyLayout projectId="quizai">
      {/* Hero Section */}
      <section className="quizai-hero-section">
        {/* Hero Before Image - Visual welcome */}
        <div className="quizai-hero-image-container quizai-hero-before">
          <img
            src="/work/quizai/hero-before.png"
            alt="QuizAI landing page mockup on a laptop screen"
            className="quizai-hero-image"
          />
        </div>

        {/* Hero Text Content */}
        <div className="quizai-hero-content">
          {/* Left Column */}
          <div className="quizai-hero-left">
            <h1 className="quizai-hero-title">
              AI Powered Notetaking Application
            </h1>
            <div className="quizai-hero-details">
              <div className="quizai-hero-detail-item">
                <div className="quizai-hero-detail-label">ROLE</div>
                <div className="quizai-hero-detail-value">
                  UX Researcher, UX Designer,<br />
                  Interaction Designer, and Developer
                </div>
              </div>
              <div className="quizai-hero-detail-item">
                <div className="quizai-hero-detail-label">DURATION</div>
                <div className="quizai-hero-detail-value">
                  September — November 2024 (10 weeks)
                </div>
              </div>
              <div className="quizai-hero-detail-item">
                <div className="quizai-hero-detail-label">TOOLS</div>
                <div className="quizai-hero-detail-value">
                  Figma, React, TypeScript, Node.js, Cursor
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="quizai-hero-right">
            <p className="quizai-hero-subtitle">
              To create an intuitive and easy experience for students to
              maintain and improve their productivity.
            </p>
            <div className="quizai-hero-tags">
              <span className="quizai-hero-tag">Human Interface Design</span>
              <span className="quizai-hero-tag">UX Research</span>
              <span className="quizai-hero-tag">Data Application</span>
              <span className="quizai-hero-tag">Web Development</span>
            </div>
            <button
              className="quizai-skip-to-solution-btn"
              onClick={handleSkipToSolution}
            >
              <div className="quizai-skip-icon-container">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="quizai-skip-arrow"
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
              <span className="quizai-skip-text">SKIP TO SOLUTION</span>
            </button>
          </div>
        </div>

        {/* Hero After Image - After all text */}
        <div className="quizai-hero-image-container quizai-hero-after">
          <img
            src="/work/quizai/hero-new.png"
            alt="QuizAI landing page, dashboard, and AI study assistant screens"
            className="quizai-hero-image"
          />
        </div>
      </section>

      {/* Context Section */}
      <section id="quizai-context" className="quizai-context-section">
        <div className="quizai-context-content">
          {/* Top Row - Two Columns */}
          <div className="quizai-context-top">
            <div className="quizai-context-item" ref={contextWhatIsQuizAIRef}>
              <h2 className="quizai-context-title">What is Quiz AI?</h2>
              <p className="quizai-context-description">
                This is a web application that allows students to upload their
                notes and generate summaries and quizzes leveraging OpenAI API
                based on the notes that are uploaded.
              </p>
            </div>
            <div className="quizai-context-item" ref={contextMyRoleRef}>
              <h2 className="quizai-context-title">My Role</h2>
              <p className="quizai-context-description">
                I wore multiple hats across this project — conducting user
                research with students, translating findings into interaction
                patterns, and building the full-stack implementation. I owned
                the end-to-end experience from early sketches through shipped
                code, collaborating closely with stakeholders to shape both the
                product vision and its technical execution.
              </p>
            </div>
          </div>

          <div className="quizai-context-impact" ref={impactSectionRef}>
            <div className="quizai-impact-metrics">
              <div
                className="quizai-impact-metric"
                ref={(el) => (contextImpactMetricsRefs.current[0] = el)}
              >
                <div
                  className="quizai-impact-value"
                  ref={(el) => (metricRefs.current[0] = el)}
                >
                  15–24
                </div>
                <div className="quizai-impact-label">TARGET AGE GROUP</div>
              </div>
              <div
                className="quizai-impact-metric"
                ref={(el) => (contextImpactMetricsRefs.current[1] = el)}
              >
                <div
                  className="quizai-impact-value"
                  ref={(el) => (metricRefs.current[1] = el)}
                >
                  100%
                </div>
                <div className="quizai-impact-label">TASK COMPLETION RATE</div>
              </div>
              <div
                className="quizai-impact-metric"
                ref={(el) => (contextImpactMetricsRefs.current[2] = el)}
              >
                <div
                  className="quizai-impact-value"
                  ref={(el) => (metricRefs.current[2] = el)}
                >
                  30%
                </div>
                <div className="quizai-impact-label">
                  REDUCTION IN STUDY PREP TIME
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Research Section */}
      <section id="quizai-research" className="quizai-research-section">
        <div className="quizai-research-content">
          <h3 className="quizai-research-title" ref={researchTitleRef}>
            RESEARCH
          </h3>

          <div className="quizai-research-overview">
            <CaseStudyStatement ref={researchOverviewSubtitleRef}>
              <CaseStudyStatementHeadline as="h4">
                What's <span className="quizai-accent-text">really</span> going
                on?
              </CaseStudyStatementHeadline>
              <CaseStudyStatementHeadline as="h4">
                Research &amp; User Discovery
              </CaseStudyStatementHeadline>
              <CaseStudyStatementBody>
                The project began with understanding the study habits,
                challenges, and goals of students, teachers, and
                self-learners. Research revealed that users often struggle to
                organize learning materials and convert them into effective
                study resources.
              </CaseStudyStatementBody>
              <CaseStudyStatementHeadline as="h4">
                Key Insights &amp; Problem Definition
              </CaseStudyStatementHeadline>
              <CaseStudyStatementBody>
                Users highlighted common pain points such as time-consuming
                quiz creation, information overload, and difficulty tracking
                learning progress. They also expressed a strong need for
                personalized learning experiences and meaningful feedback to
                improve retention.
              </CaseStudyStatementBody>
              <CaseStudyStatementHeadline as="h4">
                Design Impact &amp; Feature Direction
              </CaseStudyStatementHeadline>
              <CaseStudyStatementBody>
                These findings directly influenced the development of
                AI-powered quizzes, automated summaries, study groups, and
                progress tracking features. Every design decision was guided
                by the goal of creating a seamless, engaging, and
                personalized learning experience.
              </CaseStudyStatementBody>
            </CaseStudyStatement>
            <div
              className="quizai-research-image-container"
              ref={researchOverviewImageRef}
            >
              <img
                src="/work/quizai/user-journey.png"
                alt="User Journey"
                className="quizai-research-image"
              />
            </div>
          </div>

          {/* Research Finding */}
          <div className="quizai-research-finding">
            <div
              className="quizai-research-image-container"
              ref={researchFindingImageRef}
            >
              <iframe
                src="/work/quizai/design-process/index.html"
                title="Design Process – QuizAI"
                className="quizai-research-image quizai-wireframe-frame"
                style={{ height: "700px" }}
                scrolling="no"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Design Approach Section */}
      <section id="quizai-design-approach" className="quizai-design-approach-section">
        <div className="quizai-design-approach-content">
          <h3
            className="quizai-design-approach-title"
            ref={designApproachTitleRef}
          >
            DESIGN APPROACH
          </h3>

          {/* Design Approach #1 */}
          <div className="quizai-design-approach-item">
            <CaseStudyStatement
              ref={designApproach1ContentRef}
              variant="narrow"
              className="quizai-design-approach-statement"
            >
              <CaseStudyStatementHeadline
                as="h4"
                ref={designApproach1TitleRef}
              >
                Streamlining the Upload-to-Quiz Flow
              </CaseStudyStatementHeadline>
              <CaseStudyStatementBody>
                Research showed students were dropping off after uploading —
                the path from document to quiz wasn't clear. The redesigned
                flow makes each step explicit:{" "}
                <span style={{ fontWeight: 600 }}>upload, process, generate</span>
                {" "}— so students always know where they are and what comes next.
              </CaseStudyStatementBody>
            </CaseStudyStatement>
            <div
              className="quizai-design-approach-image-container"
              ref={designApproach1ImageRef}
            >
              <img
                src="/work/quizai/user-journey-mapping-frame-1.svg"
                alt="QuizAI User Flow"
                className="quizai-design-approach-image"
              />
            </div>
          </div>

          {/* Design Approach #2 */}
          <div className="quizai-design-approach-item">
            <CaseStudyStatement
              ref={designApproach2ContentRef}
              className="quizai-design-approach-statement"
            >
              <CaseStudyStatementHeadline
                as="h4"
                ref={designApproach2TitleRef}
              >
                From Research to Design
              </CaseStudyStatementHeadline>
              <CaseStudyStatementBody>
                To address the information overload students described, I pulled
                frequently-accessed materials to the front of the dashboard and
                placed AI-generated summaries and quizzes{" "}
                <span style={{ fontWeight: 600 }}>
                  one click away from any uploaded document
                </span>
                .
              </CaseStudyStatementBody>
            </CaseStudyStatement>
            <div
              className="quizai-design-approach-image-container"
              ref={designApproach2Image1Ref}
            >
              <iframe
                src="/work/quizai/wireframe-lofi-flows.html"
                title="Lo-Fi Wireframes – QuizAI"
                className="quizai-design-approach-image quizai-wireframe-frame"
                style={{ height: "650px" }}
                scrolling="no"
              />
            </div>
          </div>

          {/* Design Approach High-Fi Frames */}
          <div className="quizai-design-approach-item">
            <CaseStudyStatement
              ref={designApproachHighFiContentRef}
              className="quizai-design-approach-statement"
            >
              <CaseStudyStatementHeadline
                as="h4"
                ref={designApproachHighFiTitleRef}
              >
                High Fidelity Frames
              </CaseStudyStatementHeadline>
              <CaseStudyStatementBody>
                With the lo-fi structure validated, I translated each flow into{" "}
                <span style={{ fontWeight: 600 }}>
                  polished, ready-to-build screens
                </span>{" "}
                covering sign-in, quiz history, and study session summaries.
              </CaseStudyStatementBody>
            </CaseStudyStatement>
            <div
              className="quizai-highfi-frames-grid"
              ref={designApproachHighFiImagesRef}
            >
              <img
                src="/work/quizai/highfi-login.png"
                alt="QuizAI High Fidelity Sign In Screen"
                className="quizai-highfi-frame-image"
                style={{ aspectRatio: "493 / 271" }}
              />
              <img
                src="/work/quizai/highfi-quiz-history.png"
                alt="QuizAI High Fidelity Quiz History Screen"
                className="quizai-highfi-frame-image"
                style={{ aspectRatio: "559 / 271" }}
              />
              <img
                src="/work/quizai/highfi-study-session.png"
                alt="QuizAI High Fidelity Study Session Summaries Screen"
                className="quizai-highfi-frame-image"
                style={{ aspectRatio: "555 / 270" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution-section" className="quizai-solution-section">
        <div className="quizai-solution-content">
          {/* Solution #1 */}
          <div className="quizai-solution-item">
            <h4 className="quizai-solution-item-title" ref={solution1TitleRef}>
              Solution #1: Centralized Study Dashboard
            </h4>
            <CaseStudyStatement ref={solution1ContentRef}>
              <CaseStudyStatementHeadline>
                All study materials live in{" "}
                <span className="quizai-accent-text">one dashboard</span>.
              </CaseStudyStatementHeadline>
            </CaseStudyStatement>
            <div className="quizai-solution-media">
              <div
                className="quizai-solution-video-container"
                ref={solution1VideoRef}
              >
                <video
                  src="/work/quizai/quizai-dashboard-v1.mp4"
                  className="quizai-solution-video"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
              <p className="quizai-solution-caption" ref={solution1CaptionRef}>
                The dashboard section brings every study material, upload,
                and AI-generated summary into a{" "}
                <span style={{ fontWeight: 600 }}>
                  single, organized view
                </span>
                . This centralized structure let students pick up exactly
                where they left off, without digging through scattered files
                or tabs.
              </p>
            </div>
          </div>

          {/* Solution #2 */}
          <div className="quizai-solution-item">
            <h4 className="quizai-solution-item-title" ref={solution2TitleRef}>
              Solution #2: One-Click AI Quiz Generation
            </h4>
            <CaseStudyStatement ref={solution2ContentRef}>
              <CaseStudyStatementHeadline>
                Any uploaded document transforms into a{" "}
                <span className="quizai-accent-text">
                  ready-to-take quiz
                </span>
                .
              </CaseStudyStatementHeadline>
            </CaseStudyStatement>
            <div className="quizai-solution-media">
              <div
                className="quizai-solution-video-container"
                ref={solution2VideoRef}
              >
                <video
                  src="/work/quizai/quiz-generation.mp4"
                  className="quizai-solution-video"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
              <p className="quizai-solution-caption" ref={solution2CaptionRef}>
                Students can generate a quiz directly from any uploaded
                document with one click, turning dense readings into{" "}
                <span style={{ fontWeight: 600 }}>
                  instant, testable practice
                </span>
                . An AI chat assistant sits alongside it for follow-up
                questions, removing the manual work of writing study
                questions by hand.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Reflection Section */}
      <section id="quizai-reflection" className="quizai-reflection-section">
        <div className="quizai-reflection-content">
          <h3 className="quizai-reflection-title" ref={reflectionTitleRef}>
            REFLECTION
          </h3>
          <div className="quizai-reflection-item" ref={reflectionContentRef}>
            <h4 className="quizai-reflection-title-text">
              This was my first design role as Quiz AI's only designer, handling
              both product design and development.
            </h4>
            <p className="quizai-reflection-description">
              Working in this application has really pushed my limits on how
              to execute a Web Application from the most early stages of
              designing to execution.
            </p>
            <p className="quizai-reflection-subheading">
              Universal Learning, Not Just Equal Learning
            </p>
            <p className="quizai-reflection-description">
              This project deepened my understanding of equity in education
              technology. QuizAI isn&apos;t just built for everyone—it&apos;s
              built to support individual learning styles, especially for
              those who may not thrive in traditional environments. This
              balance between universal access and personalized engagement
              shaped the core of my design choices.
            </p>
          </div>
        </div>
      </section>

      {/* See Next Section */}
      <section id="quizai-see-next" className="quizai-see-next-section">
        <div className="quizai-see-next-content">
          <h3 className="quizai-see-next-title" ref={seeNextTitleRef}>
            SEE NEXT
          </h3>
          <div
            className="quizai-see-next-grid"
            ref={seeNextGridRef}
            data-case-study-nav-boundary
          >
            <Link
              to="/time-management"
              className="quizai-see-next-card-link"
              onMouseEnter={() => setIsHoveringSeeNextCard(true)}
              onMouseLeave={() => setIsHoveringSeeNextCard(false)}
            >
              <div
                className="quizai-see-next-card"
                ref={(el) => (seeNextCardsRefs.current[0] = el)}
              >
                <div className="quizai-see-next-image-container">
                  <video
                    src="/work/time-management/thumbnail.mp4"
                    className="quizai-see-next-image"
                    style={{ aspectRatio: "1920 / 1438" }}
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
                <h4 className="quizai-see-next-card-title">
                  Time Management: A Productivity Tracking Web App
                </h4>
                <p className="quizai-see-next-card-description">
                  Helping a company track employee productivity through an
                  intuitive, easy-to-navigate time management dashboard.
                </p>
              </div>
            </Link>
            <Link
              to="/venmo"
              className="quizai-see-next-card-link"
              onMouseEnter={() => setIsHoveringSeeNextCard(true)}
              onMouseLeave={() => setIsHoveringSeeNextCard(false)}
            >
              <div
                className="quizai-see-next-card"
                ref={(el) => (seeNextCardsRefs.current[1] = el)}
              >
                <div className="quizai-see-next-image-container">
                  <video
                    src="/work/venmo/thumbnail.mp4"
                    className="quizai-see-next-image"
                    style={{ aspectRatio: "1920 / 1080" }}
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
                <h4 className="quizai-see-next-card-title">
                  Redesigning Venmo's Privacy Model
                </h4>
                <p className="quizai-see-next-card-description">
                  Shifting from public-by-default to private-by-default with
                  privacy controls surfaced where users make decisions.
                </p>
              </div>
            </Link>
            <Link
              to="/hiku"
              className="quizai-see-next-card-link"
              onMouseEnter={() => setIsHoveringSeeNextCard(true)}
              onMouseLeave={() => setIsHoveringSeeNextCard(false)}
            >
              <div
                className="quizai-see-next-card"
                ref={(el) => (seeNextCardsRefs.current[2] = el)}
              >
                <div className="quizai-see-next-image-container">
                  <video
                    src="/work/Hiku/thumbnail.mp4"
                    className="quizai-see-next-image"
                    autoPlay
                    loop
                    muted
                    playsInline
                    aria-label="Hiku: A Mobile Application for Hiking Enthusiasts — preview"
                  />
                </div>
                <h4 className="quizai-see-next-card-title">
                  Hiku: A Mobile Application for Hiking Enthusiasts
                </h4>
                <p className="quizai-see-next-card-description">
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

export default QuizAICaseStudy;

