import { Backdrop, Fade, Box, Typography, Dialog } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import './Dashboard.scss';
import { isRoleDto } from '../../helpers/typeguards';
import {
  useGetAllQuery,
  useUserContext,
  useAccessToken,
  useSelectStoreMutation,
  useToast,
  useLocalStorage,
} from '../../hooks';
import { GetAllStoreResponse } from '../../services/store/interfaces/getAllStoreReponse.interface';
import { RSButton, RSDivider, RSForm } from '../../components/RS';
import RSSelect from '../../components/RS/RSSelect';
import { useForm } from 'react-hook-form';
import {
  IErrorResponse,
  ISuccessResponse,
} from '../../services/api/interfaces';
import { SelectStoreResponse } from '../../services/auth/interfaces/authResponse.interface';

function Dashboard() {
  // Hooks
  const { user } = useUserContext();
  const { accessToken, setAccessToken } = useAccessToken();
  const { t } = useTranslation('translation');
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm();
  const [, setToastValues] = useToast(
    'Error.Error_Title',
    'Error.General_Label',
    'info',
  );
  const [, setRefreshToken] = useLocalStorage('refresh_token');
  const { selectedStore } = watch();

  // States
  const [open, setOpen] = useState(false);
  const [stores, setStores] = useState<GetAllStoreResponse>([]);

  // Queries
  useGetAllQuery<GetAllStoreResponse>('store', accessToken, (data) => {
    setStores(data.pages[0].data || []);
  });
  const selectStoreMutation = useSelectStoreMutation(
    { store: selectedStore },
    accessToken,
  );

  // Methods
  /**
   * Called when clicked outside of the modal
   */
  const handleClose = () => {
    console.log('coucou');
  };

  /**
   * Call api with the selected store
   */
  const handleSelectStore = () => {
    selectStoreMutation.mutate(undefined, {
      onSuccess: (response) => {
        const { ok } = response;
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
        setRefreshToken(selectStoreResponse.data.refresh_token);
        setToastValues({
          title: 'Home.Success_Login_Title',
          message: 'Home.Success_Login',
          severity: 'success',
        });
      },
    });
  };

  // useEffect
  useEffect(() => {
    if (isRoleDto(user.role) && user.role.permissions.includes('READ_ALL')) {
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
          </Box>
        </Fade>
      </Dialog>
    </div>
  );
}

export default Dashboard;
