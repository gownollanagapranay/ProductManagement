const API = '';

const el = id => document.getElementById(id);
const q = sel => document.querySelector(sel);

/* --- Tabs --- */
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const t = btn.getAttribute('data-tab');
    document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
    el(t).classList.add('active');
  });
});

/* --- Toasts --- */
const toast = el('toast');
let toastTimer;
function showToast(msg, type='info'){
  toast.textContent = msg;
  toast.className = `toast ${type}`;
  toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>toast.classList.add('hidden'), 3200);
}

/* --- Helpers --- */
function safeText(s){ return s==null? '': String(s); }
function handleError(err){ console.error(err); showToast('Operation failed','error'); }

/* --- Add Product --- */
el('add-form').addEventListener('submit', async e=>{
  e.preventDefault();
  const prod = {
    id: Number(el('add-id').value) || null,
    name: el('add-name').value.trim(),
    description: el('add-desc').value.trim(),
    price: Number(el('add-price').value)
  };
  if(!prod.name){ showToast('Name is required','error'); return; }
  if(!Number.isFinite(prod.price)) { showToast('Valid price required','error'); return; }
  try{
    const res = await fetch(API + '/addProduct', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(prod)});
    const txt = await res.text();
    showToast(txt,'success');
    el('add-form').reset();
  }catch(err){ handleError(err); }
});

/* --- Update Product --- */
el('load-for-update').addEventListener('click', async ()=>{
  const id = Number(el('upd-id').value);
  if(!id) { showToast('Enter ID to load','error'); return; }
  try{
    const res = await fetch(API + `/viewProduct/${id}`);
    if(!res.ok){ showToast('Product not found','error'); return; }
    const p = await res.json();
    el('upd-name').value = safeText(p.name);
    el('upd-desc').value = safeText(p.description);
    el('upd-price').value = safeText(p.price);
    showToast('Loaded product','info');
  }catch(err){ handleError(err); }
});

el('update-form')?.addEventListener('submit', async e=>{
  e.preventDefault();
});

// handle update submit separately (form id mismatch prevention)
el('update-form')?.addEventListener('submit', ()=>{});
el('update-form');

el('update-form');

el('update-form')?.addEventListener('submit', async e=>{
  e.preventDefault();
  const prod = { id: Number(el('upd-id').value), name: el('upd-name').value.trim(), description: el('upd-desc').value.trim(), price: Number(el('upd-price').value) };
  if(!prod.id){ showToast('Id required','error'); return; }
  try{
    const res = await fetch(API + '/updateProduct', {method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(prod)});
    const txt = await res.text(); showToast(txt,'success'); el('upd-clear').click();
  }catch(err){ handleError(err); }
});

el('upd-clear').addEventListener('click', ()=>{ el('upd-id').value=''; el('upd-name').value=''; el('upd-desc').value=''; el('upd-price').value=''; });

/* --- View Products --- */
let cache = [];
async function loadProducts(){
  try{
    const res = await fetch(API + '/viewAllProducts');
    cache = await res.json(); renderProducts(cache);
  }catch(err){ handleError(err); }
}

function renderProducts(list){
  const tbody = q('#products-table tbody'); tbody.innerHTML='';
  if(!list || list.length===0){ tbody.innerHTML='<tr><td colspan="5">No products</td></tr>'; return; }
  list.forEach(p=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${safeText(p.id)}</td>
      <td>${safeText(p.name)}</td>
      <td>${safeText(p.description)}</td>
      <td>${safeText(p.price)}</td>
      <td class="actions">
        <button data-id="${p.id}" class="view">View</button>
        <button data-id="${p.id}" class="edit">Edit</button>
        <button data-id="${p.id}" class="delete">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

q('#products-table tbody').addEventListener('click', e=>{
  const id = e.target.getAttribute('data-id'); if(!id) return;
  if(e.target.classList.contains('view')) openModal(cache.find(x=>String(x.id)===String(id)));
  if(e.target.classList.contains('edit')){
    // switch to update tab and populate
    document.querySelector('.tab[data-tab="update"]').click();
    el('upd-id').value = id; el('load-for-update').click();
  }
  if(e.target.classList.contains('delete')) openConfirm(id);
});

el('search').addEventListener('input', e=>{
  const qv = e.target.value.trim().toLowerCase(); if(!qv) return renderProducts(cache);
  renderProducts(cache.filter(p=> (p.name||'').toLowerCase().includes(qv) || (p.description||'').toLowerCase().includes(qv)));
});

el('refresh').addEventListener('click', loadProducts);

/* --- Delete Product (separate panel) --- */
el('delete-form').addEventListener('submit', async e=>{
  e.preventDefault();
  const id = Number(el('del-id').value);
  if(!id){ showToast('Enter id to delete','error'); return; }
  openConfirm(id);
});
el('del-clear').addEventListener('click', ()=>{ el('del-id').value=''; });

/* --- Confirm modal --- */
const confirmModal = el('confirm-modal'); let confirmTarget=null;
function openConfirm(id){ confirmTarget = id; el('confirm-text').textContent = `Delete product ${id}?`; confirmModal.classList.remove('hidden'); }
function closeConfirm(){ confirmTarget=null; confirmModal.classList.add('hidden'); }
el('confirm-close').addEventListener('click', closeConfirm); el('confirm-no').addEventListener('click', closeConfirm);
el('confirm-yes').addEventListener('click', async ()=>{ if(!confirmTarget) return; try{ const res=await fetch(API+`/deleteProduct/${confirmTarget}`,{method:'DELETE'}); const txt=await res.text(); showToast(txt,'success'); closeConfirm(); loadProducts(); }catch(err){ handleError(err); } });

/* --- Modal viewer --- */
const modal = el('modal'); function openModal(p){ if(!p) return; el('m-id').textContent = p.id; el('m-name').textContent = p.name; el('m-desc').textContent = p.description; el('m-price').textContent = p.price; modal.classList.remove('hidden'); }
function closeModal(){ modal.classList.add('hidden'); }
el('modal-close').addEventListener('click', closeModal); el('modal-close-2').addEventListener('click', closeModal);
el('modal-edit').addEventListener('click', ()=>{ const id = el('m-id').textContent; document.querySelector('.tab[data-tab="update"]').click(); el('upd-id').value = id; el('load-for-update').click(); closeModal(); });

/* --- Init --- */
// load products when view tab clicked
document.querySelector('.tab[data-tab="view"]').addEventListener('click', loadProducts);
// ensure first load of view cache when user clicks view
