import { Collapse, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { useForm } from 'react-hook-form';

import './Home.scss';
import logo from '@/assets/logo.svg';
import { RSInput, RSForm, RSDivider, RSButton, RSToast } from '@/components/RS';
import { IErrorResponse } from '@/services/api/interfaces/error.interface';
import { LoginResponse } from '@/services/auth/interfaces/authResponse.interface';
import { ISuccessResponse } from '@/services/api/interfaces/success.interface';
import {
  useLoginMutation,
  useGetSubscriptionMail,
  useUserContext,
  useToastContext,
  useAccessToken,
} from '@/hooks';

export type LoginFormValues = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

function Home() {
  // Hooks
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormValues>({
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
    },
  });
  const { toast } = useToastContext();
  const { setAccessToken } = useAccessToken();
  const { user, setUser } = useUserContext();
  const { t } = useTranslation('translation');
  const navigate = useNavigate();

  // States
  const [enableMailQuery, setEnableMailQuery] = useState(false);
  const [formStatus, setFormStatus] = useState<'login' | 'becomeCustomer'>(
    'login',
  );
  const { firstname, lastname, email, password } = watch();

  // Queries
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
        toast[mailError.formatted.type](
          mailError.formatted.errorDefault,
          mailError.formatted.title,
        );
        return;
      }
      toast.success('Home.Success_Mail', 'Home.Success_Mail_Title');
    },
  );

  // Methods
  const handleLogin = (): void => {
    if (formStatus === 'login') {
      loginMutation.mutate(undefined, {
        onSuccess: (response) => {
          const { ok } = response;
          if (!ok) {
            const loginError = response as IErrorResponse<LoginResponse>;
            toast[loginError.formatted.type](
              loginError.formatted.errorDefault,
              loginError.formatted.title,
            );
            return;
          }
          const loginResponse = response as ISuccessResponse<LoginResponse>;
          setAccessToken(loginResponse.data.access_token);
          setUser({
            ...user,
            ...jwtDecode(loginResponse.data.access_token),
            refreshToken: loginResponse.data.refresh_token,
            logged: true,
            password: '',
          });
          toast.success('Home.Success_Login', 'Home.Success_Login_Title');
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
          <Collapse in={formStatus === 'login'}>
            <Typography align="center" className="home--login-title">
              {t('Home.Login')}
            </Typography>
          </Collapse>
          <Collapse in={formStatus === 'becomeCustomer'}>
            <Typography align="center" className="home--login-title">
              {t('Home.BecomeCustomer')}
            </Typography>
          </Collapse>
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
      <RSToast />
    </div>
  );
}

export default Home;
