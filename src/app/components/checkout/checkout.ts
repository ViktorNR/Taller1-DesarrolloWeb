import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CarritoService, ItemCarrito } from '../../services/carrito';
import { CheckoutService, CheckoutState } from '../../services/checkout';
import { ProductosService, OpcionEnvio, Cupon } from '../../services/productos';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class CheckoutComponent implements OnInit {

  erroresValidacion: { [key: string]: string } = {};

    validarCampo(campo: string): void {
    const datosPersonales = this.checkoutState.datosPersonales as any;
    const valor = datosPersonales[campo];
    
    // Clear previous error
    delete this.erroresValidacion[campo];
    
    switch(campo) {
      case 'nombre':
        if (!valor || valor.trim().length < 3) {
          this.erroresValidacion[campo] = 'El nombre debe tener al menos 3 caracteres';
        }
        break;
        
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!valor || !emailRegex.test(valor)) {
          this.erroresValidacion[campo] = 'El email no es válido';
        }
        break;
        
      case 'rut':
        if (!this.validarRUT(valor)) {
          this.erroresValidacion[campo] = 'El RUT no es válido';
        }
        break;
        
      case 'telefono':
        const telRegex = /^(\+?56)?[2-9]\d{8}$/;
        if (!valor || !telRegex.test(valor.replace(/\s/g, ''))) {
          this.erroresValidacion[campo] = 'El teléfono no es válido (ej: +56912345678)';
        }
        break;
    }
  }

  @Input() isOpen = false;
  @Input() productos: ItemCarrito[] = [];
  @Input() total = 0;
  @Output() closeModal = new EventEmitter<void>();
  @Output() confirmar = new EventEmitter<CheckoutState>();

  

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

  cerrar() {
    this.closeModal.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.cerrar();
    }
  }

  
formularioValido(): boolean {
  const datos = this.checkoutState.datosPersonales;
  const dir = this.checkoutState.direccion;
  
  // Validar campos requeridos
  if (!datos.nombre?.trim() || datos.nombre.length < 3) return false;
  if (!datos.email?.trim() || !this.validarEmail(datos.email)) return false;
  if (!datos.rut?.trim() || !this.validarRUT(datos.rut)) return false;
  if (!datos.telefono?.trim() || !this.validarTelefono(datos.telefono)) return false;
  if (!dir.direccion?.trim()) return false;
  
  return true;
}

private validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

private validarTelefono(telefono: string): boolean {
  const regex = /^(\+?56)?[2-9]\d{8}$/;
  return regex.test(telefono.replace(/\s/g, ''));
}

private validarRUT(rut: string): boolean {
  if (!rut) return false;
  
  const cleanRut = rut.replace(/\./g, '').replace(/-/g, '').trim();
  if (cleanRut.length < 2) return false;
  
  const body = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1).toUpperCase();
  
  // Validate body is numeric
  if (!/^\d+$/.test(body)) return false;
  
  let sum = 0;
  let multiplier = 2;
  
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body.charAt(i)) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  const expectedDv = 11 - (sum % 11);
  const calculatedDv = expectedDv === 11 ? '0' : expectedDv === 10 ? 'K' : expectedDv.toString();
  
  return dv === calculatedDv;
}
}
