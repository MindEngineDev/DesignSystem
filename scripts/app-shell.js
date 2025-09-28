const initNavigation = (context = document) => {
  const sidebar = context.querySelector('.app-sidebar');
  const toggle = context.querySelector('[data-toggle="sidebar"]');

  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('is-open');
    });
  }

  const currentPath = window.location.pathname.replace(/\\/g, '/');
  context.querySelectorAll('.app-nav__link').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPath = new URL(href, window.location.href).pathname;
    if (currentPath === linkPath || currentPath.endsWith(linkPath)) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initNavigation());
} else {
  initNavigation();
}

export { initNavigation };
