// JellyMilk - keranjang belanja sederhana
// Ganti nomor WhatsApp di bawah dengan nomor toko (format internasional tanpa + atau spasi).
const WHATSAPP_NUMBER = "6283137009809";
const SHIPPING_COST = 10000;

const products = [
  { id: "original", name: "Susu Jelly Original", price: 12000, flavor: "original", emoji: "🥛", drink1: "#f9edda", drink2: "#fffdf5", decor: "🍮", decor2: "🫖" },
  { id: "cokelat", name: "Susu Jelly Cokelat", price: 13000, flavor: "cokelat", emoji: "🍫", drink1: "#6e3d25", drink2: "#b77c51", decor: "🍫", decor2: "🍪" },
  { id: "strawberry", name: "Susu Jelly Strawberry", price: 13000, flavor: "strawberry", emoji: "🍓", drink1: "#ffb4bd", drink2: "#fff0f2", decor: "🍓", decor2: "🍓" },
  { id: "matcha", name: "Susu Jelly Matcha", price: 14000, flavor: "matcha", emoji: "🍵", drink1: "#a7bf45", drink2: "#e3edaa", decor: "🍃", decor2: "🥛" },
  { id: "taro", name: "Susu Jelly Taro", price: 14000, flavor: "taro", emoji: "🧋", drink1: "#b88acb", drink2: "#ead9f3", decor: "🍇", decor2: "🫐" }
];

let cart = [];
let activeFlavor = "all";

const productGrid = document.getElementById("productGrid");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const subtotalEl = document.getElementById("subtotal");
const totalEl = document.getElementById("total");
const searchInput = document.getElementById("searchInput");

function rupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", maximumFractionDigits: 0
  }).format(amount).replace(/\u00a0/g, " ");
}

function renderProducts() {
  if (!productGrid) return;
  const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
  const filtered = products.filter(product => {
    const flavorMatches = activeFlavor === "all" || product.flavor === activeFlavor;
    const searchMatches = product.name.toLowerCase().includes(query);
    return flavorMatches && searchMatches;
  });

  productGrid.innerHTML = "";
  if (filtered.length === 0) {
    productGrid.innerHTML = '<p class="empty-cart">Produk tidak ditemukan. Coba kata kunci lain.</p>';
    return;
  }

  filtered.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-visual">
        <span class="decor left">${product.decor2}</span>
        <div class="mini-cup" style="--drink1:${product.drink1};--drink2:${product.drink2}">
          <span class="top-jelly">🟥 🟨</span><span class="cup-emoji">🥤</span>
          <b>JellyMilk</b><small>Milk • Jelly • Happiness</small>
        </div>
        <span class="decor">${product.decor}</span>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3><div class="price">${rupiah(product.price)}</div>
        <button class="add-btn" data-add="${product.id}">＋ Keranjang</button>
      </div>`;
    productGrid.appendChild(card);
  });
}

function addToCart(id) {
  const existing = cart.find(item => item.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ id, qty: 1 });
  renderCart();
  openCart();
}

function changeQty(id, change) {
  const item = cart.find(entry => entry.id === id);
  if (!item) return;
  item.qty += change;
  if (item.qty <= 0) cart = cart.filter(entry => entry.id !== id);
  renderCart();
}

function removeItem(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
}

function renderCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
  const total = subtotal + (cart.length ? SHIPPING_COST : 0);

  cartCount.textContent = totalItems;
  subtotalEl.textContent = rupiah(subtotal);
  document.getElementById("shipping").textContent = rupiah(cart.length ? SHIPPING_COST : 0);
  totalEl.textContent = rupiah(total);
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="empty-cart">🛒<br><br>Keranjangmu masih kosong.<br>Yuk pilih susu jelly favoritmu!</div>';
    return;
  }

  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return;
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div class="cart-thumb">${product.emoji}</div>
      <div>
        <h3>${product.name}</h3><div class="item-price">${rupiah(product.price)}</div>
        <div class="qty">
          <button type="button" data-minus="${product.id}" aria-label="Kurangi">−</button>
          <span>${item.qty}</span>
          <button type="button" data-plus="${product.id}" aria-label="Tambah">＋</button>
        </div>
      </div>
      <button class="remove" type="button" data-remove="${product.id}" aria-label="Hapus produk">♜</button>`;
    cartItems.appendChild(row);
  });
}

function openCart() {
  cartDrawer.classList.add("open");
  overlay.classList.add("show");
  document.body.style.overflow = "hidden";
}
function closeCart() {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("show");
  document.body.style.overflow = "";
}

productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(button.dataset.add);
});
cartItems.addEventListener("click", event => {
  const minus = event.target.closest("[data-minus]");
  const plus = event.target.closest("[data-plus]");
  const remove = event.target.closest("[data-remove]");
  if (minus) changeQty(minus.dataset.minus, -1);
  if (plus) changeQty(plus.dataset.plus, 1);
  if (remove) removeItem(remove.dataset.remove);
});

document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("continueBtn").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeCart();
});

document.querySelectorAll("[data-flavor]").forEach(link => {
  link.addEventListener("click", () => {
    activeFlavor = link.dataset.flavor;
    renderProducts();
  });
});
document.getElementById("showAll").addEventListener("click", event => {
  event.preventDefault();
  activeFlavor = "all";
  if (searchInput) searchInput.value = "";
  renderProducts();
});
if (searchInput) searchInput.addEventListener("input", renderProducts);

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Keranjang masih kosong. Silakan pilih produk terlebih dahulu.");
    return;
  }
  const lines = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    return `- ${product.name} x${item.qty} = ${rupiah(product.price * item.qty)}`;
  });
  const subtotal = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + product.price * item.qty;
  }, 0);
  const message = [
    "Halo JellyMilk! Saya ingin memesan:",
    "",
    ...lines,
    "",
    `Subtotal: ${rupiah(subtotal)}`,
    `Ongkos kirim: ${rupiah(SHIPPING_COST)}`,
    `TOTAL: ${rupiah(subtotal + SHIPPING_COST)}`,
    "",
    "Nama:",
    "Alamat pengiriman:"
  ].join("\n");
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
});

const waContact = document.getElementById("waContact");
if (waContact) {
  waContact.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Halo JellyMilk, saya mau tanya tentang produk.")}`;
}

document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("navMenu").classList.toggle("open");
});
document.querySelectorAll("#navMenu a").forEach(link => {
  link.addEventListener("click", () => document.getElementById("navMenu").classList.remove("open"));
});

renderProducts();
renderCart();
