import { RouteObject } from 'react-router-dom';
import CreatePost from '@/pages/post/CreatePost';
import ListPost from '@/pages/post/ListPost';
import DetailPost from '@/pages/post/DetailPost';

const postRoutes: RouteObject[] = [
  {
    index: true,
    element: <ListPost />,
  },
  {
    path: 'add',
    element: <CreatePost />,
  },
  {
    path: ':id',
    element: <DetailPost />,
  },
];

export default postRoutes;