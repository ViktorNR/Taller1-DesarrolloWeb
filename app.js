// Mini-Marketplace UNAB - Universidad Andrés Bello
// Aplicación Principal con Identidad Visual Institucional
// Autor: Asistente IA
// Fecha: 2025

// Estado global de la aplicación
const AppState = {
    productos: [],
    categorias: [],
    opcionesEnvio: [],
    cupones: [],
    carrito: [],
    favoritos: [],
    filtros: {
        busqueda: '',
        categoria: '',
        precio: '',
        rating: '',
        orden: ''
    },
    cuponAplicado: null
};

// Constantes
const STORAGE_KEYS = {
    CARRITO: 'unab_cart',
    FAVORITOS: 'unab_favs'
};

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    inicializarApp();
});

async function inicializarApp() {
    try {
        // Cargar datos
        await cargarDatos();
        
        // Cargar estado persistente
        cargarEstadoPersistente();
        
        // Configurar eventos
        configurarEventos();
        
        // Renderizar vista inicial
        renderizarCatalogo();
        actualizarContadores();
        
        console.log('Mini-Marketplace UNAB inicializado correctamente');
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        mostrarToast('Error al cargar la aplicación', 'error');
    }
}

// Carga de datos
async function cargarDatos() {
    try {
        const [productos, categorias, envios, promos] = await Promise.all([
            fetchJSON('data/productos.json'),
            fetchJSON('data/categorias.json'),
            fetchJSON('data/envios.json'),
            fetchJSON('data/promos.json')
        ]);
        
        AppState.productos = productos;
        AppState.categorias = categorias;
        AppState.opcionesEnvio = envios;
        AppState.cupones = promos;
        
        // Poblar filtros de categoría
        poblarFiltroCategoria();
        
        console.log('Datos UNAB cargados:', {
            productos: productos.length,
            categorias: categorias.length,
            envios: envios.length,
            cupones: promos.length
        });
    } catch (error) {
        console.error('Error al cargar datos:', error);
        throw error;
    }
}

