# Punto Frío Congelados — Guía del proyecto

Web estática (HTML + CSS + JS vanilla). Sin dependencias, sin build. Se sube por arrastre a Hostinger/Vercel/Netlify o por FTP.

## Estructura

```
index.html          → Home (hero, confianza, más vendidos, envío, pasos, CTA)
catalogo.html       → Catálogo con buscador + filtros por categoría (20 productos)
como-comprar.html   → Guía completa + envíos (#envios) + FAQ
mayoristas.html     → Tabla comparativa minorista vs mayorista
styles.css          → Todos los estilos (tokens de color al inicio)
main.js             → Animaciones e interacciones (IIFE, sin librerías)
.htaccess           → Anti-caché para Hostinger (NO borrar)
assets/img/         → Fotos WebP (stock temporal de Openverse, licencias CC)
assets/credits.json → Créditos de las fotos stock
tools/serve.js      → Servidor local de desarrollo (NO subir al hosting)
backup-v1/          → Versión anterior del sitio (18/06) — NO subir
```

## ⚠️ Contenido PROVISORIO que hay que reemplazar con datos reales del cliente

1. **Productos y precios**: los 20 productos y todos los precios son DE EJEMPLO.
   El cliente tiene la lista real (dijo tenerla lista con precios minorista y mayorista).
2. **Fotos**: las tarjetas de producto usan ilustraciones SVG por categoría
   (assets/img/cat-*.svg) como placeholder consistente; el hero usa la única foto stock
   (hero.webp). Cuando lleguen las fotos reales del cliente
   (https://photos.app.goo.gl/L3YKWpUbHouBhmQS7 — descargar a mano), convertir a WebP y
   cambiar los `src` de cada tarjeta de vuelta a la foto del producto.
   Los .webp de stock viejos siguen en assets/img por si sirven de referencia.
3. **Logo**: el header usa un logo recreado en HTML/CSS (cápsula azul "PuntoFrío ❄ CONGELADOS").
   El cliente tiene el logo real (está en el álbum de Google Photos). Si se quiere usar la imagen real: guardarla como assets/img/logo.webp y reemplazar el bloque `<a class="logo">` en las 4 páginas.
4. **Dominio**: el cliente NO tiene dominio todavía.

## Cómo editar productos (catalogo.html)

Cada producto es un bloque `<article class="prod-card" data-cat="...">`.
- `data-cat` valores: carnes | rebozados | fritos | vegetales | pescados | fit
- El catálogo acepta `catalogo.html?cat=carnes` (etc.) y llega ya filtrado — los chips
  de categoría del hero (desktop) y de la sección "Lo que más nos piden" (mobile) usan esos links.
- Cambiar nombre en `.prod-name`, presentación en `.prod-pres`, precio en `.prod-price`.
- El link de WhatsApp lleva el nombre del producto URL-encodeado:
  `https://wa.me/5492215440888?text=Hola!%20Quiero%20pedir:%20NOMBRE%20-%20PRESENTACION`
  (espacios = %20, ó = %C3%B3, á = %C3%A1, é = %C3%A9, í = %C3%AD, ñ = %C3%B1)
- Los destacados de la home (index.html, sección "Lo que más nos piden") son copias de 6 cards — actualizarlos a mano también.
- ESTILO (6/7/2026): paleta CÁLIDA en todo el sitio — fondos crema (tokens --ice/--ice-2/--ice-3
  en styles.css), azul de marca como ancla (paneles, botones, títulos). Sin copos de nieve.
- El hero usa `assets/img/hero.webp` (foto cálida "herocalido": plato de milanesas/papas sobre
  crema; original en assets/photos/source/herocalido.png — los 2 rectángulos guía de la foto
  se borraron con ffmpeg delogo). En desktop los botones FLOTAN sobre la zona libre derecha
  (.hero-ctas absolute ≥1024px). En mobile se reencuadra la misma foto (object-position 76%);
  PENDIENTE: foto vertical cálida del cliente para mobile — al llegar, convertir a WebP y
  volver a agregar `<source media="(max-width:719px)">` dentro del <picture> del hero.
  Backups: hero-marmol-backup.webp (mármol) y hero-backup.webp (v1). hero-mobile.webp (mármol
  vertical) quedó sin uso.
- El bloque "Mayoristas" de la home dice "hasta −20%": es PLACEHOLDER alineado a la tabla
  de mayoristas.html — ajustar cuando estén los precios reales.

## Catálogo en mobile

- El catálogo muestra 2 columnas compactas en celular (el carrusel de la home no cambia).
- En cards angostas el botón de WhatsApp directo es un ícono circular junto al precio.
- El botón flotante de WhatsApp se quitó SOLO de catalogo.html (tapaba los botones
  "Agregar" de la columna derecha); sigue en como-comprar y mayoristas.

## Modal de detalle de producto

- Tocando la foto de cualquier producto se abre un modal (sheet en mobile, centrado en desktop)
  con descripción, precio minorista y MAYORISTA, cantidad y "Agregar al pedido".
- Las descripciones y los precios mayoristas son DE EJEMPLO y viven en `main.js` →
  buscar `var EXTRA` dentro de initCart. Clave = slug nombre-presentación
  (ej: "milanesas-de-pollo-por-kilo"). Si un producto no tiene entrada, el modal
  muestra un texto genérico y "Consultá" en mayorista — nada se rompe.
- Al cargar la lista real: actualizar EXTRA junto con las cards del HTML.

## Carrito de WhatsApp

- Sin pagos online: junta productos y arma UN mensaje de WhatsApp con el pedido y total.
- Todo el UI se inyecta desde main.js (initCart): botón en header, drawer lateral y
  controles "Agregar al pedido" en cada `.prod-card` (home y catálogo). Cero HTML muerto.
- Estado en localStorage clave `pfcart_v1`. Persiste entre páginas y visitas.
- El precio se lee del texto de `.prod-price` y el id se deriva de nombre+presentación:
  si se edita un producto, el carrito toma los datos nuevos solos. Cada producto además
  conserva su botón "Pedir" directo por WhatsApp.
- La tabla mayorista (mayoristas.html) se edita fila por fila; el chip de ahorro es texto fijo (calcular: 1 − mayorista/minorista).

## Datos del negocio (confirmados por brief)

- WhatsApp pedidos: 221 544-0888 → links wa.me/5492215440888
- IG: @puntofrio_congelados · Email: campanofausto@gmail.com
- Local: Ensenada · Reparto: Lun/Mié/Vie · Anticipación: 24 hs
- Zonas: La Plata, City Bell, Gonnet, Ensenada, Berisso
- Envío gratis desde $60.000 · Sin pedido mínimo
- Pagos: efectivo, transferencia, Mercado Pago
- Sin habilitación bromatológica → NO prometer certificaciones en los textos.

## Deploy a Hostinger

1. Subir TODO menos `backup-v1/`, `tools/` y `assets/photos/`.
2. Verificar que `.htaccess` llegó (archivos ocultos visibles en el file manager).
3. En cada deploy futuro: bumpear `?v=YYYYMMDD` en los `<link>` y `<script>` de las 4 páginas.

## Desarrollo local

`node tools/serve.js` → http://localhost:8765
