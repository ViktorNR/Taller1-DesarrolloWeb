import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import { StoreProvider } from './context/StoreContext';
import { UIProvider } from './context/UIContext';
import { FiltersProvider } from './context/FiltersContext';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import './styles.css';

console.log('entry-client: bundle evaluated');


window.addEventListener('error', (ev) => {
  console.error('Global error captured:', ev.error ?? ev.message ?? ev);
});

window.addEventListener('unhandledrejection', (ev) => {
  console.error('Unhandled promise rejection:', ev.reason ?? ev);
});

hydrateRoot(
  document.getElementById('root')!,
  <React.StrictMode>
      <UIProvider>
      <StoreProvider>
        <FiltersProvider>
          <AuthProvider>
            <BrowserRouter>
              <ErrorBoundary>
                <AppRoutes />
              </ErrorBoundary>
            </BrowserRouter>
          </AuthProvider>
        </FiltersProvider>
      </StoreProvider>
    </UIProvider>
  </React.StrictMode>
);
