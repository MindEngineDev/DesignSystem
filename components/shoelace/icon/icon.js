// components/shoelace/icon/icon.js
/**
 * @typedef {Object} IconProps
 * @property {string} [name]
 * @property {'small'|'medium'|'large'} [size]
 * @property {string} [color]
 * @property {string} [title]
 */

export function IconComponent(initialProps = {}) {
  return {
    /** @type {IconProps} */
    props: initialProps,
    el: null,
    init() {
      this.el = this.$el.querySelector("sl-icon");
      this.apply(this.props);
    },
    update(newProps = {}) {
      this.props = { ...this.props, ...newProps };
      this.apply(newProps);
    },
    apply(source = {}) {
      if (!this.el) return;
      Object.entries(source).forEach(([key, value]) => {
        if (value === undefined) return;
        switch (key) {
          case "name":
            if (value) this.el.setAttribute("name", String(value));
            else this.el.removeAttribute("name");
            break;
          case "size":
            this.el.classList.remove(
              "sl-icon--small",
              "sl-icon--medium",
              "sl-icon--large",
            );
            if (value) this.el.classList.add(`sl-icon--${value}`);
            break;
          case "color":
            if (value) this.el.style.color = value;
            else this.el.style.removeProperty("color");
            break;
          case "title":
            if (value) {
              this.el.setAttribute("aria-label", String(value));
              this.el.removeAttribute("aria-hidden");
            } else {
              this.el.removeAttribute("aria-label");
              this.el.setAttribute("aria-hidden", "true");
            }
            break;
          default:
            if (value === undefined || value === null)
              this.el.removeAttribute(key);
            else this.el.setAttribute(key, String(value));
        }
      });
    },
  };
}

if (typeof window !== "undefined" && window.Alpine) {
  window.Alpine.data("iconComponent", IconComponent);
}

if (typeof window !== "undefined" && window.htmx) {
  window.htmx.onLoad((el) => {
    const host = el.closest('[data-component="shoelace-icon"]');
    if (!host) return;
    const alpine = window.Alpine;
    if (!alpine) return;
    alpine.discoverUninitializedComponents((componentEl) => {
      if (componentEl === host) {
        alpine.initializeComponent(componentEl);
      }
    });
  });
}
