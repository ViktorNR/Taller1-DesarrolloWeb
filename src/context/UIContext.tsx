import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

type ToastTipo = 'success' | 'error' | 'info';

interface UIContextValue {
  mensaje?: string;
  tipo?: ToastTipo;
  showToast: (mensaje: string, tipo?: ToastTipo, timeoutMs?: number) => void;
  hideToast: () => void;
}

const UIContext = createContext<UIContextValue | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [mensaje, setMensaje] = useState<string | undefined>(undefined);
  const [tipo, setTipo] = useState<ToastTipo | undefined>(undefined);
  const timeoutRef = React.useRef<number | undefined>(undefined);

  const hideToast = useCallback(() => {
    setMensaje(undefined);
    setTipo(undefined);
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }, []);

  const showToast = useCallback((m: string, t: ToastTipo = 'info', timeoutMs = 3000) => {
    setMensaje(m);
    setTipo(t);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setMensaje(undefined);
      setTipo(undefined);
      timeoutRef.current = undefined;
    }, timeoutMs) as unknown as number;
  }, []);

  return (
    <UIContext.Provider value={{ mensaje, tipo, showToast, hideToast }}>
      {children}
    </UIContext.Provider>
  );
};

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within UIProvider');
  return ctx;
}
