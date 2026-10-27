import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReactLenis, useLenis } from "@studio-freight/react-lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Analytics } from "@vercel/analytics/react";
import Nav from "./components/Nav/Nav";
import ScrollToTop from "./components/ScrollToTop";
import BackToTop from "./components/BackToTop/BackToTop";
import SoundToggle from "./components/SoundToggle/SoundToggle";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Work from "./pages/Work/Work";
import TimeManagementCaseStudy from "./pages/TimeManagementCaseStudy/TimeManagementCaseStudy";
import QuizAICaseStudy from "./pages/QuizAICaseStudy/QuizAICaseStudy";
import HikuCaseStudy from "./pages/HikuCaseStudy/HikuCaseStudy";
import ProMoveCaseStudy from "./pages/ProMoveCaseStudy/ProMoveCaseStudy";
import KeepCaseStudy from "./pages/KeepCaseStudy/KeepCaseStudy";
import Scenes from "./pages/Scenes/Scenes";
import ScenesOverlay from "./components/ScenesOverlay/ScenesOverlay";
import PixelCatPage from "./pages/PixelCat/PixelCat";
import NotFound from "./pages/NotFound/NotFound";
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
        <ScrollToTop />
        <BackToTop />
        <SoundToggle />
        <ScenesOverlay />
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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/google-creative" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/work" element={<Work />} />
            <Route path="/time-management" element={<TimeManagementCaseStudy />} />
            <Route path="/quizai" element={<QuizAICaseStudy />} />
            <Route path="/hiku" element={<HikuCaseStudy />} />
            <Route path="/pro-move" element={<ProMoveCaseStudy />} />
            <Route path="/keep" element={<KeepCaseStudy />} />
            <Route path="/scenes" element={<Scenes />} />
            <Route path="/pixel-cat" element={<PixelCatPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Analytics />
      </Router>
    </ReactLenis>
  );
}

export default App;
