# 🩺 Diagnóstico Técnico – Mini Marketplace Angular

**Fecha de auditoría:** 6 de octubre de 2025  
**Versión de Angular:** 20.3.3  
**Framework:** Angular con SSR (Server-Side Rendering)  
**Estado del proyecto:** ⚠️ Requiere correcciones

---

## 📋 Resumen Ejecutivo

El proyecto `mini-marketplace-angular` presenta **7 errores críticos** y **5 advertencias** que deben ser corregidos antes de considerarse production-ready. La mayoría de los errores están relacionados con:

- ❌ **Tests con imports incorrectos** (11 errores)
- ⚠️ **Componentes importados innecesariamente** (4 warnings)
- ⚠️ **Bundle size excedido** (1 warning)
- ⚠️ **Dependencias duplicadas** (Bootstrap cargado dos veces)
- ⚠️ **Inconsistencias en la estructura de componentes**

---

## 1. ❌ Errores Críticos Detectados

### 1.1 Errores en Archivos de Pruebas (Tests)

**Impacto:** 🔴 Alto - Impide la ejecución de `ng test`

Todos los archivos `.spec.ts` tienen imports incorrectos. Los nombres de las clases no coinciden con los nombres exportados.

#### Archivos afectados:

| Archivo | Error | Nombre Correcto |
|---------|-------|-----------------|
| `src/app/components/carrito/carrito.spec.ts` | `import { Carrito }` | `CarritoComponent` |
| `src/app/components/catalogo/catalogo.spec.ts` | `import { Catalogo }` | `CatalogoComponent` |
| `src/app/components/checkout/checkout.spec.ts` | `import { Checkout }` | `CheckoutComponent` |
| `src/app/components/favoritos/favoritos.spec.ts` | `import { Favoritos }` | `FavoritosComponent` |
| `src/app/components/filtros/filtros.spec.ts` | `import { Filtros }` | `FiltrosComponent` |
| `src/app/components/footer/footer.spec.ts` | `import { Footer }` | `FooterComponent` |
| `src/app/components/header/header.spec.ts` | `import { Header }` | `HeaderComponent` |
| `src/app/services/carrito.spec.ts` | `import { Carrito }` | `CarritoService` |
| `src/app/services/checkout.spec.ts` | `import { Checkout }` | `CheckoutService` |
| `src/app/services/favoritos.spec.ts` | `import { Favoritos }` | `FavoritosService` |
| `src/app/services/filtros.spec.ts` | `import { Filtros }` | `FiltrosService` |
| `src/app/services/productos.spec.ts` | `import { Productos }` | `ProductosService` |

**Error en consola:**
```
X [ERROR] TS2305: Module '"./carrito"' has no exported member 'Carrito'.
```

#### Solución sugerida:

**Para componentes:**
```typescript
// ❌ Incorrecto
import { Carrito } from './carrito';

// ✅ Correcto
import { CarritoComponent } from './carrito';
```

**Para servicios:**
```typescript
// ❌ Incorrecto
import { Carrito } from './carrito';

// ✅ Correcto
import { CarritoService } from './carrito';
```

---

### 1.2 Test de App.ts Desactualizado

**Archivo:** `src/app/app.spec.ts`  
**Línea:** 21

```typescript
expect(compiled.querySelector('h1')?.textContent).toContain('Hello, mini-marketplace-angular');
```

**Problema:** El test espera un `<h1>` con texto que no existe en el template actual.

**Solución:** Actualizar o eliminar este test según el contenido real de `app.html`.

---

## 2. ⚠️ Advertencias de Compilación

### 2.1 Componentes No Utilizados en Template

**Impacto:** 🟡 Medio - Advertencias de compilación pero no afecta funcionalidad

Angular advierte que los siguientes componentes están importados en `app.ts` pero no se usan directamente en el template:

```
▲ [WARNING] NG8113: CatalogoComponent is not used within the template of App
▲ [WARNING] NG8113: CarritoComponent is not used within the template of App
▲ [WARNING] NG8113: FavoritosComponent is not used within the template of App
▲ [WARNING] NG8113: CheckoutComponent is not used within the template of App
```

**Causa:** Los componentes están importados en el array `imports` de `app.ts` líneas 18-21, pero se utilizan a través del `<router-outlet>`, no directamente en el template.

#### Solución recomendada:

**Opción 1: Remover imports innecesarios** ⭐ (Recomendado para Angular 20+)

En `src/app/app.ts`, eliminar las líneas 5-8 y 18-21:

```typescript
// ❌ ELIMINAR estos imports
import { CatalogoComponent } from './components/catalogo/catalogo';
import { CarritoComponent } from './components/carrito/carrito';
import { FavoritosComponent } from './components/favoritos/favoritos';
import { CheckoutComponent } from './components/checkout/checkout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FiltrosComponent,
    // ❌ ELIMINAR estas líneas
    CatalogoComponent,
    CarritoComponent,
    FavoritosComponent,
    CheckoutComponent,
    FooterComponent
  ],
  // ...
})
```

Los componentes ya están registrados en `app.routes.ts` y se cargarán automáticamente.

**Opción 2: Implementar Lazy Loading** ⚡

Convertir las rutas en lazy-loaded para reducir el bundle inicial:

```typescript
// src/app/app.routes.ts
export const routes: Routes = [
  { path: '', redirectTo: 'catalogo', pathMatch: 'full' },
  { 
    path: 'catalogo', 
    loadComponent: () => import('./components/catalogo/catalogo')
      .then(m => m.CatalogoComponent) 
  },
  { 
    path: 'carrito', 
    loadComponent: () => import('./components/carrito/carrito')
      .then(m => m.CarritoComponent) 
  },
  { 
    path: 'favoritos', 
    loadComponent: () => import('./components/favoritos/favoritos')
      .then(m => m.FavoritosComponent) 
  },
  { 
    path: 'checkout', 
    loadComponent: () => import('./components/checkout/checkout')
      .then(m => m.CheckoutComponent) 
  }
];
```

---

### 2.2 Bundle Size Excedido

**Impacto:** 🟡 Medio - Afecta performance en producción

```
▲ [WARNING] bundle initial exceeded maximum budget. 
Budget 500.00 kB was not met by 291.50 kB with a total of 791.50 kB.
```

**Tamaño actual del bundle:**

| Archivo | Tamaño | Comprimido |
|---------|--------|------------|
| `styles.css` | 343.49 kB | 37.35 kB |
| `main.js` | 332.98 kB | 84.89 kB |
| `scripts.js` | 80.45 kB | 21.60 kB |
| `polyfills.js` | 34.59 kB | 11.33 kB |
| **Total** | **791.50 kB** | **155.18 kB** |

#### Causas principales:

1. **Bootstrap cargado dos veces:**
   - En `angular.json` líneas 32-33
   - En `index.html` líneas 9-10 (CDN)

2. **Font Awesome cargado desde CDN** (línea 11 de `index.html`) pero usado en componentes

3. **Sin Lazy Loading** de rutas

#### Soluciones recomendadas:

**1. Eliminar duplicación de Bootstrap:**

```html
<!-- src/index.html -->
<!-- ❌ ELIMINAR estas líneas -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
```

**2. Decidir sobre Font Awesome:**

- **Opción A:** Instalar como dependencia
  ```bash
  npm install @fortawesome/fontawesome-free
  ```
  Y agregar a `angular.json`:
  ```json
  "styles": [
    "node_modules/@fortawesome/fontawesome-free/css/all.min.css"
  ]
  ```

- **Opción B:** Eliminar uso de Font Awesome y usar solo Bootstrap Icons

**3. Implementar Lazy Loading** (ver sección 2.1 Opción 2)

**4. Ajustar presupuesto en `angular.json`:**

