const { useRef, useEffect } = React;
const { NavBar, StatTile, SummaryCard } = window.QuizAIDesignSystem_ab923d;

function SummariesScreen({ active, onNav }) {
  const listRef = useRef(null);
  useEffect(() => {
    const rows = listRef.current.querySelectorAll("[data-row]");
    gsap.fromTo(rows, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.1, ease: "power2.out" });
  }, []);
  return (
    <div style={{ minHeight: "100vh", background: "var(--white)" }}>
      <NavBar active={active} onNavClick={onNav} />
      <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "40px 32px" }}>
        <h1 style={{ font: "var(--text-h1)", color: "var(--text-heading)", textAlign: "center", marginBottom: "32px" }}>Study Session Summaries</h1>
        <div style={{ display: "flex", gap: "16px", marginBottom: "28px" }}>
          <StatTile tint="gold" icon="fa-regular fa-file-lines" value={1} label="Total Summaries" sublabel="Study sessions" />
          <StatTile tint="gold" icon="fa-solid fa-book-open" value={1} label="Pages Studied" sublabel="Total pages covered" />
          <StatTile tint="gold" icon="fa-solid fa-chart-simple" value={1} label="Average Pages" sublabel="Per session" />
        </div>
        <div ref={listRef} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div data-row>
            <SummaryCard
              title="GR00T_1_Whitepaper.pdf"
              date="4/14/2025"
              pages="1 - 1"
              excerpt='Here\u2019s a structured summary of the document titled "GR00T N1: An Open Foundation Model for Generalist Humanoid Robots" by NVIDIA.'
              abstract="General-purpose robots require both a versatile body and an intelligent mind."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

window.SummariesScreen = SummariesScreen;
