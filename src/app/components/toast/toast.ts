import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, timer } from 'rxjs';
import { NotificacionService, Notificacion } from '../../services/notificacion';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrls: ['./toast.css']
})
export class ToastComponent implements OnInit, OnDestroy {
  mensaje = '';
  tipo: 'success' | 'error' | 'info' = 'info';
  visible = false;

  private sub?: Subscription;
  private timeoutSub?: Subscription;

  constructor(private notif: NotificacionService) {}

  ngOnInit(): void {
    this.sub = this.notif.obtener().subscribe((n: Notificacion) => {
      this.mensaje = n.mensaje;
      this.tipo = n.tipo || 'info';
      // Reiniciar la animación: ocultar y mostrar en microtask
      this.timeoutSub?.unsubscribe();
      this.visible = false;
      // next tick: mostrar
      Promise.resolve().then(() => {
        this.visible = true;
        this.timeoutSub = timer(2200).subscribe(() => (this.visible = false));
      });
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.timeoutSub?.unsubscribe();
  }
}
