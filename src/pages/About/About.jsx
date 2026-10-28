import React, { useRef } from "react";
import Footer from "../../components/Footer/Footer";
import LazyVideo from "../../components/LazyVideo/LazyVideo";
import ExperienceTimeline from "../../components/ExperienceTimeline/ExperienceTimeline";
import PhotoCardStack from "../../components/PhotoCardStack/PhotoCardStack";
import enjoy1 from "../../assets/img/about-pictures/enjoy 1.jpeg";
import enjoy2 from "../../assets/img/about-pictures/enjoy 2.webp";
import enjoy3 from "../../assets/img/about-pictures/enjoy 3.jpeg";
import enjoy4 from "../../assets/img/about-pictures/enjoy 4.jpeg";
import enjoy5 from "../../assets/img/about-pictures/enjoy 5.jpeg";
import enjoy6 from "../../assets/img/about-pictures/enjoy 6.jpeg";
import enjoy7 from "../../assets/img/about-pictures/enjoy 7.jpeg";
import enjoy8 from "../../assets/img/about-pictures/enjoy 8.jpeg";
import useScrollReset from "../../hooks/useScrollReset";
import useRiseUpOnScroll from "../../hooks/useRiseUpOnScroll";
import "./About.css";

const HI_CAPTION_TEXT =
  "Hi, I'm Lakshman, a UX designer and researcher turning into a design engineer. I'm interested in interactions and experimenting with details.";

const ENJOY_PHOTOS = [enjoy1, enjoy2, enjoy3, enjoy4, enjoy5, enjoy6, enjoy7, enjoy8].map(
  (src, i) => ({ src, alt: `Photo ${i + 1} of things I enjoy` }),
);

const About = () => {
  useScrollReset();
  const whereTitleRef = useRef(null);
  const enjoyTitleRef = useRef(null);
  const enjoyDescRef = useRef(null);
  const enjoyImagesRef = useRef(null);
  useRiseUpOnScroll(whereTitleRef);
  useRiseUpOnScroll(enjoyTitleRef);
  useRiseUpOnScroll(enjoyDescRef);
  useRiseUpOnScroll(enjoyImagesRef, { delay: 0.5 });

  return (
    <main className="about-sandbox">
      <section className="about-sandbox-polaroid">
        <div className="about-sandbox-hi-wrap">
          <LazyVideo
            className="about-sandbox-hi-video"
            src="/about/diary-fall.mp4"
            aria-label="Hand-drawn animation of Lakshman in a notebook"
            autoPlay
            loop
            muted
            playsInline
          />
          <p className="about-sandbox-hi-caption">{HI_CAPTION_TEXT}</p>
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
              My path to UX started in architecture, which I majored in during
              undergrad. What drew me to it was the research and design side —
              understanding a problem deeply before ever drawing a solution.
              Partway through, I realized I wanted to build things that lived
              digitally instead of physically, so I made the shift to UI/UX. I
              spent two years building BIM-driven product workflows at UBC
              Impex, then moved into architectural design and visualization at
              23dds, and that hands-on experience with how people understand
              and move through systems has stuck with me — I bring that same
              spatial and systems thinking to how I research and design
              digital products today.
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
            <PhotoCardStack photos={ENJOY_PHOTOS} label="Things I enjoy" />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default About;
