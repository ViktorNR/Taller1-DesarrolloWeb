import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosService, Producto } from '../../services/productos';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detalle-producto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalle-producto.html',
  styleUrl: './detalle-producto.css'
})
export class DetalleProductoModalComponent implements OnChanges {
  @Input() productoId: number | null = null;
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() agregarCarrito = new EventEmitter<Producto>();

  producto: Producto | null = null;
  loading = false;
  error = false;
  imagenActual = 0;
  cantidad = 1;

  constructor(private productosService: ProductosService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['productoId'] && this.productoId && this.isOpen) {
      this.cargarProducto(this.productoId);
    }
    
    if (changes['isOpen'] && !this.isOpen) {
      this.resetModal();
    }
  }

  cargarProducto(id: number) {
    this.loading = true;
    this.error = false;
    
    this.productosService.getProductoPorId(id).subscribe({
      next: (producto) => {
        this.producto = producto;
        this.loading = false;
        this.imagenActual = 0;
        this.cantidad = 1;
      },
      error: (error) => {
        console.error('Error al cargar producto:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  cerrar() {
    this.closeModal.emit();
  }

  cambiarImagen(index: number) {
    this.imagenActual = index;
  }

  incrementarCantidad() {
    if (this.producto && this.cantidad < this.producto.stock) {
      this.cantidad++;
    }
  }

  decrementarCantidad() {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }

  agregarAlCarrito() {
    if (this.producto) {
      // Emitir el producto con la cantidad seleccionada
      const productoConCantidad = { ...this.producto, cantidadSeleccionada: this.cantidad };
      this.agregarCarrito.emit(productoConCantidad);
      this.cerrar();
    }
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

  private resetModal() {
    this.producto = null;
    this.imagenActual = 0;
    this.cantidad = 1;
    this.error = false;
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.cerrar();
    }
  }
}