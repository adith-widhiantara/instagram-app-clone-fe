import authRoutes from './auth.routes';
// layouts
import NotFound from '@/pages/others/not-found/NotFound';
import ServerError from '@/pages/others/server-error/ServerError';
import Home from '@/pages/home/Home';
import { ProtectedRoute } from '@/components/gate/ProtectedRoute';
import { AdminLayout } from '@/layouts/AdminLayout';
import { RouteObject } from 'react-router-dom';
import postRoutes from '@/routes/post.routes';
import peopleRoutes from '@/routes/people.routes';
import ProfileShow from '@/pages/admin/profile/ProfileShow';

// pages

const router: RouteObject[] = [
  ...authRoutes,
  {
    path: '/',
    element: <ProtectedRoute layout={AdminLayout} />,
    errorElement: <ServerError />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'post',
        children: [...postRoutes],
      },
      {
        path: 'people',
        children: [...peopleRoutes],
      },
      {
        path: 'admin/profile',
        element: <ProfileShow />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
    errorElement: <ServerError />,
  },
];

export default router;
