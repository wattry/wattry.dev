# wattry — brand asset kit

Everything you need to put the **wattry** identity on a website: logos, favicons,
fonts, a ready-to-use stylesheet, a demo page, and a social card.

> Concept: *wattry* contains **watt** — the unit of power. The identity runs on
> electricity: a lightning-bolt mark, voltage-yellow accent, and a hidden pun
> surfaced by the two-tone wordmark (**watt**·ry).

---

## What's inside

```
wattry-brand/
├── logo/
│   ├── icon.svg            App/brand mark — voltage tile + bolt (for light backgrounds)
│   ├── icon-dark.svg       Same mark inverted (ink tile + voltage bolt)
│   ├── bolt.svg            Bolt glyph only — uses currentColor (style with CSS)
│   ├── monogram.svg        "W" monogram — uses currentColor
│   ├── wordmark.svg        "wattry" wordmark, outlined paths (light bg)
│   ├── wordmark-dark.svg   "wattry" wordmark (dark bg)
│   ├── lockup.svg          Mark + wordmark, horizontal (light bg)
│   └── lockup-dark.svg     Mark + wordmark, horizontal (dark bg)
├── favicon/
│   ├── favicon.svg         Modern scalable favicon
│   ├── favicon.ico         Legacy multi-size (16/32/48)
│   ├── favicon-16/32/48.png
│   ├── apple-touch-icon.png (180×180)
│   └── icon-192.png, icon-512.png (PWA)
├── fonts/
│   ├── SpaceGrotesk-Regular/Medium/Bold.woff2
│   └── OFL.txt             Font license (SIL Open Font License 1.1)
├── css/
│   └── wattry.css          Fonts + design tokens + base + components
├── social/
│   └── og-image.png        1200×630 Open Graph / Twitter card
└── demo/
    ├── index.html          Working landing page using everything
    └── site.webmanifest    PWA manifest
```

All logos are **vector**; the wordmark/lockup have their text converted to outlines,
so they render identically everywhere without the font installed.

---

## Quick start

1. Copy `css/`, `fonts/`, `logo/`, `favicon/`, and `social/` into your project.
2. Link the stylesheet in your `<head>`:
   ```html
   <link rel="stylesheet" href="/css/wattry.css" />
   ```
3. Add favicons (these belong at your **site root**):
   ```html
   <link rel="icon" href="/favicon/favicon.svg" type="image/svg+xml" />
   <link rel="icon" href="/favicon/favicon-32.png" sizes="32x32" />
   <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
   <link rel="manifest" href="/site.webmanifest" />
   <meta name="theme-color" content="#12141C" />
   ```
4. Add a social card:
   ```html
   <meta property="og:image" content="/brand/social/og-image.png" />
   ```
5. Drop in the logo:
   ```html
   <img src="/logo/lockup-dark.svg" alt="wattry" height="34" />
   ```

Open `demo/index.html` in a browser to see all of it assembled (with a working
light/dark toggle).

---

## Colors

| Token | Hex | Use |
|-------|-----|-----|
| Ink | `#12141C` | Text, dark backgrounds |
| Voltage | `#F5E13C` | Primary accent, buttons, the spark |
| Electric | `#2E6BFF` | Links / secondary accent (on light) |
| Cloud | `#FBFBF7` | Off-white background / text on dark |
| Slate | `#6B7280` | Muted / secondary text |

In CSS these are `--wattry-ink`, `--wattry-voltage`, `--wattry-electric`,
`--wattry-cloud`, `--wattry-slate`. Semantic tokens (`--bg`, `--fg`, `--surface`,
`--border`, `--accent`…) auto-swap for light/dark.

## Typography

- **Display / headings:** Space Grotesk (bundled as WOFF2, weights 400/500/700).
- **Body:** Inter (loaded from Google Fonts in the demo) with a system fallback.
  Self-host it the same way as Space Grotesk if you'd rather not hit a CDN.

## Dark mode

Light is the default. For dark, set `data-theme="dark"` on `<html>`, or let it
follow the OS (the stylesheet already handles `prefers-color-scheme`). Force light
with `data-theme="light"`.

## Components in `wattry.css`

`.btn` + `.btn-primary` / `.btn-ghost`, `.wattry-card`, `.wattry-badge`,
`.wattry-rule`, `.wattry-container`, `.wattry-section`, `.wattry-logo`,
plus `.text-muted` / `.text-electric` helpers.

`bolt.svg` and `monogram.svg` paint with `currentColor`, so set `color:` (or use
`.wattry-bolt`) to recolor them inline.

---

## Regenerating / resizing

Need other sizes (e.g. a 1024px icon) or color variants? The marks are plain SVG —
edit the `fill`/`stroke` hex and re-export at any size with your tool of choice.

## Licensing

- **Logos, CSS, demo:** yours to use for the wattry project.
- **Space Grotesk:** SIL Open Font License 1.1 — free to use and self-host; keep
  `fonts/OFL.txt` alongside the font files. Designed by Florian Karsten.
- **Inter:** also OFL; loaded via Google Fonts in the demo.
