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
  CaseStudyStatementHeadline,
} from "../../components/CaseStudyStatement/CaseStudyStatement";
import "./HikuCaseStudy.css";

const DS_BASE = "/work/Hiku/Hiku%20Design%20System";
const HIKU_DS_CARDS = [
  { name: "Logo & Mark",                    src: `${DS_BASE}/guidelines/brand-logo.card.html`,           height: 180 },
  { name: "Brand Greens",                   src: `${DS_BASE}/guidelines/color-brand.card.html`,          height: 150 },
  { name: "Neutrals & Ink",                 src: `${DS_BASE}/guidelines/color-neutral.card.html`,        height: 150 },
  { name: "Semantic Roles",                 src: `${DS_BASE}/guidelines/color-semantic.card.html`,       height: 150 },
  { name: "Buttons & Icon Buttons",         src: `${DS_BASE}/components/core/buttons.card.html`,         height: 210 },
  { name: "Content, Rows, Cards, Avatars", src: `${DS_BASE}/components/core/content.card.html`,         height: 300 },
  { name: "Search & Filters",              src: `${DS_BASE}/components/core/search.card.html`,           height: 260 },
  { name: "Elevation",                      src: `${DS_BASE}/guidelines/elevation.card.html`,            height: 150 },
  { name: "Type Scale",                     src: `${DS_BASE}/guidelines/type-scale.card.html`,           height: 180 },
  { name: "Weights",                        src: `${DS_BASE}/guidelines/type-weights.card.html`,         height: 150 },
];

const HIKU_FEATURES = [
  {
    video: "/work/Hiku/sol1.mp4",
    title: "Mobile View 1: Login/Explore",
    headlineLead: "One login, ",
    headlineHighlight: "every trail open.",
    caption:
      "A clean, simple login and explore screen gets users from sign in to discovering nearby trails in seconds, no clutter, no friction.",
  },
  {
    video: "/work/Hiku/sol2.mp4",
    title: "Mobile View 2: Trails",
    headlineLead: "Find a trail, ",
    headlineHighlight: "see what it's really like.",
    caption:
      "Real photos, ratings, and trail info pulled together so hikers know exactly what to expect before they ever leave the house.",
  },
  {
    video: "/work/Hiku/sol3.mp4",
    title: "Mobile View 3: Communities",
    headlineLead: "Find your people, ",
    headlineHighlight: "and your path.",
    caption:
      "Campus clubs like the ASU Outdoors Club get a home inside the app, members, trip plans, and shared experiences all in one place.",
  },
  {
    video: "/work/Hiku/sol4.mp4",
    title: "Mobile View 4: Shop",
    headlineLead: "The right gear, ",
    headlineHighlight: "without buying it outright.",
    caption:
      "A built-in shop lets users rent or buy hiking and camping gear directly through the community they're already part of, keeping costs down for students.",
  },
];

