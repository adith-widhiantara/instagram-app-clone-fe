import authRoutes from './auth.routes';
// layouts
import NotFound from '@/pages/others/not-found/NotFound';
import ServerError from '@/pages/others/server-error/ServerError';
import Home from '@/pages/home/Home';
import { ProtectedRoute } from '@/components/gate/ProtectedRoute';
import { AdminLayout } from '@/layouts/AdminLayout';
import { RouteObject } from 'react-router-dom';

// pages

const router: RouteObject[] = [
  ...authRoutes,
  {
    path: '/',
    element: <ProtectedRoute layout={AdminLayout} />,
    errorElement: <ServerError />,
    children: [
      { index: true, element: <Home /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
    errorElement: <ServerError />,
  },
];

export default router;
