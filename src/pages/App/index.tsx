import { Outlet } from 'react-router-dom';
import Header from '@/views/Header';

import './App.scss';
import { RSToast } from '@/components/RS';

function App() {
  return (
    <>
      <Header />
      <div className="app">
        <Outlet />
      </div>
      <RSToast />
    </>
  );
}

export default App;
