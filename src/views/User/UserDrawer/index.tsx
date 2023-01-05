import { Drawer, CircularProgress, Box } from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import '../User.scss';
import UserForm, { UserFormValues } from '../UserForm';
import { IErrorResponse, ISuccessResponse } from '@/services/api/interfaces';
import { UserDto, UserDtoPayload } from '@/models/user';
import { Permission, RoleDto } from '@/models/role';
import {
  useAccessToken,
  useGetOneQuery,
  useUserContext,
  useToastContext,
  useUpdateMutation,
} from '@/hooks';
import { RSButton } from '@/components/RS';
import { isRoleDto } from '@/helpers/typeguards';

type UserDrawerProps = {
  drawerOpen: boolean;
  setDrawerOpen: Dispatch<SetStateAction<boolean>>;
  id: number;
};

function UserDrawer({ drawerOpen, setDrawerOpen, id }: UserDrawerProps) {
  // Hooks
  const { accessToken } = useAccessToken();
  const { t } = useTranslation('translation');
  const { user: loggedUser } = useUserContext();
  const { toast } = useToastContext();
  const methods = useForm<UserFormValues>({
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      aisles: [],
      role: undefined,
    },
  });
  const updateUserPayload = methods.watch();

  // States
  const [user, setUser] = useState<UserDto>();

  // Queries
  const { isFetching } = useGetOneQuery<UserDto>(
    'user',
    id.toString(),
    accessToken,
    undefined,
    drawerOpen,
    (response) => {
      const { ok, status } = response;

      if ([401, 403].includes(status)) {
        throw new Response('', { status });
      }

      if (!ok) {
        const getUserError = response as IErrorResponse<UserDto>;

        toast[getUserError.formatted.type](
          getUserError.formatted.errorDefault,
          getUserError.formatted.title,
        );
        return handleCloseDrawer();
      }

      const getUserResponse = response as ISuccessResponse<UserDto>;
      setUser(getUserResponse.data);
    },
  );

  const updateUserMutation = useUpdateMutation<UserDtoPayload, UserDto>(
    {
      toUpdate: {
        body: {
          firstname: updateUserPayload.firstname,
          lastname: updateUserPayload.lastname,
          email: updateUserPayload.email,
          aisles: [...updateUserPayload.aisles],
          role: updateUserPayload.role,
          id: id.toString(),
          pictureUrl: user?.pictureUrl || '',
        },
      },
    },
    'user',
    accessToken,
  );

  // Methods
  /**
   * Close the drawer
   */
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setUser(undefined);
  };

  /**
   * Submit update user form
   */
  const handleSubmitForm = () => {
    methods.handleSubmit(handleUpdateUser)();
  };

  /**
   * Post user to backend API
   */
  const handleUpdateUser = () => {
    updateUserMutation.mutate(undefined, {
      onSuccess: (response) => {
        const { ok, status } = response;

        if ([401, 403].includes(status)) {
          throw new Response('', { status });
        }

        if (!ok) {
          const updateUserError = response as IErrorResponse<UserDto>;
          toast[updateUserError.formatted.type](
            t(updateUserError.formatted.errorDefault as string, {
              name: t(`Common.User`),
            }),
            updateUserError.formatted.title,
          );
          return;
        }
        toast.success(
          'User.Form.Success_Update',
          'User.Form.Success_Update_Title',
        );
        methods.reset();
        handleCloseDrawer();
      },
    });
  };

  // useEffect
  useEffect(() => {
    methods.setValue('firstname', user?.firstname || '');
    methods.setValue('lastname', user?.lastname || '');
    methods.setValue('email', user?.email || '');
    methods.setValue('password', user?.password || '');
    methods.setValue('aisles', user?.aisles || []);
    methods.setValue(
      'role',
      isRoleDto(user?.role) ? user?.role.id : user?.role,
    );
  }, [user]);

  return (
    <Drawer anchor="right" open={drawerOpen} onClose={handleCloseDrawer}>
      <FormProvider {...methods}>
        <Box className="user--drawer-content">
          {isFetching ? (
            <CircularProgress />
          ) : (
            <>
              <UserForm
                user={user}
                readOnly={
                  !(loggedUser.role as RoleDto).permissions.some((p) =>
                    [Permission.MANAGE_ALL, Permission.MANAGE_USER].includes(p),
                  )
                }
                update
              />
              <RSButton
                type="submit"
                permissions={[Permission.MANAGE_ALL, Permission.MANAGE_USER]}
                onClick={handleSubmitForm}
              >
                {t('User.Form.Save')}
              </RSButton>
            </>
          )}
        </Box>
      </FormProvider>
    </Drawer>
  );
}

export default UserDrawer;
