import React from 'react';
import { useStore } from '../context/StoreContext';

export default function Carrito() {
  const { cart, removeFromCart } = useStore();

  if (cart.length === 0) return <div className="estado-vacio"><h4>Tu carrito está vacío</h4></div>;

  return (
    <div className="container">
      <h2 className="section-title">Carrito</h2>
      {cart.map(item => (
        <div className="carrito-item d-flex align-items-center" key={item.id}>
          <img src={item.imagenes?.[0]} className="carrito-item-img" alt={item.nombre} />
          <div className="carrito-item-info ms-3">
            <h6>{item.nombre}</h6>
            <div className="carrito-item-precio">${(item.precio ?? 0).toLocaleString()}</div>
          </div>
          <div className="ms-auto">
            <button className="btn btn-danger" onClick={() => removeFromCart(item.id)}>Eliminar</button>
          </div>
        </div>
      ))}
    </div>
  );
}
