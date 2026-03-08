import { resolve } from 'path';
import { writeOutput, cssHeader, ROOT } from './utils.js';

export function buildDefaults(): void {
  // ── Elevation ──
  const elevation = `${cssHeader('Elevation')}:root {
  --mpds-elevation-0: none;
  --mpds-elevation-1: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --mpds-elevation-2: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  --mpds-elevation-3: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --mpds-elevation-4: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  --mpds-elevation-5: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  --mpds-elevation-6: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
`;

  writeOutput(resolve(ROOT, 'dist/css/mpds-elevation.css'), elevation);

  // ── Border Radius ──
  const radius = `${cssHeader('Border Radius')}:root {
  --mpds-radius-none: 0;
  --mpds-radius-sm: 2px;
  --mpds-radius-md: 4px;
  --mpds-radius-lg: 8px;
  --mpds-radius-xl: 12px;
  --mpds-radius-2xl: 16px;
  --mpds-radius-3xl: 24px;
  --mpds-radius-full: 9999px;
}
`;

  writeOutput(resolve(ROOT, 'dist/css/mpds-radius.css'), radius);
}
