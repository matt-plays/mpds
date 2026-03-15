import { readFileSync } from 'fs';
import { resolve } from 'path';
import { slugify, writeOutput, cssHeader, ROOT } from './utils.js';

const TOKENS_PATH = resolve(ROOT, 'tokens/core.tokens.json');
const OUTPUT_PATH = resolve(ROOT, 'dist/css/mpds-colors.css');

interface ColorValue {
  hex: string;
  alpha: number;
}

interface ColorToken {
  $type: 'color';
  $value: ColorValue;
}

type TokenGroup = Record<string, ColorToken | string>;

// Groups where the token name includes the group prefix (e.g., "Clay 0")
// vs. groups where the token name IS the value (e.g., "White")
const FLAT_GROUPS = ['Basics', 'Highlight', 'Actionable'];

export function buildColors(): void {
  const raw = JSON.parse(readFileSync(TOKENS_PATH, 'utf-8'));

  const lines: string[] = [];

  for (const [groupName, groupTokens] of Object.entries(raw)) {
    // Skip metadata keys
    if (groupName.startsWith('$')) continue;

    const tokens = groupTokens as TokenGroup;
    const base = (tokens as Record<string, unknown>).$base as string | undefined;

    for (const [tokenName, token] of Object.entries(tokens)) {
      if (tokenName.startsWith('$')) continue;
      if (typeof token !== 'object' || token.$type !== 'color') continue;

      const { alpha } = token.$value;
      let value: string;

      if (alpha < 1 && base) {
        // Alpha group with a base reference → color-mix
        const pct = Math.round(alpha * 100);
        value = `color-mix(in srgb, var(--mpds-color-${base}) ${pct}%, transparent)`;
      } else {
        value = token.$value.hex;
      }

      const propName = `--mpds-color-${slugify(tokenName)}`;

      lines.push(`  ${propName}: ${value};`);
    }

    // Blank line between groups
    lines.push('');
  }

  const css =
    cssHeader('Color Tokens') +
    `:root {\n${lines.join('\n')}\n}\n`;

  writeOutput(OUTPUT_PATH, css);
}
