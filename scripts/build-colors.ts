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

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

type TokenGroup = Record<string, ColorToken>;

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

    for (const [tokenName, token] of Object.entries(tokens)) {
      if (tokenName.startsWith('$')) continue;
      if (token.$type !== 'color') continue;

      const { hex, alpha } = token.$value;
      const value = alpha < 1 ? hexToRgba(hex, alpha) : hex;
      let propName: string;

      if (FLAT_GROUPS.includes(groupName)) {
        // e.g., "White" → --mpds-color-white
        propName = `--mpds-color-${slugify(tokenName)}`;
      } else {
        // e.g., group "Clay", token "Clay 0" → --mpds-color-clay-0
        // e.g., group "Orange S", token "Orange S 200" → --mpds-color-orange-s-200
        propName = `--mpds-color-${slugify(tokenName)}`;
      }

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
