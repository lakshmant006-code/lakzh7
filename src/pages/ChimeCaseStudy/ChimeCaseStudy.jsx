import React, { useRef, useState } from "react";
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
  CsGrid3,
  CsStats,
  CsImg,
} from "../../components/CsKit/CsKit";
import "./ChimeCaseStudy.css";

const BASE = "/projects/chime";

/** A heartbeat that draws itself and calms as the pointer rests on it (hero micro-interaction). */
const Heartbeat = () => {
  const [calm, setCalm] = useState(false);
  return (
    <div
      className={`chime-beat${calm ? " is-calm" : ""}`}
      onPointerEnter={() => setCalm(true)}
      onPointerLeave={() => setCalm(false)}
      onClick={() => setCalm((c) => !c)}
      role="img"
      aria-label="An animated sound wave that settles into a calm line when you rest on it"
    >
      <svg viewBox="0 0 800 160" preserveAspectRatio="none" aria-hidden="true">
        <path className="chime-beat-loud" d="M0 80 L90 80 L120 30 L150 130 L185 12 L225 148 L262 52 L300 108 L340 80 L470 80 L500 40 L530 120 L560 64 L590 92 L620 80 L800 80" />
        <path className="chime-beat-calm" d="M0 80 L800 80" />
      </svg>
      <span className="chime-beat-hint">{calm ? "Quiet again." : "Rest here to quiet it"}</span>
    </div>
  );
};

/** Loads a heavy embed only when asked, with a ripple where you tapped. */
const TapToLoad = ({ src, title, height, label, poster }) => {
  const [on, setOn] = useState(false);
  const [rip, setRip] = useState(null);
  const ref = useRef(null);
  const start = (e) => {
    const r = ref.current.getBoundingClientRect();
    setRip({ x: e.clientX - r.left, y: e.clientY - r.top, k: Date.now() });
    setTimeout(() => setOn(true), 380);
  };
  return (
    <div className="chime-embed" ref={ref} style={{ height }}>
      {on ? (
        <iframe src={src} title={title} className="chime-embed-frame" loading="lazy" allow="fullscreen" data-lenis-prevent />
      ) : (
        <button type="button" className="chime-embed-cta" onClick={start} style={poster ? { backgroundImage: `url(${poster})` } : undefined}>
          <span className="chime-embed-label">{label}</span>
          <span className="chime-embed-play" aria-hidden="true">▶</span>
          {rip ? <i key={rip.k} className="chime-ripple" style={{ left: rip.x, top: rip.y }} /> : null}
        </button>
      )}
    </div>
  );
};

