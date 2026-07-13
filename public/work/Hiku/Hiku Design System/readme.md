# Hiku Design System

Hiku is a mobile app for hiking and camping enthusiasts: **trail tracking**, discovering places to camp, a **community** of clubs and trips, and a **shop** for hiking & camping gear. The brand is earthy, vibrant and calm — deep forest greens on generous white space, one warm typeface, flat vector nature illustration.

This project is the design system that lets agents build on-brand Hiku screens, prototypes and assets.

## Sources
- **HIKU.fig** (mounted Figma file) — contained only loose brush strokes / vectors; **no components, variables or text styles** were defined in it, so the system was built from the reference material below rather than materialized from Figma.
- **Reference screens** (`uploads/reference dcreens.png`) — Explore/camping-filter, Community registration, and Trails map, the primary source of truth for layout and color.
- **Lo-fi wireframes** (`uploads/hiking_app_lofi_all.html`) — the full 6-screen flow: Splash, Filter, Map, Register, Shop, Community.
- **Loading screen** (`uploads/loading screen reference.png`) — centered mark on white.
- **Brand assets** — `assets/logo.png` (green mountain mark), `assets/illustration-mountain-river.png`.
- **Fonts** — Satoshi (Light→Black + italics) for UI; **Architects Daughter** (hand-lettered) for the login/splash wordmark. Installed under `assets/fonts/`.
- **Brand colors (from brief)** — primary `#8DCAAF`, `#4FB889`, `#349369`; secondary `#FFFFFF`, `#000000`.

> There is no dedicated wordmark file — only the mountain **mark**. The "Hiku" wordmark is always set in **Satoshi Black**; the `Logo` component pairs the raster mark with type.

---

## Content fundamentals
- **Voice:** friendly, outdoorsy, plain-spoken. Short and encouraging — *"Pitch your own tent"*, *"find places that fit your rig"*, *"Track trails. Gear up. Find your people."*
- **Person:** second person / imperative for actions (*"show 250 places"*, *"Get started"*, *"Know more"*); first person for the user's own things (*"My clubs"*, *"Saved trails"*).
- **Casing:** **sentence case** everywhere — buttons included (*"show 250 places"*, *"clear"*). Screen section titles are sentence case too (*"Camping style"*). Proper nouns keep their caps (*"ASU Outdoors Club"*, *"Kachina Trail"*).
- **Numbers:** terse and factual — *"250 places"*, *"412 members"*, *"3.2 mi"*, prices as `$32 / night`.
- **Emoji:** none. Meaning is carried by Lucide line icons.
- **Tone test:** if a line sounds like a park ranger giving a warm, quick tip, it's right. Avoid marketing hype and exclamation marks.

## Visual foundations
- **Color:** green *is* the brand. Deep green `#349369` for primary buttons, active nav and the trail line; vibrant `#4FB889` for accents/secondary CTAs; soft `#8DCAAF` for the header band and tints. Everything else is white, near-black ink (`#1a1a1a`) and warm grays. Color is used sparingly against lots of white — never full-bleed gradients on content.
- **Type:** Satoshi only for UI. Black (900) for big moments, Bold (700) for titles, Medium (500) for buttons/labels/input values, Regular (400) for body, gray for subtitles. Tight tracking (`-0.02em`) on large headings. **Exception:** the **Hiku login/splash wordmark** is set in **Architects Daughter** (`--font-lettering`), a hand-lettered display face, for a warm, trail-journal feel.
- **Spacing:** 4px base rhythm; screen gutters are 16px; cards and rows sit 12px apart.
- **Corners:** friendly and round — inputs/cards/rows at **12px**, the search field at **22px**, chips & primary buttons & FABs are **full pills**.
- **Backgrounds:** white surfaces; a soft-green header band caps app screens; the map canvas is a pale green-gray (`#e8efe9`) with a green trail path. Two imagery modes: **real photography** (warm, natural hiking/camping scenes) for heros, community banners and shop items, and **flat monochrome green illustration** (the `Illustration` component) for empty states, onboarding and as the graceful fallback behind every photo.
- **Borders & elevation:** hairline `#ddd` borders do most of the work on white; shadows are soft, low and **neutral (never green-tinted)** — `sm` for search, `card` for cards, `float` for map FABs and sheets.
- **Selected states:** fill `--brand-wash` (faint green) with a `#4FB889` border (chips, option rows).
- **Motion:** quick and gentle — 120–200ms, standard/ease-out curves, **no bounce**. Press = subtle `scale(0.97)`; hover = slightly darker fill or an 8% green tint. No decorative looping animation.
- **Icons:** Lucide line set, 2px stroke, round caps, `currentColor`.

