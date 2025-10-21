import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Producto } from '../../services/productos';

@Component({
  selector: 'app-favorito-eliminado-modal',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './favorito-eliminado-modal.html',
  styleUrls: ['./favorito-eliminado-modal.css']
})
export class FavoritoEliminadoModalComponent {
  @Input() producto: Producto | null = null;
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() undo = new EventEmitter<number>();

  cerrar() {
    this.close.emit();
  }

  deshacer() {
    if (this.producto) {
      this.undo.emit(this.producto.id);
    }
  }

  formatearPrecio(precio: number): string {
    return precio.toLocaleString('es-CL');
  }
}
