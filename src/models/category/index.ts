import { BaseModel } from '../interfaces/common.interface';

export type CategoryDto = BaseModel & {
  aisle?: number;
};

export type CategoryDtoPayload = Omit<CategoryDto, 'id'> & {
  id?: string;
};
