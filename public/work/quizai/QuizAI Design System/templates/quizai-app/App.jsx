const { Button, Input, Logo, NavBar, StatTile, QuizHistoryItem, SummaryCard } = window.QuizAIDesignSystem_ab923d;

function LoginScreen({ onSignIn }) {
  const cardRef = React.useRef(null);
  React.useEffect(() => {
    gsap.fromTo(cardRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
  }, []);
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-maroon-tint)" }}>
      <div
        ref={cardRef}
        style={{
          width: 380,
          background: "var(--white)",
          border: "1px solid var(--border-maroon-tint)",
          borderRadius: "28px",
          padding: "36px 32px",
          boxShadow: "var(--shadow-elevated)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
          <Logo size={28} />
          <div style={{ font: "var(--text-h2)", color: "var(--text-heading)", marginTop: "4px" }}>Welcome to QuizAI</div>
          <div style={{ font: "var(--text-small)", color: "var(--text-muted)" }}>Sign in to your account</div>
        </div>
        <form
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          onSubmit={(e) => { e.preventDefault(); onSignIn(); }}
        >
          <Input type="email" placeholder="Email" />
          <Input type="password" placeholder="Password" />
          <div style={{ marginTop: "8px" }}>
            <Button variant="primary" type="submit">Sign In</Button>
          </div>
          <Button variant="secondary">Don't have an account? Sign Up</Button>
          <Button variant="ghost">Back to Options</Button>
        </form>
      </div>
    </div>
  );
}

const HISTORY = [
  { title: "Electromagnet.pdf", date: "10/11/2024", questions: 8, correct: 5, incorrect: 3, score: 62.5 },
  { title: "Electromagnet.pdf", date: "10/11/2024", questions: 5, correct: 2, incorrect: 1, score: 40 },
  { title: "Thermodynamics_Ch3.pdf", date: "9/28/2024", questions: 10, correct: 7, incorrect: 3, score: 70 },
];

function DashboardScreen({ active, onNav }) {
  const listRef = React.useRef(null);
  const statRefs = React.useRef([]);

  React.useEffect(() => {
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

function SummariesScreen({ active, onNav }) {
  const listRef = React.useRef(null);
  React.useEffect(() => {
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

function QuizAiApp() {
  const [view, setView] = React.useState("login");

  if (view === "login") return <LoginScreen onSignIn={() => setView("dashboard")} />;

  const nav = (label) => {
    if (label === "Dashboard" || label === "Quizzes") setView("dashboard");
    if (label === "Summaries") setView("summaries");
  };

  if (view === "summaries") return <SummariesScreen active="Summaries" onNav={nav} />;
  return <DashboardScreen active="Dashboard" onNav={nav} />;
}

window.QuizAiApp = QuizAiApp;
