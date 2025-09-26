// Auto-load all components
const modules = import.meta.glob('./*/*.js');

export async function loadComponents() {
  for (const path in modules) {
    await modules[path]();
  }
}

// Load on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadComponents);
} else {
  loadComponents();
}
