import { Container, Card, CardContent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  DataGrid,
  GridRowParams,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import { useState } from 'react';

import './User.scss';
import UserModal from './UserModal';
import DeleteUserModal from './DeleteUserModal';
import UserDrawer from './UserDrawer';
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
import { UserDto } from '@/models/user';

function User() {
  // Hooks
  const { t } = useTranslation('translation');
  const { toast } = useToastContext();
  const { accessToken } = useAccessToken();
  const { user } = useUserContext();

  // States
  const [tableData, setTableData] = useState<UserDto[]>([]);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userId, setUserId] = useState(0);

  // Queries
  const { isFetching, refetch } = useGetAllQuery<UserDto[]>(
    'user',
    accessToken,
    {
      params: {
        select: 'firstname,lastname,email,role,isActive',
        nested: 'role.name',
      },
    },
    true,
    onSuccess<UserDto[]>(
      (response: ISuccessResponse<UserDto[]>) => setTableData(response.data),
      toast,
      'User',
    ),
  );

  const deactivateMutation = useDeactivateMutation<UserDto>(
    'user',
    accessToken,
  );

  const reactivateMutation = useReactivateMutation<UserDto>(
    'user',
    accessToken,
  );

  // Methods
  /**
   * Open modal to add a user
   */
  const openAddUserModal = () => {
    setOpen(true);
  };

  /**
   * Open user detail drawer
   */
  const handleOpenUserDetail = (params: GridRowParams) => {
    setUserId(params.row.id);
    setDrawerOpen(true);
  };

  /**
   * Open delete user modal
   */
  const handleDeleteUser = ({ id }: GridRowParams) => {
    setOpenDelete(true);
    setUserId(Number(id));
  };

  /**
   * Toggle active status of user
   */
  const handleToggleUserActiveStatus = ({ id, row }: GridRenderCellParams) => {
    const variables = {
      id: id as string,
    };
    const options = {
      onSuccess: onSuccess<UserDto>(refetch, toast, 'User'),
    };
    if (row.isActive) {
      deactivateMutation.mutate(variables, options);
    } else {
      reactivateMutation.mutate(variables, options);
    }
  };

  return (
    <>
      <Container className="user--container">
        <RSButton
          className="user--add-btn"
          color="primary"
          onClick={openAddUserModal}
          permissions={[Permission.MANAGE_ALL, Permission.MANAGE_USER]}
          startIcon="add"
        >
          {t('User.AddUser')}
        </RSButton>
        <Card className="user--table-container">
          <CardContent className="user--table">
            <DataGrid
              rows={tableData}
              columns={getColumns(
                tableData,
                'user',
                (user.role as RoleDto).permissions,
                handleOpenUserDetail,
                handleDeleteUser,
                handleToggleUserActiveStatus,
              )}
              loading={isFetching}
              disableSelectionOnClick
              autoPageSize
            />
          </CardContent>
        </Card>
      </Container>
      <UserModal open={open} setOpen={setOpen} refetch={refetch} />
      <UserDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        id={userId}
        refetch={refetch}
      />
      <DeleteUserModal
        open={openDelete}
        setOpen={setOpenDelete}
        id={userId}
        refetch={refetch}
      />
    </>
  );
}

export default User;
