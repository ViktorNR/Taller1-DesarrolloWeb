# Mini-Marketplace Universitario

Un prototipo frontend-only de un marketplace tipo Amazon construido con tecnologías web estándar (HTML5, CSS3, JavaScript vanilla) y Bootstrap 5.

## 🚀 Características

- **Catálogo de productos** con búsqueda, filtros y ordenamiento
- **Vista rápida** de productos en modal con galería de imágenes
- **Sistema de carrito** con gestión de cantidades y persistencia
- **Lista de favoritos** con funcionalidad de mover al carrito
- **Checkout completo** con validaciones y cupones de descuento
- **Diseño responsivo** optimizado para móviles y desktop
- **Persistencia local** usando localStorage
- **UI moderna** con Bootstrap 5 y Font Awesome

## 🛠️ Stack Técnico

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Framework CSS**: Bootstrap 5.3.0
- **Iconos**: Font Awesome 6.0.0
- **Datos**: Archivos JSON estáticos
- **Persistencia**: localStorage del navegador
- **Servidor**: Apache (XAMPP/WAMP/LAMP)

## 📁 Estructura del Proyecto

```
/
├── index.html              # Página principal
├── styles.css              # Estilos personalizados
├── app.js                  # Lógica de la aplicación
├── data/                   # Datos de ejemplo
│   ├── productos.json      # Catálogo de productos
│   ├── categorias.json     # Categorías disponibles
│   ├── envios.json         # Opciones de envío
│   └── promos.json         # Cupones de descuento
├── README.md               # Este archivo
└── LICENSE                 # Licencia del proyecto
```

## 🚀 Instalación y Ejecución

### Requisitos Previos

- **XAMPP** (recomendado), WAMP, LAMP o cualquier servidor Apache
- Navegador web moderno (Chrome, Firefox, Safari, Edge)

### Pasos de Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   git clone <url-del-repositorio>
   cd Taller1-DesarrolloWeb
   ```

2. **Configurar servidor Apache**
   - Instalar XAMPP desde [https://www.apachefriends.org/](https://www.apachefriends.org/)
   - Copiar la carpeta del proyecto a `htdocs/` (XAMPP) o `www/` (WAMP)
   - Iniciar Apache desde el panel de control

3. **Acceder a la aplicación**
   - Abrir el navegador
   - Navegar a: `http://localhost/Taller1-DesarrolloWeb/`
   - La aplicación debería cargar automáticamente

### Alternativa: Servidor Python (desarrollo)

Si prefieres no usar Apache, puedes usar Python:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Luego acceder a: `http://localhost:8000`

## 🎯 Funcionalidades Principales

### 1. Catálogo de Productos
- **Búsqueda en tiempo real** por nombre, descripción o categoría
- **Filtros avanzados**: categoría, rango de precio, rating mínimo
- **Ordenamiento**: por precio, rating o nombre
- **Vista responsiva** con cards de productos

### 2. Vista Rápida
- **Modal detallado** con galería de imágenes
- **Información completa** del producto
- **Control de cantidad** antes de agregar al carrito
- **Acciones directas**: agregar al carrito o favoritos

### 3. Sistema de Carrito
- **Gestión de cantidades** con botones +/- 
- **Cálculo automático** de totales
- **Persistencia** entre sesiones
- **Vaciar carrito** con confirmación

### 4. Lista de Favoritos
- **Agregar/quitar** productos fácilmente
- **Mover al carrito** desde favoritos
- **Persistencia automática** en localStorage
- **Contador visual** en el header

### 5. Checkout Completo
- **Formulario de datos** con validaciones HTML5
- **Opciones de envío** con precios
- **Sistema de cupones** con validaciones
- **Resumen de compra** dinámico
- **Confirmación** con número de orden

## 💾 Datos de Ejemplo

El proyecto incluye datos de ejemplo en formato JSON:

- **10 productos** de diferentes categorías
- **9 categorías** principales
- **4 opciones de envío** con precios
- **5 cupones** de descuento válidos

### Cupones Disponibles para Pruebas

- `ESTUDIANTE20` - 20% descuento (mínimo $50.000)
- `PRIMERACOMPRA` - 15% descuento (mínimo $30.000)
- `TECNOLOGIA10` - 10% descuento en tecnología (mínimo $100.000)
- `ENVIOGRATIS` - Envío gratis (mínimo $100.000)
- `FLASH5000` - $5.000 descuento fijo (mínimo $25.000)

## 🔧 Personalización

### Agregar Nuevos Productos

Edita `data/productos.json` siguiendo la estructura:

```json
{
  "id": 11,
  "nombre": "Nuevo Producto",
  "descripcion": "Descripción del producto",
  "precio": 100000,
  "categoria": "Tecnología",
  "stock": 10,
  "rating": 4.5,
  "imagenes": ["url1", "url2"],
  "caracteristicas": ["caract1", "caract2"]
}
```

### Modificar Categorías

Edita `data/categorias.json` para cambiar o agregar categorías.

### Ajustar Estilos

Modifica `styles.css` para personalizar colores, fuentes y layout.

## 🧪 Pruebas

### Flujo de Usuario Típico

1. **Explorar catálogo** - Usar filtros y búsqueda
2. **Ver producto** - Hacer clic en "Vista Rápida"
3. **Agregar al carrito** - Seleccionar cantidad y confirmar
4. **Gestionar carrito** - Modificar cantidades o eliminar
5. **Proceso de compra** - Completar checkout con cupón
6. **Confirmación** - Ver número de orden

### Casos de Prueba

- ✅ **Búsqueda y filtros** funcionando correctamente
- ✅ **Vista rápida** con galería de imágenes
- ✅ **Carrito** con persistencia y cálculos
- ✅ **Favoritos** con sincronización
- ✅ **Checkout** con validaciones
- ✅ **Cupones** aplicándose correctamente
- ✅ **Responsive** en diferentes tamaños de pantalla

## 🐛 Solución de Problemas

### Error: "No se pueden cargar los datos"

- Verificar que Apache esté ejecutándose
- Confirmar que los archivos JSON estén en la carpeta `data/`
- Revisar la consola del navegador para errores específicos

### Problemas de CORS

- Usar servidor Apache (no abrir directamente el archivo HTML)
- Verificar que la URL sea `http://localhost/...` no `file://`

### Carrito no persiste

- Verificar que localStorage esté habilitado en el navegador
- Revisar la consola para errores de JavaScript

## 📱 Responsive Design

La aplicación está optimizada para:

- **Desktop**: Pantallas grandes con layout de 4 columnas
- **Tablet**: Layout de 2-3 columnas
- **Móvil**: Layout de 1 columna con navegación colapsable

## 🔒 Seguridad

- **Validación de formularios** en frontend y backend simulado
- **Sanitización de datos** para prevenir XSS
- **Validación de cupones** con reglas de negocio
- **Manejo de errores** robusto

## 📈 Performance

- **Lazy loading** de imágenes
- **Debouncing** en búsqueda en tiempo real
- **Optimización de re-renders** del DOM
- **Persistencia eficiente** en localStorage

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

Desarrollado como parte del Taller 1 de Desarrollo Web y Móvil.

## 📞 Soporte

Para reportar bugs o solicitar features, por favor crear un issue en el repositorio.

---

**¡Disfruta explorando el Mini-Marketplace Universitario! 🎉**