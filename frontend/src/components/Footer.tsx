import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer-unab">
      <div className="container-fluid-px-5">
        <div className="row justify-content-around">
          <div className="col-md-3">
            <div className="footer-brand">
              <div className="unab-logo-footer d-flex align-items-center">
                <div className="logo-emblem-footer me-3">
                  <img src="src/assets/iconos/logo_unab_nocolor.png" alt="Emblema Logo" className="emblem-image" />
                </div>
                <div className="logo-text-footer">
                  <h1>Universidad Andrés Bello</h1>
                  <p>Mini-Marketplace Universitario</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <h5>Enlaces Rápidos</h5>
            <ul className="footer-links list-unstyled">
              <li><Link to="/catalogo">Catálogo</Link></li>
              <li><Link to="/favoritos">Favoritos</Link></li>
            </ul>
          </div>

          <div className="col-md-3">
            <h5>Contacto</h5>
            <ul className="footer-contact list-unstyled">
              <li><i className="fas fa-phone me-2" />+56 2 2661 8000</li>
              <li><i className="fas fa-envelope me-2" />info@unab.cl</li>
              <li><i className="fas fa-map-marker-alt me-2" />Santiago, Chile</li>
            </ul>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="row">
          <div className="col-md-6 px-5">
            <p>&copy; 2025 Universidad Andrés Bello. Todos los derechos reservados.</p>
          </div>
          <div className="col-md-6 text-end pe-5">
            <div className="footer-social">
              <a href="https://www.facebook.com/unab.cl/" target="_blank" rel="noreferrer"><i className="fab fa-facebook" /></a>
              <a href="https://x.com/uandresbello" target="_blank" rel="noreferrer"><i className="fab fa-twitter" /></a>
              <a href="https://www.instagram.com/uandresbello" target="_blank" rel="noreferrer"><i className="fab fa-instagram" /></a>
              <a href="https://cl.linkedin.com/school/universidad-andres-bello/" target="_blank" rel="noreferrer"><i className="fab fa-linkedin" /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
