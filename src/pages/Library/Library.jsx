import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CATEGORIES, COMPONENTS, defaultsOf, usageOf } from "../../library/registry";
import "./Library.css";

/* The open library: live components people can try, tune, copy and download. Styled with MORPH's design tokens
   (graphite surfaces, one orange accent). Add a component in src/library/registry.js and it appears here. */
const fileName = (c) => `${c.source.match(/export default function (\w+)/)?.[1] || c.id}.jsx`;
const copyText = async (text) => { try { await navigator.clipboard.writeText(text); return true; } catch { const t = document.createElement("textarea"); t.value = text; document.body.appendChild(t); t.select(); const ok = document.execCommand("copy"); t.remove(); return ok; } };
const download = (name, text) => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type: "text/javascript" })); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); };

function Tile({ c, onOpen, onCopy }) {
  const Comp = c.Component;
  return (
    <article className="lib-tile" onClick={() => onOpen(c.id)} tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") onOpen(c.id); }} aria-label={`${c.name}: open`}>
      <div className="lib-tile-stage" onClick={(e) => e.stopPropagation()}><div className="lib-fill"><Comp {...defaultsOf(c)} /></div></div>
      <button type="button" className="lib-tile-copy" aria-label={`Copy the code for ${c.name}`} onClick={(e) => { e.stopPropagation(); onCopy(c); }}>Copy</button>
      <div className="lib-tile-foot"><span>{c.name}</span>{c.from && <em>{c.from}</em>}<b>Open →</b></div>
    </article>
  );
}

function Detail({ c, onClose, onCopy }) {
  const [vals, setVals] = useState(() => defaultsOf(c));
  const Comp = c.Component;
  useEffect(() => { setVals(defaultsOf(c)); }, [c]);
  return (
    <div className="lib-detail" role="dialog" aria-modal="true" aria-label={c.name} onClick={onClose}>
      <div className="lib-panel" onClick={(e) => e.stopPropagation()}>
        <div className="lib-canvas"><div className="lib-canvas-box" key={c.id}><div className="lib-fill"><Comp {...vals} /></div></div></div>
        <aside className="lib-side">
          <header><h2>{c.name}</h2><button type="button" className="lib-x" aria-label="Close" onClick={onClose}>×</button></header>
          <p className="lib-meta"><span>{c.category}</span>{c.from && <span className="accent">from {c.from}</span>}<span>{c.added}</span></p>
          <div className="lib-controls">
            {c.controls.map((k, i) => {
              const toggle = k.min === 0 && k.max === 1 && k.step === 1, on = !!vals[k.key], set = (n) => setVals((v) => ({ ...v, [k.key]: n }));
              return (
                <React.Fragment key={k.key}>
                  {k.group && k.group !== c.controls[i - 1]?.group && <h3 className="lib-group">{k.group}</h3>}
                  {toggle
                    ? <button type="button" role="switch" aria-checked={on} className="lib-ctl lib-tog" onClick={() => set(on ? 0 : 1)}><span>{k.label}</span><i className={on ? "on" : ""} /></button>
                    : <label className="lib-ctl">
                        <span>{k.label}</span>
                        <input type="range" min={k.min} max={k.max} step={k.step} value={vals[k.key]} onChange={(e) => set(parseFloat(e.target.value))} />
                        <output>{vals[k.key]}</output>
                      </label>}
                </React.Fragment>
              );
            })}
          </div>
          <div className="lib-actions">
            <button type="button" className="lib-btn primary" onClick={() => onCopy(c)}>Copy code</button>
            <button type="button" className="lib-btn" onClick={() => onCopy(c, usageOf(c, vals), "usage")}>Copy usage</button>
            <button type="button" className="lib-btn" onClick={() => { download(fileName(c), c.source); }}>Download {fileName(c)}</button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function Library() {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(() => (location.hash || "").slice(1) || null);
  const [toast, setToast] = useState("");
  const search = useRef(null), tt = useRef(0);

  useEffect(() => {
    document.documentElement.classList.add("lib-dark");
    return () => document.documentElement.classList.remove("lib-dark");
  }, []);
  useEffect(() => { history.replaceState(null, "", location.pathname + (open ? "#" + open : "")); }, [open]);
  useEffect(() => { const h = () => setOpen((location.hash || "").slice(1) || null); window.addEventListener("hashchange", h); return () => window.removeEventListener("hashchange", h); }, []);
  useEffect(() => {
    const key = (e) => {
      if (e.key === "Escape") setOpen(null);
      else if (e.key === "/" && document.activeElement?.tagName !== "INPUT") { e.preventDefault(); search.current?.focus(); }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  const say = useCallback((m) => { setToast(m); clearTimeout(tt.current); tt.current = setTimeout(() => setToast(""), 1700); }, []);
  const onCopy = useCallback(async (c, text, what = "code") => { const ok = await copyText(text || c.source); say(ok ? `Copied ${what} for ${c.name}` : "Could not copy"); }, [say]);

  const list = useMemo(() => COMPONENTS.filter((c) => (cat === "All" || c.category === cat) && (!q || `${c.name} ${c.category} ${c.description} ${c.from || ""}`.toLowerCase().includes(q.toLowerCase()))), [cat, q]);
  const counts = useMemo(() => Object.fromEntries(CATEGORIES.map((k) => [k, k === "All" ? COMPONENTS.length : COMPONENTS.filter((c) => c.category === k).length])), []);
  const current = COMPONENTS.find((c) => c.id === open) || null;
  const exportAll = () => { download("lakshman-library.jsx", COMPONENTS.map((c) => `// ===== ${fileName(c)} =====\n${c.source}`).join("\n\n")); say("Downloaded the whole library"); };

  return (
    <main className="lib">
      <header className="lib-head">
        <div>
          <h1>Library</h1>
          <p>Interaction components I keep building. Open source, free to copy. Try them, tune them, take the code.</p>
        </div>
        <button type="button" className="lib-btn" onClick={exportAll}>Export all ({COMPONENTS.length})</button>
      </header>
      <div className="lib-bar">
        <nav className="lib-tabs" aria-label="Categories">
          {CATEGORIES.filter((k) => counts[k] > 0).map((k) => <button key={k} type="button" className={cat === k ? "on" : ""} onClick={() => setCat(k)}>{k}</button>)}
        </nav>
        <label className="lib-search"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          <input ref={search} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" aria-label="Search components" /><kbd>/</kbd></label>
      </div>
      {list.length ? <div className="lib-grid">{list.map((c) => <Tile key={c.id} c={c} onOpen={setOpen} onCopy={onCopy} />)}</div> : <p className="lib-empty">Nothing matches "{q}".</p>}
      {current && <Detail c={current} onClose={() => setOpen(null)} onCopy={onCopy} />}
      <div className={`lib-toast${toast ? " on" : ""}`} role="status">{toast}</div>
    </main>
  );
}
