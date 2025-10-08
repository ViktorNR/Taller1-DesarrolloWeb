import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OpcionEnvio, Cupon } from './productos';

export interface CheckoutState {
  opcionEnvio: OpcionEnvio | null;
  cuponAplicado: Cupon | null;
  datosPersonales: {
    nombre: string;
    email: string;
    rut: string;
    telefono: string;
  };
  direccion: {
    direccion: string;
    comuna: string;
    ciudad: string;
    codigoPostal: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private checkoutSubject = new BehaviorSubject<CheckoutState>({
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
  });

  checkout$ = this.checkoutSubject.asObservable();

  constructor() {}

  actualizarDatosPersonales(datos: Partial<CheckoutState['datosPersonales']>) {
    const estadoActual = this.checkoutSubject.value;
    this.checkoutSubject.next({
      ...estadoActual,
      datosPersonales: { ...estadoActual.datosPersonales, ...datos }
    });
  }

  actualizarDireccion(direccion: Partial<CheckoutState['direccion']>) {
    const estadoActual = this.checkoutSubject.value;
    this.checkoutSubject.next({
      ...estadoActual,
      direccion: { ...estadoActual.direccion, ...direccion }
    });
  }

  seleccionarEnvio(opcionEnvio: OpcionEnvio) {
    const estadoActual = this.checkoutSubject.value;
    this.checkoutSubject.next({
      ...estadoActual,
      opcionEnvio
    });
  }

  aplicarCupon(cupon: Cupon) {
    const estadoActual = this.checkoutSubject.value;
    this.checkoutSubject.next({
      ...estadoActual,
      cuponAplicado: cupon
    });
  }

  removerCupon() {
    const estadoActual = this.checkoutSubject.value;
    this.checkoutSubject.next({
      ...estadoActual,
      cuponAplicado: null
    });
  }

  limpiarCheckout() {
    this.checkoutSubject.next({
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
    });
  }

  getEstadoActual(): CheckoutState {
    return this.checkoutSubject.value;
  }

  validarRutChileno(rut: string): boolean {
    // Elimina puntos y guión
    rut = rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();

    // Extrae cuerpo y dígito verificador
    const cuerpo = rut.slice(0, -1);
    let dv = rut.slice(-1);

    if (!/^\d+$/.test(cuerpo)) return false;

    let suma = 0;
    let multiplo = 2;

    // Recorre el RUT de derecha a izquierda
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i]) * multiplo;
      multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }

    const dvEsperado = 11 - (suma % 11);
    let dvCalculado = dvEsperado === 11 ? "0" : dvEsperado === 10 ? "K" : dvEsperado.toString();

    return dv === dvCalculado;
  }
}
