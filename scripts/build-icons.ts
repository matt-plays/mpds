import { resolve } from 'path';
import { writeOutput, ROOT } from './utils.js';

/**
 * MPDS icons are Central Icons (https://iconists.co/central).
 *
 * Central publishes one package per style (join × fill × radius × stroke).
 * Each consuming project installs the style it wants under the shared alias
 * `central-icons`, e.g.
 *
 *   npm install central-icons@npm:@central-icons-react/round-outlined-radius-2-stroke-1.5
 *
 * `@mattplays/mpds/icons` re-exports whatever `central-icons` resolves to, so
 * the same import works in every project while each project picks its own
 * style. MPDS itself bundles no icon artwork.
 */
const ICONS_DIST = resolve(ROOT, 'dist/icons');

const reexport = `export * from 'central-icons';\n`;

writeOutput(resolve(ICONS_DIST, 'index.mjs'), reexport);
writeOutput(resolve(ICONS_DIST, 'index.d.ts'), reexport);

console.log('Building MPDS icons...\n');
console.log('  ✓ dist/icons re-exports the project\'s `central-icons` style package');
console.log('\nDone!');
