import React, { useEffect, useState } from 'react';
import { getDocumentos, getDetalleDocumento, getProducts } from '../../api/api';
import { useAuth } from '../../context/AuthContext';

type Documento = any;

export default function MisCompras() {
  const { user } = useAuth();
  const [ordenes, setOrdenes] = useState<Documento[]>([]);
  const [detallesMap, setDetallesMap] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(false);
  const [productos, setProductos] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([getDocumentos(), getProducts()])
      .then(([docs, prods]) => {
        setOrdenes(docs ?? []);
        setProductos(prods ?? []);
      })
      .catch(() => {
        setOrdenes([]);
        setProductos([]);
      })
      .finally(() => setLoading(false));
  }, []);

  async function verDetalles(id: string) {
    if (detallesMap[id]) return;
    try {
      const det = await getDetalleDocumento(id);
      setDetallesMap(m => ({ ...m, [id]: det }));
    } catch (e) {
      setDetallesMap(m => ({ ...m, [id]: [] }));
    }
  }

  function findProductByName(name: string) {
    if (!name) return null;
    const normalize = (s: string) => s
      .toLowerCase()
      .normalize('NFD').replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-z0-9 ]/g, '')
      .trim();
    const target = normalize(name);
    return (
      productos.find(p => normalize(p.nombre ?? '') === target) ||
      productos.find(p => normalize(p.nombre ?? '').includes(target)) ||
      productos.find(p => target.includes(normalize(p.nombre ?? ''))) ||
      null
    );
  }

  return (
    <div className="container" style={{ padding: 24 }}>
      <h2>Mis Compras</h2>
      {loading && <div>Cargando órdenes...</div>}
      {!loading && ordenes.length === 0 && <div className="alert alert-info">No tienes órdenes registradas.</div>}

      <div className="list-group">
        {ordenes.map(o => (
          <div key={o.id} className="list-group-item mb-3">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h5>Orden {String(o.id).substring(0,8).toUpperCase()}</h5>
                <div>
                  <small className="text-muted">Estado: {o.estado} • Fecha: {o.fecha_creacion ? new Date(o.fecha_creacion).toLocaleString() : ''}</small>
                </div>
                <div>
                  <strong>Total: ${o.monto_total?.toLocaleString?.() ?? o.monto_total}</strong>
                </div>
              </div>
              <div>
                <button className="btn btn-outline-primary" onClick={() => verDetalles(o.id)}>Ver detalles</button>
              </div>
            </div>

            {detallesMap[o.id] && (
              <div className="mt-3">
                <h6>Detalles</h6>

                <div className="mb-3">
                  <strong>Usuario:</strong>
                  <div>{user?.nombre ?? user?.username}{user?.apellido ? ` ${user.apellido}` : ''}</div>
                  <div><small className="text-muted">Email: {user?.email}</small></div>
                  {user?.rut && <div><small className="text-muted">RUT: {user.rut}</small></div>}
                </div>

                {/* Mostrar envío, dirección y cupón si están presentes en la orden */}
                {o.direccion && (
                  <div className="mb-2">
                    <strong>Dirección de envío:</strong>
                    <div>{o.direccion.direccion ?? o.direccion.address ?? JSON.stringify(o.direccion)}</div>
                    <div><small className="text-muted">Código postal: {o.direccion.codigoPostal ?? o.direccion.postal ?? ''}</small></div>
                    <div><small className="text-muted">Comuna: {o.direccion.comuna ?? ''} • Ciudad: {o.direccion.ciudad ?? ''}</small></div>
                  </div>
                )}
                
                {/* Mostrar envío y cupón si están presentes en la orden */}
                {o.envio && (
                  <div className="mb-2"><strong>Envío:</strong> {o.envio.nombre ?? JSON.stringify(o.envio)}</div>
                )}
                {o.cupon && (
                  <div className="mb-2"><strong>Cupón:</strong> {o.cupon.codigo ?? JSON.stringify(o.cupon)} — <em>{o.cupon.monto ?? o.cupon.descuento ?? ''}</em></div>
                )}

                <div className="row">
                  {detallesMap[o.id].map((d: any) => {
                    const prod = findProductByName(d.producto ?? d.nombre ?? '');
                    return (
                      <div key={d.id ?? d.producto} className="col-md-6 mb-3">
                        <div className="d-flex gap-3 align-items-center">
                          {prod?.imagenes?.[0] ? (
                            <img src={prod.imagenes[0]} alt={prod.nombre} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
                          ) : (
                            <div style={{ width: 80, height: 80, background: '#f0f0f0', borderRadius: 8 }} />
                          )}
                          <div>
                            <div style={{ fontWeight: 600 }}>{d.producto}</div>
                            <div><small className="text-muted">Cantidad: {d.cantidad} • Precio unitario: ${d.precio}</small></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
