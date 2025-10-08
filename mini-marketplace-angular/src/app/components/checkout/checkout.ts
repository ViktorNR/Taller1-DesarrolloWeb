import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoService, ItemCarrito } from '../../services/carrito';
import { CheckoutService, CheckoutState } from '../../services/checkout';
import { ProductosService, OpcionEnvio, Cupon } from '../../services/productos';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class CheckoutComponent implements OnInit {
  carrito: ItemCarrito[] = [];
  opcionesEnvio: OpcionEnvio[] = [];
  cupones: Cupon[] = [];
  checkoutState: CheckoutState = {
    opcionEnvio: null,
    cuponAplicado: null,
    datosPersonales: {
      nombre: '',
      email: '',
      rut: '',
      telefono: ''
    },
    direccion: {
      direccion: '',
      comuna: '',
      ciudad: '',
      codigoPostal: ''
    }
  };
  codigoCupon = '';
  cuponValido = false;

  constructor(
    private carritoService: CarritoService,
    private checkoutService: CheckoutService,
    private productosService: ProductosService
  ) {}

  ngOnInit() {
    this.carrito = this.carritoService.getCarrito();
    this.cargarOpcionesEnvio();
    this.cargarCupones();
    this.checkoutService.checkout$.subscribe(state => {
      this.checkoutState = state;
    });
  }

  cargarOpcionesEnvio() {
    this.productosService.getOpcionesEnvio().subscribe(opciones => {
      this.opcionesEnvio = opciones;
    });
  }

  cargarCupones() {
    this.productosService.getCupones().subscribe(cupones => {
      this.cupones = cupones;
    });
  }

  seleccionarEnvio(opcion: OpcionEnvio) {
    this.checkoutService.seleccionarEnvio(opcion);
  }

  aplicarCupon() {
    const cupon = this.cupones.find(c => c.codigo === this.codigoCupon);
    if (cupon && cupon.activo) {
      this.checkoutService.aplicarCupon(cupon);
      this.cuponValido = true;
    } else {
      this.cuponValido = false;
    }
  }

  removerCupon() {
    this.checkoutService.removerCupon();
    this.codigoCupon = '';
    this.cuponValido = false;
  }

  actualizarDatosPersonales(campo: string, valor: string) {
    this.checkoutService.actualizarDatosPersonales({ [campo]: valor });
  }

  actualizarDireccion(campo: string, valor: string) {
    this.checkoutService.actualizarDireccion({ [campo]: valor });
  }

  formatearPrecio(precio: number): string {
    return precio.toLocaleString('es-CL');
  }

  getTotalPrecio(): number {
    return this.carritoService.getTotalPrecio();
  }

  getTotalConEnvio(): number {
    let total = this.getTotalPrecio();
    if (this.checkoutState.opcionEnvio) {
      total += this.checkoutState.opcionEnvio.precio;
    }
    if (this.checkoutState.cuponAplicado) {
      if (this.checkoutState.cuponAplicado.tipo === 'porcentaje') {
        total -= (total * this.checkoutState.cuponAplicado.descuento) / 100;
      } else if (this.checkoutState.cuponAplicado.tipo === 'fijo') {
        total -= this.checkoutState.cuponAplicado.descuento;
      }
    }
    return Math.max(0, total);
  }

  validarRut(rut: string): boolean {
    return this.checkoutService.validarRutChileno(rut);
  }

  confirmarCompra() {
    // Aquí se implementaría la lógica de confirmación de compra
    console.log('Compra confirmada', this.checkoutState);
    alert('¡Compra confirmada! Gracias por tu compra.');
  }
}
