import React, { Suspense, lazy } from "react";
import { Link, useLocation } from "react-router-dom";
import "./CraftHub.css";

/* Craft has two tabs: the Library of components, and my other works (the wall of pieces). */
const Library = lazy(() => import("../Library/Library"));
const Wall = lazy(() => import("../Craft/Craft"));

export default function CraftHub() {
  const works = useLocation().pathname.startsWith("/craft/works");
  return (
    <>
      <nav className={`hub-tabs${works ? " on-light" : " on-dark"}`} aria-label="Craft">
        <Link to="/craft" className={!works ? "on" : ""} aria-current={!works ? "page" : undefined}>Library</Link>
        <Link to="/craft/works" className={works ? "on" : ""} aria-current={works ? "page" : undefined}>Other works</Link>
      </nav>
      <div className="hub-body"><Suspense fallback={null}>{works ? <Wall /> : <Library />}</Suspense></div>
    </>
  );
}
