import React, { useEffect } from "react";
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
  CsHmw,
  CsImg,
  CsVideo,
  CsEmbed,
  CsStats,
  CsSeeNext,
} from "../../components/CsKit/CsKit";
import FlowRoute from "../../components/FlowRoute/FlowRoute";
import "./QuizAICaseStudy.css";

const QUIZAI_SOLUTIONS = [
  {
    video: "/work/quizai/reef-generate.mp4",
    title: "Solution #1: Generating on the canvas",
    headlineLead: "Wire a PDF into a template, tap Generate, and ",
    headlineHighlight: "the notes appear beside it.",
    caption:
      "The setup work is the thing students skip, so on Reef there is almost none. A lecture PDF sits on a canvas, you connect it to a template that says how you like to study, and Reef writes the notes into a card next to it. You can see where everything came from, and change one line to get something different.",
  },
  {
    video: "/work/quizai/reef-organize.mp4",
    title: "Solution #2: Organizing the board",
    headlineLead: "Zoom out and the whole course sits in one place, ",
    headlineHighlight: "easy to arrange and easy to find.",
    caption:
      "As cards pile up, a board gets messy fast. Reef lets you zoom all the way out, drag groups of cards into rows and tidy a subject at a time, so everything for an exam lives in one spot, and coming back to it feels easy instead of like a chore.",
  },
  {
    video: "/work/quizai/reef-lectures.mp4",
    title: "Solution #3: Lectures and the roadmap",
    headlineLead: "Say what you want to learn and Reef lays out ",
    headlineHighlight: "a roadmap with free lectures.",
    caption:
      "Not every topic comes with notes. Open the library, type what you are after and Reef draws what to learn first, step by step, linking each step to a free lecture. Drop a lecture card next to your own notes and you can study from both in the same place.",
  },
  {
    video: "/work/quizai/reef-buddy.mp4",
    title: "Solution #4: A study buddy",
    headlineLead: "A little companion keeps you going, ",
    headlineHighlight: "and shows up when you need a break.",
    caption:
      "Studying is long and quiet, so a small golden retriever lives on the canvas. Tap it and it cheers you on, fetch a ball when you step away, and make a long session feel a little less lonely.",
  },
];

