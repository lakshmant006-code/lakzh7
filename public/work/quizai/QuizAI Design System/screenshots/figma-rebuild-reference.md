# QuizAI — Figma Rebuild Reference

Three screen PNGs are in `screenshots/` (Sign In, Dashboard, Summaries) — drag them into a Figma page as tracing/reference layers, then rebuild each element as native Figma frames/components using the values below (don't just place the image — it's for reference only).

## Colors (Figma: create as Local Styles)

**Primary**
- ASU Maroon `#8C1D40` — headings, primary buttons, links
- ASU Gold `#FFC627` — accents only (score badges)
- Rich Black `#000000`
- White `#FFFFFF`

**Maroon scale** (hover/press states)
- Maroon Dark `#6E1733` (button hover)
- Maroon Darker `#501025` (button press)

**Grayscale** (asu.edu UI scale)
- Gray1 `#191919` — body text
- Gray2 `#484848`
- ASU Gray `#747474` — muted/meta text
- Gray4 `#BFBFBF` — default borders
- Gray5 `#D0D0D0`
- Gray6 `#E8E8E8` — subtle borders
- Gray7 `#FAFAFA`

**Secondary (accents only, never dominant)**
- Green `#78BE20`, Blue `#00A3E0`, Orange `#FF7F32`, Copper `#AF674B`, Turquoise `#4AB7C4`, Pink `#E74973`

**Tinted surfaces**
- Maroon tint bg `#F1E4E8` / border `#D1A5B3` (quiz history cards)
- Gold tint bg `#FFF6DF` / border `#FFE59E` (summary cards)

**Semantic**
- Success text `#4C7A14` on bg `#EBF5DE`
- Danger text `#C62828` on bg `#FBEAEA` (utility red — not an ASU brand color)

## Typography (Figma: create as Text Styles)

Font family: **Arial** (Bold / Regular)

| Style | Size | Weight | Line height |
|---|---|---|---|
| Display | 40px | Bold | 1.2 |
| H1 | 32px | Bold | 1.2 |
| H2 | 26px | Bold | 1.2 |
| H3 | 20px | Bold (semibold) | 1.2 |
| Body | 15px | Regular | 1.5 |
| Small | 13px | Regular | 1.5 |
| Label | 13px | Bold (semibold) | 1.5 |

## Spacing scale
4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80 px

## Corner radii
- sm 6px (small chips)
- md 10px (inputs, buttons)
- lg 14px (cards)
- pill 999px (badges, avatar)
- Login card outer frame: 28px

## Borders & shadows
- Every card/input/button: 1px solid hairline border, one shade darker than its own fill — this is the primary depth cue (ASU brand guide: drop shadows are not preferred).
- Reserve drop shadow for overlays/menus only: `0 8px 24px rgba(140,29,64,0.12)`.

## Icons
Font Awesome Free (solid/regular) — brain (`fa-brain`), circle-question, chart-simple, clock, check, xmark, file-lines, book-open, pen, rotate, trash-can, chevron-down/up. In Figma, use the Font Awesome plugin or import matching SVGs from fontawesome.com.

## Component inventory to rebuild
Button (primary/secondary/ghost), Input, Badge (gold/success/danger), Avatar, NavBar, Logo/BrainMark, Card (maroon/gold/white tint), StatTile, QuizHistoryItem, SummaryCard.

Full source values live in this project's `tokens/*.css` and `readme.md` if you need anything not listed here.
