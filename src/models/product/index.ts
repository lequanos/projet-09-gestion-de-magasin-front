import { BrandDto } from '../brand';
import { BaseModel } from '../interfaces/common.interface';

export type ProductDto = BaseModel & {
  code?: string;
  price?: number;
  isActive?: boolean;
  pictureUrl?: string;
  nutriScore?: ProductNutriScore;
  ecoScore?: ProductEcoScore;
  unitPackaging?: string;
  threshold?: number;
  ingredients?: string;
  inStock?: number;
  sales?: number;
  brand?: BrandDto | string;
  productSuppliers: ProductSupplierDto[];
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

export type ProductSupplierDto = {
  supplier: number;
  purchasePrice: number;
};

export type ExtendedProductSupplierDto = ProductSupplierDto & { id?: string };
