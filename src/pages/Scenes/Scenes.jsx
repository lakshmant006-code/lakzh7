import React from "react";
import "./Scenes.css";

// The interactive nature scenes live in /public/nature (plain three.js);
// this page frames them inside the portfolio so the nav stays in place.
const Scenes = () => (
  <main className="scenes-page">
    <iframe
      src="/nature/index.html?embed=1"
      title="Interactive nature scenes"
      className="scenes-frame"
      allow="fullscreen"
      data-lenis-prevent
    />
  </main>
);

export default Scenes;
