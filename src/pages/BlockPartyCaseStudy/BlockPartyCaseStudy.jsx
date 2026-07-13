import React from "react";
import useScrollReset from "../../hooks/useScrollReset";
import Footer from "../../components/Footer/Footer";
import CaseStudyLayout from "../../components/CaseStudyLayout/CaseStudyLayout";
import FadeInSection from "../../components/FadeInSection/FadeInSection";
import IntroFan from "./IntroFan";
import InspirationGallery from "./InspirationGallery";
import HeroTitleConfetti from "./HeroTitleConfetti";
import ImageCompareSlider from "./ImageCompareSlider";
import GeminiPipelineFlow from "./GeminiPipelineFlow";
import DemoExperienceFlow from "./DemoExperienceFlow";
import TakeawaysCarousel from "./TakeawaysCarousel";
import ClosingCanvas from "./ClosingCanvas";
import "./BlockPartyCaseStudy.css";

const HERO_TAGS = ["Gemini AI", "Interactive Installation", "Play"];

const WHY_STORY = [
  {
    key: "why-1",
    content: (
      <>
        Growing up, I was pulled away from anything I found fun because I was
        told these were distractions from what truly mattered —{" "}
        <span className="blockparty-story-emphasis">studying</span>. Play came
        last, if at all.
      </>
    ),
  },
  {
    key: "why-2",
    content: (
      <>
        The older I got, the more I craved those small moments to pause. And
        yet, when I finally had the time, it almost felt difficult — like I'd
        forgotten how, or worse, like I shouldn't. I felt{" "}
        <span className="blockparty-story-emphasis">guilty</span>, like I was
        supposed to be doing something more &quot;productive.&quot;
      </>
    ),
  },
  {
    key: "why-3",
    content: (
      <>
        As adults, we get buried in deadlines, to-do lists, what to cook for
        dinner. We sometimes forget that we&apos;re really just{" "}
        <span className="blockparty-story-emphasis">overgrown children</span>{" "}
        who got handed a lot of responsibility. That child inside of us still
        wants to play.{" "}
        <span className="blockparty-story-emphasis">
          We just never gave them the time, never gave them the chance to
        </span>
        .
      </>
    ),
  },
  {
    key: "why-4",
    content: <>So I decided to build my thesis for them.</>,
  },
];

const WHATS_NEXT_ITEMS = [
  {
    key: "whats-next-1",
    content: (
      <>
        <span className="font-semibold">Scale</span> the map to fill an entire
        wall, an entire room.
      </>
    ),
  },
  {
    key: "whats-next-2",
    content: (
      <>
        Get the AI pipeline to{" "}
        <span className="font-semibold">pixel-perfect</span> on the first try.
      </>
    ),
  },
  {
    key: "whats-next-3",
    content: (
      <>
        Let characters{" "}
        <span className="font-semibold">grow and evolve over time.</span>
      </>
    ),
  },
];

const CLOSING_BLURB = (
  <div className="blockparty-takeaways-blurb blockparty-closing-blurb">
    <p className="blockparty-story-p">
      For where Block Party is today, it came with so many learning lessons, so
      many crash outs and so many late nights.
    </p>
    <p className="blockparty-story-p">
      I have Yuliya (my Thesis advisor), my friends at ITP, and my loved ones
      &amp; family to thank for all the advice, time and support over the past
      year in keeping me sane and in shaping Block Party&apos;s success.
    </p>
    <p className="blockparty-story-p font-semibold">
      At the end of the day, Block Party is just one medium. What I hope for
      everyone here today is that you find your own — something that gives you a
      moment to step away from the busy, and to experience your own delight,
      joy, and play.
    </p>
  </div>
);

const TAKEAWAYS_BLURB = (
  <div className="blockparty-takeaways-blurb">
    <p className="blockparty-story-p">
      Fine-tuning sprite direction was such a pain.
    </p>
    <p className="blockparty-story-p">
      Getting consistent left-facing, right-facing, front, back... AI genuinely
      struggles to understand what &quot;side profile&quot; or
      &quot;left-facing&quot; means. After enough failed attempts, I figured out
      that telling the model what NOT to do worked better than telling it what
      to do.
    </p>
    <p className="blockparty-story-p">
      Trying to control character size in the prompt also caused a whole other
      set of problems. Turns out AI is smart enough to read what it can see, so
      you only need to prompt for what the image can&apos;t show.
    </p>
    <p className="blockparty-story-p">
      If I had to pick the biggest takeaway, it would be: Code can handle
      anything predictable.{" "}
      <span className="font-semibold">
        Only prompt AI for what genuinely requires imagination
      </span>
      .
    </p>
  </div>
);

