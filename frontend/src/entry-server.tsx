import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import AppRoutes from './routes';
import { StoreProvider } from './context/StoreContext';
import { UIProvider } from './context/UIContext';
import { FiltersProvider } from './context/FiltersContext';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

export function render(url: string) {
  const html = renderToString(
    <React.StrictMode>
      <UIProvider>
        <StoreProvider>
          <FiltersProvider>
            <AuthProvider>
              <StaticRouter location={url}>
                <ErrorBoundary>
                  <AppRoutes />
                </ErrorBoundary>
              </StaticRouter>
            </AuthProvider>
          </FiltersProvider>
        </StoreProvider>
      </UIProvider>
    </React.StrictMode>
  );

  return html;
}
