// components/shoelace/button/button.js
/**
 * @typedef {Object} ButtonProps
 * @property {'primary'|'secondary'|'ghost'} [variant]
 * @property {'small'|'medium'|'large'} [size]
 * @property {'small'|'medium'|'large'|'pill'|'circle'} [radius]
 * @property {boolean} [loading]
 * @property {boolean} [disabled]
 * @property {string} [type]
 * @property {string} [href]
 * @property {string} [target]
 */

export function ButtonComponent(initialProps = {}) {
  return {
    /** @type {ButtonProps} */
    props: initialProps,
    el: null,
    init() {
      // Host element contains sl-button in the light DOM
      this.el = this.$el.querySelector('sl-button');
      this.syncFromDOM();
      this.apply(this.props);
    },
    update(newProps = {}) {
      this.props = { ...this.props, ...newProps };
      this.apply(newProps);
    },
    syncFromDOM() {
      // detect icon slot content presence and reflect as classes
      if (!this.el) return;
      const host = this.$el;
      const hasStart = host.querySelector('[slot="icon-start"]') !== null || host.querySelector('slot[name="icon-start"]') !== null;
      const hasEnd = host.querySelector('[slot="icon-end"]') !== null || host.querySelector('slot[name="icon-end"]') !== null;
      this.el.classList.toggle('has-icon-start', !!hasStart);
      this.el.classList.toggle('has-icon-end', !!hasEnd);
    },
    apply(source = {}) {
      if (!this.el) return;

      // Known props need special handling to map to classes/attributes
      const mapper = (key, value) => {
        switch (key) {
          case 'variant':
            this.el.classList.remove('sl-button--primary','sl-button--secondary','sl-button--ghost');
            if (value) this.el.classList.add(`sl-button--${value}`);
            break;
          case 'size':
            this.el.classList.remove('sl-button--small','sl-button--medium','sl-button--large');
            if (value) this.el.classList.add(`sl-button--${value}`);
            break;
          case 'radius':
            this.el.classList.remove('sl-button--radius-small','sl-button--radius-medium','sl-button--radius-large','sl-button--radius-pill','sl-button--radius-circle');
            if (value) this.el.classList.add(`sl-button--radius-${value}`);
            break;
          case 'loading':
            if (value) {
              this.el.setAttribute('loading', '');
              this.el.setAttribute('disabled', '');
              this.el.setAttribute('aria-busy', 'true');
            } else {
              this.el.removeAttribute('loading');
              if (!this.props.disabled) this.el.removeAttribute('disabled');
              this.el.setAttribute('aria-busy', 'false');
            }
            break;
          case 'disabled':
            if (value) this.el.setAttribute('disabled', '');
            else this.el.removeAttribute('disabled');
            break;
          case 'href':
          case 'target':
          case 'type':
            // pass-through attributes
            if (value === undefined || value === null) this.el.removeAttribute(key);
            else this.el.setAttribute(key, String(value));
            break;
          case 'label':
            if (value) this.el.setAttribute('aria-label', String(value));
            else this.el.removeAttribute('aria-label');
            break;

          default:
            // fallback: set as attribute if not a function
            if (value === undefined || value === null) this.el.removeAttribute(key);
            else this.el.setAttribute(key, String(value));
        }
      };

      Object.entries(source).forEach(([key, value]) => {
        if (value === undefined) return;
        mapper(key, value);
      });

      // Re-sync icon presence classes
      this.syncFromDOM();
    }
  };
}

if (typeof window !== 'undefined' && window.Alpine) {
  window.Alpine.data('buttonComponent', ButtonComponent);
}

if (typeof window !== 'undefined' && window.htmx) {
  window.htmx.onLoad((el) => {
    const host = el.closest('[data-component="shoelace-button"]');
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
