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

MPDS icons are [Central Icons](https://iconists.co/central). Central ships 30 styles (join × fill × radius × stroke) as separate packages, and **each project picks its own style** by installing it under the alias `central-icons`:

```bash
npm install central-icons@npm:@central-icons-react/round-outlined-radius-2-stroke-1.5
```

Then import through MPDS:

```tsx
import { IconHome, IconArrowRight } from '@mattplays/mpds/icons';

<IconHome size={20} />;
```

`@mattplays/mpds/icons` re-exports whatever `central-icons` resolves to in that project, so another project can alias a different style (e.g. `square-filled-radius-0-stroke-2`) and the same imports render in that style. MPDS bundles no icon artwork, and projects that don't use icons don't need to install anything.

Style package naming: `@central-icons-react/{round|square}-{filled|outlined}-radius-{0|1|2|3}-stroke-{1|1.5|2}`. Square styles only come in `radius-0`. Browse icon names at [iconists.co/central](https://iconists.co/central).

### License key

Central's packages check for a license key when installed. Set `CENTRAL_LICENSE_KEY` in your shell for local installs, and as an environment variable on each Vercel project that installs a style package.

> The pre-Central SVG icon set (and `@mattplays/mpds/icons/svg/*`) has been removed. Projects still importing the old names (e.g. `ArrowRight`) need to migrate to the Central names (e.g. `IconArrowRight`) before upgrading.

## Development

```bash
npm run build          # Build tokens + icon re-export
npm run build:tokens   # Tokens only
npm run build:icons    # Icon re-export only
```

Source tokens live in `tokens/` (Figma Token Studio exports). Edit in Figma, re-export, then rebuild.
