import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fluidValue, writeOutput, cssHeader, ROOT } from './utils.js';

interface MetricsTokenGroup {
  [key: string]: {
    $type: string;
    $value: number;
    $extensions?: unknown;
  };
}

interface MetricsFile {
  'font-size': MetricsTokenGroup;
  space: MetricsTokenGroup;
  site: MetricsTokenGroup;
}

function readMetrics(filename: string): MetricsFile {
  return JSON.parse(
    readFileSync(resolve(ROOT, 'tokens', filename), 'utf-8'),
  );
}

/**
 * Extract a clean step name from a token key.
 * "font-size-2xs" → "2xs", "space-md" → "md", "space-16" → "16"
 */
function stepName(key: string, prefix: string): string {
  return key.replace(new RegExp(`^${prefix}-?`), '');
}

export function buildMetrics(): void {
  const mobile = readMetrics('metrics-mobile.tokens.json');
  const tablet = readMetrics('metrics-tablet.tokens.json');
  const desktop = readMetrics('metrics-desktop.tokens.json');

  // ── Fluid output (clamp-based) ──
  const fluidLines: string[] = [];

  // Font sizes
  fluidLines.push('  /* Font Size */');
  for (const key of Object.keys(desktop['font-size'])) {
    if (key.startsWith('$')) continue;
    const step = stepName(key, 'font-size');
    const mVal = mobile['font-size'][key]?.$value;
    const dVal = desktop['font-size'][key]?.$value;
    if (mVal == null || dVal == null) continue;
    fluidLines.push(`  --mpds-font-size-${step}: ${fluidValue(mVal, dVal)};`);
  }

  fluidLines.push('');

  // Spacing
  fluidLines.push('  /* Spacing */');
  for (const key of Object.keys(desktop.space)) {
    if (key.startsWith('$')) continue;
    const step = stepName(key, 'space');
    const mVal = mobile.space[key]?.$value;
    const dVal = desktop.space[key]?.$value;
    if (mVal == null || dVal == null) continue;
    fluidLines.push(`  --mpds-space-${step}: ${fluidValue(mVal, dVal)};`);
  }

  fluidLines.push('');

  // Site layout
  fluidLines.push('  /* Site Layout */');
  for (const key of Object.keys(desktop.site)) {
    if (key.startsWith('$')) continue;
    const mVal = mobile.site[key]?.$value;
    const dVal = desktop.site[key]?.$value;
    if (mVal == null || dVal == null) continue;
    fluidLines.push(`  --mpds-site-${key}: ${fluidValue(mVal, dVal)};`);
  }

  const fluidCSS =
    cssHeader('Responsive Metrics — Fluid (clamp)') +
    `:root {\n${fluidLines.join('\n')}\n}\n`;

  writeOutput(resolve(ROOT, 'dist/css/mpds-metrics-fluid.css'), fluidCSS);

  // ── Breakpoint output (media queries) ──
  const breakpoints = [
    { data: mobile, query: '@media (max-width: 767px)', label: 'Mobile' },
    {
      data: tablet,
      query: '@media (min-width: 768px) and (max-width: 1279px)',
      label: 'Tablet',
    },
    { data: desktop, query: '@media (min-width: 1280px)', label: 'Desktop' },
  ];

  const bpBlocks: string[] = [];

  for (const bp of breakpoints) {
    const lines: string[] = [];
    lines.push(`  /* ${bp.label} */`);

    // Font sizes
    for (const key of Object.keys(bp.data['font-size'])) {
      if (key.startsWith('$')) continue;
      const step = stepName(key, 'font-size');
      lines.push(
        `    --mpds-font-size-${step}: ${bp.data['font-size'][key].$value}px;`,
      );
    }

    // Spacing
    for (const key of Object.keys(bp.data.space)) {
      if (key.startsWith('$')) continue;
      const step = stepName(key, 'space');
      lines.push(
        `    --mpds-space-${step}: ${bp.data.space[key].$value}px;`,
      );
    }

    // Site
    for (const key of Object.keys(bp.data.site)) {
      if (key.startsWith('$')) continue;
      lines.push(
        `    --mpds-site-${key}: ${bp.data.site[key].$value}px;`,
      );
    }

    bpBlocks.push(`${bp.query} {\n  :root {\n${lines.join('\n')}\n  }\n}`);
  }

  const bpCSS =
    cssHeader('Responsive Metrics — Breakpoints') +
    bpBlocks.join('\n\n') +
    '\n';

  writeOutput(
    resolve(ROOT, 'dist/css/mpds-metrics-breakpoints.css'),
    bpCSS,
  );
}
