import { RSForm, RSInput } from '@/components/RS';
import { Box } from '@mui/material';

import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { SupplierDto, SupplierDtoPayload } from '@/models/supplier';

type SupplierFormProps = {
  supplier?: SupplierDtoPayload | SupplierDto;
  readOnly?: boolean;
};

export type SupplierFormValues = {
  name: string;
  address: string;
  postcode: string;
  city: string;
  siren: string;
  siret: string;
};

function SupplierForm({ supplier, readOnly = true }: SupplierFormProps) {
  // Hooks
  const { t } = useTranslation('translation');
  const {
    control,
    formState: { errors },
  } = useFormContext<SupplierFormValues>();

  return (
    <Box className="supplier--form">
      <Box
        className="supplier--form-picture"
        sx={{ backgroundImage: `url(${supplier?.pictureUrl})` }}
      />
      <RSForm className="supplier--form-form">
        <RSInput
          className="supplier--form-input"
          label={t('Supplier.Form.Name')}
          name="name"
          control={control}
          errors={errors}
          size="small"
          readOnly={readOnly}
        />
        <RSInput
          className="supplier--form-input"
          label={t('Supplier.Form.Address')}
          name="address"
          control={control}
          errors={errors}
          size="small"
          readOnly={readOnly}
        />
        <RSInput
          className="supplier--form-input"
          label={t('Supplier.Form.Postcode')}
          name="postcode"
          control={control}
          errors={errors}
          size="small"
          readOnly={readOnly}
          inputProps={{
            maxLength: 5,
          }}
        />
        <RSInput
          className="supplier--form-input"
          label={t('Supplier.Form.City')}
          name="city"
          control={control}
          errors={errors}
          size="small"
          readOnly={readOnly}
        />
        <RSInput
          className="supplier--form-input"
          label={t('Supplier.Form.Siren')}
          name="siren"
          control={control}
          errors={errors}
          size="small"
          readOnly={true}
        />
        <RSInput
          className="supplier--form-input"
          label={t('Supplier.Form.Siret')}
          name="siret"
          control={control}
          errors={errors}
          size="small"
          readOnly={true}
        />
      </RSForm>
    </Box>
  );
}

export default SupplierForm;