const ChimeCaseStudy = () => {
  useScrollReset();
  return (
    <CsPage project="chime" accent="#0866FF" tint="#E7F0FF">
      <CsBreadcrumb current="Chime" />
      <CsHero>
        <Heartbeat />
      </CsHero>

      <CsIntro
        title="Chime: Every Noise Complaint Gets a Heartbeat"
        lead="A concept for the NYC noise complaint challenge. You report in seconds with your voice, watch the city answer on a live 3D map, and get the last word on whether it really got quieter."
        meta={[
          { label: "Role", value: ["Product Designer", "Developer"] },
          { label: "Type", value: ["Design challenge", "Mobile concept"] },
          { label: "Status", value: ["Interactive prototype", "Live in this page"] },
          { label: "Tools", value: ["React", "deck.gl", "NYC 3D Building Model", "Figma"] },
          { label: "Scope", value: ["Voice input", "Notifications", "Civic data", "Motion"] },
        ]}
      />

      <div className="cs-col cs-try">
        <a className="cs-try-btn" href={`${BASE}/`} target="_blank" rel="noopener noreferrer">
          Open the prototype <span aria-hidden="true">↗</span>
        </a>
        <p className="cs-try-note">All complaints, reference numbers and outcomes are invented examples, not live 311 data.</p>
      </div>

      <CsSection id="chime-problem" label="The problem" title="Most complaints never hear back">
        <CsCallout>
          About <span className="cs-accent">610,000 noise complaints</span> a year, and most people never find out what happened.
        </CsCallout>
        <CsText>
          A noise complaint disappears into a form. There is no sense of where it is, who has it, or whether it worked. So people stop reporting, and the city stops hearing how loud it really is.
        </CsText>
      </CsSection>

      <CsSection id="chime-idea" label="The idea" title="The wave is the receipt">
        <CsText>
          Every complaint gets its own sound wave, generated from its reference number. The wave changes each time the city acts on it, and settles into a calm line when the resident confirms it got quieter. You can read where your case is without reading a form.
        </CsText>
        <CsPanel title="Try the prototype">
          <TapToLoad
            src={`${BASE}/`}
            title="Chime interactive phone prototype"
            height={800}
            label="Tap to open the Chime prototype"
            poster={`${BASE}/media/map-hush.webp`}
          />
        </CsPanel>
        <CsText>
          It walks the whole loop: say it out loud, see the case move through five stages, get a banner when the city responds, and answer one question, did it get quieter.
        </CsText>
      </CsSection>

      <CsSection id="chime-flow" label="How it works" title="Four moments">
        <CsH3>1. Say it out loud</CsH3>
        <CsText>Tap the orb and describe the noise. Chime turns it into a case. Your voice stays on your phone until you send it.</CsText>
        <CsH3>2. Watch the city answer</CsH3>
        <CsText>Five stages, from received to outcome. Each time the case moves, the wave picks up a steadier rhythm and a banner arrives, like any other notification.</CsText>
        <CsH3>3. See where the sound is</CsH3>
        <CsText>A 3D map built on the NYC building model shows which blocks are loudest, in day, night and diorama views. Tap anywhere on a block to drop a sound.</CsText>
        <CsH3>4. Get the last word</CsH3>
        <CsText>The official outcome shows first. Then Chime asks the only question that matters: did it actually get quieter. Yes closes the case. No sends it back.</CsText>
      </CsSection>

      <CsSection id="chime-map" label="The city has ears" title="A 3D map of the noise">
        <CsText>
          The map is built from the city's own 3D building data: 15 neighbourhoods plus the whole skyline, cut into small meshes that load on demand so the page stays fast.
        </CsText>
        <TapToLoad
          src={`${BASE}/hello.html`}
          title="Hello? the original single-page concept with the 3D noise map"
          height={720}
          label="Tap to explore the full concept and 3D map"
          poster={`${BASE}/media/map-default.webp`}
        />
        <CsGrid3
          items={[
            { media: <CsImg src={`${BASE}/media/map-default.webp`} alt="Day view of the 3D noise map" />, caption: "Day" },
            { media: <CsImg src={`${BASE}/media/map-night.webp`} alt="Night view of the 3D noise map" />, caption: "Night" },
            { media: <CsImg src={`${BASE}/media/map-diorama.webp`} alt="Diorama view of the 3D noise map" />, caption: "Diorama" },
          ]}
        />
        <CsStats
          items={[
            { value: "15", label: "Neighbourhoods modelled" },
            { value: "3", label: "Map views" },
            { value: "5", label: "Case stages" },
            { value: "610k", label: "Complaints a year in NYC" },
          ]}
        />
      </CsSection>

      <CsSection id="chime-walk" label="Launch" title="The launch video">
        <CsPanel title="Chime, launched">
          <video
            className="cs-media chime-launch"
            src={`${BASE}/media/launch.mp4`}
            poster={`${BASE}/media/launch-poster.jpg`}
            controls
            playsInline
            preload="none"
            aria-label="The Chime launch video"
          />
        </CsPanel>
      </CsSection>

      <CsSection id="chime-brand" label="Brand" title="From Hush to Chime">
        <CsText>
          The concept went through four names, Copy That, Hush, Hello? and finally Chime, as the idea moved from a form to a feeling. The icon is a small blue ear with a dot, the sound arriving.
        </CsText>
        <CsPanel>
          <CsImg src={`${BASE}/media/billboard-mockups.webp`} alt="Billboard mockups for the concept" />
        </CsPanel>
      </CsSection>
    </CsPage>
  );
};

export default ChimeCaseStudy;