async function fetchJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error al cargar ${url}:`, error);
        throw error;
    }
}

// Estado persistente
function cargarEstadoPersistente() {
    try {
        const carritoGuardado = localStorage.getItem(STORAGE_KEYS.CARRITO);
        const favoritosGuardado = localStorage.getItem(STORAGE_KEYS.FAVORITOS);
        
        if (carritoGuardado) {
            AppState.carrito = JSON.parse(carritoGuardado);
        }
        
        if (favoritosGuardado) {
            AppState.favoritos = JSON.parse(favoritosGuardado);
        }
    } catch (error) {
        console.error('Error al cargar estado persistente:', error);
    }
}

function guardarEstadoPersistente() {
    try {
        localStorage.setItem(STORAGE_KEYS.CARRITO, JSON.stringify(AppState.carrito));
        localStorage.setItem(STORAGE_KEYS.FAVORITOS, JSON.stringify(AppState.favoritos));
    } catch (error) {
        console.error('Error al guardar estado persistente:', error);
    }
}

// Configuración de eventos
function configurarEventos() {
    // Búsqueda
    document.getElementById('searchForm').addEventListener('submit', manejarBusqueda);
    document.getElementById('searchInput').addEventListener('input', manejarBusquedaEnTiempoReal);
    
    // Filtros
    document.getElementById('categoriaFilter').addEventListener('change', aplicarFiltros);
    document.getElementById('precioFilter').addEventListener('change', aplicarFiltros);
    document.getElementById('ratingFilter').addEventListener('change', aplicarFiltros);
    document.getElementById('ordenFilter').addEventListener('change', aplicarFiltros);
    document.getElementById('limpiarFiltros').addEventListener('click', limpiarFiltros);
    
    // Toggle de filtros móvil
    document.getElementById('toggleFiltrosBtn').addEventListener('click', toggleFiltrosMovil);
    
    // Carrito y favoritos
    document.getElementById('carritoBtn').addEventListener('click', abrirCarrito);
    document.getElementById('favoritosBtn').addEventListener('click', abrirFavoritos);
    
    // Checkout
    document.getElementById('irCheckout').addEventListener('click', abrirCheckout);
    document.getElementById('confirmarCompra').addEventListener('click', confirmarCompra);
    document.getElementById('aplicarCupon').addEventListener('click', aplicarCupon);
    
    // Vaciar carrito
    document.getElementById('vaciarCarrito').addEventListener('click', confirmarVaciarCarrito);
}

// Búsqueda y filtros
function manejarBusqueda(e) {
    e.preventDefault();
    const busqueda = document.getElementById('searchInput').value.trim();
    AppState.filtros.busqueda = busqueda;
    aplicarFiltros();
}

function manejarBusquedaEnTiempoReal(e) {
    AppState.filtros.busqueda = e.target.value.trim();
    aplicarFiltros();
}

function poblarFiltroCategoria() {
    const select = document.getElementById('categoriaFilter');
    select.innerHTML = '<option value="">Todas las categorías</option>';
    
    AppState.categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria.nombre;
        option.textContent = categoria.nombre;
        select.appendChild(option);
    });
}

function aplicarFiltros() {
    AppState.filtros.categoria = document.getElementById('categoriaFilter').value;
    AppState.filtros.precio = document.getElementById('precioFilter').value;
    AppState.filtros.rating = document.getElementById('ratingFilter').value;
    AppState.filtros.orden = document.getElementById('ordenFilter').value;
    
    renderizarCatalogo();
}

function limpiarFiltros() {
    document.getElementById('searchInput').value = '';
    document.getElementById('categoriaFilter').value = '';
    document.getElementById('precioFilter').value = '';
    document.getElementById('ratingFilter').value = '';
    document.getElementById('ordenFilter').value = '';
    
    AppState.filtros = {
        busqueda: '',
        categoria: '',
        precio: '',
        rating: '',
        orden: ''
    };
    
    renderizarCatalogo();
}

// Toggle de filtros en móvil
function toggleFiltrosMovil() {
    const filtrosContenido = document.getElementById('filtrosContenido');
    const filtrosBtnText = document.getElementById('filtrosBtnText');
    const filtrosBtnIcon = document.getElementById('filtrosBtnIcon');
    
    if (filtrosContenido.classList.contains('d-none')) {
        // Mostrar filtros
        filtrosContenido.classList.remove('d-none');
        filtrosContenido.classList.add('mostrar');
        filtrosBtnText.textContent = 'Ocultar Filtros';
        filtrosBtnIcon.classList.remove('fa-chevron-down');
        filtrosBtnIcon.classList.add('fa-chevron-up');
    } else {
        // Ocultar filtros
        filtrosContenido.classList.add('ocultar');
        setTimeout(() => {
            filtrosContenido.classList.remove('mostrar', 'ocultar');
            filtrosContenido.classList.add('d-none');
        }, 400);
        filtrosBtnText.textContent = 'Mostrar Filtros';
        filtrosBtnIcon.classList.remove('fa-chevron-up');
        filtrosBtnIcon.classList.add('fa-chevron-down');
    }
}

function obtenerProductosFiltrados() {
    let productos = [...AppState.productos];
    
    // Aplicar búsqueda
    if (AppState.filtros.busqueda) {
        const busqueda = AppState.filtros.busqueda.toLowerCase();
        productos = productos.filter(p => 
            p.nombre.toLowerCase().includes(busqueda) ||
            p.descripcion.toLowerCase().includes(busqueda) ||
            p.categoria.toLowerCase().includes(busqueda)
        );
    }
    
    // Aplicar filtro de categoría
    if (AppState.filtros.categoria) {
        productos = productos.filter(p => p.categoria === AppState.filtros.categoria);
    }
    
    // Aplicar filtro de precio
    if (AppState.filtros.precio) {
        const [min, max] = AppState.filtros.precio.split('-').map(Number);
        if (AppState.filtros.precio.includes('+')) {
            productos = productos.filter(p => p.precio >= min);
        } else {
            productos = productos.filter(p => p.precio >= min && p.precio <= max);
        }
    }
    
    // Aplicar filtro de rating
    if (AppState.filtros.rating) {
        const ratingMin = Number(AppState.filtros.rating);
        productos = productos.filter(p => p.rating >= ratingMin);
    }
    
    // Aplicar ordenamiento
    if (AppState.filtros.orden) {
        switch (AppState.filtros.orden) {
            case 'precio-asc':
                productos.sort((a, b) => a.precio - b.precio);
                break;
            case 'precio-desc':
                productos.sort((a, b) => b.precio - a.precio);
                break;
            case 'rating-desc':
                productos.sort((a, b) => b.rating - a.rating);
                break;
            case 'nombre-asc':
                productos.sort((a, b) => a.nombre.localeCompare(b.nombre));
                break;
        }
    }
    
    return productos;
}

// Renderizado del catálogo
function renderizarCatalogo() {
    const productos = obtenerProductosFiltrados();
    const grid = document.getElementById('productosGrid');
    const vacio = document.getElementById('productosVacios');
    
    if (productos.length === 0) {
        grid.innerHTML = '';
        vacio.classList.remove('d-none');
        return;
    }
    
    vacio.classList.add('d-none');
    
    grid.innerHTML = productos.map(producto => `
        <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="card producto-card h-100">
                <img src="${producto.imagenes[0]}" class="card-img-top" alt="${producto.nombre}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title text-truncate-2">${producto.nombre}</h5>
                    <div class="precio">$${formatearPrecio(producto.precio)}</div>
                    <div class="rating">
                        ${generarEstrellas(producto.rating)}
                        <span class="ms-2">(${producto.rating})</span>
                    </div>
                    <div class="stock">
                        <i class="fas fa-box me-1"></i>
                        ${producto.stock > 0 ? `${producto.stock} disponibles` : 'Sin stock'}
                    </div>
                    <div class="btn-group mt-auto">
                        <button class="btn btn-vista-rapida" onclick="abrirVistaRapida(${producto.id})">
                            <i class="fas fa-eye me-1"></i>Vista Rápida
                        </button>
                        <button class="btn btn-favorito ${esFavorito(producto.id) ? 'activo' : ''}" 
                                onclick="toggleFavorito(${producto.id})">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                    <div class="mt-2">
                        <button class="btn btn-agregar-carrito w-100" onclick="agregarAlCarritoDirecto(${producto.id})" 
                                ${producto.stock === 0 ? 'disabled' : ''}>
                            <i class="fas fa-shopping-cart me-2"></i>
                            ${producto.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Vista rápida de producto
function abrirVistaRapida(productoId) {
    const producto = AppState.productos.find(p => p.id === productoId);
    if (!producto) return;
    
    const modal = document.getElementById('productoModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = producto.nombre;
    
    modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <div id="galeriaProducto" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-inner">
                        ${producto.imagenes.map((img, index) => `
                            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                <img src="${img}" class="d-block w-100 producto-modal-img" alt="${producto.nombre}">
                            </div>
                        `).join('')}
                    </div>
                    ${producto.imagenes.length > 1 ? `
                        <button class="carousel-control-prev" type="button" data-bs-target="#galeriaProducto" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon"></span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#galeriaProducto" data-bs-slide="next">
                            <span class="carousel-control-next-icon"></span>
                        </button>
                    ` : ''}
                </div>
            </div>
            <div class="col-md-6">
                <div class="producto-modal-info">
                    <h4>${producto.nombre}</h4>
                    <div class="producto-modal-precio">$${formatearPrecio(producto.precio)}</div>
                    <div class="producto-modal-rating">
                        ${generarEstrellas(producto.rating)}
                        <span class="ms-2">${producto.rating}/5</span>
                    </div>
                    <div class="producto-modal-stock">
                        <i class="fas fa-box me-1"></i>
                        ${producto.stock > 0 ? `${producto.stock} unidades disponibles` : 'Producto agotado'}
                    </div>
                    <p class="mb-3">${producto.descripcion}</p>
                    
                    <div class="cantidad-control">
                        <label for="cantidadProducto">Cantidad:</label>
                        <button class="btn btn-outline-secondary" onclick="cambiarCantidad(-1)">-</button>
                        <input type="number" class="form-control" id="cantidadProducto" value="1" min="1" max="${producto.stock}">
                        <button class="btn btn-outline-secondary" onclick="cambiarCantidad(1)">+</button>
                    </div>
                    
                    <div class="d-grid gap-2">
                        <button class="btn btn-checkout" onclick="agregarAlCarrito(${producto.id})" 
                                ${producto.stock === 0 ? 'disabled' : ''}>
                            <i class="fas fa-shopping-cart me-2"></i>
                            ${producto.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                        </button>
                        <button class="btn btn-favorito" onclick="toggleFavorito(${producto.id})">
                            <i class="fas fa-heart me-2"></i>
                            ${esFavorito(producto.id) ? 'Quitar de Favoritos' : 'Agregar a Favoritos'}
                        </button>
                    </div>
                    
                    <div class="mt-3">
                        <h6>Características:</h6>
                        <ul class="list-unstyled">
                            ${producto.caracteristicas.map(caract => `<li><i class="fas fa-check text-success me-2"></i>${caract}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
}

function cambiarCantidad(delta) {
    const input = document.getElementById('cantidadProducto');
    const nuevaCantidad = Math.max(1, Math.min(parseInt(input.value) + delta, parseInt(input.max)));
    input.value = nuevaCantidad;
}

// Carrito
function agregarAlCarritoDirecto(productoId) {
    const producto = AppState.productos.find(p => p.id === productoId);
    if (!producto) return;
    
    if (producto.stock === 0) {
        mostrarToast('Producto sin stock disponible', 'error');
        return;
    }
    
    // Agregar directamente con cantidad 1
    const itemExistente = AppState.carrito.find(item => item.id === productoId);
    
    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        AppState.carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagenes[0],
            cantidad: 1,
            stock: producto.stock
        });
    }
    
    guardarEstadoPersistente();
    actualizarContadores();
    mostrarToast(`"${producto.nombre}" agregado al carrito`, 'success');
}

function agregarAlCarrito(productoId) {
    const producto = AppState.productos.find(p => p.id === productoId);
    if (!producto) return;
    
    const cantidad = parseInt(document.getElementById('cantidadProducto').value) || 1;
    
    if (cantidad > producto.stock) {
        mostrarToast('No hay suficiente stock disponible', 'error');
        return;
    }
    
    const itemExistente = AppState.carrito.find(item => item.id === productoId);
    
    if (itemExistente) {
        itemExistente.cantidad += cantidad;
    } else {
        AppState.carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagenes[0],
            cantidad: cantidad,
            stock: producto.stock
        });
    }
    
    guardarEstadoPersistente();
    actualizarContadores();
    mostrarToast(`"${producto.nombre}" agregado al carrito`, 'success');
    
    // Cerrar modal si está abierto
    const modal = bootstrap.Modal.getInstance(document.getElementById('productoModal'));
    if (modal) modal.hide();
}

function abrirCarrito() {
    renderizarCarrito();
    const modal = new bootstrap.Modal(document.getElementById('carritoModal'));
    modal.show();
}

function renderizarCarrito() {
    const carritoItems = document.getElementById('carritoItems');
    const carritoVacio = document.getElementById('carritoVacio');
    const carritoTotal = document.getElementById('carritoTotal');
    
    if (AppState.carrito.length === 0) {
        carritoItems.innerHTML = '';
        carritoVacio.classList.remove('d-none');
        carritoTotal.textContent = '0';
        return;
    }
    
    carritoVacio.classList.add('d-none');
    
    carritoItems.innerHTML = AppState.carrito.map(item => `
        <div class="carrito-item">
            <div class="row align-items-center">
                <div class="col-md-2">
                    <img src="${item.imagen}" class="carrito-item-img" alt="${item.nombre}">
                </div>
                <div class="col-md-4">
                    <div class="carrito-item-info">
                        <h6>${item.nombre}</h6>
                        <div class="carrito-item-precio">$${formatearPrecio(item.precio)}</div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="carrito-item-cantidad">
                        <button class="btn btn-outline-secondary" onclick="cambiarCantidadCarrito(${item.id}, -1)">-</button>
                        <span class="mx-2">${item.cantidad}</span>
                        <button class="btn btn-outline-secondary" onclick="cambiarCantidadCarrito(${item.id}, 1)">+</button>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="text-end">
                        <div class="fw-bold">$${formatearPrecio(item.precio * item.cantidad)}</div>
                        <button class="btn btn-sm btn-outline-danger" onclick="eliminarDelCarrito(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    const total = AppState.carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    carritoTotal.textContent = formatearPrecio(total);
}

function cambiarCantidadCarrito(productoId, delta) {
    const item = AppState.carrito.find(item => item.id === productoId);
    if (!item) return;
    
    const nuevaCantidad = item.cantidad + delta;
    
    if (nuevaCantidad <= 0) {
        eliminarDelCarrito(productoId);
    } else if (nuevaCantidad > item.stock) {
        mostrarToast('No hay suficiente stock disponible', 'error');
    } else {
        item.cantidad = nuevaCantidad;
        guardarEstadoPersistente();
        renderizarCarrito();
        actualizarContadores();
    }
}

function eliminarDelCarrito(productoId) {
    AppState.carrito = AppState.carrito.filter(item => item.id !== productoId);
    guardarEstadoPersistente();
    renderizarCarrito();
    actualizarContadores();
}

function confirmarVaciarCarrito() {
    if (AppState.carrito.length === 0) return;
    
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        AppState.carrito = [];
        guardarEstadoPersistente();
        renderizarCarrito();
        actualizarContadores();
        mostrarToast('Carrito vaciado', 'info');
    }
}

// Favoritos
function toggleFavorito(productoId) {
    const index = AppState.favoritos.indexOf(productoId);
    
    if (index === -1) {
        AppState.favoritos.push(productoId);
        mostrarToast('Producto agregado a favoritos', 'success');
    } else {
        AppState.favoritos.splice(index, 1);
        mostrarToast('Producto removido de favoritos', 'info');
    }
    
    guardarEstadoPersistente();
    actualizarContadores();
    renderizarCatalogo();
}

function esFavorito(productoId) {
    return AppState.favoritos.includes(productoId);
}

function abrirFavoritos() {
    renderizarFavoritos();
    const modal = new bootstrap.Modal(document.getElementById('favoritosModal'));
    modal.show();
}

function renderizarFavoritos() {
    const favoritosItems = document.getElementById('favoritosItems');
    const favoritosVacio = document.getElementById('favoritosVacio');
    
    if (AppState.favoritos.length === 0) {
        favoritosItems.innerHTML = '';
        favoritosVacio.classList.remove('d-none');
        return;
    }
    
    favoritosVacio.classList.add('d-none');
    
    const productosFavoritos = AppState.productos.filter(p => AppState.favoritos.includes(p.id));
    
    favoritosItems.innerHTML = productosFavoritos.map(producto => `
        <div class="favorito-item">
            <div class="row align-items-center">
                <div class="col-md-2">
                    <img src="${producto.imagenes[0]}" class="favorito-item-img" alt="${producto.nombre}">
                </div>
                <div class="col-md-6">
                    <div class="favorito-item-info">
                        <h6>${producto.nombre}</h6>
                        <div class="favorito-item-precio">$${formatearPrecio(producto.precio)}</div>
                        <div class="rating">
                            ${generarEstrellas(producto.rating)}
                            <span class="ms-2">(${producto.rating})</span>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="d-grid gap-2">
                        <button class="btn btn-checkout btn-sm" onclick="moverAFavoritosACarrito(${producto.id})" 
                                ${producto.stock === 0 ? 'disabled' : ''}>
                            <i class="fas fa-shopping-cart me-2"></i>
                            ${producto.stock === 0 ? 'Sin Stock' : 'Mover al Carrito'}
                        </button>
                        <button class="btn btn-favorito btn-sm" onclick="toggleFavorito(${producto.id})">
                            <i class="fas fa-heart-broken me-2"></i>Quitar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function moverAFavoritosACarrito(productoId) {
    const producto = AppState.productos.find(p => p.id === productoId);
    if (!producto || producto.stock === 0) return;
    
    // Agregar al carrito
    const itemExistente = AppState.carrito.find(item => item.id === productoId);
    
    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        AppState.carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagenes[0],
            cantidad: 1,
            stock: producto.stock
        });
    }
    
    // Remover de favoritos
    const index = AppState.favoritos.indexOf(productoId);
    if (index !== -1) {
        AppState.favoritos.splice(index, 1);
    }
    
    guardarEstadoPersistente();
    actualizarContadores();
    renderizarFavoritos();
    mostrarToast(`"${producto.nombre}" movido al carrito`, 'success');
}

// Checkout
function abrirCheckout() {
    if (AppState.carrito.length === 0) {
        mostrarToast('El carrito está vacío', 'error');
        return;
    }
    
    renderizarOpcionesEnvio();
    renderizarResumenCompra();
    
    const modal = new bootstrap.Modal(document.getElementById('checkoutModal'));
    modal.show();
}

function renderizarOpcionesEnvio() {
    const opcionesEnvio = document.getElementById('opcionesEnvio');
    
    opcionesEnvio.innerHTML = AppState.opcionesEnvio.map(opcion => `
        <div class="opcion-envio" onclick="seleccionarEnvio(${opcion.id})">
            <input type="radio" name="envio" value="${opcion.id}" id="envio${opcion.id}">
            <label for="envio${opcion.id}" class="ms-2">
                <i class="${opcion.icono} me-2"></i>
                <strong>${opcion.nombre}</strong> - ${opcion.descripcion}
                <div class="text-muted">${opcion.tiempo}</div>
            </label>
            <div class="float-end">
                <strong>$${formatearPrecio(opcion.precio)}</strong>
            </div>
        </div>
    `).join('');
}

function seleccionarEnvio(envioId) {
    // Remover selección previa
    document.querySelectorAll('.opcion-envio').forEach(opcion => {
        opcion.classList.remove('seleccionada');
    });
    
    // Seleccionar nueva opción
    const opcionSeleccionada = document.querySelector(`#envio${envioId}`).closest('.opcion-envio');
    opcionSeleccionada.classList.add('seleccionada');
    
    // Marcar radio button
    document.querySelector(`#envio${envioId}`).checked = true;
    
    renderizarResumenCompra();
}

function renderizarResumenCompra() {
    const resumenCompra = document.getElementById('resumenCompra');
    
    const subtotal = AppState.carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const envioSeleccionado = document.querySelector('input[name="envio"]:checked');
    const costoEnvio = envioSeleccionado ? AppState.opcionesEnvio.find(e => e.id === parseInt(envioSeleccionado.value))?.precio || 0 : 0;
    
    let descuento = 0;
    if (AppState.cuponAplicado) {
        if (AppState.cuponAplicado.tipo === 'porcentaje') {
            descuento = (subtotal * AppState.cuponAplicado.descuento) / 100;
        } else if (AppState.cuponAplicado.tipo === 'fijo') {
            descuento = AppState.cuponAplicado.descuento;
        }
    }
    
    const total = subtotal + costoEnvio - descuento;
    
    resumenCompra.innerHTML = `
        <div class="resumen-item">
            <span>Subtotal (${AppState.carrito.length} productos):</span>
            <span>$${formatearPrecio(subtotal)}</span>
        </div>
        <div class="resumen-item">
            <span>Costo de envío:</span>
            <span>$${formatearPrecio(costoEnvio)}</span>
        </div>
        ${descuento > 0 ? `
            <div class="resumen-item text-success">
                <span>Descuento (${AppState.cuponAplicado.codigo}):</span>
                <span>-$${formatearPrecio(descuento)}</span>
            </div>
        ` : ''}
        <div class="resumen-item">
            <span>Total:</span>
            <span>$${formatearPrecio(total)}</span>
        </div>
    `;
}

function aplicarCupon() {
    const codigo = document.getElementById('cuponCodigo').value.trim().toUpperCase();
    const mensaje = document.getElementById('cuponMensaje');
    
    if (!codigo) {
        mensaje.innerHTML = '<span class="text-danger">Por favor ingresa un código</span>';
        return;
    }
    
    const cupon = AppState.cupones.find(c => c.codigo === codigo && c.activo);
    
    if (!cupon) {
        mensaje.innerHTML = '<span class="text-danger">Cupón no válido o expirado</span>';
        return;
    }
    
    const subtotal = AppState.carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    
    if (subtotal < cupon.minimo) {
        mensaje.innerHTML = `<span class="text-danger">Monto mínimo requerido: $${formatearPrecio(cupon.minimo)}</span>`;
        return;
    }
    
    AppState.cuponAplicado = cupon;
    mensaje.innerHTML = `<span class="text-success">¡Cupón aplicado! ${cupon.descripcion}</span>`;
    renderizarResumenCompra();
    mostrarToast(`Cupón ${cupon.codigo} aplicado correctamente`, 'success');
}

function confirmarCompra() {
    const form = document.getElementById('checkoutForm');
    
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }
    
    const envioSeleccionado = document.querySelector('input[name="envio"]:checked');
    if (!envioSeleccionado) {
        mostrarToast('Por favor selecciona un método de envío', 'error');
        return;
    }
    
    // Simular procesamiento de compra
    const boton = document.getElementById('confirmarCompra');
    const textoOriginal = boton.innerHTML;
    
    boton.innerHTML = '<span class="loading-spinner me-2"></span>Procesando...';
    boton.disabled = true;
    
    setTimeout(() => {
        // Generar número de orden
        const numeroOrden = 'UNAB-' + Date.now().toString().slice(-8);
        document.getElementById('numeroOrden').textContent = numeroOrden;
        
        // Limpiar carrito y cupón
        AppState.carrito = [];
        AppState.cuponAplicado = null;
        guardarEstadoPersistente();
        actualizarContadores();
        
        // Cerrar modales
        bootstrap.Modal.getInstance(document.getElementById('checkoutModal')).hide();
        
        // Mostrar confirmación
        const modal = new bootstrap.Modal(document.getElementById('confirmacionModal'));
        modal.show();
        
        // Restaurar botón
        boton.innerHTML = textoOriginal;
        boton.disabled = false;
        
        // Limpiar formulario
        form.reset();
        form.classList.remove('was-validated');
        
        mostrarToast('¡Compra realizada con éxito!', 'success');
    }, 2000);
}

// Utilidades
function formatearPrecio(precio) {
    return precio.toLocaleString('es-CL');
}

function generarEstrellas(rating) {
    const estrellasLlenas = Math.floor(rating);
    const estrellaMedia = rating % 1 >= 0.5;
    const estrellasVacias = 5 - estrellasLlenas - (estrellaMedia ? 1 : 0);
    
    let html = '';
    
    for (let i = 0; i < estrellasLlenas; i++) {
        html += '<i class="fas fa-star"></i>';
    }
    
    if (estrellaMedia) {
        html += '<i class="fas fa-star-half-alt"></i>';
    }
    
    for (let i = 0; i < estrellasVacias; i++) {
        html += '<i class="far fa-star"></i>';
    }
    
    return html;
}

function actualizarContadores() {
    const carritoCount = document.getElementById('carritoCount');
    const favoritosCount = document.getElementById('favoritosCount');
    
    const totalCarrito = AppState.carrito.reduce((sum, item) => sum + item.cantidad, 0);
    
    carritoCount.textContent = totalCarrito;
    favoritosCount.textContent = AppState.favoritos.length;
    
    // Ocultar contadores si están en 0
    carritoCount.style.display = totalCarrito === 0 ? 'none' : 'inline';
    favoritosCount.style.display = AppState.favoritos.length === 0 ? 'none' : 'inline';
}

function mostrarToast(mensaje, tipo = 'info') {
    const toast = document.getElementById('toastNotificacion');
    const toastTitle = document.getElementById('toastTitle');
    const toastBody = document.getElementById('toastBody');
    const toastIcon = document.getElementById('toastIcon');
    
    // Configurar según el tipo
    let titulo, icono, claseColor;
    switch (tipo) {
        case 'success':
            titulo = 'Éxito';
            icono = 'fas fa-check-circle text-success';
            claseColor = 'text-success';
            break;
        case 'error':
            titulo = 'Error';
            icono = 'fas fa-exclamation-circle text-danger';
            claseColor = 'text-danger';
            break;
        case 'warning':
            titulo = 'Advertencia';
            icono = 'fas fa-exclamation-triangle text-warning';
            claseColor = 'text-warning';
            break;
        default:
            titulo = 'Información';
            icono = 'fas fa-info-circle text-info';
            claseColor = 'text-info';
    }
    
    toastTitle.textContent = titulo;
    toastTitle.className = `me-auto ${claseColor}`;
    toastIcon.className = icono;
    toastBody.textContent = mensaje;
    
    const toastInstance = new bootstrap.Toast(toast);
    toastInstance.show();
}

// Función para sanitizar HTML (prevenir XSS)
function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Exportar funciones para uso global
window.abrirVistaRapida = abrirVistaRapida;
window.toggleFavorito = toggleFavorito;
window.agregarAlCarrito = agregarAlCarrito;
window.agregarAlCarritoDirecto = agregarAlCarritoDirecto;
window.cambiarCantidad = cambiarCantidad;
window.cambiarCantidadCarrito = cambiarCantidadCarrito;
window.eliminarDelCarrito = eliminarDelCarrito;
window.moverAFavoritosACarrito = moverAFavoritosACarrito;
window.seleccionarEnvio = seleccionarEnvio;
window.toggleFiltrosMovil = toggleFiltrosMovil;
