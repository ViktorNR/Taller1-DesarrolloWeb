import React, { useState } from 'react';
import type { Product } from '../../context/StoreContext';
import styles from './VistaRapida.module.css';
import { useStore } from '../../context/StoreContext';
import { useUI } from '../../context/UIContext';

export default function VistaRapida({ producto, open, onClose }: { producto?: Product | null; open: boolean; onClose: () => void }) {
  const [imagenActual, setImagenActual] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const { addToCart, addToFavorites } = useStore();
  const { showToast } = useUI();

  if (!open || !producto) return null;

  const inc = () => setCantidad(c => Math.min((producto.stock ?? 1), c + 1));
  const dec = () => setCantidad(c => Math.max(1, c - 1));

  return (
    <div className={styles['modal-backdrop']} onClick={onClose}>
      <div className={styles['modal-container']} onClick={e => e.stopPropagation()}>
        <button className={styles['btn-close']} onClick={onClose} aria-label="Cerrar">
          <i className="fas fa-times"></i>
        </button>

        <div className={styles['modal-content-wrapper']}>
          <div className="row">
            <div className="col-md-6">
              <div className={styles['imagen-principal']}>
                <img src={producto.imagenes?.[imagenActual]} alt={producto.nombre} />
              </div>
              <div className={styles['imagenes-miniaturas']}>
                {(producto.imagenes ?? []).map((img, i) => (
                  <div 
                    key={i} 
                    className={`${styles.miniatura} ${i === imagenActual ? styles.active : ''}`} 
                    onClick={() => setImagenActual(i)}
                  >
                    <img src={img} alt={`${producto.nombre} ${i + 1}`} />
                  </div>
                ))}
              </div>
            </div>

            <div className="col-md-6">
              <div className={styles['producto-info']}>
                <h2 className={styles['producto-nombre']}>{producto.nombre}</h2>
                <div className={styles['rating']}>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star-half-alt"></i>
                </div>
                <div className={styles['precio-container']}>
                  <span className={styles.precio}>${(producto.precio ?? 0).toLocaleString()}</span>
                </div>
                <div className={`${styles['stock-info']} ${(producto.stock ?? 0) === 0 ? styles['sin-stock'] : ''}`}>
                  {(producto.stock ?? 0) > 0 ? `${producto.stock} disponibles` : 'Sin stock'}
                </div>
                <div className={styles.descripcion}>
                  <h5>Descripción del producto</h5>
                  <p>{producto.descripcion}</p>
                </div>

                <div className={styles['cantidad-selector']}>
                  <label>Cantidad</label>
                  <div className={styles['cantidad-controls']}>
                    <button 
                      className={styles['btn-cantidad']} 
                      onClick={dec} 
                      disabled={cantidad <= 1}
                    >
                      -
                    </button>
                    <input 
                      className={styles['cantidad-input']}
                      value={cantidad} 
                      readOnly 
                    />
                    <button 
                      className={styles['btn-cantidad']} 
                      onClick={inc} 
                      disabled={cantidad >= (producto.stock ?? 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className={styles['modal-actions']}>
                  <button 
                    className={styles['btn-agregar']}
                    onClick={() => { 
                      addToCart(producto); 
                      showToast('Producto agregado al carrito', 'success'); 
                      onClose(); 
                    }} 
                    disabled={(producto.stock ?? 0) === 0}
                    style={{ background: '#002B5C', color: 'white' }}
                  >
                    Agregar al Carrito
                  </button>
                  <button 
                    className={styles['btn-agregar']}
                    onClick={() => { 
                      addToFavorites(producto); 
                      showToast('Producto agregado a favoritos', 'success'); 
                    }}
                    style={{ background: '#C8102E', color: 'white' }}
                  >
                    ❤ Favorito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
