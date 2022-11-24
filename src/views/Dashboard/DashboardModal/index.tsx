import { Backdrop, Fade, Box, Typography, Dialog } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import jwtDecode from 'jwt-decode';

import '../Dashboard.scss';
import {
  useUserContext,
  useAccessToken,
  useSelectStoreMutation,
} from '@/hooks';
import {
  RSButton,
  RSDivider,
  RSForm,
  RSSelect,
  ToastValues,
} from '@/components/RS';
import { IErrorResponse, ISuccessResponse } from '@/services/api/interfaces';
import { GetAllStoreResponse } from '@/services/store/interfaces/getAllStoreReponse.interface';
import { SelectStoreResponse } from '@/services/auth/interfaces/authResponse.interface';

type DashboardModalProps = {
  setToastValues: ({
    title,
    message,
    severity,
    open,
  }: Partial<ToastValues>) => void;
  stores: GetAllStoreResponse;
};

function DashboardModal({ setToastValues, stores }: DashboardModalProps) {
  // Hooks
  const { user, setUser } = useUserContext();
  const { accessToken, setAccessToken } = useAccessToken();
  const { t } = useTranslation('translation');
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm();

  const { selectedStore } = watch();

  // States
  const [open, setOpen] = useState(false);

  // Queries
  const selectStoreMutation = useSelectStoreMutation(
    { store: selectedStore },
    accessToken || '',
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
          setToastValues({
            title: selectStoreError.formatted.title,
            message: selectStoreError.formatted.errorDefault,
            severity: selectStoreError.formatted.type,
          });
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

  const handleAccessDashboard = () => {
    setOpen(!open);
    sessionStorage.setItem('accessDashboard', JSON.stringify(true));
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
              <RSSelect
                id="select-store"
                label="Dashboard.Modal.Store"
                labelId="select-store-label"
                name="selectedStore"
                errors={errors}
                items={stores}
                control={control}
                className="dashboard--modal-select"
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
