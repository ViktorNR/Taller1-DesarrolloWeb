import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  rating: number;
  imagenes: string[];
  categoria: string;
  caracteristicas: string[];
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  icono: string;
  color: string;
}

export interface OpcionEnvio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  tiempo: string;
  icono: string;
}

export interface Cupon {
  codigo: string;
  descripcion: string;
  descuento: number;
  tipo: 'porcentaje' | 'fijo' | 'envio';
  minimo: number;
  maximo: number;
  activo: boolean;
  fechaExpiracion: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private productosUrl = 'assets/data/productos.json';
  private categoriasUrl = 'assets/data/categorias.json';
  private enviosUrl = 'assets/data/envios.json';
  private promosUrl = 'assets/data/promos.json';

  constructor(private http: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.productosUrl)
      .pipe(
        catchError(error => {
          console.error('Error al cargar productos:', error);
          return of([]);
        })
      );
  }

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.categoriasUrl)
      .pipe(
        catchError(error => {
          console.error('Error al cargar categorías:', error);
          return of([]);
        })
      );
  }

  getOpcionesEnvio(): Observable<OpcionEnvio[]> {
    return this.http.get<OpcionEnvio[]>(this.enviosUrl)
      .pipe(
        catchError(error => {
          console.error('Error al cargar opciones de envío:', error);
          return of([]);
        })
      );
  }

  getCupones(): Observable<Cupon[]> {
    return this.http.get<Cupon[]>(this.promosUrl)
      .pipe(
        catchError(error => {
          console.error('Error al cargar cupones:', error);
          return of([]);
        })
      );
  }

  buscarProductos(termino: string): Observable<Producto[]> {
    return this.getProductos().pipe(
      map(productos => 
        productos.filter(producto => 
          producto.nombre.toLowerCase().includes(termino.toLowerCase()) ||
          producto.descripcion.toLowerCase().includes(termino.toLowerCase()) ||
          producto.categoria.toLowerCase().includes(termino.toLowerCase())
        )
      )
    );
  }

  filtrarProductos(filtros: any): Observable<Producto[]> {
    return this.getProductos().pipe(
      map(productos => {
        let productosFiltrados = [...productos];

        // Filtro por búsqueda
        if (filtros.busqueda) {
          const busqueda = filtros.busqueda.toLowerCase();
          productosFiltrados = productosFiltrados.filter(p => 
            p.nombre.toLowerCase().includes(busqueda) ||
            p.descripcion.toLowerCase().includes(busqueda) ||
            p.categoria.toLowerCase().includes(busqueda)
          );
        }

        // Filtro por categoría
        if (filtros.categoria) {
          productosFiltrados = productosFiltrados.filter(p => p.categoria === filtros.categoria);
        }

        // Filtro por precio
        if (filtros.precio) {
          if (filtros.precio.includes('+')) {
            const min = parseInt(filtros.precio.replace('+', ''), 10);
            productosFiltrados = productosFiltrados.filter(p => p.precio >= min);
          } else {
            const [min, max] = filtros.precio.split('-').map(Number);
            productosFiltrados = productosFiltrados.filter(p => p.precio >= min && p.precio <= max);
          }
        }

        // Filtro por rating
        if (filtros.rating) {
          const ratingMin = Number(filtros.rating);
          productosFiltrados = productosFiltrados.filter(p => p.rating >= ratingMin);
        }

        // Ordenamiento
        if (filtros.orden) {
          switch (filtros.orden) {
            case 'precio-asc':
              productosFiltrados.sort((a, b) => a.precio - b.precio);
              break;
            case 'precio-desc':
              productosFiltrados.sort((a, b) => b.precio - a.precio);
              break;
            case 'rating-desc':
              productosFiltrados.sort((a, b) => b.rating - a.rating);
              break;
            case 'nombre-asc':
              productosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
              break;
          }
        }

        return productosFiltrados;
      })
    );
  }
}
