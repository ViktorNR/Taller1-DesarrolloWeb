import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../VistaRapida/VistaRapida.module.css';
import type { Product } from '../../context/StoreContext';
import { useStore } from '../../context/StoreContext';
import { useUI } from '../../context/UIContext';

export default function FavoritoModal({
  open,
  producto,
  tipo, // 'agregado' | 'removido'
  onClose,
}: {
  open: boolean;
  producto?: Product | null;
  tipo: 'agregado' | 'removido';
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const { addToFavorites } = useStore();
  const { showToast } = useUI();

  if (!open || !producto) return null;
  // Resolve image source safely: favorites may contain full product (`imagenes`) or single `imagen` field
  const imageSrc = ((): string | undefined => {
    try {
      if (!producto) return undefined;
      if (Array.isArray((producto as any).imagenes) && (producto as any).imagenes.length) return (producto as any).imagenes[0];
      if ((producto as any).imagen) return (producto as any).imagen;
      if ((producto as any).image) return (producto as any).image;
      if ((producto as any).imagen_url) return (producto as any).imagen_url;
      return undefined;
    } catch (e) {
      return undefined;
    }
  })();

  const handleVerFavoritos = () => {
    onClose();
    navigate('/favoritos');
  };

  const handleSeguirComprando = () => onClose();

  const handleDeshacer = () => {
    addToFavorites(producto);
    showToast('Favorito restaurado', 'success');
    onClose();
  };

  return (
    <div className={styles['modal-backdrop']} onClick={onClose}>
      <div className={styles['modal-container']} onClick={e => e.stopPropagation()}>
        <button className={styles['btn-close']} onClick={onClose} aria-label="Cerrar">
          <i className="fas fa-times" />
        </button>

        <div className={styles['modal-content-wrapper']}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>
              {tipo === 'agregado' ? (
                <i className="fas fa-heart" style={{ color: '#C8102E', fontSize: 36 }} />
              ) : (
                <i className="fas fa-trash" style={{ color: '#C8102E', fontSize: 36 }} />
              )}
            </div>
            <h3 style={{ color: '#002B5C', marginBottom: 12 }}>{tipo === 'agregado' ? '¡Producto agregado a favoritos!' : 'Producto removido de favoritos'}</h3>

            <div style={{ background: '#f1f7fb', padding: 12, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12, maxWidth: 600, margin: '0 auto 16px' }}>
              {imageSrc ? (
                <img src={imageSrc} alt={producto.nombre} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 6 }} />
              ) : (
                <div style={{ width: 64, height: 64, borderRadius: 6, background: '#eef4f6' }} />
              )}
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700 }}>{producto.nombre}</div>
                <div style={{ color: '#0A7A5A', fontWeight: 700 }}>${(producto.precio ?? 0).toLocaleString()}</div>
                <div style={{ color: '#6C757D', fontSize: 13 }}>{(producto.stock ?? 0) > 0 ? `${producto.stock} disponibles` : 'Sin stock'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              {tipo === 'agregado' ? (
                <>
                  <button className="btn btn-light" onClick={handleSeguirComprando}>Seguir Comprando</button>
                  <button className="btn btn-primary" onClick={handleVerFavoritos}><i className="fas fa-heart me-2" />Ver Favoritos</button>
                </>
              ) : (
                <>
                  <button className="btn btn-light" onClick={onClose}>Cerrar</button>
                  <button className="btn btn-outline-primary" onClick={handleDeshacer}>Deshacer</button>
                </>
              )}
            </div>

            <div style={{ marginTop: 16 }}>
              {tipo === 'agregado' ? (
                <div className="alert alert-info">Puedes encontrar este producto en tu lista de favoritos cuando lo necesites</div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
