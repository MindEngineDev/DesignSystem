#!/usr/bin/env node
// scripts/create-component.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const componentsDir = path.join(rootDir, 'components', 'ui');

const rawName = (process.argv[2] || '').trim();

if (!rawName || !/^[a-z-]+$/.test(rawName)) {
  console.error('Usage: npm run new -- <component-name>');
  console.error('Name must be lowercase-with-dashes');
  process.exit(1);
}

const name = rawName.toLowerCase();
const alpineName = name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const targetDir = path.join(componentsDir, name);

await fs.mkdir(targetDir, { recursive: true });

await fs.writeFile(
  path.join(targetDir, `${name}.html`),
  `<!-- components/ui/${name}/${name}.html -->\n<div class="${name}" x-data="${alpineName}Component(initialProps)" data-component="ui-${name}">\n  <slot></slot>\n</div>\n`
);

await fs.writeFile(
  path.join(targetDir, `${name}.js`),
  `// components/ui/${name}/${name}.js\nexport function ${alpineName}Component(initialProps = {}) {\n  return {\n    props: initialProps,\n    el: null,\n    init() {\n      this.el = this.$el;\n      this.apply(this.props);\n    },\n    update(newProps = {}) {\n      this.props = { ...this.props, ...newProps };\n      this.apply(newProps);\n    },\n    apply(source = {}) {\n      if (!this.el) return;\n      Object.entries(source).forEach(([key, value]) => {\n        if (value === undefined) return;\n        this.el.setAttribute(key, value);\n      });\n    }\n  };\n}\n\nif (typeof window !== 'undefined' && window.Alpine) {\n  window.Alpine.data('${alpineName}Component', ${alpineName}Component);\n}\n\nif (typeof window !== 'undefined' && window.htmx) {\n  window.htmx.onLoad((el) => {\n    const host = el.closest('[data-component="ui-${name}"]');\n    if (host && window.Alpine) {\n      window.Alpine.discoverUninitializedComponents((componentEl) => {\n        if (componentEl === host) {\n          window.Alpine.initializeComponent(componentEl);\n        }\n      });\n    }\n  });\n}\n`
);

await fs.writeFile(
  path.join(targetDir, `${name}.css`),
  `/* components/ui/${name}/${name}.css */\n.${name} {\n  background: var(--surface, #f1f5f9);\n  border: 1px solid var(--border, #e2e8f0);\n  border-radius: var(--radius-md, 10px);\n  padding: var(--space-md, 1rem);\n  color: var(--text, #1f2937);\n  font-family: var(--font-base, Inter, system-ui, sans-serif);\n}`
);

await fs.writeFile(
  path.join(targetDir, 'index.js'),
  `export * from './${name}.js';\n`
);

console.log(`✅ Created components/ui/${name}/ with HTML, CSS, and JS`);
