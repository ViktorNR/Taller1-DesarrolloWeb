# 🎓 Mini-Marketplace UNAB - Universidad Andrés Bello

Un marketplace universitario completo construido con tecnologías web estándar (HTML5, CSS3, JavaScript ES6+) y Bootstrap 5, aplicando la identidad visual institucional de la Universidad Andrés Bello. Este proyecto proporciona una experiencia de compra moderna y fluida para productos y servicios universitarios.

## 🌟 **Demostración en Vivo**

🔗 [Ver Demo del Proyecto](https://dwm.salazarcabello.cl)

## 🎨 **Identidad Visual UNAB**

El proyecto implementa fielmente la paleta de colores corporativa de la Universidad Andrés Bello:

- **Azul oscuro institucional**: `#002B5C` (navbar, elementos principales)
- **Rojo institucional**: `#C8102E` (botones CTA, elementos destacados)
- **Blanco**: `#FFFFFF` (fondos principales)
- **Gris claro**: `#F5F5F5` (fondos secundarios, bordes)

## 🚀 **Características Principales**

### 🛍️ **Experiencia de Compra**
- **Catálogo de productos** con búsqueda en tiempo real y filtros avanzados
- **Vista rápida** de productos en modal con galería de imágenes y zoom
- **Sistema de carrito** con gestión de cantidades y persistencia automática
- **Lista de favoritos** con sincronización entre carrito y wishlist
- **Checkout completo** con validaciones y sistema de cupones UNAB

### 💻 **Características Técnicas**
- **Estado global** con gestión eficiente de datos
- **Persistencia local** usando localStorage con respaldo
- **Validaciones robustas** en todos los formularios
- **Manejo de errores** con mensajes amigables
- **API RESTful** simulada con datos JSON estáticos
- **Optimización de rendimiento** con lazy loading

### 🎨 **Interfaz y Diseño**
- **Diseño responsivo** optimizado para todos los dispositivos
- **UI moderna** con Bootstrap 5 y Font Awesome 6
- **Identidad visual UNAB** completamente integrada
- **Animaciones suaves** y transiciones fluidas
- **Componentes reutilizables** con diseño modular

## 🛠️ **Stack Técnico**

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Framework CSS**: Bootstrap 5.3.0
- **Iconos**: Font Awesome 6.0.0
- **Fuente**: Open Sans (similar a la tipografía UNAB)
- **Datos**: Archivos JSON estáticos
- **Persistencia**: localStorage del navegador
- **Servidor**: Apache (XAMPP/WAMP/LAMP)

## 📁 **Estructura del Proyecto**

```
/
├── index.html                    # Página principal con header UNAB
├── styles.css                    # Estilos con identidad visual UNAB
├── app.js                        # Lógica de la aplicación
├── data/                         # Datos de ejemplo UNAB
│   ├── productos.json            # Catálogo de productos universitarios
│   ├── categorias.json           # Categorías UNAB
│   ├── envios.json               # Opciones de envío UNAB
│   └── promos.json               # Cupones de descuento UNAB
├── iconos/                       # Recursos visuales UNAB
│   ├── logo_unab.png             # Logo UNAB a color
│   ├── logo_unab_nocolor.png     # Logo UNAB monocromático
│   └── favicon-16x16.png         # Favicon del sitio
├── documentacion/                # Documentación del proyecto
│   ├── Caso-miniAmazon-1.pdf     # Caso de estudio original
│   └── Desarrollo_Web_y_Movil-3.pdf # Especificaciones técnicas
├── Mockups/                      # Diseños UI/UX del proyecto
│   ├── Carrito.png              # Diseño de la vista del carrito
│   ├── Catalogo.png             # Diseño de la vista del catálogo
│   ├── Checkout.png             # Diseño del proceso de pago
│   ├── Detalle_del_Producto.png # Diseño de la vista detallada
│   └── Favoritos.png            # Diseño de la lista de favoritos
├── APACHE_SETUP.md               # Guía de configuración de Apache
├── CHECKLIST_ACEPTACION.md       # Checklist de aceptación del proyecto
├── MOBILE_IMPROVEMENTS.md        # Guía de mejoras para móviles
├── Prompt.md                     # Prompts de desarrollo del proyecto
├── LICENSE                       # Licencia MIT
├── README.md                     # Este archivo
└── .gitignore                    # Archivos a ignorar en Git
```

## 🚀 **Instalación y Ejecución**

### **Requisitos Previos**

- **XAMPP** (recomendado), WAMP, LAMP o cualquier servidor Apache
- Navegador web moderno (Chrome, Firefox, Safari, Edge)

### **Pasos de Instalación**

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

### **Alternativa: Servidor Python (desarrollo)**

Si prefieres no usar Apache, puedes usar Python:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Luego acceder a: `http://localhost:8000`

## 🎯 **Funcionalidades Principales**

### **1. Catálogo de Productos UNAB**
- **Búsqueda en tiempo real** por nombre, descripción o categoría
- **Filtros avanzados**: categoría, rango de precio, rating mínimo
- **Ordenamiento**: por precio, rating o nombre
- **Vista responsiva** con cards de productos institucionales

### **2. Vista Rápida**
- **Modal detallado** con galería de imágenes
- **Información completa** del producto
- **Control de cantidad** antes de agregar al carrito
- **Acciones directas**: agregar al carrito o favoritos

### **3. Sistema de Carrito**
- **Gestión de cantidades** con botones +/- 
- **Cálculo automático** de totales
- **Persistencia** entre sesiones
- **Vaciar carrito** con confirmación

### **4. Lista de Favoritos**
- **Agregar/quitar** productos fácilmente
- **Mover al carrito** desde favoritos
- **Persistencia automática** en localStorage
- **Contador visual** en el header

### **5. Checkout Completo**
- **Formulario de datos** con validaciones HTML5
- **Opciones de envío UNAB** con precios
- **Sistema de cupones** con validaciones
- **Resumen de compra** dinámico
- **Confirmación** con número de orden UNAB

## 💾 **Gestión de Datos**

### 📊 **Estructura de Datos**
El proyecto utiliza un sistema robusto de gestión de datos con JSON:

```javascript
// Estado global de la aplicación
const AppState = {
    productos: [],      // Catálogo completo
    categorias: [],     // Categorías disponibles
    opcionesEnvio: [],  // Opciones de envío
    cupones: [],        // Cupones válidos
    carrito: [],        // Items en carrito
    favoritos: [],      // Lista de deseos
    filtros: {          // Estado de filtros
        busqueda: '',
        categoria: '',
        precio: '',
        rating: '',
        orden: ''
    }
};
```

### 📁 **Datos de Ejemplo UNAB**
El proyecto incluye datos de ejemplo institucionales en formato JSON:

- **10 productos** de diferentes categorías UNAB
- **9 categorías** principales universitarias
- **4 opciones de envío** con precios UNAB
- **5 cupones** de descuento válidos para estudiantes

### **Cupones Disponibles para Pruebas**

- `ESTUDIANTE20` - 20% descuento (mínimo $50.000)
- `PRIMERACOMPRA` - 15% descuento (mínimo $30.000)
- `TECNOLOGIA10` - 10% descuento en tecnología (mínimo $100.000)
- `ENVIOGRATIS` - Envío gratis (mínimo $100.000)
- `UNAB5000` - $5.000 descuento fijo (mínimo $25.000)

## 🎨 **Características de Diseño UNAB**

### **Header Institucional**
- **Barra superior azul oscuro** con enlaces de navegación UNAB
- **Logo institucional** con emblema y tipografía oficial
- **Botón ADMISIÓN** en rojo institucional
- **Navegación principal** con colores UNAB

### **Paleta de Colores**
- **Azul UNAB** (`#002B5C`): Headers, botones principales, enlaces
- **Rojo UNAB** (`#C8102E`): Botones CTA, elementos destacados
- **Blanco** (`#FFFFFF`): Fondos principales, texto sobre azul
- **Gris claro** (`#F5F5F5`): Fondos secundarios, bordes

### **Tipografía**
- **Open Sans** como fuente principal (similar a UNAB)
- **Jerarquía clara** con pesos 300, 400, 600, 700
- **Contraste optimizado** para accesibilidad

## 🔧 **Personalización**

### **Agregar Nuevos Productos**

Edita `data/productos.json` siguiendo la estructura:

```json
{
  "id": 11,
  "nombre": "Nuevo Producto UNAB",
  "descripcion": "Descripción del producto institucional",
  "precio": 100000,
  "categoria": "Tecnología",
  "stock": 10,
  "rating": 4.5,
  "imagenes": ["url1", "url2"],
  "caracteristicas": ["caract1", "caract2"]
}
```

### **Modificar Categorías**

Edita `data/categorias.json` para cambiar o agregar categorías UNAB.

### **Ajustar Estilos**

Modifica `styles.css` para personalizar colores, fuentes y layout manteniendo la identidad UNAB.

## 🧪 **Pruebas y Calidad**

### 🔄 **Flujo de Usuario Principal**

1. **Exploración del Catálogo**
   - Búsqueda en tiempo real
   - Filtros por categoría, precio y rating
   - Ordenamiento personalizado

2. **Interacción con Productos**
   - Vista rápida con galería
   - Información detallada
   - Reviews y ratings

3. **Gestión del Carrito**
   - Agregar/quitar productos
   - Actualizar cantidades
   - Guardar para después
   - Persistencia automática

4. **Lista de Favoritos**
   - Agregar desde catálogo/carrito
   - Sincronización bidireccional
   - Notificaciones de cambios

5. **Proceso de Checkout**
   - Validación de datos
   - Aplicación de cupones
   - Cálculo de envíos
   - Resumen detallado
   - Confirmación de orden

### ✅ **Casos de Prueba Verificados**

#### 🔍 Búsqueda y Filtros
- ✅ Búsqueda instantánea
- ✅ Filtros combinados
- ✅ Ordenamiento múltiple
- ✅ Reset de filtros

#### 🛒 Carrito y Favoritos
- ✅ Persistencia local
- ✅ Sincronización
- ✅ Cálculos precisos
- ✅ Gestión de stock

#### 📱 Responsividad
- ✅ Desktop (1200px+)
- ✅ Tablet (768px-1199px)
- ✅ Móvil (<768px)
- ✅ Orientación landscape

#### 🎨 UI/UX
- ✅ Identidad UNAB
- ✅ Accesibilidad
- ✅ Animaciones

## 🐛 **Solución de Problemas**

### **Error: "No se pueden cargar los datos"**

- Verificar que Apache esté ejecutándose
- Confirmar que los archivos JSON estén en la carpeta `data/`
- Revisar la consola del navegador para errores específicos

### **Problemas de CORS**

- Usar servidor Apache (no abrir directamente el archivo HTML)
- Verificar que la URL sea `http://localhost/...` no `file://`

### **Carrito no persiste**

- Verificar que localStorage esté habilitado en el navegador
- Revisar la consola para errores de JavaScript

## 📱 **Responsive Design**

La aplicación está optimizada para:

- **Desktop**: Pantallas grandes con layout de 4 columnas
- **Tablet**: Layout de 2-3 columnas
- **Móvil**: Layout de 1 columna con navegación colapsable

## 🔒 **Seguridad**

- **Validación de formularios** en frontend
- **Sanitización de datos** para prevenir XSS
- **Validación de cupones** con reglas de negocio UNAB
- **Manejo de errores** robusto

## 📈 **Performance**

- **Lazy loading** de imágenes
- **Debouncing** en búsqueda en tiempo real
- **Optimización de re-renders** del DOM
- **Persistencia eficiente** en localStorage

## 🤝 **Contribución**

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/UNABFeature`)
3. Commit tus cambios (`git commit -m 'Add UNAB Feature'`)
4. Push a la rama (`git push origin feature/UNABFeature`)
5. Abrir un Pull Request

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 **Autor**

Desarrollado como parte del Taller 1 de Desarrollo Web y Móvil, aplicando la identidad visual de la Universidad Andrés Bello.

## 📞 **Soporte**

Para reportar bugs o solicitar features, por favor crear un issue en el repositorio.

---

## 🎯 **Estado del Proyecto**

**✅ COMPLETADO Y LISTO PARA PRODUCCIÓN**

El Mini-Marketplace UNAB cumple con todos los requisitos solicitados:

- ✅ **Funcionalidades completas** del marketplace
- ✅ **Identidad visual UNAB** completamente implementada
- ✅ **Código limpio y seguro** siguiendo mejores prácticas
- ✅ **Diseño responsivo** para todos los dispositivos
- ✅ **Documentación completa** del proyecto
- ✅ **Datos de ejemplo** institucionales
- ✅ **Persistencia local** funcional
- ✅ **Validaciones y manejo de errores** robusto

**¡Disfruta explorando el Mini-Marketplace UNAB! 🎉**