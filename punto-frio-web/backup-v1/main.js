(function () {
  "use strict";

  var data = window.__BRAND__ || {};
  var fineHover = matchMedia("(hover: hover) and (pointer: fine)").matches;

  var $ = function(sel, scope) { return (scope || document).querySelector(sel); };
  var $$ = function(sel, scope) { return Array.from((scope || document).querySelectorAll(sel)); };
  var escHTML = function(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function(c) {
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
    });
  };
  var fmt = function(n) { return "$" + Number(n).toLocaleString("es-AR"); };

  function safe(fn, name) {
    try { fn(); } catch(e) { console.warn("[" + name + "]", e); }
  }

  // ── Nav ──────────────────────────────────────────────────────
  function initNav() {
    var nav = $(".nav");
    if (!nav) return;

    // Active link by current page
    var page = location.pathname.split("/").pop() || "index.html";
    $$(".nav-links a").forEach(function(a) {
      var href = a.getAttribute("href") || "";
      if (href === page || (page === "index.html" && href === "") || (page === "" && href === "index.html")) {
        a.classList.add("is-active");
      }
    });

    // Scroll shadow
    window.addEventListener("scroll", function() {
      nav.classList.toggle("is-scrolled", window.scrollY > 20);
    }, { passive: true });

    // Hamburger
    var hamburger = $(".nav-hamburger");
    if (hamburger) {
      hamburger.addEventListener("click", function() {
        nav.classList.toggle("is-open");
      });
      // Close on link click
      $$(".nav-links a").forEach(function(a) {
        a.addEventListener("click", function() { nav.classList.remove("is-open"); });
      });
    }
  }

  // ── Smooth anchor scroll ─────────────────────────────────────
  function initSmoothScroll() {
    document.addEventListener("click", function(e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 88,
        behavior: "smooth"
      });
    });
  }

  // ── Reveal on scroll ─────────────────────────────────────────
  function initReveals() {
    var items = $$(".reveal");
    if (!items.length || !window.IntersectionObserver) {
      items.forEach(function(el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -3% 0px" });

    items.forEach(function(el) { io.observe(el); });

    // Safety: reveal anything still hidden after 5s
    setTimeout(function() {
      $$(".reveal:not(.is-visible)").forEach(function(el) {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add("is-visible");
        }
      });
    }, 5000);
  }

  // ── Category color helper ────────────────────────────────────
  function getCatInfo(catId) {
    var cats = data.categories || [];
    for (var i = 0; i < cats.length; i++) {
      if (cats[i].id === catId) return cats[i];
    }
    return { icon: "📦", color: "#F0F7FF", accent: "#1B66C2", name: catId };
  }

  // ── WhatsApp URL builder ─────────────────────────────────────
  function waURL(text) {
    return (data.waBase || "https://wa.me/542215440888") +
      "?text=" + encodeURIComponent(text || data.waText || "Hola! Quisiera hacer un pedido.");
  }

  // ── Build product card HTML ──────────────────────────────────
  function buildProductCard(p) {
    var cat = getCatInfo(p.cat);
    var msgText = "Hola! Quiero pedir: " + p.name + " (" + p.desc + ")";
    var photoHTML = p.photo
      ? '<img src="' + escHTML(p.photo) + '" alt="' + escHTML(p.name) + '" loading="lazy" decoding="async">'
      : '<span style="font-size:2.4rem">' + cat.icon + '</span>';
    return [
      '<article class="product-card" data-cat="' + escHTML(p.cat) + '">',
        '<div class="product-thumb" style="background:' + escHTML(cat.color) + '">',
          photoHTML,
        '</div>',
        '<div class="product-body">',
          '<span class="product-cat-badge" style="background:' + escHTML(cat.color) + ';color:' + escHTML(cat.accent) + '">',
            cat.icon + ' ' + escHTML(cat.name),
          '</span>',
          '<h3 class="product-name">' + escHTML(p.name) + '</h3>',
          '<p class="product-desc">' + escHTML(p.desc) + '</p>',
          '<div class="product-footer">',
            '<span class="product-price">' + fmt(p.price) + '</span>',
            '<a class="product-wa" href="' + escHTML(waURL(msgText)) + '" target="_blank" rel="noopener" aria-label="Pedir ' + escHTML(p.name) + ' por WhatsApp">',
              '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>',
              'Pedir',
            '</a>',
          '</div>',
        '</div>',
      '</article>'
    ].join("");
  }

  // ── Mount best sellers (home) ────────────────────────────────
  function mountBestSellers() {
    var target = $("[data-best-sellers]");
    if (!target || target.children.length > 0) return;
    var products = data.products || [];
    var bestIds = data.bestSellers || [];
    var featured = products.filter(function(p) { return bestIds.indexOf(p.id) !== -1; });
    target.innerHTML = featured.map(buildProductCard).join("");
  }

  // ── Mount categories (home) ──────────────────────────────────
  function mountCategories() {
    var target = $("[data-categories]");
    if (!target || target.children.length > 0) return;
    var cats = data.categories || [];
    target.innerHTML = cats.map(function(c) {
      return [
        '<a class="cat-card" href="catalogo.html?cat=' + escHTML(c.id) + '" aria-label="Ver ' + escHTML(c.name) + '">',
          '<div class="cat-icon" style="background:' + escHTML(c.color) + '">',
            '<span aria-hidden="true">' + c.icon + '</span>',
          '</div>',
          '<span class="cat-name">' + escHTML(c.name) + '</span>',
        '</a>'
      ].join("");
    }).join("");
  }

  // ── Mount full catalog ───────────────────────────────────────
  function mountCatalog() {
    var target = $("[data-catalog]");
    if (!target || target.children.length > 0) return;
    var products = data.products || [];
    target.innerHTML = products.map(buildProductCard).join("");
  }

  // ── Filter tabs (catalog page) ───────────────────────────────
  function initFilterTabs() {
    var tabs = $$(".filter-tab");
    if (!tabs.length) return;

    // Pre-select from URL
    var urlCat = new URLSearchParams(location.search).get("cat");

    function applyFilter(catId) {
      tabs.forEach(function(t) {
        t.classList.toggle("is-active", t.dataset.cat === catId);
      });
      $$(".product-card").forEach(function(card) {
        if (!catId || catId === "all") {
          card.classList.remove("is-hidden");
        } else {
          card.classList.toggle("is-hidden", card.dataset.cat !== catId);
        }
      });
    }

    tabs.forEach(function(tab) {
      tab.addEventListener("click", function() {
        applyFilter(tab.dataset.cat);
        history.replaceState(null, "", tab.dataset.cat !== "all" ? "?cat=" + tab.dataset.cat : location.pathname);
      });
    });

    if (urlCat) {
      applyFilter(urlCat);
    }
  }

  // ── Mount wholesale price table ──────────────────────────────
  function mountPriceTable() {
    var target = $("[data-price-table]");
    if (!target || target.children.length > 0) return;
    var products = data.products || [];
    var cats = data.categories || [];
    var rows = [];

    cats.forEach(function(c) {
      var catProducts = products.filter(function(p) { return p.cat === c.id; });
      if (!catProducts.length) return;
      rows.push('<tr class="cat-row"><td colspan="4">' + c.icon + ' ' + escHTML(c.name) + '</td></tr>');
      catProducts.forEach(function(p) {
        rows.push([
          '<tr>',
            '<td>' + escHTML(p.name) + '</td>',
            '<td class="desc">' + escHTML(p.desc) + '</td>',
            '<td class="price">' + fmt(p.price) + '</td>',
            '<td class="price-w">' + fmt(p.priceW) + '</td>',
          '</tr>'
        ].join(""));
      });
    });
    target.innerHTML = rows.join("");
  }

  // ── FAQ accordion ─────────────────────────────────────────────
  function initFAQ() {
    $$(".faq-item").forEach(function(item) {
      var q = item.querySelector(".faq-q");
      if (!q) return;
      q.addEventListener("click", function() {
        item.classList.toggle("is-open");
      });
    });
  }

  // ── GSAP ScrollTrigger for stagger cards ─────────────────────
  function initGSAP() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    // Stagger product cards
    $$(".products-grid, .categories-grid, .catalog-grid").forEach(function(grid) {
      var cards = Array.from(grid.children);
      gsap.from(cards, {
        opacity: 0, y: 30, stagger: 0.06,
        scrollTrigger: { trigger: grid, start: "top 85%", once: true },
        duration: 0.6, ease: "power3.out"
      });
    });
  }

  // ── Boot ─────────────────────────────────────────────────────
  function boot() {
    safe(initNav, "initNav");
    safe(initSmoothScroll, "initSmoothScroll");
    safe(mountCategories, "mountCategories");
    safe(mountBestSellers, "mountBestSellers");
    safe(mountCatalog, "mountCatalog");
    safe(mountPriceTable, "mountPriceTable");
    safe(initFilterTabs, "initFilterTabs");
    safe(initFAQ, "initFAQ");
    safe(initReveals, "initReveals");
    if (window.gsap && window.ScrollTrigger) {
      safe(initGSAP, "initGSAP");
    }
    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
