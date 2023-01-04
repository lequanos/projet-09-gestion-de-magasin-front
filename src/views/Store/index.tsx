import { Container, Card, CardContent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  DataGrid,
  GridRowParams,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import { useState } from 'react';

import './Store.scss';
import StoreModal from './StoreModal';
import DeleteStoreModal from './DeleteStoreModal';
import StoreDrawer from './StoreDrawer';
import {
  useAccessToken,
  useGetAllQuery,
  useToastContext,
  useUserContext,
  useDeactivateMutation,
  useReactivateMutation,
  useSelectStoreMutation,
} from '@/hooks';
import { IErrorResponse, ISuccessResponse } from '@/services/api/interfaces';
import { RSButton } from '@/components/RS';
import { getColumns, onSuccess } from '@/helpers/utils';
import { Permission, RoleDto } from '@/models/role';
import { StoreDto } from '@/models/store';
import { SelectStoreResponse } from '@/services/auth/interfaces/authResponse.interface';
import jwtDecode from 'jwt-decode';

function Store() {
  // Hooks
  const { t } = useTranslation('translation');
  const { toast } = useToastContext();
  const { accessToken, setAccessToken } = useAccessToken();
  const { user, setUser } = useUserContext();

  // States
  const [tableData, setTableData] = useState<StoreDto[]>([]);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [storeSiret, setStoreSiret] = useState('');
  const [storeId, setStoreId] = useState(0);

  // Queries
  const { isFetching, refetch } = useGetAllQuery<StoreDto[]>(
    'store',
    accessToken,
    {
      params: {
        select: 'name,city,siret,isActive',
      },
    },
    true,
    onSuccess<StoreDto[]>(
      (response: ISuccessResponse<StoreDto[]>) => setTableData(response.data),
      toast,
      'Store',
    ),
  );

  const deactivateMutation = useDeactivateMutation<StoreDto>(
    'store',
    accessToken,
  );

  const reactivateMutation = useReactivateMutation<StoreDto>(
    'store',
    accessToken,
  );

  const selectStoreMutation = useSelectStoreMutation(
    { store: 0 },
    accessToken || '',
  );

  // Methods
  /**
   * Open modal to add a store
   */
  const openAddStoreModal = () => {
    setOpen(true);
  };

  /**
   * Open store detail drawer
   */
  const handleOpenStoreDetail = (params: GridRowParams) => {
    setStoreSiret(params.row.siret);
    setStoreId(params.row.id);
    setDrawerOpen(true);
  };

  /**
   * Open delete store modal
   */
  const handleDeleteStore = ({ id }: GridRowParams) => {
    setOpenDelete(true);
    setStoreId(Number(id));
  };

  /**
   * Toggle active status of store
   */
  const handleToggleStoreActiveStatus = ({ id, row }: GridRenderCellParams) => {
    const variables = {
      id: id as string,
    };
    const options = {
      onSuccess: onSuccess<StoreDto>(refetch, toast, 'Store'),
    };
    if (row.isActive) {
      deactivateMutation.mutate(variables, options);
    } else {
      reactivateMutation.mutate(variables, options);
    }
  };

  /**
   * Change the selected store
   */
  const handleChangeStore = ({ id }: GridRowParams) => {
    selectStoreMutation.mutate(
      { store: id as number },
      {
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
          toast.success(
            'Store.Success_Change_Store',
            'Store.Success_Change_Store_Title',
          );
        },
      },
    );
  };

  return (
    <>
      <Container className="store--container">
        <RSButton
          className="store--add-btn"
          color="primary"
          onClick={openAddStoreModal}
          permissions={[Permission.MANAGE_ALL, Permission.MANAGE_STORE]}
          startIcon="add"
        >
          {t('Store.AddStore')}
        </RSButton>
        <Card className="store--table-container">
          <CardContent className="store--table">
            <DataGrid
              rows={tableData}
              columns={getColumns(
                tableData,
                'store',
                (user.role as RoleDto).permissions,
                handleOpenStoreDetail,
                handleDeleteStore,
                handleToggleStoreActiveStatus,
                handleChangeStore,
              )}
              loading={isFetching}
              disableSelectionOnClick
              autoPageSize
            />
          </CardContent>
        </Card>
      </Container>
      <StoreModal open={open} setOpen={setOpen} />
      <StoreDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        siret={storeSiret}
        id={storeId}
      />
      <DeleteStoreModal
        open={openDelete}
        setOpen={setOpenDelete}
        id={storeId}
        refetch={refetch}
      />
    </>
  );
}

export default Store;
