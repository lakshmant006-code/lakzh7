---
name: hiku-design
description: Use this skill to generate well-branded interfaces and assets for Hiku — a mobile app for hiking & camping enthusiasts (trail tracking, camp discovery, community clubs, gear shop) — either for production or throwaway prototypes/mocks. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

Hiku's identity in one line: **earthy, vibrant, calm** — deep forest greens (`#349369` / `#4FB889` / `#8DCAAF`) on generous white space, the **Satoshi** typeface throughout, **Lucide** line icons, fully-rounded pills and 12px cards, flat vector nature illustration. Copy is friendly and sentence-cased; no emoji.

Key files:
- `styles.css` — link this for all tokens + fonts (`--green-500`, `--font-sans`, radii, spacing…).
- `tokens/` — colors, typography, spacing, effects, fonts.
- `components/core/` — Button, IconButton, Input, SearchBar, FilterChip, OptionRow, BottomNav, PlaceCard, CommunityCard, Avatar, MapMarker, Logo, AppHeader, Icon. Each has a `.prompt.md` with usage.
- `ui_kits/hiku-app/` — the full mobile app click-through (6 screens) to copy from.
- `assets/` — logo mark, mountain illustration, Satoshi fonts.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. Load `styles.css` and mount components from `window.HikuDesignSystem_<hash>` (run the compiler / check the bundle for the exact namespace). If working on production code, copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.
