
# QuizAI Design System

QuizAI is an AI-powered study companion built for the ASU community: students upload notes, documents, or links and QuizAI generates quizzes, flashcards, and structured summaries from the content. It tracks quiz history, scores, and study time, and supports study groups for collaborative learning.

This design system uses **Arizona State University's official Enterprise Brand, Communications and Marketing Guide** ([brandguide.asu.edu](https://brandguide.asu.edu)) as its visual foundation — colors, fonts, and iconography are pulled directly from that source, not invented. Product structure/content still comes from the three QuizAI screenshots below.

## Sources provided

- **ASU Brand Guide** — https://brandguide.asu.edu/ — [Color palette](https://brandguide.asu.edu/brand-elements/design/color), [Fonts and typography](https://brandguide.asu.edu/brand-elements/design/fonts). Primary/secondary colors, grayscale, and font-stack guidance were read directly from these pages.
- `uploads/highfi-login.png` — high-fidelity Sign In screen
- `uploads/highfi-quiz-history.png` — "Your Quiz History" dashboard view (stat tiles + quiz list)
- `uploads/highfi-study-session.png` — "Study Session Summaries" view (stat tiles + AI summary card)
- `uploads/user-journey-mapping-frame-1.svg` / `uploads/user-journey.png` — a FigJam-style user-flow/requirements board covering onboarding, quiz generation, study groups, progress & insights, and logout
- `uploads/quizai_dashboard_v1 (1080p).mp4`, `uploads/thumbnail.mp4` — product video captures (not yet frame-extracted)

No Figma link or GitHub repo for QuizAI itself was attached — screen structure and copy are reconstructed from the three static screenshots. Color, type, and iconography now follow ASU's official brand system rather than being sampled/guessed from the screenshots.

## Index

- `styles.css` — root stylesheet, imports everything under `tokens/`
- `tokens/` — colors (ASU Maroon/Gold/grayscale), typography (Arial web stack), spacing, effects (shadows/motion)
- `components/core/` — Button, Input, Badge, Avatar, NavBar
- `components/cards/` — Card, StatTile, QuizHistoryItem, SummaryCard
- `components/brand/` — BrainMark, Logo
- `guidelines/` — foundation specimen cards (Design System tab)
- `ui_kits/quizai-app/` — Sign In, Quiz History (Dashboard), Study Summaries screens, interactive
- `templates/quizai-app/` — the same app packaged as a reusable starting-point template
- `SKILL.md` — portable skill manifest

## Components

- `components/core/Button.jsx` — primary/secondary/ghost action button
- `components/core/Input.jsx` — text field
- `components/core/Badge.jsx` — score/status pill
- `components/core/Avatar.jsx` — user initials chip
- `components/core/NavBar.jsx` — top navigation bar
- `components/brand/BrainMark.jsx` — brain glyph + `Logo` wordmark lockup
- `components/cards/Card.jsx` — base tinted card surface
- `components/cards/StatTile.jsx` — big-number stat tile
- `components/cards/QuizHistoryItem.jsx` — quiz history row
- `components/cards/SummaryCard.jsx` — AI summary card with expandable abstract

## Content fundamentals

- **Voice**: plain, encouraging, low-ceremony. Headlines state the screen's job directly — "Welcome to QuizAI", "Your Quiz History", "Study Session Summaries" — no cleverness, no taglines.
- **Person**: second person for instructions ("Sign in to your account"). Buttons are imperative verbs: "Sign In", "Sign Up", "View Details", "Read More".
- **Casing**: ASU's own writing guidance calls for **title or sentence case in headlines — never all caps**. This design system follows that: Title Case for headings/buttons ("Back to Options", "Don't have an account? Sign Up"), sentence case for helper text and body copy.
- **Numbers as heroes**: stat tiles lead with a big number (37, 35%, 0h) and a short two-line label underneath ("Total Quizzes" / "Completed").
- **Emoji**: none — not part of ASU's brand voice.
- **Vibe**: calm, academic, confident. ASU Maroon carries headings and primary actions; ASU Gold is reserved for accents (score badges) per ASU's "gold/maroon are first-choice, secondary colors are accents only" rule.

