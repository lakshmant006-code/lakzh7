/* Hiku mobile app — UI kit screens. Composes the design-system bundle
   (window.HikuDesignSystem_2ec900). Loaded by index.html after the bundle. */
const DS = window.HikuDesignSystem_2ec900;
const { AppHeader, SearchBar, IconButton, FilterChip, OptionRow, Button,
        BottomNav, Input, PlaceCard, CommunityCard, Avatar, MapMarker, Logo, Icon, Illustration } = DS;

const ASSET = "../../assets";
const HERO = ASSET + "/illustration-mountain-river.png";

/* Real photography — Unsplash direct URLs. Each falls back to an on-brand
   monochrome Illustration if the network image fails to load. */
const PHOTOS = {
  lake:     "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=900&q=80&auto=format&fit=crop",
  camp:     "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=900&q=80&auto=format&fit=crop",
  tentDay:  "https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=900&q=80&auto=format&fit=crop",
  trail:    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&q=80&auto=format&fit=crop",
  hiker:    "https://images.unsplash.com/photo-1551632811-561732d1e306?w=900&q=80&auto=format&fit=crop",
  group:    "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=900&q=80&auto=format&fit=crop",
  gearTent: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=700&q=80&auto=format&fit=crop",
  pack:     "https://images.unsplash.com/photo-1622260614153-03223fb72052?w=700&q=80&auto=format&fit=crop",
  stove:    "https://images.unsplash.com/photo-1571687949921-1306bfb24b72?w=700&q=80&auto=format&fit=crop",
  boots:    "https://images.unsplash.com/photo-1520962880247-cfaf541c8724?w=700&q=80&auto=format&fit=crop",
  bag:      "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=700&q=80&auto=format&fit=crop",
  bottle:   "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=700&q=80&auto=format&fit=crop",
};

/* Photo — real image on top of a monochrome illustration fallback layer. */
function Photo({ src, scene = "mountains", tone = "green", h = 120, r = 12, label, style }) {
  const [ok, setOk] = React.useState(true);
  return (
    <div style={{ position: "relative", width: "100%", height: h, borderRadius: r,
      overflow: "hidden", border: "1px solid var(--border-hairline)", background: "var(--green-100)", ...style }}>
      <div style={{ position: "absolute", inset: 0 }}>
        {Illustration
          ? <Illustration scene={scene} tone={tone} height={h} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ width: "100%", height: "100%", background: "linear-gradient(150deg, var(--green-300), var(--green-500))" }} />}
      </div>
      {src && ok && (
        <img src={src} alt={label || ""} onError={() => setOk(false)}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      )}
      {label && <span style={{ position: "absolute", left: 12, bottom: 10, color: "#fff",
        fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 14,
        textShadow: "0 1px 4px rgba(0,0,0,0.45)", zIndex: 2 }}>{label}</span>}
    </div>
  );
}

/* ================= 1b. LOADING (snow-reveal) ================= */
function LoadingScreen({ onDone }) {
  const logoRef = React.useRef(null);
  const snowRef = React.useRef(null);
  const doneRef = React.useRef(false);

  React.useEffect(() => {
    const logoCanvas = logoRef.current, snowCanvas = snowRef.current;
    if (!logoCanvas || !snowCanvas) return;
    const logoCtx = logoCanvas.getContext("2d");
    const snowCtx = snowCanvas.getContext("2d");

    const base = new Image(), mid = new Image(), final = new Image();
    base.src = ASSET + "/loader/base-logo.png";
    mid.src = ASSET + "/loader/mid-logo.png";
    final.src = ASSET + "/loader/final-logo.png";
    const imgs = [base, mid, final];

    const FALL_ANGLE = 75 * Math.PI / 180;
    const VX = -Math.cos(FALL_ANGLE), VY = Math.sin(FALL_ANGLE);
    const FLAKE_COUNT = 28, LOAD_DURATION = 2600, CAP_CLIP_RATIO = 0.34;
    const PEAK = { xMin: 0.28, xMax: 0.72, yMin: -0.28, yMax: 0.48 };

    let flakes = [], progress = 0, ready = false, raf = 0;
    const loadStart = performance.now();
    const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const allLoaded = () => imgs.every((i) => i.complete && i.naturalWidth > 0);

    function resize() {
      const rect = logoCanvas.parentElement.getBoundingClientRect();
      const w = Math.round(rect.width), h = Math.round(rect.height);
      [logoCanvas, snowCanvas].forEach((c) => { c.width = w; c.height = h; });
      if (ready) initFlakes();
    }
    function randSize() {
      const r = Math.random();
      if (r < 0.45) return Math.random() * 0.7 + 0.3;
      if (r < 0.8) return Math.random() * 1.4 + 0.9;
      return Math.random() * 2.2 + 1.8;
    }
    function createFlake(w, h, scatter = true) {
      const xMin = PEAK.xMin * w, xMax = PEAK.xMax * w, yMin = PEAK.yMin * h, yMax = PEAK.yMax * h;
      return { x: xMin + Math.random() * (xMax - xMin), y: scatter ? yMin + Math.random() * (yMax - yMin) : yMin - 5,
        r: randSize(), speed: Math.random() * 0.07 + 0.07, alpha: Math.random() * 0.35 + 0.25, phase: Math.random() * Math.PI * 2 };
    }
    const inPeak = (f, w, h) => f.x >= PEAK.xMin * w - 5 && f.x <= PEAK.xMax * w + 5 && f.y >= PEAK.yMin * h - 10 && f.y <= PEAK.yMax * h + 5;
    function initFlakes() { flakes = Array.from({ length: FLAKE_COUNT }, () => createFlake(snowCanvas.width, snowCanvas.height)); }

    function drawLogo(p) {
      if (!ready) return;
      const w = logoCanvas.width, h = logoCanvas.height, eased = easeInOutCubic(p), capH = h * CAP_CLIP_RATIO;
      logoCtx.clearRect(0, 0, w, h);
      logoCtx.imageSmoothingQuality = "high";
      // mountain (no snow) always underneath
      logoCtx.globalAlpha = 1;
      logoCtx.drawImage(base, 0, 0, w, h);
      // snow gradually fills the peak from the very tip downward
      const fill = eased * capH;
      if (fill > 0.5) {
        logoCtx.save();
        logoCtx.beginPath();
        logoCtx.rect(0, 0, w, fill);   // reveal window grows downward with progress
        logoCtx.clip();
        logoCtx.globalAlpha = 0.5;
        logoCtx.drawImage(mid, 0, 0, w, h);
        logoCtx.globalAlpha = 1;
        logoCtx.drawImage(final, 0, 0, w, h);
        logoCtx.restore();
      }
      logoCtx.globalAlpha = 1;
    }
    function drawFlakes(time) {
      const w = snowCanvas.width, h = snowCanvas.height;
      snowCtx.clearRect(0, 0, w, h);
      for (const f of flakes) {
        const tw = 0.8 + 0.2 * Math.sin(time * 0.003 + f.phase);
        snowCtx.beginPath();
        snowCtx.shadowColor = "rgba(15,40,30,0.5)"; snowCtx.shadowBlur = 3;
        snowCtx.fillStyle = `rgba(255,255,255,${Math.min(1, (f.alpha + 0.5) * tw)})`;
        snowCtx.arc(f.x, f.y, f.r + 0.5, 0, Math.PI * 2); snowCtx.fill();
        snowCtx.shadowBlur = 0;
        f.x += VX * f.speed; f.y += VY * f.speed;
        if (!inPeak(f, w, h)) Object.assign(f, createFlake(w, h, false));
      }
    }
    function tick(time) {
      const elapsed = time - loadStart;
      progress = Math.min(1, elapsed / LOAD_DURATION);
      drawLogo(progress); drawFlakes(time);
      if (elapsed >= LOAD_DURATION + 500 && !doneRef.current) { doneRef.current = true; onDone(); return; }
      raf = requestAnimationFrame(tick);
    }
    function start() { resize(); if (allLoaded()) { ready = true; initFlakes(); } raf = requestAnimationFrame(tick); }
    imgs.forEach((i) => i.addEventListener("load", () => { if (allLoaded() && !ready) { ready = true; initFlakes(); } }));
    start();
    window.addEventListener("resize", resize);
    const safety = setTimeout(() => { if (!doneRef.current) { doneRef.current = true; onDone(); } }, 4500);
    return () => { cancelAnimationFrame(raf); clearTimeout(safety); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 30, padding: 24, background: "linear-gradient(180deg, #216044 0%, #2b7c58 55%, #349369 100%)" }}>
      <div style={{ position: "relative", width: 240, height: 154, filter: "drop-shadow(0 12px 34px rgba(10,35,25,0.4))" }}>
        <canvas ref={logoRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />
        <canvas ref={snowRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", pointerEvents: "none" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ fontFamily: "var(--font-lettering)", fontSize: 30, color: "#fff", lineHeight: 1 }}>Hiku</div>
      </div>
    </div>
  );
}

/* ================= 1. SPLASH ================= */
function SplashScreen({ go }) {
  return (
    <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "flex-end", gap: 16, padding: 24, overflow: "hidden",
      background: `center/cover no-repeat url(${ASSET + "/splash-mountains.png"})` }}>
      {/* legibility scrim — soft white at top for the mark, deeper at the base for the CTA */}
      <div style={{ position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 30%, rgba(20,50,38,0.15) 62%, rgba(15,40,30,0.72) 100%)" }} />
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
        marginBottom: 96, textAlign: "center" }}>
        <img src={ASSET + "/splash-logo.png"} alt="Hiku" style={{ width: 150, filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.28))" }} />
        <div style={{ fontFamily: "var(--font-lettering)", fontWeight: 400, fontSize: 56,
          lineHeight: 1, color: "#fff", textShadow: "0 2px 16px rgba(15,40,30,0.5)" }}>Hiku</div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 500, color: "rgba(255,255,255,0.92)",
          textAlign: "center", maxWidth: 230, lineHeight: 1.4, textShadow: "0 1px 8px rgba(15,40,30,0.55)" }}>
          Track trails. Gear up. Find your people.
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 40, left: 24, right: 24 }}>
        <Button variant="primary" fullWidth onClick={() => go("explore")}>Get started</Button>
      </div>
    </div>
  );
}

