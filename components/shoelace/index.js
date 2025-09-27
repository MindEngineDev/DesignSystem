// Shoelace bootstrap (keeps your app.js import working)
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';

// Prefer a global base url if you set it on pages; otherwise CDN
setBasePath(window.__shoelace_base_url || 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace/dist/');

// Preload a minimal set of commonly used components.
// Add more lines here as you start using more components.
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/switch/switch.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js';
