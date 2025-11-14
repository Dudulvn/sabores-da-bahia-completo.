(function () {
  try {
    // Melhoria simples: loga a página atual e realça o foco de teclado nos links
    console.log("Sabores da Bahia - página atual:", location.pathname.split("/").pop() || "index.html");

    var links = document.querySelectorAll("a.nav-link");
    var currentPage = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    links.forEach(function (link) {
      var href = (link.getAttribute("href") || "").toLowerCase();
      if (href === currentPage || (currentPage === "" && href === "index.html")) {
        link.classList.add("active");
      }
      link.addEventListener("focus", function () {
        link.style.outline = "2px solid #C62828";
        link.style.outlineOffset = "2px";
      });
      link.addEventListener("blur", function () {
        link.style.outline = "";
        link.style.outlineOffset = "";
      });
    });

    // Adiciona botão de CTA "Adicionar" em cada produto do cardápio (index)
    var productCards = document.querySelectorAll(".menu .menu-item .menu-item-content");
    productCards.forEach(function (contentEl) {
      if (!contentEl.querySelector(".add-to-cart")) {
        var btn = document.createElement("button");
        btn.className = "add-to-cart";
        btn.type = "button";
        btn.textContent = "Adicionar";
        btn.addEventListener("click", function () {
          var itemEl = contentEl.closest(".menu-item");
          var titleEl = contentEl.querySelector(".item-title");
          var priceEl = contentEl.querySelector(".item-price");
          var imgEl = itemEl.querySelector(".item-image");
          var title = titleEl ? titleEl.textContent.trim() : "Produto";
          var priceText = priceEl ? priceEl.textContent.trim() : "R$ 0,00";
          var image = imgEl ? imgEl.getAttribute("src") : "";
          addToCart({ title: title, price: parseBRL(priceText), image: image });
        });
        contentEl.appendChild(btn);
      }
    });

    // Lógica do carrinho (somente na home)
    if (document.querySelector(".menu")) {
      initCart();
    }
  } catch (e) {
    // desabilita o aviso do eslint para uso de console
    // eslint-disable-next-line no-console
    console.log("A inicialização do site encontrou um erro:", e);
  }
})();

// --- Carrinho ---
var CART_STORAGE_KEY = "sdb_cart";
var cart = [];

function parseBRL(text) {
  try {
    var n = text.replace(/[R$\s]/g, "").replace(/\./g, "").replace(",", ".");
    var v = parseFloat(n);
    return isNaN(v) ? 0 : v;
  } catch (e) {
    return 0;
  }
}

function formatBRL(value) {
  try {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  } catch (e) {
    var str = (Math.round(value * 100) / 100).toFixed(2).replace(".", ",");
    return "R$ " + str;
  }
}

function loadCart() {
  try {
    var raw = localStorage.getItem(CART_STORAGE_KEY);
    cart = raw ? JSON.parse(raw) : [];
  } catch (e) {
    cart = [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    // ignore
  }
}

function addToCart(item) {
  loadCart();
  var existing = cart.find(function (p) { return p.title === item.title; });
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ title: item.title, price: item.price, image: item.image, qty: 1 });
  }
  saveCart();
  updateCartUI();
}

function incrementItem(title) {
  var it = cart.find(function (p) { return p.title === title; });
  if (it) {
    it.qty += 1;
    saveCart();
    updateCartUI();
  }
}

function decrementItem(title) {
  var it = cart.find(function (p) { return p.title === title; });
  if (it) {
    it.qty -= 1;
    if (it.qty <= 0) {
      cart = cart.filter(function (p) { return p.title !== title; });
    }
    saveCart();
    updateCartUI();
  }
}

function removeItem(title) {
  cart = cart.filter(function (p) { return p.title !== title; });
  saveCart();
  updateCartUI();
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartUI();
}

function cartTotal() {
  return cart.reduce(function (sum, p) { return sum + p.price * p.qty; }, 0);
}

