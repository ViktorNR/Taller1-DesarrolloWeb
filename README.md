# 🛒 Mini Marketplace UNAB - Full Stack

Un mini-mercado full-stack desarrollado con React y FastAPI que integra la API de DummyJSON para proporcionar un catálogo realista de productos con funcionalidades completas de e-commerce, autenticación de usuarios y gestión de compras.

## 🚀 Características Principales

### Frontend
- **Catálogo de Productos**: Vista completa con productos reales de DummyJSON
- **Búsqueda y Filtros**: Búsqueda por texto, filtros por categoría, precio y rating
- **Detalle de Producto**: Vista rápida y página de detalle con información completa e imágenes
- **Carrito de Compras**: Gestión de productos con persistencia en localStorage
- **Favoritos**: Sistema de productos favoritos con localStorage
- **Checkout**: Formulario de compra con validaciones completas
- **Autenticación**: Sistema de login y registro con JWT
- **Perfil de Usuario**: Gestión de datos personales y direcciones de despacho
- **Historial de Compras**: Visualización de compras anteriores con descarga de PDF
- **Notificaciones**: Sistema de toast para feedback al usuario
- **Responsive Design**: Optimizado para desktop, tablet y móvil
- **Server-Side Rendering (SSR)**: Soporte para renderizado del lado del servidor

### Backend
- **API RESTful**: FastAPI con documentación automática (Swagger/ReDoc)
- **Autenticación JWT**: Sistema seguro de autenticación con tokens
- **Base de Datos PostgreSQL**: Con soporte JSONB para datos flexibles
- **Gestión de Documentos**: Sistema de compras con generación de PDF
- **Validaciones**: Validación de RUT chileno, teléfono y complejidad de contraseñas
- **Direcciones de Despacho**: CRUD completo de direcciones de usuario
- **CORS Configurado**: Listo para integración con frontend

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** - Biblioteca de UI
- **TypeScript** - Lenguaje de programación tipado
- **Vite** - Build tool y dev server
- **React Router DOM** - Enrutamiento
- **Axios** - Cliente HTTP
- **Express** - Servidor SSR
- **CSS3** - Estilos con variables CSS (identidad UNAB)

### Backend
- **FastAPI** - Framework web moderno y rápido
- **Python 3** - Lenguaje de programación
- **PostgreSQL** - Base de datos relacional
- **SQLAlchemy** - ORM
- **Pydantic** - Validación de datos
- **JWT** - Autenticación con tokens
- **ReportLab** - Generación de PDFs
- **bcrypt** - Hash de contraseñas

### DevOps
- **Docker** - Containerización
- **Docker Compose** - Orquestación de servicios

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas

