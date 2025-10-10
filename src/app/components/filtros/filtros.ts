import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FiltrosService, FiltrosState } from '../../services/filtros';
import { ProductosService, Categoria } from '../../services/productos';

@Component({
  selector: 'app-filtros',
  imports: [CommonModule, FormsModule],
  templateUrl: './filtros.html',
  styleUrl: './filtros.css'
})
export class FiltrosComponent implements OnInit {
  categorias: Categoria[] = [];
  filtros: FiltrosState = {
    busqueda: '',
    categoria: '',
    precio: '',
    rating: '',
    orden: ''
  };
  mostrarFiltros = true;

  constructor(
    private filtrosService: FiltrosService,
    private productosService: ProductosService
  ) {}

  ngOnInit() {
    this.productosService.getCategorias().subscribe(categorias => {
      this.categorias = categorias;
    });

    this.filtrosService.filtros$.subscribe(filtros => {
      this.filtros = filtros;
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

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }
}
