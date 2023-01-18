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
import DeleteProductModal from './DeleteProductModal';
import ProductDrawer from './ProductDrawer';
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
  const [openDelete, setOpenDelete] = useState(false);
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
    onSuccess<ProductDto[]>(
      (response: ISuccessResponse<ProductDto[]>) => setTableData(response.data),
      toast,
      'Product',
    ),
  );

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
   * Open delete product modal
   */
  const handleDeleteProduct = ({ id }: GridRowParams) => {
    setOpenDelete(true);
    setProductId(Number(id));
  };

  /**
   * Toggle active status of product
   */
  const handleToggleProductActiveStatus = ({
    id,
    row,
  }: GridRenderCellParams) => {
    const variables = {
      id: id as string,
    };
    const options = {
      onSuccess: onSuccess<ProductDto>(refetch, toast, 'Product'),
    };
    if (row.isActive) {
      deactivateMutation.mutate(variables, options);
    } else {
      reactivateMutation.mutate(variables, options);
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
        refetch={refetch}
      />
      <DeleteProductModal
        open={openDelete}
        setOpen={setOpenDelete}
        id={productId}
        refetch={refetch}
      />
    </>
  );
}

export default Product;
