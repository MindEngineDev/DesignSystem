// Basic interactivity for admin layout: sidebar toggle, theme toggle, user table filter, etc.
const qs = (s, el = document) => el.querySelector(s);
const qsa = (s, el = document) => [...el.querySelectorAll(s)];

const sidebar = qs('#sidebar');
qs('#menuToggle')?.addEventListener('click', () => {
  sidebar?.classList.toggle('open');
});

// Theme toggle
const themeToggle = qs('#themeToggle');
if (themeToggle) {
  const root = document.documentElement;
  const apply = (dark) => root.setAttribute('data-theme', dark ? 'dark' : 'light');
  // init from prefers
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  apply(prefersDark);
  themeToggle.checked = prefersDark;
  themeToggle.addEventListener('sl-change', (e) => apply(e.target.checked));
}

// Mark all notifications as read
qs('#markAllNotifications')?.addEventListener('click', () => {
  qsa('#notificationsList li').forEach(li => li.classList.add('muted'));
});

// Simple user table filter
qs('#userFilterInput')?.addEventListener('sl-input', (e) => {
  const term = (e.target.value || '').toLowerCase();
  qsa('#usersTable tbody tr').forEach(tr => {
    const text = tr.textContent.toLowerCase();
    tr.style.display = text.includes(term) ? '' : 'none';
  });
});

// Add data-labels for responsive user table on load
(function labelizeUserTable() {
  const headers = qsa('#usersTable thead th').map(th => th.textContent.trim());
  qsa('#usersTable tbody tr').forEach(tr => {
    qsa('td', tr).forEach((td, i) => td.setAttribute('data-label', headers[i] || ''));
  });
})();

// Fake pagination for users
export function setupUserPagination(tableId, pagerId) {
  const rows = qsa(`#${tableId} tbody tr`);
  const pageSize = 10;
  let page = 0;
  function render() {
    rows.forEach((tr, i) => tr.style.display = (Math.floor(i / pageSize) === page) ? '' : 'none');
    qs(`#${pagerId} .info`).textContent = `Page ${page + 1} / ${Math.ceil(rows.length / pageSize)}`;
  }
  qs(`#${pagerId} .prev`).addEventListener('click', () => { page = Math.max(0, page - 1); render(); });
  qs(`#${pagerId} .next`).addEventListener('click', () => { page = Math.min(Math.ceil(rows.length / pageSize) - 1, page + 1); render(); });
  render();
}

// Filter for users
export function setupUserFilter(inputId, tableId) {
  qs(`#${inputId}`)?.addEventListener('sl-input', e => {
    const term = (e.target.value || '').toLowerCase();
    qsa(`#${tableId} tbody tr`).forEach(tr => {
      tr.style.display = tr.textContent.toLowerCase().includes(term) ? '' : 'none';
    });
  });
}

// Simple tabs for admin sections
export function setupAdminTabs(rootSel) {
  const root = qs(rootSel);
  if (!root) return;
  const tabs = qsa('[data-tab]', root);
  const panes = qsa('[data-pane]', root);
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(tt => tt.classList.toggle('active', tt === t));
    const target = t.getAttribute('data-tab');
    panes.forEach(p => p.hidden = p.getAttribute('data-pane') !== target);
  }));
}

// Bulk actions for users (e.g., delete selected)
qs('#bulkDelete')?.addEventListener('click', () => {
  const selected = qsa('#usersTable input[type="checkbox"]:checked');
  selected.forEach(cb => {
    const row = cb.closest('tr');
    row.remove(); // In a real app, this would be an API call
  });
});