```json
"budgets": [
  {
    "type": "initial",
    "maximumWarning": "800kB",  // Ajustar temporalmente
    "maximumError": "1MB"
  }
]
```

---

## 3. 🏗️ Inconsistencias de Arquitectura

### 3.1 Inconsistencia en StyleUrl/StyleUrls

**Archivo:** `src/app/components/catalogo/catalogo.ts` línea 15

```typescript
// ❌ Incorrecto (usa array)
styleUrls: ['./catalogo.css']

// ✅ Correcto (usar singular para un solo archivo)
styleUrl: './catalogo.css'
```

**Nota:** Angular 17+ recomienda `styleUrl` (singular) cuando solo hay un archivo CSS.

---

### 3.2 Constructor Injection vs inject()

**Impacto:** 🔵 Bajo - Mejora de estilo de código

Los componentes y servicios usan `constructor injection` en lugar de la función `inject()` recomendada por Angular 17+.

#### Ejemplo actual:

```typescript
// src/app/components/header/header.ts
constructor(
  private carritoService: CarritoService,
  private favoritosService: FavoritosService,
  private filtrosService: FiltrosService
) {}
```

#### Recomendación:

```typescript
import { inject } from '@angular/core';

// Reemplazar constructor con:
private carritoService = inject(CarritoService);
private favoritosService = inject(FavoritosService);
private filtrosService = inject(FiltrosService);
```

**Beneficios:**
- Más conciso y legible
- Mejor tree-shaking
- Permite inyección fuera del constructor
- Recomendación oficial de Angular 17+

---

### 3.3 Uso de OnInit en Lugar de Signals

**Impacto:** 🔵 Bajo - Oportunidad de modernización

Varios componentes usan `OnInit` con suscripciones manuales que podrían beneficiarse de signals.

#### Ejemplo actual:

```typescript
// src/app/components/catalogo/catalogo.ts
ngOnInit() {
  this.filtrosService.filtros$.subscribe(filtros => {
    this.filtros = filtros;
    this.aplicarFiltros();
  });
}
```

#### Recomendación con Signals:

```typescript
import { toSignal } from '@angular/core/rxjs-interop';

filtros = toSignal(this.filtrosService.filtros$);

// O usar computed para derivar estado
productosFiltrados = computed(() => {
  const filtrosActuales = this.filtros();
  return this.productosService.filtrarProductos(filtrosActuales);
});
```

---

### 3.4 Componentes No Utilizados

**Archivos:** 
- `src/app/components/detalle-producto/`
- `src/app/components/vista-rapida/`

Estos componentes existen pero:
- No están registrados en rutas
- No se utilizan en ningún template
- Son componentes vacíos (solo tienen estructura básica)

#### Acción recomendada:

1. **Si se van a usar:** Implementar funcionalidad y agregar a rutas
2. **Si no se usan:** Eliminar directorios para mantener el código limpio

---

## 4. 🔒 Validación de SSR (Server-Side Rendering)

### ✅ Implementaciones Correctas

#### 4.1 Protección de localStorage

Los servicios `CarritoService` y `FavoritosService` implementan correctamente la verificación de SSR:

```typescript
// ✅ Correcto - src/app/services/carrito.ts línea 18
private storageAvailable = typeof window !== 'undefined' && !!window.localStorage;

constructor() {
  if (this.storageAvailable) {
    const data = localStorage.getItem('carrito');
    this.carrito = data ? JSON.parse(data) : [];
  }
}
```

#### 4.2 Configuración de HttpClient con withFetch()

```typescript
// ✅ Correcto - src/main.ts
provideHttpClient(withFetch())
```

#### 4.3 Configuración de SSR

Los archivos de configuración están correctamente estructurados:
- ✅ `src/main.server.ts` - Bootstrap del servidor
- ✅ `src/app/app.config.server.ts` - Configuración SSR
- ✅ `src/server.ts` - Express server
- ✅ `src/app/app.routes.server.ts` - Rutas del servidor

