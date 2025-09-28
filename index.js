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

function init() {initThemeToggle();}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
export { init };
export { setupPagination, setupFilter, setupTabs } from "../scripts/layout/views/views.js";

document.addEventListener("alpine:init", () => {
  Alpine.data("landing", () => ({
    showLogin: false,
    enterStudio() {
      this.showLogin = false;
      const target = "/design-studio/index.html";
      window.open(target, "_blank", "noopener");
    },
  }));
});
