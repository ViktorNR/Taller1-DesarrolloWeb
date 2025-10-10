import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductosService, Producto } from '../../services/productos';

@Component({
  selector: 'app-detalle-producto',
  imports: [CommonModule],
  templateUrl: './detalle-producto.html',
  styleUrl: './detalle-producto.css'
})
export class DetalleProducto implements OnInit {
  producto: Producto | null = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private productosService: ProductosService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.cargarProducto(id);
      }
    });
  }

  cargarProducto(id: number) {
    this.loading = true;
    this.error = false;
    
    this.productosService.getProductoPorId(id).subscribe({
      next: (producto) => {
        this.producto = producto;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar producto:', error);
        this.error = true;
        this.loading = false;
      }
    });
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
