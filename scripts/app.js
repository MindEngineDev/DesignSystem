// src/js/app.js
// Single entrypoint for all UI logic and helpers: Shoelace, Alpine, Pico, htmx, forms, tables, tabs, theme, etc.

// --- Shoelace base path (so all assets load from CDN)
import { setBasePath } from "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace/dist/utilities/base-path.js";
setBasePath("https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.1/dist");

// --- Load Shoelace (components), Pico (layout), Font Awesome (icons) via CDN
import "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace/dist/shoelace.js";
const injectStyle = (href) => {
  const l = document.createElement("link");
  l.rel = "stylesheet";
  l.href = href;
  document.head.appendChild(l);
};
injectStyle("https://unpkg.com/@picocss/pico@2.0.6/css/pico.min.css");
injectStyle("https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace/dist/themes/dark.css");
injectStyle("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css");

// --- Alpine.js setup (CDN ESM)
import Alpine from "https://unpkg.com/alpinejs@3.x.x/dist/module.esm.js";
// Example: auto-focus directive
Alpine.directive("focus", (el) => requestAnimationFrame(() => el.focus()));
window.Alpine = Alpine;
Alpine.start();

// --- Theme switch (dark by default)
const DEFAULT_THEME = "dark";
function applyTheme(theme = DEFAULT_THEME) {
  const next = theme === "dark" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", next);
  document.documentElement.classList.toggle("sl-theme-dark", next === "dark");
}
(function initTheme() {
  const prefersDark = matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(prefersDark ? "dark" : "light");
})();
// Theme toggle (Shoelace switch)
document.addEventListener("DOMContentLoaded", () => {
  const t = document.querySelector("#themeToggle");
  if (t) {
    const prefersDark = matchMedia("(prefers-color-scheme: dark)").matches;
    t.checked = prefersDark;
    t.addEventListener("sl-change", (e) => applyTheme(e.target.checked ? "dark" : "light"));
  }
});

// --- UTILS (selectors, toggles)
const qs = (s, el = document) => el.querySelector(s);
const qsa = (s, el = document) => [...el.querySelectorAll(s)];

// --- Sidebar toggle (if present)
qs("#menuToggle")?.addEventListener("click", () => qs("#sidebar")?.classList.toggle("open"));

// --- Table helpers: filter + pagination + responsive data-labels
export function setupFilter(inputId, tableId) {
  qs(`#${inputId}`)?.addEventListener("sl-input", (e) => {
    const term = (e.target.value || "").toLowerCase();
    qsa(`#${tableId} tbody tr`).forEach((tr) => {
      tr.style.display = tr.textContent.toLowerCase().includes(term) ? "" : "none";
    });
  });
}

export function setupPagination(tableId, pagerId, pageSize = 10) {
  const rows = qsa(`#${tableId} tbody tr`);
  let page = 0;
  const infoEl = qs(`#${pagerId} .info`);
  function render() {
    rows.forEach((tr, i) => (tr.style.display = Math.floor(i / pageSize) === page ? "" : "none"));
    if (infoEl) infoEl.textContent = `Page ${page + 1} / ${Math.max(1, Math.ceil(rows.length / pageSize))}`;
  }
  qs(`#${pagerId} .prev`)?.addEventListener("click", () => {
    page = Math.max(0, page - 1);
    render();
  });
  qs(`#${pagerId} .next`)?.addEventListener("click", () => {
    page = Math.min(Math.ceil(rows.length / pageSize) - 1, page + 1);
    render();
  });
  render();
}

export function labelizeTable(tableId) {
  const headers = qsa(`#${tableId} thead th`).map((th) => th.textContent.trim());
  qsa(`#${tableId} tbody tr`).forEach((tr) => {
    qsa("td", tr).forEach((td, i) => td.setAttribute("data-label", headers[i] || ""));
  });
}

// --- Tabs utility
export function setupTabs(rootSel) {
  const root = qs(rootSel);
  if (!root) return;
  const tabs = qsa("[data-tab]", root),
    panes = qsa("[data-pane]", root);
  tabs.forEach((t) =>
    t.addEventListener("click", () => {
      tabs.forEach((tt) => tt.classList.toggle("active", tt === t));
      const target = t.getAttribute("data-tab");
      panes.forEach((p) => (p.hidden = p.getAttribute("data-pane") !== target));
    })
  );
}

