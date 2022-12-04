import { BaseModel } from '@/services/interfaces/common.interface';

export type GetStoresResponse = StoreResponse[];

export type StoreResponse = {
  address?: string;
  city?: string;
  isActive?: boolean;
  pictureUrl?: string;
  postcode?: string;
  siren?: string;
  siret?: string;
  movement?: number;
} & BaseModel;

export type GetStoreStatsResponse = {
  activeStoresCount: number;
  storesCount: number;
  progression: number;
};
