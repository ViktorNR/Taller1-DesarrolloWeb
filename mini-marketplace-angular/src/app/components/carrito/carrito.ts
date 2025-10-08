import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService, ItemCarrito } from '../../services/carrito';

@Component({
  selector: 'app-carrito',
  imports: [CommonModule],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css'
})
export class CarritoComponent implements OnInit {
  carrito: ItemCarrito[] = [];

  constructor(private carritoService: CarritoService) {}

  ngOnInit() {
    this.carrito = this.carritoService.getCarrito();
  }

  eliminar(id: number) {
    this.carritoService.eliminarProducto({ id } as any);
    this.carrito = this.carritoService.getCarrito();
  }

  vaciar() {
    this.carritoService.vaciarCarrito();
    this.carrito = [];
  }

  cambiarCantidad(id: number, delta: number) {
    const item = this.carrito.find(item => item.id === id);
    if (item) {
      const nuevaCantidad = item.cantidad + delta;
      this.carritoService.actualizarCantidad(id, nuevaCantidad);
      this.carrito = this.carritoService.getCarrito();
    }
  }

  formatearPrecio(precio: number): string {
    return precio.toLocaleString('es-CL');
  }

  getTotalPrecio(): number {
    return this.carritoService.getTotalPrecio();
  }
}
