import React from "react";
import PlayBentoGrid from "../../components/Work/PlayBentoGrid";
import Footer from "../../components/Footer/Footer";
import "./Craft.css";

const Craft = () => (
  <>
    <main className="craft-page">
      <header className="craft-head">
        <h1 className="craft-title">Craft</h1>
        <p className="craft-sub">Small experiments, toys and things I built for fun.</p>
      </header>
      <PlayBentoGrid />
    </main>
    <Footer />
  </>
);

export default Craft;
