import { Container, Card, CardContent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';

import './Product.scss';
import ProductModal from './ProductModal';
import { useAccessToken, useGetAllQuery, useToastContext } from '@/hooks';
import { IErrorResponse, ISuccessResponse } from '@/services/api/interfaces';
import { RSButton } from '@/components/RS';
import { getColumns } from '@/helpers/utils';
import { Permission } from '@/models/role';
import { ProductDto } from '@/models/product';

function Product() {
  // Hooks
  const { t } = useTranslation('translation');
  const { toast } = useToastContext();
  const { accessToken } = useAccessToken();
  const [tableData, setTableData] = useState<ProductDto[]>([]);
  const [open, setOpen] = useState(false);

  // Queries
  const { isFetching } = useGetAllQuery<ProductDto[]>(
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

  // Methods
  /**
   * Open modal to add a product
   */
  const openAddProductModal = () => {
    setOpen(true);
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
              columns={getColumns(tableData, 'product')}
              loading={isFetching}
              disableSelectionOnClick
              autoPageSize
            />
          </CardContent>
        </Card>
      </Container>
      <ProductModal open={open} setOpen={setOpen} />
    </>
  );
}

export default Product;
