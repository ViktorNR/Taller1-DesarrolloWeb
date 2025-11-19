import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  categoria?: string;
  stock?: number;
  rating?: number;
  imagenes?: string[];
}

export interface ItemCarrito {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen?: string;
  stock?: number;
}

interface StoreContextValue {
  cart: ItemCarrito[];
  favorites: Product[];
  addToCart: (p: Product, c: number) => void;
  emptyCart: () => void;
  removeFromCart: (id: number) => void;
  addToFavorites: (p: Product) => void;
  removeFromFavorites: (id: number) => void;
  updateQuantity: (id: number, change: number) => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<ItemCarrito[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);

  const addToCart = (p: Product, c: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === p.id);

      if (existingItem) {
        return prevCart.map(item =>
          item.id === p.id
            ? { ...item, cantidad: item.cantidad + c }
            : item
        );
      } else {
        const newItem: ItemCarrito = {
          id: p.id,
          nombre: p.nombre,
          precio: p.precio,
          cantidad: c,
          stock: p.stock,
          imagen: p.imagenes && p.imagenes.length > 0 ? p.imagenes[0] : undefined,
        };
        return [...prevCart, newItem];
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(x => x.id !== id));
  };

  const addToFavorites = (p: Product) => {
    setFavorites(prev => {
      if (prev.find(x => x.id === p.id)) return prev;
      return [...prev, p];
    });
  };

  const removeFromFavorites = (id: number) => {
    setFavorites(prev => prev.filter(x => x.id !== id));
  };

  const updateQuantity = (id: number, change: number) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id
          ? { ...item, cantidad: Math.max(1, item.cantidad + change) }
          : item
      )
    );
  };

  const emptyCart = () => {
    setCart([]);
  };

  return (
    <StoreContext.Provider value={{ cart, favorites, addToCart, emptyCart, removeFromCart, addToFavorites, removeFromFavorites, updateQuantity }}>
      {children}
    </StoreContext.Provider>
  );
};

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

