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

/* ── TOAST NOTIFICATION SYSTEM ── */
function showToast(message, icon = '✓') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
  container.appendChild(toast);

  // Auto-dismiss after 2.5s
  const dismiss = () => {
    toast.classList.add('toast-out');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  };
  setTimeout(dismiss, 2500);
}

/* ── SKELETON SCREEN ── */
function renderSkeletons(count = 8) {
  const grid = document.getElementById('grid');
  grid.innerHTML = Array.from({ length: count }, () => `
    <div class="skeleton-card">
      <div class="skeleton skeleton-img"></div>
      <div class="skeleton-body">
        <div class="skeleton skeleton-line wide"></div>
        <div class="skeleton skeleton-line narrow"></div>
        <div class="skeleton skeleton-line price"></div>
        <div class="skeleton skeleton-btn"></div>
      </div>
    </div>
  `).join('');
}

/* ── FILTER & SORT ── */
function filtered() {
  let list = [...PRODUCTS];
  if (state.cat !== 'all') list = list.filter(p => p.cat === state.cat);
  if (state.query) list = list.filter(p => p.name.toLowerCase().includes(state.query.toLowerCase()));
  if (state.sort === 'price-asc') list.sort((a, b) => a.price - b.price);
  else if (state.sort === 'price-desc') list.sort((a, b) => b.price - a.price);
  else list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  return list;
}

