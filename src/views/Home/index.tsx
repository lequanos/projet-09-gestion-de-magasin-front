import { Alert, AlertTitle, Snackbar, Typography } from '@mui/material';
import { SyntheticEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import './Home.scss';
import logo from '../../assets/logo.svg';
import RSInput from '../../components/RSInput';
import RSForm from '../../components/RSForm';
import RSDivider from '../../components/RSDivider';
import RSButton from '../../components/RSButton';
import { useLoginMutation } from '../../hooks/useService';
import { IErrorResponse } from '../../services/api/interfaces/error.interface';
import { LoginResponse } from '../../services/auth/interfaces/loginResponse.interface';

function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState<
    'error' | 'warning' | 'info' | 'success'
  >('info');
  const [errorTitle, setErrorTitle] = useState('Error_Title');
  const [errorMessage, setErrorMessage] = useState('General_Label');
  const { t } = useTranslation('translation');
  const loginMutation = useLoginMutation({ email, password });

  const handleLogin = (): void => {
    loginMutation.mutate(undefined, {
      onSuccess: (response) => {
        const { ok } = response;
        if (!ok) {
          const loginError = response as IErrorResponse<LoginResponse>;
          setSeverity(loginError.formatted.type);
          setErrorMessage(loginError.formatted.errorDefault);
          setErrorTitle(loginError.formatted.title);
          setOpen(true);
        }
      },
    });
  };

  const handleCloseSnackbar = (
    event?: SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div className="home">
      <div className="home--app">
        <img src={logo} className="home--app-picture" />
      </div>
      <div className="home--login">
        <RSForm className="home--login-form">
          <Typography align="center" className="home--login-title">
            {t('Home.Login')}
          </Typography>
          <RSInput
            label={t('Home.Email')}
            type="email"
            value={email}
            setValue={setEmail}
            className="home--login-input"
          />
          <RSInput
            label={t('Home.Password')}
            type="password"
            value={password}
            setValue={setPassword}
            className="home--login-input"
          />
          <RSButton onClick={handleLogin}>{t('Home.Login')}</RSButton>
          <RSDivider>{t('Home.Or').toUpperCase()}</RSDivider>
        </RSForm>
      </div>
      <Snackbar
        open={open}
        autoHideDuration={1500}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={severity}>
          <AlertTitle>{t(`Error.${errorTitle}`)}</AlertTitle>
          {t(`Error.${errorMessage}`)}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Home;