/* ================= 2. EXPLORE / FILTER ================= */
const STYLES = {
  rv: { count: 128, hero: PHOTOS.tentDay, scene: "forest", tone: "deep", label: "RV-friendly sites",
    title: "RV hookups & access", options: [
      { icon: "caravan", t: "Full hookups", s: "Water · power · sewer", n: "72 sites" },
      { icon: "navigation", t: "Pull-through", s: "Easy in, easy out", n: "40 sites" },
      { icon: "house", t: "Dump station", s: "On-site sanitation", n: "16 sites" },
    ] },
  tent: { count: 250, hero: PHOTOS.camp, scene: "lake", tone: "green", label: "Tent pitches",
    title: "Tent camping features", options: [
      { icon: "tent", t: "Walk-in sites", s: "Car-free & quiet", n: "134 sites" },
      { icon: "compass", t: "Backcountry", s: "Dispersed camping", n: "88 sites" },
      { icon: "map-pin", t: "Fire rings", s: "Where permitted", n: "28 sites" },
    ] },
  lodging: { count: 64, hero: PHOTOS.group, scene: "mountains", tone: "soft", label: "Cabins & lodges",
    title: "Lodging options", options: [
      { icon: "house", t: "Cabins", s: "Private & heated", n: "38 stays" },
      { icon: "user", t: "Bunkhouses", s: "Group-friendly", n: "18 stays" },
      { icon: "star", t: "Lodges", s: "Full service", n: "8 stays" },
    ] },
};

