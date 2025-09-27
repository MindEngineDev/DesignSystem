// Central site bootstrap for public views
// - Initializes theme toggle wiring
// - Boots any global behavior needed by preview pages

const root = document.documentElement;

function initThemeToggle() {
  const t = document.querySelector("#themeToggle");
  if (!t) return;
  const prefers = matchMedia("(prefers-color-scheme: dark)").matches;
  root.setAttribute("data-theme", prefers ? "dark" : "light");
  t.checked = prefers;
  t.addEventListener("sl-change", (e) => {
    root.setAttribute("data-theme", e.target.checked ? "dark" : "light");
  });
}

function init() {
  // Future: import/initialize Alpine plugins, htmx, layout scripts
  initThemeToggle();
}

// Run on DOMContentLoaded so HTML markup is available
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

export { init };
// Public main entry for view pages
// Re-export commonly used helpers from the layout scripts so
// view pages can import a single module path (no bundling required).
export {
  setupPagination,
  setupFilter,
  setupTabs,
} from "../scripts/layout/views/views.js";

// Additional re-exports can be added here as needed, e.g. admin helpers
// export { setupUserFilter, setupUserPagination } from '/scripts/layout/admin.js';
