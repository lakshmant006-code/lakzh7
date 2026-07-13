Button — Hiku's pill action button; use for any primary or secondary tap target.

```jsx
<Button variant="primary" onClick={book}>show 250 places</Button>
<Button variant="secondary" icon="sliders-horizontal">Filters</Button>
<Button variant="ghost" size="sm">clear</Button>
```

Variants: `primary` (deep green #349369), `vibrant` (#4FB889), `secondary` (white + hairline border), `ghost` (green text, no fill). Sizes `sm | md | lg`. Add `icon`/`iconRight` (Icon names), `fullWidth`, `disabled`. Always fully rounded (pill).
