import React, { useState, useRef, useEffect } from "react";
import Footer from "../../components/Footer/Footer";
import ExperienceTimeline from "../../components/ExperienceTimeline/ExperienceTimeline";
import ExpandingPhotoRow from "../../components/ExpandingPhotoRow/ExpandingPhotoRow";
import useScrollReset from "../../hooks/useScrollReset";
import useRiseUpOnScroll from "../../hooks/useRiseUpOnScroll";
import hiVideo from "../../assets/img/about-pictures/hi.mp4";
import "./About.css";

const HI_CAPTION_TEXT =
  "Hi, I'm Lakshman, UX Researcher & Designer who loves translating user experiences using qualitative and quantitative data to effective design solutions";

const About = () => {
  useScrollReset();
  const [typedHiCaption, setTypedHiCaption] = useState("");
  const hiTypingIntervalRef = useRef(null);
  const whereTitleRef = useRef(null);
  const enjoyTitleRef = useRef(null);
  const enjoyDescRef = useRef(null);
  const enjoyImagesRef = useRef(null);
  useRiseUpOnScroll(whereTitleRef);
  useRiseUpOnScroll(enjoyTitleRef);
  useRiseUpOnScroll(enjoyDescRef);
  useRiseUpOnScroll(enjoyImagesRef, { delay: 0.5 });

  useEffect(() => () => clearInterval(hiTypingIntervalRef.current), []);

  const handleHiMouseEnter = () => {
    clearInterval(hiTypingIntervalRef.current);
    let charCount = 0;
    hiTypingIntervalRef.current = setInterval(() => {
      charCount += 1;
      setTypedHiCaption(HI_CAPTION_TEXT.slice(0, charCount));
      if (charCount >= HI_CAPTION_TEXT.length) {
        clearInterval(hiTypingIntervalRef.current);
      }
    }, 30);
  };

  return (
    <main className="about-sandbox">
      <section className="about-sandbox-polaroid">
        <div
          className="about-sandbox-hi-wrap"
          onMouseEnter={handleHiMouseEnter}
        >
          <video
            className="about-sandbox-hi-video"
            src={hiVideo}
            autoPlay
            loop
            muted
            playsInline
          />
          <p className="about-sandbox-hi-caption">
            {typedHiCaption}
            {typedHiCaption.length > 0 && (
              <span className="about-sandbox-hi-cursor" aria-hidden="true">
                |
              </span>
            )}
          </p>
        </div>
      </section>

      {/* Where I've been — experience timeline */}
      <section className="about-sandbox-where-section">
        <div className="about-sandbox-where-inner">
          <div className="about-sandbox-how-text">
            <h2
              ref={whereTitleRef}
              className="about-sandbox-how-title about-sandbox-where-title"
            >
              <em>Where</em> I've been
            </h2>
            <p className="about-sandbox-bio">
              My path to UX started in architecture. I spent two years building
              BIM-driven product workflows at UBC Impex, then moved into
              architectural design and visualization at 23dds. That work taught
              me that the most critical design decisions aren't about aesthetics —
              they're about how people understand and move through systems. I
              kept noticing the same problem in digital products: flows that
              confused people, dashboards that buried what mattered, onboarding
              that left users lost. UX research gave me a framework to
              investigate those failures systematically, and I've been applying
              that spatial and systems thinking to digital products ever since.
            </p>
          </div>
          <ExperienceTimeline revealEarlier />
        </div>
      </section>

      {/* What I enjoy — title styled like Where, one-liner + image row placeholder */}
      <section className="about-sandbox-enjoy-section">
        <div className="about-sandbox-enjoy-inner">
          <div className="about-sandbox-how-text">
            <h2
              ref={enjoyTitleRef}
              className="about-sandbox-how-title about-sandbox-enjoy-title"
            >
              <em>What</em> I enjoy
            </h2>
          </div>
          <p ref={enjoyDescRef} className="about-sandbox-enjoy-desc">
            When I'm not designing, I spend my time Hiking, cause I live in
            Arizona. But I also love going to the beach, trying new coffee
            shops. I love looking at buildings, clicking pictures of them. I
            also enjoy meaningful design conversations with other design
            enthusiasts.
          </p>
          <div ref={enjoyImagesRef} className="about-sandbox-enjoy-images">
            <ExpandingPhotoRow />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default About;