/* ── RENDER PRODUCTS ── */
function render() {
  const grid = document.getElementById('grid');
  const items = filtered();

  // Empty state — no results found
  if (!items.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <h3>No results found</h3>
        <p>We couldn't find any pieces matching "<strong>${state.query || state.cat}</strong>". Try a different search or browse all pieces.</p>
        <button class="btn btn-dark" id="clearSearch">Browse All Pieces</button>
      </div>
    `;
    document.getElementById('clearSearch')?.addEventListener('click', () => {
      state.query = '';
      state.cat = 'all';
      document.getElementById('searchInput').value = '';
      document.querySelectorAll('.chip').forEach(x => x.classList.remove('active'));
      document.querySelector('.chip[data-cat="all"]').classList.add('active');
      render();
    });
    return;
  }

  grid.innerHTML = items.map(p => {
    const save = p.was ? Math.round((1 - p.price / p.was) * 100) : 0;
    return `<div class="product-card">
      <div class="product-img">
        <img src="${p.img}" alt="${p.name}" loading="lazy"/>
        ${p.isNew ? '<span class="product-pill pill-new">New</span>' : ''}
        ${p.was ? `<span class="product-pill pill-sale">${save}% OFF</span>` : ''}
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
          <button class="btn-add" data-id="${p.id}" aria-label="Add ${p.name} to cart">Add to cart</button>
          <button class="btn-wish" aria-label="Add ${p.name} to wishlist">♡</button>
        </div>
      </div>
    </div>`;
  }).join('');

  // Add to cart with "Added!" feedback
  grid.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = +btn.dataset.id;
      addCart(id, btn);
    });
  });

  // Wishlist toggle
  grid.querySelectorAll('.btn-wish').forEach(btn => {
    btn.addEventListener('click', () => {
      const wished = btn.classList.toggle('wished');
      btn.textContent = wished ? '♥' : '♡';
    });
  });
}

/* ── CART FUNCTIONS ── */
function addCart(id, btn) {
  const product = PRODUCTS.find(p => p.id === id);
  const existing = state.cart.find(i => i.id === id);
  if (existing) existing.qty++;
  else state.cart.push({ id, qty: 1 });

  updateCart();

  // "Added!" visual feedback on button
  if (btn) {
    btn.textContent = '✓ Added!';
    btn.classList.add('added');
    setTimeout(() => {
      btn.textContent = 'Add to cart';
      btn.classList.remove('added');
    }, 1500);
  }

  // Badge bump animation
  const badge = document.getElementById('cartCount');
  badge.classList.remove('bump');
  void badge.offsetWidth; // reflow to restart animation
  badge.classList.add('bump');

  // Toast notification instead of auto-opening cart
  showToast(`${product?.name ?? 'Item'} added to cart`, '🛍️');
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

  // Update mobile CTA bar count
  const mobileCount = document.getElementById('mobileCtaCount');
  if (mobileCount) {
    mobileCount.textContent = total === 0 ? '0 items' : `${total} item${total !== 1 ? 's' : ''}`;
  }

  const det = state.cart.map(i => ({ ...i, ...PRODUCTS.find(p => p.id === i.id) }));
  const sub = det.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById('cartTotal').textContent = fmt(sub);
  
  const body = document.getElementById('cartBody');
  if (!det.length) {
    body.innerHTML = `<div class="cart-empty"><div class="cart-empty-icon">🛍️</div><p>Your cart is empty</p></div>`;
    return;
  }
  
  body.innerHTML = det.map(i => `
    <div class="cart-item">
      <img src="${i.img}" alt="${i.name}"/>
      <div>
        <div class="cart-item-name">${i.name}</div>
        <div class="cart-item-price">${fmt(i.price)}</div>
        <div class="qty-control">
          <button class="qty-btn" onclick="updateQty(${i.id}, -1)" aria-label="Decrease quantity of ${i.name}">−</button>
          <span style="font-weight:600;min-width:24px;text-align:center">${i.qty}</span>
          <button class="qty-btn" onclick="updateQty(${i.id}, 1)" aria-label="Increase quantity of ${i.name}">+</button>
        </div>
      </div>
      <button onclick="removeItem(${i.id})" style="background:none;border:none;color:var(--text-muted);cursor:pointer;padding:8px;font-size:1.4rem;align-self:start;line-height:1;transition:color .2s ease" aria-label="Remove ${i.name} from cart" onmouseover="this.style.color='var(--danger)'" onmouseout="this.style.color='var(--text-muted)'">×</button>
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

/* ── THEME SWITCHER ── */
const themeToggleBtn = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'light';

if (savedTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
  updateThemeIcon('dark');
} else {
  document.documentElement.setAttribute('data-theme', 'light');
  updateThemeIcon('light');
}

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
  if (theme === 'dark') {
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
    themeToggleBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
  }
}

/* ── FILTERS: CHIPS ── */
document.getElementById('chips').addEventListener('click', e => {
  const c = e.target.closest('.chip'); if (!c) return;
  document.querySelectorAll('.chip').forEach(x => x.classList.remove('active'));
  c.classList.add('active');
  state.cat = c.dataset.cat;
  render();
});

/* ── FILTERS: SORT & SEARCH ── */
document.getElementById('sortSel').addEventListener('change', e => { state.sort = e.target.value; render(); });

// Real-time search as user types
document.getElementById('searchInput').addEventListener('input', e => {
  state.query = e.target.value.trim();
  render();
});
// Still support pressing Go or Enter explicitly
document.getElementById('searchBtn').addEventListener('click', () => {
  state.query = document.getElementById('searchInput').value.trim();
  render();
});
document.getElementById('searchInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') { state.query = e.target.value.trim(); render(); }
});

/* ── CART TOGGLES ── */
document.getElementById('cartBtn').addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCart);
document.getElementById('overlay').addEventListener('click', closeCart);

/* ── MOBILE STICKY CTA ── */
document.getElementById('mobileCtaBtn')?.addEventListener('click', openCart);

/* ── NEWSLETTER ── */
document.getElementById('nlForm').addEventListener('submit', e => {
  e.preventDefault();
  const em = document.getElementById('nlEmail').value;
  showToast(`You're in! We'll reach you at ${em}.`, '✉️');
  e.target.reset();
});

/* ── MOBILE MENU ── */
document.getElementById('menuToggle').addEventListener('click', () => {
  document.getElementById('mobileNav').classList.toggle('open');
});

/* ── INIT ── */
document.getElementById('yr').textContent = new Date().getFullYear();

// Show skeleton on first load for a polished feel
renderSkeletons(8);
setTimeout(() => {
  render();
  updateCart();
}, 400);