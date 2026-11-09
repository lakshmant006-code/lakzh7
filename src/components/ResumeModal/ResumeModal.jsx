import React, { useEffect, useState } from "react";
import "./ResumeModal.css";

/* The resume opens on top of whatever page you are on, as a paper card with the page blurred behind it. Anything that says
   "Resume" (the footer, the nav) sends the "resume:open" event; Esc, the cross or a click outside puts it away. */
const EXPERIENCE = [
  { role: "UX Researcher", org: "Arcadia Custom Builders", when: "JUN 2025 — NOW", points: [
    "Developed interactive prototypes, wireframes, and user flows to communicate design alternatives, clarify complex project requirements, and support more informed client approval decisions.",
    "Synthesized contextual inquiry and stakeholder feedback into research-backed personas and end-to-end journey maps, connecting user pain points with actionable design revisions.",
    "Collaborated with clients and multidisciplinary teams through recurring design reviews, surfacing workflow bottlenecks and design conflicts earlier in the project lifecycle.",
  ] },
  { role: "Architectural Intern", org: "23DDS", when: "FEB 2024 — JUL 2024", points: [
    "Produced detailed 3D architectural models, CAD drawings, and construction documentation to support client presentations, technical reviews, and coordinated project delivery.",
    "Worked with architects and MEP consultants across multiple building disciplines to identify drawing inconsistencies, reconcile requirements, and reduce avoidable design handoff friction.",
    "Participated in site visits and construction observations, translating field conditions and practical build constraints into clearer drawings and documentation updates.",
  ] },
  { role: "Product Developer", org: "UBC Impex", when: "JUL 2020 — AUG 2022", points: [
    "Led design and development of a time-management application serving 50+ employees, bringing clock-in, attendance tracking, and accountability workflows into one user-centered interface.",
    "Designed 2 core management capabilities—skills tracking and role-based dashboards—to help managers review employee competencies, activity, and operational needs.",
    "Gathered requirements through manager and employee interviews, then iterated on interface flows and usability feedback to make everyday administrative tasks easier to complete.",
  ] },
];
const SKILLS = [
  ["UX Research", "User interviews, contextual inquiry, mixed-methods research, usability testing, personas, journey mapping, thematic analysis"],
  ["Product Design", "Design thinking, systems thinking, wireframing, prototyping, interaction design, information architecture, accessibility, design systems"],
  ["Tools", "Figma, FigJam, Miro, Adobe Creative Cloud, Autodesk Forma, SketchUp, Excel, AI-assisted prototyping"],
  ["Collaboration", "Stakeholder interviews, requirements gathering, cross-functional communication, workshop facilitation, research presentations"],
];

export default function ResumeModal() {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener("resume:open", show);
    return () => window.removeEventListener("resume:open", show);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const raf = requestAnimationFrame(() => setShown(true));
    const key = (e) => { if (e.key === "Escape") close(); };
    const html = document.documentElement, prev = html.style.overflow;
    html.style.overflow = "hidden";                                   // the page behind stays where it is
    window.addEventListener("keydown", key);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", key); html.style.overflow = prev; };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const close = () => { setShown(false); setTimeout(() => setOpen(false), 260); };
  if (!open) return null;
  return (
    <div className={`resume-modal${shown ? " on" : ""}`} role="dialog" aria-modal="true" aria-label="Resume" onClick={close}>
      <button type="button" className="rm-x" aria-label="Close the resume" onClick={close}>×</button>
      <div className="rm-scroll" data-lenis-prevent onClick={(e) => e.stopPropagation()}>
        <article className="rm-card">
          <header className="rm-head">
            <h2 className="rm-name">Lakshman Thota <span>UX Designer &amp; Researcher</span></h2>
            <p className="rm-contact">
              <a href="mailto:lakshmant006@gmail.com">lakshmant006@gmail.com</a>
              <a href="https://www.linkedin.com/in/lakshman-thota/" target="_blank" rel="noopener noreferrer">linkedin.com/in/lakshman-thota</a>
              <a href="https://lakzh7.art/craft">lakzh7.art/craft</a>
            </p>
          </header>
          <section className="rm-row"><h3>SUMMARY</h3><p>UX designer and researcher with experience translating architectural, operational, and customer needs into intuitive digital experiences. Combines contextual inquiry, user journey mapping, interactive prototyping, design thinking, and systems thinking to simplify complex workflows and improve collaboration between stakeholders.</p></section>
          <section className="rm-row"><h3>EDUCATION</h3><div>
            <p className="rm-line"><b>Arizona State University</b> <i>Master of Science, User Experience</i><em>AUG 2024 — MAY 2026</em></p>
            <p className="rm-line"><b>BMS School of Architecture</b> <i>Bachelor of Architecture</i><em>APR 2019 — APR 2024</em></p>
          </div></section>
          <section className="rm-row"><h3>EXPERIENCE</h3><div>
            {EXPERIENCE.map((j) => (
              <div key={j.org} className="rm-job">
                <p className="rm-line"><b>{j.org}</b> <i>{j.role}</i><em>{j.when}</em></p>
                <ul>{j.points.map((t) => <li key={t}>{t}</li>)}</ul>
              </div>
            ))}
          </div></section>
          <section className="rm-row"><h3>PROJECTS</h3><div>
            <div className="rm-job"><p className="rm-line"><b>KeepX × Meta AI</b> <i>AI-powered memory journal</i></p><p>Designed a mobile product combining 3 memory formats—photos, journal entries, and conversational recall—with interactive onboarding and personalized retrieval to make meaningful moments easier to revisit.</p></div>
            <div className="rm-job"><p className="rm-line"><b>Procreate Motion-Rigging Extension</b> <i>Animation prototype</i></p><p>Prototyped a 2D character animation workflow integrating MediaPipe tracking, custom skeletal rigging, and spring dynamics; explored smoother motion, deformation, and animator-friendly controls.</p></div>
          </div></section>
          <section className="rm-row"><h3>SKILLS</h3><dl>{SKILLS.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl></section>
          <section className="rm-row"><h3>ALSO</h3><p>CITI Program — Human Research (Feb 2023). Published article: AI in Architectural Studies (Medium).</p></section>
        </article>
      </div>
      <a className="rm-download" href="/Lakshman_Thota_Resume.pdf" download="Lakshman_Thota_Resume.pdf" onClick={(e) => e.stopPropagation()}>Download PDF</a>
    </div>
  );
}
