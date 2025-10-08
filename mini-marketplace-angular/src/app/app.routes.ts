import { Routes } from '@angular/router';
import { CatalogoComponent } from './components/catalogo/catalogo';
import { CarritoComponent } from './components/carrito/carrito';
import { FavoritosComponent } from './components/favoritos/favoritos';
import { CheckoutComponent } from './components/checkout/checkout';

export const routes: Routes = [
  { path: '', redirectTo: 'catalogo', pathMatch: 'full' },
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'favoritos', component: FavoritosComponent },
  { path: 'checkout', component: CheckoutComponent }
];
