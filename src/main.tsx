import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CssBaseline } from '@mui/material';

import './i18n';
import { ContextProvider as UserContextProvider } from './hooks';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Home from './pages/Home';
import App from './pages/App';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';
import Forbidden from './pages/Forbidden';
import Dashboard from './views/Dashboard';
import Product from './views/Product';
import Supplier from './views/Supplier';
import Store from './views/Store';
import Aisle from './views/Aisle';
import User from './views/User';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4578AD',
      dark: '#345A83',
      light: '#7CA2CB',
    },
    secondary: {
      main: '#FAE398',
      dark: '#F6CB3C',
      light: '#FCEFC5',
    },
  },
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <UserContextProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <BrowserRouter basename={import.meta.env.BASENAME}>
            <CssBaseline />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/" element={<App />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="store" element={<Store />} />
                <Route path="product" element={<Product />} />
                <Route path="supplier" element={<Supplier />} />
                <Route path="aisle" element={<Aisle />} />
                <Route path="user" element={<User />} />
              </Route>
              <Route path="/401" element={<Unauthorized />} />
              <Route path="/403" element={<Forbidden />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={true} />
      </QueryClientProvider>
    </UserContextProvider>
  </React.StrictMode>,
);