```
Taller1-DesarrolloWeb/
├── frontend/                    # Aplicación React
│   ├── src/
│   │   ├── api/                # Cliente API (Axios)
│   │   ├── components/         # Componentes reutilizables
│   │   │   ├── Auth/           # Login y Registro
│   │   │   ├── Carrito/        # Modal de carrito
│   │   │   ├── Favoritos/      # Modal de favoritos
│   │   │   ├── VistaRapida/    # Vista rápida de producto
│   │   │   ├── Header.tsx      # Navegación principal
│   │   │   ├── Footer.tsx      # Pie de página
│   │   │   ├── Filtros.tsx     # Componente de filtros
│   │   │   ├── ProductCard.tsx # Tarjeta de producto
│   │   │   └── Toast.tsx       # Notificaciones
│   │   ├── context/            # Context API (Estado global)
│   │   │   ├── AuthContext.tsx      # Estado de autenticación
│   │   │   ├── StoreContext.tsx     # Carrito y favoritos
│   │   │   ├── FiltersContext.tsx   # Estado de filtros
│   │   │   └── UIContext.tsx         # Estado de UI (toasts)
│   │   ├── pages/              # Páginas/Views
│   │   │   ├── Catalogo.tsx          # Catálogo principal
│   │   │   ├── Carrito/              # Página de carrito
│   │   │   ├── Favoritos.tsx         # Página de favoritos
│   │   │   ├── Checkout/              # Proceso de compra
│   │   │   ├── DetalleProducto.tsx   # Detalle de producto
│   │   │   ├── MisDatos/              # Perfil de usuario
│   │   │   ├── MisCompras/            # Historial de compras
│   │   │   └── Direcciones/           # Gestión de direcciones
│   │   ├── entry-client.tsx    # Punto de entrada cliente
│   │   ├── entry-server.tsx    # Punto de entrada SSR
│   │   ├── routes.tsx          # Configuración de rutas
│   │   └── styles.css          # Estilos globales
│   ├── public/
│   │   └── data/               # Datos estáticos
│   │       ├── productos.json   # Catálogo de productos
│   │       ├── categorias.json # Categorías disponibles
│   │       ├── envios.json     # Métodos de envío
│   │       └── promos.json     # Cupones de descuento
│   ├── server/                 # Servidor SSR
│   ├── Dockerfile              # Imagen Docker frontend
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                    # API FastAPI
│   ├── API/
│   │   ├── app/
│   │   │   ├── main.py         # Aplicación FastAPI principal
│   │   │   ├── database.py     # Configuración de BD
│   │   │   ├── models.py       # Modelos SQLAlchemy
│   │   │   ├── schemas.py      # Schemas Pydantic
│   │   │   ├── auth.py         # Lógica de autenticación
│   │   │   ├── validators.py   # Validadores (RUT, teléfono)
│   │   │   └── services/
│   │   │       └── documento_service.py  # Generación de PDFs
│   │   ├── dockerfile          # Imagen Docker API
│   │   └── requirements.txt    # Dependencias Python
│   │
│   ├── BD/
│   │   ├── dockerfile          # Imagen Docker PostgreSQL
│   │   ├── init-db.sql         # Script de inicialización
│   │   └── migrations/         # Migraciones de BD
│   │
│   └── docker-compose.yml      # Orquestación backend
│
├── docker-compose.yml          # Orquestación completa (frontend + backend)
├── package.json                # Scripts del proyecto raíz
└── README.md                   # Este archivo
```

### Manejo de Estado

El frontend utiliza **React Context API** para el manejo de estado global:
- **AuthContext**: Autenticación y sesión de usuario
- **StoreContext**: Carrito de compras y favoritos (con localStorage)
- **FiltersContext**: Estado de filtros y búsqueda
- **UIContext**: Notificaciones toast y estado de UI

### Comunicación Frontend-Backend

- **API Client**: Axios configurado con interceptores para JWT
- **Base URL**: Configurable mediante variable de entorno `VITE_API_BASE`
- **Autenticación**: Tokens JWT almacenados y enviados automáticamente

## 🌐 API Externa - DummyJSON

### ¿Qué es DummyJSON?
DummyJSON es una API REST pública que proporciona datos de prueba realistas para aplicaciones de e-commerce. Es perfecta para prototipos y desarrollo frontend.

### ¿Por qué se usa?
- **Datos Realistas**: Productos con imágenes, precios, categorías, ratings y stock reales
- **Sin Backend Propio**: Elimina la necesidad de desarrollar y mantener un backend para productos
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

### Estrategia de Datos
El frontend carga productos desde un archivo JSON local (`productos.json`) y los complementa con datos de DummyJSON cuando está disponible. Si DummyJSON no responde, se usa el catálogo local como fallback.

## 📦 Instalación y Configuración

### Requisitos Previos
- **Node.js** 18+ 
- **npm** 9+ o **yarn**
- **Docker** y **Docker Compose** (para desarrollo con contenedores)
- **Python** 3.10+ (solo si ejecutas backend sin Docker)

### Opción 1: Desarrollo con Docker (Recomendado)

```bash
# Clonar el repositorio
git clone <repository-url>
cd Taller1-DesarrolloWeb

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Levantar todos los servicios (frontend, backend, base de datos)
docker-compose up --build

# En otra terminal, para ver logs
docker-compose logs -f
```

Los servicios estarán disponibles en:
- **Frontend**: http://localhost:5173 (dev) o http://localhost:5174 (SSR)
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs (Swagger UI)
- **PostgreSQL**: localhost:5432

### Opción 2: Desarrollo Local (Sin Docker)

#### Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
cd API
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con DATABASE_URL, SECRET_KEY, etc.

# Levantar base de datos (requiere PostgreSQL instalado)
# O usar Docker solo para la BD:
cd ../BD
docker-compose up -d db

