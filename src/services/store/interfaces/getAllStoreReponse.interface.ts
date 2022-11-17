import { BaseModel } from '../../interfaces/common.interface';

export type GetAllStoreResponse = StoreResponse[];

export type StoreResponse = {
  address: string;
  city: string;
  isActive: boolean;
  pictureUrl: string;
  postcode: string;
  siren: string;
  siret: string;
} & BaseModel;
