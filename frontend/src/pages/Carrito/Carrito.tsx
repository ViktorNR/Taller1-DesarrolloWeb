import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import CheckoutModal from '../Checkout/CheckoutModal';
import styles from '/src/pages/Carrito/Carrito.module.css';

export default function Carrito() {
  const { cart, removeFromCart, updateQuantity, emptyCart } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleConfirmPurchase = (formData: any) => {
      console.log("Purchase confirmed!", formData, cart);
      // Here you would:
      // 1. Send the `formData` and `cart` to your backend API
      // 2. On success, empty the cart (emptyCart())
      // 3. Close the modal (setShowCheckout(false))
      // 4. Maybe redirect to a "Thank You" page
      
      // For now, just close modal and empty cart
      emptyCart();
      setShowCheckout(false);
    };


  // Helper function to format the price
  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  // Calculate total price
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  //Handle quantity change
  const changeQuantity = (itemId: number, change: number) => {
    updateQuantity(itemId, change);
  };

  // Confirm empty cart
  const confirmEmptyCart = () => {
    emptyCart();
    setShowModal(false); // Close the modal after confirming
  };

  // Cancel empty cart
  const cancelEmptyCart = () => {
    setShowModal(false); // Just close the modal
  };

  // Render empty cart message if cart is empty
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
          <div className={styles['modal-backdrop']}>
            <div className={styles['modal-confirm']}>
              <h5>¿Estás seguro de que deseas vaciar el carrito?</h5>
              <p>Esta acción no puede deshacerse</p>
              <div className="mt-3 text-end">
                <button className="btn btn-danger me-2" onClick={confirmEmptyCart}>Sí, vaciar</button>
                <button className="btn btn-secondary" onClick={cancelEmptyCart}>Cancelar</button>
              </div>
            </div>
          </div>
        )}


        
        
        <button className="btn btn-success" onClick={() => setShowCheckout(true)}>Proceder al pago</button>
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
