import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { revealOnScroll } from "../../utils/revealOnScroll";
import LazyVideo from "../LazyVideo/LazyVideo";
import CursorPill from "../CursorPill/CursorPill";
import Footer from "../Footer/Footer";
import "./CsKit.css";

/*
 * Shared building blocks for the case study pages: one centered reading
 * column, a wide hero, small gray section labels over serif headings, and
 * figures set in panels tinted with each project's color.
 */

function Reveal({ as: Tag = "div", className, children, ...rest }) {
  const ref = useRef(null);
  useEffect(() => revealOnScroll(ref.current, { delay: 0.05 }), []);
  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}

export function CsPage({ project, accent, tint, children }) {
  return (
    <div
      className={`cs-page cs-page--${project}`}
      style={{ "--cs-accent": accent, "--cs-tint": tint }}
    >
      <main className="cs-main">{children}</main>
      <Footer />
    </div>
  );
}

export function CsBreadcrumb({ current }) {
  return (
    <nav className="cs-crumbs" aria-label="Breadcrumb">
      <Link to="/" state={{ showWork: true }} className="cs-crumbs-back">
        <span aria-hidden="true">←</span> Work
      </Link>
      <span className="cs-crumbs-sep" aria-hidden="true">
        /
      </span>
      <span aria-current="page">{current}</span>
    </nav>
  );
}

export function CsHero({ children }) {
  return <div className="cs-hero">{children}</div>;
}

export function CsIntro({ title, lead, meta = [] }) {
  return (
    <header className="cs-col cs-intro">
      <h1 className="cs-title">{title}</h1>
      {lead ? <p className="cs-lead">{lead}</p> : null}
      <dl className="cs-meta">
        {meta.map((item) => (
          <div key={item.label} className="cs-meta-item">
            <dt>{item.label}</dt>
            <dd>
              {(Array.isArray(item.value) ? item.value : [item.value]).map(
                (line) => (
                  <span key={line}>{line}</span>
                ),
              )}
            </dd>
          </div>
        ))}
      </dl>
      <hr className="cs-rule" />
    </header>
  );
}

export function CsSection({ id, label, title, children }) {
  return (
    <section id={id} className="cs-section cs-col">
      {label ? <p className="cs-label">{label}</p> : null}
      {title ? (
        <Reveal as="h2" className="cs-h2">
          {title}
        </Reveal>
      ) : null}
      {children}
    </section>
  );
}

export function CsH3({ children }) {
  return (
    <Reveal as="h3" className="cs-h3">
      {children}
    </Reveal>
  );
}

export function CsText({ children }) {
  return (
    <Reveal as="p" className="cs-text">
      {children}
    </Reveal>
  );
}

/** A larger serif line for statements that used to be headline callouts. */
export function CsCallout({ children }) {
  return (
    <Reveal as="p" className="cs-callout">
      {children}
    </Reveal>
  );
}

export function CsPanel({ title, wide = false, padded = false, children }) {
  return (
    <Reveal
      as="figure"
      className={`cs-panel${wide ? " cs-panel--wide" : ""}`}
    >
      {title ? <figcaption className="cs-panel-title">{title}</figcaption> : null}
      <div className={`cs-panel-body${padded ? " cs-panel-body--padded" : ""}`}>
        {children}
      </div>
    </Reveal>
  );
}

export function CsGrid3({ items }) {
  return (
    <Reveal className="cs-grid3">
      {items.map((item, index) => (
        <figure key={index} className="cs-tile">
          <div className="cs-tile-media">{item.media}</div>
          {item.caption ? (
            <figcaption className="cs-tile-cap">{item.caption}</figcaption>
          ) : null}
        </figure>
      ))}
    </Reveal>
  );
}

/** Figure on the left in a tinted panel, caption on the right. */
export function CsSide({ panelTitle, media, title, children }) {
  return (
    <Reveal className="cs-side">
      <figure className="cs-panel cs-side-panel">
        {panelTitle ? (
          <figcaption className="cs-panel-title">{panelTitle}</figcaption>
        ) : null}
        <div className="cs-panel-body">{media}</div>
      </figure>
      <div className="cs-side-copy">
        {title ? <p className="cs-side-title">{title}</p> : null}
        <div className="cs-side-text">{children}</div>
      </div>
    </Reveal>
  );
}

export function CsStats({ items }) {
  return (
    <Reveal as="dl" className="cs-stats">
      {items.map((item) => (
        <div key={item.label} className="cs-stat">
          <dt className="cs-stat-value">{item.value}</dt>
          <dd className="cs-stat-label">{item.label}</dd>
        </div>
      ))}
    </Reveal>
  );
}

export function CsChips({ items }) {
  return (
    <Reveal as="ul" className="cs-chips">
      {items.map((item) => (
        <li key={item} className="cs-chip">
          {item}
        </li>
      ))}
    </Reveal>
  );
}

export function CsHmw({ items }) {
  return (
    <CsPanel title="How might we">
      <ol className="cs-hmw-list">
        {items.map((item) => (
          <li key={item.question} className="cs-hmw-item">
            <p className="cs-hmw-q">{item.question}</p>
            <p className="cs-hmw-a">
              <span className="cs-hmw-tag">Solution</span> {item.solution}
            </p>
          </li>
        ))}
      </ol>
    </CsPanel>
  );
}

export function CsImg({ src, alt, style }) {
  return (
    <img src={src} alt={alt} className="cs-media" loading="lazy" style={style} />
  );
}

export function CsVideo({ src, label, style }) {
  return (
    <LazyVideo
      src={src}
      className="cs-media"
      style={style}
      aria-label={label}
      autoPlay
      loop
      muted
      playsInline
    />
  );
}

export function CsEmbed({ src, title, height }) {
  return (
    <iframe
      src={src}
      title={title}
      className="cs-embed"
      style={{ height }}
      scrolling="no"
    />
  );
}

export function CsSeeNext({ id, items }) {
  const [hovering, setHovering] = useState(false);
  return (
    <section id={id} className="cs-section cs-col cs-next">
      <CursorPill isHovering={hovering} text="View case study" />
      <p className="cs-label">See next</p>
      <div className="cs-next-grid">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="cs-next-card"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            <div className="cs-next-media">
              <LazyVideo
                src={item.video}
                className="cs-media"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
            <h3 className="cs-next-title">{item.title}</h3>
            <p className="cs-next-desc">{item.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
