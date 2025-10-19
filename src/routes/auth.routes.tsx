import Login from '@/pages/auth/login/Login';
import { RouteObject } from 'react-router-dom';

const authRoutes: RouteObject[] = [
  {
    path: 'login',
    children: [{ index: true, element: <Login /> }],
  },
];
export default authRoutes;
