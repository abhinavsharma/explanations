import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import routes from 'virtual:generated-pages-react';
import Layout from './components/layout';
import './index.css';

function flattenRoutes(routes: any[], prefix = ''): any[] {
  return routes.flatMap((route: any) => {
    const path = prefix ? `${prefix}/${route.path || ''}`.replace(/\/+/g, '/') : (route.path || '');
    if (route.children) {
      return flattenRoutes(route.children, path);
    }
    return [{ ...route, path }];
  });
}

const router = createBrowserRouter(
  flattenRoutes(routes).map((route) => ({
    ...route,
    element: <Layout>{route.element}</Layout>,
  })), {
  future: {
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);