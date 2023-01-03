import { CategoryDto } from '@/models/category';
import { ProductSupplierDto } from '@/models/product';
import { RegisterOptions } from 'react-hook-form';

export const rulesValidationDictionary: {
  [key: string]: Exclude<
    RegisterOptions,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >;
} = {
  email: {
    required: 'Error.Required_Input',
    pattern: {
      value:
        /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
      message: 'Error.Format_Email',
    },
  },
  password: {
    required: 'Error.Required_Input',
  },
  firstname: {
    required: 'Error.Required_Input',
  },
  lastname: {
    required: 'Error.Required_Input',
  },
  selectedStore: {
    required: 'Error.Required_Select',
  },
  searchedProduct: {
    required: 'Error.Required_Input',
    pattern: {
      value: /^[0-9]{13}$/i,
      message: 'Error.Format_EAN',
    },
  },
  name: {
    required: 'Error.Required_Input',
  },
  brand: {
    required: 'Error.Required_Input',
  },
  code: {
    required: 'Error.Required_Input',
  },
  unitPackaging: {
    required: 'Error.Required_Input',
  },
  price: {
    required: 'Error.Required_Input',
    min: {
      value: 0,
      message: 'Error.Min_Price',
    },
  },
  threshold: {
    required: 'Error.Required_Input',
    min: {
      value: 0,
      message: 'Error.Threshold',
    },
  },
  ingredients: {
    required: 'Error.Required_Input',
  },
  aisle: {
    required: 'Error.Required_Input',
  },
  inStock: {
    required: 'Error.Required_Input',
  },
  address: {
    required: 'Error.Required_Input',
  },
  postcode: {
    required: 'Error.Required_Input',
  },
  city: {
    required: 'Error.Required_Input',
  },
  siren: {
    required: 'Error.Required_Input',
  },
  siret: {
    required: 'Error.Required_Input',
  },
  categories: {
    validate: {
      notEmpty: (v: CategoryDto[]) => !!v.length || 'Error.Required_Input',
      sameAisle: (v: CategoryDto[]) =>
        v.every((current, index) => {
          if (index) {
            return current.aisle === v[index - 1]?.aisle;
          }
          return true;
        }) || 'Error.Same_Aisle',
    },
  },
  productSuppliers: {
    validate: {
      notEmpty: (v: ProductSupplierDto[]) =>
        !!v.length || 'Error.Required_Input',
      notEmptySupplier: (v: ProductSupplierDto[]) =>
        v.every((current) => current.supplier) || 'Error.Empty_Supplier',
      notEmptyPurchasePrice: (v: ProductSupplierDto[]) =>
        v.every((current) => current.purchasePrice) ||
        'Error.Empty_PurchasePrice',
    },
  },
};
