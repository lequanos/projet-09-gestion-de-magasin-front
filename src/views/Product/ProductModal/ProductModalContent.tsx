import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { useAccessToken, useGetAllQuery, useToastContext } from '@/hooks';
import { ProductDtoPayload } from '@/models/product';
import { AisleDto } from '@/models/aisle';
import { IErrorResponse } from '@/services/api/interfaces';
import { SupplierDto } from '@/models/supplier';
import ProductForm, { ProductFormValues } from '../ProductForm';

type ProductModalContentProps = {
  activeStep: number;
  notFound: boolean;
  searchedProduct: string;
  product?: ProductDtoPayload;
  isFetching: boolean;
};

function ProductModalContent({
  activeStep,
  notFound,
  searchedProduct,
  product,
  isFetching,
}: ProductModalContentProps) {
  // Hooks
  const { t } = useTranslation('translation');
  const { toast } = useToastContext();
  const { accessToken } = useAccessToken();
  const { setValue } = useFormContext<ProductFormValues>();

  // States
  const [aisles, setAisles] = useState<AisleDto[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierDto[]>([]);

  // Queries
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
        setValue('aisle', data[0].id || 1);
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

  // useEffect
  useEffect(() => {
    setValue(
      'brand',
      typeof product?.brand === 'string'
        ? product?.brand
        : product?.brand?.name || '',
    );
    setValue('name', product?.name || '');
    setValue('code', product?.code || '');
    setValue('unitPackaging', product?.unitPackaging || '');
    setValue('ingredients', product?.ingredients || '');
    setValue('productSuppliers', []);
  }, [product]);

  return (
    <>
      {isFetching && <CircularProgress />}
      {activeStep === 0 && notFound && (
        <Typography color="error">
          {t('Product.Modal.NotFoundProduct', { searchedProduct })}
        </Typography>
      )}
      {activeStep === 0 && product && (
        <Card className="product--modal-card">
          <CardMedia
            className="product--modal-card-picture"
            image={product.pictureUrl}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {typeof product?.brand === 'string'
                ? product?.brand
                : product?.brand?.name || ''}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {product.name}
            </Typography>
          </CardContent>
        </Card>
      )}
      {activeStep === 1 && (
        <ProductForm
          product={product}
          suppliers={suppliers}
          aisles={aisles}
          readOnly={false}
        />
      )}
    </>
  );
}

export default ProductModalContent;
