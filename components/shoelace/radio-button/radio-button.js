// components/shoelace/radio-button/radio-button.js
export function RadioButtonComponent(initialProps = {}) {
  return {
    props: initialProps,
    el: null,
    init() {
      this.el = this.$el.querySelector('sl-radio-button');
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
        if (key in this.el) {
          this.el[key] = value;
        } else {
          this.el.setAttribute(key, value);
        }
      });
    }
  };
}

if (typeof window !== 'undefined' && window.Alpine) {
  window.Alpine.data('radioButtonComponent', RadioButtonComponent);
}

if (typeof window !== 'undefined' && window.htmx) {
  window.htmx.onLoad((el) => {
    const host = el.closest('[data-component="shoelace-radio-button"]');
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
