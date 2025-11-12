import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import CheckoutModal from '../Checkout/CheckoutModal';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Carrito() {
  const { cart, removeFromCart, updateQuantity, emptyCart } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // If navigated back from /auth with openCheckout state, open the checkout modal
  React.useEffect(() => {
    const s: any = (location && (location.state as any)) || {};
    if (s.openCheckout) {
      setShowCheckout(true);
      // replace history state so we don't re-open on refresh
      navigate(location.pathname, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConfirmPurchase = (formData: any) => {
      console.log("Purchase confirmed!", formData, cart);
      emptyCart();
      setShowCheckout(false);
    };


  // Función auxiliar para formatear el precio
  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  // Calculo del precio total
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  // Manejo del cambio de cantidad
  const changeQuantity = (itemId: number, change: number) => {
    updateQuantity(itemId, change);
  };

  // Confirmar vaciado del carrito
  const confirmEmptyCart = () => {
    emptyCart();
    setShowModal(false); 
  };

  // Cancelar vaciado del carrito
  // Cancelar vaciado del carrito
    const cancelEmptyCart = () => {
      setShowModal(false); 
    };
  
    // Si el carrito está vacío, mostrar mensaje
    if (cart.length === 0) {
      return (
        <div className="container my-5">
          <h2 className="section-title">🛒 Tu Carrito</h2>
          <div className="alert alert-info text-center">
            Tu carrito está vacío.
          </div>
        </div>
      );
    }

  return (
    <div className="container my-5">
      <h2 className="section-title">🛒 Tu Carrito</h2>

      <div>
        {cart.map(item => (
          <div className="carrito-item" key={item.id}>
            <div className="row align-items-center">
              <div className="col-md-2">
                <img src={item.imagen} className="carrito-item-img" alt={item.nombre} />
              </div>
              <div className="col-md-4">
                <div className="carrito-item-info">
                  <h6>{item.nombre}</h6>
                  <div className="carrito-item-precio">${formatPrice(item.precio)}</div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="carrito-item-cantidad">
                  <button className="btn btn-outline-secondary" onClick={() => changeQuantity(item.id, -1)}>-</button>
                  <span className="mx-2">{item.cantidad}</span>
                  <button className="btn btn-outline-secondary" onClick={() => changeQuantity(item.id, 1)}>+</button>
                </div>
              </div>
              <div className="col-md-2">
                <div className="text-end">
                  <div className="fw-bold">${formatPrice(item.precio * item.cantidad)}</div>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => removeFromCart(item.id)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-end mt-4">
        <div className="mb-3">
          <h4>Total: ${formatPrice(getTotalPrice())}</h4>
        </div>
  <button className="btn btn-secondary me-2" onClick={() => setShowModal(true)}>Vaciar carrito</button>
        
        {/* Modal for emptying cart confirmation */}
        {showModal && (
          <div className="modal-backdrop">
            <div className="modal-confirm">
              <h5>¿Estás seguro de que deseas vaciar el carrito?</h5>
              <p>Esta acción no puede deshacerse</p>
              <div className="mt-3 text-end">
                <button className="btn btn-danger me-2" onClick={confirmEmptyCart}>Sí, vaciar</button>
                <button className="btn btn-secondary" onClick={cancelEmptyCart}>Cancelar</button>
              </div>
            </div>
          </div>
        )}


        
        
        <button
          className="btn btn-success"
          onClick={() => {
            if (user) setShowCheckout(true);
            else navigate('/auth', { state: { from: location.pathname, openCheckout: true } });
          }}
          title={user ? 'Proceder al pago' : 'Debes iniciar sesión'}
        >
          Proceder al pago
        </button>
      </div>

      {/* --- 4. Conditionally render the new component --- */}
      {showCheckout && (
        <CheckoutModal 
          onClose={() => setShowCheckout(false)}
        />
      )}

    </div>
  );
}
