import React, { useEffect, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { createDocumento, createDetalleDocumento, type DocumentoResponse } from '../../api/api';
const styles: { [key: string]: string } = {};

type CheckoutModalProps = {
  onClose: () => void;
};

type DatosPersonales = {
  nombre: string;
  rut: string;
  email: string;
  telefono: string;
};

type Direccion = {
  direccion?: string;
  codigoPostal?: string;
  comuna?: string;
  ciudad?: string;
};

type OpcionEnvio = {
  id: string | number;
  nombre: string;
  descripcion?: string;
  tiempo?: string;
  precio: number;
  icono?: string;
};



export default function CheckoutModal({ onClose }: CheckoutModalProps) {
  const { cart, removeFromCart } = useStore();
  const { user } = useAuth();
  const [datos, setDatos] = useState<DatosPersonales>({ nombre: '', rut: '', email: '', telefono: '' });
  const [direccion, setDireccion] = useState<Direccion>({});
  const [opcionesEnvio, setOpcionesEnvio] = useState<OpcionEnvio[]>([]);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<OpcionEnvio | null>(null);
  const [codigoCupon, setCodigoCupon] = useState('');
  const [cuponAplicado, setCuponAplicado] = useState<any>(null);
  const [successOrder, setSuccessOrder] = useState<{ numero: string; total: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/envios.json').then(r => r.json()).then((d: any[]) => setOpcionesEnvio(d)).catch(() => setOpcionesEnvio([]));
  }, []);

  const subtotal = cart.reduce((s, p) => s + (p.precio ?? 0) * (p.cantidad ?? 1), 0);

  function formatearPrecio(v: number) { return v.toLocaleString(); }

  function aplicarCupon() {
    // simple local logic: search promos.json
    fetch('/data/promos.json').then(r => r.json()).then((promos: any[]) => {
      const found = promos.find(px => px.codigo === codigoCupon.trim());
      if (found) {
        setCuponAplicado(found);
      } else {
        setCuponAplicado(null);
        alert('Cupón inválido');
      }
    }).catch(() => alert('Error validando cupón'));
  }

  function getTotalConEnvio() {
    const envio = opcionSeleccionada?.precio ?? 0;
    const descuento = cuponAplicado?.descuento ?? 0;
    return subtotal + envio - descuento;
  }


  async function confirmarCompra() {
    if (!user || cart.length === 0) {
      setError('Debes estar autenticado y tener items en el carrito');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Crear documento (orden) con estado "completado"
      const documento: DocumentoResponse = await createDocumento('completado');
      
      // Crear detalles para cada item del carrito
      const detallesPromises = cart.map(item =>
        createDetalleDocumento(
          documento.id,
          item.nombre,
          item.precio,
          item.cantidad
        )
      );

      await Promise.all(detallesPromises);

      // Mostrar éxito con el ID del documento
      const orden = {
        numero: documento.id.substring(0, 8).toUpperCase(), // Mostrar primeros 8 caracteres del UUID
        total: getTotalConEnvio()
      };
      setSuccessOrder(orden);

      // Limpiar carrito solo si todo fue exitoso
      cart.forEach(item => removeFromCart(item.id));
    } catch (err: any) {
      console.error('Error al confirmar compra:', err);
      const errorMessage = err?.response?.data?.detail || err?.message || 'Error al procesar la compra. Por favor, intenta nuevamente.';
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }

  const handleSuccessAndClose = () => {
    setSuccessOrder(null);
    onClose();
  }

  return (
    <div className={styles['modal-backdrop']} onClick={onClose}>
      <div className={styles['modal-container']} onClick={e => e.stopPropagation()}>
        <div className={styles['container']}>
      <h2 className="section-title">🛒 Finalizar Compra</h2>

      {!user && (
        <div className="alert alert-warning">
          Debes <Link to="/auth">iniciar sesión</Link> para poder completar la compra. La opción de pago está deshabilitada hasta que ingreses.
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          <i className="fas fa-exclamation-circle me-2" />
          {error}
          <button 
            type="button" 
            className="btn-close ms-2" 
            onClick={() => setError(null)}
            aria-label="Cerrar"
          />
        </div>
      )}

      <div className="row">
        <div className="col-lg-8">
          <div className="mb-5">
            <h4 className="checkout-section-title">Datos Personales</h4>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Nombre Completo <span className="text-danger">*</span></label>
                <input className={`form-control`} value={datos.nombre} onChange={e => setDatos(d => ({ ...d, nombre: e.target.value }))} />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">RUT <span className="text-danger">*</span></label>
                <input className={`form-control`} value={datos.rut} onChange={e => setDatos(d => ({ ...d, rut: e.target.value }))} placeholder="12.345.678-9" />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Email <span className="text-danger">*</span></label>
                <input type="email" className={`form-control`} value={datos.email} onChange={e => setDatos(d => ({ ...d, email: e.target.value }))} />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Teléfono <span className="text-danger">*</span></label>
                <input className={`form-control`} value={datos.telefono} onChange={e => setDatos(d => ({ ...d, telefono: e.target.value }))} />
              </div>
            </div>
          </div>

          <div className="mb-5">
            <h4 className="checkout-section-title">Dirección de Envío</h4>
            <div className="row">
              <div className="col-md-8 mb-3">
                <label className="form-label">Dirección</label>
                <input className="form-control" value={direccion.direccion ?? ''} onChange={e => setDireccion(d => ({ ...d, direccion: e.target.value }))} />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Código Postal</label>
                <input className="form-control" value={direccion.codigoPostal ?? ''} onChange={e => setDireccion(d => ({ ...d, codigoPostal: e.target.value }))} />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Comuna</label>
                <input className="form-control" value={direccion.comuna ?? ''} onChange={e => setDireccion(d => ({ ...d, comuna: e.target.value }))} />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Ciudad</label>
                <input className="form-control" value={direccion.ciudad ?? ''} onChange={e => setDireccion(d => ({ ...d, ciudad: e.target.value }))} />
              </div>
            </div>
          </div>

          <div className="mb-5">
            <h4 className="checkout-section-title">Opciones de Envío</h4>
            <div className="row">
              {opcionesEnvio.map(opcion => (
                <div className="col-md-6 mb-3" key={opcion.id}>
                  <div className={`opcion-envio ${opcionSeleccionada?.id === opcion.id ? 'seleccionada' : ''}`} onClick={() => setOpcionSeleccionada(opcion)} style={{ cursor: 'pointer' }}>
                    <div className="d-flex align-items-center">
                      <i className={`${opcion.icono} me-3`} />
                      <div>
                        <h6>{opcion.nombre}</h6>
                        <p className="mb-1">{opcion.descripcion}</p>
                        <small className="text-muted">{opcion.tiempo}</small>
                      </div>
                      <div className="ms-auto"><strong>${formatearPrecio(opcion.precio)}</strong></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <h4 className="checkout-section-title">Cupón de Descuento</h4>
            <div className="row">
              <div className="col-md-8"><input className="form-control" value={codigoCupon} onChange={e => setCodigoCupon(e.target.value)} placeholder="Ingresa tu código de cupón" /></div>
              <div className="col-md-4"><button className="btn btn-aplicar-cupon w-100" onClick={aplicarCupon}>Aplicar Cupón</button></div>
            </div>
            {cuponAplicado && (
              <div className="mt-3 alert alert-success d-flex justify-content-between align-items-center">
                <span><i className="fas fa-check-circle me-2" />Cupón aplicado: {cuponAplicado.descripcion}</span>
                <button className="btn btn-sm btn-outline-danger" onClick={() => setCuponAplicado(null)}><i className="fas fa-times" /></button>
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-4">
          <div className="resumen-card">
            <h5 className="mb-3">Resumen de Compra</h5>
            {cart.map(item => (
              <div className="resumen-item d-flex justify-content-between" key={item.id}>
                <div>
                  <h6>{item.nombre}</h6>
                  <small className="text-muted">Cantidad: {item.cantidad}</small>
                </div>
                <div className="text-end"><strong>${formatearPrecio((item.precio ?? 0) * (item.cantidad ?? 1))}</strong></div>
              </div>
            ))}

            <div className="resumen-item d-flex justify-content-between">
              <span>Subtotal</span>
              <span>${formatearPrecio(subtotal)}</span>
            </div>
            {opcionSeleccionada && (
              <div className="resumen-item d-flex justify-content-between">
                <span>Envío ({opcionSeleccionada.nombre})</span>
                <span>${formatearPrecio(opcionSeleccionada.precio)}</span>
              </div>
            )}
            {cuponAplicado && (
              <div className="resumen-item d-flex justify-content-between text-success">
                <span>Descuento</span>
                <span>- ${formatearPrecio(cuponAplicado.descuento)}</span>
              </div>
            )}
            <div className="resumen-item d-flex justify-content-between">
              <strong>Total</strong>
              <strong>${formatearPrecio(getTotalConEnvio())}</strong>
            </div>

            <button 
              className="btn btn-confirmar w-100 mt-4" 
              onClick={confirmarCompra} 
              disabled={!user || !datos.nombre || !datos.email || cart.length === 0 || isProcessing}
            > 
              {isProcessing ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  Procesando...
                </>
              ) : (
                <>
                  <i className="fas fa-credit-card me-2" />Confirmar Compra
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Success modal replacement */}
      {successOrder && (
        <div className={styles['modal-backdrop']} onClick={() => setSuccessOrder(null)}>
          <div className={styles['modal-container']} onClick={e => e.stopPropagation()}>
            <div className="text-center py-4">
              <div className="success-icon mb-4"><i className="fas fa-check-circle text-success" style={{ fontSize: '5rem' }} /></div>
              <h3 className="mb-3">¡Compra Realizada con Éxito!</h3>
              <p className="text-muted mb-4">Tu pedido ha sido procesado correctamente.<br/>Recibirás un email de confirmación en breve.</p>
              <div className="order-details bg-light p-3 rounded mb-4">
                <p className="mb-2"><strong>ID de Orden:</strong> {successOrder.numero}</p>
                <p className="mb-0"><strong>Total:</strong> ${formatearPrecio(successOrder.total)}</p>
              </div>
              <button className="btn btn-confirmar" onClick={() => setSuccessOrder(null)}>Entendido</button>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}
