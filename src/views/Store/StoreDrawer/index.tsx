import { Drawer, CircularProgress, Box } from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import '../Store.scss';
import StoreForm, { StoreFormValues } from '../StoreForm';
import { IErrorResponse, ISuccessResponse } from '@/services/api/interfaces';
import { StoreDto, StoreDtoPayload } from '@/models/store';
import { Permission, RoleDto } from '@/models/role';
import {
  useAccessToken,
  useGetOneQuery,
  useUserContext,
  useToastContext,
  useUpdateMutation,
} from '@/hooks';
import { RSButton } from '@/components/RS';

type StoreDrawerProps = {
  drawerOpen: boolean;
  setDrawerOpen: Dispatch<SetStateAction<boolean>>;
  siret: string;
  id: number;
};

function StoreDrawer({
  drawerOpen,
  setDrawerOpen,
  siret,
  id,
}: StoreDrawerProps) {
  // Hooks
  const { accessToken } = useAccessToken();
  const { t } = useTranslation('translation');
  const { user } = useUserContext();
  const { toast } = useToastContext();
  const methods = useForm<StoreFormValues>({
    defaultValues: {
      name: '',
      address: '',
      postcode: '',
      city: '',
      siren: '',
      siret: '',
    },
  });
  const updateStorePayload = methods.watch();

  // States
  const [store, setStore] = useState<StoreDto>();

  // Queries
  const { isFetching } = useGetOneQuery<StoreDto>(
    'store',
    siret,
    accessToken,
    undefined,
    drawerOpen,
    (response) => {
      const { ok, status } = response;

      if ([401, 403].includes(status)) {
        throw new Response('', { status });
      }

      if (!ok) {
        const getStoreError = response as IErrorResponse<StoreDto>;

        toast[getStoreError.formatted.type](
          getStoreError.formatted.errorDefault,
          getStoreError.formatted.title,
        );
        return handleCloseDrawer();
      }

      const getStoreResponse = response as ISuccessResponse<StoreDto>;
      setStore(getStoreResponse.data);
    },
  );

  const updateStoreMutation = useUpdateMutation<StoreDtoPayload, StoreDto>(
    {
      toUpdate: {
        body: {
          ...updateStorePayload,
          id: id.toString(),
          pictureUrl: store?.pictureUrl || '',
        },
      },
    },
    'store',
    accessToken,
  );

  // Methods
  /**
   * Close the drawer
   */
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setStore(undefined);
  };

  /**
   * Submit update store form
   */
  const handleSubmitForm = () => {
    methods.handleSubmit(handleUpdateStore)();
  };

  /**
   * Post store to backend API
   */
  const handleUpdateStore = () => {
    updateStoreMutation.mutate(undefined, {
      onSuccess: (response) => {
        const { ok, status } = response;

        if ([401, 403].includes(status)) {
          throw new Response('', { status });
        }

        if (!ok) {
          const updateStoreError = response as IErrorResponse<StoreDto>;
          toast[updateStoreError.formatted.type](
            updateStoreError.formatted.errorDefault,
            updateStoreError.formatted.title,
            t(`Common.Store`),
          );
          return;
        }
        toast.success(
          'Store.Form.Success_Update',
          'Store.Form.Success_Update_Title',
        );
        methods.reset();
        handleCloseDrawer();
      },
    });
  };

  // useEffect
  useEffect(() => {
    methods.setValue('name', store?.name || '');
    methods.setValue('address', store?.address || '');
    methods.setValue('city', store?.city || '');
    methods.setValue('postcode', store?.postcode || '');
    methods.setValue('siren', store?.siren || '');
    methods.setValue('siret', store?.siret || '');
  }, [store]);

  return (
    <Drawer anchor="right" open={drawerOpen} onClose={handleCloseDrawer}>
      <FormProvider {...methods}>
        <Box className="store--drawer-content">
          {isFetching ? (
            <CircularProgress />
          ) : (
            <>
              <StoreForm
                store={store}
                readOnly={
                  !(user.role as RoleDto).permissions.some((p) =>
                    [Permission.MANAGE_ALL, Permission.MANAGE_STORE].includes(
                      p,
                    ),
                  )
                }
              />
              <RSButton
                type="submit"
                permissions={[Permission.MANAGE_ALL, Permission.MANAGE_STORE]}
                onClick={handleSubmitForm}
              >
                {t('Store.Form.Save')}
              </RSButton>
            </>
          )}
        </Box>
      </FormProvider>
    </Drawer>
  );
}

export default StoreDrawer;
