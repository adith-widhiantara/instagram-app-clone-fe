import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromChildren,
  matchRoutes,
  RouterProvider,
  useLocation,
  useNavigationType,
} from 'react-router-dom';
import { AuthContext, ThemeContext } from 'alurkerja-ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { axiosInstance } from './utils/lib/axios';
import { theme } from '@/utils/theme';
import 'alurkerja-ui/dist/style.css';
import * as Sentry from '@sentry/react';

// routes
import router from './routes/root';

// styles
import './index.css';
import { ThemeProvider } from './utils/contexts/themeProvider';

const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || 'merapi',
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
      Sentry.reactRouterV6BrowserTracingIntegration({
        useEffect: React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      }),
    ],
    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: [
      'localhost:5173',
      import.meta.env.VITE_SENTRY_TRACING_TARGET,
      import.meta.env.VITE_API_URL,
      import.meta.env.VITE_API_BASEURL,
    ],
    // plus for 100% of sessions with an error
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

const queryClient = new QueryClient();
const createRouter = sentryDsn ? Sentry.wrapCreateBrowserRouter(createBrowserRouter) : createBrowserRouter;
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