# Ejecutar API
cd ../API
uvicorn app.main:app --reload --port 8000
```

#### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno (opcional)
# Crear .env.local con VITE_API_BASE=http://localhost:8000

# Iniciar servidor de desarrollo
npm run dev

# O con SSR
npm run ssr:dev
```

### 🔧 Configuración de Variables de Entorno

#### Archivo `.env` (Raíz del proyecto)

```env
# PostgreSQL
POSTGRES_DB=marketplace_db
POSTGRES_USER=marketplace_user
POSTGRES_PASSWORD=tu_password_seguro
POSTGRES_HOST_AUTH_METHOD=trust

# JWT
SECRET_KEY=tu_secret_key_muy_segura_aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Frontend (opcional, en frontend/.env.local)
VITE_API_BASE=http://localhost:8000
```

#### Generar SECRET_KEY

```bash
# En Linux/Mac
openssl rand -hex 32

# O en Python
python3 -c "import secrets; print(secrets.token_hex(32))"
```

## 🚀 Comandos Disponibles

### Frontend

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo Vite en http://localhost:5175 |
| `npm run build` | Compila la aplicación para producción (cliente + SSR) |
| `npm run preview` | Previsualiza build de producción |
| `npm run ssr:dev` | Inicia servidor SSR en modo desarrollo |
| `npm run ssr:start` | Inicia servidor SSR en modo producción |

### Backend

| Comando | Descripción |
|---------|-------------|
| `uvicorn app.main:app --reload` | Inicia servidor de desarrollo |
| `uvicorn app.main:app --host 0.0.0.0 --port 8000` | Inicia servidor producción |

### Docker

| Comando | Descripción |
|---------|-------------|
| `docker-compose up` | Levanta todos los servicios |
| `docker-compose up --build` | Reconstruye imágenes y levanta servicios |
| `docker-compose down` | Detiene todos los servicios |
| `docker-compose down -v` | Detiene servicios y elimina volúmenes (⚠️ borra datos) |
| `docker-compose logs -f` | Ver logs en tiempo real |
| `docker-compose restart api` | Reinicia solo el servicio API |

## 📡 Endpoints de la API

### Autenticación

- `POST /token` - Login (obtener JWT)
- `POST /register` - Registrar nuevo usuario
- `GET /users/me` - Obtener usuario actual
- `PUT /usuarios/me` - Actualizar datos del usuario

### Documentos (Compras)

- `POST /documentos` - Crear documento/compra
- `GET /documentos` - Listar compras del usuario
- `GET /documentos/{id}` - Obtener compra por ID
- `GET /documentos/{id}/pdf` - Descargar PDF de compra
- `POST /documentos/{id}/detalles` - Agregar detalle a compra

### Direcciones de Despacho

- `POST /usuarios/me/direcciones` - Crear dirección
- `GET /usuarios/me/direcciones` - Listar direcciones
- `PUT /usuarios/me/direcciones/{id}` - Actualizar dirección
- `DELETE /usuarios/me/direcciones/{id}` - Eliminar dirección
- `PUT /usuarios/me/direcciones/{id}/principal` - Marcar como principal

### Checkout

- `POST /checkout` - Procesar compra completa (valida stock, crea documento, genera PDF)

### Documentación Interactiva

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## ✨ Funcionalidades Implementadas

### 🛍️ Catálogo de Productos
- Vista de productos con imágenes, precios y ratings
- Integración con DummyJSON API
- Fallback a catálogo local si API no disponible
- Estados de loading y error
- Estados vacíos cuando no hay productos

### 🔍 Búsqueda y Filtros
- Búsqueda por texto en tiempo real
- Filtros por categoría, precio y rating
- Ordenamiento por precio, rating y nombre
- Persistencia de filtros en el estado

### 👁️ Detalle de Producto
- Vista rápida (modal) con información esencial
- Página de detalle completa
- Galería de imágenes
- Información de stock y características
- Botones de acción (agregar al carrito, favoritos)

### 🛒 Carrito de Compras
- Agregar/eliminar productos
- Modificar cantidades
- Cálculo automático de totales
- Persistencia en localStorage
- Vaciar carrito con confirmación
- Validación de stock antes de checkout

