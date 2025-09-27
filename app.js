// app.js
import Alpine from "alpinejs";
import "@picocss/pico/css/pico.min.css";
import "@shoelace-style/shoelace/dist/themes/dark.css";
import "./styles/main.css";

import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
// Use CDN path for Shoelace assets in production builds so the dist/ site can
// fetch icons and other static files without exposing node_modules.
setBasePath(
  "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.1/dist",
);
import "./components/shoelace/index.js";

// Project-specific plugins
import registerAlpinePlugins from "./scripts/alpine.js";
import "./scripts/htmx-extension.js";

const DEFAULT_THEME = "dark";

function applyTheme(theme = DEFAULT_THEME) {
  if (typeof document === "undefined") return;
  const nextTheme = theme === "dark" ? "dark" : DEFAULT_THEME;
  document.documentElement.setAttribute("data-theme", nextTheme);
  document.documentElement.classList.toggle(
    "sl-theme-dark",
    nextTheme === "dark",
  );
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function joinAttributes(attributes) {
  return attributes.filter(Boolean).join(" ");
}

function formatMarkup(markup) {
  if (!markup) return "";
  const lines = markup
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  let depth = 0;
  const formatted = lines.map((line) => {
    const isClosing = /^<\//.test(line);
    const isSelfClosing =
      /\/>$/.test(line) || (line.includes("</") && !line.startsWith("</"));
    if (isClosing) {
      depth = Math.max(depth - 1, 0);
    }
    const current = `${"  ".repeat(depth)}${line}`;
    if (!isClosing && !isSelfClosing && /^<[a-z0-9-]+/i.test(line)) {
      depth += 1;
    }
    return current;
  });

  return formatted.join("\n");
}

function clamp(value, min, max) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return min;
  }
  return Math.min(Math.max(value, min), max);
}

