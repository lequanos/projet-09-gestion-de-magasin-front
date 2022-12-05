import { Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { RSButton } from '@/components/RS';

import './Unauthorized.scss';

function Unauthorized() {
  // Hooks
  const { t } = useTranslation('translation');
  const navigate = useNavigate();

  // Methods
  const handleBackToLogin = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    navigate('/');
  };

  return (
    <Container className="unauthorized">
      <Typography variant="h1" className="unauthorized--title">
        401
      </Typography>
      <Typography variant="h5">{t('Unauthorized.Subtitle')}</Typography>
      <RSButton
        variant="outlined"
        color="secondary"
        onClick={handleBackToLogin}
      >
        {t('Unauthorized.Back')}
      </RSButton>
    </Container>
  );
}

export default Unauthorized;
