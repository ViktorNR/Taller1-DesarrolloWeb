import { Injectable } from '@angular/core';
import { Producto } from './productos';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  private favoritos: number[] = [];
  private storageAvailable = typeof window !== 'undefined' && !!window.localStorage;

  constructor() {
    // Cargar desde localStorage solo si está disponible (evita error SSR)
    if (this.storageAvailable) {
      const data = localStorage.getItem('favoritos');
      this.favoritos = data ? JSON.parse(data) : [];
    }
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
      return true; // Agregado
    } else {
      this.favoritos.splice(index, 1);
      this.guardarFavoritos();
      return false; // Removido
    }
  }

  agregarFavorito(productoId: number) {
    if (!this.esFavorito(productoId)) {
      this.favoritos.push(productoId);
      this.guardarFavoritos();
    }
  }

  removerFavorito(productoId: number) {
    const index = this.favoritos.indexOf(productoId);
    if (index > -1) {
      this.favoritos.splice(index, 1);
      this.guardarFavoritos();
    }
  }

  vaciarFavoritos() {
    this.favoritos = [];
    this.guardarFavoritos();
  }

  getTotalFavoritos(): number {
    return this.favoritos.length;
  }
}
