const S = {
  ink: "#2b2b2b", soft: "#8a8a8a", line: "#c9c9c9", fill: "#eeeeee", accent: "#8C1D40",
  font: '"Architects Daughter", "Comic Sans MS", cursive',
};
const sketch = (extra = {}) => ({ border: `2px solid ${S.ink}`, borderRadius: 10, background: "#fff", ...extra });

function Bar({ w = "100%", h = 10, mt = 0, dark = false }) {
  return <div style={{ width: w, height: h, background: dark ? S.line : S.fill, borderRadius: 6, marginTop: mt }}></div>;
}
function Lines({ n = 3, widths = ["100%", "92%", "70%"], mt = 10 }) {
  return <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: mt }}>{Array.from({ length: n }).map((_, i) => <Bar key={i} w={widths[i % widths.length]} h={8} />)}</div>;
}
function Btn({ label, solid, w = "auto", small }) {
  return (
    <span style={{ display: "inline-flex", boxSizing: "border-box", alignItems: "center", justifyContent: "center", width: w, padding: small ? "6px 12px" : "9px 16px",
      border: `2px solid ${S.ink}`, borderRadius: 999, background: solid ? S.ink : "#fff", color: solid ? "#fff" : S.ink, fontFamily: S.font, fontSize: small ? 12 : 13 }}>{label}</span>
  );
}
function Label({ children, size = 13, mb = 0, muted }) {
  return <div style={{ fontFamily: S.font, fontSize: size, color: muted ? S.soft : S.ink, marginBottom: mb }}>{children}</div>;
}
function Box({ children, style, dashed, pad = 14 }) {
  return <div style={{ ...sketch({ borderStyle: dashed ? "dashed" : "solid", padding: pad }), ...style }}>{children}</div>;
}
function Cross({ h = 90, label = "image" }) {
  return (
    <div style={{ ...sketch({ height: h, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }) }}>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }} preserveAspectRatio="none" viewBox="0 0 100 100">
        <line x1="0" y1="0" x2="100" y2="100" stroke={S.line} strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <line x1="100" y1="0" x2="0" y2="100" stroke={S.line} strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
      <span style={{ fontFamily: S.font, fontSize: 12, color: S.soft, position: "relative", background: "#fff", padding: "0 6px" }}>{label}</span>
    </div>
  );
}
function Note({ children }) {
  return <div style={{ fontFamily: S.font, fontSize: 12, color: S.accent, marginTop: 8 }}>↳ {children}</div>;
}

