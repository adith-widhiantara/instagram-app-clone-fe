import { RouteObject } from 'react-router-dom';
import CreatePost from '@/pages/post/CreatePost';
import ListPost from '@/pages/post/ListPost';

const postRoutes: RouteObject[] = [
  {
    index: true,
    element: <ListPost />,
  },
  {
    path: 'add',
    element: <CreatePost />,
  },
];

export default postRoutes;