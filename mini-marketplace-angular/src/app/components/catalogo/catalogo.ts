import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosService, Producto } from '../../services/productos';
import { CarritoService } from '../../services/carrito';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalogo.html',
  styleUrls: ['./catalogo.css']
})

export class CatalogoComponent implements OnInit {
  productos: Producto[] = [];
  loading = true;

  constructor(
    private productosService: ProductosService,
    private carritoService: CarritoService
  ) {}

  ngOnInit(){
      this.productosService.getProductos().subscribe({
        next: (data) => {
          this.productos = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al obtener los productos', error);
          this.loading = false;
        }
      });
  }

  agregarAlCarrito(producto: Producto) {
    this.carritoService.agregarProducto(producto);
  }
}