const CONTENT_SECTIONS = [
  { id: "problem-making", label: "Design Iterations" },
  { id: "full-experience", label: "Demo Experience" },
  { id: "whats-next", label: "What's Next" },
  { id: "learning-points", label: "Takeaways" },
  { id: "closing", label: "Closing" },
];

const DINO_ICON_SRC = "/projects/block-party/dino.png";

const RESOURCE_LINKS = [
  {
    key: "view-app",
    label: "View App",
    url: "https://block-party-thesis.vercel.app",
  },
  {
    key: "documentation",
    label: "Documentation",
    url: "https://bevyip.notion.site/block-party-thesis?source=copy_link",
  },
];

export default function BlockPartyCaseStudy() {
  useScrollReset();

  return (
    <main className="blockparty-case-study">
      <CaseStudyLayout projectId="blockparty">
        <section
          id="blockparty-hero"
          className="blockparty-section blockparty-section--hero"
          aria-labelledby="blockparty-hero-title"
        >
          <div className="page-content-shell">
            <div className="blockparty-hero-head">
              <p className="blockparty-eyebrow blockparty-hero-fade-in">
                NYU ITP Thesis (Dec 2025 — May 2026)
              </p>
              <HeroTitleConfetti
                id="blockparty-hero-title"
                className="blockparty-hero-title"
              >
                Block Party
              </HeroTitleConfetti>
              <p className="blockparty-hero-subtitle blockparty-hero-fade-in">
                An interactive installation where you can create anything on a
                backlit pegboard. Watch your creation transform into an animated
                character that joins and interacts with others in a digital
                world.
              </p>
              <div className="blockparty-hero-tags blockparty-hero-fade-in">
                {HERO_TAGS.map((tag) => (
                  <span key={tag} className="blockparty-hero-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="blockparty-hero-media">
              <div className="blockparty-hero-video">
                <iframe
                  src="https://player.vimeo.com/video/1190889138?badge=0&autopause=0&player_id=0&app_id=58479#t=1s"
                  title="ITP Thesis Week 2026 - Beverly Yip"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>

        <FadeInSection
          id="blockparty-why"
          className="blockparty-section"
          aria-label="The Why"
        >
          <div className="page-content-shell">
            <div className="blockparty-why-content">
              <div className="blockparty-intro-head">
                <p className="blockparty-eyebrow">
                  Why did I choose this as my thesis?
                </p>
                <p className="blockparty-intro-statement">
                  The child inside of us still wants to <em>play</em>.
                </p>
              </div>
              <div className="blockparty-intro-fan-wrap">
                <IntroFan />
              </div>
              <div className="blockparty-story">
                <div className="blockparty-story-col">
                  {WHY_STORY.slice(0, 2).map((paragraph) => (
                    <p key={paragraph.key} className="blockparty-story-p">
                      {paragraph.content}
                    </p>
                  ))}
                </div>
                <div className="blockparty-story-col">
                  {WHY_STORY.slice(2).map((paragraph) => (
                    <p key={paragraph.key} className="blockparty-story-p">
                      {paragraph.content}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>

        <FadeInSection
          id="blockparty-inspiration"
          className="blockparty-section"
          aria-labelledby="blockparty-inspiration-title"
        >
          <div className="page-content-shell">
            <div className="blockparty-inspiration-content">
              <div className="blockparty-intro-head">
                <p
                  className="blockparty-eyebrow"
                  id="blockparty-inspiration-title"
                >
                  Inspiration
                </p>
                <div className="blockparty-inspiration-lead">
                  <p className="blockparty-intro-statement">
                    People love creating <em>a version of themselves</em>{" "}
                    online.
                  </p>
                  <p className="blockparty-story-p">
                    It also doesn&apos;t have to be pixel-perfect. As long as it
                    captured the{" "}
                    <span className="blockparty-story-emphasis">essence</span>{" "}
                    of what people thought was most important to them.
                  </p>
                </div>
              </div>
              <InspirationGallery />
              <div className="blockparty-inspiration-memory">
                <div className="blockparty-inspiration-memory-row">
                  <div className="blockparty-inspiration-memory-media">
                    <img
                      src="/projects/block-party/sketch-aq.gif"
                      alt="People coloring paper fish that swim to life on a giant screen"
                      className="blockparty-inspiration-memory-gif"
                      loading="lazy"
                    />
                  </div>
                  <p className="blockparty-story-p blockparty-inspiration-memory-lead">
                    Then I remembered more than a decade ago, I walked into a
                    room where people colored a paper fish — and watched it swim
                    to life on a giant screen.
                  </p>
                </div>
                <div className="blockparty-inspiration-memory-tail">
                  <p className="blockparty-story-p">
                    <span className="blockparty-story-emphasis">
                      A 6 year old and a 60 year old, experiencing the same
                      wonder at the same moment.
                    </span>
                  </p>
                  <p className="blockparty-story-p">
                    When I think about joy, delight and play, I seem to always
                    come back to this moment when I experienced all of that{" "}
                    <span className="blockparty-story-emphasis">
                      all at once
                    </span>
                    . And it made me want to recreate that feeling in others.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>

        <FadeInSection
          id="blockparty-question"
          className="blockparty-section blockparty-section--quote"
          aria-label="Block Party quote"
        >
          <div className="page-content-shell">
            <div className="blockparty-quote-image-wrap">
              <img
                src="/projects/block-party/quote.png"
                alt="What if you could physically make something that could come to life?"
                className="blockparty-quote-image"
                loading="lazy"
              />
            </div>
          </div>
        </FadeInSection>

        {CONTENT_SECTIONS.map((section) => {
          const headingId = `blockparty-${section.id}-heading`;
          const headingText = section.label ?? section.title;

          return (
            <FadeInSection
              key={section.id}
              id={`blockparty-${section.id}`}
              className="blockparty-section"
              aria-labelledby={headingId}
            >
              <div className="page-content-shell">
                {section.label ? (
                  <p
                    id={headingId}
                    className="blockparty-eyebrow blockparty-section-eyebrow"
                  >
                    {section.label}
                  </p>
                ) : (
                  <h2 id={headingId} className="blockparty-section-title">
                    {section.title}
                  </h2>
                )}
                {section.id === "problem-making" ? (
                  <div className="blockparty-iteration-stack">
                    <div className="blockparty-iteration-row">
                      <div className="blockparty-iteration-copy blockparty-story-col">
                        <h3 className="blockparty-iteration-title">
                          The Medium
                        </h3>
                        <p className="blockparty-story-p">
                          My first instinct for the medium was building cubes —
                          total creative freedom, easy to scan. But total
                          creative freedom meant total unpredictability.
                          Lopsided shapes. Multiple objects in one frame. Things
                          built upward, out of frame. Chaos.
                        </p>
                        <p className="blockparty-story-p">
                          I needed something that gave people freedom{" "}
                          <em>within</em> boundaries. Fixed positions. Always
                          flat. Always consistent.
                        </p>
                        <p className="blockparty-story-p">
                          That&apos;s when I found the{" "}
                          <span className="font-semibold">Lite-Brite</span> — a
                          children&apos;s toy that had solved my exact problem
                          decades before I had it.
                        </p>
                      </div>
                      <div className="blockparty-iteration-media">
                        <ImageCompareSlider
                          beforeSrc="/projects/block-party/blocks.png"
                          afterSrc="/projects/block-party/lite-brite.gif"
                          beforeAlt="Block Party pegboard with colored blocks"
                          afterAlt="Block Party pegboard lit up like a Lite-Brite"
                          beforeLabel="First Iteration"
                          afterLabel="Final Iteration"
                          initialPosition={15}
                        />
                      </div>
                    </div>
                    <div className="blockparty-iteration-row blockparty-iteration-row--flip">
                      <div className="blockparty-iteration-media">
                        <ImageCompareSlider
                          beforeSrc="/projects/block-party/voxel.png"
                          afterSrc="/projects/block-party/sprite-animation.gif"
                          beforeAlt="Block Party character as a voxel model"
                          afterAlt="Block Party character sprite animation"
                          beforeLabel="First Iteration"
                          afterLabel="Final Iteration"
                          initialPosition={15}
                        />
                      </div>
                      <div className="blockparty-iteration-copy blockparty-story-col">
                        <h3 className="blockparty-iteration-title">
                          Translating Essence
                        </h3>
                        <p className="blockparty-story-p">
                          Early on, I asked Gemini to do everything in one
                          prompt — interpret the creation and generate a voxel
                          from it in one shot.
                        </p>
                        <p className="blockparty-story-p">
                          The results were inconsistent, and people were
                          disappointed that it didn&apos;t accurately reflect
                          what they had built.
                        </p>
                        <p className="blockparty-story-p">
                          That <em>essence</em> — the soul of what someone built
                          — was getting lost in translation.
                        </p>
                        <p className="blockparty-story-p">
                          So I decided to redesign what form the characters
                          would take. Block Party now generates a{" "}
                          <span className="font-semibold">
                            human-like character
                          </span>{" "}
                          that can walk, emote, and even have a personality. One
                          that can live among others created before it.
                        </p>
                      </div>
                    </div>
                    <div className="blockparty-iteration-piece">
                      <h3 className="blockparty-iteration-title">
                        AI Pipeline
                      </h3>
                      <p className="blockparty-story-p">
                        By redesigning what the digital character would look
                        like, the AI pipeline had to be updated. Instead of one
                        single prompt trying to do everything, I broke it into
                        stages.
                      </p>
                      <GeminiPipelineFlow />
                    </div>
                    <div className="blockparty-iteration-row">
                      <div className="blockparty-iteration-copy blockparty-story-col">
                        <h3 className="blockparty-iteration-title">
                          Digital Environment
                        </h3>
                        <p className="blockparty-story-p">
                          With the new character design, the digital environment
                          also needed to be changed. The previous environment
                          was entirely created with code. The new map
                          environment now uses spritesheets assets, so the
                          characters and their environment can share the same
                          visual aesthetic.
                        </p>
                      </div>
                      <div className="blockparty-iteration-media">
                        <ImageCompareSlider
                          beforeSrc="/projects/block-party/old-map.png"
                          afterSrc="/projects/block-party/new-map.png"
                          beforeAlt="Block Party map environment from the first iteration"
                          afterAlt="Block Party map environment from the final iteration"
                          beforeLabel="First Iteration"
                          afterLabel="Final Iteration"
                          initialPosition={15}
                        />
                      </div>
                    </div>
                    <div className="blockparty-iteration-row blockparty-iteration-row--flip">
                      <div className="blockparty-iteration-media">
                        <ImageCompareSlider
                          beforeSrc="/projects/block-party/physical-copy.gif"
                          afterSrc="/projects/block-party/digital-copy.gif"
                          beforeAlt="Block Party printed physical copy of a character"
                          afterAlt="Block Party digital collectible card archive"
                          beforeLabel="First Iteration"
                          afterLabel="Final Iteration"
                          initialPosition={15}
                        />
                      </div>
                      <div className="blockparty-iteration-copy blockparty-story-col">
                        <h3 className="blockparty-iteration-title">
                          Beyond the Moment
                        </h3>
                        <p className="blockparty-story-p">
                          One of the first questions I was asked when designing
                          my thesis was: how do you want this to end?
                        </p>
                        <p className="blockparty-story-p">
                          Not just what people walk away with — but how do you
                          want them to <em>feel?</em>
                        </p>
                        <p className="blockparty-story-p">
                          My original answer was a printed copy of their
                          character. But every user testing session told me the
                          same thing —{" "}
                          <span className="font-semibold">
                            people wanted to be able to revisit their characters
                            after the experience.
                          </span>
                        </p>
                        <p className="blockparty-story-p">
                          So every character ever created now lives in a digital
                          archive as collectible cards — accessible to anyone,
                          anytime.
                        </p>
                        <p className="blockparty-story-p">
                          <span className="font-semibold">
                            Your creation doesn&apos;t just exist during the
                            installation. It lives beyond the moment.
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ) : section.id === "whats-next" ? (
                  <div className="blockparty-iteration-row">
                    <ul className="blockparty-whats-next-list blockparty-iteration-copy">
                      {WHATS_NEXT_ITEMS.map((item) => (
                        <li key={item.key}>{item.content}</li>
                      ))}
                    </ul>
                    <div className="blockparty-iteration-media">
                      <img
                        src="/projects/block-party/whatsnext.gif"
                        alt="Block Party future vision — scaled installation and evolving characters"
                        className="blockparty-whats-next-gif"
                      />
                    </div>
                  </div>
                ) : section.id === "full-experience" ? (
                  <DemoExperienceFlow />
                ) : section.id === "learning-points" ||
                  section.id === "closing" ? null : (
                  <div className="blockparty-placeholder" aria-hidden="true">
                    <span>{headingText} — content coming soon</span>
                  </div>
                )}
              </div>
              {section.id === "learning-points" ? (
                <>
                  <TakeawaysCarousel />
                  <div className="page-content-shell">{TAKEAWAYS_BLURB}</div>
                </>
              ) : null}
              {section.id === "closing" ? (
                <div data-case-study-nav-boundary>
                  <ClosingCanvas />
                  <div className="page-content-shell">{CLOSING_BLURB}</div>
                </div>
              ) : null}
            </FadeInSection>
          );
        })}

        <FadeInSection
          id="blockparty-resources"
          className="blockparty-section blockparty-section--resources"
          aria-labelledby="blockparty-resources-heading"
        >
          <div className="page-content-shell">
            <p
              id="blockparty-resources-heading"
              className="blockparty-eyebrow blockparty-section-eyebrow"
            >
              Resources
            </p>
            <div
              className="blockparty-resources-links"
              role="navigation"
              aria-label="Project links"
            >
              {RESOURCE_LINKS.map((link) => (
                <a
                  key={link.key}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="blockparty-resource-link"
                >
                  <span
                    className="blockparty-resource-link-icon-wrap"
                    aria-hidden="true"
                  >
                    <img
                      src={DINO_ICON_SRC}
                      alt=""
                      className="blockparty-resource-link-icon"
                    />
                  </span>
                  <span className="blockparty-resource-link-label">
                    {link.label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </FadeInSection>
      </CaseStudyLayout>
      <Footer />
    </main>
  );
}
