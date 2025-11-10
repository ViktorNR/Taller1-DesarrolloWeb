import React, { useEffect, useState } from 'react';
import { getProducts } from '../api/api';
import { useStore } from '../context/StoreContext';
import { useUI } from '../context/UIContext';
import Filtros from '../components/Filtros';
import { useFilters } from '../context/FiltersContext';
import ProductCard from '../components/ProductCard';
import VistaRapida from '../components/VistaRapida/VistaRapida';

export default function Catalogo() {
  const [productos, setProductos] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { filtros } = useFilters();
  const [vistaProduct, setVistaProduct] = useState<any | null>(null);
  const [vistaOpen, setVistaOpen] = useState(false);

  const { addToCart, addToFavorites } = useStore();
  const { showToast } = useUI();

  useEffect(() => {
    getProducts().then(p => { setProductos(p); setFiltered(p); }).catch(() => { setProductos([]); setFiltered([]); }).finally(()=> setLoading(false));
  }, []);

  useEffect(() => {
    // Apply client-side filters from FiltersContext
    let list = [...productos];
    if (filtros.categoria) list = list.filter(p => p.categoria === filtros.categoria);
    if (filtros.rating) list = list.filter(p => (p.rating ?? 0) >= Number(filtros.rating));
    if (filtros.precio) {
      const v = filtros.precio;
      if (v.endsWith('+')) list = list.filter(p => p.precio >= Number(v.replace('+', '').replace(/[^0-9]/g, '')));
      else {
        const [min, max] = v.split('-').map((s: string) => Number(s.replace(/[^0-9]/g, '')));
        list = list.filter(p => p.precio >= min && p.precio <= max);
      }
    }
    if (filtros.orden) {
      if (filtros.orden === 'precio-asc') list.sort((a,b) => a.precio - b.precio);
      if (filtros.orden === 'precio-desc') list.sort((a,b) => b.precio - a.precio);
      if (filtros.orden === 'rating-desc') list.sort((a,b) => (b.rating||0) - (a.rating||0));
      if (filtros.orden === 'nombre-asc') list.sort((a,b) => a.nombre.localeCompare(b.nombre));
    }
    // If there's a search term, filter by name
    if (filtros.busqueda) {
      const q = (filtros.busqueda || '').toLowerCase();
      list = list.filter(p => (p.nombre || '').toLowerCase().includes(q));
    }
    setFiltered(list);
  }, [filtros, productos]);

  const onOpenVista = (p: any) => { setVistaProduct(p); setVistaOpen(true); };

  return (
    <div className="container">
      <h2 className="section-title">Catálogo</h2>

  <Filtros />

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Cargando...</span></div>
        </div>
      ) : filtered.length > 0 ? (
        <div className="row" id="productosGrid">
          {filtered.map(prod => (
            <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={prod.id}>
              <ProductCard producto={prod} onOpenVista={onOpenVista} />
            </div>
          ))}
        </div>
      ) : (
        <div className="estado-vacio text-center py-5">
          <i className="fas fa-search fa-2x text-muted" />
          <h4>No se encontraron productos</h4>
          <p>Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}

      <VistaRapida producto={vistaProduct} open={vistaOpen} onClose={() => setVistaOpen(false)} />
    </div>
  );
}
