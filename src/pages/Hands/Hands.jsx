import React, { useCallback, useEffect, useState } from "react";
import Footer from "../../components/Footer/Footer";
import { cachedHands, drawingUrl, fetchHands } from "../../utils/handCache";
import "./Hands.css";

/* one hand in the gallery. Drawings made on the first open hand are told apart by their shape and keep that hand. */
const LEGACY_RATIO = 1129 / 1235;
// which drawings were made on the first hand is remembered, so the card is the right size from the first paint
const LEG_KEY = "hands:legacy:v1";
const legacyIds = (() => { try { return new Set(JSON.parse(localStorage.getItem(LEG_KEY) || "[]")); } catch { return new Set(); } })();
const rememberLegacy = (id) => { legacyIds.add(id); try { localStorage.setItem(LEG_KEY, JSON.stringify([...legacyIds].slice(-300))); } catch { /* ignore */ } };
function HandCard({ d, n }) {
  const [legacy, setLegacy] = useState(() => legacyIds.has(d.id));
  const eager = n < 12;
  return (
    <li className={`hands-card${legacy ? " is-legacy" : ""}`}>
      <img className="hands-base" src={legacy ? "/hand/open-hand-top-bw.webp" : "/hand/open-hand-svg-bw.webp"} alt="" loading={eager ? "eager" : "lazy"} decoding="async" draggable="false" />
      <span className="hands-glitter" style={{ "--ink": `url(${drawingUrl(d.id)})`, "--d": `${(parseInt(d.id.slice(2, 4), 16) % 7) * -0.9}s` }} aria-hidden="true" />
      <img className="hands-ink" src={drawingUrl(d.id)} alt="A hand with accessories and nail paints drawn on it" loading={eager ? "eager" : "lazy"} fetchpriority={eager ? "high" : "auto"} decoding="async" draggable="false"
        onLoad={(e) => { const r = e.currentTarget.naturalWidth / e.currentTarget.naturalHeight; if (Math.abs(r - LEGACY_RATIO) < 0.02) { rememberLegacy(d.id); setLegacy(true); } }} />
    </li>
  );
}

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
              {items.map((d, n) => <HandCard key={d.id} d={d} n={n} />)}
            </ul>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
