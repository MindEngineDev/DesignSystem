#!/usr/bin/env node
// scripts/scaffold-shoelace-components.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const shoelaceSource = path.join(rootDir, 'node_modules', '@shoelace-style', 'shoelace', 'dist', 'components');
const targetRoot = path.join(rootDir, 'components', 'shoelace');

function toNameVariants(component) {
  const camel = component.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  const pascal = camel.charAt(0).toUpperCase() + camel.slice(1);
  return {
    camel,
    pascal,
    alpineData: `${camel}Component`,
    exportName: `${pascal}Component`
  };
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function scaffoldComponent(name) {
  const { alpineData, exportName } = toNameVariants(name);
  const baseDir = path.join(targetRoot, name);

  await ensureDir(baseDir);

  const htmlPath = path.join(baseDir, `${name}.html`);
  const jsPath = path.join(baseDir, `${name}.js`);
  const cssPath = path.join(baseDir, `${name}.css`);
  const indexPath = path.join(baseDir, 'index.js');

  await fs.writeFile(
    htmlPath,
    `<!-- components/shoelace/${name}/${name}.html -->\n<sl-${name} class="sl-${name}" x-data="${alpineData}()" data-component="shoelace-${name}">\n  <slot></slot>\n</sl-${name}>\n`
  );

  await fs.writeFile(
    jsPath,
    `// components/shoelace/${name}/${name}.js\nexport function ${exportName}(initialProps = {}) {\n  return {\n    props: initialProps,\n    el: null,\n    init() {\n      this.el = this.$el.querySelector('sl-${name}');\n      this.apply(this.props);\n    },\n    update(newProps = {}) {\n      this.props = { ...this.props, ...newProps };\n      this.apply(newProps);\n    },\n    apply(source = {}) {\n      if (!this.el) return;\n      Object.entries(source).forEach(([key, value]) => {\n        if (value === undefined) return;\n        if (key in this.el) {\n          this.el[key] = value;\n        } else {\n          this.el.setAttribute(key, value);\n        }\n      });\n    }\n  };\n}\n\nif (typeof window !== 'undefined' && window.Alpine) {\n  window.Alpine.data('${alpineData}', ${exportName});\n}\n\nif (typeof window !== 'undefined' && window.htmx) {\n  window.htmx.onLoad((el) => {\n    const host = el.closest('[data-component="shoelace-${name}"]');\n    if (!host) return;\n    const alpine = window.Alpine;\n    if (!alpine) return;\n    alpine.discoverUninitializedComponents((componentEl) => {\n      if (componentEl === host) {\n        alpine.initializeComponent(componentEl);\n      }\n    });\n  });\n}\n`
  );

  await fs.writeFile(
    cssPath,
    `/* components/shoelace/${name}/${name}.css */\n.sl-${name} {\n  font-family: var(--font-base, Inter, system-ui, sans-serif);\n  color: var(--text, #1f2937);\n}\n`
  );

  await fs.writeFile(indexPath, `import './${name}.css';\nexport * from './${name}.js';\n`);

  console.log(`✅ Generated components/shoelace/${name}`);
}

async function scaffoldAll() {
  const entries = await fs.readdir(shoelaceSource, { withFileTypes: true });
  const components = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();

  await ensureDir(targetRoot);

  for (const component of components) {
    await scaffoldComponent(component);
  }

  const barrel = components.map((component) => `export * from './${component}';`).join('\n');
  await fs.writeFile(path.join(targetRoot, 'index.js'), `${barrel}\n`);
}

scaffoldAll().catch((error) => {
  console.error('❌ Failed to scaffold Shoelace components:', error);
  process.exitCode = 1;
});
