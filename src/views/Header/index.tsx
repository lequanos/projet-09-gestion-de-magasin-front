import { AppBar, Toolbar, Tabs } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SyntheticEvent, useEffect, useState } from 'react';

import './Header.scss';
import logo from '@/assets/logo.svg';

import { RSButton } from '@/components/RS';
import LinkTab from '@/components/Header/LinkTab';
import { useUserContext, emptyUser } from '@/hooks/useUserContext';
import { Permission } from '@/models/role';

const pathnameDictionary: { [key: string]: number } = {
  dashboard: 0,
  store: 1,
  product: 2,
  supplier: 3,
  aisle: 4,
  user: 5,
};

function Header() {
  // Hooks
  const { setUser } = useUserContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation('translation');

  // States
  const [index, setIndex] = useState(
    pathnameDictionary[location.pathname.substring(1)],
  );

  // Methods
  /**
   * Handle logout
   */
  function logout() {
    setUser(emptyUser);
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('accessDashboard');
    navigate('/');
  }

  /**
   * Handle tab change
   */
  const handleChange = (
    _: SyntheticEvent<Element, Event>,
    newIndex: number,
  ) => {
    setIndex(newIndex);
  };

  // useEffect
  useEffect(() => {
    setIndex(pathnameDictionary[location.pathname.substring(1)]);
  }, [location.pathname]);

  return (
    <AppBar className="header" component="header" position="static">
      <Toolbar className="header--toolbar">
        <div className="header--logo">
          <img src={logo} className="header--logo-pic" />
        </div>
        <Tabs
          centered
          className="header--tabs"
          value={index}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
        >
          <LinkTab
            label={t('Routes.Dashboard')}
            pathname="/dashboard"
            value={0}
          />
          <LinkTab
            label={t('Routes.Stores')}
            pathname="/store"
            value={1}
            permissions={[Permission.READ_ALL]}
          />
          <LinkTab
            label={t('Routes.Products')}
            pathname="/product"
            value={2}
            permissions={[Permission.READ_ALL, Permission.READ_PRODUCT]}
          />
          <LinkTab
            label={t('Routes.Suppliers')}
            pathname="/supplier"
            value={3}
            permissions={[Permission.READ_ALL, Permission.READ_SUPPLIER]}
          />
          <LinkTab
            label={t('Routes.Aisles')}
            pathname="/aisle"
            value={4}
            permissions={[Permission.READ_ALL, Permission.READ_AISLE]}
          />
          <LinkTab
            label={t('Routes.Users')}
            pathname="/user"
            value={5}
            permissions={[Permission.READ_ALL, Permission.READ_USER]}
          />
        </Tabs>
        <div className="header--btns">
          <RSButton
            className="header--logout-btn"
            variant="outlined"
            color="secondary"
            onClick={logout}
          >
            {t('Header.Logout')}
          </RSButton>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
