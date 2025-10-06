import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Producto {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
}

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://dummyjson.com/products';

  getProductos(): Observable<Producto[]> {
    return this.http
      .get<{ products: Producto[] }>(this.apiUrl)
      .pipe(map((response) => response.products));
  }
}


