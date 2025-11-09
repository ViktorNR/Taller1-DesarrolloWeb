import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../api/api';
import { useStore } from '../context/StoreContext';
import { useUI } from '../context/UIContext';

export default function DetalleProducto() {
  const params = useParams();
  const id = Number(params.id);
  const [p, setP] = useState<any | null>(null);
  const { addToCart } = useStore();
  const { showToast } = useUI();

  useEffect(() => {
    if (!id) return;
    getProductById(id).then(res => setP(res));
  }, [id]);

  if (!p) return <div className="estado-vacio"><h4>Producto no encontrado</h4></div>;

  return (
    <div className="container">
      <h2 className="section-title">{p.nombre}</h2>
      <div className="row">
        <div className="col-md-6">
          <img src={p.imagenes?.[0]} className="producto-modal-img" alt={p.nombre} />
        </div>
        <div className="col-md-6">
          <div className="producto-modal-info">
            <h4>{p.nombre}</h4>
            <div className="producto-modal-precio">${(p.precio ?? 0).toLocaleString()}</div>
            <p>{p.descripcion}</p>
            <div className="cantidad-control">
              <button className="btn">-</button>
              <input className="form-control" type="number" value={1} readOnly />
              <button className="btn">+</button>
            </div>
            <div className="btn-group d-flex">
              <button className="btn btn-agregar-carrito" onClick={() => { addToCart(p); showToast('Producto agregado al carrito', 'success'); }}>Agregar al carrito</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