/* ---------- Shell used by app screens ---------- */
function AppShell({ active, children }) {
  const items = ["Search", "Home", "Quizzes", "Summaries", "Tasks"];
  return (
    <div style={{ ...sketch({ display: "flex", overflow: "hidden", minHeight: 520 }) }}>
      <div style={{ width: 168, borderRight: `2px solid ${S.ink}`, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", border: `2px solid ${S.ink}` }}></div>
          <div style={{ flex: 1 }}><Bar w="100%" h={8} /><Bar w="70%" h={6} mt={5} /></div>
        </div>
        <Note>avatar → profile</Note>
        <Btn label="+ New Quiz" solid w="100%" small />
        {items.map((i) => (
          <div key={i} style={{ padding: "7px 9px", borderRadius: 8, background: i === active ? S.fill : "transparent", border: i === active ? `2px solid ${S.ink}` : "2px solid transparent" }}>
            <Label size={12}>{i}</Label>
          </div>
        ))}
        <div style={{ borderTop: `2px dashed ${S.line}`, margin: "6px 0" }}></div>
        <Label size={11} muted>Subjects</Label>
        {[1, 2, 3, 4].map((i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 7 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: S.line }}></span><Bar w="70%" h={7} /></div>)}
      </div>
      <div style={{ flex: 1, padding: 18, display: "flex", flexDirection: "column", gap: 16, background: "#fcfcfc" }}>{children}</div>
    </div>
  );
}
function Metrics({ n = 4 }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${n},1fr)`, gap: 10 }}>
      {Array.from({ length: n }).map((_, i) => (
        <Box key={i} pad={12}><Bar w="40%" h={16} dark /><Bar w="75%" h={7} mt={8} /></Box>
      ))}
    </div>
  );
}

/* ---------- Pages ---------- */
function WLanding() {
  return (
    <div style={{ ...sketch({ overflow: "hidden" }) }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 14, borderBottom: `2px solid ${S.ink}` }}>
        <Label size={15}>◑ QuizAI</Label>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}><Bar w={54} h={8} /><Bar w={70} h={8} /><Btn label="Sign In" small /><Btn label="Get Started" solid small /></div>
      </div>
      <div style={{ padding: "44px 30px", textAlign: "center", borderBottom: `2px dashed ${S.line}` }}>
        <Label size={12} muted mb={12}>( pill badge )</Label>
        <div style={{ fontFamily: S.font, fontSize: 30, lineHeight: 1.2, maxWidth: 520, margin: "0 auto" }}>Every document becomes a study session</div>
        <div style={{ maxWidth: 420, margin: "12px auto 0" }}><Lines n={2} widths={["100%", "80%"]} mt={0} /></div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 18 }}><Btn label="Sign In to QuizAI" solid /><Btn label="Create Account" /></div>
        <Note>animated neural-network canvas behind hero</Note>
      </div>
      <div style={{ padding: 22 }}>
        <Box dashed>
          <Label size={12} muted>chat demo — types itself on scroll</Label>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}><div style={{ ...sketch({ padding: "8px 14px", borderRadius: "14px 14px 4px 14px", width: 260 }) }}><Bar w="90%" h={8} /></div></div>
          <div style={{ ...sketch({ padding: 12, borderRadius: "14px 14px 14px 4px", width: 300, marginTop: 10 }) }}><Bar w="60%" h={8} dark /><Lines n={2} widths={["100%", "70%"]} mt={8} /><div style={{ display: "flex", gap: 6, marginTop: 10 }}>{[1, 2, 3].map((i) => <span key={i} style={{ ...sketch({ padding: "3px 10px", borderRadius: 8 }), fontFamily: S.font, fontSize: 11 }}>chip</span>)}</div></div>
        </Box>
      </div>
      <div style={{ padding: "0 22px 22px", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        {["AI Quiz Generator", "Smart Summaries", "Progress Insights"].map((t) => (
          <Box key={t}><div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${S.ink}` }}></div><Label size={13} mb={0}>{t}</Label><Lines n={3} /></Box>
        ))}
      </div>
      <div style={{ margin: "0 22px 22px", ...sketch({ background: S.fill, padding: 22, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, textAlign: "center" }) }}>
        {["1. Upload", "2. Quiz instantly", "3. Reinforce"].map((t) => <div key={t}><Label size={13}>{t}</Label><Lines n={2} widths={["100%", "80%"]} /></div>)}
      </div>
      <div style={{ padding: 22, textAlign: "center", borderTop: `2px dashed ${S.line}` }}><Label size={16} mb={10}>Ready when your brain is</Label><Btn label="Sign In to QuizAI" solid /></div>
    </div>
  );
}

function WLogin() {
  return (
    <div style={{ ...sketch({ minHeight: 420, display: "flex", alignItems: "center", justifyContent: "center", background: "#fbfbfb" }) }}>
      <div style={{ ...sketch({ width: 300, padding: 24, textAlign: "center", borderRadius: 22 }) }}>
        <Label size={15}>◑ QuizAI</Label>
        <Label size={17} mb={4}>Welcome to QuizAI</Label>
        <Label size={12} muted mb={16}>Sign in to your account</Label>
        <div style={{ ...sketch({ padding: 11, marginBottom: 10 }) }}><Bar w="35%" h={8} /></div>
        <div style={{ ...sketch({ padding: 11, marginBottom: 14 }) }}><Bar w="45%" h={8} /></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Btn label="Sign In" solid w="100%" small />
          <Btn label="Don't have an account? Sign Up" w="100%" small />
          <Btn label="Back to Options" w="100%" small />
        </div>
      </div>
    </div>
  );
}

