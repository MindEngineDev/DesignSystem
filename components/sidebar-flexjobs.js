// components/sidebar-flexjobs.js
// FlexJobs-style sidebar component. No external CSS required (uses CSS variables).
// Uses Shoelace <sl-badge> and <sl-button> for small UI bits.
// Icons are optional; we use simple inline SVGs so you don't depend on an icon CDN.

// Minimal inline SVG icon factory (stroke icons)
function svg(path, opts = {}) {
  const { w = 22, h = 22, stroke = 'currentColor' } = opts;
  return `
    <svg width="${w}" height="${h}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      ${path}
    </svg>
  `;
}
const ICONS = {
  dashboard: svg('<path d="M3 13h8V3H3v10Z"/><path d="M13 21h8V8h-8v13Z"/>'),
  bell: svg('<path d="M18 8a6 6 0 1 0-12 0c0 7-3 6-3 8h18c0-2-3-1-3-8"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>'),
  doc: svg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>'),
  chat: svg('<path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>'),
  shifts: svg('<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/>'),
  plan: svg('<path d="M3 3h18v4H3z"/><path d="M7 14h10"/><path d="M7 18h6"/><rect x="3" y="7" width="18" height="14" rx="2"/>'),
  group: svg('<path d="M16 11c1.66 0 3-1.57 3-3.5S17.66 4 16 4s-3 1.57-3 3.5S14.34 11 16 11z"/><path d="M8 11c1.66 0 3-1.57 3-3.5S9.66 4 8 4 5 5.57 5 7.5 6.34 11 8 11z"/><path d="M8 13c-2.67 0-8 1.34-8 4v3h10m2 0h10v-3c0-2.66-5.33-4-8-4"/>'),
  table: svg('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 4v16M15 4v16"/>'),
  map: svg('<path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/>'),
  brief: svg('<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>'),
  dept: svg('<path d="M3 21V8l9-5 9 5v13"/><path d="M9 22V12h6v10"/>'),
  money: svg('<circle cx="12" cy="12" r="9"/><path d="M8 12h8"/><path d="M12 8v8"/>'),
  team: svg('<path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5z"/><path d="M20 21a8 8 0 1 0-16 0"/>'),
  settings: svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83l-.06.06a2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 .9 1.65 1.65 0 0 1-3 0 1.65 1.65 0 0 0-1-.9 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0l-.06-.06a2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-.9-1 1.65 1.65 0 0 1 0-3 1.65 1.65 0 0 0 .9-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83l.06-.06a2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 0 1-.9 1.65 1.65 0 0 1 3 0 1.65 1.65 0 0 0 1 .9 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0l.06.06a2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82 1.65 1.65 0 0 0 .9 1z"/>')
};

// Sidebar item HTML
function item({ icon, label, badge, active, expandable }) {
  const badgeHtml = badge ? `<sl-badge variant="danger" pill>${badge}</sl-badge>` : '';
  const plus = expandable ? `<span class="dot-plus">+</span>` : '';
  return `
    <a class="nav-item${active ? ' is-active' : ''}" href="#">
      <span class="nav-ico">${ICONS[icon] || ''}</span>
      <span class="nav-label">${label}</span>
      <span class="nav-spacer"></span>
      ${badgeHtml}
      ${plus}
    </a>
  `;
}

// Exported factory
export function createFlexJobsSidebar() {
  const wrap = document.createElement('aside');
  wrap.className = 'fj-sidebar';
  wrap.innerHTML = `
    <div class="fj-logo">
      <span class="x">FLE<span class="accent">X</span>JOBS</span>
      <span class="sub">2.0</span>
    </div>
    <nav class="fj-nav">
      ${item({ icon:'dashboard', label:'Dashboard', active:true })}
      ${item({ icon:'bell', label:'Notifications', badge:2 })}
      ${item({ icon:'doc', label:'Document check', expandable:true })}
      ${item({ icon:'chat', label:'Chat', expandable:true })}
      ${item({ icon:'shifts', label:'Shifts', expandable:true })}
      ${item({ icon:'plan', label:'Planning' })}
      ${item({ icon:'group', label:'Flexpool', expandable:true })}
      ${item({ icon:'table', label:'Companies' })}
      ${item({ icon:'map', label:'Onboarding' })}
      ${item({ icon:'map', label:'Locations' })}
      ${item({ icon:'brief', label:'Projects' })}
      ${item({ icon:'dept', label:'Departments' })}
      ${item({ icon:'money', label:'Finance' })}
      ${item({ icon:'team', label:'Team' })}
      ${item({ icon:'settings', label:'Settings' })}
    </nav>
    <div class="fj-profile">
      <img class="avatar" alt="avatar" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=96&q=60" />
      <div class="who">
        <strong>Tom Cook</strong>
        <small>tom@example.com</small>
      </div>
      <sl-button size="small" caret outline></sl-button>
    </div>
  `;
  return wrap;
}
