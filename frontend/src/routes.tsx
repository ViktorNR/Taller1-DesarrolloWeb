import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Catalogo from './pages/Catalogo';
import Carrito from './pages/Carrito/Carrito';
import Favoritos from './pages/Favoritos';
import Checkout from './pages/Checkout/CheckoutModal';
import DetalleProducto from './pages/DetalleProducto';
import Header from './components/Header';
import Footer from './components/Footer';
import Toast from './components/Toast';
import Auth from './components/Auth/Auth';

export default function AppRoutes() {
  return (
    <div>
  <Header />
  <Toast />
      <main>
        <Routes>
          <Route path="/" element={<Catalogo />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/checkout" element={<Checkout onClose={() => {}} />} />
          <Route path="/producto/:id" element={<DetalleProducto />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