function ExploreScreen({ tab, setTab }) {
  const [style, setStyle] = React.useState("tent");
  const [count, setCount] = React.useState(STYLES.tent.count);
  const prevCount = React.useRef(STYLES.tent.count);
  const first = React.useRef(true);
  const subRef = React.useRef(null);
  const heroRef = React.useRef(null);
  const data = STYLES[style];
  const [openChip, setOpenChip] = React.useState(null);
  const [amenities, setAmenities] = React.useState(["Restrooms", "Drinking water"]);
  const [pets, setPets] = React.useState(true);
  const popRef = React.useRef(null);
  const AMENITIES = ["Restrooms", "Drinking water", "Fire pit", "Showers", "Pull-through", "Pet-friendly", "Shade", "Picnic table"];
  const STYLE_META = [
    { key: "rv", icon: "caravan", label: "RV", note: "Hookups & pull-through" },
    { key: "tent", icon: "tent", label: "Tent", note: "Pitch your own tent" },
    { key: "lodging", icon: "house", label: "Lodging", note: "Cabins & lodges" },
  ];
  const toggleAmenity = (a) => setAmenities((xs) => xs.includes(a) ? xs.filter((x) => x !== a) : [...xs, a]);

  React.useEffect(() => {
    const g = window.gsap;
    if (g && popRef.current && openChip) {
      g.fromTo(popRef.current, { opacity: 0, y: -8, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.26, ease: "power3.out", transformOrigin: "top center" });
      const items = popRef.current.querySelectorAll("[data-pop-item]");
      if (items.length) g.fromTo(items, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.04, delay: 0.04, ease: "power2.out" });
    }
  }, [openChip]);

  React.useEffect(() => {
    const g = window.gsap;
    const target = STYLES[style].count;
    if (!g) { setCount(target); prevCount.current = target; first.current = false; return; }
    // count-up animation
    const obj = { v: prevCount.current };
    g.to(obj, { v: target, duration: 0.6, ease: "power2.out",
      onUpdate: () => setCount(Math.round(obj.v)), onComplete: () => setCount(target) });
    prevCount.current = target;
    const safety = setTimeout(() => setCount(target), 750); // land correctly even if ticker is throttled
    if (first.current) { first.current = false; return; } // no reveal anim on first mount (stays visible)
    if (subRef.current) g.fromTo(subRef.current.children, { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: "power3.out" });
    if (heroRef.current) g.fromTo(heroRef.current, { opacity: 0.25, scale: 1.05 },
      { opacity: 1, scale: 1, duration: 0.55, ease: "power2.out" });
  }, [style]);

  return (
    <>
      <AppHeader logoSrc={ASSET + "/logo-mark.png"} height={56} />
      <div style={{ padding: "12px 16px 10px", display: "flex", flexDirection: "column", gap: 10,
        borderBottom: "1px solid var(--border-hairline)", position: "relative", zIndex: 20 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ flex: 1 }}><SearchBar title="Nearby" subtitle="Add dates · Add guests" /></div>
          <IconButton icon="sliders-horizontal" ariaLabel="Filters" />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <FilterChip dropdown selected={openChip === "style"}
            onClick={() => setOpenChip(openChip === "style" ? null : "style")}>Camping style</FilterChip>
          <FilterChip dropdown selected={openChip === "amenities" || amenities.length > 0}
            onClick={() => setOpenChip(openChip === "amenities" ? null : "amenities")}>
            Amenities{amenities.length > 0 ? ` · ${amenities.length}` : ""}
          </FilterChip>
          <FilterChip selected={pets} onClick={() => setPets((p) => !p)}>Pets allowed</FilterChip>
        </div>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "var(--ink-900)" }}>
          {count} places · {data.label}
        </span>

        {openChip && (
          <>
            <div onClick={() => setOpenChip(null)} style={{ position: "absolute", left: 0, top: "100%",
              width: "100%", height: 900, background: "rgba(26,26,26,0.12)", zIndex: 40 }} />
            <div ref={popRef} style={{ position: "absolute", left: 16, right: 16, top: "100%", marginTop: 6,
              background: "var(--white)", border: "1px solid var(--border-hairline)", borderRadius: 16,
              boxShadow: "var(--shadow-float)", padding: 10, zIndex: 50, fontFamily: "var(--font-sans)" }}>
              {openChip === "style" && (
                <>
                  <div data-pop-item style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-500)", textTransform: "uppercase", letterSpacing: ".04em", padding: "4px 8px 8px" }}>Camping style</div>
                  {STYLE_META.map((m) => (
                    <button key={m.key} data-pop-item type="button"
                      onClick={() => { setStyle(m.key); setOpenChip(null); }}
                      style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 8px",
                        background: style === m.key ? "var(--brand-wash)" : "transparent", border: "none",
                        borderRadius: 10, cursor: "pointer", textAlign: "left" }}>
                      <Icon name={m.icon} size={24} color="var(--green-600)" strokeWidth={1.9} />
                      <span style={{ flex: 1 }}>
                        <span style={{ display: "block", fontSize: 15, fontWeight: 700, color: "var(--ink-900)" }}>{m.label}</span>
                        <span style={{ display: "block", fontSize: 12, color: "var(--ink-500)" }}>{m.note}</span>
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "var(--green-500)" }}>{STYLES[m.key].count}</span>
                      {style === m.key && <Icon name="check" size={18} color="var(--brand)" />}
                    </button>
                  ))}
                </>
              )}
              {openChip === "amenities" && (
                <>
                  <div data-pop-item style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 8px 8px" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-500)", textTransform: "uppercase", letterSpacing: ".04em" }}>Amenities</span>
                    <button type="button" onClick={() => setAmenities([])} style={{ background: "none", border: "none", cursor: "pointer",
                      fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "var(--green-500)" }}>Clear</button>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "0 4px 6px" }}>
                    {AMENITIES.map((a) => {
                      const on = amenities.includes(a);
                      return (
                        <button key={a} data-pop-item type="button" onClick={() => toggleAmenity(a)}
                          style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 34, padding: "0 12px",
                            borderRadius: 999, cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
                            color: on ? "var(--green-700)" : "var(--ink-700)",
                            background: on ? "var(--brand-wash)" : "var(--white)",
                            border: `1px solid ${on ? "var(--brand-vibrant)" : "var(--border-default)"}` }}>
                          {on && <Icon name="check" size={14} color="var(--brand)" />}{a}
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ padding: "6px 4px 2px" }}>
                    <Button variant="primary" fullWidth size="md" onClick={() => setOpenChip(null)}>
                      Show {count} places
                    </Button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>

      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "14px 16px 16px" }}>
        <div ref={heroRef}>
          <Photo h={150} src={data.hero} scene={data.scene} tone={data.tone} label={data.label} />
        </div>
        <h2 style={{ textAlign: "center", margin: "16px 0 12px", fontFamily: "var(--font-sans)",
          fontSize: 18, fontWeight: 700, color: "var(--ink-900)" }}>Camping style</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <OptionRow icon="caravan" title="RV" subtitle="find places that fit your rig"
            selected={style === "rv"} onClick={() => setStyle("rv")} />
          <OptionRow icon="tent" title="Tent" subtitle="Pitch your own tent"
            selected={style === "tent"} onClick={() => setStyle("tent")} />
          <OptionRow icon="house" title="Lodging" subtitle="Accommodations provided"
            selected={style === "lodging"} onClick={() => setStyle("lodging")} />
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "22px 0 12px" }}>
          <h3 style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 700, color: "var(--ink-900)" }}>{data.title}</h3>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "var(--green-500)" }}>{data.options.length} types</span>
        </div>
        <div ref={subRef} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {data.options.map((o) => (
            <div key={o.t} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px",
              background: "var(--white)", border: "1px solid var(--border-hairline)", borderRadius: "var(--radius-md)" }}>
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40,
                borderRadius: 999, background: "var(--brand-wash)", flexShrink: 0 }}>
                <Icon name={o.icon} size={22} color="var(--green-600)" strokeWidth={1.9} />
              </span>
              <span style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0, flex: 1 }}>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 700, color: "var(--ink-900)" }}>{o.t}</span>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--ink-500)" }}>{o.s}</span>
              </span>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "var(--green-500)", whiteSpace: "nowrap" }}>{o.n}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 16px 12px", borderTop: "1px solid var(--border-hairline)" }}>
        <button style={{ background: "none", border: "none", fontFamily: "var(--font-sans)",
          fontSize: 15, fontWeight: 700, color: "var(--ink-900)", cursor: "pointer" }}>clear</button>
        <Button variant="primary" onClick={() => setTab("trails")}>show {count} places</Button>
      </div>
    </>
  );
}

/* ================= 3. TRAILS / MAP (real Leaflet map) ================= */
const STOPS = [
  { name: "Snowbowl Trailhead", type: "Trailhead", icon: "map-pin", pos: [35.3306,-111.7119], note: "Parking · restrooms" },
  { name: "Humphreys Trailhead", type: "Trailhead", icon: "map-pin", pos: [35.3313,-111.7108], note: "Parking · trail info" },
  { name: "Aspen Trail", type: "Trail", icon: "compass", pos: [35.3190,-111.6960], note: "1.8 mi loop · easy · shaded aspens" },
  { name: "Kachina Overlook", type: "Viewpoint", icon: "compass", pos: [35.3067,-111.6771], note: "Scenic overlook" },
  { name: "US-180 Rest Stop", type: "Highway rest stop", icon: "caravan", pos: [35.2760,-111.6640], note: "Restrooms · water · picnic tables" },
  { name: "Lockett Meadow Camp", type: "Campground", icon: "caravan", pos: [35.3560,-111.6230], note: "17 sites · vault toilets" },
  { name: "Fatman's Rest Bench", type: "Rest stop", icon: "tent", pos: [35.2408,-111.6045], note: "Shaded bench · viewpoint" },
];

