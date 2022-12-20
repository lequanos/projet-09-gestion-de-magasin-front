import { BrandDto } from '../brand';
import { CategoryDto } from '../category';
import { BaseModel } from '../interfaces/common.interface';
import { StoreDto } from '../store';
import { SupplierDto } from '../supplier';

type BaseProductDto = BaseModel & {
  code?: string;
  price?: number;
  pictureUrl?: string;
  nutriScore?: ProductNutriScore;
  ecoScore?: ProductEcoScore;
  unitPackaging?: string;
  threshold?: number;
  ingredients?: string;
  inStock?: number;
  sales?: number;
};

export type ProductDtoPayload = Omit<BaseProductDto, 'id'> & {
  id?: string;
  brand: BrandDto | string;
  productSuppliers: ProductSupplierDtoPayload[];
  categories: number[];
};

export type ProductDto = BaseProductDto & {
  brand?: BrandDto;
  productSuppliers: ProductSupplierDto[];
  categories: CategoryDto[];
  store: Pick<StoreDto, 'id'>;
  suppliers: Pick<SupplierDto, 'id'>[];
  isActive: boolean;
};

export enum ProductNutriScore {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  'NOT-APPLICABLE' = 'NOT-APPLICABLE',
  'UNKNOWN' = 'UNKNOWN',
}

export enum ProductEcoScore {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  'NOT-APPLICABLE' = 'NOT-APPLICABLE',
  'UNKNOWN' = 'UNKNOWN',
}

export type ProductSupplierDtoPayload = {
  supplier: number;
  purchasePrice: number;
};

export type ProductSupplierDto = {
  supplier: Pick<SupplierDto, 'id'>;
  product: number;
  purchasePrice: number;
};

export type ExtendedProductSupplierDtoPayload = ProductSupplierDtoPayload & {
  id?: string;
};