const componentLibrary = [
  {
    id: "button",
    label: "Button",
    description: "Primary and secondary calls to action.",
    summary: "Experiment with variants, icons, and states for <sl-button>.",
    tags: ["Action", "Interactive"],
    controls: [
      {
        id: "label",
        type: "text",
        label: "Label",
        default: "Primary action",
        placeholder: "Button copy",
      },
      {
        id: "variant",
        type: "select",
        label: "Variant",
        default: "primary",
        options: [
          { value: "primary", label: "Primary" },
          { value: "neutral", label: "Neutral" },
          { value: "success", label: "Success" },
          { value: "danger", label: "Danger" },
          { value: "text", label: "Text" },
        ],
      },
      {
        id: "size",
        type: "select",
        label: "Size",
        default: "medium",
        options: [
          { value: "small", label: "Small" },
          { value: "medium", label: "Medium" },
          { value: "large", label: "Large" },
        ],
      },
      { id: "icon", type: "boolean", label: "Show icon", default: true },
      { id: "pill", type: "boolean", label: "Pill shape", default: false },
      { id: "caret", type: "boolean", label: "Caret", default: false },
      {
        id: "loading",
        type: "boolean",
        label: "Loading state",
        default: false,
      },
      { id: "disabled", type: "boolean", label: "Disabled", default: false },
    ],
    render(state) {
      const attr = joinAttributes([
        `variant="${state.variant}"`,
        state.size !== "medium" ? `size="${state.size}"` : "",
        state.pill ? "pill" : "",
        state.caret ? "caret" : "",
        state.loading ? "loading" : "",
        state.disabled ? "disabled" : "",
      ]);
      const openTag = attr ? `<sl-button ${attr}>` : "<sl-button>";
      const label = escapeHtml(state.label || "Primary action");
      if (state.icon) {
        return `
${openTag}
  <sl-icon slot="prefix" name="lightning-charge"></sl-icon>
  ${label}
</sl-button>
`.trim();
      }
      return `${openTag}${label}</sl-button>`;
    },
  },
  {
    id: "input",
    label: "Input field",
    description: "Single-line text entry with helper props.",
    summary: "Preview <sl-input> configurations for forms and settings.",
    tags: ["Form", "Text"],
    controls: [
      {
        id: "label",
        type: "text",
        label: "Label",
        default: "Project name",
        placeholder: "Visible label",
      },
      {
        id: "placeholder",
        type: "text",
        label: "Placeholder",
        default: "Type something…",
      },
      {
        id: "size",
        type: "select",
        label: "Size",
        default: "medium",
        options: [
          { value: "small", label: "Small" },
          { value: "medium", label: "Medium" },
          { value: "large", label: "Large" },
        ],
      },
      { id: "clearable", type: "boolean", label: "Clearable", default: true },
      { id: "disabled", type: "boolean", label: "Disabled", default: false },
    ],
    render(state) {
      const attr = joinAttributes([
        `label="${escapeHtml(state.label)}"`,
        state.placeholder
          ? `placeholder="${escapeHtml(state.placeholder)}"`
          : "",
        state.size !== "medium" ? `size="${state.size}"` : "",
        state.clearable ? "clearable" : "",
        state.disabled ? "disabled" : "",
      ]);
      const openTag = attr
        ? `<sl-input ${attr}></sl-input>`
        : "<sl-input></sl-input>";
      return openTag;
    },
  },
  {
    id: "alert",
    label: "Alert",
    description: "Inline feedback for success, warning, or error states.",
    summary: "Dial semantic messaging with <sl-alert> variants and icons.",
    tags: ["Feedback"],
    controls: [
      {
        id: "variant",
        type: "select",
        label: "Variant",
        default: "success",
        options: [
          { value: "primary", label: "Primary" },
          { value: "success", label: "Success" },
          { value: "warning", label: "Warning" },
          { value: "danger", label: "Danger" },
          { value: "neutral", label: "Neutral" },
        ],
      },
      {
        id: "title",
        type: "text",
        label: "Title",
        default: "Deployment ready",
      },
      {
        id: "message",
        type: "text",
        label: "Message",
        default: "All checks have passed. Ship it!",
      },
      {
        id: "icon",
        type: "select",
        label: "Icon",
        default: "rocket-takeoff",
        options: [
          { value: "rocket-takeoff", label: "Rocket" },
          { value: "check2-circle", label: "Check" },
          { value: "exclamation-triangle", label: "Warning" },
          { value: "info-circle", label: "Info" },
        ],
      },
      { id: "showIcon", type: "boolean", label: "Show icon", default: true },
      { id: "open", type: "boolean", label: "Open", default: true },
      { id: "closable", type: "boolean", label: "Closable", default: true },
    ],
    render(state) {
      const attr = joinAttributes([
        `variant="${state.variant}"`,
        state.open ? "open" : "",
        state.closable ? "closable" : "",
      ]);
      const openTag = attr ? `<sl-alert ${attr}>` : "<sl-alert>";
      const body = [];
      if (state.showIcon) {
        body.push(`  <sl-icon slot="icon" name="${state.icon}"></sl-icon>`);
      }
      if (state.title) {
        body.push(`  <strong>${escapeHtml(state.title)}</strong>`);
      }
      if (state.message) {
        body.push(`  <p>${escapeHtml(state.message)}</p>`);
      }
      const content = body.length ? `\n${body.join("\n")}\n` : "";
      return `${openTag}${content}</sl-alert>`;
    },
  },
  {
    id: "progress",
    label: "Progress bar",
    description: "Track completion for async work.",
    summary: "Adjust value, label, and stripes on <sl-progress-bar>.",
    tags: ["Feedback", "Motion"],
    controls: [
      {
        id: "value",
        type: "number",
        label: "Value",
        default: 64,
        min: 0,
        max: 100,
      },
      {
        id: "label",
        type: "text",
        label: "Accessible label",
        default: "Deploying build",
      },
      {
        id: "indeterminate",
        type: "boolean",
        label: "Indeterminate",
        default: false,
      },
      { id: "striped", type: "boolean", label: "Striped", default: false },
    ],
    render(state) {
      const value = clamp(state.value, 0, 100);
      const attr = joinAttributes([
        state.indeterminate ? "indeterminate" : `value="${value}"`,
        state.label ? `label="${escapeHtml(state.label)}"` : "",
        state.striped ? "striped" : "",
      ]);
      const openTag = attr
        ? `<sl-progress-bar ${attr}></sl-progress-bar>`
        : "<sl-progress-bar></sl-progress-bar>";
      return openTag;
    },
  },
  {
    id: "switch",
    label: "Switch",
    description: "Toggle boolean values with smooth animation.",
    summary: "Configure <sl-switch> states, sizes, and labels.",
    tags: ["Form", "Interactive"],
    controls: [
      {
        id: "label",
        type: "text",
        label: "Label",
        default: "Enable notifications",
        placeholder: "Switch label",
      },
      {
        id: "size",
        type: "select",
        label: "Size",
        default: "medium",
        options: [
          { value: "small", label: "Small" },
          { value: "medium", label: "Medium" },
          { value: "large", label: "Large" },
        ],
      },
      { id: "checked", type: "boolean", label: "Checked", default: true },
      { id: "disabled", type: "boolean", label: "Disabled", default: false },
    ],
    render(state) {
      const attr = joinAttributes([
        state.size !== "medium" ? `size="${state.size}"` : "",
        state.checked ? "checked" : "",
        state.disabled ? "disabled" : "",
      ]);
      const openTag = attr ? `<sl-switch ${attr}>` : "<sl-switch>";
      return `${openTag}${escapeHtml(state.label || "Enable notifications")}</sl-switch>`;
    },
  },
  {
    id: "select",
    label: "Select",
    description: "Dropdown selection with search and multi-select.",
    summary: "Build <sl-select> dropdowns with various options.",
    tags: ["Form", "Selection"],
    controls: [
      {
        id: "label",
        type: "text",
        label: "Label",
        default: "Choose framework",
        placeholder: "Select label",
      },
      {
        id: "placeholder",
        type: "text",
        label: "Placeholder",
        default: "Select an option...",
      },
      {
        id: "size",
        type: "select",
        label: "Size",
        default: "medium",
        options: [
          { value: "small", label: "Small" },
          { value: "medium", label: "Medium" },
          { value: "large", label: "Large" },
        ],
      },
      { id: "clearable", type: "boolean", label: "Clearable", default: true },
      { id: "multiple", type: "boolean", label: "Multiple", default: false },
      { id: "disabled", type: "boolean", label: "Disabled", default: false },
    ],
    render(state) {
      const attr = joinAttributes([
        `label="${escapeHtml(state.label)}"`,
        state.placeholder
          ? `placeholder="${escapeHtml(state.placeholder)}"`
          : "",
        state.size !== "medium" ? `size="${state.size}"` : "",
        state.clearable ? "clearable" : "",
        state.multiple ? "multiple" : "",
        state.disabled ? "disabled" : "",
      ]);
      const openTag = attr ? `<sl-select ${attr}>` : "<sl-select>";
      return `${openTag}
  <sl-option value="react">React</sl-option>
  <sl-option value="vue">Vue</sl-option>
  <sl-option value="angular">Angular</sl-option>
  <sl-option value="svelte">Svelte</sl-option>
</sl-select>`;
    },
  },
  {
    id: "checkbox",
    label: "Checkbox",
    description: "Multi-select options with intermediate states.",
    summary: "Style <sl-checkbox> components with various states.",
    tags: ["Form", "Selection"],
    controls: [
      {
        id: "label",
        type: "text",
        label: "Label",
        default: "Accept terms",
        placeholder: "Checkbox label",
      },
      {
        id: "size",
        type: "select",
        label: "Size",
        default: "medium",
        options: [
          { value: "small", label: "Small" },
          { value: "medium", label: "Medium" },
          { value: "large", label: "Large" },
        ],
      },
      { id: "checked", type: "boolean", label: "Checked", default: false },
      {
        id: "indeterminate",
        type: "boolean",
        label: "Indeterminate",
        default: false,
      },
      { id: "disabled", type: "boolean", label: "Disabled", default: false },
    ],
    render(state) {
      const attr = joinAttributes([
        state.size !== "medium" ? `size="${state.size}"` : "",
        state.checked ? "checked" : "",
        state.indeterminate ? "indeterminate" : "",
        state.disabled ? "disabled" : "",
      ]);
      const openTag = attr ? `<sl-checkbox ${attr}>` : "<sl-checkbox>";
      return `${openTag}${escapeHtml(state.label || "Accept terms")}</sl-checkbox>`;
    },
  },
  {
    id: "radio",
    label: "Radio Group",
    description: "Single-select from multiple options.",
    summary: "Configure <sl-radio-group> with radio buttons.",
    tags: ["Form", "Selection"],
    controls: [
      {
        id: "label",
        type: "text",
        label: "Label",
        default: "Deployment target",
        placeholder: "Group label",
      },
      {
        id: "size",
        type: "select",
        label: "Size",
        default: "medium",
        options: [
          { value: "small", label: "Small" },
          { value: "medium", label: "Medium" },
          { value: "large", label: "Large" },
        ],
      },
      { id: "disabled", type: "boolean", label: "Disabled", default: false },
    ],
    render(state) {
      const groupAttr = joinAttributes([
        `label="${escapeHtml(state.label)}"`,
        'value="production"',
      ]);
      const radioAttr = joinAttributes([
        state.size !== "medium" ? `size="${state.size}"` : "",
        state.disabled ? "disabled" : "",
      ]);
      const radioTag = radioAttr ? `<sl-radio ${radioAttr}` : "<sl-radio";
      return `<sl-radio-group ${groupAttr}>
  ${radioTag} value="development">Development</sl-radio>
  ${radioTag} value="staging">Staging</sl-radio>
  ${radioTag} value="production">Production</sl-radio>
</sl-radio-group>`;
    },
  },
  {
    id: "card",
    label: "Card",
    description: "Flexible content container with header and footer.",
    summary: "Design <sl-card> layouts with various content sections.",
    tags: ["Layout", "Container"],
    controls: [
      {
        id: "header",
        type: "text",
        label: "Header",
        default: "Project Settings",
        placeholder: "Card header",
      },
      {
        id: "content",
        type: "text",
        label: "Content",
        default:
          "Configure your project deployment options and environment variables.",
      },
      {
        id: "showFooter",
        type: "boolean",
        label: "Show footer",
        default: true,
      },
      {
        id: "shadowDepth",
        type: "select",
        label: "Shadow",
        default: "medium",
        options: [
          { value: "none", label: "None" },
          { value: "small", label: "Small" },
          { value: "medium", label: "Medium" },
          { value: "large", label: "Large" },
        ],
      },
    ],
    render(state) {
      const cardClass =
        state.shadowDepth !== "medium"
          ? ` class="card-${state.shadowDepth}"`
          : "";
      let content = `<sl-card${cardClass}>`;
      if (state.header) {
        content += `\n  <div slot="header">${escapeHtml(state.header)}</div>`;
      }
      content += `\n  ${escapeHtml(state.content || "Card content goes here.")}`;
      if (state.showFooter) {
        content += `\n  <div slot="footer">
    <sl-button variant="primary">Save Changes</sl-button>
    <sl-button>Cancel</sl-button>
  </div>`;
      }
      content += "\n</sl-card>";
      return content;
    },
  },
  {
    id: "badge",
    label: "Badge",
    description: "Small status indicators and counters.",
    summary: "Style <sl-badge> components with variants and positions.",
    tags: ["Indicator", "Status"],
    controls: [
      {
        id: "content",
        type: "text",
        label: "Content",
        default: "12",
        placeholder: "Badge text",
      },
      {
        id: "variant",
        type: "select",
        label: "Variant",
        default: "primary",
        options: [
          { value: "primary", label: "Primary" },
          { value: "success", label: "Success" },
          { value: "neutral", label: "Neutral" },
          { value: "warning", label: "Warning" },
          { value: "danger", label: "Danger" },
        ],
      },
      { id: "pill", type: "boolean", label: "Pill shape", default: false },
      {
        id: "pulse",
        type: "boolean",
        label: "Pulse animation",
        default: false,
      },
    ],
    render(state) {
      const attr = joinAttributes([
        `variant="${state.variant}"`,
        state.pill ? "pill" : "",
        state.pulse ? "pulse" : "",
      ]);
      const openTag = attr ? `<sl-badge ${attr}>` : "<sl-badge>";
      return `${openTag}${escapeHtml(state.content || "12")}</sl-badge>`;
    },
  },
  {
    id: "textarea",
    label: "Textarea",
    description: "Multi-line text input with resize options.",
    summary: "Configure <sl-textarea> with rows, resize, and validation.",
    tags: ["Form", "Text"],
    controls: [
      {
        id: "label",
        type: "text",
        label: "Label",
        default: "Description",
        placeholder: "Field label",
      },
      {
        id: "placeholder",
        type: "text",
        label: "Placeholder",
        default: "Enter a detailed description...",
      },
      {
        id: "rows",
        type: "number",
        label: "Rows",
        default: 4,
        min: 2,
        max: 10,
      },
      {
        id: "resize",
        type: "select",
        label: "Resize",
        default: "vertical",
        options: [
          { value: "none", label: "None" },
          { value: "vertical", label: "Vertical" },
          { value: "auto", label: "Auto" },
        ],
      },
      { id: "disabled", type: "boolean", label: "Disabled", default: false },
    ],
    render(state) {
      const attr = joinAttributes([
        `label="${escapeHtml(state.label)}"`,
        state.placeholder
          ? `placeholder="${escapeHtml(state.placeholder)}"`
          : "",
        `rows="${state.rows}"`,
        state.resize !== "vertical" ? `resize="${state.resize}"` : "",
        state.disabled ? "disabled" : "",
      ]);
      return `<sl-textarea ${attr}></sl-textarea>`;
    },
  },
  {
    id: "spinner",
    label: "Spinner",
    description: "Loading indicators with size variants.",
    summary: "Display <sl-spinner> components for loading states.",
    tags: ["Feedback", "Loading"],
    controls: [
      {
        id: "size",
        type: "select",
        label: "Size",
        default: "medium",
        options: [
          { value: "small", label: "Small" },
          { value: "medium", label: "Medium" },
          { value: "large", label: "Large" },
        ],
      },
    ],
    render(state) {
      const attr =
        state.size !== "medium"
          ? ` style="font-size: ${state.size === "small" ? "1rem" : state.size === "large" ? "3rem" : "2rem"}"`
          : "";
      return `<sl-spinner${attr}></sl-spinner>`;
    },
  },
];

