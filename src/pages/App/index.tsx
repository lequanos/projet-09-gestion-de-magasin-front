import { Outlet } from 'react-router-dom';
import Header from '@/views/Header';

import './App.scss';

function App() {
  return (
    <>
      <Header />
      <div className="app">
        <Outlet />
      </div>
    </>
  );
}

export default App;
