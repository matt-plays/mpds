# MPDS

Matt's Personal Design System — design tokens and iconography as CSS custom properties.

## Install

```bash
npm install @mattplays/mpds
```

> Requires a `.npmrc` pointing `@mattplays` to GitHub Packages:
>
> ```
> @mattplays:registry=https://npm.pkg.github.com
> ```

## Usage

```css
/* Import everything (colors, fluid metrics, elevation, radius) */
@import '@mattplays/mpds';

/* Or pick individual files */
@import '@mattplays/mpds/css/mpds-colors.css';
@import '@mattplays/mpds/css/mpds-metrics-fluid.css';
@import '@mattplays/mpds/css/mpds-metrics-breakpoints.css';
@import '@mattplays/mpds/css/mpds-elevation.css';
@import '@mattplays/mpds/css/mpds-radius.css';
```

### Semantic layer (consumer project)

MPDS provides primitives only — no `font-family` or semantic roles. Each project creates its own mapping:

```css
@import '@mattplays/mpds';

:root {
  --font-family-heading: 'Playfair Display', serif;
  --font-family-body: 'Inter', sans-serif;
  --color-bg: var(--mpds-color-clay-0);
  --color-text: var(--mpds-color-clay-800);
  --color-accent: var(--mpds-color-highlight);
}
```

## Token reference

| Category | Pattern | Example |
| -------- | ------- | ------- |
| Colors | `--mpds-color-{group}-{step}` | `--mpds-color-clay-200` |
| Font size | `--mpds-font-size-{step}` | `--mpds-font-size-2xl` |
| Spacing | `--mpds-space-{step}` | `--mpds-space-md` |
| Site layout | `--mpds-site-{prop}` | `--mpds-site-container-width` |
| Elevation | `--mpds-elevation-{n}` | `--mpds-elevation-3` |
| Radius | `--mpds-radius-{size}` | `--mpds-radius-lg` |

### Responsive metrics

The default barrel imports **fluid metrics** using `clamp()` — values interpolate between mobile (480px) and desktop (1440px) viewports.

An alternative **breakpoint** file is available using media queries (mobile / tablet / desktop):

```css
@import '@mattplays/mpds/css/mpds-metrics-breakpoints.css';
```

## Icons

Place SVG source files in `icons/svg/`. The build pipeline will:

1. Optimize SVGs with SVGO → `dist/icons/svg/`
2. Generate React components → `dist/icons/react/`

```tsx
import { ArrowRight } from '@mattplays/mpds/icons';
```

## Development

```bash
npm run build          # Build tokens + icons
npm run build:tokens   # Tokens only
npm run build:icons    # Icons only
```

Source tokens live in `tokens/` (Figma Token Studio exports). Edit in Figma, re-export, then rebuild.
