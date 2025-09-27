// components/shoelace/tag/tag.js
/**
 * @typedef {Object} TagProps
 * @property {'small'|'medium'|'large'} [size]
 * @property {'primary'|'success'|'warning'|'danger'} [intent]
 * @property {'pill'|'rounded'|'square'} [radius]
 */

export function TagComponent(initialProps = {}) {
  return {
    /** @type {TagProps} */
    props: initialProps,
    el: null,
    init() {
      this.el = this.$el.querySelector("sl-tag");
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
              "sl-tag--small",
              "sl-tag--medium",
              "sl-tag--large",
            );
            if (value) this.el.classList.add(`sl-tag--${value}`);
            break;
          case "intent":
            this.el.classList.remove(
              "sl-tag--primary",
              "sl-tag--success",
              "sl-tag--warning",
              "sl-tag--danger",
            );
            if (value) this.el.classList.add(`sl-tag--${value}`);
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
  window.Alpine.data("tagComponent", TagComponent);
}

if (typeof window !== "undefined" && window.htmx) {
  window.htmx.onLoad((el) => {
    const host = el.closest('[data-component="shoelace-tag"]');
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
