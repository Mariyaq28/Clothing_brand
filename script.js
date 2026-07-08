const PRODUCTS = [
  { id: 1,  name: "Oversized Hoodie",    cat: "men",         price: 4999, was: 5999, img: "https://groovypakistan.com/cdn/shop/files/8_c41067dd-24f8-4915-837c-2bf3fea4027c.jpg?v=1730983279&width=848", tag: "Bestseller", isNew: true, sizes: ['XS','S','M','L','XL'] },
  { id: 2,  name: "Rib Knit Dress",      cat: "women",       price: 5499, was: null, img: "https://999.com.pk/cdn/shop/products/109_50419395-1f7a-450b-aef5-2e11e56aed4d.jpg?v=1633155663&width=640",  tag: "Limited",    isNew: true, sizes: ['XS','S','M','L'] },
  { id: 3,  name: "Relaxed Chinos",      cat: "men",         price: 4299, was: 4699, img: "https://furorjeans.com/cdn/shop/files/0N9A4976FMBCP5-007thumbnail_640x800_crop_center.webp?v=1748676431",                        sizes: ['28','30','32','34','36'] },
  { id: 4,  name: "Quilted Tote",        cat: "accessories", price: 2999, was: null, img: "https://rising.com.pk/cdn/shop/products/2187LILAC1.jpg?v=1678253420",                                                              sizes: ['One Size'] },
  { id: 5,  name: "Cropped Blazer",      cat: "women",       price: 6999, was: 7999, img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=900&auto=format&fit=crop",               isNew: true, sizes: ['XS','S','M','L'] },
  { id: 6,  name: "Classic Tee",         cat: "men",         price: 1999, was: 2499, img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=900&auto=format&fit=crop",                              sizes: ['XS','S','M','L','XL'] },
  { id: 7,  name: "Satin Skirt",         cat: "women",       price: 3899, was: null, img: "https://999.com.pk/cdn/shop/files/DSC00783_2048x2048.jpg?v=1755780755",                                                            sizes: ['XS','S','M','L'] },
  { id: 8,  name: "Cable Knit Sweater",  cat: "women",       price: 4899, was: 5399, img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=900&auto=format&fit=crop",                              sizes: ['XS','S','M','L','XL'] },
  { id: 9,  name: "Linen Shirt",         cat: "men",         price: 3599, was: 3999, img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=900&auto=format&fit=crop",                              sizes: ['XS','S','M','L','XL'] },
  { id: 10, name: "Leather Belt",        cat: "accessories", price: 1999, was: null, img: "https://diners.com.pk/cdn/shop/files/IE65BROWNRS2690-02_1370x.webp?v=1714798847",                                                  sizes: ['S/M','L/XL'] },
  { id: 11, name: "Beanie",              cat: "accessories", price: 1299, was: null, img: "https://furorjeans.com/cdn/shop/files/0N9A4593-FABC22-005thumbnail_640x800_crop_center.jpg?v=1694683348",                           sizes: ['One Size'] },
  { id: 12, name: "Overshirt Jacket",    cat: "men",         price: 6199, was: null, img: "https://bananarepublic.gap.com/webcontent/0056/363/709/cn56363709.jpg",                                      isNew: true, sizes: ['XS','S','M','L','XL'] },
];

/* ── FALLBACK IMAGE (shown when product image fails to load) ── */
const IMG_FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400' viewBox='0 0 300 400'%3E%3Crect width='300' height='400' fill='%23ede9e3'/%3E%3Cg opacity='.4'%3E%3Crect x='110' y='130' width='80' height='100' rx='4' fill='%23b0a898'/%3E%3Cpath d='M90 230l55-70 40 52 28-34 57 72H90z' fill='%23b0a898'/%3E%3C/g%3E%3Ctext x='50%25' y='88%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='13' fill='%23999'%3EImage unavailable%3C/text%3E%3C/svg%3E";

const state = { cat: "all", query: "", sort: "featured", cart: [] };
const fmt = n => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(n);

/* ── TRACKS SELECTED SIZE PER PRODUCT (id → size string) ── */
const selectedSizes = new Map();

/* ── CART PERSISTENCE (localStorage) ── */
function saveCart() {
  try { localStorage.setItem('mq-cart', JSON.stringify(state.cart)); } catch (_) {}
}
function loadCart() {
  try { return JSON.parse(localStorage.getItem('mq-cart') || '[]'); } catch (_) { return []; }
}

/* ── DEBOUNCE UTILITY ── */
function debounce(fn, delay) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}

/* ── TOAST NOTIFICATION SYSTEM ── */
function showToast(message, icon = '✓') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
  container.appendChild(toast);
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
        <div class="skeleton skeleton-line size-row"></div>
        <div class="skeleton skeleton-btn"></div>
      </div>
    </div>
  `).join('');
  document.getElementById('productCount').textContent = '';
}

/* ── SCROLL-TRIGGERED CARD ANIMATIONS ── */
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 55);
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

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
  const countEl = document.getElementById('productCount');
  const items = filtered();

  // Update product count label
  if (countEl) {
    if (state.query || state.cat !== 'all') {
      countEl.textContent = items.length
        ? `Showing ${items.length} of ${PRODUCTS.length} pieces`
        : '';
    } else {
      countEl.textContent = `Showing all ${PRODUCTS.length} pieces`;
    }
  }

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
      state.query = ''; state.cat = 'all';
      document.getElementById('searchInput').value = '';
      document.querySelectorAll('.chip').forEach(x => x.classList.remove('active'));
      document.querySelector('.chip[data-cat="all"]').classList.add('active');
      render();
    });
    return;
  }

  grid.innerHTML = items.map(p => {
    const save = p.was ? Math.round((1 - p.price / p.was) * 100) : 0;
    const isOneSize = p.sizes.length === 1 && p.sizes[0] === 'One Size';

    // Auto-select One Size items
    if (isOneSize) selectedSizes.set(p.id, 'One Size');

    const currentSize = selectedSizes.get(p.id);

    const sizeSelectorHTML = isOneSize ? '' : `
      <div class="size-selector" data-product-id="${p.id}">
        <span class="size-label">Size</span>
        <div class="size-options">
          ${p.sizes.map(s => `
            <button class="size-btn${currentSize === s ? ' selected' : ''}" data-size="${s}" aria-pressed="${currentSize === s}" aria-label="Select size ${s}">${s}</button>
          `).join('')}
        </div>
      </div>
    `;

    return `<div class="product-card animate-card" data-id="${p.id}">
      <div class="product-img">
        <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.onerror=null;this.src='${IMG_FALLBACK}'"/>
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
          ${sizeSelectorHTML}
        </div>
        <div class="product-actions">
          <button class="btn-add" data-id="${p.id}" aria-label="Add ${p.name} to cart">Add to cart</button>
          <button class="btn-wish${selectedSizes.has('wish-' + p.id) ? ' wished' : ''}" data-id="${p.id}" aria-label="Add ${p.name} to wishlist">♡</button>
        </div>
      </div>
    </div>`;
  }).join('');

  // Observe cards for scroll animation
  grid.querySelectorAll('.animate-card').forEach(card => cardObserver.observe(card));

  // ── EVENT DELEGATION on grid (replaces per-element listeners) ──
  grid.onclick = (e) => {
    // Size button click
    const sizeBtn = e.target.closest('.size-btn');
    if (sizeBtn) {
      const selector = sizeBtn.closest('.size-selector');
      const id = +selector.dataset.productId;
      const size = sizeBtn.dataset.size;
      selectedSizes.set(id, size);
      // Update UI: deselect all, select this one
      selector.querySelectorAll('.size-btn').forEach(b => {
        b.classList.remove('selected');
        b.setAttribute('aria-pressed', 'false');
      });
      sizeBtn.classList.add('selected');
      sizeBtn.setAttribute('aria-pressed', 'true');
      // Re-enable add button if it was in an error state
      const card = sizeBtn.closest('.product-card');
      card?.querySelector('.btn-add')?.classList.remove('no-size');
      return;
    }

    // Add to cart click
    const addBtn = e.target.closest('.btn-add');
    if (addBtn) {
      const id = +addBtn.dataset.id;
      const size = selectedSizes.get(id);
      if (!size) {
        // Shake the size selector and show toast
        const card = addBtn.closest('.product-card');
        const opts = card?.querySelector('.size-options');
        if (opts) { opts.classList.add('shake'); setTimeout(() => opts.classList.remove('shake'), 600); }
        addBtn.classList.add('no-size');
        setTimeout(() => addBtn.classList.remove('no-size'), 600);
        showToast('Please select a size first', '📐');
        return;
      }
      addCart(id, size, addBtn);
      return;
    }

    // Wishlist toggle
    const wishBtn = e.target.closest('.btn-wish');
    if (wishBtn) {
      const wished = wishBtn.classList.toggle('wished');
      wishBtn.textContent = wished ? '♥' : '♡';
    }
  };
}

/* ── CART FUNCTIONS ── */
function addCart(id, size, btn) {
  const product = PRODUCTS.find(p => p.id === id);
  // Items with same id but different size are separate line items
  const existing = state.cart.find(i => i.id === id && i.size === size);
  if (existing) existing.qty++;
  else state.cart.push({ id, qty: 1, size });

  saveCart();
  updateCart();

  // "Added!" visual feedback
  if (btn) {
    btn.textContent = '✓ Added!';
    btn.classList.add('added');
    setTimeout(() => { btn.textContent = 'Add to cart'; btn.classList.remove('added'); }, 1500);
  }

  // Badge bump animation
  const badge = document.getElementById('cartCount');
  badge.classList.remove('bump');
  void badge.offsetWidth;
  badge.classList.add('bump');

  showToast(`${product?.name ?? 'Item'} (${size}) added`, '🛍️');
}

function updateQty(id, size, d) {
  const it = state.cart.find(i => i.id === id && i.size === size);
  if (!it) return;
  it.qty += d;
  if (it.qty <= 0) state.cart = state.cart.filter(i => !(i.id === id && i.size === size));
  saveCart();
  updateCart();
}

function removeItem(id, size) {
  state.cart = state.cart.filter(i => !(i.id === id && i.size === size));
  saveCart();
  updateCart();
}

function updateCart() {
  const total = state.cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cartCount').textContent = total;

  // Update mobile CTA count
  const mobileCount = document.getElementById('mobileCtaCount');
  if (mobileCount) mobileCount.textContent = total === 0 ? '0 items' : `${total} item${total !== 1 ? 's' : ''}`;

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
      <img src="${i.img}" alt="${i.name}" onerror="this.onerror=null;this.src='${IMG_FALLBACK}'"/>
      <div>
        <div class="cart-item-name">${i.name}</div>
        <div class="cart-item-size">Size: ${i.size}</div>
        <div class="cart-item-price">${fmt(i.price)}</div>
        <div class="qty-control">
          <button class="qty-btn" data-id="${i.id}" data-size="${i.size}" data-dir="-1" aria-label="Decrease quantity">−</button>
          <span style="font-weight:600;min-width:24px;text-align:center">${i.qty}</span>
          <button class="qty-btn" data-id="${i.id}" data-size="${i.size}" data-dir="1" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <button class="cart-remove-btn" data-id="${i.id}" data-size="${i.size}" aria-label="Remove ${i.name} from cart">×</button>
    </div>
  `).join('');
}

/* ── CART BODY: event delegation (replaces inline onclick) ── */
document.getElementById('cartBody').addEventListener('click', e => {
  const qtyBtn = e.target.closest('.qty-btn');
  if (qtyBtn) {
    updateQty(+qtyBtn.dataset.id, qtyBtn.dataset.size, +qtyBtn.dataset.dir);
    return;
  }
  const removeBtn = e.target.closest('.cart-remove-btn');
  if (removeBtn) {
    removeItem(+removeBtn.dataset.id, removeBtn.dataset.size);
  }
});

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
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggleBtn.addEventListener('click', () => {
  const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
  themeToggleBtn.innerHTML = theme === 'dark'
    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>`
    : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>`;
}

/* ── FILTERS: CHIPS ── */
document.getElementById('chips').addEventListener('click', e => {
  const c = e.target.closest('.chip'); if (!c) return;
  document.querySelectorAll('.chip').forEach(x => x.classList.remove('active'));
  c.classList.add('active');
  state.cat = c.dataset.cat;
  render();
});

/* ── FILTERS: SORT & SEARCH (debounced) ── */
document.getElementById('sortSel').addEventListener('change', e => { state.sort = e.target.value; render(); });

const debouncedSearch = debounce(() => {
  state.query = document.getElementById('searchInput').value.trim();
  render();
}, 250);

document.getElementById('searchInput').addEventListener('input', debouncedSearch);
document.getElementById('searchBtn').addEventListener('click', () => {
  state.query = document.getElementById('searchInput').value.trim(); render();
});
document.getElementById('searchInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') { state.query = e.target.value.trim(); render(); }
});

/* ── CART TOGGLES ── */
document.getElementById('cartBtn').addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCart);
document.getElementById('overlay').addEventListener('click', closeCart);
document.getElementById('mobileCtaBtn')?.addEventListener('click', openCart);

/* ── MOBILE MENU (with aria-expanded) ── */
const menuToggle = document.getElementById('menuToggle');
const mobileNav  = document.getElementById('mobileNav');
menuToggle.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});
// Close mobile nav on link click
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mobileNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

/* ── NEWSLETTER ── */
document.getElementById('nlForm').addEventListener('submit', e => {
  e.preventDefault();
  const em = document.getElementById('nlEmail').value;
  showToast(`You're in! We'll reach you at ${em}.`, '✉️');
  e.target.reset();
});

/* ── BACK TO TOP ── */
const backToTopBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTopBtn.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });
backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── INIT ── */
document.getElementById('yr').textContent = new Date().getFullYear();

// Restore cart from localStorage
state.cart = loadCart();

// Show skeleton on first load, then render real products
renderSkeletons(8);
setTimeout(() => {
  render();
  updateCart();
}, 400);