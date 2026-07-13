import React, { useEffect, useRef, useLayoutEffect } from "react";
import { useLenis } from "@studio-freight/react-lenis";
import { gsap } from "gsap";
import WorkBentoGrid from "../../components/Work/WorkBentoGrid";
import Footer from "../../components/Footer/Footer";
import "./Work.css";

const Work = () => {
  const lenis = useLenis();
  const titleRef = useRef(null);
  const titleWrapperRef = useRef(null);
  const pillsContainerRef = useRef(null);
  const bentoGridRef = useRef(null);
  const navRef = useRef(null);
  const timelineRef = useRef(null);
  const workBentoGridContainerRef = useRef(null);

  useLayoutEffect(() => {
    if (!titleRef.current || !titleWrapperRef.current) return;

    const nav = document.querySelector('nav');
    if (nav) {
      navRef.current = nav;
      // Kill any existing animations first
      gsap.killTweensOf(nav);
      // Force reset navbar to hidden state immediately
      gsap.set(nav, {
        opacity: 0,
        y: -100,
      });
    }

    gsap.set(titleWrapperRef.current, {
      opacity: 0,
      y: "100%",
    });

    if (workBentoGridContainerRef.current) {
      gsap.set(workBentoGridContainerRef.current, {
        opacity: 0,
      });
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const pillsContainer = document.querySelector('.filter-pills-container');
        const bentoItems = document.querySelectorAll('.work-bento-item, .bento-item');

        if (pillsContainer) {
          pillsContainerRef.current = pillsContainer;
          gsap.set(pillsContainer, {
            opacity: 0,
          });
        }

        if (bentoItems.length > 0) {
          gsap.set(bentoItems, {
            opacity: 0,
          });
        }

        if (workBentoGridContainerRef.current) {
          gsap.set(workBentoGridContainerRef.current, {
            opacity: 0,
          });
        }

        // Ensure navbar is still hidden and kill any animations
        if (navRef.current) {
          gsap.killTweensOf(navRef.current);
          gsap.set(navRef.current, {
            opacity: 0,
            y: -100,
          });
        }

        timelineRef.current = gsap.timeline({
          defaults: { ease: "power2.out" },
        });

        timelineRef.current.to(titleWrapperRef.current, {
          opacity: 1,
          y: "0%",
          duration: 1.5,
          ease: "power2.out",
        });

        if (navRef.current) {
          timelineRef.current.to(
            navRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: "power2.out",
            },
            "-=0.3"
          );
        }

        if (workBentoGridContainerRef.current) {
          timelineRef.current.to(
            workBentoGridContainerRef.current,
            {
              opacity: 1,
              duration: 0.5,
              ease: "power2.out",
            },
            "-=0.3"
          );
        }

        if (pillsContainerRef.current) {
          timelineRef.current.to(
            pillsContainerRef.current,
            {
              opacity: 1,
              duration: 1,
              ease: "power2.out",
            },
            "-=0.3"
          );
        }

        if (bentoItems.length > 0) {
          timelineRef.current.to(
            bentoItems,
            {
              opacity: 1,
              stagger: { each: 0.08, from: "start" },
              duration: 1.2,
              ease: "power2.out",
            },
            "-=1"
          );
        }
      });
    });

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      let frameCount = 0;
      const maxFrames = 120;

      const preventScrollJump = () => {
        if (frameCount >= maxFrames) return;

        const currentScroll = window.scrollY || document.documentElement.scrollTop;

        if (currentScroll > 0) {
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;

          if (lenis) {
            lenis.scrollTo(0, { duration: 0, immediate: true, force: true });
          }
        }

        frameCount++;
        requestAnimationFrame(preventScrollJump);
      };

      requestAnimationFrame(preventScrollJump);
    }, 50);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [lenis]);

  return (
    <>
      <main
        className="min-h-screen relative"
        style={{ backgroundColor: "#fafafa" }}
      >
        <section className="pt-32 pb-20">
          <div className="page-content-shell">
            <h1 ref={titleRef} className="work-page-title">
              <span ref={titleWrapperRef} className="work-page-title-wrapper">
                Designs, Creative Experiments, <span className="work-page-title-accent">and more!</span>
              </span>
            </h1>
            <WorkBentoGrid containerRef={workBentoGridContainerRef} />
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
};

export default Work;
