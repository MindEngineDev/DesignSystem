#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const name = process.argv[2];

if (!name || !/^[a-z-]+$/.test(name)) {
  console.error('Usage: npm run new <component-name>');
  console.error('Name must be lowercase with dashes');
  process.exit(1);
}

const componentDir = path.join(__dirname, '../src/components', name);
await fs.mkdir(componentDir, { recursive: true });

const className = name.replace(/-/g, '');

await fs.writeFile(path.join(componentDir, `${name}.html`), `<div class="${name}" x-data="${className}Component()" data-component="${name}">
  <slot></slot>
</div>`);

await fs.writeFile(path.join(componentDir, `${name}.js`), `export function ${className}Component() {
  return {
    init() {
      console.log('${name} initialized');
    }
  };
}

if (typeof Alpine !== 'undefined') {
  Alpine.data('${className}Component', ${className}Component);
}

if (typeof htmx !== 'undefined') {
  htmx.onLoad((el) => {
    if (el.dataset.component === '${name}') {
      // HTMX init
    }
  });
}`);

await fs.writeFile(path.join(componentDir, `${name}.css`), `.${name} {
  background: var(--semantic-surface);
  border: 1px solid var(--semantic-border);
  border-radius: var(--radius-md);
  padding: var(--space-md);
}`);

await fs.writeFile(path.join(componentDir, 'index.js'), `export * from './${name}.js';`);

console.log(`✅ Created component: ${name}`);
