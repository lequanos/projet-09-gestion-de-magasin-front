import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  Box,
  SelectChangeEvent,
  CircularProgress,
  FormHelperText,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import {
  DataGrid,
  GridActionsCellItem,
  GridColumns,
  GridRowParams,
} from '@mui/x-data-grid';
import { Delete } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';

import { RSButton, RSForm, RSInput, RSSelect } from '@/components/RS';
import { useAccessToken, useGetAllQuery, useToastContext } from '@/hooks';
import {
  ExtendedProductSupplierDto,
  ProductDto,
  ProductSupplierDto,
} from '@/models/product';
import { AisleDto } from '@/models/aisle';
import { IErrorResponse } from '@/services/api/interfaces';
import SelectSupplierEditCell from './SelectSupplierEditCell';
import { SupplierDto } from '@/models/supplier';
import { rulesValidationDictionary } from '@/helpers/rulesValidationDictionary';

type ProductModalContentProps = {
  activeStep: number;
  notFound: boolean;
  searchedProduct: string;
  product?: ProductDto;
  isFetching: boolean;
};

export type AddProductFormValues = {
  brand: string;
  name: string;
  code: string;
  unitPackaging: string;
  price: number;
  inStock: number;
  threshold: number;
  ingredients: string;
  aisle: number;
  categories: number[];
  productSuppliers: ExtendedProductSupplierDto[];
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
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<AddProductFormValues>();
  const { aisle, productSuppliers } = watch();

  // States
  const [aisles, setAisles] = useState<AisleDto[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierDto[]>([]);

  // Data
  const columns: GridColumns<ProductSupplierDto> = [
    {
      field: 'supplier',
      headerName: t('Product.Modal.AddProduct.Name'),
      flex: 1,
      renderCell: (params) => (
        <div>
          {
            suppliers.find((supplier) => supplier.id === params.row.supplier)
              ?.name
          }
        </div>
      ),
      renderEditCell: (params) => (
        <SelectSupplierEditCell
          {...params}
          suppliers={suppliers.filter(
            (supplier) =>
              !productSuppliers.find((ps) => ps.supplier === supplier.id) ||
              supplier.id === params.row.supplier,
          )}
        />
      ),
      editable: true,
    },
    {
      type: 'number',
      field: 'purchasePrice',
      headerName: t('Product.Modal.AddProduct.PurchasePrice'),
      flex: 1,
      editable: true,
      valueParser(value) {
        return Number(value);
      },
      valueSetter({ value, row }) {
        if (value < 0) {
          row.purchasePrice = 0;
        } else {
          row.purchasePrice = value;
        }
        return row;
      },
      valueFormatter({ value }) {
        return `${value.toFixed(2)}€`;
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: t('Product.Modal.AddProduct.Actions'),
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={<Delete />}
          onClick={() => handleDeleteSupplier(params)}
          label="Delete"
          showInMenu={false}
          onResize={undefined}
          onResizeCapture={undefined}
        />,
      ],
    },
  ];

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

  // Methods
  /**
   * Change aisle and reset categories
   */
  const handleAisleChange = (e: SelectChangeEvent<any>) => {
    setValue('aisle', e.target.value);
    setValue('categories', []);
  };

  /**
   * Add productSuppliers
   */
  const handleAddProductSuppliers = () => {
    const foundSuppliers = suppliers.filter(
      (supplier) => !productSuppliers.find((ps) => ps.supplier === supplier.id),
    );

    if (foundSuppliers.length) {
      setValue('productSuppliers', [
        ...productSuppliers,
        {
          id: uuidv4(),
          supplier: foundSuppliers[0].id,
          purchasePrice: 0,
        },
      ]);
    } else toast.warning('No more supplier');
  };

  /**
   * Update productSuppliers value when model of the data gris is updated
   */
  const handleRowUpdate = (newRow: ExtendedProductSupplierDto) => {
    const updatedRow = productSuppliers.find((ps) => ps.id === newRow.id);

    if (updatedRow) {
      updatedRow.purchasePrice = newRow.purchasePrice;
      updatedRow.supplier = newRow.supplier;
    }

    setValue('productSuppliers', [...productSuppliers]);
    return newRow;
  };

  /**
   * Delete one supplier from productSuppliers
   */
  const handleDeleteSupplier = (params: GridRowParams) => {
    const updatedProductSuppliers = productSuppliers.filter(
      (ps) => ps.id !== params.id,
    );

    setValue('productSuppliers', [...updatedProductSuppliers]);
  };

  /**
   * Get errors on form validation for Datagrid
   */
  const getDataGridErrors = () => {
    return t(errors.productSuppliers?.message as string, {
      name: t('Common.ProductSuppliers'),
    });
  };

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
    setValue('productSuppliers', product?.productSuppliers || []);
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
                : product?.brand?.name}
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
            sx={{ backgroundImage: `url(${product?.pictureUrl})` }}
          />
          <RSForm className="product--modal-add-form">
            <RSInput
              className="product--modal-add-input"
              label={t('Product.Modal.AddProduct.Brand')}
              name="brand"
              control={control}
              errors={errors}
              size="small"
            />
            <RSInput
              className="product--modal-add-input"
              label={t('Product.Modal.AddProduct.Name')}
              name="name"
              control={control}
              errors={errors}
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
                size="small"
              />
            </div>
            <div className="product--modal-add-input">
              <RSInput
                className="product--modal-add-number"
                label={t('Product.Modal.AddProduct.Price')}
                name="price"
                control={control}
                errors={errors}
                size="small"
                startIcon="monetary"
                type="number"
                inputProps={{
                  min: 0,
                }}
              />
              <RSInput
                className="product--modal-add-number"
                label={t('Product.Modal.AddProduct.InStock')}
                name="inStock"
                control={control}
                errors={errors}
                size="small"
                type="number"
                inputProps={{
                  min: 0,
                }}
              />
              <RSInput
                className="product--modal-add-number"
                label={t('Product.Modal.AddProduct.Threshold')}
                name="threshold"
                control={control}
                errors={errors}
                size="small"
                type="number"
                inputProps={{
                  min: 0,
                }}
              />
            </div>
            <RSInput
              className="product--modal-add-input"
              label={t('Product.Modal.AddProduct.Ingredients')}
              name="ingredients"
              control={control}
              errors={errors}
              size="small"
              multiline
            />
            <div className="product--modal-add-input">
              <RSSelect
                className="product--modal-add-select"
                id="aisle"
                label={'Product.Modal.AddProduct.Aisle'}
                labelId="aisleLabel"
                name="aisle"
                errors={errors}
                control={control}
                items={aisles}
                size="small"
                onChange={handleAisleChange}
              />
              <RSSelect
                className="product--modal-add-select"
                id="categories"
                label={'Product.Modal.AddProduct.Categories'}
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
            <div className="product--modal-add-productSuppliers">
              <div className="product--modal-add-productSuppliers-title">
                <Typography variant="subtitle2">
                  {t('Product.Modal.AddProduct.Suppliers')}
                </Typography>
                <RSButton
                  variant="outlined"
                  startIcon="add"
                  size="small"
                  onClick={handleAddProductSuppliers}
                >
                  {t('Product.Modal.Add')}
                </RSButton>
              </div>
              <div className="product--modal-add-productSuppliers-data">
                <Controller
                  name="productSuppliers"
                  control={control}
                  rules={rulesValidationDictionary.productSuppliers}
                  render={() => (
                    <>
                      <DataGrid
                        className="product--modal-add-datagrid"
                        rows={productSuppliers}
                        columns={columns}
                        density="compact"
                        hideFooter
                        experimentalFeatures={{ newEditingApi: true }}
                        processRowUpdate={handleRowUpdate}
                        onProcessRowUpdateError={(error) => console.log(error)}
                      />
                      <FormHelperText error>
                        {getDataGridErrors()}
                      </FormHelperText>
                    </>
                  )}
                />
              </div>
            </div>
          </RSForm>
        </Box>
      )}
    </>
  );
}

export default ProductModalContent;