### ⚠️ Advertencias SSR

**No se detectaron referencias no protegidas a `window`, `document` o `localStorage`** en componentes, lo cual es correcto.

---

## 5. 📦 Análisis de Dependencias

### 5.1 Estado de Dependencias

Ejecutando `npm ls --depth=0`:

```
✅ Todas las dependencias instaladas correctamente
✅ No se detectaron conflictos de versiones
✅ Angular 20.3.3 (última versión estable)
```

### 5.2 Dependencias Duplicadas/Innecesarias

#### Bootstrap cargado dos veces:

**En `angular.json`:**
```json
"styles": [
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "node_modules/bootstrap-icons/font/bootstrap-icons.css"
]
```

**En `index.html`:**
```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
```

**Impacto:** 
- Aumento innecesario del bundle (≈200 kB)
- Posibles conflictos de estilos
- Tiempo de carga más lento

**Solución:** Eliminar las referencias en `index.html` y usar solo las de `angular.json`.

#### Font Awesome sin dependencia

`index.html` línea 11 carga Font Awesome desde CDN:
```html
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
```

Pero `catalogo.ts` líneas 110-119 usa iconos de Font Awesome:
```typescript
html += '<i class="fas fa-star"></i>';
html += '<i class="fas fa-star-half-alt"></i>';
html += '<i class="far fa-star"></i>';
```

**Problema:** Dependencia externa no gestionada por npm.

**Solución:** 
1. Instalar `@fortawesome/fontawesome-free`
2. O reemplazar con Bootstrap Icons (ya instalado)

---

## 6. 🎯 Configuración de TypeScript

### ✅ Configuraciones Correctas

El `tsconfig.json` tiene configuraciones estrictas apropiadas:

```json
{
  "strict": true,
  "noImplicitOverride": true,
  "noPropertyAccessFromIndexSignature": true,
  "noImplicitReturns": true,
  "noFallthroughCasesInSwitch": true,
  "strictTemplates": true
}
```

### ⚠️ Nota sobre `standalone: true`

Varios componentes tienen `standalone: true` explícitamente en sus decoradores:

```typescript
@Component({
  selector: 'app-carrito',
  standalone: true,  // ⚠️ No es necesario en Angular 20+
  // ...
})
```

**Recomendación:** En Angular 17+, `standalone: true` es el comportamiento por defecto. Según la documentación de Cursor Rules, **NO se debe establecer explícitamente**.

Eliminar esta línea de todos los componentes:
- `src/app/components/carrito/carrito.ts`
- `src/app/components/catalogo/catalogo.ts`
- `src/app/components/checkout/checkout.ts`
- `src/app/components/favoritos/favoritos.ts`
- `src/app/components/filtros/filtros.ts`
- `src/app/components/header/header.ts`
- `src/app/components/footer/footer.ts`
- `src/app/app.ts`

---

## 7. 📊 Estructura de Archivos

### ✅ Estructura Correcta

```
src/
├── app/
│   ├── components/          ✅ Componentes organizados
│   ├── services/            ✅ Servicios organizados
│   ├── app.ts               ✅ Componente raíz
│   ├── app.config.ts        ✅ Configuración de app
│   └── app.routes.ts        ✅ Rutas definidas
├── assets/
│   └── data/                ✅ Archivos JSON
├── main.ts                  ✅ Bootstrap de aplicación
├── main.server.ts           ✅ Bootstrap de servidor
└── server.ts                ✅ Express server
```

### ⚠️ Archivos Innecesarios

Los siguientes archivos spec están desactualizados pero deben ser corregidos, no eliminados:
- `src/app/components/**/*.spec.ts` (12 archivos)
- `src/app/services/**/*.spec.ts` (5 archivos)

---

## 8. 📝 Checklist de Correcciones

### 🔴 Alta Prioridad (Bloquean funcionalidad)

