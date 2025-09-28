// scripts/dashboard.js
// Mounts Sidebar + Topbar into the dashboard layout.
// Bonus: append ?builder=1 to the URL to embed the Component Builder inside the canvas.

import '../components/sidebar/index.js';
import { createSidebar } from '../components/sidebar/sidebar.js';
import '../components/topbar/index.js';
import { createTopbar } from '../components/topbar/topbar.js';

const sidebarMount = document.getElementById('mount-sidebar');
const topbarMount  = document.getElementById('mount-topbar');
const canvas       = document.querySelector('.canvas');

sidebarMount?.replaceChildren(createSidebar());
topbarMount?.replaceChildren(createTopbar('DASHBOARD'));

const params = new URLSearchParams(location.search);
const useBuilder = params.get('builder') === '1';

if (useBuilder && canvas) {
  // Replace canvas content with an embedded builder
  canvas.innerHTML = '';
  const frame = document.createElement('iframe');
  frame.src = './builder.html';
  frame.style.border = '0';
  frame.style.width = '100%';
  frame.style.height = '100%';
  frame.setAttribute('title', 'Component Builder');
  canvas.append(frame);

  // Hide the dashed outline when builder is active
  const outline = document.querySelector('.outline');
  if (outline) outline.remove();
}
