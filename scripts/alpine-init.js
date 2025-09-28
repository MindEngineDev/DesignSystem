// scripts/alpine-init.js
// Central Alpine bootstrap: import, attach to window, start once.

import Alpine from 'alpinejs';

if (!window.Alpine) {
  window.Alpine = Alpine;
  // Register any global directives/plugins here later.
  Alpine.start();
}
