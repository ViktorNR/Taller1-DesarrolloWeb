# 🛒 Mini Marketplace Angular - UNAB

Un mini-mercado desarrollado con Angular 20 que integra la API de DummyJSON para proporcionar un catálogo realista de productos con funcionalidades completas de e-commerce.

## 🚀 Características Principales

- **Catálogo de Productos**: Vista completa con productos reales de DummyJSON
- **Búsqueda y Filtros**: Búsqueda por texto, filtros por categoría, precio y rating
- **Detalle de Producto**: Modal con información completa e imágenes
- **Carrito de Compras**: Gestión de productos con persistencia en localStorage
- **Favoritos**: Sistema de productos favoritos con localStorage
- **Checkout**: Formulario de compra con validaciones completas
- **Notificaciones**: Sistema de toast para feedback al usuario
- **Responsive Design**: Optimizado para desktop, tablet y móvil

## 🛠️ Tecnologías Utilizadas

- **Angular 20** - Framework principal
- **TypeScript** - Lenguaje de programación
- **Bootstrap 5** - Framework CSS
- **RxJS** - Programación reactiva
- **Font Awesome** - Iconografía
- **Bootstrap Icons** - Iconos adicionales
- **dotenv** - Manejo de variables de entorno
- **Node.js Scripts** - Automatización de configuración

## 🏗️ Arquitectura Técnica

### Componentes Standalone
La aplicación utiliza componentes standalone de Angular 20, eliminando la necesidad de NgModules y simplificando la estructura.

### Servicios con Inyección de Dependencias
- **ProductosService**: Gestión de productos y comunicación con DummyJSON API
- **CarritoService**: Manejo del carrito de compras
- **FavoritosService**: Gestión de productos favoritos
- **CheckoutService**: Lógica de checkout y validaciones
- **FiltrosService**: Estado de filtros y búsqueda
- **NotificacionService**: Sistema de notificaciones toast

### Manejo de Estado Reactivo
Utiliza RxJS para el manejo de estado reactivo con observables y operadores para transformaciones de datos.

### Estructura de Carpetas
```
src/
├── app/
│   ├── components/     # Componentes de la UI
│   ├── services/       # Servicios de lógica de negocio
│   └── assets/data/    # Datos estáticos (envíos, promociones)
├── environments/       # Configuraciones de entorno
└── styles.css        # Estilos globales
```

## 🌐 API Externa - DummyJSON

### ¿Qué es DummyJSON?
DummyJSON es una API REST pública que proporciona datos de prueba realistas para aplicaciones de e-commerce. Es perfecta para prototipos y desarrollo frontend.

### ¿Por qué se usa?
- **Datos Realistas**: Productos con imágenes, precios, categorías, ratings y stock reales
- **Sin Backend Propio**: Elimina la necesidad de desarrollar y mantener un backend
- **Imágenes de Productos**: Incluye imágenes reales de productos
- **Soporte Completo**: Búsqueda, filtrado y categorización

### Endpoints Utilizados

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/products` | GET | Lista de productos con paginación |
| `/products/{id}` | GET | Detalle de un producto específico |
| `/products/search?q={query}` | GET | Búsqueda de productos por texto |
| `/products/category/{category}` | GET | Productos filtrados por categoría |
| `/products/categories` | GET | Lista de todas las categorías disponibles |

### Beneficios de DummyJSON
- **Datos Consistentes**: Estructura uniforme de productos
- **Imágenes Reales**: Productos con imágenes de alta calidad
- **Categorías Diversas**: Amplia variedad de categorías de productos
- **Ratings y Stock**: Datos realistas de calificaciones y disponibilidad
- **API REST Estándar**: Fácil integración con cualquier framework

## 📦 Instalación y Configuración

### Requisitos Previos
- Node.js 18+ 
- npm 9+

### Comandos de Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd Taller1-DesarrolloWeb

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar servidor de desarrollo
npm start
```

### 🔧 Configuración de Variables de Entorno

La aplicación utiliza un sistema de variables de entorno para manejar configuraciones sensibles y específicas del entorno.

#### Archivo `.env` (Local - NO se sube a Git)
```env
# API Configuration
URL_API=https://dummyjson.com

# Environment
NODE_ENV=development
```

#### Archivo `.env.example` (Plantilla - SÍ se sube a Git)
```env
# API Configuration
URL_API=https://dummyjson.com

# Environment
NODE_ENV=development
```

#### Carga Automática de Variables
- Las variables se cargan automáticamente antes de `start` y `build`
- Los archivos de environment se generan automáticamente basados en `.env`
- Para cambios en `.env`, no necesitas reiniciar el servidor de desarrollo

#### Comandos de Variables de Entorno
```bash
# Cargar variables manualmente
npm run env:load

# Desarrollo (carga variables automáticamente)
npm start

# Construcción para producción
npm run build:prod
```

> 📖 **Documentación completa**: Ver `ENV_SETUP.md` para instrucciones detalladas sobre el manejo de variables de entorno.

