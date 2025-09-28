// components/sidebar/sidebar.js
// Generic Sidebar component (no brand naming). Uses Shoelace badges/buttons.

function svg(path, opts = {}) {
  const { w = 22, h = 22, stroke = 'currentColor' } = opts;
  return `
    <svg width="${w}" height="${h}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      ${path}
    </svg>
  `;
}

const ICONS = {
  home: svg('<path d="M3 10L12 3l9 7v11H3z"/><path d="M9 21V12h6v9"/>'),
  bell: svg('<path d="M18 8a6 6 0 1 0-12 0c0 7-3 6-3 8h18c0-2-3-1-3-8"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>'),
  doc: svg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>'),
  chat: svg('<path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>'),
  calendar: svg('<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/>'),
  settings: svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83l-.06.06a2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 .9 1.65 1.65 0 0 1-3 0 1.65 1.65 0 0 0-1-.9 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0l-.06-.06a2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-.9-1 1.65 1.65 0 0 1 0-3 1.65 1.65 0 0 0 .9-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83l.06-.06a2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 0 1-.9 1.65 1.65 0 0 1 3 0 1.65 1.65 0 0 0 1 .9 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0l.06.06a2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82 1.65 1.65 0 0 0 .9 1z"/>')
};

function navItem({ icon, label, active = false, badge = null, expandable = false }) {
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

export function createSidebar() {
  const aside = document.createElement('aside');
  aside.className = 'sidebar';
  aside.innerHTML = `
    <div class="brand">
      <strong class="word">DASHBOARD</strong>
      <small class="sub">UI</small>
    </div>
    <nav class="nav">
      ${navItem({ icon:'home', label:'Dashboard', active:true })}
      ${navItem({ icon:'bell', label:'Notifications', badge:2 })}
      ${navItem({ icon:'doc', label:'Documents' })}
      ${navItem({ icon:'chat', label:'Chat', expandable:true })}
      ${navItem({ icon:'calendar', label:'Shifts', expandable:true })}
      ${navItem({ icon:'settings', label:'Settings' })}
    </nav>
    <div class="profile">
      <img class="avatar" alt="avatar" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=96&q=60" />
      <div class="who">
        <strong>Tom Cook</strong>
        <small>tom@example.com</small>
      </div>
      <sl-button size="small" outline caret></sl-button>
    </div>
  `;
  return aside;
}
