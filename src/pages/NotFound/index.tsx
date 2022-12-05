import { Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { RSButton } from '@/components/RS';

import './NotFound.scss';

function NotFound() {
  // Hooks
  const { t } = useTranslation('translation');
  const navigate = useNavigate();

  // Methods
  /**
   * Go back to the previous history stack entry
   */
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Container className="notfound">
      <Typography variant="h1" className="notfound--title">
        404
      </Typography>
      <Typography variant="h5">{t('NotFound.Subtitle')}</Typography>
      <RSButton variant="outlined" color="secondary" onClick={handleBack}>
        {t('NotFound.Back')}
      </RSButton>
    </Container>
  );
}

export default NotFound;
