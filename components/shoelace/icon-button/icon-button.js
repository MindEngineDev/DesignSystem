// components/shoelace/icon-button/icon-button.js
export function IconButtonComponent(initialProps = {}) {
  return {
    props: initialProps,
    el: null,
    init() {
      this.el = this.$el.querySelector("sl-icon-button");
      this.syncFromDOM();
      this.apply(this.props);
    },
    update(newProps = {}) {
      this.props = { ...this.props, ...newProps };
      this.apply(newProps);
    },
    syncFromDOM() {
      if (!this.el) return;
      const host = this.$el;
      const hasIcon = host.querySelector('[slot="icon"]') !== null;
      this.el.classList.toggle("has-icon", !!hasIcon);
    },
    apply(source = {}) {
      if (!this.el) return;
      Object.entries(source).forEach(([key, value]) => {
        if (value === undefined) return;
        switch (key) {
          case "size":
            this.el.classList.remove(
              "sl-icon-button--small",
              "sl-icon-button--medium",
              "sl-icon-button--large",
            );
            if (value) this.el.classList.add(`sl-icon-button--${value}`);
            break;
          case "variant":
            this.el.classList.remove(
              "sl-icon-button--primary",
              "sl-icon-button--ghost",
            );
            if (value) this.el.classList.add(`sl-icon-button--${value}`);
            break;
          case "disabled":
            if (value) this.el.setAttribute("disabled", "");
            else this.el.removeAttribute("disabled");
            break;
          case "ariaLabel":
            if (value) this.el.setAttribute("aria-label", value);
            else this.el.removeAttribute("aria-label");
            break;
          default:
            if (value === undefined || value === null)
              this.el.removeAttribute(key);
            else this.el.setAttribute(key, String(value));
        }
      });
      this.syncFromDOM();
    },
  };
}

if (typeof window !== "undefined" && window.Alpine) {
  window.Alpine.data("iconButtonComponent", IconButtonComponent);
}

if (typeof window !== "undefined" && window.htmx) {
  window.htmx.onLoad((el) => {
    const host = el.closest('[data-component="shoelace-icon-button"]');
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