function pinIcon(L, color, active) {
  const c = active ? "#349369" : "#ffffff";
  const glyph = active ? "#ffffff" : "#349369";
  return L.divIcon({
    className: "hiku-pin",
    html: `<div style="width:30px;height:30px;border-radius:999px;background:${c};border:1px solid ${active ? "#349369" : "#e0e0e0"};box-shadow:0 4px 16px rgba(26,26,26,.25);display:flex;align-items:center;justify-content:center;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${glyph}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
    </div>`,
    iconSize: [30, 30], iconAnchor: [15, 15], popupAnchor: [0, -14],
  });
}

function wpIcon(L, label) {
  return L.divIcon({
    className: "hiku-wp",
    html: `<div style="width:28px;height:28px;border-radius:999px;background:#349369;border:2px solid #fff;box-shadow:0 3px 12px rgba(26,26,26,.35);display:flex;align-items:center;justify-content:center;color:#fff;font:700 13px/1 Satoshi,sans-serif;">${label}</div>`,
    iconSize: [28, 28], iconAnchor: [14, 14], popupAnchor: [0, -14],
  });
}

const ROUTE_PROFILES = {
  walking:          { key: "walking",          label: "Easy walk",     brouter: "hiking-beta",        kmh: 4.5 },
  "hiking-mountain":{ key: "hiking-mountain",  label: "Mountain hike", brouter: "hiking-mountain",    kmh: 3.2 },
};

function TrailsScreen() {
  const mapEl = React.useRef(null);
  const mapRef = React.useRef(null);
  const layerRef = React.useRef(null);
  const routeRef = React.useRef(null);
  const wpsRef = React.useRef([]);       // [{latlng, marker}]
  const profileRef = React.useRef("hiking-mountain");
  const [style, setStyle] = React.useState("topo");
  const [profile, setProfile] = React.useState("hiking-mountain");
  const [route, setRoute] = React.useState(null); // {dist, mins, approx} | null
  const [busy, setBusy] = React.useState(false);

  const TILES = {
    topo:   { url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", attr: "© CARTO · OSM", max: 19 },
    street: { url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", attr: "© CARTO · OSM", max: 19 },
  };

  const drawRoute = async () => {
    const L = window.L, map = mapRef.current;
    if (!map || wpsRef.current.length < 2) return;
    const [a, b] = wpsRef.current;
    if (routeRef.current) { map.removeLayer(routeRef.current); routeRef.current = null; }
    const prof = ROUTE_PROFILES[profileRef.current];
    setBusy(true); setRoute(null);
    const straightKm = map.distance(a.latlng, b.latlng) / 1000;
    try {
      const url = `https://brouter.de/brouter?lonlats=${a.latlng.lng},${a.latlng.lat}|${b.latlng.lng},${b.latlng.lat}&profile=${prof.brouter}&alternativeidx=0&format=geojson`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("route");
      const gj = await res.json();
      const coords = gj.features[0].geometry.coordinates.map((c) => [c[1], c[0]]);
      const p = gj.features[0].properties || {};
      const km = (p["track-length"] ? +p["track-length"] : straightKm * 1000) / 1000;
      const mins = p["total-time"] ? Math.round(+p["total-time"] / 60) : Math.round((km / prof.kmh) * 60);
      routeRef.current = L.layerGroup([
        L.polyline(coords, { color: "#ffffff", weight: 9, opacity: 0.9, lineCap: "round" }),
        L.polyline(coords, { color: "#349369", weight: 5, opacity: 1, lineCap: "round" }),
      ]).addTo(map);
      map.fitBounds(L.polyline(coords).getBounds().pad(0.25));
      setRoute({ dist: km, mins, approx: false });
    } catch (e) {
      // fallback: straight dashed line so the app still shows a route
      routeRef.current = L.polyline([a.latlng, b.latlng], { color: "#349369", weight: 4, opacity: 0.9, dashArray: "2 10", lineCap: "round" }).addTo(map);
      setRoute({ dist: straightKm, mins: Math.round((straightKm / prof.kmh) * 60), approx: true });
    } finally { setBusy(false); }
  };

  const addWaypoint = (latlng) => {
    const L = window.L, map = mapRef.current;
    if (!map) return;
    if (wpsRef.current.length >= 2 || wpsRef.current.length === 0) {
      // start fresh
      clearRoute();
      const m = L.marker(latlng, { icon: wpIcon(L, "A") }).addTo(map);
      wpsRef.current = [{ latlng, marker: m }];
    } else {
      const m = L.marker(latlng, { icon: wpIcon(L, "B") }).addTo(map);
      wpsRef.current.push({ latlng, marker: m });
      drawRoute();
    }
  };

  const clearRoute = () => {
    const map = mapRef.current;
    if (!map) return;
    if (routeRef.current) { map.removeLayer(routeRef.current); routeRef.current = null; }
    wpsRef.current.forEach((w) => map.removeLayer(w.marker));
    wpsRef.current = [];
    setRoute(null);
  };

  React.useEffect(() => {
    const L = window.L;
    if (!L || !mapEl.current) return;
    const map = L.map(mapEl.current, { zoomControl: false, attributionControl: true }).setView([35.30, -111.66], 12);
    mapRef.current = map;
    layerRef.current = L.tileLayer(TILES.topo.url, { maxZoom: TILES.topo.max, attribution: TILES.topo.attr, subdomains: "abcd" }).addTo(map);

    STOPS.forEach((s) => {
      L.marker(s.pos, { icon: pinIcon(L, s.color, false) })
        .addTo(map)
        .bindTooltip(s.name, { permanent: true, direction: "right", offset: [12, 0], className: "hiku-label" })
        .bindPopup(`<b style="font-size:14px;color:#1a1a1a">${s.name}</b><br><span style="color:#349369;font-size:11px;font-weight:600">${s.type}</span><br><span style="color:#717171;font-size:12px">${s.note}</span><br><span style="color:#349369;font-size:11px;font-weight:700">Tap the map to route here</span>`)
        .on("click", (ev) => { addWaypoint(L.latLng(s.pos[0], s.pos[1])); ev.target.openPopup(); });
    });
    map.on("click", (e) => addWaypoint(e.latlng));

    const grp = L.featureGroup(STOPS.map((s) => L.marker(s.pos)));
    map.fitBounds(grp.getBounds().pad(0.3));
    const t = setTimeout(() => map.invalidateSize(), 260);
    return () => { clearTimeout(t); map.remove(); mapRef.current = null; };
  }, []);

  const setProf = (key) => {
    setProfile(key); profileRef.current = key;
    if (wpsRef.current.length === 2) drawRoute(); // re-route with new profile
  };
  const toggleLayer = () => {
    const next = style === "topo" ? "street" : "topo";
    setStyle(next);
    const map = mapRef.current, L = window.L;
    if (map && layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = L.tileLayer(TILES[next].url, { maxZoom: TILES[next].max, attribution: TILES[next].attr, subdomains: "abcd" }).addTo(map);
    }
  };
  const locate = () => { const map = mapRef.current; if (map) map.locate({ setView: true, maxZoom: 14 }); };
  const mi = (km) => (km * 0.621371).toFixed(1);

  return (
    <>
      <AppHeader logoSrc={ASSET + "/logo-mark.png"} height={56} />
      <div style={{ padding: "12px 16px 10px", display: "flex", flexDirection: "column", gap: 10,
        borderBottom: "1px solid var(--border-hairline)" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ flex: 1 }}><SearchBar title="Flagstaff, AZ" subtitle="Tap to route a hike" /></div>
          <IconButton icon="sliders-horizontal" ariaLabel="Filters" />
        </div>
        {/* route-type control */}
        <div style={{ display: "flex", gap: 6, background: "var(--surface-sunken)", borderRadius: 999, padding: 4 }}>
          {Object.values(ROUTE_PROFILES).map((p) => (
            <button key={p.key} type="button" onClick={() => setProf(p.key)}
              style={{ flex: 1, height: 30, borderRadius: 999, border: "none", cursor: "pointer",
                fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
                background: profile === p.key ? "var(--green-500)" : "transparent",
                color: profile === p.key ? "#fff" : "var(--ink-700)",
                transition: "background 160ms" }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ position: "relative", flex: 1, background: "var(--map-bg)", overflow: "hidden" }}>
        <div ref={mapEl} className={"hiku-map hiku-map-" + style} style={{ position: "absolute", inset: 0, zIndex: 0 }} />

        <div style={{ position: "absolute", right: 16, top: 16, zIndex: 500 }}>
          <IconButton icon="layers" shape="round" variant="float" ariaLabel="Toggle map layer"
            active={style === "street"} onClick={toggleLayer} />
        </div>
        <div style={{ position: "absolute", right: 16, bottom: 16, zIndex: 500 }}>
          <IconButton icon="navigation" shape="round" variant="float" ariaLabel="Locate me" onClick={locate} />
        </div>

        {/* routing panel */}
        <div style={{ position: "absolute", left: 12, right: 68, bottom: 12, zIndex: 500,
          background: "rgba(255,255,255,0.96)", borderRadius: 12, padding: "10px 12px",
          boxShadow: "var(--shadow-card)", fontFamily: "var(--font-sans)" }}>
          {route ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--ink-900)" }}>
                  {mi(route.dist)} mi · {route.mins} min
                </div>
                <div style={{ fontSize: 12, color: "var(--ink-500)" }}>
                  {ROUTE_PROFILES[profile].label}{route.approx ? " · straight-line estimate" : " · on-trail route"}
                </div>
              </div>
              <button type="button" onClick={clearRoute} style={{ display: "inline-flex", alignItems: "center", gap: 5,
                border: "1px solid var(--border-default)", background: "#fff", borderRadius: 999, padding: "6px 12px",
                fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--ink-700)", cursor: "pointer" }}>
                Clear
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name={busy ? "compass" : "map-pin"} size={18} color="var(--brand)" />
              <span style={{ fontSize: 13, color: "var(--ink-700)" }}>
                {busy ? "Finding your trail…" : "Tap a start point, then a destination"}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ================= 4. REGISTER ================= */
function RegisterScreen({ setTab }) {
  const [done, setDone] = React.useState(false);
  const cardRef = React.useRef(null);

  const fireConfetti = () => {
    const c = window.__hikuConfetti;
    if (!c) return;
    c({ particleCount: 90, spread: 70, startVelocity: 42, origin: { y: 0.7 } });
    setTimeout(() => c({ particleCount: 55, angle: 60, spread: 55, origin: { x: 0, y: 0.75 } }), 120);
    setTimeout(() => c({ particleCount: 55, angle: 120, spread: 55, origin: { x: 1, y: 0.75 } }), 120);
  };

  const register = () => {
    setDone(true);
    fireConfetti();
    const g = window.gsap;
    if (g && cardRef.current) {
      g.fromTo(cardRef.current, { opacity: 0, scale: 0.8, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: "back.out(1.7)" });
    }
  };

  return (
    <>
      <div style={{ position: "relative", width: "100%", height: 168 }}>
        <Photo h={168} r={0} src={PHOTOS.group} scene="forest" tone="deep" />
        <div style={{ position: "absolute", top: 12, left: 12, zIndex: 3 }}>
          <IconButton icon="arrow-left" shape="round" variant="float" ariaLabel="Back"
            onClick={() => setTab("community")} />
        </div>
      </div>

      {done ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", padding: 24, textAlign: "center" }}>
          <div ref={cardRef} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 76, height: 76,
              borderRadius: 999, background: "var(--brand-wash)", border: "2px solid var(--brand-vibrant)" }}>
              <Icon name="check" size={38} color="var(--green-500)" strokeWidth={2.6} />
            </span>
            <h2 style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 700, color: "var(--ink-900)" }}>You're registered!</h2>
            <p style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: 14, lineHeight: 1.5, color: "var(--ink-500)", maxWidth: 260 }}>
              Welcome to the <strong style={{ color: "var(--green-600)" }}>ASU Outdoors Club</strong>. Check your email for your first trip invite.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
              <Button variant="secondary" onClick={fireConfetti}>Celebrate 🎉</Button>
              <Button variant="primary" onClick={() => setTab("community")}>Done</Button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, padding: "16px 16px 0", display: "flex", flexDirection: "column", gap: 12 }}>
          <h2 style={{ margin: "2px 0 4px", fontFamily: "var(--font-sans)", fontSize: 18,
            fontWeight: 700, color: "var(--ink-900)" }}>ASU Outdoors Club</h2>
          <Input defaultValue="Jaden Smith" />
          <Input type="email" defaultValue="jsmith1@asu.edu" />
          <div style={{ marginTop: "auto", paddingBottom: 16, display: "flex", justifyContent: "center" }}>
            <Button variant="vibrant" onClick={register}>Register</Button>
          </div>
        </div>
      )}
    </>
  );
}

