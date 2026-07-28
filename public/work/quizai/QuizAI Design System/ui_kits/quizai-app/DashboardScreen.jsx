const { useRef, useEffect } = React;
const { NavBar, StatTile, QuizHistoryItem } = window.QuizAIDesignSystem_ab923d;

const HISTORY = [
  { title: "Electromagnet.pdf", date: "10/11/2024", questions: 8, correct: 5, incorrect: 3, score: 62.5 },
  { title: "Electromagnet.pdf", date: "10/11/2024", questions: 5, correct: 2, incorrect: 1, score: 40 },
  { title: "Thermodynamics_Ch3.pdf", date: "9/28/2024", questions: 10, correct: 7, incorrect: 3, score: 70 },
];

function DashboardScreen({ active, onNav }) {
  const listRef = useRef(null);
  const statRefs = useRef([]);

  useEffect(() => {
    const rows = listRef.current.querySelectorAll("[data-row]");
    gsap.fromTo(rows, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.08, ease: "power2.out" });

    const targets = [
      { el: statRefs.current[0], value: 37, suffix: "" },
      { el: statRefs.current[1], value: 35, suffix: "%" },
      { el: statRefs.current[2], value: 0, suffix: "h" },
    ];
    targets.forEach(({ el, value, suffix }) => {
      if (!el) return;
      const counter = { n: 0 };
      gsap.to(counter, {
        n: value,
        duration: 1,
        ease: "power1.out",
        onUpdate: () => { el.textContent = Math.round(counter.n) + suffix; },
      });
    });
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--white)" }}>
      <NavBar active={active} onNavClick={onNav} />
      <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "40px 32px" }}>
        <h1 style={{ font: "var(--text-h1)", color: "var(--text-heading)", textAlign: "center", marginBottom: "32px" }}>Your Quiz History</h1>
        <div style={{ display: "flex", gap: "16px", marginBottom: "28px" }}>
          <StatTile icon="fa-solid fa-circle-question" value={<span ref={(el) => (statRefs.current[0] = el)}>0</span>} label="Total Quizzes" sublabel="Completed" />
          <StatTile icon="fa-solid fa-chart-simple" value={<span ref={(el) => (statRefs.current[1] = el)}>0%</span>} label="Average Score" sublabel="Across all quizzes" />
          <StatTile icon="fa-regular fa-clock" value={<span ref={(el) => (statRefs.current[2] = el)}>0h</span>} label="Total Time" sublabel="Spent on quizzes" />
        </div>
        <div ref={listRef} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {HISTORY.map((h, i) => (
            <div data-row key={i}><QuizHistoryItem {...h} /></div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.DashboardScreen = DashboardScreen;
