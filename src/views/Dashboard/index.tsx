import {
  Backdrop,
  Fade,
  Box,
  Typography,
  Dialog,
  MenuItem,
  Select,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import './Dashboard.scss';
import { isRoleDto } from '../../helpers/typeguards';
import { useGetAllQuery, useUserContext } from '../../hooks';
import { GetAllStoreResponse } from '../../services/store/interfaces/getAllStoreReponse.interface';

function Dashboard() {
  // Hooks
  const { user } = useUserContext();
  const { t } = useTranslation('translation');

  // States
  const [open, setOpen] = useState(false);
  const [stores, setStores] = useState<GetAllStoreResponse>([]);
  const [selectedStore, setSelectedStore] = useState('');

  // Queries
  useGetAllQuery<GetAllStoreResponse>(
    'store',
    JSON.parse(localStorage.getItem('access_token') || ''),
    (data) => {
      setStores(data.pages[0].data);
    },
  );

  // Methods
  /**
   * Called when clicked outside of the modal
   */
  const handleClose = () => {
    console.log('coucou');
  };

  /**
   * Called when select a store
   */
  const handleSelectStore = (e: SelectChangeEvent<string>) => {
    console.log(e.target.value);
    setSelectedStore(e.target.value);
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
            <Typography variant="h6" component="h2">
              {t('Dashboard.Modal.SelectStore')}
            </Typography>
            <Select
              value={selectedStore}
              label="Store"
              onChange={handleSelectStore}
            >
              {stores.map((store) => (
                <MenuItem key={store.id} value={store.id}>
                  {store.name}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Fade>
      </Dialog>
    </div>
  );
}

export default Dashboard;
