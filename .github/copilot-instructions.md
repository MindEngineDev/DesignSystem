# MindEngine Design System - Copilot Instructions

## Architecture Overview

This is a **Figma-to-production design system** that auto-syncs design tokens from Figma Token Studio to generate live CSS/JS assets. The workflow is: Figma → GitHub webhook → Style Dictionary build → GitHub Pages deployment.

### Key Data Flow
- **Tokens**: `tokens/tokens.json` + `tokens/themes.json` → Style Dictionary → `site/dist/*.css|js|json`
- **Components**: `src/components/[name]/` → Manual consumption (no build step)
- **Development**: Express server (`server.mjs`) + Vite proxy for hot reloading

## Critical Workflows

### Token Management
```bash
# Manual token sync (if webhook fails)
npm run sync

# Build tokens to site/dist/
npm run tokens:build

# Watch for token changes
node scripts/sync-tokens.js --watch
```

### Component Creation
```bash
# Generates: src/components/[name]/{name.html,name.js,name.css,index.js}
npm run new component-name
```

**Required pattern**: lowercase-with-dashes, generates camelCase functions (`cardComponent()`)

## Component Architecture

### Dual-Framework Pattern
Every component supports both **Alpine.js** and **HTMX**:

```javascript
export function buttonComponent() {
  return {
    init() { console.log('button initialized'); }
  };
}

// Alpine.js integration
if (typeof Alpine !== 'undefined') {
  Alpine.data('buttonComponent', buttonComponent);
}

// HTMX integration  
if (typeof htmx !== 'undefined') {
  htmx.onLoad((el) => {
    if (el.dataset.component === 'button') {
      // HTMX-specific initialization
    }
  });
}
```

### CSS Token Usage
All styles MUST use CSS custom properties from token system:
```css
.button {
  background: var(--semantic-surface);
  border: 1px solid var(--semantic-border);
  border-radius: var(--radius-md);
  padding: var(--space-md);
}
```

**Never hardcode values** - use semantic tokens (`--semantic-*`) or design tokens (`--space-md`, `--radius-lg`, etc.)

## Token System Structure

### Semantic Color System
```json
"semantic": {
  "bg": "{color.light.100}",      // Main background
  "surface": "{color.light.200}",  // Cards, panels
  "border": "{color.light.300}",   // Borders
  "text": "{color.dark.100}",      // Primary text
  "brand": "{color.primary.500}",  // Brand color
  "cta": "{color.secondary.500}"   // Call-to-action
}
```

### Responsive Design Tokens
All spacing and font sizes use `clamp()` for fluid scaling:
```json
"space": {
  "md": "clamp(0.75rem, 0.7rem + 0.4vw, 1rem)"
}
```

## Development Setup

### Dual Server Architecture
1. **Express server** (`server.mjs`): Port 5173 - Static files + API endpoints
2. **Vite dev server**: Port 3000 - Proxies `/api` to Express

### Path Aliases (Vite)
```javascript
'@': './src'
'@tokens': './site/dist' 
'@components': './src/components'
```

## Figma Integration

### Auto-Sync Webhook
Configured in `.github/workflows/token-sync.yml` - triggers on `repository_dispatch` with `figma-tokens-update` event.

### Manual Sync Recovery
If webhook fails:
1. Check GitHub Actions logs
2. Run `npm run sync` locally
3. Verify `site/dist/tokens.css` updated
4. Use `scripts/setup-figma-webhook.js` for webhook config help

## Style Dictionary Config

**Location**: `config/sd.config.mjs`

**Outputs**:
- `site/dist/tokens.css` - Light theme variables
- `site/dist/tokens.dark.css` - Dark theme (`[data-theme="dark"]`)
- `site/dist/tokens.json` - Flat JSON for JS consumption
- `site/dist/tokens.module.js` - ES module export

## Framework Dependencies

**Production**: Alpine.js + HTMX + Shoelace + Pico CSS (loaded via CDN)
**Build**: Style Dictionary + PostCSS + Vite

## File Naming Conventions

- **Components**: `kebab-case` directories, generate `camelCase` functions
- **Tokens**: Use Style Dictionary naming (`color.semantic.brand`)
- **CSS Classes**: Match component directory name (`.button`, `.card`)

## Development Commands

```bash
npm run tokens:build    # Build design tokens only
npm run build          # Full build (tokens + CSS)
npm run new card       # Create new component
npm run sync           # Manual Figma token sync
```

## Common Patterns to Follow

1. **Always use semantic tokens** in component CSS
2. **Support both Alpine & HTMX** in component JS
3. **Component naming**: directory=class=data-component attribute
4. **Token changes**: Auto-deploy via GitHub Actions, manual fallback available
5. **Dark mode**: Handled automatically via `tokens.dark.css` and `[data-theme="dark"]`