function WDashboard() {
  return (
    <AppShell active="Home">
      <Label size={20}>Welcome back, [name]</Label>
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20, alignItems: "start" }}>
        <div>
          <Label size={12} muted mb={8}>My quizzes</Label>
          <Box dashed style={{ marginBottom: 10, display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, border: `2px solid ${S.ink}` }}></div>
            <div style={{ flex: 1 }}><Bar w="60%" h={9} /><Bar w="85%" h={7} mt={6} /></div>
          </Box>
          <Note>drop PDF → auto-detect title → new flashcard</Note>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
            {[1, 2, 3, 4].map((i) => (
              <Box key={i} style={{ minHeight: 118, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: 8 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: S.line, marginTop: 5 }}></span><Bar w="80%" h={9} /><span style={{ fontFamily: S.font, fontSize: 12 }}>×</span></div>
                <Bar w="45%" h={7} />
                <div style={{ ...sketch({ background: S.fill, padding: "6px 0", textAlign: "center", borderRadius: 8 }) }}><Label size={11}>Generate Quiz</Label></div>
              </Box>
            ))}
          </div>
          <Note>card flips in 3D on click · × asks to confirm</Note>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <Label size={12} muted mb={8}>My tasks</Label>
            <Box pad={10}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 2px", borderBottom: `1px solid ${S.fill}` }}>
                  <span style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${S.ink}` }}></span>
                  <div style={{ flex: 1 }}><Bar w="85%" h={8} /><Bar w="40%" h={6} mt={5} /></div>
                  <span style={{ fontFamily: S.font, fontSize: 12, color: S.soft }}>☆</span>
                </div>
              ))}
              <Label size={11} muted>View all tasks →</Label>
            </Box>
          </div>
          <div>
            <Label size={12} muted mb={8}>My summaries</Label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[1, 2].map((i) => <Box key={i} pad={12}><Bar w="40%" h={6} /><Bar w="90%" h={9} mt={8} /><Lines n={2} widths={["100%", "60%"]} mt={8} /></Box>)}
            </div>
          </div>
          <div>
            <Label size={12} muted mb={8}>Recent activity</Label>
            <Box pad={10}>{[1, 2, 3].map((i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 2px" }}><span style={{ width: 24, height: 24, borderRadius: "50%", border: `2px solid ${S.ink}` }}></span><div style={{ flex: 1 }}><Bar w="55%" h={8} /><Bar w="80%" h={6} mt={5} /></div></div>)}</Box>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function WSummaries() {
  return (
    <AppShell active="Summaries">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div><Label size={20}>Summaries</Label><Label size={12} muted>Every document you've studied, in one place.</Label></div>
        <Btn label="+ New summary" small />
      </div>
      <Metrics n={4} />
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <Box pad={9} style={{ flex: "0 0 240px" }}><Bar w="55%" h={8} /></Box>
        <div style={{ ...sketch({ background: S.fill, padding: 4, borderRadius: 10, display: "flex", gap: 4 }) }}>
          {["All", "Physics", "Maths", "Robotics"].map((f, i) => <span key={f} style={{ ...sketch({ background: i === 0 ? "#fff" : "transparent", border: i === 0 ? `2px solid ${S.ink}` : `2px dashed ${S.line}`, padding: "4px 10px", borderRadius: 7 }), fontFamily: S.font, fontSize: 11 }}>{f}</span>)}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: 16, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[1, 2, 3, 4].map((i) => (
            <Box key={i} pad={12} style={{ borderWidth: i === 1 ? 3 : 2 }}>
              <div style={{ display: "flex", gap: 8 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: S.line, marginTop: 5 }}></span><div style={{ flex: 1 }}><Bar w="85%" h={9} /><Bar w="55%" h={6} mt={6} /></div><span style={{ fontFamily: S.font, fontSize: 11 }}>★</span></div>
              <div style={{ marginTop: 10, height: 3, background: S.fill, borderRadius: 2 }}><div style={{ width: `${30 + i * 15}%`, height: "100%", background: S.line, borderRadius: 2 }}></div></div>
            </Box>
          ))}
          <Note>selected row = heavier outline</Note>
        </div>
        <Box pad={18}>
          <Label size={12} muted mb={6}>Reading pane (sticky)</Label>
          <Bar w="90%" h={12} dark /><Bar w="60%" h={7} mt={8} />
          <Lines n={3} mt={14} />
          {["Abstract", "Architecture", "Results"].map((h) => (
            <div key={h} style={{ marginTop: 14, paddingTop: 12, borderTop: `1px dashed ${S.line}` }}><Label size={11} muted>{h.toUpperCase()}</Label><Lines n={2} widths={["100%", "85%"]} mt={6} /></div>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}><Btn label="Generate Quiz" solid small /><Btn label="Make flashcards" small /></div>
        </Box>
      </div>
    </AppShell>
  );
}

function WTasks() {
  return (
    <AppShell active="Tasks">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div><Label size={20}>Tasks</Label><Label size={12} muted>Study pipeline — each task links to its source.</Label></div>
        <Btn label="+ New task" small />
      </div>
      <Metrics n={4} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
        {[["To do", 3], ["In progress", 2], ["Done", 2]].map(([col, n]) => (
          <div key={col} style={{ ...sketch({ background: "#fafafa", borderStyle: "dashed", padding: 12, minHeight: 240 }) }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><Label size={12}>{col}</Label><Label size={12} muted>{n}</Label></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
              {Array.from({ length: n }).map((_, i) => (
                <Box key={i} pad={11}>
                  <div style={{ display: "flex", gap: 8 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: S.line, marginTop: 5 }}></span><Bar w="80%" h={8} /><span style={{ fontFamily: S.font, fontSize: 11 }}>☆</span></div>
                  <div style={{ ...sketch({ background: S.fill, padding: "5px 8px", borderRadius: 7, marginTop: 9 }) }}><Bar w="70%" h={6} /></div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 9 }}><Bar w="35%" h={6} /><Label size={11} muted>← →</Label></div>
                </Box>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Note>source chip → jumps to that summary · arrows move stage</Note>
    </AppShell>
  );
}

function WQuizzes() {
  return (
    <AppShell active="Quizzes">
      <div><Label size={20}>Generate a quiz</Label><Label size={12} muted>Tell QuizAI what you want and it writes the questions.</Label></div>
      <div style={{ display: "grid", gridTemplateColumns: "1.25fr 0.75fr", gap: 16, alignItems: "start" }}>
        <Box pad={18}>
          <Label size={11} muted mb={8}>SOURCE MATERIAL</Label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, paddingBottom: 14, borderBottom: `1px dashed ${S.line}` }}>
            {[1, 2, 3, 4, 5].map((i) => <span key={i} style={{ ...sketch({ padding: "6px 12px", borderWidth: i === 1 ? 3 : 2, borderRadius: 9 }) }}><Bar w={60} h={7} /></span>)}
          </div>
          {["How many questions do you want?", "What kind of questions?", "How many choices per question?", "Difficulty"].map((q, qi) => (
            <div key={q} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: `1px dashed ${S.line}` }}>
              <Label size={13}>{q}</Label>
              <div style={{ ...sketch({ background: S.fill, padding: 4, borderRadius: 9, display: "flex", gap: 4 }) }}>
                {Array.from({ length: qi === 1 ? 3 : 4 }).map((_, i) => <span key={i} style={{ ...sketch({ background: i === 1 ? "#fff" : "transparent", border: i === 1 ? `2px solid ${S.ink}` : `2px dashed ${S.line}`, padding: "4px 11px", borderRadius: 7 }) }}><Bar w={26} h={6} dark /></span>)}
              </div>
            </div>
          ))}
          <div style={{ marginTop: 18 }}><Btn label="⚡ Generate questions" solid /></div>
        </Box>
        <Box pad={16}>
          <Label size={12} muted mb={10}>Summary</Label>
          {["Source", "Questions", "Format", "Choices", "Difficulty", "Est. time"].map((k) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px dashed ${S.line}` }}><Label size={12} muted>{k}</Label><Bar w={64} h={7} dark /></div>
          ))}
        </Box>
      </div>
      <Box dashed style={{ textAlign: "center", padding: 26 }}>
        <Label size={13}>State 2 — “Writing N questions…”</Label>
        <Label size={12} muted>brain pulse over neural canvas</Label>
      </Box>
      <div>
        <Label size={12} muted mb={8}>State 3 — generated questions</Label>
        {[1, 2].map((i) => (
          <Box key={i} pad={16} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <span style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${S.ink}`, flexShrink: 0 }}></span>
              <div style={{ flex: 1 }}>
                <Bar w="85%" h={9} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
                  {[1, 2, 3, 4].map((o) => <div key={o} style={{ ...sketch({ padding: 10 }) }}><Bar w="70%" h={7} /></div>)}
                </div>
              </div>
            </div>
          </Box>
        ))}
        <Note>pick an option → correct answer outlines green</Note>
      </div>
    </AppShell>
  );
}

function WProfile() {
  return (
    <AppShell active="">
      <Box pad={20} style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 62, height: 62, borderRadius: "50%", border: `2px solid ${S.ink}` }}></div>
        <div style={{ flex: 1 }}><Bar w="35%" h={14} dark /><Bar w="55%" h={7} mt={8} /><div style={{ display: "flex", gap: 6, marginTop: 10 }}>{[1, 2, 3].map((i) => <span key={i} style={{ ...sketch({ background: S.fill, padding: "3px 10px", borderRadius: 7 }) }}><Bar w={40} h={6} /></span>)}</div></div>
        <Btn label="Edit profile" small />
      </Box>
      <Metrics n={4} />
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 16, alignItems: "start" }}>
        <div>
          <Label size={12} muted mb={8}>Study preferences</Label>
          <Box pad={16}>
            {["Learning style", "Default quiz format", "Default difficulty", "Study reminders"].map((k) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: `1px dashed ${S.line}` }}>
                <Label size={13}>{k}</Label>
                <div style={{ ...sketch({ background: S.fill, padding: 4, borderRadius: 9, display: "flex", gap: 4 }) }}>{[1, 2, 3].map((i) => <span key={i} style={{ ...sketch({ background: i === 1 ? "#fff" : "transparent", border: i === 1 ? `2px solid ${S.ink}` : `2px dashed ${S.line}`, padding: "4px 11px", borderRadius: 7 }) }}><Bar w={26} h={6} dark /></span>)}</div>
              </div>
            ))}
          </Box>
        </div>
        <div>
          <Label size={12} muted mb={8}>Account</Label>
          <Box pad={12}>
            {["Notifications", "Password and security", "Export my data", "Help and support", "Sign out"].map((k) => (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 2px", borderBottom: `1px dashed ${S.line}` }}>
                <span style={{ width: 14, height: 14, border: `2px solid ${S.ink}`, borderRadius: 4 }}></span>
                <Label size={13}>{k}</Label>
                <span style={{ marginLeft: "auto", fontFamily: S.font, fontSize: 12, color: S.soft }}>›</span>
              </div>
            ))}
          </Box>
        </div>
      </div>
    </AppShell>
  );
}

const PAGES = [
  ["Landing", WLanding], ["Sign in", WLogin], ["Dashboard", WDashboard],
  ["Summaries", WSummaries], ["Tasks", WTasks], ["Quizzes", WQuizzes], ["Profile", WProfile],
];

function QuizAiWireframes() {
  const [tab, setTab] = React.useState(0);
  const Page = PAGES[tab][1];
  return (
    <div style={{ minHeight: "100vh", background: "#f4f4f2", padding: "26px 28px 60px", fontFamily: S.font, color: S.ink }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ fontSize: 24 }}>QuizAI — low-fidelity wireframes</div>
        <div style={{ fontSize: 13, color: S.soft, marginTop: 4 }}>Structure and flow only. No colour, no type hierarchy, no final copy.</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "18px 0 16px" }}>
          {PAGES.map(([name], i) => (
            <button key={name} onClick={() => setTab(i)}
              style={{ ...sketch({ background: i === tab ? S.ink : "#fff", padding: "7px 14px", borderRadius: 999 }), color: i === tab ? "#fff" : S.ink, fontFamily: S.font, fontSize: 13, cursor: "pointer" }}>{name}</button>
          ))}
        </div>
        <Page />
      </div>
    </div>
  );
}

window.QuizAiWireframes = QuizAiWireframes;
