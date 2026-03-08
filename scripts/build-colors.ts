import { readFileSync } from 'fs';
import { resolve } from 'path';
import { slugify, writeOutput, cssHeader, ROOT } from './utils.js';

const TOKENS_PATH = resolve(ROOT, 'tokens/core.tokens.json');
const OUTPUT_PATH = resolve(ROOT, 'dist/css/mpds-colors.css');

interface ColorValue {
  hex: string;
}

interface ColorToken {
  $type: 'color';
  $value: ColorValue;
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

      const hex = token.$value.hex;
      let propName: string;

      if (FLAT_GROUPS.includes(groupName)) {
        // e.g., "White" → --mpds-color-white
        propName = `--mpds-color-${slugify(tokenName)}`;
      } else {
        // e.g., group "Clay", token "Clay 0" → --mpds-color-clay-0
        // e.g., group "Orange S", token "Orange S 200" → --mpds-color-orange-s-200
        propName = `--mpds-color-${slugify(tokenName)}`;
      }

      lines.push(`  ${propName}: ${hex};`);
    }

    // Blank line between groups
    lines.push('');
  }

  const css =
    cssHeader('Color Tokens') +
    `:root {\n${lines.join('\n')}\n}\n`;

  writeOutput(OUTPUT_PATH, css);
}
