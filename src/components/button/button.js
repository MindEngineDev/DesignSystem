export function buttonComponent() {
  return {
    init() {
      console.log('button initialized');
    }
  };
}

if (typeof Alpine !== 'undefined') {
  Alpine.data('buttonComponent', buttonComponent);
}

if (typeof htmx !== 'undefined') {
  htmx.onLoad((el) => {
    if (el.dataset.component === 'button') {
      // HTMX init
    }
  });
}