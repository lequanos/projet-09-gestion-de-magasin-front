import { Drawer, CircularProgress, Box } from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import '../Supplier.scss';
import SupplierForm, { SupplierFormValues } from '../SupplierForm';
import { IErrorResponse, ISuccessResponse } from '@/services/api/interfaces';
import { SupplierDto, SupplierDtoPayload } from '@/models/supplier';
import { Permission, RoleDto } from '@/models/role';
import {
  useAccessToken,
  useGetOneQuery,
  useUserContext,
  useToastContext,
  useUpdateMutation,
} from '@/hooks';
import { RSButton } from '@/components/RS';

type SupplierDrawerProps = {
  drawerOpen: boolean;
  setDrawerOpen: Dispatch<SetStateAction<boolean>>;
  id: number;
};

function SupplierDrawer({
  drawerOpen,
  setDrawerOpen,
  id,
}: SupplierDrawerProps) {
  // Hooks
  const { accessToken } = useAccessToken();
  const { t } = useTranslation('translation');
  const { user } = useUserContext();
  const { toast } = useToastContext();
  const methods = useForm<SupplierFormValues>({
    defaultValues: {
      name: '',
      phoneNumber: '',
      address: '',
      postcode: '',
      city: '',
      siren: '',
      siret: '',
      contact: '',
    },
  });
  const updateSupplierPayload = methods.watch();

  // States
  const [supplier, setSupplier] = useState<SupplierDto>();

  // Queries
  const { isFetching } = useGetOneQuery<SupplierDto>(
    'supplier',
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
        const getSupplierError = response as IErrorResponse<SupplierDto>;

        toast[getSupplierError.formatted.type](
          getSupplierError.formatted.errorDefault,
          getSupplierError.formatted.title,
        );
        return handleCloseDrawer();
      }

      const getSupplierResponse = response as ISuccessResponse<SupplierDto>;
      setSupplier(getSupplierResponse.data);
    },
  );

  const updateSupplierMutation = useUpdateMutation<
    SupplierDtoPayload,
    SupplierDto
  >(
    {
      toUpdate: {
        body: {
          ...updateSupplierPayload,
          id: id.toString(),
          pictureUrl: supplier?.pictureUrl || '',
        },
      },
    },
    'supplier',
    accessToken,
  );

  // Methods
  /**
   * Close the drawer
   */
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSupplier(undefined);
  };

  /**
   * Submit update supplier form
   */
  const handleSubmitForm = () => {
    methods.handleSubmit(handleUpdateSupplier)();
  };

  /**
   * Post supplier to backend API
   */
  const handleUpdateSupplier = () => {
    updateSupplierMutation.mutate(undefined, {
      onSuccess: (response) => {
        const { ok, status } = response;

        if ([401, 403].includes(status)) {
          throw new Response('', { status });
        }

        if (!ok) {
          const updateSupplierError = response as IErrorResponse<SupplierDto>;
          toast[updateSupplierError.formatted.type](
            t(updateSupplierError.formatted.errorDefault as string, {
              name: t(`Common.Supplier`),
            }),
            updateSupplierError.formatted.title,
          );
          return;
        }
        toast.success(
          'Supplier.Form.Success_Update',
          'Supplier.Form.Success_Update_Title',
        );
        methods.reset();
        handleCloseDrawer();
      },
    });
  };

  // useEffect
  useEffect(() => {
    methods.setValue('name', supplier?.name || '');
    methods.setValue('address', supplier?.address || '');
    methods.setValue('city', supplier?.city || '');
    methods.setValue('postcode', supplier?.postcode || '');
    methods.setValue('siren', supplier?.siren || '');
    methods.setValue('siret', supplier?.siret || '');
  }, [supplier]);

  return (
    <Drawer anchor="right" open={drawerOpen} onClose={handleCloseDrawer}>
      <FormProvider {...methods}>
        <Box className="supplier--drawer-content">
          {isFetching ? (
            <CircularProgress />
          ) : (
            <>
              <SupplierForm
                supplier={supplier}
                readOnly={
                  !(user.role as RoleDto).permissions.some((p) =>
                    [
                      Permission.MANAGE_ALL,
                      Permission.MANAGE_SUPPLIER,
                    ].includes(p),
                  )
                }
              />
              <RSButton
                type="submit"
                permissions={[
                  Permission.MANAGE_ALL,
                  Permission.MANAGE_SUPPLIER,
                ]}
                onClick={handleSubmitForm}
              >
                {t('Supplier.Form.Save')}
              </RSButton>
            </>
          )}
        </Box>
      </FormProvider>
    </Drawer>
  );
}

export default SupplierDrawer;
