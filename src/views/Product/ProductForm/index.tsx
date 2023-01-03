import { RSForm, RSInput, RSSelect, RSButton } from '@/components/RS';
import {
  Box,
  Typography,
  FormHelperText,
  SelectChangeEvent,
} from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridColumns,
  GridRowParams,
} from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

import { rulesValidationDictionary } from '@/helpers/rulesValidationDictionary';
import {
  ExtendedProductSupplierDtoPayload,
  ProductDtoPayload,
  ProductSupplierDtoPayload,
  ProductDto,
} from '@/models/product';
import { useToastContext } from '@/hooks';
import { SupplierDto } from '@/models/supplier';
import { AisleDto } from '@/models/aisle';
import { Delete } from '@mui/icons-material';
import SelectSupplierEditCell from '../ProductModal/SelectSupplierEditCell';
import { isProductDto } from '@/helpers/typeguards';

type ProductFormProps = {
  product?: ProductDtoPayload | ProductDto;
  suppliers: SupplierDto[];
  aisles: AisleDto[];
  readOnly?: boolean;
};

export type ProductFormValues = {
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
  productSuppliers: ExtendedProductSupplierDtoPayload[];
};

function ProductForm({
  product,
  suppliers = [],
  aisles = [],
  readOnly = true,
}: ProductFormProps) {
  // Hooks
  const { t } = useTranslation('translation');
  const { toast } = useToastContext();
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<ProductFormValues>();
  const { aisle, productSuppliers } = watch();

  // Data
  const columns: GridColumns<ProductSupplierDtoPayload> = [
    {
      field: 'supplier',
      headerName: t('Product.Form.Name'),
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
      editable: !readOnly,
    },
    {
      type: 'number',
      field: 'purchasePrice',
      headerName: t('Product.Form.PurchasePrice'),
      flex: 1,
      editable: !readOnly,
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
      headerName: t('Product.Form.Actions'),
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
  const handleRowUpdate = (newRow: ExtendedProductSupplierDtoPayload) => {
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

  return (
    <Box className="product--form">
      <Box
        className="product--form-picture"
        sx={{ backgroundImage: `url(${product?.pictureUrl})` }}
      />
      <RSForm className="product--form-form">
        <RSInput
          className="product--form-input"
          label={t('Product.Form.Brand')}
          name="brand"
          control={control}
          errors={errors}
          size="small"
          readOnly={readOnly}
        />
        <RSInput
          className="product--form-input"
          label={t('Product.Form.Name')}
          name="name"
          control={control}
          errors={errors}
          size="small"
          readOnly={readOnly}
        />
        <div className="product--form-input">
          <RSInput
            label={t('Product.Form.Code')}
            name="code"
            control={control}
            errors={errors}
            readOnly
            size="small"
          />
          <RSInput
            label={t('Product.Form.UnitPackaging')}
            name="unitPackaging"
            control={control}
            errors={errors}
            size="small"
            readOnly={readOnly}
          />
        </div>
        <div className="product--form-input">
          <RSInput
            className="product--form-number"
            label={t('Product.Form.Price')}
            name="price"
            control={control}
            errors={errors}
            size="small"
            startIcon="monetary"
            type="number"
            inputProps={{
              min: 0,
            }}
            readOnly={readOnly}
          />
          <RSInput
            className="product--form-number"
            label={t('Product.Form.InStock', {
              context: isProductDto(product) ? 'Update' : 'Add',
            })}
            name="inStock"
            control={control}
            errors={errors}
            size="small"
            type="number"
            inputProps={{
              min: 0,
            }}
            readOnly={readOnly}
          />
          <RSInput
            className="product--form-number"
            label={t('Product.Form.Threshold')}
            name="threshold"
            control={control}
            errors={errors}
            size="small"
            type="number"
            inputProps={{
              min: 0,
            }}
            readOnly={readOnly}
          />
        </div>
        <RSInput
          className="product--form-input"
          label={t('Product.Form.Ingredients')}
          name="ingredients"
          control={control}
          errors={errors}
          size="small"
          multiline
          readOnly={readOnly}
        />
        <div className="product--form-input">
          <RSSelect
            className="product--form-select"
            id="aisle"
            label={'Product.Form.Aisle'}
            labelId="aisleLabel"
            name="aisle"
            errors={errors}
            control={control}
            items={aisles}
            size="small"
            onChange={handleAisleChange}
            readOnly={readOnly}
          />
          <RSSelect
            className="product--form-select"
            id="categories"
            label={'Product.Form.Categories'}
            labelId="categoriesLabel"
            name="categories"
            errors={errors}
            control={control}
            items={aisles.find((item) => item.id === aisle)?.categories || []}
            multiple
            size="small"
            readOnly={readOnly}
          />
        </div>
        <div className="product--form-productSuppliers">
          <div className="product--form-productSuppliers-title">
            <Typography variant="subtitle2">
              {t('Product.Form.Suppliers')}
            </Typography>
            <RSButton
              variant="outlined"
              startIcon="add"
              size="small"
              onClick={handleAddProductSuppliers}
              disabled={readOnly}
            >
              {t('Product.Modal.Add')}
            </RSButton>
          </div>
          <div className="product--form-productSuppliers-data">
            <Controller
              name="productSuppliers"
              control={control}
              rules={rulesValidationDictionary.productSuppliers}
              render={() => (
                <>
                  <DataGrid
                    className="product--form-datagrid"
                    rows={productSuppliers}
                    columns={columns}
                    density="compact"
                    hideFooter
                    experimentalFeatures={{ newEditingApi: true }}
                    processRowUpdate={handleRowUpdate}
                    onProcessRowUpdateError={(error) => console.log(error)}
                  />
                  <FormHelperText error>{getDataGridErrors()}</FormHelperText>
                </>
              )}
            />
          </div>
        </div>
      </RSForm>
    </Box>
  );
}

export default ProductForm;
