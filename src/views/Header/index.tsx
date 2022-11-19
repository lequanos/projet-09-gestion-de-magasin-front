import { AppBar, Toolbar, Tabs } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SyntheticEvent, useState } from 'react';

import { RSButton } from '../../components/RS';
import { useUserContext, emptyUser } from '../../hooks/useUserContext';
import logo from '../../assets/logo.svg';
import './Header.scss';
import LinkTab from '../../components/LinkTab';

function Header() {
  // Hooks
  const { setUser } = useUserContext();
  const navigate = useNavigate();
  const { t } = useTranslation('translation');

  // States
  const [index, setIndex] = useState(0);

  // Methods
  /**
   * Handle logout
   */
  function logout() {
    setUser(emptyUser);
    localStorage.removeItem('user');
    navigate('/');
  }

  const handleChange = (
    _: SyntheticEvent<Element, Event>,
    newIndex: number,
  ) => {
    setIndex(newIndex);
  };

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
          <LinkTab label={t('Routes.Dashboard')} pathname="/dashboard" />
          <LinkTab label={t('Routes.Products')} pathname="/product" />
          <LinkTab label={t('Routes.Suppliers')} pathname="/supplier" />
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
