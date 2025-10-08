import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosService, Producto } from '../../services/productos';
import { CarritoService } from '../../services/carrito';
import { FavoritosService } from '../../services/favoritos';
import { FiltrosService, FiltrosState } from '../../services/filtros';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-catalogo',
  imports: [CommonModule, FormsModule],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css'
})
export class CatalogoComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  loading = true;
  filtros: FiltrosState = {
    busqueda: '',
    categoria: '',
    precio: '',
    rating: '',
    orden: ''
  };

  constructor(
    private productosService: ProductosService,
    private carritoService: CarritoService,
    private favoritosService: FavoritosService,
    private filtrosService: FiltrosService
  ) {}

  ngOnInit() {
    this.productosService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.productosFiltrados = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al obtener los productos', error);
        this.loading = false;
      }
    });

    // Suscribirse a cambios en los filtros
    this.filtrosService.filtros$.subscribe(filtros => {
      this.filtros = filtros;
      this.aplicarFiltros();
    });
  }

  aplicarFiltros() {
    this.productosService.filtrarProductos(this.filtros).subscribe(productos => {
      this.productosFiltrados = productos;
    });
  }

  onBusquedaChange(termino: string) {
    this.filtrosService.actualizarFiltros({ busqueda: termino });
  }

  onCategoriaChange(categoria: string) {
    this.filtrosService.actualizarFiltros({ categoria });
  }

  onPrecioChange(precio: string) {
    this.filtrosService.actualizarFiltros({ precio });
  }

  onRatingChange(rating: string) {
    this.filtrosService.actualizarFiltros({ rating });
  }

  onOrdenChange(orden: string) {
    this.filtrosService.actualizarFiltros({ orden });
  }

  limpiarFiltros() {
    this.filtrosService.limpiarFiltros();
  }

  agregarAlCarrito(producto: Producto) {
    this.carritoService.agregarProducto(producto);
  }

  toggleFavorito(producto: Producto) {
    this.favoritosService.toggleFavorito(producto.id);
  }

  esFavorito(productoId: number): boolean {
    return this.favoritosService.esFavorito(productoId);
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

  abrirVistaRapida(productoId: number) {
    // Por ahora solo mostramos un alert, en una implementación completa se abriría un modal
    const producto = this.productos.find(p => p.id === productoId);
    if (producto) {
      alert(`Vista rápida de: ${producto.nombre}\nPrecio: $${this.formatearPrecio(producto.precio)}`);
    }
  }
}