/* ================= 5. SHOP ================= */
const PRODUCTS = [
  { id: "tent2p", name: "Trail Tent 2P", price: 189, scene: "tent", photo: PHOTOS.gearTent, cat: "Shelter", rating: 4.9, blurb: "Freestanding 2-person tent, 2.4kg packed. Weatherproof to 3-season storms.", specs: ["2.4 kg", "3-season", "Sleeps 2"] },
  { id: "pack45", name: "Alpine Pack 45L", price: 140, scene: "forest", photo: PHOTOS.pack, cat: "Packs", rating: 4.8, blurb: "45L internal-frame pack with vented back panel and rain cover included.", specs: ["45 L", "1.3 kg", "Rain cover"] },
  { id: "stove", name: "Camp Stove", price: 65, scene: "campfire", photo: PHOTOS.stove, cat: "Cooking", rating: 4.7, blurb: "Compact canister stove, boils 1L in 3.5 min. Piezo ignition.", specs: ["104 g", "3.5 min/L", "Piezo"] },
  { id: "boots", name: "Trek Boots", price: 120, scene: "trail", photo: PHOTOS.boots, cat: "Footwear", rating: 4.6, blurb: "Waterproof mid boots with Vibram outsole and cushioned midsole.", specs: ["Waterproof", "Vibram", "Unisex"] },
  { id: "bag", name: "Down Bag −5°", price: 210, scene: "tent", photo: PHOTOS.bag, cat: "Sleep", rating: 4.9, blurb: "650-fill down mummy bag rated to −5°C. Packs to 6L.", specs: ["−5 °C", "650 fill", "900 g"] },
  { id: "bottle", name: "Water Bottle", price: 32, scene: "mountains", photo: PHOTOS.bottle, cat: "Hydration", rating: 4.5, blurb: "Insulated 750ml bottle, keeps cold 24h. Leakproof cap.", specs: ["750 ml", "24h cold", "Leakproof"] },
];

