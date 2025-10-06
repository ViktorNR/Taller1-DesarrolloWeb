import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Producto {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  rating: number;
  thumbnail: string;
  brand: string;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrl = 'https://dummyjson.com/products';

  constructor(private http: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    return this.http.get<{products: Producto[]}>(this.apiUrl).pipe(
      map(data => data.products)
    );
  }
}
