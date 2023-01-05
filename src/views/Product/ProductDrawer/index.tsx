import { Drawer, CircularProgress, Box } from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';

import '../Product.scss';
import ProductForm, { ProductFormValues } from '../ProductForm';
import { IErrorResponse, ISuccessResponse } from '@/services/api/interfaces';
import {
  ProductDto,
  ProductDtoPayload,
  ProductEcoScore,
  ProductNutriScore,
} from '@/models/product';
import { Permission, RoleDto } from '@/models/role';
import {
  useAccessToken,
  useGetOneQuery,
  useUserContext,
  useToastContext,
  useGetAllQuery,
  useUpdateMutation,
} from '@/hooks';
import { AisleDto } from '@/models/aisle';
import { SupplierDto } from '@/models/supplier';
import { RSButton } from '@/components/RS';

type ProductDrawerProps = {
  drawerOpen: boolean;
  setDrawerOpen: Dispatch<SetStateAction<boolean>>;
  id: number;
};

function ProductDrawer({ drawerOpen, setDrawerOpen, id }: ProductDrawerProps) {
  // Hooks
  const { accessToken } = useAccessToken();
  const { t } = useTranslation('translation');
  const { user } = useUserContext();
  const { toast } = useToastContext();
  const methods = useForm<ProductFormValues>({
    defaultValues: {
      brand: '',
      name: '',
      code: '',
      unitPackaging: '',
      price: 0,
      threshold: 0,
      inStock: 0,
      ingredients: '',
      aisle: 0,
      categories: [],
      productSuppliers: [],
    },
  });
  const updateProductPayload = methods.watch();

  // States
  const [product, setProduct] = useState<ProductDto>();
  const [aisles, setAisles] = useState<AisleDto[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierDto[]>([]);

  // Queries
  const { isFetching } = useGetOneQuery<ProductDto>(
    'product',
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
        const getProductError = response as IErrorResponse<ProductDto>;

        toast[getProductError.formatted.type](
          getProductError.formatted.errorDefault,
          getProductError.formatted.title,
        );
        return handleCloseDrawer();
      }

      const getProductResponse = response as ISuccessResponse<ProductDto>;
      setProduct(getProductResponse.data);
    },
  );

  useGetAllQuery<AisleDto[]>(
    'aisle',
    accessToken,
    {
      params: { select: 'categories,name', nested: 'categories.name' },
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
        setAisles(data.filter((aisle) => aisle.name !== 'All'));
        methods.setValue('aisle', data[0].id || 1);
      }
    },
  );

  useGetAllQuery<SupplierDto[]>(
    'supplier',
    accessToken,
    {},
    true,
    (response) => {
      const { ok, data, status } = response;

      if ([401, 403].includes(status)) {
        throw new Response('', { status });
      }

      if (!ok) {
        const error = response as IErrorResponse<SupplierDto[]>;
        toast[error.formatted.type](
          error.formatted.errorDefault,
          error.formatted.title,
        );
        return;
      }

      if (data) setSuppliers(data);
    },
  );

  const updateProductMutation = useUpdateMutation<
    ProductDtoPayload,
    ProductDto
  >(
    {
      toUpdate: {
        body: {
          ...updateProductPayload,
          id: id.toString(),
          price: Number(updateProductPayload.price),
          threshold: Number(updateProductPayload.threshold),
          ecoScore:
            product?.ecoScore === 'UNKNOWN'
              ? ProductEcoScore['NOT-APPLICABLE']
              : product?.ecoScore,
          nutriScore:
            product?.nutriScore === 'UNKNOWN'
              ? ProductNutriScore['NOT-APPLICABLE']
              : product?.nutriScore,
          productSuppliers: updateProductPayload.productSuppliers.map((ps) => ({
            supplier: ps.supplier,
            purchasePrice: ps.purchasePrice,
          })),
          pictureUrl: product?.pictureUrl,
        },
      },
    },
    'product',
    accessToken,
  );

  // Methods
  /**
   * Close the drawer
   */
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setProduct(undefined);
  };

  /**
   * Submit update product form
   */
  const handleSubmitForm = () => {
    methods.handleSubmit(handleUpdateProduct)();
  };

  /**
   * Post product to backend API
   */
  const handleUpdateProduct = () => {
    updateProductMutation.mutate(undefined, {
      onSuccess: (response) => {
        const { ok, status } = response;

        if ([401, 403].includes(status)) {
          throw new Response('', { status });
        }

        if (!ok) {
          const updateProductError = response as IErrorResponse<ProductDto>;
          toast[updateProductError.formatted.type](
            t(updateProductError.formatted.errorDefault as string, {
              name: t(`Common.Product`),
            }),
            updateProductError.formatted.title,
          );
          return;
        }
        toast.success(
          'Product.Form.Success_Update',
          'Product.Form.Success_Update_Title',
        );
        methods.reset();
        handleCloseDrawer();
      },
    });
  };

  // useEffect
  useEffect(() => {
    methods.setValue('brand', product?.brand?.name || '');
    methods.setValue('name', product?.name || '');
    methods.setValue('code', product?.code || '');
    methods.setValue('unitPackaging', product?.unitPackaging || '');
    methods.setValue('ingredients', product?.ingredients || '');
    methods.setValue('price', product?.price || 0);
    methods.setValue('inStock', product?.inStock || 0);
    methods.setValue('threshold', product?.threshold || 0);
    methods.setValue(
      'categories',
      product?.categories
        .map((category) => {
          if (category.id) return category.id;
          return -1;
        })
        .filter((x) => x >= 0) || [],
    );
    if (aisles.length) {
      methods.setValue(
        'aisle',
        product?.categories[0]?.aisle || aisles[0]?.id || 0,
      );
    }
    methods.setValue(
      'productSuppliers',
      product?.productSuppliers.map((ps) => ({
        id: uuidv4(),
        supplier: ps.supplier.id || 0,
        purchasePrice: ps.purchasePrice,
      })) || [],
    );
  }, [product]);

  return (
    <Drawer anchor="right" open={drawerOpen} onClose={handleCloseDrawer}>
      <FormProvider {...methods}>
        <Box className="product--drawer-content">
          {isFetching ? (
            <CircularProgress />
          ) : (
            <>
              <ProductForm
                product={product}
                suppliers={suppliers}
                aisles={aisles}
                readOnly={
                  !(user.role as RoleDto).permissions.some((p) =>
                    [Permission.MANAGE_ALL, Permission.MANAGE_PRODUCT].includes(
                      p,
                    ),
                  )
                }
              />
              <RSButton
                type="submit"
                permissions={[Permission.MANAGE_ALL, Permission.MANAGE_PRODUCT]}
                onClick={handleSubmitForm}
              >
                {t('Product.Form.Save')}
              </RSButton>
            </>
          )}
        </Box>
      </FormProvider>
    </Drawer>
  );
}

export default ProductDrawer;
