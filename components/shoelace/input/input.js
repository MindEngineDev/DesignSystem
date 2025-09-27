// components/shoelace/input/input.js
/**
 * @typedef {Object} InputProps
 * @property {'small'|'medium'|'large'} [size]
 * @property {boolean} [filled]
 * @property {boolean} [disabled]
 * @property {string} [placeholder]
 * @property {string} [type]
 * @property {string} [name]
 * @property {string} [value]
 * @property {boolean} [required]
 */

export function InputComponent(initialProps = {}) {
  return {
    /** @type {InputProps} */
    props: initialProps,
    el: null,
    init() {
      this.el = this.$el.querySelector('sl-input');
      this.syncFromDOM();
      this.apply(this.props);

      // expose handy methods on Alpine component instance
      this.getValue = () => (this.el ? this.el.value : undefined);
      this.setValue = (v) => { if (this.el) this.el.value = v; };
    },
    update(newProps = {}) {
      this.props = { ...this.props, ...newProps };
      this.apply(newProps);
    },
    syncFromDOM() {
      if (!this.el) return;
      const host = this.$el;
      const hasStart = host.querySelector('[slot="icon-start"]') !== null || host.querySelector('slot[name="icon-start"]') !== null;
      const hasEnd = host.querySelector('[slot="icon-end"]') !== null || host.querySelector('slot[name="icon-end"]') !== null;
      this.el.classList.toggle('has-icon-start', !!hasStart);
      this.el.classList.toggle('has-icon-end', !!hasEnd);
    },
    apply(source = {}) {
      if (!this.el) return;

      Object.entries(source).forEach(([key, value]) => {
        if (value === undefined) return;
        switch (key) {
          case 'size':
            this.el.classList.remove('sl-input--small','sl-input--medium','sl-input--large');
            if (value) this.el.classList.add(`sl-input--${value}`);
            break;
          case 'filled':
            this.el.classList.toggle('sl-input--filled', !!value);
            break;
          case 'disabled':
            if (value) this.el.setAttribute('disabled', ''); else this.el.removeAttribute('disabled');
            break;
          case 'value':
            this.el.value = value;
            break;
          case 'placeholder':
            if (value === undefined || value === null) this.el.removeAttribute('placeholder');
            else this.el.setAttribute('placeholder', String(value));
            break;
          default:
            if (value === undefined || value === null) this.el.removeAttribute(key);
            else this.el.setAttribute(key, String(value));
        }
      });

      this.syncFromDOM();
    }
  };
}

if (typeof window !== 'undefined' && window.Alpine) {
  window.Alpine.data('inputComponent', InputComponent);
}

if (typeof window !== 'undefined' && window.htmx) {
  window.htmx.onLoad((el) => {
    const host = el.closest('[data-component="shoelace-input"]');
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
