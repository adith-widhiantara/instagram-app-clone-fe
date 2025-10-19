import { RouteObject } from 'react-router-dom';
import CreatePost from '@/pages/post/CreatePost';

const postRoutes: RouteObject[] = [
  {
    path: 'add',
    element: <CreatePost />,
  },
];

export default postRoutes;