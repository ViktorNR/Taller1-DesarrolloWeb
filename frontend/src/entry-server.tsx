import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';

const AppRoutes: React.FC = () => {
  return <></>;
};

const StoreProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return <>{children}</>;
};
import { UIProvider } from './context/UIContext';
import { FiltersProvider } from './context/FiltersContext';

export function render(url: string) {
  const html = renderToString(
    <UIProvider>
      <StoreProvider>
        <FiltersProvider>
          <StaticRouter location={url}>
            <AppRoutes />
          </StaticRouter>
        </FiltersProvider>
      </StoreProvider>
    </UIProvider>
  );

  return html;
}
