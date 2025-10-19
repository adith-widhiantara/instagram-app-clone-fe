import { RouteObject } from 'react-router-dom';
import ListPeople from '@/pages/people/ListPeople';

const peopleRoutes: RouteObject[] = [
  {
    index: true,
    element: <ListPeople />,
  },
];

export default peopleRoutes;