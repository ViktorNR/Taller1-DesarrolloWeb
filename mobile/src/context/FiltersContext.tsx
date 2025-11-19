import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface FiltersState {
  busqueda?: string;
  categoria?: string;
  precio?: string;
  rating?: string;
  orden?: string;
}

interface FiltersContextValue {
  filtros: FiltersState;
  actualizarFiltros: (f: Partial<FiltersState>) => void;
  limpiarFiltros: () => void;
}

const FiltersContext = createContext<FiltersContextValue | undefined>(undefined);

export const FiltersProvider = ({ children }: { children?: ReactNode }) => {
  const [filtros, setFiltros] = useState<FiltersState>({});

  const actualizarFiltros = (f: Partial<FiltersState>) => {
    setFiltros(prev => ({ ...prev, ...f }));
  };

  const limpiarFiltros = () => setFiltros({});

  return (
    <FiltersContext.Provider value={{ filtros, actualizarFiltros, limpiarFiltros }}>
      {children}
    </FiltersContext.Provider>
  );
};

export function useFilters() {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error('useFilters must be used within FiltersProvider');
  return ctx;
}

