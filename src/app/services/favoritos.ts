import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto } from './productos';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  private favoritos: number[] = [];
  private storageAvailable = typeof window !== 'undefined' && !!window.localStorage;
  private totalFavoritosSubject = new BehaviorSubject<number>(0);
  public totalFavoritos$ = this.totalFavoritosSubject.asObservable();

  constructor() {
    // Cargar desde localStorage solo si está disponible (evita error SSR)
    if (this.storageAvailable) {
      const data = localStorage.getItem('favoritos');
      this.favoritos = data ? JSON.parse(data) : [];
    }
    // Inicializar contador reactivo
    this.totalFavoritosSubject.next(this.getTotalFavoritos());
  }

  private guardarFavoritos() {
    if (this.storageAvailable) {
      localStorage.setItem('favoritos', JSON.stringify(this.favoritos));
    }
  }

  getFavoritos(): number[] {
    return this.favoritos;
  }

  esFavorito(productoId: number): boolean {
    return this.favoritos.includes(productoId);
  }

  toggleFavorito(productoId: number): boolean {
    const index = this.favoritos.indexOf(productoId);
    
    if (index === -1) {
      this.favoritos.push(productoId);
      this.guardarFavoritos();
      this.totalFavoritosSubject.next(this.getTotalFavoritos());
      return true; // Agregado
    } else {
      this.favoritos.splice(index, 1);
      this.guardarFavoritos();
      this.totalFavoritosSubject.next(this.getTotalFavoritos());
      return false; // Removido
    }
  }

  agregarFavorito(productoId: number) {
    if (!this.esFavorito(productoId)) {
      this.favoritos.push(productoId);
      this.guardarFavoritos();
      this.totalFavoritosSubject.next(this.getTotalFavoritos());
    }
  }

  removerFavorito(productoId: number) {
    const index = this.favoritos.indexOf(productoId);
    if (index > -1) {
      this.favoritos.splice(index, 1);
      this.guardarFavoritos();
      this.totalFavoritosSubject.next(this.getTotalFavoritos());
    }
  }

  vaciarFavoritos() {
    this.favoritos = [];
    this.guardarFavoritos();
    this.totalFavoritosSubject.next(this.getTotalFavoritos());
  }

  getTotalFavoritos(): number {
    return this.favoritos.length;
  }
}
