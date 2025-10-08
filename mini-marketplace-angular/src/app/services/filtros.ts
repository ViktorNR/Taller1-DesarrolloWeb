import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface FiltrosState {
  busqueda: string;
  categoria: string;
  precio: string;
  rating: string;
  orden: string;
}

@Injectable({
  providedIn: 'root'
})
export class FiltrosService {
  private filtrosSubject = new BehaviorSubject<FiltrosState>({
    busqueda: '',
    categoria: '',
    precio: '',
    rating: '',
    orden: ''
  });

  filtros$ = this.filtrosSubject.asObservable();

  constructor() {}

  actualizarFiltros(filtros: Partial<FiltrosState>) {
    const filtrosActuales = this.filtrosSubject.value;
    this.filtrosSubject.next({ ...filtrosActuales, ...filtros });
  }

  limpiarFiltros() {
    this.filtrosSubject.next({
      busqueda: '',
      categoria: '',
      precio: '',
      rating: '',
      orden: ''
    });
  }

  getFiltrosActuales(): FiltrosState {
    return this.filtrosSubject.value;
  }
}
