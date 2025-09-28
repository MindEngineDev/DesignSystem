// scripts/views.js
// UI helpers for tabs, text filtering, and simple pagination (vanilla JS).

/**
 * Tabs: click elements with [data-tab-target="#panelId"] to activate their panel.
 * @param {HTMLElement|Document} root - container to scope the behavior (default: document)
 */
export function setupTabs(root = document) {
  const navButtons = [...root.querySelectorAll("[data-tab-target]")];
  if (navButtons.length === 0) return;

  const allPanels = new Set();
  navButtons.forEach(btn => {
    const sel = btn.getAttribute("data-tab-target");
    if (!sel) return;
    const panel = root.querySelector(sel);
    if (panel) allPanels.add(panel);

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetSel = btn.getAttribute("data-tab-target");
      if (!targetSel) return;

      // deactivate
      navButtons.forEach(b => b.setAttribute("aria-selected", "false"));
      allPanels.forEach(p => p.hidden = true);

      // activate
      btn.setAttribute("aria-selected", "true");
      const target = root.querySelector(targetSel);
      if (target) target.hidden = false;
    });
  });

  // Initialize first as active (if none selected)
  const alreadySelected = navButtons.some(b => b.getAttribute("aria-selected") === "true");
  if (!alreadySelected && navButtons[0]) {
    navButtons[0].click();
  }
}

/**
 * Text filter: filters child items inside a container by input value.
 * @param {string} containerSelector - e.g. "#products"
 * @param {string} inputSelector     - e.g. "#q"
 * @param {(el:HTMLElement)=>string} accessor - optional accessor for item text
 */
export function setupFilter(containerSelector, inputSelector, accessor = (el) => el.textContent || "") {
  const container = document.querySelector(containerSelector);
  const input = document.querySelector(inputSelector);
  if (!container || !input) return;

  const items = [...container.children];
  function apply() {
    const q = input.value.trim().toLowerCase();
    items.forEach(el => {
      const text = accessor(el).toLowerCase();
      el.style.display = text.includes(q) ? "" : "none";
    });
  }
  input.addEventListener("input", apply);
  apply();
}

/**
 * Pagination: paginates direct children of a container.
 * Adds simple Prev/Next controls after the container.
 * @param {string} containerSelector - e.g. "#tableBody"
 * @param {number} pageSize - items per page
 */
export function setupPagination(containerSelector, pageSize = 10) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const items = [...container.children];
  if (items.length <= pageSize) return;

  let page = 0;
  const pages = Math.ceil(items.length / pageSize);

  const controls = document.createElement("div");
  controls.style.display = "flex";
  controls.style.gap = ".5rem";
  controls.style.alignItems = "center";
  controls.style.marginTop = ".5rem";

  const prev = document.createElement("sl-button");
  prev.textContent = "Prev";
  prev.setAttribute("size", "small");

  const next = document.createElement("sl-button");
  next.textContent = "Next";
  next.setAttribute("size", "small");

  const info = document.createElement("span");
  info.style.opacity = ".75";

  controls.append(prev, next, info);
  container.after(controls);

  function render() {
    const start = page * pageSize;
    const end = start + pageSize;
    items.forEach((el, i) => {
      el.style.display = (i >= start && i < end) ? "" : "none";
    });
    info.textContent = `Page ${page + 1} / ${pages}`;
    prev.disabled = page === 0;
    next.disabled = page === pages - 1;
  }

  prev.addEventListener("click", () => { if (page > 0) { page--; render(); } });
  next.addEventListener("click", () => { if (page < pages - 1) { page++; render(); } });

  render();
}