## Visual foundations

The system pairs **ASU's brand palette** with **Apple-style restraint**: near-monochrome surfaces, hairline separation, generous radii, and colour reserved for meaning.

- **Colour**: ASU Maroon `#8C1D40` is the single accent — used for the active nav item, primary buttons, selected states, progress bars, and small status dots. ASU Gold `#FFC627` appears rarely (score badges, brand marks); it never carries UI chrome. Everything else is neutral: app canvas `#F5F5F7`, panel `#FBFBFD`, cards white, chips `rgba(0,0,0,0.045)`, text in ASU's own grayscale (Gray1 `#191919` body, ASU Gray `#747474` meta). ASU's secondary palette stays available for data-viz only. Where the earlier version tinted whole cards maroon or gold, cards are now white with a hairline — brand tints are accent-only.
- **Type**: Arial (ASU's web font) throughout. Hierarchy comes from **size and weight, not colour** — headings are near-black rather than maroon. Large sizes carry tight tracking (`--ls-tight -0.025em`), body and labels a slight negative (`--ls-snug -0.01em`), and uppercase micro-labels a wide `0.04em`. Body copy runs at 1.6–1.65 line-height.
- **Borders & radii**: one universal hairline, `rgba(0,0,0,0.07)`, replaces coloured borders. Radii stepped up and softened: 8 (chips) → 10 (buttons, inputs) → 16 (cards, panels) → 20 (app shell, dialogs) → pill. Selection is shown with a maroon hairline plus a soft maroon glow, never a heavy fill.
- **Elevation**: four steps, all neutral — `--shadow-card` (resting, barely there), `--shadow-raised` (hover), `--shadow-elevated` (app shell), `--shadow-modal` (dialogs). Consistent with ASU's guidance that drop shadows are not a brand feature: shadows separate layers, they don't decorate.
- **Spacing**: roomy — 24px app padding, 36–40px content padding, 14–22px gaps, 18px card padding. Whitespace does the work borders used to.
- **Buttons**: solid maroon fill for the one primary action; maroon outline on white for secondary; a soft maroon-tint fill (`rgba(140,29,64,0.06)`) that inverts to solid maroon on hover for inline actions like "Generate Quiz".
- **Controls**: segmented pill switchers (grey trough, white capsule with a small shadow sliding to the selection) for all option pickers — counts, formats, difficulty, filters.
- **Animation**: entrances rise and settle with `back.out` easing and 40–70ms staggers; flashcards flip 180° in 3D on click; hover lifts are 3–4px with a shadow step; page changes cross-fade and rise. Durations 150/240/420ms, `--ease-standard` by default.
- **Hover/press**: buttons darken one step on hover and again on press; cards lift; list rows take a 2.5% black wash.
- **Transparency/blur**: used sparingly — dialog backdrops only (`rgba(0,0,0,0.32)` + 3px blur). The landing page is flat white, not glass.
- **Layout**: rounded app shell floating on the grey canvas, fixed 210px sidebar, scrolling content pane, sticky detail panes in master–detail views.
- **Accessibility**: ASU flags gold-on-white and maroon-on-black as pairings to avoid — gold is never body text here; gold badges use maroon text on a light gold tint.

## Visual foundations (superseded — original screenshot-derived pass)

<details><summary>Earlier notes, kept for reference</summary> **ASU Maroon `#8C1D40`** and **ASU Gold `#FFC627`** are primary — Maroon carries headings, primary buttons, links and icon strokes; Gold is used only as an accent (score badges), per ASU's own guidance to never let secondary/accent color dominate. Canvas is white. Content cards sit on two soft brand-tinted surfaces: a maroon wash for quiz-history content, a gold wash for study-summary content — each with a matching hairline border. ASU's secondary palette (Green, Blue, Orange, Gray, Copper, Turquoise, Pink) is available in tokens for data-viz/accents but isn't used to represent the brand on its own.
- **Type**: **Arial** — ASU's designated web/system font (`Arial, Helvetica, "Nimbus Sans L", "Liberation Sans", FreeSans, sans-serif`), per ASU's own "asu.edu: The chosen webfont for ASU websites is Arial" guidance. (ASU's print/Adobe font, Neue Haas Grotesk, is a licensed Adobe Fonts asset not available as a web font — Arial is the correct substitute for HTML/web contexts, per ASU's own instructions, not a guess.) Headings are bold Maroon; body/labels use ASU's own grayscale — Gray1 `#191919` for body copy (ASU uses this instead of true black for on-screen accessibility) and ASU Gray `#747474` for muted/meta text.
- **Spacing**: generous whitespace, roomy card padding (~20–24px), consistent small gaps (8–12px) between a card's internal rows.
- **Backgrounds**: flat and clean — no photography, gradients, or patterns in the source screens.
- **Borders & radii**: every card, input, and button has a visible 1px hairline border, one step darker than its own fill — the dominant "shadow substitute" here. This also matches ASU's own guidance that **drop shadows are NOT preferred as part of the brand** except sparingly for legibility. Radii are moderate: ~10px for cards/inputs, pill for score badges/avatar, ~28px for the login card's outer frame.
- **Buttons**: solid Maroon fill + white text for primary; Maroon outline + white fill + Maroon text for secondary ("Sign Up", "Back to Options") — fill vs. outline distinguishes primary from secondary, not color vs. color.
- **Shadows**: minimal by ASU guidance; tokens define a subtle elevated shadow for overlays/menus only.
- **Animation**: not visible in the static screenshots — this system layers GSAP-driven entrance/stagger/count-up motion on top, using an easing/duration token scale (`--ease-standard`, `--ease-out-back`, 150/240/420ms). ASU's brand guide has its own [Animation](https://brandguide.asu.edu/execution-guidelines/web/ux-design/animation) guidance; if you have access, cross-check timing/easing against it in a follow-up pass.
- **Hover/press**: buttons darken one step on hover, darken further on press; interactive cards (quiz history rows) lift subtly on hover.
- **Transparency/blur**: none — avoid glassmorphism.
- **Layout**: centered single-column content, max-width container, fixed top nav (logo left, links + user chip right). Dashboard content is a 3-up stat-tile row followed by a stacked card list.
- **Accessibility**: ASU's brand guide explicitly flags gold-on-white and maroon-on-black as pairings to avoid — this system never sets gold or maroon as body text on their raw backgrounds; gold badges use Maroon text on a light gold tint instead.

</details>

## Iconography

- **Font Awesome Free** is ASU's official icon system for asu.edu (per ASU's brand guide: *"ASU uses Font Awesome Free as its primary icon set"*), loaded via CDN. This design system's brain-glyph mark (`fa-brain`) and inline icons (question-circle, chart, clock, check, x-mark, file, book, pen, rotate, trash) all use it.
- ASU also publishes **ASU Awesome**, an extended icon set built on Font Awesome Solid — not bundled here (binary font file, not CDN-hosted); note if you want it added, it would need to be downloaded and copied into `assets/`.
- No emoji, no unicode-as-icon usage.
- No standalone QuizAI logo file was provided — do not invent one. Wherever a lockup is needed, use the brain glyph (FA `brain`, ASU Maroon) + "QuizAI" wordmark in Arial, bold.

## Intentional additions

- **NavBar, Avatar, StatTile, QuizHistoryItem, SummaryCard**: not explicit "components" in the source screenshots, but repeating structural patterns across all three screens — built as primitives to keep the UI kit DRY.
- **`--danger` (utility red)**: ASU's brand palette has no red; a standard accessible alert red is used only for "incorrect" counts, flagged here as a non-brand utility color, not a brand color.

## Caveats

- No QuizAI codebase or Figma file was attached — screen structure/copy beyond the three static screenshots is inferred.
- Color/type/icon system now follows ASU's official brand guide directly (fetched from brandguide.asu.edu), replacing the earlier from-screenshot color/font guesses.
- Neue Haas Grotesk (ASU's Adobe print font) is not used — Arial is correct per ASU's own web-font guidance, not a fallback compromise.
- Motion (GSAP-style) is this system's proposal on top of static screens, cross-reference against ASU's own Animation guidelines if you have access.
- The two product videos in `uploads/` have not been frame-extracted yet.
