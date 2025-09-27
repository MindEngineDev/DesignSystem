export function cardComponent() {
  return {
    init() {
      // Add any component-specific initialization here.
      console.log('card initialized');
    }
  };
}

if (typeof Alpine !== 'undefined') {
  Alpine.data('cardComponent', cardComponent);
}

if (typeof htmx !== 'undefined') {
  htmx.onLoad((el) => {
    if (el.dataset.component === 'card') {
      // HTMX hooks can go here if needed.
    }
  });
}
