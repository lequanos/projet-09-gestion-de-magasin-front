import { Typography, Card, CardContent, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { StoreDto } from '@/models/store';
import StoreForm, { StoreFormValues } from '../StoreForm';

type StoreModalContentProps = {
  activeStep: number;
  notFound: boolean;
  searchedStore: string;
  store?: StoreDto;
  isFetching: boolean;
};

function StoreModalContent({
  activeStep,
  notFound,
  searchedStore,
  store,
  isFetching,
}: StoreModalContentProps) {
  // Hooks
  const { t } = useTranslation('translation');
  const { setValue } = useFormContext<StoreFormValues>();

  // States

  // Queries

  // useEffect
  useEffect(() => {
    setValue('name', store?.name || '');
    setValue('city', store?.city || '');
    setValue('address', store?.address || '');
    setValue('postcode', store?.postcode || '');
    setValue('siren', store?.siren || '');
    setValue('siret', store?.siret || '');
  }, [store]);

  return (
    <>
      {isFetching && <CircularProgress />}
      {activeStep === 0 && notFound && (
        <Typography color="error">
          {t('Store.Modal.NotFoundStore', { searchedStore })}
        </Typography>
      )}
      {activeStep === 0 && store && (
        <Card className="store--modal-card">
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {store?.name || ''}
            </Typography>
          </CardContent>
        </Card>
      )}
      {activeStep === 1 && <StoreForm store={store} readOnly={false} />}
    </>
  );
}

export default StoreModalContent;