function updateCartUI() {
  var countEl = document.getElementById("cartCount");
  var itemsEl = document.getElementById("cartItems");
  var totalEl = document.getElementById("cartTotal");
  var emptyEl = document.getElementById("cartEmpty");

  var count = cart.reduce(function (sum, p) { return sum + p.qty; }, 0);
  if (countEl) countEl.textContent = String(count);

  if (!itemsEl || !totalEl || !emptyEl) return;

  itemsEl.innerHTML = "";
  if (cart.length === 0) {
    emptyEl.style.display = "block";
  } else {
    emptyEl.style.display = "none";
    cart.forEach(function (p) {
      var tr = document.createElement("tr");

      var tdInfo = document.createElement("td");
      var infoWrap = document.createElement("div");
      infoWrap.className = "cart-item-info";
      if (p.image) {
        var img = document.createElement("img");
        img.className = "cart-item-thumb";
        img.src = p.image;
        img.alt = p.title;
        infoWrap.appendChild(img);
      }
      var nameSpan = document.createElement("span");
      nameSpan.textContent = p.title;
      infoWrap.appendChild(nameSpan);
      tdInfo.appendChild(infoWrap);

      var tdQty = document.createElement("td");
      var qtyWrap = document.createElement("div");
      qtyWrap.className = "qty-controls";
      var btnDec = document.createElement("button");
      btnDec.className = "qty-btn";
      btnDec.type = "button";
      btnDec.setAttribute("data-action", "dec");
      btnDec.setAttribute("data-title", p.title);
      btnDec.textContent = "−";
      var qtyVal = document.createElement("span");
      qtyVal.className = "qty-value";
      qtyVal.textContent = String(p.qty);
      var btnInc = document.createElement("button");
      btnInc.className = "qty-btn";
      btnInc.type = "button";
      btnInc.setAttribute("data-action", "inc");
      btnInc.setAttribute("data-title", p.title);
      btnInc.textContent = "+";
      qtyWrap.appendChild(btnDec);
      qtyWrap.appendChild(qtyVal);
      qtyWrap.appendChild(btnInc);
      tdQty.appendChild(qtyWrap);

      var tdPrice = document.createElement("td");
      tdPrice.textContent = formatBRL(p.price);

      var tdSub = document.createElement("td");
      tdSub.textContent = formatBRL(p.price * p.qty);

      var tdAct = document.createElement("td");
      var btnRem = document.createElement("button");
      btnRem.className = "remove-btn";
      btnRem.type = "button";
      btnRem.setAttribute("data-action", "remove");
      btnRem.setAttribute("data-title", p.title);
      btnRem.textContent = "Remover";
      tdAct.appendChild(btnRem);

      tr.appendChild(tdInfo);
      tr.appendChild(tdQty);
      tr.appendChild(tdPrice);
      tr.appendChild(tdSub);
      tr.appendChild(tdAct);
      itemsEl.appendChild(tr);
    });
  }

  totalEl.textContent = formatBRL(cartTotal());
}

function openCart() {
  var overlay = document.getElementById("cartModal");
  if (!overlay) return;
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
}
function closeCart() {
  var overlay = document.getElementById("cartModal");
  if (!overlay) return;
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
}

function initCart() {
  loadCart();
  updateCartUI();

  var openBtn = document.getElementById("openCartBtn");
  var closeBtn = document.getElementById("closeCartBtn");
  var clearBtn = document.getElementById("clearCartBtn");
  var finalizeBtn = document.getElementById("finalizeBtn");
  var overlay = document.getElementById("cartModal");
  var itemsEl = document.getElementById("cartItems");

  if (openBtn) openBtn.addEventListener("click", openCart);
  if (closeBtn) closeBtn.addEventListener("click", closeCart);
  if (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeCart();
    });
  }
  if (clearBtn) clearBtn.addEventListener("click", clearCart);
  if (finalizeBtn) finalizeBtn.addEventListener("click", function () {
    if (cart.length === 0) {
      alert("Seu carrinho está vazio.");
      return;
    }
    alert("Pedido finalizado! Total: " + formatBRL(cartTotal()));
    clearCart();
    closeCart();
  });
  if (itemsEl) {
    itemsEl.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      var action = btn.getAttribute("data-action");
      var title = btn.getAttribute("data-title");
      if (!action || !title) return;
      if (action === "inc") incrementItem(title);
      if (action === "dec") decrementItem(title);
      if (action === "remove") removeItem(title);
    });
  }
}



