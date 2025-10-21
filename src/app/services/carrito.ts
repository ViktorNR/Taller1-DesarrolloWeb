import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto } from './productos';

export interface ItemCarrito {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  cantidad: number;
  stock: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carrito: ItemCarrito[] = [];
  private storageAvailable = typeof window !== 'undefined' && !!window.localStorage;
  private totalItemsSubject = new BehaviorSubject<number>(0);
  public totalItems$ = this.totalItemsSubject.asObservable();

  constructor() {
    // Cargar desde localStorage solo si está disponible (evita error SSR)
    if (this.storageAvailable) {
      const data = localStorage.getItem('carrito');
      this.carrito = data ? JSON.parse(data) : [];
    }
    // Inicializar contador reactivo
    this.totalItemsSubject.next(this.getTotalItems());
  }

  private guardarCarrito() {
    if (this.storageAvailable) {
      localStorage.setItem('carrito', JSON.stringify(this.carrito));
    }
    // Emitir nuevo total de items
    this.totalItemsSubject.next(this.getTotalItems());
  }

  getCarrito(): ItemCarrito[] {
    return this.carrito;
  }

  agregarProducto(producto: Producto, cantidad: number = 1) {
    const itemExistente = this.carrito.find(item => item.id === producto.id);
    
    if (itemExistente) {
      if (itemExistente.cantidad + cantidad <= itemExistente.stock) {
        itemExistente.cantidad += cantidad;
      } else {
        console.warn(`No hay suficiente stock para añadir ${cantidad} unidades de ${producto.nombre}.`);
        return false;
      }

    } else {
      if (cantidad < producto.stock) {
      this.carrito.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagenes[0],
        cantidad: cantidad,
        stock: producto.stock
      });
      } else {
        console.warn(`No hay suficiente stock para añadir ${cantidad} unidades de ${producto.nombre}.`);
        return false;
      }
    }
    
    this.guardarCarrito();
    return true;
  }

  eliminarProducto(producto: Producto) {
    const index = this.carrito.findIndex(p => p.id === producto.id);
    if (index > -1) {
      this.carrito.splice(index, 1);
      this.guardarCarrito();
    }
  }

  actualizarCantidad(productoId: number, cantidad: number) {
    const item = this.carrito.find(item => item.id === productoId);
    if (item) {
      if (cantidad <= 0) {
        this.eliminarProducto({ id: productoId } as Producto);
      } else if (cantidad <= item.stock) {
        item.cantidad = cantidad;
        this.guardarCarrito();
      }
    }
  }

  vaciarCarrito() {
    this.carrito = [];
    this.guardarCarrito();
  }

  getTotalItems(): number {
    return this.carrito.reduce((sum, item) => sum + item.cantidad, 0);
  }

  getTotalPrecio(): number {
    return this.carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  }
}
