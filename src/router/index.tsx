import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '../views/Dashboard';
import Home from '../views/Home';
import Layout from '../components/Layout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    element: <Layout />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
]);
