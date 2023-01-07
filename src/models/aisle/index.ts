import { CategoryDto } from '../category';
import { BaseModel } from '../interfaces/common.interface';

export type AisleDto = BaseModel & {
  categories?: CategoryDto[];
};

export type AisleDtoPayload = Omit<AisleDto, 'id' | 'categories'> & {
  id?: string;
};
