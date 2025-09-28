import { hero as heroFactory } from "../assets/components/hero.js";
import { featureCard as featureFactory } from "../assets/components/feature-card.js";
import { ctaButton as ctaFactory } from "../assets/components/cta-button.js";

const components = {
  hero: (opts) => heroFactory(opts),
  "feature-card": (opts) => featureFactory(opts),
  "cta-button": (opts) => ctaFactory(opts),
};

const canvas = document.getElementById("canvas");
const inspector = document.getElementById("inspector-content");
let selectedEl = null;

function handleDragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.dataset.type);
}

function allowDrop(e) {
  e.preventDefault();
}

function handleDrop(e) {
  e.preventDefault();
  const type = e.dataTransfer.getData("text/plain");
  const html = components[type]();
  const wrapper = document.createElement("div");
  wrapper.className = "builder-component";
  wrapper.innerHTML = html;
  wrapper.addEventListener("click", (ev) => {
    ev.stopPropagation();
    selectComponent(wrapper);
  });
  canvas.appendChild(wrapper);
}

function selectComponent(el) {
  if (selectedEl) selectedEl.classList.remove("selected");
  selectedEl = el;
  el.classList.add("selected");
  showInspector(el);
}

function showInspector(el) {
  inspector.innerHTML = "";
  const html = el.innerHTML;
  const pre = document.createElement("textarea");
  pre.style.width = "100%";
  pre.style.height = "160px";
  pre.value = html;
  pre.addEventListener("input", () => {
    el.innerHTML = pre.value;
  });
  inspector.appendChild(pre);
  const remove = document.createElement("button");
  remove.textContent = "Remove";
  remove.className = "btn";
  remove.addEventListener("click", () => {
    el.remove();
    inspector.innerHTML = "Select a component to edit";
  });
  inspector.appendChild(remove);
}

// palette drag
const paletteItems = document.querySelectorAll(".palette-item");
paletteItems.forEach((it) => it.addEventListener("dragstart", handleDragStart));

canvas.addEventListener("dragover", allowDrop);
canvas.addEventListener("drop", handleDrop);
canvas.addEventListener("click", () => {
  if (selectedEl) {
    selectedEl.classList.remove("selected");
    selectedEl = null;
    inspector.innerHTML = "Select a component to edit";
  }
});

// export
document.getElementById("export-btn").addEventListener("click", () => {
  const theme = document.querySelector("input[name=theme]:checked").value;
  const html = buildExportHtml(canvas.innerHTML, theme);
  // create a blob and download locally as demo (can't write to repo from the browser without server)
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "page-export.html";
  a.click();
  URL.revokeObjectURL(url);
});

function buildExportHtml(bodyHtml, theme) {
  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>Exported Page</title>
      <link rel="stylesheet" href="css/home.css" />
    </head>
    <body>
      ${bodyHtml}
    </body>
  </html>`;
}

console.log("Page builder loaded");