function ShopViewWrap({ viewKey, dir, children }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const g = window.gsap, el = ref.current;
    if (!g || !el) return;
    const x = dir === "back" ? -26 : 26;
    g.killTweensOf(el);
    g.fromTo(el, { opacity: 0, x }, { opacity: 1, x: 0, duration: 0.34, ease: "power3.out", clearProps: "transform,opacity" });
    const items = el.querySelectorAll("[data-shop-stagger]");
    if (items.length) g.fromTo(items, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.36, stagger: 0.05, delay: 0.05, ease: "power2.out", clearProps: "transform,opacity" });
    const safety = setTimeout(() => { el.style.opacity = "1"; el.style.transform = "none"; items.forEach((n) => { n.style.opacity = "1"; n.style.transform = "none"; }); }, 700);
    return () => clearTimeout(safety);
  }, [viewKey]);
  return (
    <div ref={ref} style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
      {children}
    </div>
  );
}

function ShopScreen2() {
  const [view, setView] = React.useState("grid"); // grid | detail | cart | success
  const [sel, setSel] = React.useState(null);
  const [cart, setCart] = React.useState([]);
  const [saved, setSaved] = React.useState({});
  const bumpRef = React.useRef(null);
  const dirRef = React.useRef("fwd");
  const ORDER = { grid: 0, detail: 1, cart: 2, success: 3 };
  const nav = (next) => { dirRef.current = (ORDER[next] < ORDER[view]) ? "back" : "fwd"; setView(next); };

  const count = cart.reduce((n, i) => n + i.qty, 0);
  const total = cart.reduce((n, i) => n + i.price * i.qty, 0);

  const addToCart = (p, qty = 1) => {
    setCart((c) => {
      const ex = c.find((i) => i.id === p.id);
      if (ex) return c.map((i) => i.id === p.id ? { ...i, qty: i.qty + qty } : i);
      return [...c, { ...p, qty }];
    });
    const g = window.gsap;
    if (g && bumpRef.current) g.fromTo(bumpRef.current, { scale: 0.6 }, { scale: 1, duration: 0.4, ease: "back.out(2.5)" });
  };
  const setQty = (id, d) => setCart((c) => c.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i));
  const remove = (id) => setCart((c) => c.filter((i) => i.id !== id));
  const openP = (p) => { setSel(p); nav("detail"); };

  const Header = ({ title, back }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px 10px", borderBottom: "1px solid var(--border-hairline)" }}>
      {back && <IconButton icon="arrow-left" shape="round" variant="plain" ariaLabel="Back" onClick={back} />}
      <span style={{ flex: 1, fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 700, color: "var(--ink-900)" }}>{title}</span>
      <span ref={bumpRef} style={{ position: "relative", display: "inline-flex" }}>
        <IconButton icon="shopping-bag" shape="round" variant="outline" ariaLabel="Cart" onClick={() => nav("cart")} />
        {count > 0 && (
          <span style={{ position: "absolute", top: -4, right: -4, minWidth: 18, height: 18, padding: "0 5px",
            borderRadius: 999, background: "var(--green-500)", color: "#fff", fontFamily: "var(--font-sans)",
            fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{count}</span>
        )}
      </span>
    </div>
  );

  if (view === "grid") {
    return (
      <ShopViewWrap viewKey="grid" dir={dirRef.current}>
        <AppHeader logoSrc={ASSET + "/logo-mark.png"} height={56} />
        <Header title="Shop gear" />
        <div style={{ padding: "10px 16px 0" }}><SearchBar title="Shop gear" subtitle="Tents · Packs · Boots" /></div>
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "14px 16px 16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {PRODUCTS.map((p) => (
              <div key={p.id} data-shop-stagger onClick={() => openP(p)} style={{ display: "flex", flexDirection: "column", gap: 6, cursor: "pointer", fontFamily: "var(--font-sans)" }}>
                <div style={{ position: "relative" }}>
                  <Photo h={110} src={p.photo} scene={p.scene} />
                  <button onClick={(e) => { e.stopPropagation(); setSaved((s) => ({ ...s, [p.id]: !s[p.id] })); }} aria-label="Save"
                    style={{ position: "absolute", top: 8, right: 8, width: 30, height: 30, borderRadius: 999, border: "none",
                      background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "var(--shadow-sm)" }}>
                    <Icon name="heart" size={16} color={saved[p.id] ? "var(--brand)" : "var(--ink-700)"} style={{ fill: saved[p.id] ? "var(--brand)" : "none" }} />
                  </button>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-500)" }}>{p.cat}</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: "var(--ink-900)", lineHeight: 1.2 }}>{p.name}</span>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "var(--green-500)" }}>${p.price}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 12, fontWeight: 600, color: "var(--ink-700)" }}>
                    <Icon name="star" size={12} color="var(--ink-900)" style={{ fill: "var(--ink-900)" }} />{p.rating}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ShopViewWrap>
    );
  }

  if (view === "detail" && sel) {
    const inCart = cart.find((i) => i.id === sel.id);
    return (
      <ShopViewWrap viewKey={"detail-" + sel.id} dir={dirRef.current}>
        <Header title={sel.cat} back={() => nav("grid")} />
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
          <div data-shop-stagger style={{ padding: 16 }}><Photo h={220} src={sel.photo} scene={sel.scene} /></div>
          <div data-shop-stagger style={{ padding: "0 18px 16px", display: "flex", flexDirection: "column", gap: 12, fontFamily: "var(--font-sans)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "var(--ink-900)" }}>{sel.name}</h2>
              <span style={{ fontSize: 22, fontWeight: 700, color: "var(--green-500)", whiteSpace: "nowrap" }}>${sel.price}</span>
            </div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 600, color: "var(--ink-700)" }}>
              <Icon name="star" size={14} color="var(--ink-900)" style={{ fill: "var(--ink-900)" }} />{sel.rating} · {sel.cat}
            </span>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "var(--text-secondary)" }}>{sel.blurb}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {sel.specs.map((s) => (
                <span key={s} style={{ fontSize: 12, fontWeight: 600, color: "var(--green-700)", background: "var(--brand-wash)",
                  border: "1px solid var(--brand-soft)", borderRadius: 999, padding: "5px 12px" }}>{s}</span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 16px 14px", borderTop: "1px solid var(--border-hairline)" }}>
          <Button variant="secondary" onClick={() => addToCart(sel)}>{inCart ? `In cart · ${inCart.qty}` : "Add to cart"}</Button>
          <Button variant="primary" fullWidth onClick={() => { addToCart(sel); nav("cart"); }}>Buy now · ${sel.price}</Button>
        </div>
      </ShopViewWrap>
    );
  }

  if (view === "cart") {
    return (
      <ShopViewWrap viewKey={"cart-" + cart.length} dir={dirRef.current}>
        <Header title="Your cart" back={() => nav("grid")} />
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12, fontFamily: "var(--font-sans)" }}>
          {cart.length === 0 && (
            <div style={{ textAlign: "center", color: "var(--ink-500)", padding: "40px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <Icon name="shopping-bag" size={40} color="var(--green-300)" />
              <span style={{ fontSize: 15 }}>Your cart is empty</span>
              <Button variant="primary" onClick={() => nav("grid")}>Browse gear</Button>
            </div>
          )}
          {cart.map((i) => (
            <div key={i.id} data-shop-stagger style={{ display: "flex", gap: 12, alignItems: "center", padding: 10, background: "var(--white)",
              border: "1px solid var(--border-hairline)", borderRadius: "var(--radius-md)" }}>
              <div style={{ width: 64, flexShrink: 0 }}><Photo h={64} src={i.photo} scene={i.scene} r={10} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink-900)" }}>{i.name}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--green-500)" }}>${i.price}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                  <button onClick={() => setQty(i.id, -1)} aria-label="Less" style={qtyBtn}>−</button>
                  <span style={{ fontSize: 14, fontWeight: 700, minWidth: 16, textAlign: "center" }}>{i.qty}</span>
                  <button onClick={() => setQty(i.id, 1)} aria-label="More" style={qtyBtn}>+</button>
                  <button onClick={() => remove(i.id)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer",
                    fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "var(--ink-500)" }}>Remove</button>
                </div>
              </div>
            </div>
          ))}
          {cart.length > 0 && (
            <div style={{ marginTop: 6, padding: "12px 14px", background: "var(--brand-wash)", borderRadius: "var(--radius-md)" }}>
              <ShopRow k="Subtotal" v={`$${total}`} />
              <ShopRow k="Shipping" v="Free" />
              <div style={{ height: 1, background: "var(--brand-soft)", margin: "8px 0" }} />
              <ShopRow k="Total" v={`$${total}`} bold />
            </div>
          )}
        </div>
        {cart.length > 0 && (
          <div style={{ padding: "10px 16px 14px", borderTop: "1px solid var(--border-hairline)" }}>
            <Button variant="primary" fullWidth onClick={() => { nav("success"); setTimeout(() => window.__hikuConfetti && window.__hikuConfetti({ particleCount: 90, spread: 70, origin: { y: 0.7 } }), 150); }}>
              Checkout · ${total}
            </Button>
          </div>
        )}
      </ShopViewWrap>
    );
  }

  return (
    <ShopViewWrap viewKey="success" dir={dirRef.current}>
      <AppHeader logoSrc={ASSET + "/logo-mark.png"} height={56} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center", fontFamily: "var(--font-sans)" }}>
        <span data-shop-stagger style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 76, height: 76, borderRadius: 999,
          background: "var(--brand-wash)", border: "2px solid var(--brand-vibrant)", marginBottom: 14 }}>
          <Icon name="check" size={38} color="var(--green-500)" strokeWidth={2.6} />
        </span>
        <h2 data-shop-stagger style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 700, color: "var(--ink-900)" }}>Order placed!</h2>
        <p data-shop-stagger style={{ margin: "0 0 20px", fontSize: 14, lineHeight: 1.5, color: "var(--ink-500)", maxWidth: 260 }}>
          Your gear is on the way. We'll email tracking to jsmith1@asu.edu.
        </p>
        <div data-shop-stagger>
          <Button variant="primary" onClick={() => { setCart([]); nav("grid"); }}>Keep shopping</Button>
        </div>
      </div>
    </ShopViewWrap>
  );
}
const qtyBtn = { width: 26, height: 26, borderRadius: 999, border: "1px solid var(--border-default)", background: "var(--white)",
  cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 700, color: "var(--ink-900)", lineHeight: 1 };
