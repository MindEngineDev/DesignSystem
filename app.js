// src/app.js
import Alpine from 'alpinejs';
import registerAlpinePlugins from '@/plugins/alpine.js';

// Register any global directives or components
registerAlpinePlugins(Alpine);

// Start Alpine
window.Alpine = Alpine;
Alpine.start();
