import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import FavoritoModal from '../components/Favoritos/FavoritoModal';

export default function Favoritos() {
  const { favorites, removeFromFavorites, addToCart } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProducto, setModalProducto] = useState<any>(null);

  const handleEliminarClick = (f: any) => {
    removeFromFavorites(f.id);
    setModalProducto(f);
    setModalOpen(true);
  };
  return (
    <div className="container my-5">
      <h2 className="section-title">❤️ Tus Favoritos</h2>

      {favorites.length === 0 ? (
        <div className="alert alert-info text-center">No tienes favoritos.</div>
      ) : (
        <div className="row">
          {favorites.map(f => (
            <div className="col-sm-6" key={f.id}>
              <div className="favorito-card">
                <img className="favorito-card-img" src={f.imagenes?.[0]} alt={f.nombre} />
                <div className="favorito-card-body">
                  <h6 className="favorito-card-title">{f.nombre}</h6>
                  <div className="favorito-card-precio">${(f.precio ?? 0).toLocaleString()}</div>
                  <div className="d-flex gap-2 mt-2">
                    <button className="btn btn-agregar-carrito" onClick={() => addToCart(f, 1)}>Agregar al carrito</button>
                    <button className="btn favorito-remove-btn" onClick={() => handleEliminarClick(f)}>Eliminar</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <FavoritoModal open={modalOpen} producto={modalProducto} tipo="removido" onClose={() => setModalOpen(false)} />
    </div>
  );
}
