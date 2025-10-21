import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

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

// DummyJSON API response interfaces
interface DummyProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface DummyProductsResponse {
  products: DummyProduct[];
  total: number;
  skip: number;
  limit: number;
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
  private apiUrl = environment.apiUrl;
  private productosUrl = `${this.apiUrl}/products`;
  private categoriasUrl = 'assets/data/categorias.json'; // Keep local for now
  private enviosUrl = 'assets/data/envios.json'; // Keep local for now
  private promosUrl = 'assets/data/promos.json'; // Keep local for now

  constructor(private http: HttpClient) {}

  // Transform DummyJSON product to our Producto interface
  private transformDummyProduct(dummyProduct: DummyProduct): Producto {
    return {
      id: dummyProduct.id,
      nombre: dummyProduct.title,
      descripcion: dummyProduct.description,
      precio: dummyProduct.price,
      stock: dummyProduct.stock,
      rating: dummyProduct.rating,
      imagenes: dummyProduct.images || [dummyProduct.thumbnail],
      categoria: dummyProduct.category,
      caracteristicas: [
        `Marca: ${dummyProduct.brand}`,
        `Descuento: ${dummyProduct.discountPercentage}%`,
        `Categoría: ${dummyProduct.category}`
      ]
    };
  }

  getProductos(): Observable<Producto[]> {
    console.log('🔍 ProductosService: Iniciando carga de productos desde:', this.productosUrl);
    return this.http.get<DummyProductsResponse>(this.productosUrl)
      .pipe(
        map(response => {
          console.log('✅ ProductosService: Respuesta recibida:', response);
          const productos = response.products.map(product => this.transformDummyProduct(product));
          console.log('🔄 ProductosService: Productos transformados:', productos.length, 'productos');
          return productos;
        }),
        catchError(error => {
          console.error('❌ ProductosService: Error al cargar productos:', error);
          return of([]);
        })
      );
  }

  getProductoPorId(id: number): Observable<Producto | null> {
    return this.http.get<DummyProduct>(`${this.productosUrl}/${id}`)
      .pipe(
        map(product => this.transformDummyProduct(product)),
        catchError(error => {
          console.error('Error al cargar producto:', error);
          return of(null);
        })
      );
  }

  getCategorias(): Observable<Categoria[]> {
    // Get categories from DummyJSON API
    return this.http.get<string[]>(`${this.apiUrl}/products/categories`)
      .pipe(
        map(categories => categories.map((category, index) => ({
          id: index + 1,
          nombre: category,
          descripcion: `Productos de la categoría ${category}`,
          icono: 'fas fa-tag',
          color: '#007bff'
        }))),
        catchError(error => {
          console.error('Error al cargar categorías:', error);
          // Fallback to local categories
          return this.http.get<Categoria[]>(this.categoriasUrl)
            .pipe(
              catchError(() => of([]))
            );
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
    if (!termino.trim()) {
      return this.getProductos();
    }
    
    return this.http.get<DummyProductsResponse>(`${this.productosUrl}/search?q=${encodeURIComponent(termino)}`)
      .pipe(
        map(response => response.products.map(product => this.transformDummyProduct(product))),
        catchError(error => {
          console.error('Error al buscar productos:', error);
          return of([]);
        })
      );
  }

  getProductosPorCategoria(categoria: string): Observable<Producto[]> {
    return this.http.get<DummyProductsResponse>(`${this.productosUrl}/category/${encodeURIComponent(categoria)}`)
      .pipe(
        map(response => response.products.map(product => this.transformDummyProduct(product))),
        catchError(error => {
          console.error('Error al cargar productos por categoría:', error);
          return of([]);
        })
      );
  }

  filtrarProductos(filtros: any): Observable<Producto[]> {
    // If we have a category filter, use the API endpoint for better performance
    if (filtros.categoria && !filtros.busqueda && !filtros.precio && !filtros.rating && !filtros.orden) {
      return this.getProductosPorCategoria(filtros.categoria);
    }

    // Otherwise, get all products and filter client-side
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