### ❤️ Sistema de Favoritos
- Marcar/desmarcar productos como favoritos
- Vista dedicada de favoritos
- Persistencia en localStorage
- Estados vacíos y feedback visual

### 🔐 Autenticación y Usuario
- Registro con validación de RUT chileno
- Login con JWT
- Gestión de perfil de usuario
- Validación de complejidad de contraseñas
- Validación de teléfono chileno

### 📍 Direcciones de Despacho
- CRUD completo de direcciones
- Marcar dirección principal
- Validación de datos
- Integración con checkout

### 💳 Proceso de Checkout
- Formulario de datos personales
- Validación de RUT chileno
- Validación de email y teléfono
- Selección de opciones de envío
- Aplicación de cupones de descuento
- Cálculo de totales finales
- Validación de stock
- Generación automática de PDF

### 📄 Historial de Compras
- Lista de compras anteriores
- Filtrado por estado
- Ordenamiento por fecha o monto
- Descarga de PDF de comprobantes
- Vista detallada de cada compra

### 🔔 Sistema de Notificaciones
- Toast notifications para feedback
- Diferentes tipos: success, error, info, warning
- Auto-dismiss con timeout
- Animaciones suaves

### 📱 Responsive Design
- Optimizado para desktop, tablet y móvil
- Navegación adaptativa
- Componentes que se ajustan al tamaño de pantalla
- Touch-friendly en dispositivos móviles

## 🎯 Identidad de Marca UNAB

La aplicación sigue la identidad visual de la Universidad Nacional Andrés Bello:
- **Colores**: 
  - Azul oscuro (#002B5C) - Color principal
  - Rojo (#C8102E) - Acentos y acciones
  - Blanco (#FFFFFF) - Fondos
  - Grises - Textos y elementos secundarios
- **Tipografía**: Open Sans y Roboto
- **Accesibilidad**: Cumple con estándares WCAG
- **Responsive**: Optimizado para todos los dispositivos

## 🗄️ Base de Datos

### Modelos Principales

- **Usuario**: Información de usuarios con autenticación
- **Documento**: Compras/órdenes con estado y monto total
- **DetalleDocumento**: Items de cada compra
- **DireccionDespacho**: Direcciones de envío de usuarios

### Características

- **JSONB**: Uso de campos JSONB para metadata flexible
- **Índices GIN**: Optimización de consultas JSONB
- **UUID**: Identificadores únicos universales
- **Timestamps**: Fechas de creación y actualización automáticas

## 🐛 Troubleshooting

### Puerto ocupado
```bash
# Cambiar puertos en docker-compose.yml o vite.config.ts
```

### Error de conexión a base de datos
```bash
# Verificar que el servicio de BD esté corriendo
docker-compose ps

# Ver logs de la BD
docker-compose logs db

# Verificar variables de entorno
docker-compose config
```

### Frontend no conecta al backend
```bash
# Verificar que VITE_API_BASE esté configurado correctamente
# En frontend/.env.local:
VITE_API_BASE=http://localhost:8000

# Verificar CORS en backend/main.py
```

### Problemas con migraciones
```bash
# Recrear base de datos
docker-compose down -v
docker-compose up --build
```

## 🚀 Desarrollo Futuro

- [ ] Integración con API del Banco Central para conversión de monedas
- [ ] Sistema de roles y permisos
- [ ] Recomendaciones de productos basadas en historial
- [ ] Integración con pasarelas de pago reales
- [ ] Sistema de reseñas y calificaciones
- [ ] Notificaciones por email
- [ ] Dashboard de administración
- [ ] Sistema de cupones más avanzado
- [ ] Búsqueda avanzada con filtros múltiples
- [ ] Wishlist compartida

## 📚 Documentación Adicional

- **Backend README**: Ver `backend/ReadMe.md` para documentación detallada de la API
- **Swagger UI**: http://localhost:8000/docs (cuando el backend esté corriendo)
- **ReDoc**: http://localhost:8000/redoc (documentación alternativa)

## 📄 Licencia

Este proyecto fue desarrollado para fines educativos como parte del Taller 1 de Desarrollo Web y Móvil - UNAB.

---

**Desarrollado para el Taller 1 de Desarrollo Web y Móvil - Universidad Nacional Andrés Bello (UNAB)**
