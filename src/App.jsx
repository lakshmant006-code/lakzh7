import React, { useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReactLenis, useLenis } from "@studio-freight/react-lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Analytics } from "@vercel/analytics/react";
import Nav from "./components/Nav/Nav";
import ScrollToTop from "./components/ScrollToTop";
import BackToTop from "./components/BackToTop/BackToTop";
import SoundToggle from "./components/SoundToggle/SoundToggle";
import Home from "./pages/Home/Home";
const About = lazy(() => import("./pages/About/About"));
const Work = lazy(() => import("./pages/Work/Work"));
const TimeManagementCaseStudy = lazy(() => import("./pages/TimeManagementCaseStudy/TimeManagementCaseStudy"));
const KeepCaseStudy = lazy(() => import("./pages/KeepCaseStudy/KeepCaseStudy"));
const QuizAICaseStudy = lazy(() => import("./pages/QuizAICaseStudy/QuizAICaseStudy"));
const HikuCaseStudy = lazy(() => import("./pages/HikuCaseStudy/HikuCaseStudy"));
const ProMoveCaseStudy = lazy(() => import("./pages/ProMoveCaseStudy/ProMoveCaseStudy"));
const ChimeCaseStudy = lazy(() => import("./pages/ChimeCaseStudy/ChimeCaseStudy"));
const Craft = lazy(() => import("./pages/Craft/Craft"));
const Hands = lazy(() => import("./pages/Hands/Hands"));
const Scenes = lazy(() => import("./pages/Scenes/Scenes"));
import RouteSeo from "./components/Seo/RouteSeo";
import ScenesOverlay from "./components/ScenesOverlay/ScenesOverlay";
import ElasticHand from "./components/ElasticHand/ElasticHand";
import HandStudio from "./components/HandStudio/HandStudio";
const PixelCatPage = lazy(() => import("./pages/PixelCat/PixelCat"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));
import "./App.css";

const LenisScrollTriggerIntegration = () => {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    let rafId = null;
    const onScroll = () => {
      if (rafId != null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        ScrollTrigger.update();
      });
    };

    lenis.on("scroll", onScroll);

    return () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      lenis.off("scroll", onScroll);
    };
  }, [lenis]);

  return null;
};

function App() {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        smoothTouch: false,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      }}
    >
      <Router>
        <LenisScrollTriggerIntegration />
        <RouteSeo />
        <ScrollToTop />
        <BackToTop />
        <SoundToggle />
        <ScenesOverlay />
        <ElasticHand />
        <HandStudio />
        <div className="app min-h-screen relative">
          <div
            className="fixed top-0 left-0 w-full"
            style={{
              zIndex: 100,
              pointerEvents: "none",
            }}
          >
            <div style={{ pointerEvents: "auto" }}>
              <Nav />
            </div>
          </div>
          <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/google-creative" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/work" element={<Work />} />
            <Route path="/time-management" element={<TimeManagementCaseStudy />} />
            <Route path="/keep" element={<KeepCaseStudy />} />
            <Route path="/quizai" element={<QuizAICaseStudy />} />
            <Route path="/hiku" element={<HikuCaseStudy />} />
            <Route path="/pro-move" element={<ProMoveCaseStudy />} />
            <Route path="/craft" element={<Craft />} />
            <Route path="/craft/chime" element={<ChimeCaseStudy />} />
            <Route path="/hands" element={<Hands />} />
            <Route path="/scenes" element={<Scenes />} />
            <Route path="/pixel-cat" element={<PixelCatPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </div>
        <Analytics />
      </Router>
    </ReactLenis>
  );
}

export default App;
