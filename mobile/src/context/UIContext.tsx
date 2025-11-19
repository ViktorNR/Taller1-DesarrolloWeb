import React, { createContext, useContext, useState, ReactNode, useCallback, useRef } from 'react';
import Toast from 'react-native-toast-message';

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
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const hideToast = useCallback(() => {
    setMensaje(undefined);
    setTipo(undefined);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
    Toast.hide();
  }, []);

  const showToast = useCallback((m: string, t: ToastTipo = 'info', timeoutMs = 3000) => {
    setMensaje(m);
    setTipo(t);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    // Mostrar toast nativo
    Toast.show({
      type: t === 'error' ? 'error' : t === 'success' ? 'success' : 'info',
      text1: m,
      position: 'top',
      visibilityTime: timeoutMs,
    });

    timeoutRef.current = setTimeout(() => {
      setMensaje(undefined);
      setTipo(undefined);
      timeoutRef.current = undefined;
    }, timeoutMs);
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