const QuizAICaseStudy = () => {
  useScrollReset();

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

  return (
    <CsPage project="quizai" accent="#B0506A" tint="#F7E9EC">
      <CsBreadcrumb current="Reef" />
      <CsHero>
        <picture>
          <source
            type="image/webp"
            srcSet="/work/quizai/hero-before-640.webp 640w, /work/quizai/hero-before-1024.webp 1024w, /work/quizai/hero-before-1600.webp 1600w"
            sizes="(min-width: 1104px) 1040px, 100vw"
          />
          <img
            src="/work/quizai/hero-before-1024.jpg"
            alt="Reef landing page mockup on a laptop screen"
            loading="eager"
            decoding="async"
          />
        </picture>
      </CsHero>

      <CsIntro
        title="AI Powered Notetaking Application"
        lead="To create an intuitive and easy experience for students to maintain and improve their productivity."
        meta={[
          {
            label: "Role",
            value: [
              "UX Researcher, UX Designer,",
              "Interaction Designer, and Developer",
            ],
          },
          { label: "Timeline", value: "September, November 2024 (10 weeks)" },
          { label: "Tools", value: "Figma, React, TypeScript, Node.js, Cursor" },
          {
            label: "Scope",
            value: [
              "Human Interface Design",
              "UX Research",
              "Data Application",
              "Web Development",
            ],
          },
        ]}
      />

      <CsSection id="quizai-traction" label="Traction" title="What the numbers say">
        <CsText>
          Over its last 90 days live, Reef was used by 162 people, nearly all of them new, and together they
          recorded close to four thousand interactions with it.
        </CsText>
        <CsStats
          items={[
            { value: "162", label: "Active users in 90 days" },
            { value: "158", label: "New users" },
            { value: "3.7k", label: "Interactions recorded" },
          ]}
        />
        <CsText>Measured with Google Analytics, over the last 90 days.</CsText>
      </CsSection>

      <CsSection
        id="solution-section"
        label="The final product"
        title="What Reef does"
      >
        <CsText>
          Here is what Reef does. Every screen was built around one question:
          what makes a student want to open the app instead of putting studying
          off? You drop in a PDF and it comes back as summaries, quizzes, and
          neatly filed notes in a few taps.
        </CsText>
        {QUIZAI_SOLUTIONS.map((solution) => (
          <React.Fragment key={solution.title}>
            <CsH3>{solution.title}</CsH3>
            <CsCallout>
              {solution.headlineLead}
              <span className="cs-accent">{solution.headlineHighlight}</span>
            </CsCallout>
            <CsPanel title={solution.title.replace(/^Solution #\d+: /, "")}>
              <CsVideo src={solution.video} />
            </CsPanel>
            <CsText>{solution.caption}</CsText>
          </React.Fragment>
        ))}
      </CsSection>

      <CsSection id="quizai-context" label="Overview" title="What is Reef?">
        <CsText>
          Most students want to study smarter, they just don&apos;t want to
          spend an hour turning messy notes into flashcards first. Reef closes
          that gap: upload your notes and it hands back clean summaries and self
          scoring quizzes in one step, so the actual studying finally happens.
        </CsText>
        <CsH3>My role</CsH3>
        <CsText>
          I wore a few hats on this one. I ran the user research with students,
          turned what I heard into the interaction patterns, and wrote the full
          stack code. I owned it from the first sketches through what shipped,
          and worked with stakeholders along the way on both the product
          direction and how it was built.
        </CsText>
        <CsPanel title="Landing page, dashboard, and AI study assistant">
          <CsImg
            src="/work/quizai/hero-new.webp"
            alt="Reef landing page, dashboard, and AI study assistant screens"
          />
        </CsPanel>
      </CsSection>

      <CsSection
        id="quizai-research"
        label="Key design moments"
        title={
          <>
            What&apos;s <span className="cs-accent">really</span> going on?
          </>
        }
      >
        <CsH3>Research &amp; User Discovery</CsH3>
        <CsText>
          Sit in on any lecture and watch what happens afterward, notes get
          scribbled down, filed away, and rarely opened again. The research
          backs that up:
        </CsText>
        <ul className="cs-list">
          <li>Students capture only about a third of the important material.</li>
          <li>They miss close to 40% of the key points.</li>
          <li>
            More than half struggle to stay engaged or hold onto what they
            learned.
          </li>
        </ul>
        <CsText>
          The harder part is what comes after the notes. Active recall and self
          testing are what move ideas into long term memory, but building that
          habit today means hopping between separate tools, one for notes,
          another for study docs, another for quizzes. So most students skip
          it.
        </CsText>
        <CsText>
          That&apos;s the gap Reef is built to close. It takes a
          student&apos;s raw notes and, in a single step, turns them into
          organized study materials and auto generated, self scoring quizzes,
          so real studying becomes the easy default instead of one more chore to
          put off.
        </CsText>
        <CsH3>Key Insights &amp; Problem Definition</CsH3>
        <CsText>A few things came up again and again:</CsText>
        <ul className="cs-list">
          <li>Making quizzes by hand takes forever.</li>
          <li>Notes pile up into overwhelm.</li>
          <li>No one could tell whether they were actually getting better.</li>
        </ul>
        <CsText>
          What students wanted was studying that felt personal, with feedback
          that showed them they were making progress.
        </CsText>
        <CsH3>Design Impact &amp; Feature Direction</CsH3>
        <CsText>
          Those conversations shaped what came next: the one click quizzes, the
          auto summaries, the study groups, and progress you can see at a
          glance. Each one had to pass the same test, does it make studying
          feel lighter, or just add one more thing to do?
        </CsText>
        <CsPanel title="Design process" wide>
          <CsEmbed
            src="/work/quizai/design-process/index.html"
            title="Design Process, Reef"
            height="700px"
          />
        </CsPanel>
        <CsHmw
          items={[
            {
              question:
                "How might we turn dense notes into study ready material without the busywork?",
              solution:
                "Auto generate quizzes and summaries from any uploaded document, so students spend their time learning instead of formatting.",
            },
            {
              question:
                "How might we keep learners aware of their progress and motivated to review?",
              solution:
                "A progress dashboard tracks mastery by topic and nudges timely review before knowledge fades.",
            },
            {
              question: "How might we make studying feel less isolating?",
              solution:
                "Study groups let students share decks and quiz each other, turning solo prep into a shared routine.",
            },
          ]}
        />
        <CsH3>The one thing testing kept asking for</CsH3>
        <CsText>
          The strongest signal from user testing was simple: people loved being
          quizzed. That is the testing effect. You hold onto something far
          better after you try to recall it than after you read it again. With
          everyone trying to remember more in less time, that felt like the
          center of Reef, and it came straight out of asking what the one
          thing Reef could not live without.
        </CsText>
        <CsText>
          So the direction became a gentle reminder system. Before an exam you
          choose the days you want Reef to check in, and at each moment it
          does more than remind you. It hands you a quick quiz on the very
          flashcards you were trying to remember. You set your own intervals, so
          recall practice slips into your day instead of piling up the night
          before.
        </CsText>
      </CsSection>

      <CsSection
        id="quizai-design-approach"
        label="Design approach"
        title="Streamlining the Upload to Quiz Flow"
      >
        <CsText>
          Research showed students were dropping off after uploading, the path
          from document to quiz wasn&apos;t clear. The redesigned flow makes
          each step explicit: <strong>upload, process, generate</strong>, so
          students always know where they are and what comes next.
        </CsText>
        <CsPanel title="User flow" padded>
          <FlowRoute
            node="Reef"
            question="Ready to study?"
            yes={{ title: "Study", icon: "✓", idle: "WAITING", active: "{n} READY" }}
            no={{ title: "Processing", icon: "…", idle: "EMPTY", active: "{n} IN QUEUE" }}
            items={[
              { icon: "↑", title: "Upload material", sub: "Notes.pdf, 24 pages", to: "no" },
              { icon: "✦", title: "Summary ready", sub: "Synthesised from your notes", to: "yes" },
              { icon: "?", title: "Pick a quiz type", sub: "Type A or Type B", to: "no" },
              { icon: "✓", title: "Quiz generated", sub: "12 questions, ready to take", to: "yes" },
              { icon: "▤", title: "Flashcards", sub: "Saved to your folder", to: "yes" },
            ]}
          />
        </CsPanel>

        <CsH3>From Research to Design</CsH3>
        <CsText>
          To address the information overload students described, I pulled
          frequently accessed materials to the front of the dashboard and
          placed AI generated summaries and quizzes{" "}
          <strong>one click away from any uploaded document</strong>.
        </CsText>
      </CsSection>

      <CsSection id="quizai-impact" label="Impact" title="Moving forward">
        <CsText>
          Rather than stop at a tool for uploading notes, I&apos;m moving
          forward and building Reef into a full application around the
          testing effect. The point is to help people remember faster: you set
          your own intervals, Reef asks you questions on its own and surfaces
          your flashcards, and you review right after you answer, while the
          recall is still fresh. The number I want to watch is students keeping
          up with their studying instead of cramming.
        </CsText>
      </CsSection>

      <CsSection
        id="quizai-reflection"
        label="Reflections"
        title="This was my first design role as Reef's only designer, handling both product design and development."
      >
        <CsText>
          Being the only designer, and the one writing the code, meant there
          was nowhere to hand a problem off. It pushed me to carry an idea the
          whole way, from a rough sketch to something you can actually click and
          use, and to make peace with shipping before it felt perfect.
        </CsText>
        <CsH3>Universal learning, not just equal learning</CsH3>
        <CsText>
          The biggest lesson wasn&apos;t technical. Building Reef made me
          think hard about who education tech actually leaves out. Good design
          here isn&apos;t giving everyone the same thing, it&apos;s meeting
          people where they learn, especially the ones who never clicked with
          the traditional way. That idea quietly shaped every choice I made.
        </CsText>
      </CsSection>

      <CsSeeNext id="quizai-see-next" current="reef" />
    </CsPage>
  );
};

export default QuizAICaseStudy;
