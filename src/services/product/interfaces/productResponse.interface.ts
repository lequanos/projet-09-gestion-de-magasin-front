import { ProductNutriScore, ProductEcoScore } from '@/models/product';
import { BaseModel } from '@/services/interfaces/common.interface';

export type GetProductsResponse = ProductResponse[];

export type ProductResponse = {
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
} & BaseModel;

export type GetProductStatsResponse = {
  activeProductsCount: number;
  productsCount: number;
  progression: number;
  [key: string]: number;
};
