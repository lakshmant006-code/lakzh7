import React, { useCallback, useEffect, useState } from "react";
import Footer from "../../components/Footer/Footer";
import { cachedHands, drawingUrl, fetchHands } from "../../utils/handCache";
import "./Hands.css";

/* Everything people have drawn on the hand: accessories, nail paints, nail ideas. It refreshes by itself. */
export default function Hands() {
  const [items, setItems] = useState(cachedHands);                 // the last list shows straight away, then it refreshes
  const [failed, setFailed] = useState(false);

  const load = useCallback(async (fresh = false) => {
    try { setItems(await fetchHands(fresh === true)); setFailed(false); }
    catch { setFailed(true); setItems((v) => v || []); }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(() => { if (!document.hidden) load(); }, 15000);          // new drawings turn up while you look
    const vis = () => { if (!document.hidden) load(); };
    document.addEventListener("visibilitychange", vis);
    const saved = () => load(true);
    window.addEventListener("hand:saved", saved);                                 // yours appears straight away
    return () => { clearInterval(t); document.removeEventListener("visibilitychange", vis); window.removeEventListener("hand:saved", saved); };
  }, [load]);

  return (
    <>
      <main className="hands-page">
        <header className="hands-head">
          <h1>Hands</h1>
          <p>Nail paints, rings, bracelets and nail ideas, drawn by people who came by.</p>
          <button type="button" className="hands-draw" onClick={() => window.dispatchEvent(new CustomEvent("hand:click"))}>Draw yours</button>
        </header>
        {items === null ? (
          <ul className="hands-grid" aria-label="Loading the hands">{Array.from({ length: 12 }, (_, i) => <li key={i} className="hands-card hands-skeleton" />)}</ul>
        ) : items.length === 0 ? (
          <p className="hands-note">{failed ? "The gallery can't be reached right now." : "Nothing here yet. Be the first to draw on the hand."}</p>
        ) : (
          <>
            <p className="hands-count">{items.length} {items.length === 1 ? "hand" : "hands"}</p>
            <ul className="hands-grid">
              {items.map((d, n) => (
                <li key={d.id} className="hands-card">
                  <img className="hands-base" src="/hand/open-hand-top-bw.webp" alt="" loading={n < 12 ? "eager" : "lazy"} decoding="async" draggable="false" />
                  <span className="hands-glitter" style={{ "--ink": `url(${drawingUrl(d.id)})`, "--d": `${(parseInt(d.id.slice(2, 4), 16) % 7) * -0.9}s` }} aria-hidden="true" />
                  <img className="hands-ink" src={drawingUrl(d.id)} alt="A hand with accessories and nail paints drawn on it" loading={n < 12 ? "eager" : "lazy"} fetchpriority={n < 12 ? "high" : "auto"} decoding="async" draggable="false" />
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
