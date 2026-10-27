import React from "react";
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
  CsStats,
  CsChips,
  CsHmw,
  CsImg,
  CsVideo,
  CsSeeNext,
} from "../../components/CsKit/CsKit";

const BASE = "/work/keep";

const FEATURES = [
  {
    img: `${BASE}/viewer.jpg`,
    title: "Memories",
    lead: "One calendar. ",
    highlight: "Every day you kept something.",
    caption:
      "Each day is a small circle holding your photo, with a ring that shows it's kept. Tap a day to open a frosted-glass sheet, swipe photos and videos like a story, and drag down to dismiss. There are no buttons to hunt for.",
  },
  {
    img: `${BASE}/insights.jpg`,
    title: "Insights",
    lead: "Streaks and patterns, ",
    highlight: "calculated on the phone.",
    caption:
      "A light, Meta-blue page for 30 days, 90 days, 12 months or all time: memories kept, current and longest streak, busiest day, activity per week and what you keep by type. Every chart has a table view too.",
  },
  {
    img: `${BASE}/people.jpg`,
    title: "People",
    lead: "Tag a face once, ",
    highlight: "find them everywhere.",
    caption:
      "Name a person and Keep quietly matches that face across your other photos, in the background and with no pop-ups. Friends can be added by hand or imported from an Instagram data export, because Instagram does not let apps read your friends directly.",
  },
];

const BUILD_LOG = [
  ["A calendar of circles", "A single-file web app with one memory per day, local photo import and an install prompt."],
  ["Feels like an app", "Pull to refresh with real spring physics, an update banner served by a service worker, and a photo onboarding."],
  ["Viewer, rebuilt", "Swipeable full-screen photos with feathered edges, long press to delete and video recording with pinch-free zoom."],
  ["Faces, quietly", "On-device face matching with a tiny detector and strict thresholds, so a wrong name is rarer than a missed one."],
  ["Places and avatars", "Google Street View to stand in a memory's place, with 3D avatars you can restyle or import as a .glb file."],
  ["Friends and Insights", "An Instagram export importer and a numbers page, checked against an independent recount."],
];

const KeepCaseStudy = () => {
  useScrollReset();

  return (
    <CsPage project="keep" accent="#0866FF" tint="#EEF3FF">
      <CsBreadcrumb current="Keep" />
      <CsHero>
        <img
          src={`${BASE}/hero.jpg`}
          alt="Keep: a calendar of memories, a story-style viewer and an insights page"
        />
      </CsHero>

      <CsIntro
        title="Keep: A Private Memory Journal"
        lead="A calm calendar app for the moments you keep, with faces, places and streaks that all stay on your phone."
        meta={[
          { label: "Role", value: "Design Engineer" },
          { label: "Timeline", value: "2026" },
          {
            label: "Tools",
            value: ["JavaScript", "IndexedDB", "three.js", "face-api", "Google Maps"],
          },
          {
            label: "Scope",
            value: ["Product Design", "PWA Development", "On-device ML"],
          },
        ]}
      />

      <CsSection
        id="keep-context"
        label="Context"
        title="Camera rolls are a pile, not a story"
      >
        <CsText>
          Phones hold thousands of photos but almost no sense of the days they
          came from. Social apps turn memories into a feed to perform for.
          Keep goes the other way: one calendar, one small circle per day, and
          nothing to post.
        </CsText>
        <CsCallout>
          What if keeping a memory felt as light as{" "}
          <span className="cs-accent">filling in a day?</span>
        </CsCallout>
        <CsText>
          Keep is a web app you install to your home screen. Everything you
          add is saved in the browser on your phone and nowhere else, and
          there&apos;s a backup you can download and restore on a new device.
        </CsText>
        <CsStats
          items={[
            { value: "1", label: "circle per day, no feed" },
            { value: "0", label: "photos uploaded to a server" },
            { value: "3", label: "ways to browse: days, places, people" },
          ]}
        />
      </CsSection>

      <CsSection
        id="keep-product"
        label="Final product"
        title="Kept, found and revisited"
      >
        {FEATURES.map((f) => (
          <CsSide
            key={f.title}
            panelTitle={f.title}
            media={<CsImg src={f.img} alt={f.title} />}
            title={
              <>
                {f.lead}
                <span className="cs-accent">{f.highlight}</span>
              </>
            }
          >
            {f.caption}
          </CsSide>
        ))}
        <CsPanel title="A short tour: calendar, a day, then Insights" wide>
          <CsVideo
            src={`${BASE}/tour.mp4`}
            label="A walkthrough of the Keep calendar, a day's memories and the Insights page"
          />
        </CsPanel>
      </CsSection>

      <CsSection
        id="keep-process"
        label="Process"
        title="Key Design Moments"
      >
        <CsH3>Make it feel installed, not bookmarked</CsH3>
        <CsText>
          Keep is a static site, but it had to behave like an app. A service
          worker keeps it working offline and shows an update banner when a new
          version is ready, pull to refresh follows a real spring, and the
          status bar blends into the page once it is installed.
        </CsText>

        <CsH3>How the build unfolded</CsH3>
        <CsPanel title="From a calendar to a private memory journal" padded>
          <ol className="cs-list">
            {BUILD_LOG.map(([title, text], i) => (
              <li key={title}>
                <strong>
                  {i + 1}. {title}.
                </strong>{" "}
                {text}
              </li>
            ))}
          </ol>
        </CsPanel>

        <CsH3>Recognition that never interrupts</CsH3>
        <CsText>
          Face matching runs in the background the moment you type a name, and
          it never shows a message about it. Two thresholds decide what
          happens: a close match is tagged automatically, a likely one is
          offered as a suggestion, and anything weaker is ignored. The models
          load on the device, so no face ever leaves it.
        </CsText>
        <CsChips
          items={[
            "IndexedDB storage",
            "Service worker updates",
            "On-device face matching",
            "Street View avatars",
            "Instagram export import",
          ]}
        />

        <CsHmw
          items={[
            {
              question: "How might we keep memories without making a feed?",
              solution:
                "One circle per day on a calendar, with no likes, followers or posting.",
            },
            {
              question: "How might we find a person without sending faces anywhere?",
              solution:
                "Run a small face model on the device and match quietly after a name is typed.",
            },
            {
              question: "How might we connect Instagram when apps can't read it?",
              solution:
                "Import the data export a person downloads themselves, and keep it on the phone.",
            },
          ]}
        />
      </CsSection>

      <CsSection
        id="keep-takeaways"
        label="Takeaways"
        title="What I learned"
      >
        <CsText>
          Privacy shaped almost every decision, from storing in the browser to
          choosing models that run on the phone. Small details mattered more
          than features: a swipe that dismisses, a tap that never double fires,
          a count that matches an independent recount.
        </CsText>
        <CsText>
          Next up are a native wrapper for iOS and Android, shared days with a
          friend, and a gentler weekly revisit of memories from a year ago.
        </CsText>
      </CsSection>

      <CsSeeNext
        id="keep-see-next"
        items={[
          {
            to: "/pro-move",
            video: "/projects/promove/promove.mp4",
            title: "pro-move by Procreate: A Motion Capture Concept",
            description:
              "Perform on camera and the character you drew moves with you.",
          },
          {
            to: "/hiku",
            video: "/work/Hiku/hiku-promo.mp4",
            title: "Hiku: A Mobile Application for Hiking Enthusiasts",
            description:
              "Connecting hikers around shared trails and making it easy to buy or rent gear.",
          },
        ]}
      />
    </CsPage>
  );
};

export default KeepCaseStudy;