// --- Form helpers: serialize, demo preview, sample data, clear, copy, etc.
function serializeForm(form) {
  const data = {},
    fm = new FormData(form);
  for (const [k, v] of fm.entries()) {
    if (Object.prototype.hasOwnProperty.call(data, k)) {
      if (Array.isArray(data[k])) data[k].push(v);
      else data[k] = [data[k], v];
    } else data[k] = v;
  }
  form.querySelectorAll("sl-input[name], sl-select[name], sl-textarea[name]").forEach((el) => {
    const name = el.getAttribute("name");
    if (name)
      try {
        data[name] = el.value;
      } catch {}
  });
  return data;
}
export function attachFormDemo(form) {
  const preview = document.createElement("pre");
  preview.className = "forms__preview muted";
  const controls = document.createElement("div");
  controls.className = "forms__controls";
  const fill = document.createElement("button");
  fill.type = "button";
  fill.className = "secondary";
  fill.textContent = "Fill sample data";
  const clear = document.createElement("button");
  clear.type = "button";
  clear.className = "contrast";
  clear.textContent = "Clear";
  const copy = document.createElement("button");
  copy.type = "button";
  copy.className = "secondary";
  copy.textContent = "Copy JSON";
  controls.append(fill, clear, copy);
  const wrap = document.createElement("div");
  wrap.className = "forms__demo";
  form.parentNode.insertBefore(wrap, form.nextSibling);
  wrap.append(controls, preview);
  const update = () => (preview.textContent = JSON.stringify(serializeForm(form), null, 2));
  form.addEventListener("input", update);
  form.addEventListener("change", update);
  copy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(preview.textContent);
      copy.textContent = "Copied";
      setTimeout(() => (copy.textContent = "Copy JSON"), 900);
    } catch {}
  });
  fill.addEventListener("click", () => {
    form.querySelectorAll("input, textarea, select, sl-input, sl-textarea, sl-select").forEach((el) => {
      const name = el.getAttribute("name") || el.id || "";
      if (!name) return;
      if ((el.type === "checkbox" || el.getAttribute("type") === "checkbox") && !el.matches("[multiple]")) el.checked = true;
      else if (el.type === "radio") el.checked = true;
      else if (el.tagName.toLowerCase().startsWith("sl-")) {
        try {
          el.value = el.getAttribute("data-sample") || "Sample " + name;
          el.dispatchEvent(new Event("sl-change"));
        } catch {}
      } else if (el.tagName.toLowerCase() === "select") {
        if (el.options?.length) el.selectedIndex = 0;
      } else if (el.type !== "file") el.value = el.getAttribute("placeholder") || "Sample " + name;
    });
    update();
  });
  clear.addEventListener("click", () => {
    form.reset();
    form.querySelectorAll("sl-input, sl-select, sl-textarea").forEach((el) => {
      try {
        el.value = "";
        el.dispatchEvent(new Event("sl-change"));
      } catch {}
    });
    update();
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity?.();
      form.querySelector(":invalid")?.focus();
      return;
    }
    console.log("Form submit data:", serializeForm(form));
  });
  update();
}
(function bootForms() {
  document.querySelectorAll("form.demo-form").forEach(attachFormDemo);
})();

// --- Shoelace: Log all htmx requests (for debug/dev)
if (window.htmx?.defineExtension) {
  window.htmx.defineExtension("logRequests", {
    onEvent(name, evt) {
      if (name === "htmx:configRequest") {
        console.log("Request to:", evt.detail.path);
      }
    },
  });
}

// --- Expose all main helpers on window for Alpine/htmx inline use
window.FW = {
  applyTheme,
  setupFilter,
  setupPagination,
  labelizeTable,
  setupTabs,
  attachFormDemo,
  Alpine,
};

// --- READY: You can now import this in every HTML page with
// <script type="module" src="/src/js/app.js"></script>
