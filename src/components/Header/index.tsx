import { AppBar, Toolbar, Box, Tab, Tabs } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { RSButton } from '../RS';
import { useUserContext, emptyUser } from '../../hooks/useUserContext';
import logo from '../../assets/logo.svg';
import './Header.scss';

function Header() {
  // Hooks
  const { user, setUser } = useUserContext();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Methods
  /**
   * Handle logout
   */
  function logout() {
    setUser(emptyUser);
    localStorage.removeItem('user');
    navigate('/');
  }

  return (
    <AppBar className="header" component="header" position="static">
      <Toolbar>
        <Box>
          <img src={logo} className="home--app-picture" />
        </Box>
        <Tabs centered>
          <Tab label="Item One" />
          <Tab label="Item Two" />
          <Tab label="Item Three" />
        </Tabs>
        <RSButton variant="text" onClick={logout}>
          {t('Header.Logout')}
        </RSButton>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