- [ ] **Corregir imports en todos los archivos .spec.ts** (12 archivos de componentes + 5 archivos de servicios)
  - Cambiar `Carrito` → `CarritoComponent`
  - Cambiar `Carrito` → `CarritoService` (en services)
  - Aplicar patrón similar a todos
  
- [ ] **Actualizar test de app.spec.ts** (línea 21)
  - Eliminar o corregir el test del `<h1>`

### 🟡 Media Prioridad (Advertencias de compilación)

- [ ] **Eliminar componentes del import de app.ts**
  - Remover `CatalogoComponent`, `CarritoComponent`, `FavoritosComponent`, `CheckoutComponent` del array `imports`
  
- [ ] **Resolver duplicación de Bootstrap**
  - Eliminar líneas 9-10 y 15 de `src/index.html`
  
- [ ] **Decidir sobre Font Awesome**
  - Instalar como dependencia npm
  - O reemplazar con Bootstrap Icons
  
- [ ] **Corregir styleUrls → styleUrl** en `catalogo.ts`

### 🔵 Baja Prioridad (Mejoras de código)

- [ ] **Eliminar `standalone: true` explícito** de todos los componentes
  
- [ ] **Implementar lazy loading** para rutas principales
  
- [ ] **Refactorizar a usar `inject()` en lugar de constructor injection**
  
- [ ] **Evaluar uso de signals** en lugar de observables para estado local
  
- [ ] **Decidir qué hacer con componentes no utilizados:**
  - `detalle-producto`
  - `vista-rapida`

### 🎨 Optimizaciones Opcionales

- [ ] **Implementar ChangeDetectionStrategy.OnPush** en componentes
  
- [ ] **Convertir observables a signals** donde sea apropiado
  
- [ ] **Implementar `computed()` para estado derivado**
  
- [ ] **Ajustar budget en angular.json** según necesidad real

---

## 9. 🚀 Recomendaciones Finales

### Pasos Inmediatos

1. **Ejecutar correcciones de alta prioridad** para desbloquear tests
2. **Eliminar duplicación de Bootstrap** para reducir bundle size
3. **Implementar lazy loading** para mejorar tiempo de carga inicial

### Mejores Prácticas Angular 20+

1. **Usar signals en lugar de observables** cuando sea posible
2. **Preferir `inject()` sobre constructor injection**
3. **No declarar `standalone: true` explícitamente**
4. **Implementar lazy loading** para todas las rutas de feature
5. **Usar `styleUrl` (singular)** en lugar de `styleUrls`

### Performance

- **Bundle actual:** 791.50 kB (sin comprimir) / 155.18 kB (comprimido)
- **Meta recomendada:** < 500 kB (sin comprimir)
- **Reducción estimada con lazy loading:** ≈300 kB

### Testing

Una vez corregidos los imports, ejecutar:

```bash
ng test --watch=false --browsers=ChromeHeadless
```

Para verificar que todos los tests pasen.

---

## 10. 📚 Recursos y Referencias

### Documentación Oficial

- [Angular Standalone Components](https://angular.dev/guide/components/importing)
- [Angular Signals](https://angular.dev/guide/signals)
- [Angular SSR](https://angular.dev/guide/ssr)
- [Lazy Loading](https://angular.dev/guide/routing/lazy-loading)

### Guías Específicas

- [Testing Angular Components](https://angular.dev/guide/testing/components-basics)
- [Bundle Size Optimization](https://angular.dev/guide/performance/bundle-size-budgets)
- [inject() API](https://angular.dev/api/core/inject)

---

## ✅ Resultado Esperado

Una vez aplicadas las correcciones de **alta y media prioridad**, el proyecto debería:

- ✅ Compilar sin errores ni warnings
- ✅ Pasar todos los tests unitarios
- ✅ Reducir bundle size en ≈250-300 kB
- ✅ Mejorar tiempo de carga inicial
- ✅ Cumplir con mejores prácticas de Angular 20+

---

**Fin del diagnóstico técnico**

*Generado automáticamente por el auditor técnico de Angular*