function ShopRow({ k, v, bold }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", fontFamily: "var(--font-sans)",
      fontSize: bold ? 16 : 13, fontWeight: bold ? 700 : 500, color: bold ? "var(--ink-900)" : "var(--ink-700)" }}>
      <span>{k}</span><span>{v}</span>
    </div>
  );
}

/* ================= 6. COMMUNITY ================= */
const CLUBS = [
  { id: "asu", title: "ASU Outdoors Club", members: 412, image: PHOTOS.group, tags: ["Hiking", "Camping", "Gear swaps"],
    description: "Weekend hikes, gear swaps and trail cleanups across northern Arizona. We run beginner-friendly trips every Saturday plus monthly backpacking overnights. Open to all skill levels — borrow gear from the club library for your first trip." },
  { id: "sedona", title: "Sedona Trail Runners", members: 128, image: PHOTOS.trail, tags: ["Trail running", "Sunrise"],
    description: "Sunrise trail runs on the red-rock singletrack around Sedona. Two paces every run so nobody gets dropped, coffee after at the trailhead. Weekly Tuesday and Saturday meetups, all abilities welcome." },
  { id: "night", title: "Desert Night Hikers", members: 87, image: PHOTOS.camp, tags: ["Night hikes", "Stargazing"],
    description: "Full-moon and new-moon desert hikes with stargazing stops. We cover headlamp basics, desert safety and Leave No Trace. Bring water — we bring the telescope." },
];

