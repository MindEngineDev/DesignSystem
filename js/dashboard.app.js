// js/dashboard.app.js
// Mounts generic Sidebar + Topbar into the dashboard layout.

import '../node_modules/@shoelace-style/shoelace/dist/shoelace.js';
import '../components/sidebar/index.js';
import { createSidebar } from '../components/sidebar/sidebar.js';
import '../components/topbar/index.js';
import { createTopbar } from '../components/topbar/topbar.js';

document.getElementById('mount-sidebar')?.replaceChildren(createSidebar());
document.getElementById('mount-topbar')?.replaceChildren(createTopbar('DASHBOARD'));
