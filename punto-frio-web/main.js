/* ═══════════════════════════════════════════════════════════════
   PUNTO FRÍO CONGELADOS — main.js
   Vanilla JS · patrón IIFE · sin dependencias · v20260704
   El contenido vive en el HTML; este archivo solo lo anima.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var $  = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "]", e); }
  }

  /* ── Header: frost al scrollear ─────────────────────────── */
  function initHeader() {
    var header = $(".site-header");
    if (!header) return;
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        header.classList.toggle("is-scrolled", window.scrollY > 24);
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ── Menú overlay ───────────────────────────────────────── */
  function initMenu() {
    var burger  = $(".nav-burger");
    var overlay = $(".menu-overlay");
    if (!burger || !overlay) return;

    function setOpen(open) {
      overlay.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      document.body.classList.toggle("no-scroll", open);
      if (open) {
        var first = $("a", overlay);
        if (first) first.focus({ preventScroll: true });
      }
    }
    burger.addEventListener("click", function () {
      setOpen(!overlay.classList.contains("is-open"));
    });
    overlay.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) {
        setOpen(false);
        burger.focus();
      }
    });
  }

  /* ── Entrada del hero (palabras escalonadas) ────────────── */
  function initHeroIntro() {
    var hero = $("[data-hero]");
    if (!hero) return;
    setTimeout(function () { hero.classList.add("is-in"); }, 120);
  }

  /* ── Reveals on scroll ──────────────────────────────────── */
  function initReveal() {
    var targets = $$("[data-reveal]");
    if (!targets.length) return;

    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("is-revealed"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -2% 0px" });

    targets.forEach(function (el) { io.observe(el); });

    /* Red de seguridad: a los 6s, todo lo visible se muestra sí o sí */
    setTimeout(function () {
      $$("[data-reveal]:not(.is-revealed)").forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add("is-revealed");
        }
      });
    }, 6000);
  }

  /* ── Números que cuentan (envío gratis, etc.) ───────────── */
  function initCountUp() {
    var els = $$("[data-count-to]");
    if (!els.length) return;
    var fmt = new Intl.NumberFormat("es-AR");

    function animate(el) {
      var target = parseInt(el.getAttribute("data-count-to"), 10) || 0;
      var prefix = el.getAttribute("data-prefix") || "";
      var suffix = el.getAttribute("data-suffix") || "";
      var t0 = null;
      var DUR = 1300;
      function step(t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / DUR, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + fmt.format(Math.round(target * eased)) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (!("IntersectionObserver" in window)) {
      els.forEach(animate);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ── Tilt 3D sutil + halo en cards de producto ──────────── */
  function initTilt() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    var MAX = 5;
    $$(".prod-card").forEach(function (card) {
      if (card.dataset.tiltBound) return;
      card.dataset.tiltBound = "1";
      var rect = null;

      card.addEventListener("pointerenter", function () {
        rect = card.getBoundingClientRect();
      });
      card.addEventListener("pointermove", function (e) {
        if (!rect) rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        var y = (e.clientY - rect.top) / rect.height;
        card.style.setProperty("--hx", (x * 100).toFixed(1) + "%");
        card.style.setProperty("--hy", (y * 100).toFixed(1) + "%");
        card.style.transform =
          "perspective(850px) rotateX(" + ((0.5 - y) * MAX).toFixed(2) + "deg)" +
          " rotateY(" + ((x - 0.5) * MAX).toFixed(2) + "deg) translateY(-5px)";
      });
      card.addEventListener("pointerleave", function () {
        rect = null;
        card.style.transform = "";
      });
    });
  }

  /* ── Camioncito de reparto ──────────────────────────────── */
  function initTruck() {
    var scene = $("[data-truck-scene]");
    if (!scene) return;
    if (!("IntersectionObserver" in window)) {
      scene.classList.add("is-go");
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          scene.classList.add("is-go");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    io.observe(scene);
  }

  /* ── Botón flotante de WhatsApp ─────────────────────────── */
  function initFab() {
    var fab = $(".fab-wa");
    if (!fab) return;
    setTimeout(function () { fab.classList.add("is-in"); }, 600);

    var tip = $(".fab-tip");
    if (tip) {
      setTimeout(function () { tip.classList.add("is-show"); }, 3800);
      setTimeout(function () { tip.classList.remove("is-show"); }, 8600);
    }
  }

  /* ── Catálogo: buscador + filtros por categoría ─────────── */
  function initCatalog() {
    var grid = $("[data-catalog]");
    if (!grid) return;

    var chips   = $$(".cat-chip");
    var input   = $("[data-search]");
    var clearBtn = $("[data-search-clear]");
    var countEl = $("[data-count]");
    var empty   = $("[data-empty]");
    var cards   = $$(".prod-card", grid);
    var activeCat = "todos";

    function norm(s) {
      return (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
    }

    /* Pre-indexar nombres una sola vez */
    cards.forEach(function (card) {
      var name = $(".prod-name", card);
      card.dataset.search = norm(name ? name.textContent : "");
    });

    function apply() {
      var q = norm(input ? input.value : "");
      var shown = 0;
      cards.forEach(function (card) {
        var okCat = activeCat === "todos" || card.dataset.cat === activeCat;
        var okQ = !q || card.dataset.search.indexOf(q) !== -1;
        var show = okCat && okQ;
        card.classList.toggle("is-hidden", !show);
        card.classList.toggle("is-shown", show);
        if (show) shown++;
      });
      if (countEl) {
        countEl.innerHTML = "Mostrando <b>" + shown + "</b> " + (shown === 1 ? "producto" : "productos");
      }
      if (empty) empty.classList.toggle("is-visible", shown === 0);
      if (clearBtn) clearBtn.classList.toggle("is-visible", !!(input && input.value));
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("is-active"); });
        chip.classList.add("is-active");
        activeCat = chip.getAttribute("data-cat") || "todos";
        apply();
      });
    });

    if (input) {
      input.addEventListener("input", apply);
    }
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        if (input) { input.value = ""; input.focus(); }
        apply();
      });
    }
    var resetBtn = $("[data-reset-filters]");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        if (input) input.value = "";
        activeCat = "todos";
        chips.forEach(function (c) {
          c.classList.toggle("is-active", (c.getAttribute("data-cat") || "todos") === "todos");
        });
        apply();
      });
    }

    /* Deep-link: catalogo.html?cat=carnes preactiva ese filtro */
    try {
      var preCat = new URLSearchParams(window.location.search).get("cat");
      if (preCat) {
        var found = false;
        chips.forEach(function (c) { if (c.getAttribute("data-cat") === preCat) found = true; });
        if (found) {
          activeCat = preCat;
          chips.forEach(function (c) {
            c.classList.toggle("is-active", c.getAttribute("data-cat") === preCat);
          });
        }
      }
    } catch (e) { /* URLSearchParams no disponible: queda "todos" */ }

    apply();
  }

  /* ── Carrito de WhatsApp ────────────────────────────────── */
  /* Junta productos en localStorage y arma un único mensaje de
     WhatsApp con el pedido completo. Todo el UI se inyecta acá:
     sin JS no queda ningún control muerto en el HTML. */
  function initCart() {
    var KEY = "pfcart_v1";
    var WA = "5492215440888";
    var ICO_CART = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.6"/><circle cx="17.5" cy="20" r="1.6"/><path d="M2.5 3.5h2.6l2.2 11.2a1.6 1.6 0 0 0 1.6 1.3h8.6a1.6 1.6 0 0 0 1.6-1.3l1.4-7.2H6.1"/></svg>';
    var ICO_PLUS = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
    var ICO_TRASH = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6.5h16M9.5 6.5V4.8a1.3 1.3 0 011.3-1.3h2.4a1.3 1.3 0 011.3 1.3v1.7M6.5 6.5l.9 13a1.6 1.6 0 001.6 1.5h6a1.6 1.6 0 001.6-1.5l.9-13"/></svg>';
    var ICO_WA = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>';

    var state = {};
    try { state = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { state = {}; }
    var products = {};
    var lastFocus = null;

    function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
    function slug(s) {
      return (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
        .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    }
    function money(n) { return "$" + n.toLocaleString("es-AR"); }
    function count() { var c = 0, k; for (k in state) c += state[k].q; return c; }
    function total() { var t = 0, k; for (k in state) t += state[k].q * state[k].pr; return t; }

    /* 1 · Botón carrito en el header (junto al de WhatsApp) */
    var headerInner = $(".header-inner");
    var cartBtn = null;
    if (headerInner && !$(".nav-cart")) {
      var actions = document.createElement("div");
      actions.className = "header-actions";
      cartBtn = document.createElement("button");
      cartBtn.type = "button";
      cartBtn.className = "nav-cart";
      cartBtn.setAttribute("data-cart-open", "");
      cartBtn.setAttribute("aria-label", "Ver tu pedido");
      cartBtn.innerHTML = ICO_CART + '<span class="cart-count" data-cart-count hidden>0</span>';
      var wa = $(".nav-wa", headerInner);
      if (wa) {
        headerInner.insertBefore(actions, wa);
        actions.appendChild(wa);
      } else {
        headerInner.appendChild(actions);
      }
      actions.appendChild(cartBtn);
    }

    /* 2 · Drawer + overlay (idempotente) */
    if (!$(".cart-drawer")) {
      var overlay = document.createElement("div");
      overlay.className = "cart-overlay";
      overlay.setAttribute("data-cart-close", "");
      document.body.appendChild(overlay);

      var drawer = document.createElement("aside");
      drawer.className = "cart-drawer";
      drawer.setAttribute("role", "dialog");
      drawer.setAttribute("aria-modal", "true");
      drawer.setAttribute("aria-label", "Tu pedido");
      drawer.innerHTML =
        '<div class="cart-head">' +
          '<h2>' + ICO_CART + 'Tu pedido</h2>' +
          '<button type="button" class="cart-x" data-cart-close aria-label="Cerrar el pedido">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>' +
          '</button>' +
        '</div>' +
        '<div class="cart-body">' +
          '<div class="cart-empty" data-cart-empty>' +
            '<span class="ce-ico" aria-hidden="true">❄</span>' +
            '<p class="ce-title">Tu pedido está vacío</p>' +
            '<p class="ce-sub">Sumá productos y los mandamos todos juntos por WhatsApp.</p>' +
            '<a class="btn btn-ghost btn-sm" href="catalogo.html">Ver catálogo</a>' +
          '</div>' +
          '<ul class="cart-list" data-cart-list role="list"></ul>' +
        '</div>' +
        '<div class="cart-foot" data-cart-foot hidden>' +
          '<div class="cart-total"><span>Total estimado</span><b data-cart-total>$0</b></div>' +
          '<p class="cart-note">Precios de lista minorista. Te confirmamos disponibilidad y total al responderte.</p>' +
          '<a class="btn btn-wa cart-send" data-cart-send href="#" target="_blank" rel="noopener">' + ICO_WA + 'Enviar pedido por WhatsApp</a>' +
          '<button type="button" class="cart-clear" data-cart-clear>Vaciar pedido</button>' +
        '</div>';
      document.body.appendChild(drawer);
    }

    var drawerEl = $(".cart-drawer");
    var overlayEl = $(".cart-overlay");

    /* 3 · Controles en cada tarjeta de producto */
    $$(".prod-card").forEach(function (card) {
      var body = $(".prod-body", card);
      if (!body || $(".prod-actions", card)) return;
      var nameEl = $(".prod-name", card);
      var presEl = $(".prod-pres", card);
      var priceEl = $(".prod-price", card);
      if (!nameEl || !priceEl) return;
      var pr = parseInt((priceEl.textContent || "").replace(/[^\d]/g, ""), 10);
      if (!pr) return;
      var name = nameEl.textContent.trim();
      var pres = presEl ? presEl.textContent.trim() : "";
      var id = slug(name + "-" + pres);
      products[id] = { n: name, p: pres, pr: pr };
      card.setAttribute("data-cart-id", id);

      var wrap = document.createElement("div");
      wrap.className = "prod-actions";
      wrap.innerHTML =
        '<button type="button" class="btn-add" data-add="' + id + '">' + ICO_PLUS + 'Agregar</button>' +
        '<div class="qty-ctrl" hidden>' +
          '<button type="button" data-q="-1" data-id="' + id + '" aria-label="Quitar uno">−</button>' +
          '<span class="qty" aria-live="polite">0</span>' +
          '<button type="button" data-q="1" data-id="' + id + '" aria-label="Sumar uno">+</button>' +
        '</div>';
      body.appendChild(wrap);
    });

    /* 4 · Modal de detalle — descripciones y precio mayorista DE EJEMPLO
       (reemplazar con la data real del cliente; clave = slug nombre-presentación) */
    var EXTRA = {
      "milanesas-de-pollo-por-kilo":        { d: "De pechuga, empanadas con pan de campo. Al horno o sartén quedan doradas en 15 minutos.", m: 7100 },
      "milanesas-de-carne-por-kilo":        { d: "De nalga, finitas y tiernas. Rinden un montón para la semana.", m: 7900 },
      "hamburguesas-caseras-bandeja-x4-u":  { d: "Carne vacuna, bien caseras. A la plancha o parrilla, no se desarman.", m: 5000 },
      "pollo-trozado-por-kilo":             { d: "Presas listas para el horno o la cacerola.", m: 3900 },
      "nuggets-de-pollo-bolsa-x20-u":       { d: "Los favoritos de los pibes. Horno o freidora de aire, 12 minutos.", m: 4300 },
      "bastones-de-muzzarella-caja-x12-u":  { d: "Crocantes por fuera, queso bien derretido por dentro.", m: 5500 },
      "papas-baston-bolsa-1-kg":            { d: "Corte clásico, prefritas. Doradas en horno o freidora.", m: 3100 },
      "aros-de-cebolla-bolsa-500-g":        { d: "Rebozados crocantes para picadas y hamburguesas.", m: 3400 },
      "empanadas-de-carne-docena":          { d: "Receta casera. Del freezer directo al horno.", m: 5900 },
      "empanadas-de-jamon-y-queso-docena":  { d: "Bien rellenas, masa criolla. Listas para hornear.", m: 5900 },
      "croquetas-de-espinaca-bandeja-x12-u":{ d: "Con espinaca de verdad. Ideales de guarnición o vianda.", m: 3900 },
      "bocaditos-de-pollo-bolsa-x24-u":     { d: "Bocado tierno para picadas o la vianda del cole.", m: 4700 },
      "mix-de-verduras-bolsa-1-kg":         { d: "Zanahoria, arvejas y choclo. Directo a la sartén o al guiso.", m: 3500 },
      "espinaca-en-hojas-bolsa-500-g":      { d: "Porcionada, lista para tartas y tortillas.", m: 2900 },
      "brocoli-bolsa-500-g":                { d: "En flores, blanqueado. Conserva color y textura.", m: 3100 },
      "bastones-de-merluza-caja-x6-u":      { d: "Merluza rebozada, sin espinas. El clásico que nunca falla.", m: 4500 },
      "filet-de-merluza-por-kilo":          { d: "Filet sin espinas, porcionado. A la plancha o al horno.", m: 6700 },
      "rabas-bolsa-500-g":                  { d: "Anillas de calamar rebozadas. Con limón quedan de diez.", m: 7900 },
      "medallones-de-quinoa-bandeja-x4-u":  { d: "Quinoa y vegetales. Livianos, aptos veggie.", m: 4200 },
      "milanesas-de-soja-bandeja-x6-u":     { d: "Clásicas de soja, versátiles y rendidoras.", m: 3300 }
    };
    var pmId = null, pmQty = 1;

    if (!$(".pmodal")) {
      var pmOverlay = document.createElement("div");
      pmOverlay.className = "pm-overlay";
      pmOverlay.setAttribute("data-pm-close", "");
      document.body.appendChild(pmOverlay);

      var pm = document.createElement("div");
      pm.className = "pmodal";
      pm.setAttribute("role", "dialog");
      pm.setAttribute("aria-modal", "true");
      pm.setAttribute("aria-label", "Detalle del producto");
      pm.innerHTML =
        '<button type="button" class="pm-x" data-pm-close aria-label="Cerrar el detalle">' +
          '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>' +
        '</button>' +
        '<div class="pm-media"><img src="" alt=""><span class="prod-cat" data-pm-cat></span></div>' +
        '<div class="pm-body">' +
          '<h3 data-pm-name></h3>' +
          '<p class="pm-pres" data-pm-pres></p>' +
          '<p class="pm-desc" data-pm-desc></p>' +
          '<div class="pm-prices">' +
            '<div class="pm-pr"><small>Minorista</small><b data-pm-price></b></div>' +
            '<div class="pm-pr pm-pr-may"><small>Mayorista</small><b data-pm-may></b><a href="mayoristas.html">ver lista →</a></div>' +
          '</div>' +
          '<div class="pm-actions">' +
            '<div class="qty-ctrl">' +
              '<button type="button" data-pm-q="-1" aria-label="Restar uno">−</button>' +
              '<span class="qty" data-pm-qty aria-live="polite">1</span>' +
              '<button type="button" data-pm-q="1" aria-label="Sumar uno">+</button>' +
            '</div>' +
            '<button type="button" class="btn-add pm-add" data-pm-add>' + ICO_PLUS + '<span data-pm-add-label>Agregar al pedido</span></button>' +
          '</div>' +
          '<a class="pm-walink" data-pm-wa href="https://wa.me/' + WA + '" target="_blank" rel="noopener">O pedilo directo por WhatsApp →</a>' +
        '</div>';
      document.body.appendChild(pm);
    }
    var pmEl = $(".pmodal");
    var pmOverlayEl = $(".pm-overlay");

    function pmRender() {
      var q = $("[data-pm-qty]", pmEl);
      if (q) q.textContent = pmQty;
      var lbl = $("[data-pm-add-label]", pmEl);
      if (lbl) lbl.textContent = (pmId && state[pmId]) ? "Actualizar pedido" : "Agregar al pedido";
    }

    function openModal(card) {
      var id = card.getAttribute("data-cart-id");
      var p = products[id];
      if (!p || !pmEl) return;
      pmId = id;
      pmQty = state[id] ? state[id].q : 1;
      var extra = EXTRA[id] || {};
      var img = $(".prod-media img", card);
      var cat = $(".prod-cat", card);
      var wa = $(".prod-wa", card);
      var pmImg = $(".pm-media img", pmEl);
      if (pmImg) pmImg.src = img ? img.getAttribute("src") : "";
      var catEl = $("[data-pm-cat]", pmEl);
      if (catEl) {
        catEl.textContent = cat ? cat.textContent : "";
        catEl.hidden = !cat;
      }
      $("[data-pm-name]", pmEl).textContent = p.n;
      $("[data-pm-pres]", pmEl).textContent = p.p;
      $("[data-pm-desc]", pmEl).textContent = extra.d || "Congelado listo para cocinar. Consultanos por variantes y disponibilidad.";
      $("[data-pm-price]", pmEl).textContent = money(p.pr);
      $("[data-pm-may]", pmEl).textContent = extra.m ? money(extra.m) : "Consultá";
      var waL = $("[data-pm-wa]", pmEl);
      if (waL && wa) waL.href = wa.href;
      pmRender();
      pmEl.classList.add("is-open");
      if (pmOverlayEl) pmOverlayEl.classList.add("is-open");
      document.body.classList.add("no-scroll");
      lastFocus = document.activeElement;
      var x = $(".pm-x", pmEl);
      if (x) x.focus({ preventScroll: true });
    }

    function modalOpen() { return pmEl && pmEl.classList.contains("is-open"); }
    function closeModal() {
      if (!pmEl) return;
      pmEl.classList.remove("is-open");
      if (pmOverlayEl) pmOverlayEl.classList.remove("is-open");
      if (!isOpen()) document.body.classList.remove("no-scroll");
      pmId = null;
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    }

    /* La foto de cada tarjeta abre el detalle (también con teclado) */
    $$("[data-cart-id]").forEach(function (card) {
      card.classList.add("has-modal");
      var media = $(".prod-media", card);
      var p = products[card.getAttribute("data-cart-id")];
      if (media && p) {
        media.setAttribute("tabindex", "0");
        media.setAttribute("role", "button");
        media.setAttribute("aria-label", "Ver detalle de " + p.n);
      }
    });

    function setQty(id, q) {
      var base = state[id] || products[id];
      if (!base) return;
      if (q <= 0) {
        delete state[id];
      } else {
        state[id] = { n: base.n, p: base.p, pr: base.pr, q: Math.min(q, 99) };
      }
      save();
      render();
    }

    function buildWaLink() {
      var lines = ["Hola! Quiero hacer este pedido:"];
      var k, it;
      for (k in state) {
        it = state[k];
        lines.push("• " + it.q + "× " + it.n + (it.p ? " (" + it.p + ")" : "") + " — " + money(it.q * it.pr));
      }
      lines.push("");
      lines.push("Total estimado: " + money(total()));
      return "https://wa.me/" + WA + "?text=" + encodeURIComponent(lines.join("\n"));
    }

    function render() {
      var c = count();

      /* Badge del header */
      var badge = $("[data-cart-count]");
      if (badge) {
        badge.hidden = c === 0;
        badge.textContent = c > 99 ? "99+" : c;
      }

      /* Estados de las tarjetas */
      $$("[data-cart-id]").forEach(function (card) {
        var id = card.getAttribute("data-cart-id");
        var q = state[id] ? state[id].q : 0;
        var add = $(".btn-add", card);
        var ctrl = $(".prod-actions .qty-ctrl", card);
        var qty = ctrl ? $(".qty", ctrl) : null;
        if (add) add.hidden = q > 0;
        if (ctrl) ctrl.hidden = q === 0;
        if (qty) qty.textContent = q;
      });

      /* Drawer */
      var list = $("[data-cart-list]");
      var empty = $("[data-cart-empty]");
      var foot = $("[data-cart-foot]");
      if (list) {
        var html = "", k, it;
        for (k in state) {
          it = state[k];
          html +=
            '<li class="cart-item">' +
              '<div class="ci-top">' +
                '<div class="ci-info"><b class="ci-name">' + it.n + '</b><span class="ci-pres">' + (it.p ? it.p + " · " : "") + money(it.pr) + ' c/u</span></div>' +
                '<button type="button" class="ci-del" data-del="' + k + '" aria-label="Quitar ' + it.n + ' del pedido">' + ICO_TRASH + '</button>' +
              '</div>' +
              '<div class="ci-bottom">' +
                '<div class="qty-ctrl">' +
                  '<button type="button" data-q="-1" data-id="' + k + '" aria-label="Quitar uno">−</button>' +
                  '<span class="qty">' + it.q + '</span>' +
                  '<button type="button" data-q="1" data-id="' + k + '" aria-label="Sumar uno">+</button>' +
                '</div>' +
                '<b class="ci-total">' + money(it.q * it.pr) + '</b>' +
              '</div>' +
            '</li>';
        }
        list.innerHTML = html;
      }
      if (empty) empty.hidden = c > 0;
      if (foot) foot.hidden = c === 0;
      var totalEl = $("[data-cart-total]");
      if (totalEl) totalEl.textContent = money(total());
      var send = $("[data-cart-send]");
      if (send) send.href = c > 0 ? buildWaLink() : "#";
    }

    function bumpBadge() {
      var badge = $("[data-cart-count]");
      if (!badge) return;
      badge.classList.remove("pop");
      void badge.offsetWidth;
      badge.classList.add("pop");
    }

    function isOpen() { return drawerEl && drawerEl.classList.contains("is-open"); }
    function openCart(open) {
      if (!drawerEl) return;
      drawerEl.classList.toggle("is-open", open);
      if (overlayEl) overlayEl.classList.toggle("is-open", open);
      document.body.classList.toggle("no-scroll", open);
      if (open) {
        lastFocus = document.activeElement;
        var x = $(".cart-x", drawerEl);
        if (x) x.focus({ preventScroll: true });
      } else if (lastFocus && lastFocus.focus) {
        lastFocus.focus({ preventScroll: true });
      }
    }

    /* 4 · Eventos (delegados) */
    document.addEventListener("click", function (e) {
      var add = e.target.closest("[data-add]");
      if (add) {
        setQty(add.getAttribute("data-add"), 1);
        bumpBadge();
        return;
      }
      var qbtn = e.target.closest("[data-q]");
      if (qbtn) {
        var id = qbtn.getAttribute("data-id");
        var cur = state[id] ? state[id].q : 0;
        setQty(id, cur + parseInt(qbtn.getAttribute("data-q"), 10));
        return;
      }
      var del = e.target.closest("[data-del]");
      if (del) { setQty(del.getAttribute("data-del"), 0); return; }
      if (e.target.closest("[data-cart-open]")) { openCart(true); return; }
      if (e.target.closest("[data-cart-close]")) { openCart(false); return; }
      if (e.target.closest("[data-cart-clear]")) { state = {}; save(); render(); return; }

      /* Modal de producto */
      var pmq = e.target.closest("[data-pm-q]");
      if (pmq) {
        pmQty = Math.max(1, Math.min(99, pmQty + parseInt(pmq.getAttribute("data-pm-q"), 10)));
        pmRender();
        return;
      }
      if (e.target.closest("[data-pm-add]")) {
        if (pmId) { setQty(pmId, pmQty); bumpBadge(); closeModal(); }
        return;
      }
      if (e.target.closest("[data-pm-close]")) { closeModal(); return; }
      var mcard = e.target.closest("[data-cart-id]");
      if (mcard && !e.target.closest("a, button, .prod-actions")) { openModal(mcard); return; }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        if (modalOpen()) { closeModal(); return; }
        if (isOpen()) openCart(false);
        return;
      }
      if ((e.key === "Enter" || e.key === " ") && e.target && e.target.classList && e.target.classList.contains("prod-media")) {
        e.preventDefault();
        var c = e.target.closest("[data-cart-id]");
        if (c) openModal(c);
      }
    });

    render();
  }

  /* ── Anclas con scroll suave + offset del header ────────── */
  function initAnchors() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 84,
        behavior: reduced ? "auto" : "smooth"
      });
    });
  }

  /* ── Año dinámico del footer ────────────────────────────── */
  function initYear() {
    $$("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ── Boot ───────────────────────────────────────────────── */
  function boot() {
    safe(initHeader, "initHeader");
    safe(initMenu, "initMenu");
    safe(initHeroIntro, "initHeroIntro");
    safe(initReveal, "initReveal");
    safe(initCountUp, "initCountUp");
    safe(initTilt, "initTilt");
    safe(initTruck, "initTruck");
    safe(initFab, "initFab");
    safe(initCatalog, "initCatalog");
    safe(initCart, "initCart");
    safe(initAnchors, "initAnchors");
    safe(initYear, "initYear");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
