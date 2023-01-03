import { BaseModel } from '../interfaces/common.interface';

export type StoreDto = BaseModel & {
  address?: string;
  city?: string;
  isActive?: boolean;
  pictureUrl?: string;
  postcode?: string;
  siren?: string;
  siret?: string;
  movement?: number;
};

export type StoreDtoPayload = Omit<StoreDto, 'id'> & {
  id?: string;
};
