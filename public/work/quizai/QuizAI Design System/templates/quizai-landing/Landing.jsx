const { Button, Input, Logo, NavBar, StatTile, QuizHistoryItem, SummaryCard, Badge, Avatar } = window.QuizAIDesignSystem_ab923d;

/* ---- Neural synapse canvas (cursor-reactive; click fires a pulse) ---- */
function NeuralCanvas({ interactive = false }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const canvas = ref.current;
    const host = canvas.parentElement;
    const ctx = canvas.getContext("2d");
    let w, h, raf;
    const N = 70;
    const nodes = [];
    const mouse = { x: -1, y: -1 };
    const pulses = [];
    function resize() {
      w = canvas.offsetWidth; h = canvas.offsetHeight;
      canvas.width = w * devicePixelRatio; canvas.height = h * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }
    resize();
    for (let i = 0; i < N; i++) nodes.push({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0004, vy: (Math.random() - 0.5) * 0.0004,
      r: 1.5 + Math.random() * 2.5, gold: Math.random() < 0.18,
      pulse: Math.random() * Math.PI * 2, excite: 0,
    });
    function onMove(e) {
      const rc = host.getBoundingClientRect();
      mouse.x = e.clientX - rc.left; mouse.y = e.clientY - rc.top;
    }
    function onLeave() { mouse.x = -1; mouse.y = -1; }
    function onClick(e) {
      const rc = host.getBoundingClientRect();
      pulses.push({ x: e.clientX - rc.left, y: e.clientY - rc.top, r: 0 });
    }
    if (interactive) {
      host.addEventListener("click", onClick);
    }
    function tick(t) {
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > 1) n.vx *= -1;
        if (n.y < 0 || n.y > 1) n.vy *= -1;
        n.excite *= 0.94;
      }
      for (let p = pulses.length - 1; p >= 0; p--) {
        const pu = pulses[p];
        pu.r += 7;
        ctx.strokeStyle = `rgba(255,198,39,${Math.max(0, 0.7 - pu.r / 320)})`;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(pu.x, pu.y, pu.r, 0, Math.PI * 2); ctx.stroke();
        for (const n of nodes) {
          const d = Math.hypot(n.x * w - pu.x, n.y * h - pu.y);
          if (Math.abs(d - pu.r) < 22) n.excite = 1;
        }
        if (pu.r > 340) pulses.splice(p, 1);
      }
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = (a.x - b.x) * w, dy = (a.y - b.y) * h;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 130) {
          const ex = Math.max(a.excite, b.excite);
          ctx.strokeStyle = ex > 0.15 ? `rgba(255,198,39,${(1 - d / 130) * (0.25 + ex * 0.6)})` : `rgba(140,29,64,${(1 - d / 130) * 0.22})`;
          ctx.lineWidth = 1 + ex;
          ctx.beginPath(); ctx.moveTo(a.x * w, a.y * h); ctx.lineTo(b.x * w, b.y * h); ctx.stroke();
        }
      }
      if (mouse.x >= 0) {
        for (const n of nodes) {
          const dx = n.x * w - mouse.x, dy = n.y * h - mouse.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 170) {
            ctx.strokeStyle = `rgba(140,29,64,${(1 - d / 170) * 0.5})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.moveTo(n.x * w, n.y * h); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
            n.x += (dx > 0 ? -1 : 1) * 0.00003 * (170 - d);
            n.y += (dy > 0 ? -1 : 1) * 0.00003 * (170 - d);
          }
        }
        ctx.fillStyle = "rgba(255,198,39,0.9)";
        ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "rgba(140,29,64,0.35)";
        ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 10 + 3 * Math.sin(t * 0.004), 0, Math.PI * 2); ctx.stroke();
      }
      for (const n of nodes) {
        const glow = 0.55 + 0.45 * Math.sin(t * 0.001 + n.pulse);
        const ex = n.excite;
        ctx.fillStyle = n.gold || ex > 0.3 ? `rgba(255,198,39,${0.5 + Math.max(glow * 0.5, ex)})` : `rgba(140,29,64,${0.25 + glow * 0.45 + ex * 0.5})`;
        ctx.beginPath(); ctx.arc(n.x * w, n.y * h, n.r * (n.gold ? 1.4 : 1) * (1 + ex), 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf); window.removeEventListener("resize", resize);
      if (interactive) { host.removeEventListener("click", onClick); }
    };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} aria-hidden="true"></canvas>;
}

/* ---- Magnetic wrapper: children drift toward the cursor ---- */
function Magnetic({ children, strength = 0.35, style }) {
  const ref = React.useRef(null);
  const onMove = (e) => {
    const rc = ref.current.getBoundingClientRect();
    gsap.to(ref.current, { x: (e.clientX - rc.left - rc.width / 2) * strength, y: (e.clientY - rc.top - rc.height / 2) * strength, duration: 0.3, ease: "power2.out" });
  };
  const onLeave = () => gsap.to(ref.current, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,0.4)" });
  return <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={style}>{children}</div>;
}

/* ---- 3D tilt card ---- */
function TiltCard({ children, style }) {
  const ref = React.useRef(null);
  const onMove = (e) => {
    const rc = ref.current.getBoundingClientRect();
    const px = (e.clientX - rc.left) / rc.width - 0.5, py = (e.clientY - rc.top) / rc.height - 0.5;
    gsap.to(ref.current, { rotateY: px * 10, rotateX: -py * 10, scale: 1.02, boxShadow: "var(--shadow-elevated)", duration: 0.3, ease: "power2.out", transformPerspective: 700 });
  };
  const onLeave = () => gsap.to(ref.current, { rotateY: 0, rotateX: 0, scale: 1, boxShadow: "0 0 0 rgba(0,0,0,0)", duration: 0.5, ease: "power3.out" });
  return <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ ...style, willChange: "transform" }}>{children}</div>;
}

/* ---- Chat demo: types itself when scrolled into view ---- */
function ChatDemo() {
  const rootRef = React.useRef(null);
  const [typed, setTyped] = React.useState("");
  const [phase, setPhase] = React.useState(0); // 0 idle, 1 typing, 2 thinking, 3 answered
  const msg = "Turn Electromagnet.pdf into an 8-question quiz";
  const started = React.useRef(false);
  React.useEffect(() => {
    const el = rootRef.current;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) { started.current = true; run(); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(el);
    let timers = [];
    function run() {
      setPhase(1);
      msg.split("").forEach((_, i) => timers.push(setTimeout(() => setTyped(msg.slice(0, i + 1)), 350 + i * 32)));
      timers.push(setTimeout(() => setPhase(2), 350 + msg.length * 32 + 250));
      timers.push(setTimeout(() => setPhase(3), 350 + msg.length * 32 + 1500));
    }
    return () => { io.disconnect(); timers.forEach(clearTimeout); };
  }, []);
  React.useEffect(() => {
    if (phase === 3 && rootRef.current) {
      const card = rootRef.current.querySelector("[data-answer]");
      gsap.fromTo(card, { y: 18, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.6)" });
      gsap.fromTo(card.querySelectorAll("[data-chip]"), { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, stagger: 0.09, delay: 0.25, ease: "power2.out" });
    }
  }, [phase]);
  return (
    <div ref={rootRef} style={{ background: "#FBFBFD", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "20px", padding: "28px", display: "flex", flexDirection: "column", gap: "14px", minHeight: 300, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(0,0,0,0.05)", color: "var(--gray-1)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}><i className="fa-solid fa-brain" aria-hidden="true"></i></span>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--gray-1)" }}>QuizAI</span>
        <span style={{ font: "var(--text-small)", color: "var(--gray-3)" }}>Your study operator</span>
      </div>
      {phase >= 1 ? (
        <div style={{ alignSelf: "flex-end", background: "var(--gray-1)", color: "#fff", fontFamily: "var(--font-sans)", fontSize: 14.5, letterSpacing: "-0.01em", padding: "12px 18px", borderRadius: "18px 18px 5px 18px", maxWidth: 420, minHeight: 21 }}>
          {typed}<span style={{ opacity: phase === 1 ? 1 : 0, borderRight: "2px solid #fff", marginLeft: 1, animation: "none" }}>&#8203;</span>
        </div>
      ) : null}
      {phase === 2 ? (
        <div style={{ alignSelf: "flex-start", background: "#fff", border: "1px solid rgba(0,0,0,0.07)", padding: "14px 18px", borderRadius: "18px 18px 18px 5px", font: "var(--text-small)", color: "var(--gray-3)" }}>
          <i className="fa-solid fa-wand-magic-sparkles fa-fade" aria-hidden="true" style={{ marginRight: 8, color: "var(--gray-3)" }}></i>Reading Electromagnet.pdf…
        </div>
      ) : null}
      {phase === 3 ? (
        <div data-answer style={{ alignSelf: "flex-start", background: "#fff", border: "1px solid rgba(0,0,0,0.07)", padding: "18px 20px", borderRadius: "18px 18px 18px 5px", maxWidth: 470, display: "flex", flexDirection: "column", gap: "10px", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--gray-1)" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--asu-maroon)" }}></span>Quiz ready — 8 questions
          </span>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--gray-2)", lineHeight: 1.6 }}>Multiple choice · difficulty: medium · covers magnetic flux, induction, and Faraday's law</span>
          <div style={{ display: "flex", gap: 8 }}>
            {["MCQs", "Flashcards", "Short answers"].map((c) => (
              <span data-chip key={c} style={{ background: "rgba(0,0,0,0.045)", color: "var(--gray-2)", fontFamily: "var(--font-sans)", fontSize: 12.5, padding: "5px 12px", borderRadius: 8 }}>{c}</span>
            ))}
          </div>
        </div>
      ) : null}
      <span style={{ font: "var(--text-small)", color: "var(--text-muted)", textAlign: "center", marginTop: "auto" }}>No re-reading. No highlighting rituals. Just say what you need.</span>
    </div>
  );
}

/* ---- Glass button (landing only) ---- */
function GlassButton({ children, tone = "light", size = "md", onClick }) {
  const ref = React.useRef(null);
  const tones = {
    light: { background: "rgba(255,255,255,0.45)", color: "var(--asu-maroon)", border: "1px solid rgba(255,255,255,0.7)", boxShadow: "0 6px 22px rgba(80,16,37,0.10), inset 0 1px 0 rgba(255,255,255,0.75)" },
    maroon: { background: "rgba(140,29,64,0.72)", color: "#fff", border: "1px solid rgba(255,255,255,0.28)", boxShadow: "0 8px 26px rgba(80,16,37,0.28), inset 0 1px 0 rgba(255,255,255,0.28)" },
  };
  const enter = () => gsap.to(ref.current, { y: -2, scale: 1.02, duration: 0.25, ease: "power2.out" });
  const leave = () => gsap.to(ref.current, { y: 0, scale: 1, duration: 0.3, ease: "power2.out" });
  const press = () => gsap.to(ref.current, { scale: 0.97, duration: 0.1, yoyo: true, repeat: 1, ease: "power2.inOut" });
  return (
    <button ref={ref} onClick={(e) => { press(); if (onClick) onClick(e); }} onMouseEnter={enter} onMouseLeave={leave}
      style={{ ...tones[tone], width: "100%", cursor: "pointer", borderRadius: 999, padding: size === "sm" ? "9px 18px" : "13px 24px",
        fontFamily: "var(--font-sans)", fontSize: size === "sm" ? 13 : 15, fontWeight: 700, letterSpacing: "-0.01em",
        backdropFilter: "blur(18px) saturate(180%)", WebkitBackdropFilter: "blur(18px) saturate(180%)", willChange: "transform" }}>
      {children}
    </button>
  );
}

/* ---- Landing ---- */
function LandingScreen({ onSignIn }) {
  const heroRef = React.useRef(null);
  React.useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.fromTo(heroRef.current.querySelectorAll("[data-hero]"), { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power3.out" });
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      gsap.fromTo(el, { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 85%" } });
    });
    return () => ScrollTrigger.getAll().forEach((s) => s.kill());
  }, []);
  const navLink = { font: "var(--text-label)", color: "var(--gray-2)", textDecoration: "none" };
  const sectionH = { font: "var(--text-h1)", color: "var(--text-heading)", margin: "0 0 12px", textAlign: "center" };
  const featureCard = { flex: 1, background: "var(--white)", border: "1px solid var(--gray-6)", borderRadius: "14px", padding: "28px" };
  return (
    <div style={{ background: "var(--white)", minHeight: "100vh", fontFamily: "var(--font-sans)" }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 40px", borderBottom: "1px solid var(--gray-6)", position: "sticky", top: 0, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)", zIndex: 10 }}>
        <Logo />
        <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          <a href="#features" style={navLink}>Features</a>
          <a href="#how" style={navLink}>How It Works</a>
          <div style={{ width: 100 }}><Button variant="secondary" size="sm" onClick={onSignIn}>Sign In</Button></div>
          <div style={{ width: 130 }}><Button variant="primary" size="sm" onClick={onSignIn}>Get Started</Button></div>
        </div>
      </nav>

      <header ref={heroRef} style={{ position: "relative", overflow: "hidden", padding: "96px 40px 110px", textAlign: "center", cursor: "crosshair" }}>
        <NeuralCanvas interactive={true} />
        <div style={{ position: "relative", maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
          <span data-hero style={{ font: "var(--text-label)", color: "var(--asu-maroon)", background: "var(--surface-gold-tint)", border: "1px solid var(--border-gold-tint)", padding: "6px 16px", borderRadius: "999px" }}>
            <i className="fa-solid fa-brain" aria-hidden="true" style={{ marginRight: 8 }}></i>AI-powered studying
          </span>
          <h1 data-hero style={{ font: "var(--text-display)", fontSize: "56px", color: "var(--text-heading)", margin: 0, letterSpacing: "-1px" }}>Every document becomes a study session</h1>
          <p data-hero style={{ font: "var(--text-body)", fontSize: "18px", color: "var(--gray-2)", maxWidth: 560, margin: 0 }}>Upload notes, PDFs, or links — QuizAI generates quizzes, flashcards, and summaries, then tracks what your brain actually retains.</p>
          <div data-hero style={{ display: "flex", gap: "12px", marginTop: 8 }}>
            <Magnetic style={{ width: 190 }}><Button variant="primary" onClick={onSignIn}>Sign In to QuizAI</Button></Magnetic>
            <Magnetic style={{ width: 170 }}><Button variant="secondary" onClick={onSignIn}>Create Account</Button></Magnetic>
          </div>
          <span data-hero style={{ font: "var(--text-small)", color: "var(--text-muted)" }}>Click anywhere — fire a synapse.</span>
        </div>
      </header>

      <section data-reveal style={{ maxWidth: 880, margin: "0 auto", padding: "0 40px 90px" }}>
        <ChatDemo />
      </section>

      <section id="features" data-reveal style={{ maxWidth: 1120, margin: "0 auto", padding: "0 40px 90px" }}>
        <h2 style={sectionH}>Built around how memory works</h2>
        <p style={{ font: "var(--text-body)", color: "var(--gray-2)", textAlign: "center", margin: "0 0 40px" }}>Three tools, one loop: encode, test, reinforce.</p>
        <div style={{ display: "flex", gap: "20px" }}>
          <TiltCard style={featureCard}>
            <i className="fa-solid fa-circle-question" aria-hidden="true" style={{ fontSize: 26, color: "var(--asu-maroon)" }}></i>
            <h3 style={{ font: "var(--text-h3)", color: "var(--text-heading)", margin: "14px 0 8px" }}>AI Quiz Generator</h3>
            <p style={{ font: "var(--text-body)", color: "var(--gray-2)", margin: 0 }}>Paste text, upload a document, or drop a link. Choose MCQs, flashcards, or short answers and set your difficulty.</p>
          </TiltCard>
          <TiltCard style={featureCard}>
            <i className="fa-regular fa-file-lines" aria-hidden="true" style={{ fontSize: 26, color: "var(--asu-maroon)" }}></i>
            <h3 style={{ font: "var(--text-h3)", color: "var(--text-heading)", margin: "14px 0 8px" }}>Smart Summaries</h3>
            <p style={{ font: "var(--text-body)", color: "var(--gray-2)", margin: 0 }}>Long readings become concise, structured summaries with key terms highlighted and flashcards auto-generated.</p>
          </TiltCard>
          <TiltCard style={featureCard}>
            <i className="fa-solid fa-chart-simple" aria-hidden="true" style={{ fontSize: 26, color: "var(--asu-maroon)" }}></i>
            <h3 style={{ font: "var(--text-h3)", color: "var(--text-heading)", margin: "14px 0 8px" }}>Progress Insights</h3>
            <p style={{ font: "var(--text-body)", color: "var(--gray-2)", margin: 0 }}>Accuracy, retention, and weak topics at a glance — plus XP streaks and badges to keep the loop going.</p>
          </TiltCard>
        </div>
      </section>

      <section id="how" data-reveal style={{ background: "var(--asu-maroon)", padding: "70px 40px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", gap: "20px", textAlign: "center" }}>
          {[["fa-solid fa-upload", "1. Upload", "Notes, PDFs, or links — any study material works."],
            ["fa-solid fa-bolt", "2. Quiz instantly", "AI writes the questions; you pick the format and difficulty."],
            ["fa-solid fa-arrows-rotate", "3. Reinforce", "Review weak topics, retake quizzes, watch your score climb."]].map(([icon, title, body]) => (
            <div key={title} style={{ flex: 1 }}>
              <i className={icon} aria-hidden="true" style={{ fontSize: 26, color: "var(--asu-gold)" }}></i>
              <h3 style={{ font: "var(--text-h3)", color: "#fff", margin: "14px 0 8px" }}>{title}</h3>
              <p style={{ font: "var(--text-body)", color: "rgba(255,255,255,0.85)", margin: 0 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section data-reveal style={{ textAlign: "center", padding: "90px 40px" }}>
        <h2 style={sectionH}>Ready when your brain is</h2>
        <p style={{ font: "var(--text-body)", color: "var(--gray-2)", margin: "0 0 28px" }}>Sign in and turn today's reading into tomorrow's recall.</p>
        <Magnetic style={{ width: 220, margin: "0 auto" }}><Button variant="primary" onClick={onSignIn}>Sign In to QuizAI</Button></Magnetic>
      </section>

      <footer style={{ borderTop: "1px solid var(--gray-6)", padding: "24px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Logo size={16} />
        <span style={{ font: "var(--text-small)", color: "var(--text-muted)" }}>QuizAI — study smarter, remember longer.</span>
      </footer>
    </div>
  );
}

/* ---- App screens (login / dashboard / summaries) ---- */
function LoginScreen({ onSignIn, onBack }) {
  const cardRef = React.useRef(null);
  React.useEffect(() => {
    gsap.fromTo(cardRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
  }, []);
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-maroon-tint)", position: "relative", overflow: "hidden" }}>
      <NeuralCanvas interactive={true} />
      <div ref={cardRef} style={{ position: "relative", width: 380, background: "var(--white)", border: "1px solid var(--border-maroon-tint)", borderRadius: "28px", padding: "36px 32px", boxShadow: "var(--shadow-elevated)" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
          <Logo size={28} />
          <div style={{ font: "var(--text-h2)", color: "var(--text-heading)", marginTop: "4px" }}>Welcome to QuizAI</div>
          <div style={{ font: "var(--text-small)", color: "var(--text-muted)" }}>Sign in to your account</div>
        </div>
        <form style={{ display: "flex", flexDirection: "column", gap: "12px" }} onSubmit={(e) => { e.preventDefault(); onSignIn(); }}>
          <Input type="email" placeholder="Email" />
          <Input type="password" placeholder="Password" />
          <div style={{ marginTop: "8px" }}><Button variant="primary" type="submit">Sign In</Button></div>
          <Button variant="secondary">Don't have an account? Sign Up</Button>
          <Button variant="ghost" onClick={onBack}>Back to Options</Button>
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

/* ================= Dashboard (workspace layout) ================= */
const DOT = { a: "rgba(140,29,64,1)", b: "rgba(140,29,64,0.62)", c: "rgba(140,29,64,0.42)", d: "rgba(140,29,64,0.26)", e: "rgba(140,29,64,0.16)" };

function SideLink({ icon, label, active, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "9px 12px", border: "none", borderRadius: 9, cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: active ? 700 : 400, letterSpacing: "-0.01em",
        background: active ? "rgba(0,0,0,0.045)" : hover ? "rgba(0,0,0,0.025)" : "transparent",
        color: active ? "var(--gray-1)" : "var(--gray-2)", transition: "background .25s cubic-bezier(.4,0,.2,1), color .25s", textAlign: "left" }}>
      <i className={icon} aria-hidden="true" style={{ width: 16, color: active ? "var(--asu-maroon)" : "var(--gray-3)" }}></i>{label}
    </button>
  );
}

/* ---- Upload dropzone: reads a real file, derives a title, stores it in localStorage ---- */
function UploadZone({ onAdd }) {
  const [drag, setDrag] = React.useState(false);
  const [busy, setBusy] = React.useState(null);
  const inputRef = React.useRef(null);
  const zoneRef = React.useRef(null);

  const titleFrom = (name) => name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim()
    .split(" ").map((w) => (w.length > 3 ? w[0].toUpperCase() + w.slice(1) : w)).join(" ");

  const handle = (files) => {
    const file = files && files[0];
    if (!file) return;
    setBusy(file.name);
    gsap.fromTo(zoneRef.current, { scale: 0.99 }, { scale: 1, duration: 0.4, ease: "back.out(2)" });
    setTimeout(() => {
      onAdd({
        id: Date.now(),
        title: titleFrom(file.name),
        source: file.name,
        date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
        size: (file.size / 1024 / 1024).toFixed(1) + " MB",
      });
      setBusy(null);
    }, 1400);
  };

  return (
    <div ref={zoneRef}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files); }}
      onClick={() => inputRef.current.click()}
      style={{ border: `1.5px dashed ${drag ? "rgba(140,29,64,0.55)" : "rgba(0,0,0,0.14)"}`, borderRadius: 16, padding: "22px 20px", cursor: "pointer",
        background: drag ? "rgba(140,29,64,0.04)" : "#fff", display: "flex", alignItems: "center", gap: 14, transition: "all .25s cubic-bezier(.4,0,.2,1)" }}>
      <input ref={inputRef} type="file" accept=".pdf,.txt,.md,.docx" onChange={(e) => handle(e.target.files)} style={{ display: "none" }} />
      <span style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(140,29,64,0.07)", color: "var(--asu-maroon)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <i className={busy ? "fa-solid fa-brain fa-beat-fade" : "fa-solid fa-arrow-up-from-bracket"} aria-hidden="true"></i>
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--gray-1)" }}>
          {busy ? `Reading ${busy}…` : "Upload a PDF to create a flashcard"}
        </div>
        <div style={{ font: "var(--text-small)", color: "var(--gray-3)", marginTop: 2 }}>
          {busy ? "Detecting title and building your card" : "Drop a file here or click to browse — the title is detected automatically"}
        </div>
      </div>
    </div>
  );
}

function ConfirmDialog({ open, title, onCancel, onConfirm }) {
  const boxRef = React.useRef(null);
  React.useEffect(() => {
    if (open && boxRef.current) gsap.fromTo(boxRef.current, { y: 12, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.32, ease: "back.out(1.7)" });
  }, [open]);
  if (!open) return null;
  return (
    <div onClick={onCancel} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.32)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
      <div ref={boxRef} onClick={(e) => e.stopPropagation()}
        style={{ width: 360, background: "#fff", borderRadius: 18, padding: 26, boxShadow: "0 24px 60px rgba(0,0,0,0.22)", textAlign: "center", fontFamily: "var(--font-sans)" }}>
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--gray-1)" }}>Are you sure you want to delete it?</div>
        <div style={{ font: "var(--text-small)", color: "var(--gray-3)", margin: "8px 0 22px", lineHeight: 1.55 }}>“{title}” will be removed from your flashcards. This can't be undone.</div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}><Button variant="secondary" size="sm" onClick={onCancel}>Cancel</Button></div>
          <div style={{ flex: 1 }}>
            <button onClick={onConfirm}
              style={{ width: "100%", border: "1px solid var(--danger)", background: "var(--danger)", color: "#fff", borderRadius: 10, padding: "8px 16px", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Flashcard: 3D flip, hover lift, animated delete ---- */
function FlashCard({ color, title, date, meta, isNew, onGenerate, onDelete }) {
  const wrapRef = React.useRef(null);
  const innerRef = React.useRef(null);
  const [flipped, setFlipped] = React.useState(false);
  React.useEffect(() => {
    if (isNew) {
      gsap.fromTo(wrapRef.current, { scale: 0.8, opacity: 0, rotateY: -25 }, { scale: 1, opacity: 1, rotateY: 0, duration: 0.75, ease: "back.out(1.7)" });
      gsap.fromTo(wrapRef.current, { boxShadow: "0 0 0 6px rgba(140,29,64,0.22)" }, { boxShadow: "0 1px 2px rgba(0,0,0,0.04)", duration: 1.1, delay: 0.35, ease: "power2.out" });
    }
  }, []);

  const flip = () => {
    const next = !flipped;
    setFlipped(next);
    gsap.to(innerRef.current, { rotateY: next ? 180 : 0, duration: 0.7, ease: "power3.inOut" });
    gsap.fromTo(wrapRef.current, { scale: 1 }, { scale: 1.03, duration: 0.35, yoyo: true, repeat: 1, ease: "power2.inOut" });
  };
  const onEnter = () => gsap.to(wrapRef.current, { y: -4, boxShadow: "0 14px 32px rgba(0,0,0,0.10)", duration: 0.3, ease: "power2.out" });
  const onLeave = () => gsap.to(wrapRef.current, { y: 0, boxShadow: "0 1px 2px rgba(0,0,0,0.04)", duration: 0.35, ease: "power2.out" });
  const requestDelete = (e) => {
    e.stopPropagation();
    gsap.to(wrapRef.current, { rotateZ: -3, x: -8, duration: 0.12, ease: "power2.out", yoyo: true, repeat: 1, onComplete: () => onDelete(title) });
  };

  const face = { position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", background: "#fff", border: isNew ? "1px solid rgba(140,29,64,0.28)" : "1px solid rgba(0,0,0,0.07)", borderRadius: 16, padding: 18, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 10 };
  const genBtn = {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 7, width: "100%", border: "none", borderRadius: 9, padding: "8px 10px", cursor: "pointer",
    fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, background: "rgba(140,29,64,0.06)", color: "var(--asu-maroon)", transition: "background .25s, color .25s",
  };

  return (
    <div data-card ref={wrapRef} onMouseEnter={onEnter} onMouseLeave={onLeave} onClick={flip}
      style={{ position: "relative", height: 156, perspective: 1100, cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.04)", borderRadius: 16 }}>
      <div ref={innerRef} style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", willChange: "transform" }}>
        <div style={face}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, marginTop: 7, flexShrink: 0 }}></span>
            <span style={{ flex: 1, minWidth: 0, overflowWrap: "anywhere", fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--gray-1)", lineHeight: 1.35 }}>{title}</span>
            <i className="fa-solid fa-xmark" aria-hidden="true" onClick={requestDelete}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--danger)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--gray-3)"; }}
              style={{ color: "var(--gray-3)", fontSize: 13, cursor: "pointer", transition: "color .2s", flexShrink: 0, marginTop: 2 }}></i>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", font: "var(--text-small)", color: "var(--gray-3)" }}>
            <span>{meta || date}</span>
            {isNew ? <span style={{ background: "rgba(140,29,64,0.07)", color: "var(--asu-maroon)", padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>New</span> : <i className="fa-solid fa-rotate" aria-hidden="true" style={{ fontSize: 11 }}></i>}
          </div>
          <button onClick={(e) => { e.stopPropagation(); onGenerate(title); }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--asu-maroon)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(140,29,64,0.06)"; e.currentTarget.style.color = "var(--asu-maroon)"; }}
            style={genBtn}>
            <i className="fa-solid fa-bolt" aria-hidden="true" style={{ fontSize: 11 }}></i>Generate Quiz
          </button>
        </div>
        <div style={{ ...face, transform: "rotateY(180deg)", background: "var(--asu-maroon)", border: "1px solid var(--asu-maroon)" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)" }}>Flashcard</div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", fontFamily: "var(--font-sans)", fontSize: 14, color: "#fff", lineHeight: 1.5 }}>
            Key terms, formulas, and the three questions most likely to come up from {title}.
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", font: "var(--text-small)", color: "rgba(255,255,255,0.7)" }}>
            <span>Tap to flip back</span><i className="fa-solid fa-arrow-rotate-left" aria-hidden="true" style={{ fontSize: 11 }}></i>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuizFolderCard({ color, title, date, onGenerate, onDelete }) {
  const ref = React.useRef(null);
  const onEnter = () => gsap.to(ref.current, { y: -3, boxShadow: "0 8px 24px rgba(0,0,0,0.07)", duration: 0.3, ease: "power2.out" });
  const onLeave = () => gsap.to(ref.current, { y: 0, boxShadow: "0 1px 2px rgba(0,0,0,0.04)", duration: 0.35, ease: "power2.out" });
  return (
    <div data-card ref={ref} onMouseEnter={onEnter} onMouseLeave={onLeave}
      style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 16, padding: 18, cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.04)", minHeight: 132, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 12 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, marginTop: 7, flexShrink: 0 }}></span>
        <span style={{ flex: 1, minWidth: 0, overflowWrap: "anywhere", fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--gray-1)", lineHeight: 1.35 }}>{title}</span>
        <i className="fa-solid fa-xmark" aria-hidden="true" onClick={(e) => { e.stopPropagation(); onDelete(title); }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--danger)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--gray-3)"; }}
          style={{ color: "var(--gray-3)", fontSize: 13, cursor: "pointer", transition: "color .2s", flexShrink: 0, marginTop: 2 }}></i>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", font: "var(--text-small)", color: "var(--gray-3)" }}>
        <span>{date}</span><i className="fa-solid fa-ellipsis" aria-hidden="true"></i>
      </div>
      <button onClick={(e) => { e.stopPropagation(); onGenerate(title); }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--asu-maroon)"; e.currentTarget.style.color = "#fff"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(140,29,64,0.06)"; e.currentTarget.style.color = "var(--asu-maroon)"; }}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, width: "100%", border: "none", borderRadius: 9, padding: "8px 10px", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, background: "rgba(140,29,64,0.06)", color: "var(--asu-maroon)", transition: "background .25s, color .25s" }}>
        <i className="fa-solid fa-bolt" aria-hidden="true" style={{ fontSize: 11 }}></i>Generate Quiz
      </button>
    </div>
  );
}

function TaskRow({ task, onToggle, onStar }) {
  const boxRef = React.useRef(null);
  const starRef = React.useRef(null);
  const toggle = () => {
    if (!task.done) gsap.fromTo(boxRef.current, { scale: 0.82 }, { scale: 1, duration: 0.4, ease: "back.out(2)" });
    onToggle(task.id);
  };
  const star = () => { gsap.fromTo(starRef.current, { scale: 0.7 }, { scale: 1, duration: 0.35, ease: "back.out(2.5)" }); onStar(task.id); };
  return (
    <div data-task style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 4px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
      <span ref={boxRef} onClick={toggle} style={{ position: "relative", width: 20, height: 20, borderRadius: "50%", border: task.done ? "none" : "1.5px solid rgba(0,0,0,0.18)", background: task.done ? "var(--asu-maroon)" : "transparent", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background .25s cubic-bezier(.4,0,.2,1), border-color .25s" }}>
        {task.done ? <i className="fa-solid fa-check" aria-hidden="true" style={{ color: "#fff", fontSize: 10 }}></i> : null}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 15, letterSpacing: "-0.01em", color: task.done ? "var(--gray-3)" : "var(--gray-1)", textDecoration: task.done ? "line-through" : "none", transition: "color .25s" }}>{task.title}</div>
        <div style={{ font: "var(--text-small)", color: "var(--gray-3)" }}>{task.meta}</div>
      </div>
      <span ref={starRef} onClick={star} style={{ cursor: "pointer", color: task.starred ? "var(--asu-maroon)" : "rgba(0,0,0,0.18)", transition: "color .25s" }}>
        <i className={task.starred ? "fa-solid fa-star" : "fa-regular fa-star"} aria-hidden="true" style={{ fontSize: 13 }}></i>
      </span>
    </div>
  );
}

function WorkspaceSidebar({ active = "Home", onNav }) {
  return (
    <aside style={{ width: 210, borderRight: "1px solid rgba(0,0,0,0.07)", padding: 16, display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
      <div data-side onClick={() => onNav("Profile")}
        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.03)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, padding: 6, borderRadius: 10, cursor: "pointer", transition: "background .25s", background: active === "Profile" ? "rgba(0,0,0,0.045)" : "transparent" }}>
        <Avatar initials="LT" size={38} />
        <div style={{ minWidth: 0 }}>
          <div style={{ font: "var(--text-label)", color: "var(--gray-1)" }}>Lakshman Thota</div>
          <div style={{ font: "var(--text-small)", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis" }}>lthota@asu.edu</div>
        </div>
      </div>
      <div data-side style={{ margin: "6px 0 10px" }}><Button variant="primary" icon="fa-solid fa-plus">New Quiz</Button></div>
      <div data-side><SideLink icon="fa-solid fa-magnifying-glass" label="Search" /></div>
      <div data-side><SideLink icon="fa-solid fa-house" label="Home" active={active === "Home"} onClick={() => onNav("Dashboard")} /></div>
      <div data-side><SideLink icon="fa-regular fa-file-lines" label="Summaries" active={active === "Summaries"} onClick={() => onNav("Summaries")} /></div>
      <div data-side><SideLink icon="fa-solid fa-circle-question" label="Quizzes" active={active === "Quizzes"} onClick={() => onNav("Quizzes")} /></div>
      <div data-side><SideLink icon="fa-solid fa-circle-check" label="Tasks" active={active === "Tasks"} onClick={() => onNav("Tasks")} /></div>
      <div data-side style={{ borderTop: "1px solid rgba(0,0,0,0.07)", margin: "14px 0 8px" }}></div>
      <div data-side style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px 6px", fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 700, letterSpacing: "0.03em", color: "var(--gray-3)" }}>
        <span>Subjects</span>
        <i className="fa-solid fa-chevron-up" aria-hidden="true" style={{ fontSize: 10 }}></i>
      </div>
      {[["Electromagnetism", DOT.a], ["Thermodynamics", DOT.b], ["Humanoid Robotics", DOT.c], ["Linear Algebra", DOT.d]].map(([s, c]) => (
        <div data-side key={s} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 12px", fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--gray-2)", cursor: "pointer" }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: c }}></span>{s}
        </div>
      ))}
      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
        <div data-side><SideLink icon="fa-regular fa-circle-question" label="Support" /></div>
        <div data-side><SideLink icon="fa-regular fa-star" label="What's new" /></div>
        <div data-side><SideLink icon="fa-regular fa-file-lines" label="Privacy Policy" /></div>
      </div>
    </aside>
  );
}

function DashboardScreen({ onNav, tasks, onToggle, onStar, onOpenSummary, onGenerateQuiz, uploads, onAddUpload, onRemoveUpload }) {
  const rootRef = React.useRef(null);
  React.useEffect(() => {
    const q = (s) => rootRef.current.querySelectorAll(s);
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.fromTo(q("[data-side]"), { x: -10, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, stagger: 0.035 })
      .fromTo(q("[data-greet]"), { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, "-=0.25")
      .fromTo(q("[data-card]"), { y: 22, opacity: 0, rotateX: -12, transformOrigin: "50% 100%" }, { y: 0, opacity: 1, rotateX: 0, duration: 0.6, stagger: 0.06, ease: "back.out(1.4)" }, "-=0.25")
      .fromTo(q("[data-panel]"), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.07 }, "-=0.35")
      .fromTo(q("[data-task]"), { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.04 }, "-=0.3")
      .fromTo(q("[data-act]"), { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.04 }, "-=0.3");
  }, []);
  const toggle = onToggle;
  const starT = onStar;
  const [deleted, setDeleted] = React.useState([]);
  const [pending, setPending] = React.useState(null);
  const BUILT_IN = [
    [DOT.a, "Electromagnet — induction set", "10/11/2024"],
    [DOT.b, "Thermodynamics Ch. 3", "9/28/2024"],
    [DOT.c, "GR00T whitepaper recall", "4/14/2025"],
    [DOT.d, "Matrix transformations, eigenvalues", "3/02/2025"],
    [DOT.e, "Reaction mechanisms", "2/19/2025"],
    [DOT.b, "Faraday's law flashcards", "1/30/2025"],
  ];
  const confirmDelete = () => {
    if (!pending) return;
    if (pending.kind === "upload") onRemoveUpload(pending.id);
    else setDeleted((d) => [...d, pending.title]);
    setPending(null);
  };

  const sectionLabel = { display: "flex", alignItems: "center", gap: 9, fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, letterSpacing: "0.02em", color: "var(--gray-3)", margin: "0 0 14px" };
  const panel = { background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 16, padding: "6px 18px 12px", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" };
  const noteCard = { background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 16, padding: 18, display: "flex", flexDirection: "column", gap: 10, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" };
  const chip = () => ({ background: "rgba(0,0,0,0.045)", color: "var(--gray-2)", fontFamily: "var(--font-sans)", fontSize: 12, padding: "5px 11px", borderRadius: 7 });

  return (
    <div ref={rootRef} style={{ minHeight: "100vh", position: "relative", padding: 24, background: "#F5F5F7", fontFamily: "var(--font-sans)" }}>
      <ConfirmDialog open={!!pending} title={pending ? pending.title : ""} onCancel={() => setPending(null)} onConfirm={confirmDelete} />
      <div style={{ position: "relative", display: "flex", background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.05)", minHeight: "calc(100vh - 48px)" }}>
        {/* Sidebar */}
        <WorkspaceSidebar active="Home" onNav={onNav} />

        {/* Main */}
        <main style={{ flex: 1, padding: "36px 40px 44px", display: "grid", gridTemplateColumns: "minmax(0,1.55fr) minmax(0,1fr)", gap: 40, alignContent: "start", background: "#FBFBFD", overflow: "auto" }}>
          <h1 data-greet style={{ gridColumn: "1 / -1", fontFamily: "var(--font-sans)", fontSize: 34, fontWeight: 700, letterSpacing: "-0.025em", color: "var(--gray-1)", margin: 0 }}>Welcome back, Lakshman</h1>

          <section>
            <h2 style={sectionLabel}>My quizzes</h2>
            <div style={{ marginBottom: 16 }}><UploadZone onAdd={onAddUpload} /></div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 18 }}>
              {uploads.map((u) => (
                <FlashCard key={u.id} color={DOT.a} title={u.title} meta={`${u.date} · ${u.size}`} isNew
                  onGenerate={onGenerateQuiz} onDelete={() => setPending({ kind: "upload", id: u.id, title: u.title })} />
              ))}
              {BUILT_IN.filter(([, t]) => !deleted.includes(t)).map(([c, t, d]) => (
                <FlashCard key={t + d} color={c} title={t} date={d} onGenerate={onGenerateQuiz} onDelete={(title) => setPending({ kind: "builtin", title })} />
              ))}
            </div>
          </section>

          <section data-panel>
            <h2 style={sectionLabel}>My tasks</h2>
            <div style={panel}>
              {tasks.slice(0, 5).map((t) => <TaskRow key={t.id} task={t} onToggle={toggle} onStar={starT} />)}
              <div onClick={() => onNav("Tasks")} style={{ padding: "12px 4px 4px", font: "var(--text-small)", fontWeight: 700, color: "var(--asu-maroon)", cursor: "pointer" }}>View all tasks →</div>
            </div>
          </section>

          <section data-panel>
            <h2 style={sectionLabel}>My summaries</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 16 }}>
              <div onClick={() => onOpenSummary(1)} style={{ ...noteCard, cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", font: "var(--text-small)", color: "var(--gray-3)" }}><span>4/14/2025</span><i className="fa-solid fa-ellipsis" aria-hidden="true"></i></div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--gray-1)" }}>GR00T N1 — open foundation model for humanoid robots</div>
                <p style={{ font: "var(--text-small)", color: "var(--gray-2)", margin: 0, lineHeight: 1.6 }}>General-purpose robots require both a versatile body and an intelligent mind. NVIDIA's dual-system architecture pairs a vision-language planner with…</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={chip()}>Robotics</span>
                  <span style={chip()}>Whitepaper</span>
                </div>
              </div>
              <div onClick={() => onOpenSummary(2)} style={{ ...noteCard, cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", font: "var(--text-small)", color: "var(--gray-3)" }}><span>10/11/2024</span><i className="fa-solid fa-ellipsis" aria-hidden="true"></i></div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--gray-1)" }}>Electromagnetic induction — key terms</div>
                <p style={{ font: "var(--text-small)", color: "var(--gray-2)", margin: 0, lineHeight: 1.6 }}>Magnetic flux, Faraday's law, Lenz's law, and self-inductance, with worked examples for each and the three formulas most likely to appear…</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={chip()}>Reviewed</span>
                  <span style={chip()}>Physics</span>
                </div>
              </div>
            </div>
          </section>

          <section data-panel>
            <h2 style={sectionLabel}>Recent activity</h2>
            <div style={panel}>
              {[["MH", "Maya Hayes", "Shared Design challenges quiz", "27 Apr"],
                ["CM", "Cassie Melendez", "Scored 92% on Thermodynamics", "27 Apr"],
                ["RS", "Ronny Schultz", "Added notes to Electromagnet", "26 Apr"],
                ["AF", "Amanda Finnegan", "Created study group: Physics II", "26 Apr"],
                ["RH", "Rob Houghton", "Summarized GR00T whitepaper", "25 Apr"]].map(([ini, name, act, date]) => (
                <div data-act key={name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 4px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                  <Avatar initials={ini} size={34} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--gray-1)" }}>{name}</div>
                    <div style={{ font: "var(--text-small)", color: "var(--gray-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{act}</div>
                  </div>
                  <span style={{ font: "var(--text-small)", color: "var(--gray-3)" }}>{date}</span>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

/* ================= Tasks (pipeline board) ================= */
function TasksScreen({ onNav, tasks, onToggle, onStar, onMove, onOpenSummary }) {
  const rootRef = React.useRef(null);
  const stages = [
    { key: "todo", label: "To do" },
    { key: "doing", label: "In progress" },
    { key: "done", label: "Done" },
  ];
  React.useEffect(() => {
    const q = (s) => rootRef.current.querySelectorAll(s);
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.fromTo(q("[data-side]"), { x: -10, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, stagger: 0.035 })
      .fromTo(q("[data-greet]"), { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, "-=0.25")
      .fromTo(q("[data-metric]"), { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.05 }, "-=0.3")
      .fromTo(q("[data-col]"), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.07 }, "-=0.25")
      .fromTo(q("[data-tcard]"), { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, stagger: 0.04 }, "-=0.35");
  }, []);

  const label = { fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, letterSpacing: "0.02em", color: "var(--gray-3)", margin: 0 };
  const surface = { background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 16, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" };
  const done = tasks.filter((t) => t.stage === "done").length;

  return (
    <div ref={rootRef} style={{ minHeight: "100vh", padding: 24, background: "#F5F5F7", fontFamily: "var(--font-sans)" }}>
      <div style={{ display: "flex", background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.05)", minHeight: "calc(100vh - 48px)" }}>
        <WorkspaceSidebar active="Tasks" onNav={onNav} />

        <main style={{ flex: 1, padding: "36px 40px 44px", background: "#FBFBFD", overflow: "auto", display: "flex", flexDirection: "column", gap: 26 }}>
          <div data-greet style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
            <div>
              <h1 style={{ fontFamily: "var(--font-sans)", fontSize: 34, fontWeight: 700, letterSpacing: "-0.025em", color: "var(--gray-1)", margin: 0 }}>Tasks</h1>
              <p style={{ font: "var(--text-body)", color: "var(--gray-3)", margin: "6px 0 0" }}>Your study pipeline — each task links back to the quiz or summary it came from.</p>
            </div>
            <div style={{ width: 150 }}><Button variant="secondary" icon="fa-solid fa-plus">New task</Button></div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 14 }}>
            {[["Open", tasks.filter((t) => t.stage !== "done").length], ["In progress", tasks.filter((t) => t.stage === "doing").length], ["Completed", done], ["Completion", Math.round((done / tasks.length) * 100) + "%"]].map(([k, v]) => (
              <div data-metric key={k} style={{ ...surface, padding: "16px 18px" }}>
                <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--gray-1)" }}>{v}</div>
                <div style={{ font: "var(--text-small)", color: "var(--gray-3)", marginTop: 2 }}>{k}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 18, alignItems: "start" }}>
            {stages.map((st, si) => {
              const items = tasks.filter((t) => t.stage === st.key);
              return (
                <section data-col key={st.key} style={{ background: "rgba(0,0,0,0.025)", borderRadius: 16, padding: 14, minHeight: 220 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, padding: "0 4px" }}>
                    <h2 style={label}>{st.label}</h2>
                    <span style={{ font: "var(--text-small)", color: "var(--gray-3)" }}>{items.length}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {items.map((t) => (
                      <div data-tcard key={t.id}
                        onMouseEnter={(e) => gsap.to(e.currentTarget, { y: -3, scale: 1.01, boxShadow: "0 10px 26px rgba(0,0,0,0.08)", duration: 0.25 })}
                        onMouseLeave={(e) => gsap.to(e.currentTarget, { y: 0, scale: 1, boxShadow: "0 1px 2px rgba(0,0,0,0.04)", duration: 0.3 })}
                        ref={(el) => { if (el && !el.dataset.seen) { el.dataset.seen = "1"; gsap.fromTo(el, { x: 18, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }); } }}
                        style={{ ...surface, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                          <span style={{ width: 7, height: 7, borderRadius: "50%", background: t.dot, marginTop: 6, flexShrink: 0 }}></span>
                          <div style={{ flex: 1, minWidth: 0, fontSize: 14.5, fontWeight: 700, letterSpacing: "-0.01em", color: t.stage === "done" ? "var(--gray-3)" : "var(--gray-1)", textDecoration: t.stage === "done" ? "line-through" : "none", lineHeight: 1.4 }}>{t.title}</div>
                          <span onClick={() => onStar(t.id)} style={{ cursor: "pointer", color: t.starred ? "var(--asu-maroon)" : "rgba(0,0,0,0.18)", fontSize: 12 }}>
                            <i className={t.starred ? "fa-solid fa-star" : "fa-regular fa-star"} aria-hidden="true"></i>
                          </span>
                        </div>
                        {t.linkTitle ? (
                          <div onClick={() => onOpenSummary(t.linkId)}
                            style={{ display: "flex", alignItems: "center", gap: 7, font: "var(--text-small)", color: "var(--asu-maroon)", cursor: "pointer", background: "rgba(140,29,64,0.06)", padding: "6px 9px", borderRadius: 8 }}>
                            <i className="fa-regular fa-file-lines" aria-hidden="true" style={{ fontSize: 11 }}></i>
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.linkTitle}</span>
                          </div>
                        ) : null}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ font: "var(--text-small)", color: "var(--gray-3)" }}>{t.meta}</span>
                          <span style={{ display: "flex", gap: 10, color: "var(--gray-3)", fontSize: 12 }}>
                            {si > 0 ? <i className="fa-solid fa-arrow-left" aria-hidden="true" onClick={() => onMove(t.id, stages[si - 1].key)} style={{ cursor: "pointer" }}></i> : null}
                            {si < stages.length - 1 ? <i className="fa-solid fa-arrow-right" aria-hidden="true" onClick={() => onMove(t.id, stages[si + 1].key)} style={{ cursor: "pointer" }}></i> : null}
                          </span>
                        </div>
                      </div>
                    ))}
                    {items.length === 0 ? <div style={{ padding: "18px 6px", font: "var(--text-small)", color: "var(--gray-3)", textAlign: "center" }}>Nothing here</div> : null}
                  </div>
                </section>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ================= Quizzes (generator) ================= */
const SOURCES = [
  "Electromagnet — induction set", "Thermodynamics Ch. 3", "GR00T whitepaper recall",
  "Matrix transformations, eigenvalues", "Reaction mechanisms", "Faraday's law flashcards",
];
const MCQ_BANK = [
  { q: "A conducting loop moves out of a uniform magnetic field. What happens to the induced current?", opts: ["It flows to oppose the decreasing flux", "It flows to reinforce the decreasing flux", "No current is induced", "It reverses direction twice", "It grows without bound"], correct: 0 },
  { q: "Faraday's law relates induced EMF to which quantity?", opts: ["Rate of change of magnetic flux", "Magnetic flux density", "Total charge enclosed", "Electric field divergence", "Current density"], correct: 0 },
  { q: "Self-inductance L of a coil is defined as:", opts: ["L = NΦ/I", "L = Φ/B", "L = BA cosθ", "L = ε/I", "L = I/Φ"], correct: 0 },
  { q: "Lenz's law is a direct consequence of:", opts: ["Conservation of energy", "Conservation of charge", "Newton's third law", "Gauss's law", "Ampere's law"], correct: 0 },
  { q: "Magnetic flux through a flat loop is largest when the field is:", opts: ["Perpendicular to the loop's plane", "Parallel to the loop's plane", "At 45° to the normal", "Zero at the centre", "Rotating rapidly"], correct: 0 },
  { q: "Entropy of an isolated system undergoing an irreversible process:", opts: ["Increases", "Decreases", "Stays constant", "Oscillates", "Becomes undefined"], correct: 0 },
  { q: "Carnot efficiency between reservoirs at T_h and T_c equals:", opts: ["1 − T_c/T_h", "T_c/T_h", "T_h/T_c − 1", "1 − T_h/T_c", "T_h − T_c"], correct: 0 },
  { q: "Which statement about a reversible process is true?", opts: ["Total entropy change of system plus surroundings is zero", "It always releases heat", "It cannot do work", "It violates the second law", "It requires a vacuum"], correct: 0 },
  { q: "An eigenvector v of matrix A satisfies:", opts: ["Av = λv for some scalar λ", "Av = 0 always", "Aᵀv = v", "vᵀAv = 1", "det(v) = λ"], correct: 0 },
  { q: "Eigenvalues of A are found by solving:", opts: ["det(A − λI) = 0", "tr(A) = λ", "AᵀA = λI", "rank(A) = λ", "A⁻¹ = λI"], correct: 0 },
  { q: "A matrix is diagonalizable when it has:", opts: ["A full set of linearly independent eigenvectors", "All positive entries", "Determinant equal to 1", "Only real eigenvalues", "Zero trace"], correct: 0 },
  { q: "In GR00T N1, System 2 is responsible for:", opts: ["Vision-language reasoning about the instruction", "Low-level motor torque control", "Battery management", "Camera calibration", "Network routing"], correct: 0 },
  { q: "GR00T N1's System 1 generates actions using:", opts: ["A diffusion transformer", "A decision tree", "A Kalman filter", "A rule-based planner", "Linear regression"], correct: 0 },
  { q: "GR00T N1 was trained on which data mixture?", opts: ["Real robot trajectories, human video, and synthetic data", "Only simulation rollouts", "Only teleoperation logs", "Only text corpora", "Only depth scans"], correct: 0 },
  { q: "An SN2 reaction proceeds fastest with which substrate?", opts: ["Primary alkyl halide", "Tertiary alkyl halide", "Neopentyl halide", "Aryl halide", "Vinyl halide"], correct: 0 },
  { q: "SN1 reactions racemize because the intermediate is:", opts: ["A planar carbocation", "A tetrahedral anion", "A radical pair", "A cyclic ether", "A metal complex"], correct: 0 },
  { q: "E2 elimination requires the leaving group and β-hydrogen to be:", opts: ["Anti-periplanar", "Syn-clinal", "Cis-fused", "Axially equatorial", "Randomly oriented"], correct: 0 },
  { q: "Induced EMF doubles if the rate of flux change is:", opts: ["Doubled", "Halved", "Squared", "Unchanged", "Reversed"], correct: 0 },
  { q: "The unit of magnetic flux is the:", opts: ["Weber", "Tesla", "Henry", "Farad", "Siemens"], correct: 0 },
  { q: "A transformer works only with alternating current because:", opts: ["A steady current produces no changing flux", "DC melts the core", "AC has higher voltage", "Copper conducts AC only", "Cores resonate at DC"], correct: 0 },
];
const TF_BANK = [
  ["Lenz's law follows from conservation of energy.", true],
  ["A constant magnetic flux induces a steady EMF.", false],
  ["Entropy can decrease locally if it increases elsewhere.", true],
  ["A Carnot engine can reach 100% efficiency with a finite cold reservoir.", false],
  ["Every square matrix is diagonalizable.", false],
  ["Eigenvalues can be complex even for real matrices.", true],
  ["GR00T N1 uses a diffusion transformer for action generation.", true],
  ["SN2 reactions invert stereochemistry at the reaction centre.", true],
  ["Tertiary substrates favour SN2 over SN1.", false],
  ["The weber is the SI unit of magnetic flux.", true],
  ["Transformers operate on direct current.", false],
  ["Self-inductance depends on coil geometry.", true],
  ["An irreversible process leaves total entropy unchanged.", false],
  ["Eigenvectors for distinct eigenvalues are linearly independent.", true],
  ["E2 elimination requires an anti-periplanar geometry.", true],
  ["Magnetic flux is maximal when the field lies in the loop's plane.", false],
  ["GR00T N1 was trained partly on human video.", true],
  ["SN1 reactions proceed through a planar carbocation.", true],
  ["Doubling the rate of flux change halves the induced EMF.", false],
  ["The second law forbids heat flowing spontaneously from cold to hot.", true],
];
const SA_BANK = [
  ["State Faraday's law in one sentence.", "The induced EMF equals the negative rate of change of magnetic flux: ε = −N(dΦ/dt)."],
  ["Define magnetic flux and give its unit.", "Φ = B·A·cosθ, measured in webers (Wb)."],
  ["Why does Lenz's law carry a minus sign?", "Because the induced current opposes the change producing it — required by conservation of energy."],
  ["Write the expression for self-inductance.", "L = NΦ/I, the flux linkage per unit current."],
  ["What does entropy measure?", "The number of microstates consistent with a macrostate — the system's disorder."],
  ["Give the Carnot efficiency formula.", "η = 1 − T_c/T_h, with temperatures in kelvin."],
  ["Distinguish reversible from irreversible processes.", "Reversible processes leave total entropy unchanged; irreversible ones increase it."],
  ["Define an eigenvector.", "A nonzero vector v with Av = λv for a scalar eigenvalue λ."],
  ["How do you find eigenvalues of A?", "Solve the characteristic equation det(A − λI) = 0."],
  ["When is a matrix diagonalizable?", "When it has a full set of linearly independent eigenvectors."],
  ["Describe GR00T N1's dual-system architecture.", "System 2 is a vision-language reasoning module; System 1 is a diffusion transformer producing real-time actions."],
  ["What data was GR00T N1 trained on?", "Real robot trajectories, human videos, and synthetic rollouts."],
  ["Which substrate favours SN2 and why?", "Primary alkyl halides — least steric hindrance for backside attack."],
  ["Why does SN1 racemize?", "The planar carbocation intermediate can be attacked from either face."],
  ["State the geometric requirement for E2.", "The leaving group and β-hydrogen must be anti-periplanar."],
  ["Why can't transformers run on DC?", "Steady current produces no changing flux, so no EMF is induced in the secondary."],
  ["How does flux vary with loop orientation?", "It is maximal when the field is perpendicular to the loop's plane, zero when parallel."],
  ["What happens to EMF if flux change doubles?", "The induced EMF doubles — the relationship is linear."],
  ["State the second law in words.", "Heat does not spontaneously flow from a colder body to a hotter one; total entropy never decreases."],
  ["Name the SI unit of inductance.", "The henry (H)."],
];

function buildQuestions(count, format) {
  const n = parseInt(count, 10);
  const out = [];
  for (let i = 0; i < n; i++) {
    if (format === "True / false") {
      const [q, ans] = TF_BANK[i % TF_BANK.length];
      out.push({ kind: "tf", q, opts: ["True", "False"], correct: ans ? 0 : 1 });
    } else if (format === "Short answer") {
      const [q, answer] = SA_BANK[i % SA_BANK.length];
      out.push({ kind: "sa", q, answer });
    } else {
      const item = MCQ_BANK[i % MCQ_BANK.length];
      out.push({ kind: "mcq", q: item.q, opts: item.opts, correct: item.correct });
    }
  }
  return out;
}

function OptionRow({ label, options, value, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, padding: "16px 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
      <span style={{ fontFamily: "var(--font-sans)", fontSize: 15, letterSpacing: "-0.01em", color: "var(--gray-1)" }}>{label}</span>
      <div style={{ display: "flex", gap: 6, background: "rgba(0,0,0,0.04)", padding: 4, borderRadius: 10, flexShrink: 0 }}>
        {options.map((o) => (
          <button key={o} onClick={() => onChange(o)}
            style={{ border: "none", cursor: "pointer", borderRadius: 7, padding: "6px 13px", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: value === o ? 700 : 400,
              background: value === o ? "#fff" : "transparent", color: value === o ? "var(--gray-1)" : "var(--gray-2)",
              boxShadow: value === o ? "0 1px 2px rgba(0,0,0,0.08)" : "none", transition: "all .25s cubic-bezier(.4,0,.2,1)" }}>{o}</button>
        ))}
      </div>
    </div>
  );
}

function QuizzesScreen({ onNav, presetSource }) {
  const rootRef = React.useRef(null);
  const [step, setStep] = React.useState("config"); // config | generating | ready
  const [source, setSource] = React.useState(presetSource || SOURCES[0]);
  const [count, setCount] = React.useState("8");
  const [format, setFormat] = React.useState("Multiple choice");
  const [choices, setChoices] = React.useState("4");
  const [difficulty, setDifficulty] = React.useState("Medium");
  const [answers, setAnswers] = React.useState({});
  const [shown, setShown] = React.useState({});
  const questions = React.useMemo(() => buildQuestions(count, format), [count, format]);

  React.useEffect(() => {
    const q = (s) => rootRef.current.querySelectorAll(s);
    gsap.timeline({ defaults: { ease: "power2.out" } })
      .fromTo(q("[data-side]"), { x: -10, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, stagger: 0.035 })
      .fromTo(q("[data-greet]"), { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, "-=0.25")
      .fromTo(q("[data-block]"), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.07 }, "-=0.25");
  }, []);
  React.useEffect(() => {
    if (step === "generating") { const t = setTimeout(() => setStep("ready"), 1900); return () => clearTimeout(t); }
    if (step === "ready" && rootRef.current) {
      gsap.fromTo(rootRef.current.querySelectorAll("[data-q]"), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.08, ease: "power2.out" });
    }
  }, [step]);

  const surface = { background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 16, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" };
  const label = { fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, letterSpacing: "0.02em", color: "var(--gray-3)", margin: "0 0 14px" };

  return (
    <div ref={rootRef} style={{ minHeight: "100vh", padding: 24, background: "#F5F5F7", fontFamily: "var(--font-sans)" }}>
      <div style={{ display: "flex", background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.05)", minHeight: "calc(100vh - 48px)" }}>
        <WorkspaceSidebar active="Quizzes" onNav={onNav} />

        <main style={{ flex: 1, padding: "36px 40px 44px", background: "#FBFBFD", overflow: "auto", display: "flex", flexDirection: "column", gap: 26 }}>
          <div data-greet>
            <h1 style={{ fontFamily: "var(--font-sans)", fontSize: 34, fontWeight: 700, letterSpacing: "-0.025em", color: "var(--gray-1)", margin: 0 }}>Generate a quiz</h1>
            <p style={{ font: "var(--text-body)", color: "var(--gray-3)", margin: "6px 0 0" }}>Tell QuizAI what you want and it writes the questions from your material.</p>
          </div>

          {step === "config" ? (
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.25fr) minmax(0,0.75fr)", gap: 22, alignItems: "start" }}>
              <div data-block style={{ ...surface, padding: "8px 26px 26px" }}>
                <div style={{ padding: "18px 0 4px", fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--gray-3)" }}>Source material</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "10px 0 18px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                  {SOURCES.map((s) => (
                    <button key={s} onClick={() => setSource(s)}
                      style={{ border: source === s ? "1px solid rgba(140,29,64,0.4)" : "1px solid rgba(0,0,0,0.09)", cursor: "pointer", borderRadius: 9, padding: "8px 13px", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: source === s ? 700 : 400,
                        background: source === s ? "rgba(140,29,64,0.06)" : "#fff", color: source === s ? "var(--asu-maroon)" : "var(--gray-2)", transition: "all .25s cubic-bezier(.4,0,.2,1)" }}>{s}</button>
                  ))}
                </div>
                <OptionRow label="How many questions do you want?" options={["4", "8", "10", "15", "20"]} value={count} onChange={setCount} />
                <OptionRow label="What kind of questions?" options={["Multiple choice", "True / false", "Short answer"]} value={format} onChange={setFormat} />
                {format === "Multiple choice" ? <OptionRow label="How many choices per question?" options={["2", "3", "4", "5"]} value={choices} onChange={setChoices} /> : null}
                <OptionRow label="Difficulty" options={["Easy", "Medium", "Hard"]} value={difficulty} onChange={setDifficulty} />
                <div style={{ width: 210, marginTop: 24 }}>
                  <Button variant="primary" icon="fa-solid fa-bolt" onClick={() => setStep("generating")}>Generate {count} questions</Button>
                </div>
              </div>

              <div data-block style={{ ...surface, padding: 24 }}>
                <h2 style={label}>Summary</h2>
                {[["Source", source], ["Questions", count], ["Format", format], ...(format === "Multiple choice" ? [["Choices", choices + " per question"]] : []), ["Difficulty", difficulty], ["Est. time", Math.round(parseInt(count, 10) * 1.2) + " min"]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 14, padding: "11px 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                    <span style={{ font: "var(--text-small)", color: "var(--gray-3)" }}>{k}</span>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "var(--gray-1)", textAlign: "right" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {step === "generating" ? (
            <div data-block style={{ ...surface, padding: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, position: "relative", overflow: "hidden", minHeight: 320 }}>
              <NeuralCanvas />
              <i className="fa-solid fa-brain fa-beat-fade" aria-hidden="true" style={{ fontSize: 34, color: "var(--asu-maroon)", position: "relative" }}></i>
              <div style={{ position: "relative", fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--gray-1)" }}>Writing {count} {format.toLowerCase()} questions…</div>
              <div style={{ position: "relative", font: "var(--text-body)", color: "var(--gray-3)" }}>Reading {source}</div>
            </div>
          ) : null}

          {step === "ready" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                <h2 style={{ ...label, margin: 0 }}>{questions.length} {format.toLowerCase()} questions · {source}</h2>
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ width: 130 }}><Button variant="secondary" size="sm" icon="fa-solid fa-rotate" onClick={() => { setAnswers({}); setShown({}); setStep("config"); }}>Regenerate</Button></div>
                  <div style={{ width: 150 }}><Button variant="primary" size="sm" onClick={() => onNav("Tasks")}>Save to tasks</Button></div>
                </div>
              </div>
              {questions.map((item, qi) => (
                <div data-q key={qi} style={{ ...surface, padding: 22 }}>
                  <div style={{ display: "flex", gap: 12 }}>
                    <span style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(140,29,64,0.08)", color: "var(--asu-maroon)", fontSize: 12, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{qi + 1}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--gray-1)", lineHeight: 1.4 }}>{item.q}</div>
                      {item.kind === "sa" ? (
                        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                          <input placeholder="Type your answer…"
                            style={{ border: "1px solid rgba(0,0,0,0.09)", borderRadius: 11, padding: "12px 14px", fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--gray-1)", outline: "none", background: "#fff" }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(140,29,64,0.45)"; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.09)"; }} />
                          {shown[qi] ? (
                            <div style={{ background: "rgba(76,122,20,0.07)", border: "1px solid rgba(76,122,20,0.4)", borderRadius: 11, padding: "12px 14px", font: "var(--text-body)", color: "var(--success)", lineHeight: 1.6 }}>{item.answer}</div>
                          ) : (
                            <button onClick={() => setShown((s) => ({ ...s, [qi]: true }))}
                              style={{ alignSelf: "flex-start", border: "none", background: "rgba(140,29,64,0.06)", color: "var(--asu-maroon)", borderRadius: 9, padding: "8px 14px", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Reveal answer</button>
                          )}
                        </div>
                      ) : (
                        <div style={{ display: "grid", gridTemplateColumns: item.kind === "tf" ? "repeat(2,minmax(0,1fr))" : "repeat(2,minmax(0,1fr))", gap: 10, marginTop: 14 }}>
                          {(item.kind === "tf" ? item.opts : item.opts.slice(0, parseInt(choices, 10))).map((o, oi) => {
                            const picked = answers[qi] === oi;
                            const revealed = answers[qi] !== undefined;
                            const right = oi === item.correct;
                            return (
                              <button key={oi} onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                                style={{ textAlign: "left", cursor: "pointer", borderRadius: 11, padding: "12px 14px", fontFamily: "var(--font-sans)", fontSize: 14, transition: "all .25s cubic-bezier(.4,0,.2,1)",
                                  border: revealed && right ? "1px solid rgba(76,122,20,0.5)" : picked ? "1px solid rgba(198,40,40,0.45)" : "1px solid rgba(0,0,0,0.09)",
                                  background: revealed && right ? "rgba(76,122,20,0.07)" : picked ? "rgba(198,40,40,0.05)" : "#fff",
                                  color: revealed && right ? "var(--success)" : "var(--gray-1)" }}>
                                {o}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}

/* ================= Profile ================= */
function ProfileScreen({ onNav, tasks, uploads }) {
  const rootRef = React.useRef(null);
  const [prefs, setPrefs] = React.useState({ style: "Visual", difficulty: "Medium", reminders: "On", format: "Multiple choice" });
  React.useEffect(() => {
    const q = (s) => rootRef.current.querySelectorAll(s);
    gsap.timeline({ defaults: { ease: "power2.out" } })
      .fromTo(q("[data-side]"), { x: -10, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, stagger: 0.035 })
      .fromTo(q("[data-hero2]"), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.25")
      .fromTo(q("[data-metric]"), { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.05 }, "-=0.3")
      .fromTo(q("[data-block]"), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.07 }, "-=0.25");
  }, []);

  const surface = { background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 16, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" };
  const label = { fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, letterSpacing: "0.02em", color: "var(--gray-3)", margin: "0 0 14px" };
  const done = tasks.filter((t) => t.stage === "done").length;

  return (
    <div ref={rootRef} style={{ minHeight: "100vh", padding: 24, background: "#F5F5F7", fontFamily: "var(--font-sans)" }}>
      <div style={{ display: "flex", background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.05)", minHeight: "calc(100vh - 48px)" }}>
        <WorkspaceSidebar active="Profile" onNav={onNav} />

        <main style={{ flex: 1, padding: "36px 40px 44px", background: "#FBFBFD", overflow: "auto", display: "flex", flexDirection: "column", gap: 26 }}>
          <div data-hero2 style={{ ...surface, padding: 28, display: "flex", alignItems: "center", gap: 20 }}>
            <Avatar initials="LT" size={72} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{ fontFamily: "var(--font-sans)", fontSize: 30, fontWeight: 700, letterSpacing: "-0.025em", color: "var(--gray-1)", margin: 0 }}>Lakshman Thota</h1>
              <div style={{ font: "var(--text-body)", color: "var(--gray-3)", marginTop: 4 }}>lthota@asu.edu · Arizona State University</div>
              <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                {["Physics II", "Linear Algebra", "Robotics"].map((c) => (
                  <span key={c} style={{ background: "rgba(0,0,0,0.045)", color: "var(--gray-2)", fontSize: 12, padding: "5px 11px", borderRadius: 7 }}>{c}</span>
                ))}
              </div>
            </div>
            <div style={{ width: 140, flexShrink: 0 }}><Button variant="secondary" size="sm" icon="fa-solid fa-pen">Edit profile</Button></div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 14 }}>
            {[["Flashcards", 6 + uploads.length], ["Tasks completed", done], ["Summaries", SUMMARIES.length], ["Day streak", 12]].map(([k, v]) => (
              <div data-metric key={k} style={{ ...surface, padding: "16px 18px" }}>
                <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--gray-1)" }}>{v}</div>
                <div style={{ font: "var(--text-small)", color: "var(--gray-3)", marginTop: 2 }}>{k}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(0,0.9fr)", gap: 22, alignItems: "start" }}>
            <section data-block>
              <h2 style={label}>Study preferences</h2>
              <div style={{ ...surface, padding: "8px 22px 22px" }}>
                <OptionRow label="Preferred learning style" options={["Visual", "Audio", "Text"]} value={prefs.style} onChange={(v) => setPrefs({ ...prefs, style: v })} />
                <OptionRow label="Default quiz format" options={["Multiple choice", "True / false", "Short answer"]} value={prefs.format} onChange={(v) => setPrefs({ ...prefs, format: v })} />
                <OptionRow label="Default difficulty" options={["Easy", "Medium", "Hard"]} value={prefs.difficulty} onChange={(v) => setPrefs({ ...prefs, difficulty: v })} />
                <OptionRow label="Study reminders" options={["On", "Off"]} value={prefs.reminders} onChange={(v) => setPrefs({ ...prefs, reminders: v })} />
              </div>
            </section>

            <section data-block>
              <h2 style={label}>Account</h2>
              <div style={{ ...surface, padding: "6px 22px 14px" }}>
                {[["fa-regular fa-bell", "Notifications"], ["fa-solid fa-lock", "Password and security"], ["fa-solid fa-cloud-arrow-down", "Export my data"], ["fa-regular fa-circle-question", "Help and support"]].map(([icon, text]) => (
                  <div key={text}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.025)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 8px", borderBottom: "1px solid rgba(0,0,0,0.06)", cursor: "pointer", borderRadius: 8, transition: "background .2s" }}>
                    <i className={icon} aria-hidden="true" style={{ color: "var(--gray-3)", width: 16 }}></i>
                    <span style={{ flex: 1, fontSize: 15, letterSpacing: "-0.01em", color: "var(--gray-1)" }}>{text}</span>
                    <i className="fa-solid fa-chevron-right" aria-hidden="true" style={{ color: "var(--gray-4)", fontSize: 11 }}></i>
                  </div>
                ))}
                <div onClick={() => onNav("SignOut")}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 8px", cursor: "pointer", color: "var(--danger)" }}>
                  <i className="fa-solid fa-arrow-right-from-bracket" aria-hidden="true" style={{ width: 16 }}></i>
                  <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em" }}>Sign out</span>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

const SUMMARIES = [
  { id: 1, title: "GR00T N1 — open foundation model for humanoid robots", source: "GR00T_1_Whitepaper.pdf", date: "14 Apr 2025", pages: 42, read: 12, subject: "Robotics", dot: DOT.c, starred: true,
    excerpt: "NVIDIA's dual-system architecture pairs a vision-language planner with a diffusion-transformer action head trained on human video, synthetic rollouts, and real robot data.",
    sections: [["Abstract", "General-purpose robots require both a versatile body and an intelligent mind. GR00T N1 is an open foundation model trained on a heterogeneous mixture of real-robot trajectories, human videos, and synthetic data."], ["Architecture", "System 2 is a vision-language module that reasons about the environment and the instruction; System 1 is a diffusion transformer that generates fluid motor actions in real time."], ["Results", "Outperforms state-of-the-art imitation-learning baselines across standard simulation benchmarks and generalizes to multi-step language-conditioned tasks on a real humanoid."]] },
  { id: 2, title: "Electromagnetic induction — key terms and formulas", source: "Electromagnet.pdf", date: "11 Oct 2024", pages: 18, read: 18, subject: "Physics", dot: DOT.a,
    excerpt: "Magnetic flux, Faraday's law, Lenz's law and self-inductance, with worked examples and the three formulas most likely to appear on the exam.",
    sections: [["Core idea", "A changing magnetic flux through a circuit induces an electromotive force proportional to the rate of change of that flux."], ["Formulas", "Φ = B·A·cosθ ·· ε = −N(dΦ/dt) ·· L = NΦ/I"], ["Common mistakes", "Forgetting the minus sign in Lenz's law and mixing up flux with flux density."]] },
  { id: 3, title: "Thermodynamics Ch. 3 — entropy and the second law", source: "Thermodynamics_Ch3.pdf", date: "28 Sep 2024", pages: 26, read: 20, subject: "Physics", dot: DOT.b,
    excerpt: "Reversible vs. irreversible processes, entropy as a state function, and how the second law constrains the direction of spontaneous change.",
    sections: [["Abstract", "Entropy quantifies the number of microstates consistent with a macrostate; the second law states it never decreases in an isolated system."], ["Worked example", "Carnot efficiency η = 1 − T_c/T_h sets the ceiling for any heat engine operating between two reservoirs."]] },
  { id: 4, title: "Matrix transformations and eigenvalues", source: "LinAlg_Week6.pdf", date: "2 Mar 2025", pages: 31, read: 9, subject: "Mathematics", dot: DOT.d,
    excerpt: "How linear maps stretch and rotate space, why eigenvectors are the directions that survive a transformation unchanged, and how to diagonalize.",
    sections: [["Abstract", "An eigenvector of A is a nonzero v with Av = λv; the eigenvalue λ records how much that direction is scaled."], ["Method", "Solve det(A − λI) = 0 for λ, then find the null space of (A − λI) for each eigenvalue."]] },
  { id: 5, title: "Reaction mechanisms — substitution and elimination", source: "OChem_Unit4.pdf", date: "19 Feb 2025", pages: 22, read: 22, subject: "Chemistry", dot: DOT.e,
    excerpt: "SN1 vs. SN2 vs. E1 vs. E2 — what the substrate, nucleophile, solvent, and temperature each tell you about which pathway wins.",
    sections: [["Decision rule", "Tertiary substrate + weak nucleophile + polar protic solvent → SN1/E1. Primary substrate + strong nucleophile → SN2."], ["Stereochemistry", "SN2 inverts configuration (backside attack); SN1 racemizes through a planar carbocation."]] },
];

function SummariesScreen({ onNav, focusId, onGenerateQuiz }) {
  const rootRef = React.useRef(null);
  const paneRef = React.useRef(null);
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState("All");
  const [selected, setSelected] = React.useState(focusId || SUMMARIES[0].id);
  const filters = ["All", "Robotics", "Physics", "Mathematics", "Chemistry"];
  const list = SUMMARIES.filter((s) => (filter === "All" || s.subject === filter) && (s.title + s.source).toLowerCase().includes(query.toLowerCase()));
  const active = SUMMARIES.find((s) => s.id === selected) || list[0];

  React.useEffect(() => {
    const q = (s) => rootRef.current.querySelectorAll(s);
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.fromTo(q("[data-side]"), { x: -10, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, stagger: 0.035 })
      .fromTo(q("[data-greet]"), { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, "-=0.25")
      .fromTo(q("[data-metric]"), { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.05 }, "-=0.3")
      .fromTo(q("[data-item]"), { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.05 }, "-=0.25")
      .fromTo(q("[data-pane]"), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, "-=0.35");
  }, []);
  React.useEffect(() => {
    if (paneRef.current) gsap.fromTo(paneRef.current.querySelectorAll("[data-sec]"), { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, stagger: 0.06, ease: "power2.out" });
  }, [selected]);

  const label = { fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, letterSpacing: "0.02em", color: "var(--gray-3)", margin: "0 0 14px" };
  const surface = { background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 16, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" };

  return (
    <div ref={rootRef} style={{ minHeight: "100vh", padding: 24, background: "#F5F5F7", fontFamily: "var(--font-sans)" }}>
      <div style={{ display: "flex", background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.05)", minHeight: "calc(100vh - 48px)" }}>
        <WorkspaceSidebar active="Summaries" onNav={onNav} />

        <main style={{ flex: 1, padding: "36px 40px 44px", background: "#FBFBFD", overflow: "auto", display: "flex", flexDirection: "column", gap: 26 }}>
          <div data-greet style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
            <div>
              <h1 style={{ fontFamily: "var(--font-sans)", fontSize: 34, fontWeight: 700, letterSpacing: "-0.025em", color: "var(--gray-1)", margin: 0 }}>Summaries</h1>
              <p style={{ font: "var(--text-body)", color: "var(--gray-3)", margin: "6px 0 0" }}>Every document you've studied, in one place.</p>
            </div>
            <div style={{ width: 168 }}><Button variant="secondary" icon="fa-solid fa-plus">New summary</Button></div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 14 }}>
            {[["Summaries", SUMMARIES.length], ["Pages covered", SUMMARIES.reduce((a, s) => a + s.pages, 0)], ["Pages read", SUMMARIES.reduce((a, s) => a + s.read, 0)], ["Subjects", new Set(SUMMARIES.map((s) => s.subject)).size]].map(([k, v]) => (
              <div data-metric key={k} style={{ ...surface, padding: "16px 18px" }}>
                <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--gray-1)" }}>{v}</div>
                <div style={{ font: "var(--text-small)", color: "var(--gray-3)", marginTop: 2 }}>{k}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={{ ...surface, display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderRadius: 10, flex: "1 1 260px", maxWidth: 340 }}>
              <i className="fa-solid fa-magnifying-glass" aria-hidden="true" style={{ color: "var(--gray-3)", fontSize: 13 }}></i>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search summaries"
                style={{ border: "none", outline: "none", background: "transparent", fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--gray-1)", width: "100%" }} />
            </div>
            <div style={{ display: "flex", gap: 6, background: "rgba(0,0,0,0.04)", padding: 4, borderRadius: 10 }}>
              {filters.map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  style={{ border: "none", cursor: "pointer", borderRadius: 7, padding: "6px 12px", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: filter === f ? 700 : 400,
                    background: filter === f ? "#fff" : "transparent", color: filter === f ? "var(--gray-1)" : "var(--gray-2)",
                    boxShadow: filter === f ? "0 1px 2px rgba(0,0,0,0.08)" : "none", transition: "all .25s cubic-bezier(.4,0,.2,1)" }}>{f}</button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.15fr)", gap: 22, alignItems: "start" }}>
            <section>
              <h2 style={label}>{list.length} {list.length === 1 ? "summary" : "summaries"}</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {list.map((s) => {
                  const on = s.id === selected;
                  return (
                    <div data-item key={s.id} onClick={() => setSelected(s.id)}
                      onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = "rgba(0,0,0,0.02)"; }}
                      onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = "#fff"; }}
                      style={{ ...surface, padding: 16, cursor: "pointer", borderColor: on ? "rgba(140,29,64,0.35)" : "rgba(0,0,0,0.07)", boxShadow: on ? "0 4px 16px rgba(140,29,64,0.10)" : "0 1px 2px rgba(0,0,0,0.04)", transition: "border-color .25s, box-shadow .25s, background .25s" }}>
                      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot, marginTop: 6, flexShrink: 0 }}></span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--gray-1)", lineHeight: 1.35 }}>{s.title}</div>
                          <div style={{ font: "var(--text-small)", color: "var(--gray-3)", marginTop: 4 }}>{s.source} · {s.date} · {s.pages} pages</div>
                        </div>
                        {s.starred ? <i className="fa-solid fa-star" aria-hidden="true" style={{ color: "var(--asu-maroon)", fontSize: 12 }}></i> : null}
                      </div>
                      <div style={{ marginTop: 12, height: 3, borderRadius: 2, background: "rgba(0,0,0,0.07)", overflow: "hidden" }}>
                        <div style={{ width: `${Math.round((s.read / s.pages) * 100)}%`, height: "100%", background: "var(--asu-maroon)", borderRadius: 2, transition: "width .5s cubic-bezier(.4,0,.2,1)" }}></div>
                      </div>
                    </div>
                  );
                })}
                {list.length === 0 ? <div style={{ ...surface, padding: 24, textAlign: "center", font: "var(--text-body)", color: "var(--gray-3)" }}>No summaries match that search.</div> : null}
              </div>
            </section>

            <section data-pane style={{ position: "sticky", top: 0 }}>
              <h2 style={label}>Reading</h2>
              {active ? (
                <div ref={paneRef} style={{ ...surface, padding: 26 }}>
                  <div data-sec style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--gray-1)", lineHeight: 1.3 }}>{active.title}</div>
                      <div style={{ font: "var(--text-small)", color: "var(--gray-3)", marginTop: 6 }}>{active.source} · {active.date} · {active.read} of {active.pages} pages read</div>
                    </div>
                    <div style={{ display: "flex", gap: 14, color: "var(--gray-3)", fontSize: 13, flexShrink: 0 }}>
                      <i className="fa-solid fa-pen" aria-hidden="true" style={{ cursor: "pointer" }}></i>
                      <i className="fa-solid fa-rotate" aria-hidden="true" style={{ cursor: "pointer" }}></i>
                      <i className="fa-regular fa-trash-can" aria-hidden="true" style={{ cursor: "pointer" }}></i>
                    </div>
                  </div>
                  <p data-sec style={{ font: "var(--text-body)", color: "var(--gray-2)", lineHeight: 1.65, margin: "18px 0 0" }}>{active.excerpt}</p>
                  {active.sections.map(([h, body]) => (
                    <div data-sec key={h} style={{ marginTop: 20, paddingTop: 18, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--gray-3)", marginBottom: 8 }}>{h}</div>
                      <p style={{ font: "var(--text-body)", color: "var(--gray-1)", lineHeight: 1.65, margin: 0 }}>{body}</p>
                    </div>
                  ))}
                  <div data-sec style={{ display: "flex", gap: 10, marginTop: 24 }}>
                    <div style={{ width: 170 }}><Button variant="primary" size="sm" icon="fa-solid fa-bolt" onClick={() => onGenerateQuiz(active.title)}>Generate Quiz</Button></div>
                    <div style={{ width: 150 }}><Button variant="secondary" size="sm" icon="fa-regular fa-clone">Make flashcards</Button></div>
                  </div>
                </div>
              ) : null}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function ViewTransition({ viewKey, children }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    gsap.fromTo(ref.current, { opacity: 0, y: 14, scale: 0.994 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power2.out" });
  }, [viewKey]);
  return <div ref={ref} style={{ willChange: "transform, opacity" }}>{children}</div>;
}

function QuizAiLanding() {
  const [view, setView] = React.useState("landing");
  const [focusSummary, setFocusSummary] = React.useState(null);
  const [quizSource, setQuizSource] = React.useState(null);
  const [uploads, setUploads] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem("quizai.uploads") || "[]"); } catch (e) { return []; }
  });
  React.useEffect(() => {
    try { localStorage.setItem("quizai.uploads", JSON.stringify(uploads)); } catch (e) {}
  }, [uploads]);
  const addUpload = (item) => setUploads((u) => [item, ...u]);
  const removeUpload = (id) => setUploads((u) => u.filter((x) => x.id !== id));
  const [tasks, setTasks] = React.useState([
    { id: 1, title: "Review Faraday's law flashcards", meta: "3 hours left", stage: "doing", starred: true, dot: DOT.a, linkId: 2, linkTitle: "Electromagnetic induction — key terms" },
    { id: 2, title: "Retake Electromagnet quiz", meta: "1 hour overdue", stage: "done", done: true, dot: DOT.a, linkId: 2, linkTitle: "Electromagnetic induction — key terms" },
    { id: 3, title: "Summarize Thermodynamics Ch. 4", meta: "16 hours left", stage: "todo", dot: DOT.b, linkId: 3, linkTitle: "Thermodynamics Ch. 3 — entropy" },
    { id: 4, title: "Finish GR00T whitepaper notes", meta: "1 day left", stage: "doing", dot: DOT.c, linkId: 1, linkTitle: "GR00T N1 — humanoid foundation model" },
    { id: 5, title: "Sort weak topics by accuracy", meta: "1 day left", stage: "todo", dot: DOT.d },
    { id: 6, title: "Drill eigenvalue problems", meta: "2 days left", stage: "todo", dot: DOT.d, linkId: 4, linkTitle: "Matrix transformations and eigenvalues" },
  ]);

  const toggle = (id) => setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done, stage: t.done ? "doing" : "done" } : t)));
  const star = (id) => setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, starred: !t.starred } : t)));
  const move = (id, stage) => setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, stage, done: stage === "done" } : t)));
  const openSummary = (id) => { setFocusSummary(id); setView("summaries"); };
  const generateQuiz = (title) => { setQuizSource(title); setView("quizzes"); };

  const nav = (label) => {
    if (label === "Dashboard" || label === "Home") setView("dashboard");
    if (label === "Quizzes") { setQuizSource(null); setView("quizzes"); }
    if (label === "Summaries") { setFocusSummary(null); setView("summaries"); }
    if (label === "Tasks") setView("tasks");
    if (label === "Profile") setView("profile");
    if (label === "SignOut") setView("landing");
  };

  const screen = (() => {
    if (view === "landing") return <LandingScreen onSignIn={() => setView("login")} />;
    if (view === "login") return <LoginScreen onSignIn={() => setView("dashboard")} onBack={() => setView("landing")} />;
    if (view === "quizzes") return <QuizzesScreen key={quizSource || "new"} onNav={nav} presetSource={quizSource} />;
    if (view === "summaries") return <SummariesScreen key={focusSummary || "all"} onNav={nav} focusId={focusSummary} onGenerateQuiz={generateQuiz} />;
    if (view === "tasks") return <TasksScreen onNav={nav} tasks={tasks} onToggle={toggle} onStar={star} onMove={move} onOpenSummary={openSummary} />;
    if (view === "profile") return <ProfileScreen onNav={nav} tasks={tasks} uploads={uploads} />;
    return <DashboardScreen onNav={nav} tasks={tasks} onToggle={toggle} onStar={star} onOpenSummary={openSummary} onGenerateQuiz={generateQuiz} uploads={uploads} onAddUpload={addUpload} onRemoveUpload={removeUpload} />;
  })();
  return <ViewTransition viewKey={view}>{screen}</ViewTransition>;
}

window.QuizAiLanding = QuizAiLanding;
