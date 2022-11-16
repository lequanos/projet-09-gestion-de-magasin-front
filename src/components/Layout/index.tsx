import { Route, Routes } from 'react-router-dom';
import Dashboard from '../../views/Dashboard';
import Product from '../../views/Product';
import Supplier from '../../views/Supplier';
import Header from '../Header';

function Layout() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/product" element={<Product />} />
        <Route path="/supplier" element={<Supplier />} />
      </Routes>
    </>
  );
}

export default Layout;
