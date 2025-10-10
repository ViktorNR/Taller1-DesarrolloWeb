import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FavoritosService } from '../../services/favoritos';
import { ProductosService, Producto } from '../../services/productos';
import { CarritoService } from '../../services/carrito';

@Component({
  selector: 'app-favoritos',
  imports: [CommonModule, FormsModule],
  templateUrl: './favoritos.html',
  styleUrl: './favoritos.css'
})
export class FavoritosComponent implements OnInit {
  favoritos: Producto[] = [];
  loading = true;

  constructor(
    private favoritosService: FavoritosService,
    private productosService: ProductosService,
    private carritoService: CarritoService
  ) {}

  ngOnInit() {
    this.cargarFavoritos();
  }

  cargarFavoritos() {
    this.productosService.getProductos().subscribe({
      next: (productos) => {
        const favoritosIds = this.favoritosService.getFavoritos();
        this.favoritos = productos.filter(producto => favoritosIds.includes(producto.id));
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar favoritos', error);
        this.loading = false;
      }
    });
  }

  removerFavorito(producto: Producto) {
    this.favoritosService.removerFavorito(producto.id);
    this.cargarFavoritos();
  }

  agregarAlCarrito(producto: Producto) {
    this.carritoService.agregarProducto(producto);
  }

  formatearPrecio(precio: number): string {
    return precio.toLocaleString('es-CL');
  }

  generarEstrellas(rating: number): string {
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
}
