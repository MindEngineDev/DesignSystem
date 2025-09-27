// components/shoelace/tooltip/tooltip.js
/**
 * @typedef {Object} TooltipProps
 * @property {'top'|'bottom'|'left'|'right'} [placement]
 * @property {boolean} [open]
 * @property {'small'|'medium'|'large'} [size]
 * @property {string} [content]
 */

export function TooltipComponent(initialProps = {}) {
  return {
    /** @type {TooltipProps} */
    props: initialProps,
    el: null,
    init() {
      this.el = this.$el.querySelector("sl-tooltip");
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
          case "placement":
            if (value) this.el.setAttribute("placement", value);
            else this.el.removeAttribute("placement");
            break;
          case "open":
            if (value) this.el.setAttribute("open", "");
            else this.el.removeAttribute("open");
            break;
          case "size":
            this.el.classList.remove(
              "sl-tooltip--small",
              "sl-tooltip--medium",
              "sl-tooltip--large",
            );
            if (value) this.el.classList.add(`sl-tooltip--${value}`);
            break;
          case "content":
            if (value === undefined || value === null)
              this.el.removeAttribute("content");
            else this.el.setAttribute("content", String(value));
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
  window.Alpine.data("tooltipComponent", TooltipComponent);
}

if (typeof window !== "undefined" && window.htmx) {
  window.htmx.onLoad((el) => {
    const host = el.closest('[data-component="shoelace-tooltip"]');
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
