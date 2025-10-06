import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosService, Producto } from '../../services/productos';

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

  constructor(private productosService: ProductosService) {}

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
}
