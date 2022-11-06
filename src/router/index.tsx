import { createBrowserRouter } from 'react-router-dom';
import Home from '../views/Home';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/dashboard',
    element: <Home />,
  },
]);
