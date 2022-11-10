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
  useUserContext,
} from '../../hooks';
import { useForm } from 'react-hook-form';

function Home() {
  // Hooks
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm();
  const [toastValues, setToastValues] = useToast(
    'Error.Error_Title',
    'Error.General_Label',
    'info',
  );
  const [, setAccessToken] = useLocalStorage('access_token');
  const [, setRefreshToken] = useLocalStorage('refresh_token');
  const { user, setUser } = useUserContext();
  const { t } = useTranslation('translation');

  // States
  const [enableMailQuery, setEnableMailQuery] = useState(false);
  const [formStatus, setFormStatus] = useState<'login' | 'becomeCustomer'>(
    'login',
  );
  const { firstname, lastname, email, password } = watch();

  // Query Hooks
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

  // Methods
  const handleLogin = (): void => {
    if (formStatus === 'login') {
      loginMutation.mutate(undefined, {
        onSuccess: (response) => {
          const { ok } = response;
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
          setUser({
            ...user,
            ...loginResponse.data,
            logged: true,
            password: '',
          });
          setToastValues({
            title: 'Home.Success_Login_Title',
            message: 'Home.Success_Login',
            severity: 'success',
          });
          navigate('/dashboard');
          resetForm();
        },
      });
    } else {
      setEnableMailQuery(true);
    }
  };

  const handleFormToggle = (): void => {
    if (formStatus === 'login') {
      setFormStatus('becomeCustomer');
    } else {
      setFormStatus('login');
    }
  };

  const resetForm = () => {
    setValue('firstname', '');
    setValue('lastname', '');
    setValue('email', '');
    setValue('password', '');
  };

  return (
    <div className="home">
      <div className="home--app">
        <img src={logo} className="home--app-picture" />
      </div>
      <div className="home--login">
        <RSForm
          className="home--login-form"
          onSubmit={handleSubmit(handleLogin)}
        >
          <Typography align="center" className="home--login-title">
            {t('Home.Login')}
          </Typography>
          <RSInput
            label={t('Home.Email')}
            type="email"
            name="email"
            className="home--login-input"
            control={control}
            errors={errors}
          />
          <Collapse in={formStatus === 'login'} sx={{ width: '100%' }}>
            <RSInput
              label={t('Home.Password')}
              type="password"
              name="password"
              className="home--login-input"
              control={control}
              errors={errors}
              rules={
                formStatus === 'becomeCustomer'
                  ? {
                      required: false,
                    }
                  : undefined
              }
            />
          </Collapse>
          <Collapse in={formStatus === 'becomeCustomer'}>
            <RSInput
              label={t('Home.FirstName')}
              name="firstname"
              className="home--login-input"
              control={control}
              errors={errors}
              rules={
                formStatus === 'login'
                  ? {
                      required: false,
                    }
                  : undefined
              }
            />
            <RSInput
              label={t('Home.LastName')}
              name="lastname"
              className="home--login-input"
              control={control}
              errors={errors}
              rules={
                formStatus === 'login'
                  ? {
                      required: false,
                    }
                  : undefined
              }
            />
          </Collapse>
          <RSButton className="home--login-btn" type="submit">
            {formStatus === 'login'
              ? t('Home.AccessAccount')
              : t('Home.AskDetails')}
          </RSButton>
          <RSDivider>{t('Home.Or').toUpperCase()}</RSDivider>
          <RSButton
            onClick={handleFormToggle}
            className="home--login-customer"
            variant="outlined"
          >
            {formStatus === 'login'
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
