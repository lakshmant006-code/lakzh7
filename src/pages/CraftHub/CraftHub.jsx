import React, { Suspense, lazy, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./CraftHub.css";

/* Craft has two tabs: the Library of components, and my other works (the wall of pieces). */
const Library = lazy(() => import("../Library/Library"));
const Wall = lazy(() => import("../Craft/Craft"));

export default function CraftHub() {
  const works = useLocation().pathname.startsWith("/craft/works");
  useEffect(() => { document.documentElement.classList.add("craft-black"); return () => document.documentElement.classList.remove("craft-black"); }, []);   // the whole Craft section is black, whichever tab
  return (
    <>
      <nav className="hub-tabs on-dark" aria-label="Craft">
        <Link to="/craft" className={!works ? "on" : ""} aria-current={!works ? "page" : undefined}>Library</Link>
        <Link to="/craft/works" className={works ? "on" : ""} aria-current={works ? "page" : undefined}>Other works</Link>
      </nav>
      <div className="hub-body"><Suspense fallback={null}>{works ? <Wall /> : <Library />}</Suspense></div>
    </>
  );
}
