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
  CsGrid3,
  CsChips,
  CsHmw,
  CsImg,
  CsVideo,
  CsSeeNext,
} from "../../components/CsKit/CsKit";

const SHOTS = "/work/keep/screens";

const KeepCaseStudy = () => {
  useScrollReset();

  return (
    <CsPage project="keep" accent="#0866FF" tint="#E7F0FF">
      <CsBreadcrumb current="Keep" />
      <CsHero>
        <CsVideo
          src="/work/keep/keep-thumb.mp4"
          label="Keep and Meta AI, the title animation"
        />
      </CsHero>

      <CsIntro
        title="Keep: A Memory Calendar That Answers Back"
        lead="A concept for Meta AI: a personal memory calendar you can simply ask, that answers with your original photo, note, or voice memo and keeps everything on your own device."
        meta={[
          { label: "Role", value: ["Product Designer", "Developer"] },
          { label: "Type", value: ["Concept for Meta AI", "Self initiated"] },
          { label: "Status", value: ["Shipped", "Live web app (PWA)"] },
          {
            label: "Tools",
            value: ["JavaScript", "three.js", "IndexedDB", "Google Maps"],
          },
          {
            label: "Scope",
            value: ["Mobile", "AI Interaction", "Personal Data", "Privacy"],
          },
        ]}
      />

      <div className="cs-col cs-try">
        <a
          className="cs-try-btn"
          href="https://keepxmeta.onrender.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Try Keep <span aria-hidden="true">↗</span>
        </a>
        <p className="cs-try-note">Shipped and live. Best on a phone, and your memories stay on your device.</p>
      </div>

      <CsSection id="keep-overview" label="Overview" title="What is Keep?">
        <CsText>
          Keep is a concept I designed for <strong>Meta AI</strong>, a way for
          an assistant to help you remember your own life without taking it
          over. It is not a Meta product and was not made with Meta; I built and
          shipped it myself as a live app, so the idea could be tested for real.
        </CsText>
        <CsText>
          Photos, voice notes, quotes, and places pile up across a dozen apps,
          and the moment you want one back, you cannot remember where you put
          it. Keep is a single calendar for all of it. Everything you keep is
          filed on the day it happened, and a search bar at the bottom answers
          in plain language.
        </CsText>
        <CsText>
          It is one static web app you can install on a phone. There is no
          server and no account: <strong>everything lives on the device</strong>
          , photos included.
        </CsText>
        <CsH3>My role</CsH3>
        <CsText>
          As the only designer and developer on this self initiated concept, I made it end to end: the calendar and its interactions,
          the way answers show the original memory, the 3D Re-live view, and the
          on-device people matching, then wrote the code for all of it.
        </CsText>
        <CsGrid3
          items={[
            {
              media: <CsImg src={`${SHOTS}/calendar.webp`} alt="Keep calendar with a thumbnail on every day that has a memory" />,
              caption: "A day per circle",
            },
            {
              media: <CsImg src={`${SHOTS}/ask.webp`} alt="Searching coffee in Keep and getting the original memories back" />,
              caption: "Ask in plain words",
            },
            {
              media: <CsImg src={`${SHOTS}/insights.webp`} alt="Keep Insights page with streaks and activity charts" />,
              caption: "See what you keep",
            },
          ]}
        />
      </CsSection>

      <CsSection id="keep-why" label="The concept" title="Why Meta AI?">
        <CsText>
          Most of what people want to remember already passes through Meta
          apps: the photos they post, the people they message, the places they
          tag. An assistant sitting there is well placed to help, and equally
          easy to distrust, because the memories are personal and the people in
          them did not agree to be analysed.
        </CsText>
        <CsText>
          Keep explores one answer: an assistant that <strong>answers from your
          own memories, on your own device</strong>, and always shows you the
          original. Meta&apos;s own avatars only work inside Meta&apos;s apps,
          so the concept also imagines how a person you remember could stand
          in the same place again, with an avatar you can restyle or replace
          with your own.
        </CsText>
        <CsPanel title="The characters the concept grew from">
          <CsImg
            src="/work/keep/meta-ai-characters.webp"
            alt="A line up of colourful 3D avatar characters standing together outdoors"
          />
        </CsPanel>
      </CsSection>

      <CsSection id="keep-problem" label="Problem" title="Keeping is easy. Finding is not.">
        <CsText>
          Most apps are good at collecting and bad at remembering. A photo sits
          in a camera roll, a voice note in another app, a quote in a notes
          file, and none of them know about each other. The only way back is to
          scroll.
        </CsText>
        <CsHmw
          items={[
            {
              question:
                "How might we let people keep anything without choosing where it goes?",
              solution:
                "One calendar takes photos, video, voice, notes, quotes, people, places, and files, and files each on the day it happened.",
            },
            {
              question:
                "How might we make finding a memory feel like asking a friend?",
              solution:
                "A single ask bar answers in plain language and always shows the original memory, and says so when nothing matches.",
            },
            {
              question:
                "How might we use faces, places, and maps without handing them to a server?",
              solution:
                "Everything runs on the phone: the face models ship inside the app, memories sit in the browser's own storage, and nothing is uploaded.",
            },
          ]}
        />
      </CsSection>

      <CsSection id="keep-approach" label="Design approach" title="Three rules I held to">
        <CsH3>1. The original always wins</CsH3>
        <CsText>
          An answer is never a summary that replaces the memory. Search shows
          the real photo, video, voice note, or quote, and says so when nothing
          matches, so Keep never invents a memory to be helpful.
        </CsText>
        <CsH3>2. Private by design</CsH3>
        <CsText>
          People matching, 3D avatars, and the map all run on the device. A
          face is stored as a list of numbers in the browser, never uploaded.
          Meta and Instagram avatars cannot be used outside Meta&apos;s own
          apps, so Keep ships its own avatar editor and also accepts your own
          avatar file.
        </CsText>
        <CsH3>3. Quiet by default</CsH3>
        <CsText>
          Name someone once and Keep quietly finds them in other photos in the
          background, with nothing to confirm. Anything it adds is labeled
          &quot;Tagged automatically&quot; and one tap removes a wrong match,
          for good.
        </CsText>
      </CsSection>

      <CsSection id="solution-section" label="Solutions" title="How it works">
        <CsH3>Solution #1: Ask your memories</CsH3>
        <CsCallout>
          Ask in plain words and get the{" "}
          <span className="cs-accent">original memory</span> back.
        </CsCallout>
        <CsPanel title="Searching the calendar">
          <CsVideo
            src="/work/keep/sol-ask.mp4"
            label="Asking Keep where the user had coffee and opening the matching memories"
          />
        </CsPanel>
        <CsText>
          The bar at the bottom of every screen takes a question and answers
          with the places, days, and notes it found, each one tappable. Related
          questions appear as chips, and a row of past dates shows where it
          sits in your life.
        </CsText>

        <CsH3>Solution #2: Re-live a place</CsH3>
        <CsCallout>
          Stand where a photo was taken and{" "}
          <span className="cs-accent">see who was there</span>.
        </CsCallout>
        <CsPanel title="Re-live">
          <CsVideo
            src="/work/keep/sol-relive.mp4"
            label="Re-live on a phone: a 3D avatar standing on a real street and changing pose"
          />
        </CsPanel>
        <CsText>
          Tag a photo with who is in it, their pose, and the spot. Later, point
          the camera at the same place and a 3D avatar of that person appears in
          the same pose, with a glass card of every journal kept about that
          moment. Drag to turn them, change their pose, or restyle their skin
          tone, hair, and clothes.
        </CsText>
        <CsPanel title="Matched on a real street">
          <CsImg
            src={`${SHOTS}/relive.webp`}
            alt="Re-live on a real street: a matched memory with a 3D avatar standing on the pavement"
            style={{ maxWidth: 300, margin: "0 auto" }}
          />
        </CsPanel>

        <CsH3>Solution #3: One calendar, with insights</CsH3>
        <CsCallout>
          Everything lands on <span className="cs-accent">the day it happened</span>.
        </CsCallout>
        <CsPanel title="Calendar, a day, and Insights">
          <CsVideo
            src="/work/keep/sol-calendar.mp4"
            label="Scrolling the calendar, opening a day with a voice note, and browsing the Insights page"
          />
        </CsPanel>
        <CsText>
          Each day with a memory shows a circle with its first photo. Opening a
          day lists everything kept, from photos to voice notes with a waveform.
          The Insights page counts what you keep and when, with streaks, a
          busiest day, time of day, people, places, and the words you use most.
          Any chart also switches to a plain table.
        </CsText>
      </CsSection>

      <CsSection id="keep-product" label="Final product" title="Features at a glance">
        <CsChips
          items={[
            "Photos, video, voice, notes, quotes",
            "People matched on device",
            "Places map and Street view",
            "3D avatars and style editor",
            "Insights and streaks",
            "Instagram import",
            "Back up and restore",
            "Works offline",
          ]}
        />
        <CsText>
          Install it from the browser and it behaves like a native app, with
          pull to refresh, an update banner when a new version is ready, and a
          swipe down gesture to close a photo.
        </CsText>
      </CsSection>

      <CsSection id="keep-limits" label="Honest limits" title="What it does not do yet">
        <CsText>
          Memories stay on one device, so there is no sync across phones yet and
          Back up and Restore carry them between devices. Search is keyword
          matching, not a language model. Re-live matches a similar view of the
          same place with a fingerprint of the image, so it does not track you as
          you walk. Instagram no longer lets apps read friends, so Keep imports
          Instagram&apos;s own data export instead.
        </CsText>
      </CsSection>

      <CsSection
        id="keep-systems"
        label="What I learned"
        title="Design systems: stay with what people already know"
      >
        <CsText>
          To make Keep feel like it belonged to Meta AI, I worked inside the
          systems that already exist: <strong>Meta AI&apos;s chat</strong> and{" "}
          <strong>Meta&apos;s published design system</strong>. It was the first
          time I had designed a product that had to live inside someone
          else&apos;s patterns, and it taught me more about systems design than
          any project before it.
        </CsText>
        <CsH3>The hard part: a memory that feels like a memory</CsH3>
        <CsText>
          The biggest challenge was fitting the memory interface into those
          systems. Looking back through a memory should feel like looking
          through a memory, with the photo, the day, and the people in it
          close at hand, and I did not want it to feel like another list of
          results. Getting that feeling out of components that were built for
          other things was the real design problem.
        </CsText>
        <CsH3>What it taught me</CsH3>
        <CsText>
          It is tempting to experiment a lot, and I did. But people already
          know how Meta&apos;s interfaces work, and that familiarity is worth
          more than anything new I could invent. So the lesson was to{" "}
          <strong>keep the same patterns people are used to</strong> and put the
          experimenting into what sits on top of them, not into the patterns
          themselves. A system is a promise to the people using it that things
          will work the way they expect.
        </CsText>
      </CsSection>

      <CsSection id="keep-reflection" label="Reflections" title="Answer, but never replace.">
        <CsText>
          Designing this as a concept for Meta AI taught me that the hard part of an AI memory product is
          restraint. Every feature that could guess, summarize, or tidy up also
          risked putting words between a person and their own memory. Keeping
          the original in front, and keeping everything on the device, made the
          product feel smaller and a lot more trustworthy. If Meta AI ever
          helped people remember, I would want it to work the same way.
        </CsText>
      </CsSection>

      <CsSeeNext id="keep-see-next" current="keep" />
    </CsPage>
  );
};

export default KeepCaseStudy;
