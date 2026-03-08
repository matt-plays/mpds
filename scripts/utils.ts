import { mkdirSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = resolve(__dirname, '..');

/**
 * Normalize a token group name to a CSS-friendly slug.
 * "Orange S" → "orange-s", "Warm Green M" → "warm-green-m", "Clay 200" → "clay-200"
 */
export function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');
}

/**
 * Generate a CSS clamp() value that interpolates linearly between
 * a mobile value (at mobileVW) and a desktop value (at desktopVW).
 */
export function fluidValue(
  mobileVal: number,
  desktopVal: number,
  mobileVW: number = 480,
  desktopVW: number = 1440,
): string {
  if (mobileVal === desktopVal) return `${desktopVal}px`;

  const min = Math.min(mobileVal, desktopVal);
  const max = Math.max(mobileVal, desktopVal);

  // slope in px-per-px-of-viewport
  const slope = (desktopVal - mobileVal) / (desktopVW - mobileVW);
  const intercept = mobileVal - slope * mobileVW;

  const slopeVW = +(slope * 100).toFixed(4);
  const interceptPx = +intercept.toFixed(4);

  // Build the preferred value string
  let preferred: string;
  if (interceptPx === 0) {
    preferred = `${slopeVW}vw`;
  } else if (interceptPx > 0) {
    preferred = `${interceptPx}px + ${slopeVW}vw`;
  } else {
    preferred = `${interceptPx}px + ${slopeVW}vw`;
  }

  return `clamp(${min}px, ${preferred}, ${max}px)`;
}

/**
 * Write a file, creating parent directories as needed.
 */
export function writeOutput(filePath: string, content: string): void {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, 'utf-8');
  console.log(`  ✓ ${filePath}`);
}

/**
 * Generate a CSS file header comment.
 */
export function cssHeader(title: string): string {
  return `/* MPDS — ${title} */\n/* Auto-generated. Do not edit manually. */\n\n`;
}
