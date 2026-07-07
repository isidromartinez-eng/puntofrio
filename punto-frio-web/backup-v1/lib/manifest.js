(function () {
  "use strict";
  window.__BRAND__ = {
    name: "Punto Frío Congelados",
    tagline: "Mayorista y minorista · La Plata y alrededores",
    whatsapp: "+542215440888",
    waBase: "https://wa.me/542215440888",
    waText: "Hola! Quisiera hacer un pedido.",
    email: "campanofausto@gmail.com",
    instagram: "Puntofrio_congelados",
    address: "Ensenada, Buenos Aires",
    hours: "Todo el día",

    delivery: {
      days: ["Lunes", "Miércoles", "Viernes"],
      zones: ["La Plata", "City Bell", "Gonnet", "Ensenada", "Berisso"],
      freeFrom: 60000,
      notice: "24 hs de anticipación",
      minimum: null
    },

    payments: [
      { name: "Efectivo", icon: "💵" },
      { name: "Transferencia", icon: "🏦" },
      { name: "Mercado Pago", icon: "📱" },
      { name: "Lo coordinamos por WhatsApp", icon: "💬" }
    ],

    categories: [
      { id: "carnes",    name: "Carnes y Pollo",         icon: "🍗", color: "#FFF3E0", accent: "#FF6D00" },
      { id: "rebozados", name: "Rebozados y Pre-fritos",  icon: "🍟", color: "#FFFDE7", accent: "#F9A825" },
      { id: "fritos",    name: "Fritos y Bocaditos",      icon: "🥟", color: "#FCE4EC", accent: "#E91E63" },
      { id: "vegetales", name: "Vegetales Congelados",    icon: "🥦", color: "#E8F5E9", accent: "#2E7D32" },
      { id: "pescados",  name: "Pescados y Mariscos",     icon: "🐟", color: "#E3F2FD", accent: "#1565C0" },
      { id: "fit",       name: "Línea Fit / Saludable",   icon: "🥗", color: "#F3E5F5", accent: "#6A1B9A" }
    ],

    bestSellers: ["p-001", "p-004", "p-007", "p-010", "p-013", "p-016"],

    products: [
      // Carnes y pollo
      { id: "p-001", cat: "carnes",    name: "Milanesas de Pollo",        desc: "Bandeja × 6",    price: 4500, priceW: 3800, photo: "" },
      { id: "p-002", cat: "carnes",    name: "Hamburguesas de Res",        desc: "Pack × 4",       price: 3800, priceW: 3200, photo: "" },
      { id: "p-003", cat: "carnes",    name: "Pechugas de Pollo",          desc: "× 1 kg",         price: 5200, priceW: 4400, photo: "" },
      // Rebozados
      { id: "p-004", cat: "rebozados", name: "Nuggets de Pollo",           desc: "Bolsa × 20",     price: 3200, priceW: 2700, photo: "" },
      { id: "p-005", cat: "rebozados", name: "Bastones de Queso",          desc: "Bandeja × 12",   price: 2800, priceW: 2350, photo: "" },
      { id: "p-006", cat: "rebozados", name: "Aros de Cebolla",            desc: "Bolsa × 500g",   price: 2400, priceW: 2000, photo: "" },
      // Fritos
      { id: "p-007", cat: "fritos",    name: "Empanadas de Carne",         desc: "× 12 unidades",  price: 4200, priceW: 3500, photo: "" },
      { id: "p-008", cat: "fritos",    name: "Empanadas Jamón y Queso",    desc: "× 12 unidades",  price: 4000, priceW: 3350, photo: "" },
      { id: "p-009", cat: "fritos",    name: "Croquetas de Jamón",         desc: "Bolsa × 15",     price: 3500, priceW: 2900, photo: "" },
      // Vegetales
      { id: "p-010", cat: "vegetales", name: "Mezcla de Verduras",         desc: "Bolsa × 500g",   price: 2200, priceW: 1850, photo: "" },
      { id: "p-011", cat: "vegetales", name: "Brócoli Congelado",          desc: "Bolsa × 500g",   price: 1800, priceW: 1500, photo: "" },
      { id: "p-012", cat: "vegetales", name: "Choclo Desgranado",          desc: "Bolsa × 500g",   price: 1600, priceW: 1350, photo: "" },
      // Pescados
      { id: "p-013", cat: "pescados",  name: "Filetes de Merluza",         desc: "Bandeja × 4",    price: 4800, priceW: 4050, photo: "" },
      { id: "p-014", cat: "pescados",  name: "Langostinos",                desc: "Bolsa × 500g",   price: 7500, priceW: 6300, photo: "" },
      { id: "p-015", cat: "pescados",  name: "Anillas de Calamar",         desc: "Bolsa × 400g",   price: 5200, priceW: 4400, photo: "" },
      // Fit
      { id: "p-016", cat: "fit",       name: "Medallones Avena y Pollo",   desc: "× 6 unidades",   price: 4000, priceW: 3350, photo: "" },
      { id: "p-017", cat: "fit",       name: "Veggie Burgers",             desc: "Pack × 4",       price: 3600, priceW: 3000, photo: "" },
      { id: "p-018", cat: "fit",       name: "Verduras Grilladas Mix",     desc: "Bolsa × 400g",   price: 2600, priceW: 2200, photo: "" }
    ]
  };
})();
