# Hiku — Design System (for the Hiku case study)

Drop this whole `hiku-design-system/` folder into your Hiku case-study folder
(the one you renamed from `dandi`), e.g.:

```
src/pages/DandiCaseStudy/hiku-design-system/     ← reference + assets
```

…or, if you want the interactive prototype to load in an iframe on the live
site, put `prototype.html` (and its sibling `assets/` are already inlined, so
the single file is enough) under `public/`:

```
public/work/hiku/prototype.html
```
then embed it in the case study with:
```jsx
<iframe src="/work/hiku/prototype.html" title="Hiku prototype" style={{ width: "100%", height: 820, border: 0 }} />
```

## What's in here

| File | What it is |
|------|------------|
| `design-system.html` | **Self-contained** design-system reference — colors, Satoshi type scale & weights, components (buttons, chips, input, bottom nav, radii, icons), brand illustration, and a link to the prototype. No build step, no dependencies — open it directly. |
| `prototype.html` | The **full interactive Hiku app**, bundled into one offline file (splash → snow-reveal loading → Explore filters → Trails hiking map with tap-to-route → Community → Register confetti → Shop checkout → Account). ~1.6 MB, everything inlined. |
| `assets/` | Logo mark, splash mountain background, and the mountain-and-river brand illustration. |

## Design system at a glance

- **Colors** — brand greens `#8DCAAF` / `#4FB889` / `#349369`; white + near-black ink; warm grays.
- **Type** — Satoshi (Light→Black). Hand-lettered *Architects Daughter* for the splash wordmark.
- **Shape** — 12px cards & inputs, 22px search bar, fully-rounded pills & FABs; 4px spacing rhythm.
- **Icons** — Lucide line set, 2px stroke, rounded caps.
- **Imagery** — real photography over flat monochrome-green hiking illustrations (graceful fallback).
- **Motion** — quick, gentle (120–200ms), no bounce; GSAP for screen transitions, expand/collapse, count-ups, confetti.

> Nothing in your existing case-study code was changed — this is a self-contained
> package you place inside the Hiku folder and reference where you like.
