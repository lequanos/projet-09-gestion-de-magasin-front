import { Backdrop, Fade, Box, Typography, Dialog } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import './Dashboard.scss';
import { isRoleDto } from '../../helpers/typeguards';
import { useGetAllQuery, useUserContext, useAccessToken } from '../../hooks';
import { GetAllStoreResponse } from '../../services/store/interfaces/getAllStoreReponse.interface';
import { RSDivider, RSForm } from '../../components/RS';
import RSSelect from '../../components/RS/RSSelect';
import { useForm } from 'react-hook-form';

function Dashboard() {
  // Hooks
  const { user } = useUserContext();
  const { accessToken } = useAccessToken();
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
  const [stores, setStores] = useState<GetAllStoreResponse>([]);

  // Queries
  useGetAllQuery<GetAllStoreResponse>('store', accessToken, (data) => {
    setStores(data.pages[0].data);
  });

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
    console.log(1);
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
            </RSForm>
            <RSDivider>{t('Dashboard.Modal.Or').toUpperCase()}</RSDivider>
          </Box>
        </Fade>
      </Dialog>
    </div>
  );
}

export default Dashboard;
