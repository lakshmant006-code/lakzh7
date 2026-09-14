import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useScrollReset from "../../hooks/useScrollReset";
import { useLenisScroll } from "../../hooks/useLenisScroll";
import { useCardUnfurling } from "../../hooks/useCardUnfurling";
import { revealOnScroll } from "../../utils/revealOnScroll";
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

const QUIZAI_SOLUTIONS = [
  {
    video: "/work/quizai/sol-upload.mp4",
    title: "Solution #1: Uploading a PDF",
    headlineLead: "It starts with one drop, ",
    headlineHighlight: "upload a PDF and you're already studying.",
    caption:
      "The whole point was to kill the setup work. Drop in a lecture PDF and Quizzy takes it from there, no formatting, no copy pasting, no deciding where to start. The upload flow is designed to feel like the easiest first step, so nothing stands between a student and their notes.",
  },
  {
    video: "/work/quizai/sol-quiz.mp4",
    title: "Solution #2: Generating a Quiz",
    headlineLead: "One tap turns that PDF into a ",
    headlineHighlight: "self scoring quiz.",
    caption:
      "Most students skip self testing because building quizzes by hand takes too long. Here it's automatic, Quizzy reads the upload and generates questions with instant, encouraging feedback, making active recall feel quick and almost game like instead of a chore.",
  },
  {
    video: "/work/quizai/sol-summaries.mp4",
    title: "Solution #3: Summaries",
    headlineLead: "The same upload becomes a summary that keeps ",
    headlineHighlight: "only what matters.",
    caption:
      "Students capture about a third of a lecture, then drown in notes they never reopen. The summary pulls the essentials forward from any upload and lays them out in clean, easy to scan cards, so review starts from the important bits, not the full page count.",
  },
  {
    video: "/work/quizai/sol-folders.mp4",
    title: "Solution #4: Making Folders",
    headlineLead: "And it all stays organized, ",
    headlineHighlight: "folders keep every subject in its place.",
    caption:
      "As uploads pile up, things get messy fast. Folders let students group notes, quizzes, and summaries by class or topic, so everything for an exam lives in one spot, designed to make coming back the easy, obvious thing to do.",
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
  const testingEffectRef = useRef(null);
  const designApproachTitleRef = useRef(null);
  const designApproach1TitleRef = useRef(null);
  const designApproach1ContentRef = useRef(null);
  const designApproach1ImageRef = useRef(null);
  const designApproach2TitleRef = useRef(null);
  const designApproach2ContentRef = useRef(null);
  const designApproach2Image1Ref = useRef(null);
  const lofiWireframesFrameRef = useRef(null);
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

  // The lo-fi wireframe (same-origin) forwards its wheel/touch to us via
  // postMessage. Re-dispatch it as a native wheel event so the page's own
  // Lenis pipeline scrolls it, seamless and smooth, while the embed stays
  // clickable (tab switching, buttons).
  useEffect(() => {
    const onMessage = (event) => {
      const d = event.data;
      if (!d || d.source !== "quizai-embed" || d.type !== "wheel") return;
      if (typeof d.deltaY !== "number") return;
      window.dispatchEvent(
        new WheelEvent("wheel", {
          deltaY: d.deltaY,
          deltaMode: typeof d.deltaMode === "number" ? d.deltaMode : 0,
          bubbles: true,
          cancelable: true,
        }),
      );
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Scroll-triggered reveals, GSAP-free (IntersectionObserver + WAAPI)
  useEffect(() => {
    const cleanups = [];
    const reveal = (ref, delay = 0) => {
      if (!ref || !ref.current) return;
      cleanups.push(revealOnScroll(ref.current, { delay }));
    };

    // Context Section
    reveal(contextWhatIsQuizAIRef);
    reveal(contextMyRoleRef, 0.1);
    // Results / status with stagger
    contextImpactMetricsRefs.current.forEach((el, index) => {
      if (el) cleanups.push(revealOnScroll(el, { delay: 0.3 + index * 0.1 }));
    });

    // Research Section
    reveal(researchTitleRef);
    reveal(researchOverviewSubtitleRef, 0.1);
    reveal(researchOverviewImageRef, 0.2);
    reveal(researchFindingImageRef);
    reveal(testingEffectRef, 0.1);

    // Design Approach Section
    reveal(designApproachTitleRef);
    reveal(designApproach1TitleRef);
    reveal(designApproach1ContentRef, 0.1);
    reveal(designApproach1ImageRef, 0.2);
    reveal(designApproach2TitleRef);
    reveal(designApproach2ContentRef, 0.1);
    reveal(designApproach2Image1Ref, 0.2);

    // Solution Section
    reveal(solutionTitleRef);
    reveal(solutionIntroRef, 0.1);
    solutionItemRefs.current.forEach((node, index) => {
      if (node) cleanups.push(revealOnScroll(node, { delay: 0.06 + index * 0.04 }));
    });

    // Reflection Section
    reveal(reflectionTitleRef);
    reveal(reflectionContentRef, 0.1);

    // See Next Section
    reveal(seeNextTitleRef);

    return () => {
      cleanups.forEach((fn) => fn());
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
          <picture>
            <source
              type="image/webp"
              srcSet="/work/quizai/hero-before-640.webp 640w, /work/quizai/hero-before-1024.webp 1024w, /work/quizai/hero-before-1600.webp 1600w"
              sizes="100vw"
            />
            <img
              src="/work/quizai/hero-before-1024.jpg"
              alt="Quizzy landing page mockup on a laptop screen"
              className="quizai-hero-image"
              loading="eager"
              decoding="async"
            />
          </picture>
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
                  September, November 2024 (10 weeks)
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
            alt="Quizzy landing page, dashboard, and AI study assistant screens"
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
              <h2 className="quizai-context-title">What is Quizzy?</h2>
              <p className="quizai-context-description">
                Most students want to study smarter, they just don't want to
                spend an hour turning messy notes into flashcards first. Quizzy
                closes that gap: upload your notes and it hands back clean
                summaries and self scoring quizzes in one step, so the actual
                studying finally happens.
              </p>
            </div>
            <div className="quizai-context-item" ref={contextMyRoleRef}>
              <h2 className="quizai-context-title">My Role</h2>
              <p className="quizai-context-description">
                I wore a few hats on this one. I ran the user research with
                students, turned what I heard into the interaction patterns, and
                wrote the full stack code. I owned it from the first sketches
                through what shipped, and worked with stakeholders along the way
                on both the product direction and how it was built.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Product, the shipped work, shown up front */}
      <section id="solution-section" className="quizai-solution-section">
        <div className="quizai-solution-content">
          <h3 className="quizai-solution-title" ref={solutionTitleRef}>
            THE FINAL PRODUCT
          </h3>
          <p className="quizai-solution-intro" ref={solutionIntroRef}>
            Here is what Quizzy does. Every screen was built around one
            question: what makes a student want to open the app instead of
            putting studying off? You drop in a PDF and it comes back as
            summaries, quizzes, and neatly filed notes in a few taps.
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

      {/* Research Section */}
      <section id="quizai-research" className="quizai-research-section">
        <div className="quizai-research-content">
          <h3 className="quizai-research-title" ref={researchTitleRef}>
            KEY DESIGN MOMENTS
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
                Sit in on any lecture and watch what happens afterward,
                notes get scribbled down, filed away, and rarely opened
                again. The research backs that up:
              </CaseStudyStatementBody>
              <ul className="quizai-stat-list">
                <li>
                  Students capture only about a third of the important material.
                </li>
                <li>They miss close to 40% of the key points.</li>
                <li>
                  More than half struggle to stay engaged or hold onto what
                  they learned.
                </li>
              </ul>
              <CaseStudyStatementBody>
                The harder part is what comes after the notes. Active recall and
                self testing are what move ideas into long term memory, but
                building that habit today means hopping between separate tools,
                one for notes, another for study docs, another for quizzes. So
                most students skip it.
              </CaseStudyStatementBody>
              <CaseStudyStatementBody>
                That's the gap Quizzy is built to close. It takes a student's
                raw notes and, in a single step, turns them into organized
                study materials and auto generated, self scoring quizzes, so
                real studying becomes the easy default instead of one more
                chore to put off.
              </CaseStudyStatementBody>
              <CaseStudyStatementHeadline as="h4">
                Key Insights &amp; Problem Definition
              </CaseStudyStatementHeadline>
              <CaseStudyStatementBody>
                A few things came up again and again:
              </CaseStudyStatementBody>
              <ul className="quizai-stat-list">
                <li>Making quizzes by hand takes forever.</li>
                <li>Notes pile up into overwhelm.</li>
                <li>
                  No one could tell whether they were actually getting better.
                </li>
              </ul>
              <CaseStudyStatementBody>
                What students wanted was studying that felt personal, with
                feedback that showed them they were making progress.
              </CaseStudyStatementBody>
              <CaseStudyStatementHeadline as="h4">
                Design Impact &amp; Feature Direction
              </CaseStudyStatementHeadline>
              <CaseStudyStatementBody>
                Those conversations shaped what came next: the one click
                quizzes, the auto summaries, the study groups, and progress you
                can see at a glance. Each one had to pass the same test, does it
                make studying feel lighter, or just add one more thing to do?
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
                title="Design Process, Quizzy"
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
                  How might we turn dense notes into study ready material
                  without the busywork?
                </p>
                <p className="cs-hmw-solution">
                  <span className="cs-hmw-solution-label">SOLUTION</span>{" "}
                  Auto generate quizzes and summaries from any uploaded
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

          {/* Signature moment: the testing effect */}
          <div className="quizai-testing-effect" ref={testingEffectRef}>
            <CaseStudyStatement>
              <CaseStudyStatementHeadline as="h4">
                The one thing testing kept asking for
              </CaseStudyStatementHeadline>
              <CaseStudyStatementBody>
                The strongest signal from user testing was simple: people loved
                being quizzed. That is the testing effect. You hold onto
                something far better after you try to recall it than after you
                read it again. With everyone trying to remember more in less
                time, that felt like the center of Quizzy, and it came straight
                out of asking what the one thing Quizzy could not live without.
              </CaseStudyStatementBody>
              <CaseStudyStatementBody>
                So the direction became a gentle reminder system. Before an exam
                you choose the days you want Quizzy to check in, and at each
                moment it does more than remind you. It hands you a quick quiz on
                the very flashcards you were trying to remember. You set your own
                intervals, so recall practice slips into your day instead of
                piling up the night before.
              </CaseStudyStatementBody>
            </CaseStudyStatement>
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
                Streamlining the Upload to Quiz Flow
              </CaseStudyStatementHeadline>
              <CaseStudyStatementBody>
                Research showed students were dropping off after uploading,
                the path from document to quiz wasn't clear. The redesigned
                flow makes each step explicit:{" "}
                <span style={{ fontWeight: 600 }}>upload, process, generate</span>
                , so students always know where they are and what comes next.
              </CaseStudyStatementBody>
            </CaseStudyStatement>
            <div
              className="quizai-design-approach-image-container"
              ref={designApproach1ImageRef}
            >
              <img
                src="/work/quizai/user-journey-mapping-frame-1.svg"
                alt="Quizzy User Flow"
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
                frequently accessed materials to the front of the dashboard and
                placed AI generated summaries and quizzes{" "}
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
                title="Lo-Fi Wireframes, Quizzy"
                className="quizai-design-approach-image quizai-wireframe-frame quizai-lofi-frame"
                scrolling="no"
              />
            </div>
          </div>


        </div>
      </section>

      {/* Impact Section */}
      <section id="quizai-impact" className="quizai-solution-section">
        <div className="quizai-solution-content">
          <h3 className="quizai-solution-title" ref={impactSectionRef}>
            IMPACT
          </h3>
          <div
            className="quizai-production-status"
            ref={(el) => (contextImpactMetricsRefs.current[0] = el)}
          >
            <span className="quizai-production-status-badge">
              <span className="quizai-production-status-dot" aria-hidden="true" />
              MOVING FORWARD
            </span>
            <p className="quizai-production-status-text">
              Rather than stop at a tool for uploading notes, I'm moving forward
              and building Quizzy into a full application around the testing
              effect. The point is to help people remember faster: you set your
              own intervals, Quizzy asks you questions on its own and surfaces
              your flashcards, and you review right after you answer, while the
              recall is still fresh. The number I want to watch is students
              keeping up with their studying instead of cramming.
            </p>
          </div>
        </div>
      </section>

      {/* Reflection Section */}
      <section id="quizai-reflection" className="quizai-reflection-section">
        <div className="quizai-reflection-content">
          <h3 className="quizai-reflection-title" ref={reflectionTitleRef}>
            REFLECTIONS
          </h3>
          <div className="quizai-reflection-item" ref={reflectionContentRef}>
            <h4 className="quizai-reflection-title-text">
              This was my first design role as Quizzy's only designer, handling
              both product design and development.
            </h4>
            <p className="quizai-reflection-description">
              Being the only designer, and the one writing the code, meant
              there was nowhere to hand a problem off. It pushed me to carry an
              idea the whole way, from a rough sketch to something you can
              actually click and use, and to make peace with shipping before it
              felt perfect.
            </p>
            <p className="quizai-reflection-subheading">
              Universal learning, not just equal learning
            </p>
            <p className="quizai-reflection-description">
              The biggest lesson wasn&apos;t technical. Building Quizzy made me
              think hard about who education tech actually leaves out. Good
              design here isn&apos;t giving everyone the same thing, it&apos;s
              meeting people where they learn, especially the ones who never
              clicked with the traditional way. That idea quietly shaped every
              choice I made.
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
                    aria-label="Revolution Steel: Construction Workflow Optimisation, preview"
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
                    aria-label="Hiku: A Mobile Application for Hiking Enthusiasts, preview"
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

