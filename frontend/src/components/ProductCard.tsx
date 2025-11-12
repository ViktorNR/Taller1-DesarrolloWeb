import React, { useState } from 'react';
import type { Product } from '../context/StoreContext';
import { useStore } from '../context/StoreContext';
import { useUI } from '../context/UIContext';

function Stars({ rating }: { rating?: number }) {
  const r = Math.round((rating ?? 0) * 2) / 2; // half-star rounding
  const stars = [] as React.ReactNode[];
  for (let i = 1; i <= 5; i++) {
    if (r >= i) stars.push(<i key={i} className="fas fa-star text-warning" />);
    else if (r + 0.5 === i) stars.push(<i key={i} className="fas fa-star-half-alt text-warning" />);
    else stars.push(<i key={i} className="far fa-star text-warning" />);
  }
  return <span>{stars}</span>;
}

import FavoritoModal from './Favoritos/FavoritoModal';
import CarritoModal from './Carrito/CarritoModal';

export default function ProductCard({ producto, onOpenVista }:{ producto: Product; onOpenVista: (p: Product) => void }){
  const { addToCart, addToFavorites, removeFromFavorites, favorites } = useStore();
  const { showToast } = useUI();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTipo, setModalTipo] = useState<'agregado'|'removido'>('agregado');
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [cartModalTipo, setCartModalTipo] = useState<'agregado'|'removido'>('agregado');

  const favorito = favorites.some(f => f.id === producto.id);

  const handleToggleFavorito = () => {
    if (favorito) {
      // remove then show removed modal
      removeFromFavorites(producto.id);
      showToast('Quitado de favoritos', 'info');
      setModalTipo('removido');
      setModalOpen(true);
    } else {
      addToFavorites(producto);
      showToast('Agregado a favoritos', 'info');
      setModalTipo('agregado');
      setModalOpen(true);
    }
  };

  return (
    <div className="card producto-card h-100">
      <img src={producto.imagenes?.[0]} className="card-img-top" alt={producto.nombre} />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title text-truncate-2">{producto.nombre}</h5>
        <div className="precio">${(producto.precio ?? 0).toLocaleString()}</div>

        <div className="rating mt-2">
          <Stars rating={producto.rating} />
          <span className="ms-2">({(producto.rating ?? 0).toFixed(2)})</span>
        </div>

        <div className="stock mt-2"><i className="fas fa-box me-1" />{(producto.stock ?? 0) > 0 ? `${producto.stock} disponibles` : 'Sin stock'}</div>

        <div className="btn-group mt-auto d-flex gap-2">
          <button className="btn btn-vista-rapida flex-grow-1" onClick={() => onOpenVista(producto)}>
            <i className="fas fa-eye me-1" />Vista Rápida
          </button>
          <button className={`btn btn-favorito ${favorito ? 'activo' : ''}`} onClick={handleToggleFavorito}>
            <i className="fas fa-heart" />
          </button>
        </div>

        <div className="mt-2">
          <button className="btn btn-agregar-carrito w-100" onClick={() => {
            // open modal after adding
            addToCart(producto, 1);
            showToast('Producto agregado al carrito', 'success');
            setCartModalTipo('agregado');
            setCartModalOpen(true);
          }} disabled={(producto.stock ?? 0) === 0}>
            <i className="fas fa-shopping-cart me-2" />{(producto.stock ?? 0) === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
          </button>
        </div>
      </div>
      <FavoritoModal open={modalOpen} producto={producto} tipo={modalTipo} onClose={() => setModalOpen(false)} />
      <CarritoModal open={cartModalOpen} producto={producto} tipo={cartModalTipo} cantidad={1} onClose={() => setCartModalOpen(false)} />
    </div>
  );
}
