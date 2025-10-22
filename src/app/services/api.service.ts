import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// Interfaces para DummyJSON API
export interface DummyProduct {
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

export interface DummyProductsResponse {
  products: DummyProduct[];
  total: number;
  skip: number;
  limit: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los productos de la API
   */
  getProducts(): Observable<DummyProductsResponse> {
    console.log('🔍 ApiService: Obteniendo productos desde:', `${this.apiUrl}/products`);
    return this.http.get<DummyProductsResponse>(`${this.apiUrl}/products`)
      .pipe(
        map(response => {
          console.log('✅ ApiService: Productos recibidos:', response.products.length, 'productos');
          return response;
        }),
        catchError(error => {
          console.error('❌ ApiService: Error al obtener productos:', error);
          return of({
            products: [],
            total: 0,
            skip: 0,
            limit: 0
          });
        })
      );
  }

  /**
   * Obtiene un producto específico por ID
   */
  getProductById(id: number): Observable<DummyProduct | null> {
    console.log('🔍 ApiService: Obteniendo producto ID:', id);
    return this.http.get<DummyProduct>(`${this.apiUrl}/products/${id}`)
      .pipe(
        map(product => {
          console.log('✅ ApiService: Producto recibido:', product.title);
          return product;
        }),
        catchError(error => {
          console.error('❌ ApiService: Error al obtener producto:', error);
          return of(null);
        })
      );
  }

  /**
   * Busca productos por término de búsqueda
   */
  searchProducts(query: string): Observable<DummyProductsResponse> {
    if (!query.trim()) {
      return this.getProducts();
    }

    console.log('🔍 ApiService: Buscando productos con término:', query);
    return this.http.get<DummyProductsResponse>(`${this.apiUrl}/products/search?q=${encodeURIComponent(query)}`)
      .pipe(
        map(response => {
          console.log('✅ ApiService: Búsqueda completada:', response.products.length, 'resultados');
          return response;
        }),
        catchError(error => {
          console.error('❌ ApiService: Error en búsqueda:', error);
          return of({
            products: [],
            total: 0,
            skip: 0,
            limit: 0
          });
        })
      );
  }

  /**
   * Obtiene productos por categoría
   */
  getProductsByCategory(category: string): Observable<DummyProductsResponse> {
    console.log('🔍 ApiService: Obteniendo productos de categoría:', category);
    return this.http.get<DummyProductsResponse>(`${this.apiUrl}/products/category/${encodeURIComponent(category)}`)
      .pipe(
        map(response => {
          console.log('✅ ApiService: Productos de categoría recibidos:', response.products.length, 'productos');
          return response;
        }),
        catchError(error => {
          console.error('❌ ApiService: Error al obtener productos por categoría:', error);
          return of({
            products: [],
            total: 0,
            skip: 0,
            limit: 0
          });
        })
      );
  }

  /**
   * Obtiene todas las categorías disponibles
   */
  getCategories(): Observable<string[]> {
    console.log('🔍 ApiService: Obteniendo categorías');
    return this.http.get<string[]>(`${this.apiUrl}/products/categories`)
      .pipe(
        map(categories => {
          console.log('✅ ApiService: Categorías recibidas:', categories.length, 'categorías');
          return categories;
        }),
        catchError(error => {
          console.error('❌ ApiService: Error al obtener categorías:', error);
          return of([]);
        })
      );
  }

  /**
   * Obtiene productos con paginación
   */
  getProductsPaginated(skip: number = 0, limit: number = 30): Observable<DummyProductsResponse> {
    console.log('🔍 ApiService: Obteniendo productos paginados (skip:', skip, ', limit:', limit, ')');
    return this.http.get<DummyProductsResponse>(`${this.apiUrl}/products?skip=${skip}&limit=${limit}`)
      .pipe(
        map(response => {
          console.log('✅ ApiService: Productos paginados recibidos:', response.products.length, 'productos');
          return response;
        }),
        catchError(error => {
          console.error('❌ ApiService: Error al obtener productos paginados:', error);
          return of({
            products: [],
            total: 0,
            skip: 0,
            limit: 0
          });
        })
      );
  }
}
