// components/topbar/topbar.js
// Generic topbar with title and primary action dropdown.

export function createTopbar(title = "DASHBOARD") {
  const el = document.createElement('header');
  el.className = 'topbar';
  el.innerHTML = `
    <h1>${title}</h1>
    <sl-dropdown>
      <sl-button slot="trigger" variant="primary" pill caret>Create</sl-button>
      <sl-menu>
        <sl-menu-item>New Shift</sl-menu-item>
        <sl-menu-item>New Project</sl-menu-item>
        <sl-menu-item>Invite</sl-menu-item>
      </sl-menu>
    </sl-dropdown>
  `;
  return el;
}
