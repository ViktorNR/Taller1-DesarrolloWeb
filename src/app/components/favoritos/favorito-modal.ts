import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Producto } from '../../services/productos';

@Component({
	selector: 'app-favorito-modal',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './favorito-modal.html',
	styleUrls: ['./favorito-modal.css']
})
export class FavoritoModalComponent {
	@Input() producto: Producto | null = null;
	@Input() isOpen: boolean = false;
	@Output() close = new EventEmitter<void>();

	cerrar() {
		this.close.emit();
	}

	formatearPrecio(precio: number): string {
		return precio.toLocaleString('es-CL');
	}
}
