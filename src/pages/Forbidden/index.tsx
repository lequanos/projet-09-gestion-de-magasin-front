import { Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { RSButton } from '@/components/RS';

import './Forbidden.scss';

function Forbidden() {
  // Hooks
  const { t } = useTranslation('translation');
  const navigate = useNavigate();

  // Methods
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Container className="forbidden">
      <Typography variant="h1" className="forbidden--title">
        403
      </Typography>
      <Typography variant="h5">{t('Forbidden.Subtitle')}</Typography>
      <RSButton variant="outlined" color="secondary" onClick={handleBack}>
        {t('Forbidden.Back')}
      </RSButton>
    </Container>
  );
}

export default Forbidden;
