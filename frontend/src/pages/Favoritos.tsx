import React from 'react';
import { useStore } from '../context/StoreContext';

export default function Favoritos() {
  const { favorites, removeFromFavorites, addToCart } = useStore();

  if (favorites.length === 0) return <div className="estado-vacio"><h4>No tienes favoritos</h4></div>;

  return (
    <div className="container">
      <h2 className="section-title">Favoritos</h2>
      <div className="row">
        {favorites.map(f => (
          <div className="col-sm-6" key={f.id}>
            <div className="favorito-card">
              <img className="favorito-card-img" src={f.imagenes?.[0]} alt={f.nombre} />
              <div className="favorito-card-body">
                <h6 className="favorito-card-title">{f.nombre}</h6>
                <div className="favorito-card-precio">${(f.precio ?? 0).toLocaleString()}</div>
                <div className="d-flex gap-2 mt-2">
                  <button className="btn btn-agregar-carrito" onClick={() => addToCart(f)}>Agregar al carrito</button>
                  <button className="btn favorito-remove-btn" onClick={() => removeFromFavorites(f.id)}>Eliminar</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
