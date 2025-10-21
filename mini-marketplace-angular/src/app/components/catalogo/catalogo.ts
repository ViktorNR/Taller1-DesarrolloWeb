import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosService, Producto } from '../../services/productos';
import { CarritoService } from '../../services/carrito';
import { FavoritosService } from '../../services/favoritos';
import { FiltrosService, FiltrosState } from '../../services/filtros';
import { ModalFavoritosComponent } from '../modal-favoritos/modal-favoritos';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-catalogo',
  imports: [CommonModule, FormsModule, ModalFavoritosComponent],
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
  
  // Modal de favoritos
  modalFavoritosAbierto = false;
  productoModalFavoritos: Producto | null = null;
  accionFavorito: 'agregar' | 'remover' = 'agregar';

  constructor(
    private productosService: ProductosService,
    private carritoService: CarritoService,
    private favoritosService: FavoritosService,
    private filtrosService: FiltrosService
  ) {}

  ngOnInit() {
    console.log('🚀 CatalogoComponent: Inicializando componente');
    this.productosService.getProductos().subscribe({
      next: (data) => {
        console.log('✅ CatalogoComponent: Productos recibidos:', data.length, 'productos');
        this.productos = data;
        this.productosFiltrados = data;
        this.loading = false;
        console.log('📊 CatalogoComponent: Estado actual - loading:', this.loading, 'productosFiltrados:', this.productosFiltrados.length);
      },
      error: (error) => {
        console.error('❌ CatalogoComponent: Error al obtener los productos', error);
        this.loading = false;
      }
    });

    // Suscribirse a cambios en los filtros
    this.filtrosService.filtros$.subscribe(filtros => {
      console.log('🔍 CatalogoComponent: Filtros actualizados:', filtros);
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
    const agregado = this.favoritosService.toggleFavorito(producto.id);
    
    // Mostrar modal con el producto y la acción realizada
    this.productoModalFavoritos = producto;
    this.accionFavorito = agregado ? 'agregar' : 'remover';
    this.modalFavoritosAbierto = true;
  }
  
  cerrarModalFavoritos() {
    this.modalFavoritosAbierto = false;
    setTimeout(() => {
      this.productoModalFavoritos = null;
    }, 300); // Esperar a que termine la animación
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