## Iconography
Hiku uses the **[Lucide](https://lucide.dev)** open-source line icon set — 2px stroke, rounded caps, single-color (`currentColor`). This is the one icon system; there is no bespoke icon font in the source. The glyphs are bundled as verbatim Lucide path data inside `components/core/Icon.jsx` (so the runtime needs no CDN), rendered via `<Icon name="…" />`. Icons in use across the app: `search`, `sliders-horizontal`, `chevron-down`, `arrow-left`, `map`, `compass`, `globe`, `shopping-bag`, `user`, `layers`, `navigation`, `tent`, `caravan`, `house`, `heart`, `star`, `map-pin`, `plus`, `minus`, `check`, `x`, `mountain`. **No emoji, no unicode-glyph icons.** Add new glyphs by pasting their Lucide path markup into the `PATHS` map.

> **Substitution flag:** the source did not ship an icon set, so Lucide was chosen to match the thin, rounded line style visible in the reference screens' tab bar and filter controls. If Hiku has an official icon library, swap the `PATHS` data and this note goes away.

---

## Components
All primitives live in `components/core/` and are exposed on `window.HikuDesignSystem_2ec900`.

- **Icon** — Lucide glyph renderer (the icon system).
- **Button** — pill action button; primary / vibrant / secondary / ghost.
- **IconButton** — icon-only control: header filter, map FABs, back arrow.
- **Input** — single-line text field.
- **SearchBar** — two-line tappable search field (location + dates/guests).
- **FilterChip** — pill filter, dropdown or toggle form.
- **OptionRow** — bordered selectable row (icon + title + subtitle), e.g. RV / Tent / Lodging.
- **BottomNav** — the 5-tab app bar (Explore · Trails · Community · Shop · Account).
- **PlaceCard** — imagery-forward listing card with save + rating.
- **CommunityCard** — club/group feed card with Join.
- **Avatar** — circular user image with initials fallback.
- **MapMarker** — circular POI pin for the Trails map.
- **Illustration** — flat monochrome hiking scenes (mountains, tent, forest, trail, campfire, lake) in green tonal ramps.
- **Logo** — mountain mark + optional wordmark.
- **AppHeader** — soft-green brand band capping app screens.

### Intentional additions
- **Icon** — the source shipped no icon set; a Lucide-backed `Icon` wrapper is needed for every screen. (See substitution note above.)

## UI kits
- **`ui_kits/hiku-app/`** — the full Hiku mobile app as an interactive click-through: Splash → Explore (camping filter) → Trails (map) → Community → Register → Shop → Account. Composes the core components. Open `index.html`.

## Foundations (Design System tab)
Specimen cards in `guidelines/`: Brand Greens, Neutrals & Ink, Semantic Roles (Colors); Type Scale, Weights (Type); Spacing Scale, Radii, Elevation (Spacing); Logo & Mark, Illustration (Brand).

## Index / manifest
- `styles.css` — global entry (imports all tokens + fonts).
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `effects.css`.
- `components/core/` — the 13 primitives (`.jsx` + `.d.ts` + `.prompt.md`) and demo cards.
- `guidelines/` — foundation specimen cards.
- `ui_kits/hiku-app/` — the mobile app kit.
- `assets/` — `logo.png`, `logo-mark.png` (trimmed), `illustration-mountain-river.png`, `fonts/`.
- `SKILL.md` — Agent-Skill entry point.

## Caveats
- The Figma file carried no components/tokens/text styles, so the system was reconstructed from the reference screens, lo-fi wireframes and brand brief.
- **Photography** in the UI kit is loaded from Unsplash direct URLs; each image sits over a monochrome `Illustration` fallback so the layout stays on-brand if a URL fails. Swap in owned/licensed imagery for production.
- Satoshi and Architects Daughter are the real provided fonts (no substitution). Lucide is a flagged substitution for the icon set.