applyTheme(DEFAULT_THEME);

if (typeof window !== "undefined") {
  window.builderApp = function builderApp() {
    return {
      components: componentLibrary,
      activeId: (function () {
        // honor ?component=<id> query parameter to deep-link into builder
        try {
          const params = new URLSearchParams(window.location.search);
          const fromQuery = params.get("component");
          if (fromQuery && componentLibrary.some((c) => c.id === fromQuery))
            return fromQuery;
        } catch (e) {
          // ignore in non-browser contexts
        }
        return componentLibrary[0]?.id ?? null;
      })(),
      showDashboard: true,
      controlValues: {},
      init() {
        this.components.forEach((component) => {
          this.controlValues[component.id] = component.controls.reduce(
            (acc, control) => {
              acc[control.id] = control.default;
              return acc;
            },
            {},
          );
        });
      },
      toggleDashboard() {
        this.showDashboard = !this.showDashboard;
      },
      setActive(id) {
        this.activeId = id;
      },
      activeComponent() {
        return (
          this.components.find((component) => component.id === this.activeId) ??
          this.components[0] ??
          null
        );
      },
      activeControls() {
        return this.activeComponent()?.controls ?? [];
      },
      updateControl(controlId, value) {
        if (!this.controlValues[this.activeId]) return;
        this.controlValues[this.activeId][controlId] = value;
      },
      previewMarkup() {
        const component = this.activeComponent();
        if (!component) return "";
        const state = this.controlValues[this.activeId] ?? {};
        return component.render(state);
      },
      rawMarkup() {
        return this.previewMarkup();
      },
      prettyMarkup() {
        return formatMarkup(this.previewMarkup());
      },
      copyMarkup() {
        const markup = this.rawMarkup();
        if (!markup) return;
        if (navigator?.clipboard?.writeText) {
          navigator.clipboard.writeText(markup).catch(() => {});
          return;
        }
        const textarea = document.createElement("textarea");
        textarea.value = markup;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      },
      /* Preview the current component in a new window */
      openPreview() {
        const markup = this.rawMarkup();
        // Collect current document styles (link[rel=stylesheet] and inline <style>)
        const nodes = Array.from(
          document.querySelectorAll('link[rel="stylesheet"], style'),
        );
        const headHtml = nodes
          .map((node) => {
            if (node.tagName.toLowerCase() === "link") {
              const href = node.getAttribute("href") || "";
              // Preserve absolute and relative hrefs
              return `<link rel="stylesheet" href="${href}">`;
            }
            return `<style>${node.innerHTML}</style>`;
          })
          .join("\n");

        const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Preview</title>${headHtml}</head><body>${markup}</body></html>`;
        const w = window.open("", "_blank");
        if (!w) return;
        w.document.write(html);
        w.document.close();
      },

      /* Download current markup as an HTML file */
      downloadMarkup() {
        const content = this.rawMarkup();
        if (!content) return;
        const blob = new Blob([content], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${this.activeId || "component"}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      },

      /* Presets: save and load control values per component */
      savePreset() {
        try {
          const name = prompt("Preset name");
          if (!name) return;
          const key = `ds_presets_${this.activeId}`;
          const existing = JSON.parse(localStorage.getItem(key) || "[]");
          existing.push({ name, values: this.controlValues[this.activeId] });
          localStorage.setItem(key, JSON.stringify(existing));
          return true;
        } catch (e) {
          console.warn("Failed to save preset", e);
        }
      },

      loadPresets() {
        try {
          const key = `ds_presets_${this.activeId}`;
          return JSON.parse(localStorage.getItem(key) || "[]");
        } catch (e) {
          return [];
        }
      },

      applyPreset(index) {
        try {
          const presets = this.loadPresets();
          const p = presets[Number(index)];
          if (!p) return;
          this.controlValues[this.activeId] = Object.assign(
            {},
            this.controlValues[this.activeId],
            p.values,
          );
        } catch (e) {
          console.warn("applyPreset failed", e);
        }
      },
    };
  };
}

window.Alpine = Alpine;
// Register local Alpine plugins (non-blocking)
try {
  if (typeof registerAlpinePlugins === "function") {
    registerAlpinePlugins(Alpine);
  }
} catch (err) {
  // eslint-disable-next-line no-console
  console.warn("Alpine plugin registration failed:", err);
}

Alpine.start();
