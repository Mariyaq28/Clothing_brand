const PRODUCTS = [
  { id: 1, name: "Oversized Hoodie", cat: "men", price: 4999, was: 5999, img: "https://groovypakistan.com/cdn/shop/files/8_c41067dd-24f8-4915-837c-2bf3fea4027c.jpg?v=1730983279&width=848", tag: "Bestseller", isNew: true },
  { id: 2, name: "Rib Knit Dress", cat: "women", price: 5499, was: null, img: "https://999.com.pk/cdn/shop/products/109_50419395-1f7a-450b-aef5-2e11e56aed4d.jpg?v=1633155663&width=640", tag: "Limited", isNew: true },
  { id: 3, name: "Relaxed Chinos", cat: "men", price: 4299, was: 4699, img: "https://furorjeans.com/cdn/shop/files/0N9A4976FMBCP5-007thumbnail_640x800_crop_center.webp?v=1748676431" },
  { id: 4, name: "Quilted Tote", cat: "accessories", price: 2999, was: null, img: "https://rising.com.pk/cdn/shop/products/2187LILAC1.jpg?v=1678253420" },
  { id: 5, name: "Cropped Blazer", cat: "women", price: 6999, was: 7999, img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=900&auto=format&fit=crop", isNew: true },
  { id: 6, name: "Classic Tee", cat: "men", price: 1999, was: 2499, img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=900&auto=format&fit=crop" },
  { id: 7, name: "Satin Skirt", cat: "women", price: 3899, was: null, img: "https://999.com.pk/cdn/shop/files/DSC00783_2048x2048.jpg?v=1755780755" },
  { id: 8, name: "Cable Knit Sweater", cat: "women", price: 4899, was: 5399, img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=900&auto=format&fit=crop" },
  { id: 9, name: "Linen Shirt", cat: "men", price: 3599, was: 3999, img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=900&auto=format&fit=crop" },
  { id: 10, name: "Leather Belt", cat: "accessories", price: 1999, was: null, img: "https://diners.com.pk/cdn/shop/files/IE65BROWNRS2690-02_1370x.webp?v=1714798847" },
  { id: 11, name: "Beanie", cat: "accessories", price: 1299, was: null, img: "https://furorjeans.com/cdn/shop/files/0N9A4593-FABC22-005thumbnail_640x800_crop_center.jpg?v=1694683348" },
  { id: 12, name: "Overshirt Jacket", cat: "men", price: 6199, was: null, img: "https://bananarepublic.gap.com/webcontent/0056/363/709/cn56363709.jpg", isNew: true },
];

const state = { cat: "all", query: "", sort: "featured", cart: [] };
const fmt = n => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(n);

function filtered() {
  let list = [...PRODUCTS];
  if (state.cat !== 'all') list = list.filter(p => p.cat === state.cat);
  if (state.query) list = list.filter(p => p.name.toLowerCase().includes(state.query.toLowerCase()));
  if (state.sort === 'price-asc') list.sort((a, b) => a.price - b.price);
  else if (state.sort === 'price-desc') list.sort((a, b) => b.price - a.price);
  else list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  return list;
}

function render() {
  const grid = document.getElementById('grid');
  const items = filtered();
  grid.innerHTML = items.map(p => {
    const save = p.was ? Math.round((1 - p.price / p.was) * 100) : 0;
    return `<div class="product-card">
      <div class="product-img">
        <img src="${p.img}" alt="${p.name}" loading="lazy"/>
        ${p.isNew ? '<span class="product-pill pill-new">New</span>' : ''}
        ${p.was ? `<span class="product-pill pill-sale" style="top:${p.isNew ? '40px' : '12px'}">${save}% off</span>` : ''}
      </div>
      <div class="product-body">
        <div>
          <div class="product-name">${p.name}</div>
          <div class="product-price">
            <span class="price-now">${fmt(p.price)}</span>
            ${p.was ? `<span class="price-was">${fmt(p.was)}</span>` : ''}
          </div>
        </div>
        <div class="product-actions">
          <button class="btn-add" data-id="${p.id}">Add to cart</button>
          <button class="btn-wish" aria-label="Wishlist">♡</button>
        </div>
      </div>
    </div>`;
  }).join('');
  
  grid.querySelectorAll('.btn-add').forEach(b => b.addEventListener('click', () => addCart(+b.dataset.id)));
}

function addCart(id) {
  const f = state.cart.find(i => i.id === id);
  if (f) f.qty++; else state.cart.push({ id, qty: 1 });
  updateCart(); openCart();
}

function updateQty(id, d) {
  const it = state.cart.find(i => i.id === id);
  if (!it) return;
  it.qty += d;
  if (it.qty <= 0) state.cart = state.cart.filter(i => i.id !== id);
  updateCart();
}

function removeItem(id) { state.cart = state.cart.filter(i => i.id !== id); updateCart(); }

function updateCart() {
  const total = state.cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cartCount').textContent = total;
  const det = state.cart.map(i => ({ ...i, ...PRODUCTS.find(p => p.id === i.id) }));
  const sub = det.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById('cartTotal').textContent = fmt(sub);
  
  const body = document.getElementById('cartBody');
  if (!det.length) {
    body.innerHTML = `<div class="cart-empty"><div class="cart-empty-icon">🛍️</div><p>Your cart is empty</p></div>`; return;
  }
  
  body.innerHTML = det.map(i => `
    <div class="cart-item">
      <img src="${i.img}" alt="${i.name}"/>
      <div>
        <div class="cart-item-name">${i.name}</div>
        <div class="cart-item-price">${fmt(i.price)}</div>
        <div class="qty-control">
          <button class="qty-btn" onclick="updateQty(${i.id}, -1)" aria-label="Decrease quantity">−</button>
          <span style="font-weight:600;min-width:24px;text-align:center">${i.qty}</span>
          <button class="qty-btn" onclick="updateQty(${i.id}, 1)" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <button onclick="removeItem(${i.id})" style="background:none;border:none;color:var(--text-muted);cursor:pointer;padding:8px;font-size:1.4rem;align-self:start;line-height:1" aria-label="Remove item">×</button>
    </div>
  `).join('');
}

function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('overlay').classList.add('open');
}

function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('overlay').classList.remove('open');
}

/* ── THEME SWITCHER FUNCTIONALITY ── */
const themeToggleBtn = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'light';

// Set early theme configuration based on user history
if (savedTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
  updateThemeIcon('dark');
} else {
  document.documentElement.setAttribute('data-theme', 'light');
  updateThemeIcon('light');
}

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  let newTheme = 'light';
  
  if (currentTheme === 'light') {
    newTheme = 'dark';
  }
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
  if (theme === 'dark') {
    // Shows Sun icon when dark mode active
    themeToggleBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    `;
  } else {
    // Shows Moon icon when light mode active
    themeToggleBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
  }
}

// Chips Filters
document.getElementById('chips').addEventListener('click', e => {
  const c = e.target.closest('.chip'); if (!c) return;
  document.querySelectorAll('.chip').forEach(x => x.classList.remove('active'));
  c.classList.add('active'); state.cat = c.dataset.cat; render();
});

// Sort & Search Filters
document.getElementById('sortSel').addEventListener('change', e => { state.sort = e.target.value; render() });
document.getElementById('searchBtn').addEventListener('click', () => { state.query = document.getElementById('searchInput').value.trim(); render() });
document.getElementById('searchInput').addEventListener('keydown', e => { if (e.key === 'Enter') { state.query = e.target.value.trim(); render() } });

// Cart Toggles
document.getElementById('cartBtn').addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCart);
document.getElementById('overlay').addEventListener('click', closeCart);

// Newsletter Setup
document.getElementById('nlForm').addEventListener('submit', e => {
  e.preventDefault();
  const em = document.getElementById('nlEmail').value;
  alert(`You're in! We'll reach you at ${em}.`);
  e.target.reset();
});

// Mobile Action drawer Menu
document.getElementById('menuToggle').addEventListener('click', () => {
  document.getElementById('mobileNav').classList.toggle('open');
});

document.getElementById('yr').textContent = new Date().getFullYear();
render();
updateCart();