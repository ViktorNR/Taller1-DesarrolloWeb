import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useFilters } from '../context/FiltersContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { cart, favorites } = useStore();
  const { filtros, actualizarFiltros } = useFilters();
  const { user, logout } = useAuth();

  return (
    <>
      <header className="navbar navbar-expand-lg navbar-dark sticky-top" id="mainHeader">
        <div className="container-fluid">
          <div className="main-header">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-6 col-md-6">
                  <div className="unab-brand">
                    <div className="unab-logo d-flex align-items-center">
                      <div className="logo-emblem me-2">
                        <img src="src/assets/iconos/logo_unab.png" alt="Logo UNAB" className="emblem-image" />
                      </div>
                      <div className="logo-text">
                        <h1 className="d-none d-sm-block">Universidad Andrés Bello</h1>
                        <h1 className="d-sm-none">UNAB</h1>
                        <h2 className="d-none d-md-block">Mini-Marketplace Universitario</h2>
                        <h2 className="d-md-none d-none d-sm-block">Marketplace</h2>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-6 d-none d-md-flex justify-content-end">
                  <div className="header-actions">
                    <Link to="/favoritos" className="btn btn-favoritos" title="Favoritos">
                      <i className="fas fa-heart" />
                      {favorites.length > 0 && <span className="badge">{favorites.length}</span>}
                    </Link>
                    <Link to="/carrito" className="btn btn-carrito ms-2" title="Carrito">
                      <i className="fas fa-shopping-cart" />
                      {cart.length > 0 && <span className="badge">{cart.length}</span>}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <nav className="navbar navbar-expand-lg d-none d-md-block" id="mainNav">
            <div className="container">
              <div className="navbar-nav me-auto">
                <Link to="/catalogo" className="nav-link">Catálogo</Link>
                <Link to="/favoritos" className="nav-link">Favoritos</Link>
              </div>

              {/* Auth link positioned between Favoritos and the search bar */}
              <div className="navbar-nav mx-3">
                {user ? (
                  <>
                    <span className="nav-link">{user.username}</span>
                    <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); logout(); }}>Cerrar sesión</a>
                  </>
                ) : (
                  <Link to="/auth" className="nav-link">Iniciar Sesión/Registrarse</Link>
                )}
              </div>

              <form className="d-flex me-3" onSubmit={e => e.preventDefault()}>
                <input
                  className="form-control"
                  type="search"
                  placeholder="Buscar productos..."
                  aria-label="Buscar productos"
                  value={filtros.busqueda ?? ''}
                  onChange={e => actualizarFiltros({ busqueda: e.target.value })}
                />
                <button className="btn btn-search-submit" type="submit">
                  <i className="fas fa-search" />
                </button>
              </form>

              
            </div>
          </nav>

          <div className="mobile-search d-md-none">
            <div className="container">
              <form className="d-flex" onSubmit={e => e.preventDefault()}>
                <input
                  className="form-control"
                  type="search"
                  placeholder="Buscar productos..."
                  value={filtros.busqueda ?? ''}
                  onChange={e => actualizarFiltros({ busqueda: e.target.value })}
                />
                <button className="btn btn-search-submit" type="submit">
                  <i className="fas fa-search" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <nav className="mobile-bottom-nav d-md-none">
        <div className="container-fluid">
          <div className="row">
            <div className="col-3 text-center">
              <Link to="/catalogo" className="mobile-nav-item">
                <i className="fas fa-home" />
                <span>Inicio</span>
              </Link>
            </div>
            <div className="col-3 text-center">
              <a className="mobile-nav-item" href="#">
                <i className="fas fa-search" />
                <span>Buscar</span>
              </a>
            </div>
            <div className="col-3 text-center">
              <Link to="/favoritos" className="mobile-nav-item">
                <i className="fas fa-heart" />
                <span>Favoritos</span>
                {favorites.length > 0 && <span className="mobile-nav-badge">{favorites.length}</span>}
              </Link>
            </div>
            <div className="col-3 text-center">
              <Link to="/carrito" className="mobile-nav-item">
                <i className="fas fa-shopping-cart" />
                <span>Carrito</span>
                {cart.length > 0 && <span className="mobile-nav-badge">{cart.length}</span>}
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
