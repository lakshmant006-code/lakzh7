import React, { useRef, useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useScrollReset from "../../hooks/useScrollReset";
import { useLenisScroll } from "../../hooks/useLenisScroll";
import { useCardUnfurling } from "../../hooks/useCardUnfurling";
import { useCountupAnimation } from "../../hooks/useCountupAnimation";
import Footer from "../../components/Footer/Footer";
import LazyVideo from "../../components/LazyVideo/LazyVideo";
import CursorPill from "../../components/CursorPill/CursorPill";
import CaseStudyLayout from "../../components/CaseStudyLayout/CaseStudyLayout";
import {
  CaseStudyStatement,
  CaseStudyStatementBody,
  CaseStudyStatementHeadline,
} from "../../components/CaseStudyStatement/CaseStudyStatement";
import "./QuizAICaseStudy.css";

gsap.registerPlugin(ScrollTrigger);

const DS_BASE = "/work/quizai/QuizAI%20Design%20System";
const QUIZAI_DS_CARDS = [
  { name: "Brand Mark", src: `${DS_BASE}/components/brand/brand.card.html`, height: 120 },
  { name: "ASU Primary Colors", src: `${DS_BASE}/guidelines/colors-brand.card.html`, height: 180 },
  { name: "ASU Grayscale", src: `${DS_BASE}/guidelines/colors-grayscale.card.html`, height: 150 },
  { name: "Semantic Colors", src: `${DS_BASE}/guidelines/colors-semantic.card.html`, height: 110 },
  { name: "Neutral Surfaces", src: `${DS_BASE}/guidelines/colors-neutral-surfaces.card.html`, height: 150 },
  { name: "Font Family", src: `${DS_BASE}/guidelines/type-family.card.html`, height: 90 },
  { name: "Elevation", src: `${DS_BASE}/guidelines/brand-elevation.card.html`, height: 160 },
];

const QUIZAI_SOLUTIONS = [
  {
    video: "/work/quizai/Landing.mp4",
    title: "Solution #1: Landing",
    headlineLead: "A brand-first landing shows the whole upload-to-quiz loop ",
    headlineHighlight: "before students ever sign up.",
    caption:
      "Drop-off started with not knowing what QuizAI did. The landing leads with the brand promise — upload, summarize, quiz — in ASU's maroon-and-gold system, so students arrive oriented and invited in rather than guessing. The first screen is designed to earn trust and make the value obvious at a glance.",
  },
  {
    video: "/work/quizai/Summarize.mp4",
    title: "Solution #2: Summary",
    headlineLead: "Auto-summaries turn a wall of notes into ",
    headlineHighlight: "the parts that actually matter.",
    caption:
      "Students capture only about a third of lecture material, then drown in notes they never reopen. The summary component pulls the essentials forward from any upload and presents them in clean, hairline-bordered cards — designed to feel effortless and rewarding, so review becomes something students want to open instead of avoid.",
  },
  {
    video: "/work/quizai/Quizes.mp4",
    title: "Solution #3: Quiz",
    headlineLead: "One-click quizzes make active recall ",
    headlineHighlight: "the path of least resistance.",
    caption:
      "Most students skip self-testing because building quizzes across separate tools takes too long. Turning any upload into a self-scoring quiz — with immediate, encouraging feedback — makes active recall feel quick and game-like. The component is designed to pull students back for one more round instead of closing the app.",
  },
  {
    video: "/work/quizai/Tasks.mp4",
    title: "Solution #4: Tasks",
    headlineLead: "Visible study tasks and progress keep students ",
    headlineHighlight: "coming back to review.",
    caption:
      "Learners couldn't tell what they had mastered or when to review before it faded. Task flows surface the next step and make momentum visible with progress cues in the brand palette — designed to motivate through small, satisfying wins, so studying turns into a habit rather than a one-off.",
  },
];

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
  const lofiWireframesFrameRef = useRef(null);
  const designApproachDsRef = useRef(null);
  const solutionTitleRef = useRef(null);
  const solutionIntroRef = useRef(null);
  const solutionItemRefs = useRef([]);
  const reflectionTitleRef = useRef(null);
  const reflectionContentRef = useRef(null);
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
    // Design System + App Screens
    createScrollAnimation(designApproachDsRef, 0.1);
    // Solution Section
    createScrollAnimation(solutionTitleRef);
    createScrollAnimation(solutionIntroRef, 0.1);
    solutionItemRefs.current.forEach((node, index) => {
      if (!node) return;
      gsap.set(node, { opacity: 0, y: 30 });
      const trigger = ScrollTrigger.create({
        trigger: node,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(node, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            delay: 0.06 + index * 0.04,
          });
        },
      });
      scrollTriggers.push(trigger);
    });
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
            <div
              className="quizai-production-status"
              ref={(el) => (contextImpactMetricsRefs.current[0] = el)}
            >
              <span className="quizai-production-status-badge">
                <span
                  className="quizai-production-status-dot"
                  aria-hidden="true"
                />
                RESULTS
              </span>
              <p className="quizai-production-status-text">
                Still in production and will be launching soon.
              </p>
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
                Sit in on any lecture and watch what happens afterward —
                notes get scribbled down, filed away, and rarely opened
                again. The research backs that up: students capture only
                about a third of the important material, miss close to 40% of
                the key points, and more than half say they struggle to stay
                engaged or hold onto what they learned.
              </CaseStudyStatementBody>
              <CaseStudyStatementBody>
                The real gap isn't note-taking, it's what comes next. Active
                recall and self-testing are what actually move ideas into
                long-term memory, but building that habit today means hopping
                between separate tools — one for notes, another for study
                docs, another for quizzes. So most students simply skip it.
              </CaseStudyStatementBody>
              <CaseStudyStatementBody>
                That's the gap QuizAI is built to close. It takes a student's
                raw notes and, in a single step, turns them into organized
                study materials and auto-generated, self-scoring quizzes — so
                real studying becomes the easy default instead of one more
                chore to put off.
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

          <div className="cs-hmw" style={{ "--hmw-accent": "#695b4d" }}>
            <h3 className="cs-hmw-heading">HOW MIGHT WE</h3>
            <div className="cs-hmw-grid">
              <div className="cs-hmw-card">
                <p className="cs-hmw-question">
                  How might we turn dense notes into study-ready material
                  without the busywork?
                </p>
                <p className="cs-hmw-solution">
                  <span className="cs-hmw-solution-label">SOLUTION</span>{" "}
                  Auto-generate quizzes and summaries from any uploaded
                  document, so students spend their time learning instead of
                  formatting.
                </p>
              </div>
              <div className="cs-hmw-card">
                <p className="cs-hmw-question">
                  How might we keep learners aware of their progress and
                  motivated to review?
                </p>
                <p className="cs-hmw-solution">
                  <span className="cs-hmw-solution-label">SOLUTION</span>{" "}
                  A progress dashboard tracks mastery by topic and nudges
                  timely review before knowledge fades.
                </p>
              </div>
              <div className="cs-hmw-card">
                <p className="cs-hmw-question">
                  How might we make studying feel less isolating?
                </p>
                <p className="cs-hmw-solution">
                  <span className="cs-hmw-solution-label">SOLUTION</span>{" "}
                  Study groups let students share decks and quiz each other,
                  turning solo prep into a shared routine.
                </p>
              </div>
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
                ref={lofiWireframesFrameRef}
                src="/work/quizai/lofi-wireframes/index.html"
                title="Lo-Fi Wireframes – QuizAI"
                className="quizai-design-approach-image quizai-wireframe-frame quizai-lofi-frame"
                scrolling="no"
              />
            </div>
          </div>

          {/* Design System — Visual Identity */}
          <div
            className="quizai-design-approach-item"
            ref={designApproachDsRef}
          >
            <h4 className="quizai-visual-identity-subtitle">Visual Identity</h4>
            <p className="quizai-visual-identity-description">
              QuizAI&apos;s visual language follows Arizona State University&apos;s
              brand system — ASU Maroon (#8C1D40) and Gold (#FFC627) against
              clean white surfaces, Arial typography, and hairline-bordered
              cards instead of heavy shadows. Every color, type, spacing, and
              component token was codified into a living design system so the
              product stays cohesive from landing to quiz history.
            </p>
            <div className="quizai-ds-cards">
              {QUIZAI_DS_CARDS.map((card) => (
                <div key={card.src} className="quizai-ds-card">
                  <p className="quizai-ds-card-label">{card.name}</p>
                  <iframe
                    src={card.src}
                    title={card.name}
                    className="quizai-ds-card-frame"
                    style={{ height: `${card.height}px` }}
                    scrolling="no"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Solution Section */}
      <section id="solution-section" className="quizai-solution-section">
        <div className="quizai-solution-content">
          <h3 className="quizai-solution-title" ref={solutionTitleRef}>
            SOLUTION
          </h3>
          <p className="quizai-solution-intro" ref={solutionIntroRef}>
            Every solution started from one question: what makes a student
            actually want to open QuizAI? I designed each component to carry the
            brand&apos;s promise — clear, trustworthy, and effortless — in ASU&apos;s
            maroon-and-gold system, so the product feels credible and inviting.
            The goal was to pull students in and make real studying the easy
            default instead of another chore to put off.
          </p>
          {QUIZAI_SOLUTIONS.map((solution, index) => (
            <div
              key={solution.title}
              className="quizai-solution-item"
              ref={(el) => {
                solutionItemRefs.current[index] = el;
              }}
            >
              <h4 className="quizai-solution-item-title">{solution.title}</h4>
              <CaseStudyStatement>
                <CaseStudyStatementHeadline>
                  {solution.headlineLead}
                  <span className="quizai-accent-text">
                    {solution.headlineHighlight}
                  </span>
                </CaseStudyStatementHeadline>
              </CaseStudyStatement>
              <div className="quizai-solution-media">
                <div className="quizai-solution-video-container">
                  <LazyVideo
                    src={solution.video}
                    className="quizai-solution-video"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
                <p className="quizai-solution-caption">{solution.caption}</p>
              </div>
            </div>
          ))}
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
                  <LazyVideo
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
              to="/arcadia-custom-builders"
              className="quizai-see-next-card-link"
              onMouseEnter={() => setIsHoveringSeeNextCard(true)}
              onMouseLeave={() => setIsHoveringSeeNextCard(false)}
            >
              <div
                className="quizai-see-next-card"
                ref={(el) => (seeNextCardsRefs.current[1] = el)}
              >
                <div className="quizai-see-next-image-container">
                  <LazyVideo
                    src="/work/arcadia/arcadia custom.mp4"
                    className="quizai-see-next-image"
                    style={{ aspectRatio: "1920 / 1080" }}
                    autoPlay
                    loop
                    muted
                    playsInline
                    aria-label="Revolution Steel: Construction Workflow Optimisation — preview"
                  />
                </div>
                <h4 className="quizai-see-next-card-title">
                  Revolution Steel: Construction Workflow Optimisation
                </h4>
                <p className="quizai-see-next-card-description">
                  Helping Revolution Steel formulate a user workflow so work
                  gets distributed clearly and tasks are streamlined across the
                  team.
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
                  <LazyVideo
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

