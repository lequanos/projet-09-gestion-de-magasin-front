import { Collapse, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import './Home.scss';
import logo from '../../assets/logo.svg';
import {
  RSInput,
  RSForm,
  RSDivider,
  RSButton,
  RSToast,
} from '../../components/RS';
import { IErrorResponse } from '../../services/api/interfaces/error.interface';
import { LoginResponse } from '../../services/auth/interfaces/loginResponse.interface';
import { ISuccessResponse } from '../../services/api/interfaces/success.interface';
import {
  useLocalStorage,
  useToast,
  useLoginMutation,
  useGetSubscriptionMail,
} from '../../hooks';

function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [enableMailQuery, setEnableMailQuery] = useState(false);
  const [formState, setFormState] = useState<'login' | 'becomeCustomer'>(
    'login',
  );
  const [toastValues, setToastValues] = useToast(
    'Error.Error_Title',
    'Error.General_Label',
    'info',
  );
  const [, setAccessToken] = useLocalStorage('access_token', '');
  const [, setRefreshToken] = useLocalStorage('refresh_token', '');

  const { t } = useTranslation('translation');
  const loginMutation = useLoginMutation({ email, password });
  useGetSubscriptionMail(
    {
      firstname,
      lastname,
      email,
    },
    enableMailQuery,
    (
      response: ISuccessResponse<string> | IErrorResponse<string | undefined>,
    ): void => {
      const { ok } = response;
      console.log(response);
      setEnableMailQuery(false);
      if (!ok) {
        const mailError = response as IErrorResponse<string>;
        setToastValues({
          title: mailError.formatted.title,
          message: mailError.formatted.errorDefault,
          severity: mailError.formatted.type,
        });
        return;
      }
      setToastValues({
        title: 'Home.Success_Mail_Title',
        message: 'Home.Success_Mail',
        severity: 'success',
      });
    },
  );
  const navigate = useNavigate();

  const handleLogin = (): void => {
    if (formState === 'login') {
      loginMutation.mutate(undefined, {
        onSuccess: (response) => {
          const { ok } = response;
          console.log(response);
          if (!ok) {
            const loginError = response as IErrorResponse<LoginResponse>;
            setToastValues({
              title: loginError.formatted.title,
              message: loginError.formatted.errorDefault,
              severity: loginError.formatted.type,
            });
            return;
          }
          const loginResponse = response as ISuccessResponse<LoginResponse>;
          setAccessToken(loginResponse.data.access_token);
          setRefreshToken(loginResponse.data.refresh_token);
          setToastValues({
            title: 'Home.Success_Login_Title',
            message: 'Home.Success_Login',
            severity: 'success',
          });
          navigate('/dashboard');
        },
      });
    } else {
      setEnableMailQuery(true);
    }
  };

  const handleFormToggle = (): void => {
    if (formState === 'login') {
      setFormState('becomeCustomer');
    } else {
      setFormState('login');
    }
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
          <Collapse in={formState === 'login'} sx={{ width: '100%' }}>
            <RSInput
              label={t('Home.Password')}
              type="password"
              value={password}
              setValue={setPassword}
              className="home--login-input"
            />
          </Collapse>
          <Collapse in={formState === 'becomeCustomer'}>
            <RSInput
              label={t('Home.FirstName')}
              value={firstname}
              setValue={setFirstname}
              className="home--login-input"
            />
            <RSInput
              label={t('Home.LastName')}
              value={lastname}
              setValue={setLastname}
              className="home--login-input"
            />
          </Collapse>
          <RSButton onClick={handleLogin} className="home--login-btn">
            {formState === 'login'
              ? t('Home.AccessAccount')
              : t('Home.AskDetails')}
          </RSButton>
          <RSDivider>{t('Home.Or').toUpperCase()}</RSDivider>
          <RSButton
            onClick={handleFormToggle}
            className="home--login-customer"
            variant="outlined"
          >
            {formState === 'login'
              ? t('Home.BecomeCustomer')
              : t('Home.SignIn')}
          </RSButton>
        </RSForm>
      </div>
      <RSToast toastValues={toastValues} setToastValues={setToastValues} />
    </div>
  );
}

export default Home;
