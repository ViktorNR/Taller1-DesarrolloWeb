import { Injectable } from '@angular/core';
import { Producto } from './productos';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carrito: Producto[] = [];
  private storageAvailable = typeof window !== 'undefined' && !!window.localStorage;

  constructor() {
    // Cargar desde localStorage solo si está disponible (evita error SSR)
    if (this.storageAvailable) {
      const data = localStorage.getItem('carrito');
      this.carrito = data ? JSON.parse(data) : [];
    }
  }

  private guardarCarrito() {
    if (this.storageAvailable) {
      localStorage.setItem('carrito', JSON.stringify(this.carrito));
    }
  }

  getCarrito(): Producto[] {
    return this.carrito;
  }

  agregarProducto(producto: Producto) {
    this.carrito.push(producto);
    this.guardarCarrito();
  }

  eliminarProducto(producto: Producto) {
    this.carrito = this.carrito.filter(p => p.id !== producto.id);
    this.guardarCarrito();
  }

  vaciarCarrito() {
    this.carrito = [];
    this.guardarCarrito();
  }
}
