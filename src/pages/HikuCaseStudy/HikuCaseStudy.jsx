import React, { useEffect, useState } from "react";
import useScrollReset from "../../hooks/useScrollReset";
import {
  CsPage,
  CsBreadcrumb,
  CsHero,
  CsIntro,
  CsSection,
  CsH3,
  CsText,
  CsCallout,
  CsPanel,
  CsSide,
  CsHmw,
  CsImg,
  CsVideo,
  CsSeeNext,
} from "../../components/CsKit/CsKit";
// Still provides the app-screens embed and full-screen prototype styles.
import "./HikuCaseStudy.css";

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
  const [protoOpen, setProtoOpen] = useState(false);

  // Lock scroll and allow Escape while the full-screen prototype is open.
  useEffect(() => {
    if (!protoOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setProtoOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [protoOpen]);

  return (
    <CsPage project="hiku" accent="#3A9269" tint="#E6F2EC">
      <CsBreadcrumb current="Hiku" />
      <CsHero>
        <img
          src="/work/Hiku/HIKU-SET.webp"
          alt="Hiku, a mobile application for hiking enthusiasts"
        />
      </CsHero>

      <CsIntro
        title="Hiku: A Mobile Application for Hiking Enthusiasts"
        lead="Connecting hiking and camping enthusiasts through community, shared experiences, and a convenient way to buy or rent the gear they need for their next adventure."
        meta={[
          { label: "Role", value: ["UX Researcher", "UX Designer"] },
          { label: "Timeline", value: "Nov to Mar 2024" },
          { label: "Tools", value: "Figma" },
          {
            label: "Scope",
            value: ["Mobile", "Human Interface Design", "UX Research"],
          },
        ]}
      />

      <CsSection id="hiku-context" label="Overview" title="What is Hiku?">
        <CsText>
          The best hikes are the ones you share, but finding people to go with,
          and gearing up without a last minute scramble, is harder than it
          should be. Hiku is a mobile app that fixes both: it connects hikers
          and campers around shared trails and communities, and makes buying or
          renting gear simple, so you show up ready for whatever&apos;s next.
        </CsText>
        <CsH3>My role</CsH3>
        <CsText>
          As UX Researcher and Designer, I led user interviews and a
          quantitative survey to understand hikers&apos; needs, then translated
          those findings into wireframes and high fidelity screens, focusing on
          simple, intuitive navigation from the very first screen.
        </CsText>
        <CsPanel title="The final screens">
          <CsImg
            src="/work/Hiku/HIKU- HERO.webp"
            alt="Hiku, a mobile application for hiking enthusiasts"
          />
        </CsPanel>
      </CsSection>

      <CsSection id="solution-section" label="Final product" title="Final Screens">
        <CsText>
          From onboarding to community, every screen was designed end to end in
          Figma. Swipe through the intro, sign in, and explore the app just
          like you would on your phone.
        </CsText>
        <CsPanel title="Try the app">
          <div className="hiku-app-screens-container cs-hiku-phone">
            <div className="hiku-app-screens-wrapper">
              <iframe
                src="/work/Hiku/Hiku%20Design%20System/ui_kits/hiku-app/index.html"
                title="Hiku Mobile App Screens"
                className="hiku-wireframe-frame hiku-app-screens-frame"
                scrolling="no"
                data-lenis-prevent
              />
            </div>
            <button
              type="button"
              className="hiku-proto-launch"
              onClick={() => setProtoOpen(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Open full screen prototype
            </button>
          </div>
        </CsPanel>
      </CsSection>

      <CsSection
        id="hiku-where-we-began"
        label="Research"
        title="Key Design Moments"
      >
        <CsText>
          The research process involved conducting audio interviews with 20 to
          55 year olds, focusing on understanding their experience and
          challenges related to hiking and camping. By asking thoughtful
          questions, I was able to{" "}
          <strong>empathize with their needs and gain valuable insights.</strong>
        </CsText>
        <CsPanel title="What hikers told us">
          <CsVideo
            src="/work/Hiku/pain-points.mp4"
            label="Ambient motion for the research section"
          />
        </CsPanel>
        <CsText>
          The process also included a quantitative assessment, where students
          were asked whether they&apos;d use the app&apos;s planned features and
          products,{" "}
          <strong>
            which gave us a clearer read on what they preferred and needed.
          </strong>
        </CsText>
        <CsText>
          Combined with the interviews, this gave us a fuller picture of what
          the target audience wanted.
        </CsText>
        <CsHmw
          items={[
            {
              question:
                "How might we help hikers find trails that match their skill and time?",
              solution:
                "A filterable trail feed ranks routes by difficulty, length, and season, so users choose with confidence.",
            },
            {
              question:
                "How might we connect solo hikers with a community they trust?",
              solution:
                "Local clubs and shared trip logs give newcomers people to hike with and stories to follow.",
            },
            {
              question:
                "How might we take the guesswork out of gear for new campers?",
              solution:
                "A curated shop pairs each trail with the gear it calls for, so first-timers aren't left guessing.",
            },
          ]}
        />
      </CsSection>

      <CsSection
        id="hiku-what-we-found"
        label="Audience"
        title="Who's Our Audience?"
      >
        <CsCallout>
          Hiku&apos;s core audience spans{" "}
          <span className="cs-accent">18 to 55</span> year olds, young adults
          and lifelong hiking enthusiasts alike.
        </CsCallout>
        <CsSide
          media={
            <CsImg
              src="/work/Hiku/stat-1.webp"
              alt="Illustration for student usage interest in Hiku"
            />
          }
          title="In fact, 40%"
        >
          of students surveyed said they&apos;d actively use the app&apos;s
          core features,
        </CsSide>
        <CsSide
          media={
            <CsImg
              src="/work/Hiku/stat-11.webp"
              alt="Illustration for reduced trip-planning time with Hiku"
            />
          }
          title="and 20%"
        >
          said it would meaningfully cut down their trip-planning time.
        </CsSide>
        <CsText>
          Many are students living in dorms, looking for activities and clubs
          that are active on campus, plus community members who already love
          hiking and want{" "}
          <strong>like-minded people to share it with.</strong>
        </CsText>
      </CsSection>

      <CsSection
        id="hiku-takeaways"
        label="Reflections"
        title="From a simple idea to something people could use in the wild."
      >
        <CsText>
          Hiku stretched me. Taking one small idea all the way from a hunch to
          screens someone could actually navigate taught me how much of design
          lives in the unglamorous middle, the wireframes, the redos, the tiny
          navigation calls, and how good it feels when it finally clicks into
          something real.
        </CsText>
      </CsSection>

      <CsSeeNext id="hiku-see-next" current="hiku" />

      {protoOpen ? (
        <div className="hiku-proto-overlay" role="dialog" aria-modal="true" aria-label="Hiku interactive prototype">
          <div className="hiku-proto-bar">
            <span className="hiku-proto-bar-label">Hiku — interactive prototype</span>
            <button
              type="button"
              className="hiku-proto-close"
              aria-label="Close prototype"
              onClick={() => setProtoOpen(false)}
            >
              ×
            </button>
          </div>
          <iframe
            src="/work/Hiku/Hiku%20Design%20System/ui_kits/hiku-app/prototype.html"
            title="Hiku interactive prototype"
            className="hiku-proto-frame"
            data-lenis-prevent
          />
        </div>
      ) : null}
    </CsPage>
  );
};

export default HikuCaseStudy;