## 🚀 Comandos Disponibles

| Comando | Descripción |
|----------|-------------|
| `npm start` | Inicia servidor de desarrollo en http://localhost:4200 (carga variables automáticamente) |
| `npm run build` | Compila la aplicación para desarrollo (carga variables automáticamente) |
| `npm run build:prod` | Compila la aplicación para producción (carga variables automáticamente) |
| `npm run env:load` | Carga variables de entorno manualmente |
| `npm test` | Ejecuta las pruebas unitarias |
| `npm run watch` | Compila en modo watch para desarrollo |

## 📁 Estructura del Proyecto

```
├── .env                      # Variables de entorno locales (NO en Git)
├── .env.example              # Plantilla de variables de entorno (SÍ en Git)
├── scripts/
│   └── load-env.js           # Script de carga de variables de entorno
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── catalogo/          # Catálogo de productos
│   │   │   ├── carrito/           # Carrito de compras
│   │   │   ├── favoritos/         # Productos favoritos
│   │   │   ├── checkout/          # Proceso de compra
│   │   │   ├── header/            # Navegación principal
│   │   │   ├── footer/            # Pie de página
│   │   │   ├── detalle-producto/  # Modal de detalle
│   │   │   ├── filtros/           # Componente de filtros
│   │   │   └── toast/             # Notificaciones
│   │   ├── services/
│   │   │   ├── productos.ts        # Gestión de productos
│   │   │   ├── carrito.ts         # Lógica del carrito
│   │   │   ├── favoritos.ts       # Gestión de favoritos
│   │   │   ├── checkout.ts        # Proceso de checkout
│   │   │   ├── filtros.ts         # Estado de filtros
│   │   │   └── notificacion.ts    # Sistema de notificaciones
│   │   └── assets/data/
│   │       ├── envios.json        # Opciones de envío
│   │       └── promos.json        # Cupones de descuento
│   ├── environments/
│   │   ├── environment.ts         # Configuración desarrollo (generado automáticamente)
│   │   ├── environment.development.ts # Configuración desarrollo (generado automáticamente)
│   │   └── environment.prod.ts    # Configuración producción (generado automáticamente)
│   └── styles.css                # Estilos globales
├── ENV_SETUP.md              # Documentación de variables de entorno
└── README.md                 # Este archivo
```

## ✨ Funcionalidades Implementadas

### 🛍️ Catálogo de Productos
- Vista de productos con imágenes, precios y ratings
- Paginación y carga dinámica
- Estados de loading y error
- Estados vacíos cuando no hay productos

### 🔍 Búsqueda y Filtros
- Búsqueda por texto en tiempo real
- Filtros por categoría, precio y rating
- Ordenamiento por precio, rating y nombre
- Persistencia de filtros en el estado

### 👁️ Detalle de Producto
- Modal con información completa
- Galería de imágenes
- Información de stock y características
- Botones de acción (agregar al carrito, favoritos)

### 🛒 Carrito de Compras
- Agregar/eliminar productos
- Modificar cantidades
- Cálculo automático de totales
- Persistencia en localStorage
- Vaciar carrito con confirmación

### ❤️ Sistema de Favoritos
- Marcar/desmarcar productos como favoritos
- Vista dedicada de favoritos
- Persistencia en localStorage
- Estados vacíos y feedback visual

### 💳 Proceso de Checkout
- Formulario de datos personales
- Validación de RUT chileno
- Validación de email y teléfono
- Selección de opciones de envío
- Aplicación de cupones de descuento
- Cálculo de totales finales

### 🔔 Sistema de Notificaciones
- Toast notifications para feedback
- Diferentes tipos: success, error, info
- Auto-dismiss con timeout
- Animaciones suaves

### 📱 Responsive Design
- Optimizado para desktop, tablet y móvil
- Navegación adaptativa
- Componentes que se ajustan al tamaño de pantalla
- Touch-friendly en dispositivos móviles

## 📸 Capturas de Pantalla

Las capturas de pantalla están disponibles en la carpeta `docs/` y documentan:
- Vista del catálogo con productos
- Funcionalidades de búsqueda y filtros
- Proceso de compra completo
- Integración con DummyJSON API
- Diseño responsive

## 🎯 Identidad de Marca UNAB

La aplicación sigue la identidad visual de la Universidad Nacional Andrés Bello:
- **Colores**: Azul oscuro (#002B5C), rojo (#C8102E), blanco y gris
- **Tipografía**: Open Sans y Roboto
- **Accesibilidad**: Cumple con estándares WCAG
- **Responsive**: Optimizado para todos los dispositivos

## 🚀 Desarrollo Futuro

- Integración con API del Banco Central para conversión de monedas
- Sistema de autenticación de usuarios
- Historial de compras
- Recomendaciones de productos
- Integración con pasarelas de pago

---

**Desarrollado para el Taller 1 de Desarrollo Web y Móvil - UNAB**
