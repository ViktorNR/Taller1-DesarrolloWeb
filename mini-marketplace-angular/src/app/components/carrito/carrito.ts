import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito';
import { Producto } from '../../services/productos';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css'
})

export class CarritoComponent {
  carrito: Producto[] = [];

  constructor(private carritoService: CarritoService) {}

  ngOnInit() {
    this.carrito = this.carritoService.getCarrito();
  }

  eliminar(id: number) {
    this.carritoService.eliminarProducto(this.carrito.find(p => p.id === id)!);
    this.carrito = this.carritoService.getCarrito();
  }

  vaciar() {
    this.carritoService.vaciarCarrito();
    this.carrito = [];
  }
}
