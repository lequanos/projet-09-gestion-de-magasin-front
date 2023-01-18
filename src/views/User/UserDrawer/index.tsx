import { Drawer, CircularProgress, Box } from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  RefetchOptions,
  RefetchQueryFilters,
  QueryObserverResult,
} from '@tanstack/react-query';

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
  useGetAllQuery,
} from '@/hooks';
import { RSButton } from '@/components/RS';
import { isRoleDto } from '@/helpers/typeguards';
import { AisleDto } from '@/models/aisle';

type UserDrawerProps = {
  drawerOpen: boolean;
  setDrawerOpen: Dispatch<SetStateAction<boolean>>;
  id: number;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
  ) => Promise<
    QueryObserverResult<
      ISuccessResponse<UserDto[]> | IErrorResponse<UserDto[] | undefined>,
      unknown
    >
  >;
};

function UserDrawer({
  drawerOpen,
  setDrawerOpen,
  id,
  refetch,
}: UserDrawerProps) {
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
      role: 1,
    },
  });
  const updateUserPayload = methods.watch();

  // States
  const [user, setUser] = useState<UserDto>();
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [aisles, setAisles] = useState<AisleDto[]>([]);
  // Queries
  const { isFetching } = useGetOneQuery<UserDto>(
    'user',
    id.toString(),
    accessToken,
    {
      params: {
        select: 'firstname,lastname,email,password,pictureUrl,role,aisles',
        nested: 'aisles.id,role.id',
      },
    },
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

  useGetAllQuery<RoleDto[]>(
    'role',
    accessToken,
    {
      params: { select: 'name' },
    },
    true,
    (response) => {
      const { ok, data, status } = response;

      if ([401, 403].includes(status)) {
        throw new Response('', { status });
      }

      if (!ok) {
        const error = response as IErrorResponse<RoleDto[]>;
        toast[error.formatted.type](
          error.formatted.errorDefault,
          error.formatted.title,
        );
        return;
      }

      if (data) {
        setRoles(data.filter((role) => role.name !== 'super admin'));
      }
    },
  );

  useGetAllQuery<AisleDto[]>(
    'aisle',
    accessToken,
    {
      params: { select: 'name' },
    },
    true,
    (response) => {
      const { ok, data, status } = response;

      if ([401, 403].includes(status)) {
        throw new Response('', { status });
      }

      if (!ok) {
        const error = response as IErrorResponse<AisleDto[]>;
        toast[error.formatted.type](
          error.formatted.errorDefault,
          error.formatted.title,
        );
        return;
      }

      if (data) {
        setAisles(data);
      }
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
            updateUserError.formatted.errorDefault,
            updateUserError.formatted.title,
            t(`Common.User`),
          );
          return;
        }
        toast.success(
          'User.Form.Success_Update',
          'User.Form.Success_Update_Title',
        );
        methods.reset();
        handleCloseDrawer();
        refetch();
      },
    });
  };

  // useEffect
  useEffect(() => {
    methods.setValue('firstname', user?.firstname || '');
    methods.setValue('lastname', user?.lastname || '');
    methods.setValue('email', user?.email || '');
    methods.setValue('password', user?.password || '');
    if (aisles.length) {
      methods.setValue(
        'aisles',
        user?.aisles?.length
          ? (user.aisles
              .map((aisle) => aisle.id)
              .filter((id) => !!id) as number[])
          : [],
      );
    }
    if (roles.length) {
      methods.setValue(
        'role',
        isRoleDto(user?.role) ? user?.role.id || 1 : user?.role || 1,
      );
    }
  }, [user, roles, aisles]);

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
                roles={roles}
                aisles={aisles}
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
