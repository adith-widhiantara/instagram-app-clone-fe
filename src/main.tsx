import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthContext, ThemeContext } from 'alurkerja-ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { axiosInstance } from './utils/lib/axios';
import { theme } from '@/utils/theme';
import 'alurkerja-ui/dist/style.css';

// routes
import router from './routes/root';

// styles
import './index.css';
import { ThemeProvider } from './utils/contexts/themeProvider';

const queryClient = new QueryClient();
const createRouter = createBrowserRouter;
const routes = createRouter(router);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={axiosInstance}>
        <ThemeProvider>
          <ThemeContext.Provider value={theme}>
            <RouterProvider router={routes} />
          </ThemeContext.Provider>
        </ThemeProvider>
      </AuthContext.Provider>
      <ReactQueryDevtools initialIsOpen={import.meta.env.VITE_QUERY_DEBUG} />
    </QueryClientProvider>
  </React.StrictMode>,
);
