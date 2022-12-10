import { Typography, Card, CardMedia, CardContent, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

import { ProductResponse } from '@/services/product/interfaces/productResponse.interface';
import { RSForm, RSInput } from '@/components/RS';
import { useForm } from 'react-hook-form';

type ProductModalContentProps = {
  activeStep: number;
  notFound: boolean;
  searchedProduct: string;
  product?: ProductResponse;
};

function ProductModalContent({
  activeStep,
  notFound,
  searchedProduct,
  product,
}: ProductModalContentProps) {
  // Hooks
  const { t } = useTranslation('translation');
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  // Methods
  /**
   * Post product to backend API
   */
  const handleAddProduct = () => {
    console.log(product);
  };

  // useEffect
  useEffect(() => {
    setValue('brand', product?.brand?.name);
    setValue('name', product?.name);
    setValue('code', product?.code);
    setValue('unitPackaging', product?.unitPackaging);
    setValue('ingredients', product?.ingredients);
  }, [product]);

  return (
    <>
      {activeStep === 0 && notFound && (
        <Typography color="error">
          {t('Product.Modal.NotFoundProduct', { searchedProduct })}
        </Typography>
      )}
      {activeStep === 0 && product && (
        <Card>
          <CardMedia component="img" image={product.pictureUrl} />
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
          <Card className="product--modal-add-picture">
            <CardMedia component="img" image={product?.pictureUrl} />
          </Card>
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
            />
            <RSInput
              className="product--modal-add-input"
              label={t('Product.Modal.AddProduct.Name')}
              name="name"
              control={control}
              errors={errors}
              readOnly
            />
            <RSInput
              className="product--modal-add-input"
              label={t('Product.Modal.AddProduct.Code')}
              name="code"
              control={control}
              errors={errors}
              readOnly
            />
            <RSInput
              className="product--modal-add-input"
              label={t('Product.Modal.AddProduct.Price')}
              name="price"
              control={control}
              errors={errors}
            />
            <RSInput
              className="product--modal-add-input"
              label={t('Product.Modal.AddProduct.UnitPackaging')}
              name="unitPackaging"
              control={control}
              errors={errors}
              readOnly
            />
            <RSInput
              className="product--modal-add-input"
              label={t('Product.Modal.AddProduct.Threshold')}
              name="threshold"
              control={control}
              errors={errors}
            />
            <RSInput
              className="product--modal-add-input"
              label={t('Product.Modal.AddProduct.Ingredients')}
              name="ingredients"
              control={control}
              errors={errors}
              readOnly
            />
          </RSForm>
        </Box>
      )}
    </>
  );
}

export default ProductModalContent;