function ExpandableClub({ club, open, onToggle, onJoin }) {
  const bodyRef = React.useRef(null);
  const chevRef = React.useRef(null);
  const first = React.useRef(true);
  const [joined, setJoined] = React.useState(false);

  React.useEffect(() => {
    const body = bodyRef.current, chev = chevRef.current, g = window.gsap;
    if (!body) return;
    if (!g) { body.style.height = open ? "auto" : "0px"; return; } // graceful fallback
    if (first.current) { // no animation on initial mount
      body.style.height = open ? "auto" : "0px";
      first.current = false;
      return;
    }
    g.killTweensOf(body);
    if (open) {
      body.style.height = "auto";
      const h = body.offsetHeight;
      g.fromTo(body, { height: 0 }, { height: h, duration: 0.42, ease: "power3.out",
        onComplete: () => { body.style.height = "auto"; } });
      g.fromTo(body.children, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, delay: 0.08, ease: "power2.out" });
      if (chev) g.to(chev, { rotate: 180, duration: 0.4, ease: "power2.out" });
    } else {
      g.to(body, { height: 0, duration: 0.34, ease: "power3.inOut" });
      if (chev) g.to(chev, { rotate: 0, duration: 0.34, ease: "power2.inOut" });
    }
  }, [open]);

  return (
    <article style={{ background: "var(--surface-card)", border: `1px solid ${open ? "var(--brand-vibrant)" : "var(--border-hairline)"}`,
      borderRadius: "var(--radius-md)", overflow: "hidden", boxShadow: "var(--shadow-card)", fontFamily: "var(--font-sans)",
      flexShrink: 0, transition: "border-color 200ms" }}>
      <div role="button" onClick={onToggle} style={{ display: "block", width: "100%", cursor: "pointer", textAlign: "left" }}>
        <div style={{ position: "relative", width: "100%", height: 104,
          background: club.image ? `center/cover no-repeat url(${club.image})` : "var(--green-100)" }}>
          <span style={{ position: "absolute", left: 12, bottom: 10, color: "#fff", fontFamily: "var(--font-sans)",
            fontWeight: 700, fontSize: 17, textShadow: "0 1px 6px rgba(0,0,0,.45)" }}>{club.title}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "var(--space-5)", gap: 10 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, color: "var(--ink-500)" }}>
            <Icon name="user" size={14} color="var(--ink-500)" />{club.members} members
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span ref={chevRef} style={{ display: "inline-flex" }}>
              <Icon name="chevron-down" size={20} color="var(--brand)" strokeWidth={2.4} />
            </span>
          </span>
        </div>
      </div>
      <div ref={bodyRef} style={{ height: 0, overflow: "hidden" }}>
        <div style={{ padding: "0 var(--space-5) var(--space-5)" }}>
          <p style={{ margin: "0 0 10px", fontSize: 14, lineHeight: 1.5, color: "var(--text-secondary)" }}>{club.description}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
            {club.tags.map((t) => (
              <span key={t} style={{ fontSize: 12, fontWeight: 600, color: "var(--green-700)", background: "var(--brand-wash)",
                border: "1px solid var(--brand-soft)", borderRadius: 999, padding: "3px 10px" }}>{t}</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant={joined ? "secondary" : "vibrant"} fullWidth
              onClick={() => setJoined((j) => !j)}>{joined ? "Joined ✓" : "Join"}</Button>
            <Button variant="primary" fullWidth onClick={() => onJoin(club)}>Register</Button>
          </div>
        </div>
      </div>
    </article>
  );
}

function CommunityScreen({ setTab }) {
  const [open, setOpen] = React.useState("asu");
  const listRef = React.useRef(null);

  React.useEffect(() => {
    const g = window.gsap;
    if (g && listRef.current) {
      // slide-only entrance (no opacity) so content is never left hidden if paused
      g.fromTo(listRef.current.children, { y: 16 },
        { y: 0, duration: 0.5, stagger: 0.09, ease: "power3.out" });
    }
  }, []);

  return (
    <>
      <AppHeader logoSrc={ASSET + "/logo-mark.png"} height={56} />
      <div style={{ padding: "12px 16px 10px", borderBottom: "1px solid var(--border-hairline)" }}>
        <SearchBar title="Find clubs" subtitle="Near Tempe, AZ" />
      </div>
      <div ref={listRef} style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "14px 16px 16px",
        display: "flex", flexDirection: "column", gap: 12 }}>
        {CLUBS.map((club) => (
          <ExpandableClub key={club.id} club={club} open={open === club.id}
            onToggle={() => setOpen(open === club.id ? null : club.id)}
            onJoin={() => setTab("register")} />
        ))}
      </div>
    </>
  );
}

/* ================= APP SHELL ================= */
/* Entrance via a CSS transition (not keyframes). Content is opaque at every
   frame — worst case (throttled/never-settled) it just sits slightly offset
   and at 55% opacity, never blank. */
function ScreenAnim({ animKey, children }) {
  const ref = React.useRef(null);
  const [enter, setEnter] = React.useState(false);
  React.useEffect(() => {
    setEnter(false);
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setEnter(true)));
    const t = setTimeout(() => setEnter(true), 80);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); };
  }, [animKey]);
  return (
    <div ref={ref} style={{
      flex: 1, display: "flex", flexDirection: "column", minHeight: 0,
      opacity: enter ? 1 : 0.55,
      transform: enter ? "translateY(0)" : "translateY(16px)",
      transition: "opacity 380ms cubic-bezier(0.16,1,0.3,1), transform 420ms cubic-bezier(0.16,1,0.3,1)",
    }}>
      {children}
    </div>
  );
}

function PhoneFrame({ children }) {
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const el = canvasRef.current;
    if (el && window.confetti && window.confetti.create) {
      const inst = window.confetti.create(el, { resize: true, useWorker: false });
      window.__hikuConfetti = (opts) => inst(Object.assign({
        colors: ["#8dcaaf", "#4fb889", "#349369", "#216044", "#ffffff"],
        disableForReducedMotion: true,
      }, opts));
    }
    return () => { window.__hikuConfetti = null; };
  }, []);
  return (
    <div style={{ width: "min(390px, 92vw)", height: "min(800px, 86vh)", aspectRatio: "390 / 800",
      background: "#000", borderRadius: 46, padding: 10, boxSizing: "border-box",
      boxShadow: "0 30px 80px rgba(0,0,0,0.35)" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", background: "var(--white)",
        borderRadius: 38, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 130, height: 26, background: "#000", borderRadius: "0 0 16px 16px", zIndex: 30 }} />
        {children}
        <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%",
          pointerEvents: "none", zIndex: 60 }} />
      </div>
    </div>
  );
}

function App() {
  const [tab, setTab] = React.useState("explore");
  const [started, setStarted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const go = (t) => {
    if (t === "explore") { setLoading(true); return; } // play loader before entering the app
    setStarted(true); setTab(t);
  };

  React.useEffect(() => {
    window.__hikuJump = (id) => {
      if (id === "splash") { setStarted(false); setLoading(false); setTab("explore"); }
      else if (id === "loading") { setStarted(false); setLoading(true); }
      else { setLoading(false); setStarted(true); setTab(id); }
    };
  }, []);

  let screen, animKey;
  if (loading) { screen = <LoadingScreen onDone={() => { setLoading(false); setStarted(true); setTab("explore"); }} />; animKey = "loading"; }
  else if (!started) { screen = <SplashScreen go={go} />; animKey = "splash"; }
  else if (tab === "explore") { screen = <ExploreScreen tab={tab} setTab={setTab} />; animKey = "explore"; }
  else if (tab === "trails") { screen = <TrailsScreen />; animKey = "trails"; }
  else if (tab === "community") { screen = <CommunityScreen setTab={setTab} />; animKey = "community"; }
  else if (tab === "register") { screen = <RegisterScreen setTab={setTab} />; animKey = "register"; }
  else if (tab === "shop") { screen = <ShopScreen2 />; animKey = "shop"; }
  else if (tab === "account") { screen = <AccountScreen />; animKey = "account"; }

  const showNav = started && !loading;
  return (
    <PhoneFrame>
      <ScreenAnim animKey={animKey}>
        {screen}
      </ScreenAnim>
      {showNav && tab !== "register" && (
        <BottomNav active={tab === "explore" ? "explore" : tab} onChange={setTab} />
      )}
      {showNav && tab === "register" && <BottomNav active="community" onChange={setTab} />}
    </PhoneFrame>
  );
}

/* ================= ACCOUNT (bonus) ================= */
function AccountScreen() {
  return (
    <>
      <AppHeader logoSrc={ASSET + "/logo-mark.png"} height={56} />
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Avatar name="Jaden Smith" size={64} ring />
          <div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 700, color: "var(--ink-900)" }}>Jaden Smith</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--ink-500)" }}>jsmith1@asu.edu</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <OptionRow icon="map-pin" title="Saved trails" subtitle="12 places" />
          <OptionRow icon="shopping-bag" title="Orders" subtitle="2 in transit" />
          <OptionRow icon="globe" title="My clubs" subtitle="ASU Outdoors Club" />
        </div>
        <Button variant="secondary" fullWidth>Sign out</Button>
      </div>
    </>
  );
}

window.__HikuApp = App;
