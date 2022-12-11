import { Typography, Card, CardMedia, CardContent, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { RSForm, RSInput, RSSelect } from '@/components/RS';
import { useAccessToken, useGetAllQuery, useToastContext } from '@/hooks';
import { ProductDto } from '@/models/product';
import { AisleDto } from '@/models/aisle';
import { IErrorResponse } from '@/services/api/interfaces';

type ProductModalContentProps = {
  activeStep: number;
  notFound: boolean;
  searchedProduct: string;
  product?: ProductDto;
};

export type AddProductFormValues = {
  brand: string;
  name: string;
  code: string;
  unitPackaging: string;
  price: number;
  threshold: number;
  ingredients: string;
  aisle: number;
  categories: number[];
};

function ProductModalContent({
  activeStep,
  notFound,
  searchedProduct,
  product,
}: ProductModalContentProps) {
  // Hooks
  const { t } = useTranslation('translation');
  const { toast } = useToastContext();
  const { accessToken } = useAccessToken();
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AddProductFormValues>({
    defaultValues: {
      brand: '',
      name: '',
      code: '',
      unitPackaging: '',
      price: 0,
      threshold: 0,
      ingredients: '',
      aisle: 0,
      categories: [],
    },
  });
  const { aisle } = watch();

  // States
  const [aisles, setAisles] = useState<AisleDto[]>([]);

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
        setValue('aisle', data[0].id);
      }
    },
  );

  // Methods
  /**
   * Post product to backend API
   */
  const handleAddProduct = () => {
    console.log(aisle);
  };

  // useEffect
  useEffect(() => {
    setValue('brand', product?.brand?.name || '');
    setValue('name', product?.name || '');
    setValue('code', product?.code || '');
    setValue('unitPackaging', product?.unitPackaging || '');
    setValue('ingredients', product?.ingredients || '');
  }, [product]);

  return (
    <>
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
              {product.brand?.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {product.name}
            </Typography>
          </CardContent>
        </Card>
      )}
      {activeStep === 1 && (
        <Box className="product--modal-add">
          <Box
            className="product--modal-add-picture"
            sx={{ backgroundImage: `url(${product?.pictureUrl}) ` }}
          />
          <RSForm
            className="product--modal-add-form"
            onSubmit={handleSubmit(handleAddProduct)}
          >
            <RSInput
              className="product--modal-add-input"
              label={t('Product.Modal.AddProduct.Brand')}
              name="brand"
              control={control}
              errors={errors}
              readOnly
              size="small"
            />
            <RSInput
              className="product--modal-add-input"
              label={t('Product.Modal.AddProduct.Name')}
              name="name"
              control={control}
              errors={errors}
              readOnly
              size="small"
            />
            <div className="product--modal-add-input">
              <RSInput
                label={t('Product.Modal.AddProduct.Code')}
                name="code"
                control={control}
                errors={errors}
                readOnly
                size="small"
              />
              <RSInput
                label={t('Product.Modal.AddProduct.UnitPackaging')}
                name="unitPackaging"
                control={control}
                errors={errors}
                readOnly
                size="small"
              />
            </div>
            <div className="product--modal-add-input">
              <RSInput
                label={t('Product.Modal.AddProduct.Price')}
                name="price"
                control={control}
                errors={errors}
                size="small"
              />
              <RSInput
                label={t('Product.Modal.AddProduct.Threshold')}
                name="threshold"
                control={control}
                errors={errors}
                size="small"
              />
            </div>
            <RSInput
              className="product--modal-add-input"
              label={t('Product.Modal.AddProduct.Ingredients')}
              name="ingredients"
              control={control}
              errors={errors}
              readOnly
              size="small"
              multiline
            />
            <div className="product--modal-add-input">
              <RSSelect
                className="product--modal-add-select"
                id="aisle"
                label={t('Product.Modal.AddProduct.Aisle')}
                labelId="aisleLabel"
                name="aisle"
                errors={errors}
                control={control}
                items={aisles}
                size="small"
              />
              <RSSelect
                className="product--modal-add-select"
                id="categories"
                label={t('Product.Modal.AddProduct.Categories')}
                labelId="categoriesLabel"
                name="categories"
                errors={errors}
                control={control}
                items={
                  aisles.find((item) => item.id === aisle)?.categories || []
                }
                multiple
                size="small"
              />
            </div>
          </RSForm>
        </Box>
      )}
    </>
  );
}

export default ProductModalContent;
