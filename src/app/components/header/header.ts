import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CarritoService } from '../../services/carrito';
import { FavoritosService } from '../../services/favoritos';
import { FiltrosService } from '../../services/filtros';

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent implements OnInit {
  totalCarrito = 0;
  totalFavoritos = 0;
  busqueda = '';

  constructor(
    private carritoService: CarritoService,
    private favoritosService: FavoritosService,
    private filtrosService: FiltrosService
  ) {}

  ngOnInit() {
    this.actualizarContadores();
    
    // Suscribirse a cambios en el carrito
    this.carritoService.getCarrito();
    this.totalCarrito = this.carritoService.getTotalItems();
    this.totalFavoritos = this.favoritosService.getTotalFavoritos();
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
