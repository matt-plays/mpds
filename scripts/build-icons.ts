import { readdirSync, readFileSync } from 'fs';
import { resolve, basename, extname } from 'path';
import { optimize } from 'svgo';
import { transform } from '@svgr/core';
import { writeOutput, ROOT } from './utils.js';

const SVG_SRC = resolve(ROOT, 'icons/svg');
const SVG_DIST = resolve(ROOT, 'dist/icons/svg');
const REACT_DIST = resolve(ROOT, 'dist/icons/react');

function toPascalCase(str: string): string {
  return str
    .replace(/[-_]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (_, c) => c.toUpperCase());
}

export async function buildIcons(): Promise<void> {
  let svgFiles: string[];
  try {
    svgFiles = readdirSync(SVG_SRC).filter((f) => extname(f) === '.svg');
  } catch {
    console.log('  ⊘ No SVG source files found in icons/svg/ — skipping icon build');
    return;
  }

  if (svgFiles.length === 0) {
    console.log('  ⊘ No SVG source files found in icons/svg/ — skipping icon build');
    return;
  }

  const componentNames: string[] = [];

  for (const file of svgFiles) {
    const name = basename(file, '.svg');
    const componentName = toPascalCase(name);
    componentNames.push(componentName);

    const raw = readFileSync(resolve(SVG_SRC, file), 'utf-8');

    // Optimize SVG
    const optimized = optimize(raw, {
      plugins: [
        'preset-default',
        'removeDimensions',
        {
          name: 'addAttributesToSVGElement',
          params: { attributes: [{ fill: 'currentColor' }] },
        },
      ],
    });

    writeOutput(resolve(SVG_DIST, file), optimized.data);

    // Generate React component
    const tsx = await transform(optimized.data, {
      plugins: ['@svgr/plugin-jsx'],
      typescript: true,
      exportType: 'default',
      jsxRuntime: 'automatic',
      svgProps: {
        fill: 'currentColor',
        '{...props}': true,
      },
    }, { componentName });

    writeOutput(resolve(REACT_DIST, `${componentName}.tsx`), tsx);
  }

  // Barrel export
  const barrelLines = componentNames.map(
    (name) => `export { default as ${name} } from './${name}.js';`,
  );
  writeOutput(resolve(REACT_DIST, 'index.ts'), barrelLines.join('\n') + '\n');

  console.log(`  ✓ ${componentNames.length} icon(s) processed`);
}

console.log('Building MPDS icons...\n');
buildIcons().then(() => console.log('\nDone!'));
