// Shared helpers
const qs = (s, el=document)=>el.querySelector(s);
const qsa = (s, el=document)=>[...el.querySelectorAll(s)];

// Fake pagination
export function setupPagination(tableId, pagerId){
  const rows = qsa(`#${tableId} tbody tr`);
  const pageSize = 8;
  let page = 0;
  function render(){
    rows.forEach((tr, i)=> tr.style.display = (Math.floor(i/pageSize)===page) ? '' : 'none');
    qs(`#${pagerId} .info`).textContent = `Pagina ${page+1} / ${Math.ceil(rows.length/pageSize)}`;
  }
  qs(`#${pagerId} .prev`).addEventListener('click', ()=>{ page = Math.max(0, page-1); render(); });
  qs(`#${pagerId} .next`).addEventListener('click', ()=>{ page = Math.min(Math.ceil(rows.length/pageSize)-1, page+1); render(); });
  render();
}

// Filter
export function setupFilter(inputId, tableId){
  qs(`#${inputId}`)?.addEventListener('sl-input', e => {
    const term = (e.target.value || '').toLowerCase();
    qsa(`#${tableId} tbody tr`).forEach(tr => {
      tr.style.display = tr.textContent.toLowerCase().includes(term) ? '' : 'none';
    });
  });
}

// Simple tabs
export function setupTabs(rootSel){
  const root = qs(rootSel);
  if (!root) return;
  const tabs = qsa('[data-tab]', root);
  const panes = qsa('[data-pane]', root);
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(tt => tt.classList.toggle('active', tt===t));
    const target = t.getAttribute('data-tab');
    panes.forEach(p => p.hidden = p.getAttribute('data-pane') !== target);
  }));
}
