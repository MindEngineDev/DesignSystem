// Basic interactivity: sidebar toggle, theme toggle, table filter
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

// Mark all as read
qs('#markAll')?.addEventListener('click', () => {
  qsa('#activityList li').forEach(li => li.classList.add('muted'));
});

// Simple table filter
qs('#filterInput')?.addEventListener('sl-input', (e) => {
  const term = (e.target.value || '').toLowerCase();
  qsa('#dealsTable tbody tr').forEach(tr => {
    const text = tr.textContent.toLowerCase();
    tr.style.display = text.includes(term) ? '' : 'none';
  });
});

// Add data-labels for responsive table on load
(function labelizeTable() {
  const headers = qsa('#dealsTable thead th').map(th => th.textContent.trim());
  qsa('#dealsTable tbody tr').forEach(tr => {
    qsa('td', tr).forEach((td, i) => td.setAttribute('data-label', headers[i] || ''));
  });
})();
