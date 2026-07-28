const { useRef, useEffect } = React;
const { Button, Input, Logo } = window.QuizAIDesignSystem_ab923d;

function LoginScreen({ onSignIn }) {
  const cardRef = useRef(null);
  useEffect(() => {
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

window.LoginScreen = LoginScreen;
