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

interface StoreContextValue {
  cart: Product[];
  favorites: Product[];
  addToCart: (p: Product) => void;
  removeFromCart: (id: number) => void;
  addToFavorites: (p: Product) => void;
  removeFromFavorites: (id: number) => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);

  const addToCart = (p: Product) => {
    setCart(prev => [...prev, p]);
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

  return (
    <StoreContext.Provider value={{ cart, favorites, addToCart, removeFromCart, addToFavorites, removeFromFavorites }}>
      {children}
    </StoreContext.Provider>
  );
};

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
