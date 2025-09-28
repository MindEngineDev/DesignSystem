Registry.set("Drawer", {
  tag: "sl-drawer",
  preview: () => { const d = document.createElement("div"); d.textContent = "Drawer"; return d; },
  factory: (attrs={}) => { const x = document.createElement("sl-drawer"); x.setAttribute("label","My Drawer"); x.innerHTML = "<p>Content</p>"; return x; },
  props: { label: { type: "text", attr: "label" }, class: { type: "text", attr: "class" } }
});
