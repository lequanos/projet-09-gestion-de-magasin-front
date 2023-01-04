import { BaseModel } from '../interfaces/common.interface';

export type SupplierDto = BaseModel & {
  phoneNumber?: string;
  address?: string;
  postcode?: string;
  city?: string;
  siren?: string;
  siret?: string;
  contact?: string;
  isActive?: false;
  pictureUrl?: string;
};

export type SupplierDtoPayload = Omit<SupplierDto, 'id'> & {
  id?: string;
};
