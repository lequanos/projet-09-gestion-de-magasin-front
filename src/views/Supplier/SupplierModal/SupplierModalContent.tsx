import { Typography, Card, CardContent, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { SupplierDto } from '@/models/supplier';
import SupplierForm, { SupplierFormValues } from '../SupplierForm';

type SupplierModalContentProps = {
  activeStep: number;
  notFound: boolean;
  searchedSupplier: string;
  supplier?: SupplierDto;
  isFetching: boolean;
};

function SupplierModalContent({
  activeStep,
  notFound,
  searchedSupplier,
  supplier,
  isFetching,
}: SupplierModalContentProps) {
  // Hooks
  const { t } = useTranslation('translation');
  const { setValue } = useFormContext<SupplierFormValues>();

  // States

  // Queries

  // useEffect
  useEffect(() => {
    setValue('name', supplier?.name || '');
    setValue('city', supplier?.city || '');
    setValue('address', supplier?.address || '');
    setValue('postcode', supplier?.postcode || '');
    setValue('siren', supplier?.siren || '');
    setValue('siret', supplier?.siret || '');
  }, [supplier]);

  return (
    <>
      {isFetching && <CircularProgress />}
      {activeStep === 0 && notFound && (
        <Typography color="error">
          {t('Supplier.Modal.NotFoundSupplier', { searchedSupplier })}
        </Typography>
      )}
      {activeStep === 0 && supplier && (
        <Card className="supplier--modal-card">
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {supplier?.name || ''}
            </Typography>
          </CardContent>
        </Card>
      )}
      {activeStep === 1 && (
        <SupplierForm supplier={supplier} readOnly={false} />
      )}
    </>
  );
}

export default SupplierModalContent;
