import { Backdrop, Fade, Box, Typography, Dialog } from '@mui/material';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import jwtDecode from 'jwt-decode';

import '../Dashboard.scss';
import {
  useUserContext,
  useAccessToken,
  useSelectStoreMutation,
  useToastContext,
  useSearchStores,
} from '@/hooks';
import { RSAutocomplete, RSButton, RSDivider, RSForm } from '@/components/RS';
import { IErrorResponse, ISuccessResponse } from '@/services/api/interfaces';
import { SelectStoreResponse } from '@/services/auth/interfaces/authResponse.interface';
import { StoreDto } from '@/models/store';

export type SelectStoreFormValues = {
  selectedStore: number;
};

function DashboardModal() {
  // Hooks
  const { user, setUser } = useUserContext();
  const { accessToken, setAccessToken } = useAccessToken();
  const { toast } = useToastContext();
  const { t } = useTranslation('translation');
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<SelectStoreFormValues>({
    defaultValues: {
      selectedStore: 0,
    },
  });

  const { selectedStore } = watch();

  // States
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('a');
  const [enabledSearchStores, setEnabledSearchStores] = useState(false);
  const [stores, setStores] = useState<StoreDto[]>([]);

  // Queries
  const selectStoreMutation = useSelectStoreMutation(
    { store: selectedStore },
    accessToken || '',
  );
  useSearchStores(
    searchValue,
    enabledSearchStores,
    accessToken,
    ({ ok, data }) => {
      if (ok && data) {
        setStores(data);
        setEnabledSearchStores(false);
      }
    },
  );

  // Methods
  /**
   * Called when clicked outside of the modal
   */
  const handleClose = () => {
    setOpen(true);
  };

  /**
   * Call api with the selected store
   */
  const handleSelectStore = () => {
    selectStoreMutation.mutate(undefined, {
      onSuccess: (response) => {
        const { ok, status } = response;

        if ([401, 403].includes(status)) {
          throw new Response('', { status });
        }

        if (!ok) {
          const selectStoreError =
            response as IErrorResponse<SelectStoreResponse>;

          toast[selectStoreError.formatted.type](
            selectStoreError.formatted.errorDefault,
            selectStoreError.formatted.title,
          );
          return;
        }

        const selectStoreResponse =
          response as ISuccessResponse<SelectStoreResponse>;
        setAccessToken(selectStoreResponse.data.access_token);
        setUser({
          ...user,
          ...jwtDecode(selectStoreResponse.data.access_token),
        });
        sessionStorage.setItem('accessDashboard', JSON.stringify(true));
        setOpen(false);
      },
    });
  };

  /**
   * Close the modal and save the choice of not selecting a store to session storage
   */
  const handleAccessDashboard = () => {
    setOpen(!open);
    sessionStorage.setItem('accessDashboard', JSON.stringify(true));
  };

  /**
   * Search for store on api
   */
  const handleInputChange = (
    _event: SyntheticEvent<Element, Event>,
    value: string,
  ) => {
    setSearchValue(value);

    if (value.length >= 3) {
      setEnabledSearchStores(true);
    } else {
      setEnabledSearchStores(false);
      setStores([]);
    }
  };

  // useEffect
  useEffect(() => {
    const accessDashboard = JSON.parse(
      sessionStorage.getItem('accessDashboard') || 'false',
    );

    if (!user.store && !accessDashboard) {
      setOpen(true);
    }
  }, []);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        className="dashboard--modal"
      >
        <Fade in={open}>
          <Box>
            <Typography variant="h6" component="h2" color="primary">
              {t('Dashboard.Modal.SelectStore')}
            </Typography>
            <RSForm onSubmit={handleSubmit(handleSelectStore)}>
              <RSAutocomplete
                label="Dashboard.Modal.SearchStores"
                name="selectedStore"
                errors={errors}
                options={stores}
                control={control}
                className="dashboard--modal-select"
                onInputChange={handleInputChange}
              />
              <RSButton type="submit">{t('Dashboard.Modal.Submit')}</RSButton>
            </RSForm>
            <RSDivider>{t('Dashboard.Modal.Or').toUpperCase()}</RSDivider>
            <RSButton
              sx={{ marginTop: 0 }}
              variant="outlined"
              onClick={handleAccessDashboard}
            >
              {t('Dashboard.Modal.AccessDashboard')}
            </RSButton>
          </Box>
        </Fade>
      </Dialog>
    </div>
  );
}

export default DashboardModal;
