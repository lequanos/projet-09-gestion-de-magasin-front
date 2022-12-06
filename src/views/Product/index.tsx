import { Container, Card, CardContent, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';
import { CheckCircleOutline, ReportGmailerrorred } from '@mui/icons-material';

import './Product.scss';
import ProductModal from './ProductModal';
import { useAccessToken, useGetAllQuery, useToastContext } from '@/hooks';
import { IErrorResponse, ISuccessResponse } from '@/services/api/interfaces';
import { capitalize } from '@/helpers/utils';
import { GetProductsResponse } from '@/services/product/interfaces/productResponse.interface';
import { RSButton } from '@/components/RS';

function Product() {
  // Hooks
  const { t } = useTranslation('translation');
  const { toast } = useToastContext();
  const [tableData, setTableData] = useState<GetProductsResponse>([]);
  const { accessToken } = useAccessToken();

  // Queries
  const { isLoading } = useGetAllQuery<GetProductsResponse>(
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
        const getProductsError =
          response as IErrorResponse<GetProductsResponse>;

        toast[getProductsError.formatted.type](
          getProductsError.formatted.errorDefault,
          getProductsError.formatted.title,
        );
        return;
      }

      const getProductsResponse =
        response as ISuccessResponse<GetProductsResponse>;
      setTableData(getProductsResponse.data);
    },
  );

  // Methods
  /**
   * Get columns depending on tableData
   */
  const getColumns = (): GridColDef[] => {
    if (!tableData.length) return [];

    const columns = Object.keys(tableData[0])
      .map((key) => {
        if (key === 'id') return;

        return {
          field: key,
          headerName: t(`Product.Columns.${capitalize(key)}`),
          flex: 1,
        } as GridColDef;
      })
      .filter((value) => !!value);

    const priceField = columns?.find((col) => col?.field === 'price');

    if (priceField) {
      priceField.renderCell = (params) => <div>{params.value.toFixed(2)}€</div>;
    }

    const thresholdField = columns?.find((col) => col?.field === 'threshold');

    if (thresholdField) {
      thresholdField.renderCell = (params) =>
        params.value >= Number(params.row.inStock) && params.row.isActive ? (
          <Chip label={t('Product.MustOrder')} color="error" />
        ) : (
          ''
        );
    }

    const isActiveField = columns?.find((col) => col?.field === 'isActive');

    if (isActiveField) {
      isActiveField.renderCell = (params) =>
        params.value ? (
          <CheckCircleOutline color="success" />
        ) : (
          <ReportGmailerrorred color="error" />
        );
    }

    return columns as GridColDef[];
  };

  return (
    <>
      <Container className="product--container">
        <RSButton className="product--add-btn" color="secondary">
          {t('Product.AddProduct')}
        </RSButton>
        <Card className="product--table-container">
          <CardContent className="product--table">
            <DataGrid
              rows={tableData}
              columns={getColumns()}
              loading={isLoading}
              disableSelectionOnClick
              autoPageSize
            />
          </CardContent>
        </Card>
      </Container>
      <ProductModal />
    </>
  );
}

export default Product;
