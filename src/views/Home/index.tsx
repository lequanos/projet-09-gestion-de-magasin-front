import { Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import './Home.scss';
import logo from '../../assets/logo.svg';
import RSInput from '../../components/RSInput';
import RSForm from '../../components/RSForm';
import RSDivider from '../../components/RSDivider';
import RSButton from '../../components/RSButton';
import { AuthService } from '../../services/auth/AuthService';

function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useTranslation('translation');

  const authService = new AuthService();

  const handleLogin = async (): Promise<void> => {
    const response = await authService.login({ email, password });
    console.log(response);
  };

  return (
    <div className="home">
      <div className="home--app">
        <img src={logo} className="home--app-picture" />
      </div>
      <div className="home--login">
        <RSForm className="home--login-form">
          <Typography align="center" className="home--login-title">
            {t('home.Login')}
          </Typography>
          <RSInput
            label={t('home.Email')}
            type="email"
            value={email}
            setValue={setEmail}
          />
          <RSInput
            label={t('home.Password')}
            type="password"
            value={password}
            setValue={setPassword}
          />
          <RSButton onClick={handleLogin}>{t('home.Login')}</RSButton>
          <RSDivider>{t('home.Or').toUpperCase()}</RSDivider>
        </RSForm>
      </div>
    </div>
  );
}

export default Home;