const HikuCaseStudy = () => {
  useScrollReset();
  const [isHoveringSeeNextCard, setIsHoveringSeeNextCard] = useState(false);
  const { scrollToElement } = useLenisScroll();

  const contextWhatIsRef = useRef(null);
  const contextMyRoleRef = useRef(null);
  const whereWeBeganTitleRef = useRef(null);
  const whereWeBeganText1Ref = useRef(null);
  const whereWeBeganVideoRef = useRef(null);
  const whereWeBeganText2Ref = useRef(null);
  const whereWeBeganText3Ref = useRef(null);
  const whatWeFoundTitleRef = useRef(null);
  const whatWeFoundStatRef = useRef(null);
  const whatWeFoundStatsRef = useRef(null);
  const whatWeFoundBodyRef = useRef(null);
  const solutionTitleRef = useRef(null);
  const visualIdentityRef = useRef(null);
  const lofiWireframesRef = useRef(null);
  const physicalComponentRef = useRef(null);
  const onboardingIllusRef = useRef(null);
  const featureItemRefs = useRef([]);
  const takeawaysTitleRef = useRef(null);
  const takeawaysItemRef = useRef(null);
  const seeNextTitleRef = useRef(null);
  const seeNextGridRef = useRef(null);
  const seeNextCardsRefs = useRef([]);

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

  useEffect(() => {
    const cleanups = [];

    const createScrollAnimation = (ref, delay = 0) => {
      if (!ref || !ref.current) return;
      cleanups.push(revealOnScroll(ref.current, { delay }));
    };

    createScrollAnimation(contextWhatIsRef, 0.08);
    createScrollAnimation(contextMyRoleRef, 0.12);
    createScrollAnimation(whereWeBeganTitleRef, 0.06);
    createScrollAnimation(whereWeBeganText1Ref, 0.1);
    createScrollAnimation(whereWeBeganVideoRef, 0.14);
    createScrollAnimation(whereWeBeganText2Ref, 0.18);
    createScrollAnimation(whereWeBeganText3Ref, 0.22);
    createScrollAnimation(whatWeFoundTitleRef, 0.06);
    createScrollAnimation(whatWeFoundStatRef, 0.1);
    createScrollAnimation(whatWeFoundStatsRef, 0.14);
    createScrollAnimation(whatWeFoundBodyRef, 0.18);
    createScrollAnimation(solutionTitleRef, 0.06);
    createScrollAnimation(visualIdentityRef, 0.1);
    createScrollAnimation(lofiWireframesRef, 0.14);
    createScrollAnimation(physicalComponentRef, 0.18);
    createScrollAnimation(onboardingIllusRef, 0.22);
    createScrollAnimation(takeawaysTitleRef, 0.06);
    createScrollAnimation(takeawaysItemRef, 0.1);
    createScrollAnimation(seeNextTitleRef, 0.06);

    featureItemRefs.current.forEach((node, index) => {
      if (node) cleanups.push(revealOnScroll(node, { delay: 0.06 + index * 0.04 }));
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <div className="hiku-case-study">
      <CursorPill isHovering={isHoveringSeeNextCard} text="View case study" />
      <CaseStudyLayout projectId="hiku">
      <section className="hiku-hero-section">
        <div className="hiku-hero-image-container hiku-hero-before">
          <img
            src="/work/Hiku/HIKU-SET.png"
            alt="Hiku, a mobile application for hiking enthusiasts"
            className="hiku-hero-image"
          />
        </div>

        <div className="hiku-hero-content">
          <div className="hiku-hero-left">
            <div className="hiku-hero-title-group">
              <h1 className="hiku-hero-title">
                Hiku: A Mobile Application for Hiking Enthusiasts
              </h1>
            </div>
            <div className="hiku-hero-details">
              <div className="hiku-hero-detail-item">
                <div className="hiku-hero-detail-label">ROLE</div>
                <div className="hiku-hero-detail-value">
                  UX Researcher, UX Designer
                </div>
              </div>
              <div className="hiku-hero-detail-item">
                <div className="hiku-hero-detail-label">DURATION</div>
                <div className="hiku-hero-detail-value">Nov to Mar 2024</div>
              </div>
              <div className="hiku-hero-detail-item">
                <div className="hiku-hero-detail-label">TOOLS</div>
                <div className="hiku-hero-detail-value">Figma</div>
              </div>
            </div>
          </div>

          <div className="hiku-hero-right">
            <p className="hiku-hero-subtitle">
              Connecting hiking and camping enthusiasts through community,
              shared experiences, and a convenient way to buy or rent the
              gear they need for their next adventure.
            </p>
            <div className="hiku-hero-tags">
              <span className="hiku-hero-tag">Mobile</span>
              <span className="hiku-hero-tag">Human Interface Design</span>
              <span className="hiku-hero-tag">UX Research</span>
            </div>
            <button
              type="button"
              className="hiku-skip-to-solution-btn"
              onClick={handleSkipToSolution}
            >
              <div className="hiku-skip-icon-container">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="hiku-skip-arrow"
                  aria-hidden
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
              <span className="hiku-skip-text">SKIP TO FEATURES</span>
            </button>
          </div>
        </div>

        <div className="hiku-hero-image-container hiku-hero-after">
          <img
            src="/work/Hiku/HIKU- HERO.png"
            alt="Hiku, a mobile application for hiking enthusiasts"
            className="hiku-hero-image"
          />
        </div>
      </section>

      <section
        id="hiku-context"
        className="hiku-context-section"
        aria-labelledby="hiku-context-heading"
      >
        <div className="hiku-context-content">
          <div className="hiku-context-top">
            <div className="hiku-context-item" ref={contextWhatIsRef}>
              <h3 id="hiku-context-heading" className="hiku-context-title">
                What is Hiku?
              </h3>
              <p className="hiku-context-description">
                The best hikes are the ones you share, but finding people to go
                with, and gearing up without a last minute scramble, is harder
                than it should be. Hiku is a mobile app that fixes both: it
                connects hikers and campers around shared trails and communities,
                and makes buying or renting gear simple, so you show up ready for
                whatever&apos;s next.
              </p>
            </div>
            <div className="hiku-context-item" ref={contextMyRoleRef}>
              <h3 className="hiku-context-title">My Role</h3>
              <p className="hiku-context-description">
                As UX Researcher and Designer, I led user interviews and a
                quantitative survey to understand hikers&apos; needs, then
                translated those findings into wireframes and high fidelity
                screens, focusing on simple, intuitive navigation from the
                very first screen.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="solution-section"
        className="hiku-solution-section"
        aria-labelledby="hiku-solution-heading"
      >
        <div className="hiku-solution-content">
          <h3
            id="hiku-solution-heading"
            className="hiku-solution-title"
            ref={solutionTitleRef}
          >
            FINAL PRODUCT
          </h3>

          <div
            className="hiku-visual-identity-overview"
            ref={visualIdentityRef}
          >
            <h4 className="hiku-visual-identity-subtitle">Visual Identity</h4>
            <p className="hiku-visual-identity-description">
              Hiku's visual language is earthy and vibrant, brand greens
              anchored at #8DCAAF, #4FB889, and #349369, carried by Satoshi
              across five weights. Every token, component, and spacing rule
              was codified into a living design system so the whole app feels
              cohesive from splash screen to community feed.
            </p>
            <div className="hiku-ds-cards">
              {HIKU_DS_CARDS.map((card) => (
                <div key={card.src} className="hiku-ds-card">
                  <p className="hiku-ds-card-label">{card.name}</p>
                  <iframe
                    src={card.src}
                    title={card.name}
                    className="hiku-ds-card-frame"
                    style={{ height: `${card.height}px` }}
                    scrolling="no"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="hiku-physical-component" ref={lofiWireframesRef}>
            <h4 className="hiku-visual-identity-subtitle">
              Wire Frames (Low Fidelity)
            </h4>
            <p className="hiku-visual-identity-description">
              Early low-fidelity wireframes mapped out the splash, filtering,
              map, registration, shop, and community screens, quick
              grayscale sketches used to test flow and structure before any
              visual design began.
            </p>
            <div className="hiku-wireframe-container">
              <iframe
                src="/work/Hiku/wireframe-lofi-prototypes.html"
                title="Lo-Fi Wireframes, Hiking App"
                className="hiku-wireframe-frame"
                scrolling="no"
              />
            </div>
          </div>

          <div className="hiku-physical-component" ref={physicalComponentRef}>
            <h4 className="hiku-visual-identity-subtitle">
              App Screens
            </h4>
            <p className="hiku-visual-identity-description">
              From onboarding to community, every screen was designed
              end to end in Figma. Swipe through the intro, sign in, and
              explore the app just like you would on your phone.
            </p>
            <div className="hiku-wireframe-container hiku-app-screens-container">
              <div className="hiku-app-screens-wrapper">
                <iframe
                  src="/work/Hiku/Hiku%20Design%20System/ui_kits/hiku-app/index.html"
                  title="Hiku Mobile App Screens"
                  className="hiku-wireframe-frame hiku-app-screens-frame"
                  scrolling="no"
                  data-lenis-prevent
                />
              </div>
            </div>
          </div>

          <div className="hiku-physical-component" ref={onboardingIllusRef}>
            <h4 className="hiku-visual-identity-subtitle">
              Onboarding Illustrations
            </h4>
            <p className="hiku-visual-identity-description">
              The onboarding screens are hand-painted. Each illustration was
              built up from first sketch to final art: community, gear, and
              food.
            </p>
            <div className="hiku-onboarding-vids">
              <figure className="hiku-onboarding-vid">
                <LazyVideo
                  src="/work/Hiku/onboarding-community.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  aria-label="Community onboarding illustration being painted"
                />
                <figcaption className="hiku-onboarding-vid-caption">
                  Community
                </figcaption>
              </figure>
              <figure className="hiku-onboarding-vid">
                <LazyVideo
                  src="/work/Hiku/onboarding-gear.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  aria-label="Gear onboarding illustration being painted"
                />
                <figcaption className="hiku-onboarding-vid-caption">
                  Gear
                </figcaption>
              </figure>
              <figure className="hiku-onboarding-vid">
                <LazyVideo
                  src="/work/Hiku/onboarding-food.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  aria-label="Food onboarding illustration being painted"
                />
                <figcaption className="hiku-onboarding-vid-caption">
                  Food
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      <section
        id="hiku-where-we-began"
        className="hiku-where-we-began-section"
        aria-labelledby="hiku-where-we-began-heading"
      >
        <div className="hiku-where-we-began-content">
          <h2
            id="hiku-where-we-began-heading"
            className="hiku-impact-title hiku-where-we-began-heading"
            ref={whereWeBeganTitleRef}
          >
            Key Design Moments
          </h2>
          <p
            className="hiku-where-we-began-body hiku-where-we-began-body--above-video"
            ref={whereWeBeganText1Ref}
          >
            The research process involved conducting audio interviews with 20
            to 55 year olds, focusing on understanding their experience and
            challenges related to hiking and camping. By asking thoughtful
            questions, I was able to{" "}
            <span className="hiku-accent-text">
              empathize with their needs and gain valuable insights.
            </span>
          </p>
          <div
            className="hiku-where-we-began-video-wrap"
            ref={whereWeBeganVideoRef}
          >
            <LazyVideo
              className="hiku-where-we-began-video"
              src="/work/Hiku/pain-points.mp4"
              autoPlay
              loop
              muted
              playsInline
              aria-label="Ambient motion for the research section"
            />
          </div>
          <p
            className="hiku-where-we-began-body hiku-where-we-began-body--below-video"
            ref={whereWeBeganText2Ref}
          >
            The process also included a quantitative assessment, where
            students were asked whether they&apos;d use the app&apos;s
            planned features and products,{" "}
            <span className="hiku-accent-text">
              which gave us a clearer read on what they preferred and needed.
            </span>
          </p>
          <p
            className="hiku-where-we-began-body hiku-where-we-began-body--closing"
            ref={whereWeBeganText3Ref}
          >
            Combined with the interviews, this gave us a fuller picture of
            what the target audience wanted.
          </p>

          <div className="cs-hmw" style={{ "--hmw-accent": "#3A9269" }}>
            <h3 className="cs-hmw-heading">HOW MIGHT WE</h3>
            <div className="cs-hmw-grid">
              <div className="cs-hmw-card">
                <p className="cs-hmw-question">
                  How might we help hikers find trails that match their skill
                  and time?
                </p>
                <p className="cs-hmw-solution">
                  <span className="cs-hmw-solution-label">SOLUTION</span>{" "}
                  A filterable trail feed ranks routes by difficulty, length,
                  and season, so users choose with confidence.
                </p>
              </div>
              <div className="cs-hmw-card">
                <p className="cs-hmw-question">
                  How might we connect solo hikers with a community they
                  trust?
                </p>
                <p className="cs-hmw-solution">
                  <span className="cs-hmw-solution-label">SOLUTION</span>{" "}
                  Local clubs and shared trip logs give newcomers people to
                  hike with and stories to follow.
                </p>
              </div>
              <div className="cs-hmw-card">
                <p className="cs-hmw-question">
                  How might we take the guesswork out of gear for new campers?
                </p>
                <p className="cs-hmw-solution">
                  <span className="cs-hmw-solution-label">SOLUTION</span>{" "}
                  A curated shop pairs each trail with the gear it calls for,
                  so first-timers aren&apos;t left guessing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="hiku-what-we-found"
        className="hiku-what-we-found-section"
        aria-labelledby="hiku-what-we-found-heading"
      >
        <div className="hiku-what-we-found-content">
          <h2
            id="hiku-what-we-found-heading"
            className="hiku-impact-title"
            ref={whatWeFoundTitleRef}
          >
            Who&apos;s Our Audience?
          </h2>
          <CaseStudyStatement
            ref={whatWeFoundStatRef}
            className="hiku-what-we-found-statement"
          >
            <CaseStudyStatementHeadline>
              Hiku&apos;s core audience spans{" "}
              <span className="hiku-accent-text">18 to 55</span> year
              olds, young adults and lifelong hiking enthusiasts alike.
            </CaseStudyStatementHeadline>
          </CaseStudyStatement>
          <div className="hiku-what-we-found-stats" ref={whatWeFoundStatsRef}>
            <figure className="hiku-what-we-found-stat hiku-what-we-found-stat--image-left">
              <div className="hiku-what-we-found-stat-media">
                <img
                  src="/work/Hiku/stat-1.png"
                  alt="Illustration for student usage interest in Hiku"
                  className="hiku-what-we-found-stat-image"
                  loading="lazy"
                />
              </div>
              <figcaption className="hiku-what-we-found-stat-copy">
                <p className="hiku-what-we-found-stat-lead">In fact,</p>
                <p className="hiku-stat-metric-line">
                  <span className="hiku-stat-metric">40%</span>
                </p>
                <p className="hiku-what-we-found-stat-body">
                  of students surveyed said they&apos;d actively use the
                  app&apos;s core features,
                </p>
              </figcaption>
            </figure>
            <figure className="hiku-what-we-found-stat hiku-what-we-found-stat--text-left">
              <div className="hiku-what-we-found-stat-media">
                <img
                  src="/work/Hiku/stat-11.png"
                  alt="Illustration for reduced trip-planning time with Hiku"
                  className="hiku-what-we-found-stat-image"
                  loading="lazy"
                />
              </div>
              <figcaption className="hiku-what-we-found-stat-copy">
                <p className="hiku-what-we-found-stat-lead">and</p>
                <p className="hiku-stat-metric-line">
                  <span className="hiku-stat-metric">20%</span>
                </p>
                <p className="hiku-what-we-found-stat-body">
                  said it would meaningfully cut down their trip-planning
                  time.
                </p>
              </figcaption>
            </figure>
          </div>
          <p
            className="hiku-context-description hiku-what-we-found-lede"
            ref={whatWeFoundBodyRef}
          >
            Many are students living in dorms, looking for activities and
            clubs that are active on campus, plus community members who
            already love hiking and want{" "}
            <span className="hiku-accent-text">
              like-minded people to share it with.
            </span>
          </p>
        </div>
      </section>

      {/* Key Takeaway Section */}
      <section id="hiku-takeaways" className="hiku-takeaways-section">
        <div className="hiku-takeaways-content">
          <h3 className="hiku-solution-title" ref={takeawaysTitleRef}>
            REFLECTIONS
          </h3>
          <div className="hiku-takeaways-item" ref={takeawaysItemRef}>
            <h4 className="hiku-takeaways-title-text">
              From a simple idea to something people could use in the wild.
            </h4>
            <p className="hiku-takeaways-description">
              Hiku stretched me. Taking one small idea all the way from a hunch
              to screens someone could actually navigate taught me how much of
              design lives in the unglamorous middle, the wireframes, the
              redos, the tiny navigation calls, and how good it feels when it
              finally clicks into something real.
            </p>
          </div>
        </div>
      </section>

      <section id="hiku-see-next" className="hiku-see-next-section">
        <div className="hiku-see-next-content">
          <h3 className="hiku-see-next-title" ref={seeNextTitleRef}>
            SEE NEXT
          </h3>
          <div
            className="hiku-see-next-grid"
            ref={seeNextGridRef}
            data-case-study-nav-boundary
          >
            <Link
              to="/quizai"
              className="hiku-see-next-card-link"
              onMouseEnter={() => setIsHoveringSeeNextCard(true)}
              onMouseLeave={() => setIsHoveringSeeNextCard(false)}
            >
              <div
                className="hiku-see-next-card"
                ref={(el) => {
                  seeNextCardsRefs.current[0] = el;
                }}
              >
                <div className="hiku-see-next-image-container">
                  <LazyVideo
                    src="/work/quizai/thumbnail.mp4"
                    className="hiku-see-next-image"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
                <h4 className="hiku-see-next-card-title">
                  Quizzy: AI Powered Notetaking Application
                </h4>
                <p className="hiku-see-next-card-description">
                  Helping students turn uploaded notes into personalized
                  quizzes and summaries through a centralized study dashboard.
                </p>
              </div>
            </Link>
            <Link
              to="/time-management"
              className="hiku-see-next-card-link"
              onMouseEnter={() => setIsHoveringSeeNextCard(true)}
              onMouseLeave={() => setIsHoveringSeeNextCard(false)}
            >
              <div
                className="hiku-see-next-card"
                ref={(el) => {
                  seeNextCardsRefs.current[1] = el;
                }}
              >
                <div className="hiku-see-next-image-container">
                  <LazyVideo
                    src="/work/time-management/thumbnail.mp4"
                    className="hiku-see-next-image"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
                <h4 className="hiku-see-next-card-title">
                  Summer: A Productivity Tracking Web App
                </h4>
                <p className="hiku-see-next-card-description">
                  Helping a company track employee productivity through an
                  intuitive, easy to navigate time management dashboard.
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

export default HikuCaseStudy;



