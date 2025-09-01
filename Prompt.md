# Primero
## Rol del Asistente

Eres un desarrollador frontend senior (HTML, CSS, JavaScript) y experto en UX con más de 20 años de experiencia. Tu objetivo es construir un prototipo web frontend-only para un mini-marketplace tipo Amazon, con código limpio, seguro, accesible y responsivo, siguiendo buenas prácticas modernas. No uses frameworks (React, Vue, Angular) ni backend. Trabaja incrementalmente, priorizando la experiencia de usuario, la performance y la mantenibilidad.

## Descripción del Proyecto

Construir el Mini–Marketplace Universitario (Frontend Only) que simula la experiencia de compra: catálogo con búsqueda/filtros/orden, vista rápida en modal, carrito, checkout con validaciones, y favoritos; datos locales en JSON y persistencia en localStorage. Desarrollar 4–6 vistas mínimas y UI moderna con Bootstrap o Tailwind y modales/toasts para feedback. Los datos de ejemplo se consumirán vía fetch desde archivos en /data (levantar en Apache para evitar bloqueos file://). Se adjuntarán los documentos con los requerimientos del proyecto (ver “Documentos Adjuntos”) y debes cumplirlos al pie de la letra.

## Stack Técnico Esencial

Frontend: HTML5 + CSS3 (Tailwind o Bootstrap) + JavaScript (sin bundlers)

Servidor: Apache (XAMPP/WAMP/LAMP) para servir archivos estáticos

Datos: Archivos JSON (productos, categorías, envíos, cupones opcional)

Persistencia: localStorage para carrito y favoritos

Control de versiones: GitHub con README y ramas/PRs

Restricción: Sin frameworks frontend ni backend; JavaScript “vanilla”

Funcionalidades Principales (MVP)

### Catálogo

Búsqueda, filtros (categoría, rango de precio, rating), orden (precio/rating), grilla responsiva.

### Vista rápida (Quick View)

Modal con galería de imágenes, descripción, precio, stock, y control de cantidad; añadir a carrito o marcar favorito; deshabilitar compra sin stock.

### Carrito

Cantidades ±, totales dinámicos, vaciar con confirmación en modal; persistencia entre recargas.

### Checkout

Formulario (nombre, correo, dirección, comuna/ciudad, envío, pago); validaciones visibles; cupones; resumen y confirmación (número de orden simulado).

### Favoritos (Wishlist)

Agregar/quitar, mover al carrito; persistencia automática.

## Interfaz Básica

Landing/Home que explica el marketplace y navegación clara hacia Catálogo / Carrito / Favoritos / Checkout.

UI limpia y consistente, responsiva, con modales y toasts/alerts para feedback y validaciones.

Vistas mínimas (4–6)

Home/Catálogo

Detalle de producto (Modal “Quick View”)

Carrito

Checkout

Favoritos

(Opcional) Confirmación de compra

## Características del Mini–Marketplace

UI obligatoria: modales (vista rápida, confirmación), validaciones (formularios, rango de precio), componentes visuales (cards, grid, alerts, toasts, badges).

Persistencia: carrito y favoritos en localStorage.

Feedback: toasts/alerts al agregar al carrito, cupones aplicados, etc.

## Datos y Persistencia (JSON)

Coloca los JSON en /data y consúmelos con fetch (si el navegador bloquea file://, usar Apache/XAMPP).

Archivos: productos.json, categorias.json, envios.json, promos.json (opcional).

Estructura y muestras incluidas en los adjuntos.

Persistencia de carrito y favoritos en localStorage (clave de namespacing clara; p. ej., mm_cart, mm_favs).

## API interna (Funciones JS mínimas)

Carga/render: loadJSON(url), renderCatalogo(lista), aplicarFiltrosYOrden()

Producto/Carrito: openProductModal(id), addToCart(id, qty), removeFromCart(id), updateQty(id, qty)

Favoritos: toggleFavorito(id), renderFavoritos()

Checkout: validarCheckout(formData), aplicarCupon(codigo), confirmarCompra()

## Requisitos de Seguridad

Validación estricta de entradas (formularios y filtros).

Escapar/neutralizar contenido proveniente de JSON antes de inyectar al DOM; evita XSS (no uses innerHTML sin sanitizar).

Manejo robusto de errores de fetch y estados vacíos.

No almacenar datos sensibles en localStorage.

Estructura el código en módulos o funciones puras y evita estados globales frágiles.

## Variables de Entorno

No aplica en este prototipo. Todo es frontend estático con datos en JSON y persistencia en el navegador.

## Enfoque de Desarrollo

No crees una carpeta, trabaja en la carpeta actual (puedes crear subcarpetas locales como data/ e img/).

Paso 1: Plan breve y mapa de vistas/flujo.

Paso 2: Estructura inicial de archivos: index.html, styles.css (o Tailwind), app.js, data/*.json.

Paso 3: Implementa catálogo + filtros/orden; luego modal de detalle.

Paso 4: Implementa carrito (±, totales, vaciar con modal) + persistencia localStorage.

Paso 5: Checkout con validaciones + cupones + confirmación.

Paso 6: Favoritos + mover al carrito + persistencia.

Paso 7: UI responsiva, toasts/alerts, estados vacíos, loading y errores.

Paso 8: Pruebas manuales (ruta feliz/errores), checklist de aceptación, mejoras de accesibilidad.

Paso 9: README con pasos de ejecución en Apache y notas de diseño.

## Despliegue

Ejecutar en Apache (XAMPP/WAMP/LAMP). No usar dev servers de frameworks. Documenta cómo levantar el proyecto localmente.

Publica el código en GitHub con historial claro (commits descriptivos, ramas/PRs) y README.

## Criterios de Éxito

Vistas completas: Home, Modal Producto, Carrito, Checkout, Favoritos (+ confirmación opcional).

Búsqueda/filtros/orden funcionando juntos; validaciones visibles; modal de vista rápida y modal de confirmación para vaciar carrito.

Carrito y favoritos persistentes con localStorage; totales recalculados.

UI responsiva consistente con Bootstrap o Tailwind; toasts/alerts para feedback.

Consumo de datos desde JSON con fetch (sobre Apache).

Repositorio en GitHub con README y ramas/PRs.

## Entregables

Código fuente del prototipo.

Mockups (Figma u otra) que respalden el diseño implementado.

Documento de prompts de IA utilizados (con reflexión sobre su efectividad).

README: instrucciones de ejecución en Apache y guía de uso.

Modo de Trabajo y Formato de Respuesta

### Responde SIEMPRE en este orden:

Plan breve (bullet points, 6–10 ítems).

Árbol de archivos y ubicaciones clave (/data, /img, etc.).

Código por secciones, con comentarios y sin dependencias de build.

Instrucciones para Apache (XAMPP/WAMP/LAMP).

Pruebas manuales (ruta feliz, errores, vacíos).

Checklist de aceptación marcado (✓/✗) y próximos pasos.

## Documentos Adjuntos

Se adjuntarán los documentos con el detalle de requisitos y datos de ejemplo: “Caso-miniAmazon-1.pdf”  y “Desarrollo_Web_y_Movil-3.pdf”. Debes implementarlo exactamente como se describe allí.



# Segundo
## Rol del Asistente

Eres un desarrollador frontend senior (HTML, CSS, JavaScript) y experto en UX/UI con más de 20 años de experiencia. Tu objetivo es construir un prototipo web frontend-only para un mini-marketplace tipo Amazon, con código limpio, seguro, accesible y responsivo, siguiendo buenas prácticas modernas. No uses frameworks (React, Vue, Angular) ni backend. Trabaja incrementalmente, priorizando la experiencia de usuario, la performance y la mantenibilidad.

También eres responsable de aplicar la identidad visual de la Universidad Andrés Bello: paleta de colores y tipografía corporativa, manteniendo consistencia y accesibilidad.

## Descripción del Proyecto

Construir el Mini–Marketplace Universitario (Frontend Only) que simula la experiencia de compra: catálogo con búsqueda/filtros/orden, vista rápida en modal, carrito, checkout con validaciones, y favoritos; datos locales en JSON y persistencia en localStorage.

Se adjuntarán los documentos con los requerimientos del proyecto y la captura de la paleta/tipografía institucional (UNAB), que debes imitar visualmente en la UI del marketplace.

## Stack Técnico Esencial

Frontend: HTML5 + CSS3 (Tailwind o Bootstrap) + JavaScript vanilla

Servidor: Apache (XAMPP/WAMP/LAMP)

Datos: Archivos JSON (/data)

Persistencia: localStorage

UI: Aplicar colores institucionales de UNAB y tipografía oficial (según captura adjunta).

GitHub con README

## Funcionalidades Principales (MVP)
(igual que el prompt anterior: catálogo, filtros, carrito, checkout, favoritos, etc.)

## Estilo Visual / Branding

Paleta de colores Universidad Andrés Bello (según captura adjunta):

Azul oscuro institucional (#002B5C aprox.) → navbar, footer, botones primarios.

Rojo institucional (#C8102E aprox.) → botón “Admisión” o CTA principal.

Blanco → fondos principales.

Gris claro → bordes, fondos secundarios, estados inactivos.

## Tipografía:

Usa una fuente web lo más cercana posible a la corporativa UNAB (ej. "Open Sans" o "Roboto" si no está disponible la oficial).

Asegurar jerarquía tipográfica: títulos (negrita), subtítulos, texto de cuerpo legible.

## Estilo de UI:

Encabezado y navegación similares al estilo del portal UNAB (barra superior azul oscuro, links blancos).

Botón CTA (Agregar al carrito, Comprar ahora) en rojo institucional.

Uso consistente de modales, toasts y alerts con colores institucionales.

Diseño minimalista, con espacios en blanco y contraste adecuado para accesibilidad.

## Enfoque de Desarrollo
(igual que antes, pasos incrementales)

### Criterios de Éxito

Marketplace funcional y visualmente alineado con la identidad UNAB.

Barra de navegación con colores y tipografía institucionales.

Botones y CTAs con la paleta oficial.

Carrito, checkout y favoritos con persistencia.

UI responsiva, accesible y consistente.

Repositorio GitHub documentado.

## Documentos Adjuntos

Caso-miniAmazon-1.pdf

Desarrollo_Web_y_Movil-3.pdf

Captura con paleta/tipografía UNAB (branding.png)






# Nuevos

* ## 1

mejora el modal de vista rapida y la visualizacon de las imagenes.
no se que hice, pero ahora no pasa la imagen
necesito que ocupe la totalidad del espacio disponible al lado de la descripcion

* ## 2

pero ahora no aparecenlos botones de cambiar del carrusel
es decir aparecen por una fraccion de segundo y luego cuando carga la imagen desaparecen.
no son funcionales tampoco

* ## 3

sigue habiendo problema con el carrusel de las imagenes
al apretar los botones para cambiar no se cambian las imagenes
(esto funcionaba en el commit anterior)

* ## 4

no quiero que se vean los botones de la imagen

* ## 5

trata agregando esto
/* Quitar flechas de los inputs tipo number en Chrome, Safari, Edge */
input[type=number]::-webkit-outer-spin-button,
input[type=number]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Quitar flechas en Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

* ## 6

Eres un desarrollador frontend senior especializado en Bootstrap 5, Tailwind CSS y JavaScript vanilla. Tu objetivo es arreglar un problema de layout en un modal de producto: al personalizar los botones de cantidad (- y +) y quitar los spinners del <input type="number">, el carrusel dentro del modal se desajustó. Debes dar la solución con código limpio, responsivo y reutilizable, manteniendo la estética basada en la paleta institucional de la UNAB.

Descripción del Problema

Actualmente, el modal del producto muestra un carrusel de imágenes a la izquierda y la información del producto a la derecha. En la sección Cantidad, al reemplazar el input number por un campo controlado con botones - y +, se rompió el diseño: el modal pierde proporción y el carrusel se desacomoda.

Se requiere una implementación estable, que:

Mantenga el carrusel intacto.

Permita sumar/restar dentro del rango (1–25).

Centre y estilice el input de cantidad.

Sea reutilizable en el modal y en el carrito.

Instrucciones de Implementación

Eliminar spinners nativos del input number

input[type=number]::-webkit-outer-spin-button,
input[type=number]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
}


Agrupar botones e input con Bootstrap (solución recomendada)

<label for="cantidadProducto" class="form-label fw-bold">Cantidad:</label>
<div class="input-group w-auto">
  <button class="btn btn-outline-primary" type="button" onclick="cambiarCantidad(-1)">-</button>
  <input type="number" class="form-control text-center" id="cantidadProducto" value="1" min="1" max="25" style="max-width:70px;">
  <button class="btn btn-outline-primary" type="button" onclick="cambiarCantidad(1)">+</button>
</div>


Versión alternativa en Tailwind

<div class="flex items-center space-x-1">
  <button class="px-3 py-1 bg-blue-900 text-white rounded" onclick="cambiarCantidad(-1)">-</button>
  <input type="number" id="cantidadProducto" value="1" min="1" max="25"
         class="w-16 text-center border border-gray-300 rounded" />
  <button class="px-3 py-1 bg-blue-900 text-white rounded" onclick="cambiarCantidad(1)">+</button>
</div>


Crear función reutilizable en JS

function cambiarCantidad(delta) {
  const input = document.getElementById("cantidadProducto");
  let valor = parseInt(input.value) || 1;
  valor = Math.min(25, Math.max(1, valor + delta));
  input.value = valor;
}


Reutilización

Usa el mismo bloque en el modal de producto y en el carrito.

Cambia solo el id (cantidadProducto, cantidadCarritoX, etc.) para evitar colisiones.

Si deseas algo más escalable, encapsúlalo en un componente JS que acepte como parámetro el id del input.

Criterios de Éxito

El carrusel no se rompe y mantiene su alineación.

Los botones - y + funcionan dentro del rango (1–25).

El input mantiene tamaño fijo y centrado.

Compatible tanto con Bootstrap como con Tailwind.

Estilizado con los colores institucionales (azul oscuro UNAB en botones primarios, rojo UNAB en CTAs).

* ## 7

los botones de mas y menos me gustaban como eran antes
quizas probemos con algo

<div class="input-group" style="max-width: 150px;">
  <!-- Botón Menos -->
  <button class="btn btn-outline-primary d-flex align-items-center justify-content-center" 
          type="button" onclick="cambiarCantidad(-1)" 
          style="background-color: var(--unab-azul); color: var(--unab-blanco); border-color: var(--unab-azul);
                 border-radius: 50%; width: 40px; height: 40px;">
    <i class="fas fa-minus"></i>
  </button>

  <!-- Input Cantidad -->
  <input type="number" class="form-control text-center fw-bold" 
         id="cantidadProducto" value="1" min="1" max="25" 
         style="max-width: 70px; border-color: var(--unab-azul);">

  <!-- Botón Más -->
  <button class="btn btn-outline-primary d-flex align-items-center justify-content-center" 
          type="button" onclick="cambiarCantidad(1)" 
          style="background-color: var(--unab-azul); color: var(--unab-blanco); border-color: var(--unab-azul);
                 border-radius: 50%; width: 40px; height: 40px;">
    <i class="fas fa-plus"></i>
  </button>
</div>

* ## 8

Rol del Asistente
Eres un desarrollador frontend senior especializado en Bootstrap 5, Tailwind CSS y JavaScript vanilla. Tu tarea es implementar un modal de “Mis Favoritos” en un mini–marketplace universitario. El modal debe mostrar los productos guardados en localStorage, con diseño responsivo y siguiendo la paleta institucional UNAB.

Descripción del Proyecto
El sistema ya tiene la lógica para marcar productos como favoritos. Actualmente, cuando no existen favoritos, se muestra un mensaje vacío. Necesitamos que el modal se vuelva dinámico:

Si no hay productos → mostrar estado vacío con ícono y mensaje.

Si hay productos → listar cada favorito como card con imagen, nombre, precio y botones de acción.

Requisitos Técnicos

Frontend: HTML5 + Bootstrap 5 (puede adaptarse a Tailwind).

Persistencia: localStorage (clave favoritos).

Interactividad: JavaScript vanilla.

UI: Consistente con colores UNAB (--unab-azul, --unab-rojo, --unab-blanco).

Acciones del modal:

Ver productos favoritos.

Eliminar un favorito.

Mover producto al carrito.

Instrucciones para Implementación

Estructura del Modal Favoritos

Modal Bootstrap (.modal-lg).

Header azul UNAB con título e ícono de corazón.

Body dinámico (#favoritosContainer).

Estado vacío: ícono corazón gris + mensaje “No tienes favoritos”.

Estado con productos: grid de cards responsivas.

Footer con botón “Cerrar”.

Script JavaScript

Función getFavoritos() para obtener lista desde localStorage.

Función renderFavoritos() que construya dinámicamente el contenido:

Si array vacío → mostrar estado vacío.

Si hay productos → renderizar cards con:

Imagen.

Nombre.

Precio en rojo UNAB.

Botón Agregar al carrito.

Botón Eliminar.

Función eliminarFavorito(id) para quitar productos y actualizar el modal.

Evento show.bs.modal en #modalFavoritos → siempre refrescar con renderFavoritos().

Función toggleFavorito(producto) para añadir o quitar desde el catálogo.

Objeto Producto Estándar

{
  id: 1,
  nombre: "Laptop HP Pavilion 15",
  precio: 450000,
  imagen: "img/laptop-hp.jpg"
}


Persistencia

Guardar y actualizar favoritos en localStorage como JSON.

Clave: "favoritos".

Criterios de Éxito

Modal muestra correctamente el estado vacío y la lista de favoritos.

Productos persistentes entre recargas gracias a localStorage.

Botones funcionales (eliminar y agregar al carrito).

UI responsiva, con estilo alineado a la identidad UNAB.

Código limpio y modular (posible extraer a favoritos.js).

* ## 9

tenia que usar este boton de favoritos


                                <a class="nav-link" href="#favoritos">Favoritos</a>
                            

no agregar uno nuevo

* ## 10

en el modal de favoritos el boton de Ver detalles deberia ser el mismo que Vista Rapida

<button class="btn btn-outline-secondary btn-sm" onclick="mostrarModalProducto(2)" data-bs-dismiss="modal">
                                    <i class="fas fa-eye me-2"></i>
                                    Ver Detalles
                                </button>

<button class="btn btn-vista-rapida" onclick="abrirVistaRapida(1)">
                            <i class="fas fa-eye me-1"></i>Vista Rápida
                        </button>

lo mismo con el de Agregar al carrito
<button class="btn btn-primary btn-sm" onclick="moverFavoritoACarrito(1)">
                                    <i class="fas fa-shopping-cart me-2"></i>
                                    Agregar al Carrito
                                </button>

<button class="btn btn-agregar-carrito w-100" onclick="agregarAlCarritoDirecto(1)">
                            <i class="fas fa-shopping-cart me-2"></i>
                            Agregar al Carrito
                        </button>

* ## 11

implementa un modo oscuro para el proyecto

* ## 12

Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at file:///C:/Users/salaz/OneDrive/Desktop/universidad/2025/S2/DWM/P1/repo/Taller1-DesarrolloWeb/data/productos.json. (Reason: CORS request not http).

Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at file:///C:/Users/salaz/OneDrive/Desktop/universidad/2025/S2/DWM/P1/repo/Taller1-DesarrolloWeb/data/categorias.json. (Reason: CORS request not http).

Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at file:///C:/Users/salaz/OneDrive/Desktop/universidad/2025/S2/DWM/P1/repo/Taller1-DesarrolloWeb/data/envios.json. (Reason: CORS request not http).

Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at file:///C:/Users/salaz/OneDrive/Desktop/universidad/2025/S2/DWM/P1/repo/Taller1-DesarrolloWeb/data/promos.json. (Reason: CORS request not http).

Error al cargar data/productos.json: TypeError: NetworkError when attempting to fetch resource.
    fetchJSON file:///C:/Users/salaz/OneDrive/Desktop/universidad/2025/S2/DWM/P1/repo/Taller1-DesarrolloWeb/app.js:90
    cargarDatos file:///C:/Users/salaz/OneDrive/Desktop/universidad/2025/S2/DWM/P1/repo/Taller1-DesarrolloWeb/app.js:62
    inicializarApp file:///C:/Users/salaz/OneDrive/Desktop/universidad/2025/S2/DWM/P1/repo/Taller1-DesarrolloWeb/app.js:39
    <anonymous> file:///C:/Users/salaz/OneDrive/Desktop/universidad/2025/S2/DWM/P1/repo/Taller1-DesarrolloWeb/app.js:33
app.js:96:17
Error al cargar data/categorias.json: TypeError: NetworkError when attempting to fetch resource.
    fetchJSON file:///C:/Users/salaz/OneDrive/Desktop/universidad/2025/S2/DWM/P1/repo/Taller1-DesarrolloWeb/app.js:90
    cargarDatos file:///C:/Users/salaz/OneDrive/Desktop/universidad/2025/S2/DWM/P1/repo/Taller1-DesarrolloWeb/app.js:63
    inicializarApp file:///C:/Users/salaz/OneDrive/Desktop/universidad/2025/S2/DWM/P1/repo/Taller1-DesarrolloWeb/app.js:39
    <anonymous> file:///C:/Users/salaz/OneDrive/Desktop/universidad/2025/S2/DWM/P1/repo/Taller1-DesarrolloWeb/app.js:33
app.js:96:17
Error al cargar data/envios.json: TypeError: NetworkError when attempting to fetch resource.
    fetchJSON file:///C:/Users/salaz/OneDrive/Desktop/universidad/2025/S2/DWM/P1/repo/Taller1-DesarrolloWeb/app.js:90
    cargarDatos file:///C:/Users/salaz/OneDrive/Desktop/universidad/2025/S2/DWM/P1/repo/Taller1-DesarrolloWeb/app.js:64
    inicializarApp file:///C:/Users/salaz/OneDrive/Desktop/universidad/2025/S2/DWM/P1/repo/Taller1-DesarrolloWeb/app.js:39
    <anonymous> file:///C:/Users/salaz/OneDrive/Desktop/universidad/2025/S2/DWM/P1/repo/Taller1-DesarrolloWeb/app.js:33
app.js:96:17
Error al cargar data/promos.json: TypeError: NetworkError when attempting to fetch resource.
    fetchJSON file:///C:/Users/salaz/OneDrive/Desktop/universidad/2025/S2/DWM/P1/repo/Taller1-DesarrolloWeb/app.js:90
    cargarDatos file:///C:/Users/salaz/OneDrive/Desktop/universidad/2025/S2/DWM/P1/repo/Taller1-DesarrolloWeb/app.js:65
    inicializarApp file:///C:/Users/salaz/OneDrive/Desktop/universidad/2025/S2/DWM/P1/repo/Taller1-DesarrolloWeb/app.js:39
    <anonymous> file:///C:/Users/salaz/OneDrive/Desktop/universidad/2025/S2/DWM/P1/repo/Taller1-DesarrolloWeb/app.js:33
app.js:96:17
Error al cargar datos: TypeError: NetworkError when attempting to fetch resource.
    fetchJSON file:///C:/Users/salaz/OneDrive/Desktop/universidad/2025/S2/DWM/P1/repo/Taller1-DesarrolloWeb/app.js:90
    cargarDatos file:///C:/Users/salaz/OneDrive/Desktop/universidad/2025/S2/DWM/P1/repo/Taller1-DesarrolloWeb/app.js:62
    inicializarApp file:///C:/Users/salaz/OneDrive/Desktop/universidad/2025/S2/DWM/P1/repo/Taller1-DesarrolloWeb/app.js:39
    <anonymous> file:///C:/Users/salaz/OneDrive/Desktop/universidad/2025/S2/DWM/P1/repo/Taller1-DesarrolloWeb/app.js:33
app.js:83:17
Error al inicializar la aplicación: TypeError: NetworkError when attempting to fetch resource.
    fetchJSON file:///C:/Users/salaz/OneDrive/Desktop/universidad/2025/S2/DWM/P1/repo/Taller1-DesarrolloWeb/app.js:90
    cargarDatos file:///C:/Users/salaz/OneDrive/Desktop/universidad/2025/S2/DWM/P1/repo/Taller1-DesarrolloWeb/app.js:62
    inicializarApp file:///C:/Users/salaz/OneDrive/Desktop/universidad/2025/S2/DWM/P1/repo/Taller1-DesarrolloWeb/app.js:39
    <anonymous> file:///C:/Users/salaz/OneDrive/Desktop/universidad/2025/S2/DWM/P1/repo/Taller1-DesarrolloWeb/app.js:33

* ## 13

Sugerencia de paleta Modo Oscuro (basado en tu identidad visual):


{
  --fondo-principal: #121212;
  --fondo-secundario: #1E1E1E;
  --card-bg: #21242A;
  --texto-principal: #F5F5F5;
  --texto-secundario: #B0B3B8;

  --color-primario: var(--unab-azul); /* #002B5C */
  --color-secundario: var(--unab-rojo); /* #C8102E */

  --boton-hover: #153D72;
  --borde-claro: #2E2E2E;
  --sombra-suave: rgba(0, 0, 0, 0.2);
}


Aplica unicamente a modo oscuro

* ## 14

