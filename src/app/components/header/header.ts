import { Component, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CarritoService } from '../../services/carrito';
import { FavoritosService } from '../../services/favoritos';
import { FiltrosService } from '../../services/filtros';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  totalCarrito = 0;
  totalFavoritos = 0;
  private subs: Subscription[] = [];
  busqueda = '';

  constructor(
    private carritoService: CarritoService,
    private favoritosService: FavoritosService,
    private filtrosService: FiltrosService
  ) {}

  ngOnInit() {
    this.actualizarContadores();

    // Suscribirse a cambios reactivos
    this.subs.push(this.carritoService.totalItems$.subscribe(n => this.totalCarrito = n));
    this.subs.push(this.favoritosService.totalFavoritos$.subscribe(n => this.totalFavoritos = n));
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  actualizarContadores() {
    this.totalCarrito = this.carritoService.getTotalItems();
    this.totalFavoritos = this.favoritosService.getTotalFavoritos();
  }

  onBusquedaChange(termino: string) {
    this.filtrosService.actualizarFiltros({ busqueda: termino });
  }

  onBusquedaMovilChange(termino: string) {
    this.busqueda = termino;
    this.filtrosService.actualizarFiltros({ busqueda: termino });
  }
}
