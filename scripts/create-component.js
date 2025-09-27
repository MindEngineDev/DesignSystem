// scripts/create-component.js
#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const raw = (process.argv[2] || '').trim();

if (!raw || !/^[a-z-]+$/.test(raw)) {
  console.error('Usage: npm run new -- <component-name>');
  console.error('Name must be lowercase-with-dashes');
  process.exit(1);
}

const name = raw.toLowerCase();
const className = name.replace(/-([a-z])/g, (_, c) => c.toUpperCase()); // kebab -> camel
const baseDir = path.join(__dirname, '..', 'components', name);

await fs.mkdir(baseDir, { recursive: true });

await fs.writeFile(
  path.join(baseDir, `${name}.html`),
  `<!-- components/${name}/${name}.html -->
<div class="${name}" x-data="${className}Component()" data-component="${name}">
  <slot></slot>
</div>
`
);

await fs.writeFile(
  path.join(baseDir, `${name}.js`),
  `// components/${name}/${name}.js
export function ${className}Component() {
  return {
    init() {
      console.log('${name} initialized');
    }
  };
}

// Auto-register for Alpine if available (browser global)
if (typeof window !== 'undefined' && window.Alpine) {
  window.Alpine.data('${className}Component', ${className}Component);
}

// HTMX hook (optional)
if (typeof window !== 'undefined' && window.htmx) {
  window.htmx.onLoad((el) => {
    if (el.dataset && el.dataset.component === '${name}') {
      // initialize HTMX-enhanced behavior here if needed
    }
  });
}
`
);

await fs.writeFile(
  path.join(baseDir, `${name}.css`),
  `/* components/${name}/${name}.css */
.${name} {
  background: var(--semantic-surface, #f8fafc);
  border: 1px solid var(--semantic-border, #e2e8f0);
  border-radius: var(--radius-md, 8px);
  padding: var(--space-md, 1rem);
}`
);

await fs.writeFile(
  path.join(baseDir, 'index.js'),
  `export * from './${name}.js';`
);

console.log(\`✅ Created components/\${name}/ with HTML, CSS, JS\`);
