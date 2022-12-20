import { Container, Card, CardContent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  DataGrid,
  GridRowParams,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import { useState } from 'react';

import './Product.scss';
import ProductModal from './ProductModal';
import ProductDrawer from './ProductDrawer';
import {
  useAccessToken,
  useGetAllQuery,
  useToastContext,
  useUserContext,
  useDeactivateMutation,
  useReactivateMutation,
  useDeleteMutation,
} from '@/hooks';
import { IErrorResponse, ISuccessResponse } from '@/services/api/interfaces';
import { RSButton } from '@/components/RS';
import { getColumns } from '@/helpers/utils';
import { Permission, RoleDto } from '@/models/role';
import { ProductDto } from '@/models/product';

function Product() {
  // Hooks
  const { t } = useTranslation('translation');
  const { toast } = useToastContext();
  const { accessToken } = useAccessToken();
  const { user } = useUserContext();

  // States
  const [tableData, setTableData] = useState<ProductDto[]>([]);
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [productId, setProductId] = useState(0);

  // Queries
  const { isFetching, refetch } = useGetAllQuery<ProductDto[]>(
    'product',
    accessToken,
    {
      params: {
        select: 'name,code,price,isActive,inStock,threshold',
      },
    },
    true,
    (response) => {
      const { ok, status } = response;

      if ([401, 403].includes(status)) {
        throw new Response('', { status });
      }

      if (!ok) {
        const getProductsError = response as IErrorResponse<ProductDto[]>;

        toast[getProductsError.formatted.type](
          getProductsError.formatted.errorDefault,
          getProductsError.formatted.title,
        );
        return;
      }

      const getProductsResponse = response as ISuccessResponse<ProductDto[]>;
      setTableData(getProductsResponse.data);
    },
  );

  const deleteMutation = useDeleteMutation('product', accessToken);

  const deactivateMutation = useDeactivateMutation<ProductDto>(
    'product',
    accessToken,
  );

  const reactivateMutation = useReactivateMutation<ProductDto>(
    'product',
    accessToken,
  );

  // Methods
  /**
   * Open modal to add a product
   */
  const openAddProductModal = () => {
    setOpen(true);
  };

  /**
   * Open product detail drawer
   */
  const handleOpenProductDetail = (params: GridRowParams) => {
    setProductId(params.row.id);
    setDrawerOpen(true);
  };

  /**
   * Delete product
   */
  const handleDeleteProduct = ({ id }: GridRowParams) => {
    deleteMutation.mutate(
      { id: id as string },
      {
        onSuccess: (response) => {
          const { ok, status } = response;

          if ([401, 403].includes(status)) {
            throw new Response('', { status });
          }

          if (!ok) {
            const updateProductError = response as IErrorResponse<void>;
            toast[updateProductError.formatted.type](
              t(updateProductError.formatted.errorDefault as string, {
                name: t(`Common.Product`),
              }),
              updateProductError.formatted.title,
            );
            return;
          }
          refetch();
        },
      },
    );
  };

  /**
   * Toggle active status of product
   */
  const handleToggleProductActiveStatus = ({
    id,
    row,
  }: GridRenderCellParams) => {
    if (row.isActive) {
      deactivateMutation.mutate(
        {
          id: id as string,
        },
        {
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
            refetch();
          },
        },
      );
    } else {
      reactivateMutation.mutate(
        {
          id: id as string,
        },
        {
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
            refetch();
          },
        },
      );
    }
  };

  return (
    <>
      <Container className="product--container">
        <RSButton
          className="product--add-btn"
          color="primary"
          onClick={openAddProductModal}
          permissions={[Permission.MANAGE_ALL, Permission.MANAGE_PRODUCT]}
          startIcon="add"
        >
          {t('Product.AddProduct')}
        </RSButton>
        <Card className="product--table-container">
          <CardContent className="product--table">
            <DataGrid
              rows={tableData}
              columns={getColumns(
                tableData,
                'product',
                (user.role as RoleDto).permissions,
                handleOpenProductDetail,
                handleDeleteProduct,
                handleToggleProductActiveStatus,
              )}
              loading={isFetching}
              disableSelectionOnClick
              autoPageSize
            />
          </CardContent>
        </Card>
      </Container>
      <ProductModal open={open} setOpen={setOpen} />
      <ProductDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        id={productId}
      />
    </>
  );
}

export default Product;
