import React, { useEffect, useState } from 'react';
import { useFilters } from '../context/FiltersContext';

export default function Filtros() {
  const [categorias, setCategorias] = useState<string[]>([]);
  const { filtros, actualizarFiltros, limpiarFiltros } = useFilters();

  useEffect(() => {
    fetch('/data/categorias.json')
      .then(r => r.json())
      .then((data: any[]) => setCategorias(data.map(c => c.nombre)))
      .catch(() => setCategorias([]));
  }, []);

  return (
    <section className="mb-4" id="filtros">
      <div className="d-md-none mb-3">
        {/* Mobile toggle handled by CSS/UX */}
      </div>

      <div id="filtrosContenido" className="filtros-contenido d-block">
        <div className="row g-3">
          <div className="col-md-3 col-12">
            <select className="form-select" value={filtros.categoria ?? ''} onChange={e => actualizarFiltros({ categoria: e.target.value })}>
              <option value="">Todas las categorías</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2 col-12">
            <select className="form-select" value={filtros.precio ?? ''} onChange={e => actualizarFiltros({ precio: e.target.value })}>
              <option value="">Rango de precio</option>
              <option value="0-10000">$0 - $10.000</option>
              <option value="10000-25000">$10.000 - $25.000</option>
              <option value="25000-50000">$25.000 - $50.000</option>
              <option value="50000-100000">$50.000 - $100.000</option>
              <option value="100000+">$100.000 o más</option>
            </select>
          </div>
          <div className="col-md-2 col-12">
            <select className="form-select" value={filtros.rating ?? ''} onChange={e => actualizarFiltros({ rating: e.target.value })}>
              <option value="">Rating mínimo</option>
              <option value="4">4+ estrellas</option>
              <option value="3">3+ estrellas</option>
              <option value="2">2+ estrellas</option>
            </select>
          </div>
          <div className="col-md-2 col-12">
            <select className="form-select" value={filtros.orden ?? ''} onChange={e => actualizarFiltros({ orden: e.target.value })}>
              <option value="">Ordenar por</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
              <option value="rating-desc">Mejor rating</option>
              <option value="nombre-asc">Nombre A-Z</option>
            </select>
          </div>
          <div className="col-md-3 col-12">
            <button className="btn btn-limpiar w-100" onClick={() => limpiarFiltros()}>
              <i className="fas fa-times me-2" />Limpiar filtros
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
