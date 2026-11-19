import React, { useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ReactLenis, useLenis } from "@studio-freight/react-lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
const CraftHub = lazy(() => import("./pages/CraftHub/CraftHub"));
const Hands = lazy(() => import("./pages/Hands/Hands"));
import RouteSeo from "./components/Seo/RouteSeo";
import ElasticHand from "./components/ElasticHand/ElasticHand";
import HandStudio from "./components/HandStudio/HandStudio";
const PixelCatPage = lazy(() => import("./pages/PixelCat/PixelCat"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));
import ResumeModal from "./components/ResumeModal/ResumeModal";
import SiteLoader from "./components/SiteLoader/SiteLoader";
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
        <SiteLoader />
        <ScrollToTop />
        <BackToTop />
        <SoundToggle />
        <ElasticHand />
        <HandStudio />
        <ResumeModal />
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
            <Route path="/craft" element={<CraftHub />} />
            <Route path="/craft/works" element={<CraftHub />} />
            <Route path="/craft/chime" element={<ChimeCaseStudy />} />
            <Route path="/hands" element={<Hands />} />
            <Route path="/library" element={<Navigate to="/craft" replace />} />
            <Route path="/pixel-cat" element={<PixelCatPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </div>
      </Router>
    </ReactLenis>
  );
}

export default App;
