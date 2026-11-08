import React, { useCallback, useEffect, useState } from "react";
import Footer from "../../components/Footer/Footer";
import "./Hands.css";

/* Everything people have drawn on the hand: accessories, nail paints, nail ideas. It refreshes by itself. */
export default function Hands() {
  const [items, setItems] = useState(null);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/hand-drawings");
      if (!r.ok || !(r.headers.get("content-type") || "").includes("json")) throw new Error("bad");
      const j = await r.json();
      setItems(j.drawings || []); setFailed(false);
    } catch { setFailed(true); setItems((v) => v || []); }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(() => { if (!document.hidden) load(); }, 15000);          // new drawings turn up while you look
    const vis = () => { if (!document.hidden) load(); };
    document.addEventListener("visibilitychange", vis);
    window.addEventListener("hand:saved", load);                                 // yours appears straight away
    return () => { clearInterval(t); document.removeEventListener("visibilitychange", vis); window.removeEventListener("hand:saved", load); };
  }, [load]);

  return (
    <>
      <main className="hands-page">
        <header className="hands-head">
          <h1>Hands</h1>
          <p>Nail paints, rings, bracelets and nail ideas, drawn by people who came by.</p>
          <button type="button" className="hands-draw" onClick={() => window.dispatchEvent(new CustomEvent("hand:click"))}>Draw yours</button>
        </header>
        {items === null ? <p className="hands-note">Loading…</p> : items.length === 0 ? (
          <p className="hands-note">{failed ? "The gallery can't be reached right now." : "Nothing here yet. Be the first to draw on the hand."}</p>
        ) : (
          <>
            <p className="hands-count">{items.length} {items.length === 1 ? "hand" : "hands"}</p>
            <ul className="hands-grid">
              {items.map((d) => (
                <li key={d.id} className="hands-card">
                  <img className="hands-base" src="/hand/open-hand-top-bw.webp" alt="" loading="lazy" decoding="async" draggable="false" />
                  <span className="hands-glitter" style={{ "--ink": `url(/api/hand-drawing?id=${d.id})`, "--d": `${(parseInt(d.id.slice(2, 4), 16) % 7) * -0.9}s` }} aria-hidden="true" />
                  <img className="hands-ink" src={`/api/hand-drawing?id=${d.id}`} alt="A hand with accessories and nail paints drawn on it" loading="lazy" decoding="async" draggable="false" />
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
