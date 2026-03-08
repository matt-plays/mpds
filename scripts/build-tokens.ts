import { resolve } from 'path';
import { buildColors } from './build-colors.js';
import { buildMetrics } from './build-metrics.js';
import { buildDefaults } from './build-defaults.js';
import { writeOutput, cssHeader, ROOT } from './utils.js';

console.log('Building MPDS tokens...\n');

// Build individual CSS files
buildColors();
buildMetrics();
buildDefaults();

// Barrel: dist/css/mpds.css
const barrel = `${cssHeader('All Tokens')}@import './mpds-colors.css';
@import './mpds-metrics-fluid.css';
@import './mpds-elevation.css';
@import './mpds-radius.css';
`;

writeOutput(resolve(ROOT, 'dist/css/mpds.css'), barrel);

// Top-level entry: dist/index.css
const index = `@import './css/mpds.css';\n`;
writeOutput(resolve(ROOT, 'dist/index.css'), index);

console.log('\nDone!');
