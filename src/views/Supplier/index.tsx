import { Container, Card, CardContent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  DataGrid,
  GridRowParams,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import { useState } from 'react';

import './Supplier.scss';
import SupplierModal from './SupplierModal';
import DeleteSupplierModal from './DeleteSupplierModal';
import SupplierDrawer from './SupplierDrawer';
import {
  useAccessToken,
  useGetAllQuery,
  useToastContext,
  useUserContext,
  useDeactivateMutation,
  useReactivateMutation,
} from '@/hooks';
import { ISuccessResponse } from '@/services/api/interfaces';
import { RSButton } from '@/components/RS';
import { getColumns, onSuccess } from '@/helpers/utils';
import { Permission, RoleDto } from '@/models/role';
import { SupplierDto } from '@/models/supplier';

function Supplier() {
  // Hooks
  const { t } = useTranslation('translation');
  const { toast } = useToastContext();
  const { accessToken } = useAccessToken();
  const { user } = useUserContext();

  // States
  const [tableData, setTableData] = useState<SupplierDto[]>([]);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [supplierId, setSupplierId] = useState(0);

  // Queries
  const { isFetching, refetch } = useGetAllQuery<SupplierDto[]>(
    'supplier',
    accessToken,
    {
      params: {
        select: 'name,city,siret,isActive',
      },
    },
    true,
    onSuccess<SupplierDto[]>(
      (response: ISuccessResponse<SupplierDto[]>) =>
        setTableData(response.data),
      toast,
      'Supplier',
    ),
  );

  const deactivateMutation = useDeactivateMutation<SupplierDto>(
    'supplier',
    accessToken,
  );

  const reactivateMutation = useReactivateMutation<SupplierDto>(
    'supplier',
    accessToken,
  );

  // Methods
  /**
   * Open modal to add a supplier
   */
  const openAddSupplierModal = () => {
    setOpen(true);
  };

  /**
   * Open supplier detail drawer
   */
  const handleOpenSupplierDetail = (params: GridRowParams) => {
    setSupplierId(params.row.id);
    setDrawerOpen(true);
  };

  /**
   * Open delete supplier modal
   */
  const handleDeleteSupplier = ({ id }: GridRowParams) => {
    setOpenDelete(true);
    setSupplierId(Number(id));
  };

  /**
   * Toggle active status of supplier
   */
  const handleToggleSupplierActiveStatus = ({
    id,
    row,
  }: GridRenderCellParams) => {
    const variables = {
      id: id as string,
    };
    const options = {
      onSuccess: onSuccess<SupplierDto>(refetch, toast, 'Supplier'),
    };
    if (row.isActive) {
      deactivateMutation.mutate(variables, options);
    } else {
      reactivateMutation.mutate(variables, options);
    }
  };

  return (
    <>
      <Container className="supplier--container">
        <RSButton
          className="supplier--add-btn"
          color="primary"
          onClick={openAddSupplierModal}
          permissions={[Permission.MANAGE_ALL, Permission.MANAGE_SUPPLIER]}
          startIcon="add"
        >
          {t('Supplier.AddSupplier')}
        </RSButton>
        <Card className="supplier--table-container">
          <CardContent className="supplier--table">
            <DataGrid
              rows={tableData}
              columns={getColumns(
                tableData,
                'supplier',
                (user.role as RoleDto).permissions,
                handleOpenSupplierDetail,
                handleDeleteSupplier,
                handleToggleSupplierActiveStatus,
              )}
              loading={isFetching}
              disableSelectionOnClick
              autoPageSize
            />
          </CardContent>
        </Card>
      </Container>
      <SupplierModal open={open} setOpen={setOpen} />
      <SupplierDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        id={supplierId}
        refetch={refetch}
      />
      <DeleteSupplierModal
        open={openDelete}
        setOpen={setOpenDelete}
        id={supplierId}
        refetch={refetch}
      />
    </>
  );
}

export default Supplier;
