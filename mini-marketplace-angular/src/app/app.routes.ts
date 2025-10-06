import { Routes } from '@angular/router';
import { CatalogoComponent } from './components/catalogo/catalogo';
import { Carrito } from './components/carrito/carrito';
import { DetalleProducto } from './components/detalle-producto/detalle-producto';

export const routes: Routes = [
  { path: '', redirectTo: 'catalogo', pathMatch: 'full' },
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'carrito', component: Carrito },
  { path: 'detalle-producto/:id', component: DetalleProducto }
];
