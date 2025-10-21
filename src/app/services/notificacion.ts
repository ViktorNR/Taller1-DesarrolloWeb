import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export type Notificacion = {
  mensaje: string;
  tipo?: 'success' | 'error' | 'info';
};

@Injectable({ providedIn: 'root' })
export class NotificacionService {
  private subject = new Subject<Notificacion>();

  mostrar(mensaje: string, tipo: 'success' | 'error' | 'info' = 'info') {
    this.subject.next({ mensaje, tipo });
  }

  obtener(): Observable<Notificacion> {
    return this.subject.asObservable();
  }
}
