// app.js
import 'htmx.org';
import Alpine from 'alpinejs';

// Styles: your token-driven CSS + optional Pico (if you want Pico, import it first)
import './styles/main.css';
// If you also want Pico as a baseline, uncomment the next line:
// import '@picocss/pico/css/pico.min.css';

// Shoelace setup: set asset base path and load a few components
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';
setBasePath('/node_modules/@shoelace-style/shoelace/dist');
import './components/shoelace/index.js';

// Alpine boot
window.Alpine = Alpine;
Alpine.start();
