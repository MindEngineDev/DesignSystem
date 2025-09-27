// src/plugins/alpine.js
// Registers global Alpine.js directives for use across components.

export default function registerAlpinePlugins(Alpine) {
  // Example: a directive that auto-focuses an input when it appears.
  Alpine.directive('focus', (el, { value, expression }, { effect, evaluateLater }) => {
    effect(() => {
      // Wait for the next tick so the element is in the DOM
      requestAnimationFrame(() => {
        el.focus();
      });
    });
  });

  // Add more directives or magic properties here as needed.
}
