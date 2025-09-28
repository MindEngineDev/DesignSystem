// Local builder app for design-studio (self-contained)
// Exposes `builderApp()` for Alpine to mount. Uses a small component library
// and helper functions similar to the root app but scoped here so the builder
// works without importing files outside `design-studio`.

// Quick testing notes:
// 1) Open `design-studio/builder.html` in a browser (or via the dev server preview).
// 2) The page mounts Alpine with `x-data="builderApp()"`. If it doesn't, you can run:
//      window.builderApp && Alpine.start();
//    or manually attach: document.querySelector('[x-data]').__x.$data = window.builderApp();
// 3) Select components from the left, change controls, and watch the preview update.
// 4) Use the "Open preview" or "Copy markup" actions to validate output.
// 5) This module is intentionally self-contained and doesn't depend on files outside `design-studio`.

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
    const isSelfClosing = /\/>$/.test(line) || (line.includes("</") && !line.startsWith("</"));
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
  if (typeof value !== "number" || Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

const componentLibrary = [
  {
    id: "button",
    label: "Button",
    description: "Primary call to action",
    controls: [
      { id: "label", type: "text", label: "Label", default: "Primary" },
      {
        id: "variant",
        type: "select",
        label: "Variant",
        default: "primary",
        options: [
          { value: "primary", label: "Primary" },
          { value: "neutral", label: "Neutral" },
          { value: "danger", label: "Danger" },
        ],
      },
      { id: "loading", type: "boolean", label: "Loading", default: false },
    ],
    render(state) {
      const attr = joinAttributes([state.variant ? `variant=\"${escapeHtml(state.variant)}\"` : "", state.loading ? "loading" : ""]);
      const label = escapeHtml(state.label || "Primary");
      return `<sl-button ${attr}>${state.loading ? '<sl-spinner slot="prefix"></sl-spinner>' : ""}${label}</sl-button>`;
    },
  },
  {
    id: "input",
    label: "Input",
    description: "Single-line input",
    controls: [
      { id: "label", type: "text", label: "Label", default: "Name" },
      { id: "placeholder", type: "text", label: "Placeholder", default: "Enter value" },
      { id: "disabled", type: "boolean", label: "Disabled", default: false },
    ],
    render(state) {
      const attr = joinAttributes([state.placeholder ? `placeholder=\"${escapeHtml(state.placeholder)}\"` : "", state.disabled ? "disabled" : ""]);
      return `<sl-input ${attr}></sl-input>`;
    },
  },
  {
    id: "alert",
    label: "Alert",
    description: "Inline feedback",
    controls: [
      {
        id: "variant",
        type: "select",
        label: "Variant",
        default: "success",
        options: [
          { value: "success", label: "Success" },
          { value: "warning", label: "Warning" },
          { value: "danger", label: "Danger" },
        ],
      },
      { id: "title", type: "text", label: "Title", default: "Heads up" },
      { id: "open", type: "boolean", label: "Open", default: true },
    ],
    render(state) {
      const attr = joinAttributes([state.open ? "open" : "", state.variant ? `variant=\"${escapeHtml(state.variant)}\"` : ""]);
      const body = state.title ? `<strong>${escapeHtml(state.title)}</strong>` : "";
      return `<sl-alert ${attr}>${body}</sl-alert>`;
    },
  },
];

export function builderApp() {
  return {
    components: componentLibrary,
    activeId: componentLibrary[0]?.id ?? null,
    controlValues: {},
    init() {
      this.components.forEach((c) => {
        this.controlValues[c.id] = (c.controls || []).reduce((acc, ctrl) => {
          acc[ctrl.id] = ctrl.default;
          return acc;
        }, {});
      });
    },
    setActive(id) {
      this.activeId = id;
    },
    activeComponent() {
      return this.components.find((c) => c.id === this.activeId) ?? this.components[0];
    },
    activeControls() {
      return this.activeComponent()?.controls ?? [];
    },
    previewMarkup() {
      const c = this.activeComponent();
      if (!c) return "";
      const state = this.controlValues[this.activeId] || {};
      return c.render(state);
    },
    prettyMarkup() {
      return formatMarkup(this.previewMarkup());
    },
    copyMarkup() {
      const markup = this.previewMarkup();
      if (!markup) return;
      if (navigator?.clipboard?.writeText) return navigator.clipboard.writeText(markup).catch(() => {});
      const ta = document.createElement("textarea");
      ta.value = markup;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    },
    openPreview() {
      const markup = `<!doctype html><html><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.1/cdn/themes/dark.css\"></head><body>${this.previewMarkup()}</body></html>`;
      const w = window.open("", "_blank");
      if (!w) return;
      w.document.write(markup);
      w.document.close();
    },
  };
}

// attach globally for inline Alpine usage
if (typeof window !== "undefined") {
  window.builderApp = builderApp;
}

export default builderApp;
