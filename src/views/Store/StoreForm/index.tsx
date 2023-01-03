import { RSForm, RSInput } from '@/components/RS';
import { Box } from '@mui/material';

import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { StoreDto, StoreDtoPayload } from '@/models/store';

type StoreFormProps = {
  store?: StoreDtoPayload | StoreDto;
  readOnly?: boolean;
};

export type StoreFormValues = {
  name: string;
  address: string;
  postcode: string;
  city: string;
  siren: string;
  siret: string;
};

function StoreForm({ store, readOnly = true }: StoreFormProps) {
  // Hooks
  const { t } = useTranslation('translation');
  const {
    control,
    formState: { errors },
  } = useFormContext<StoreFormValues>();

  return (
    <Box className="store--form">
      <Box
        className="store--form-picture"
        sx={{ backgroundImage: `url(${store?.pictureUrl})` }}
      />
      <RSForm className="store--form-form">
        <RSInput
          className="store--form-input"
          label={t('Store.Form.Name')}
          name="name"
          control={control}
          errors={errors}
          size="small"
          readOnly={readOnly}
        />
        <RSInput
          className="store--form-input"
          label={t('Store.Form.Address')}
          name="address"
          control={control}
          errors={errors}
          size="small"
          readOnly={readOnly}
        />
        <RSInput
          className="store--form-input"
          label={t('Store.Form.Postcode')}
          name="postcode"
          control={control}
          errors={errors}
          size="small"
          readOnly={readOnly}
        />
        <RSInput
          className="store--form-input"
          label={t('Store.Form.City')}
          name="city"
          control={control}
          errors={errors}
          size="small"
          readOnly={readOnly}
        />
        <RSInput
          className="store--form-input"
          label={t('Store.Form.Siren')}
          name="siren"
          control={control}
          errors={errors}
          size="small"
          readOnly={readOnly}
        />
        <RSInput
          className="store--form-input"
          label={t('Store.Form.Siret')}
          name="siret"
          control={control}
          errors={errors}
          size="small"
          readOnly={readOnly}
        />
      </RSForm>
    </Box>
  );
}

export default StoreForm;
