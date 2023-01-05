import { BaseModel } from '../interfaces/common.interface';
import { RoleDto } from '../role';

export type UserDto = Omit<BaseModel, 'name'> & {
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  logged: boolean;
  pictureUrl: string;
  refreshToken: string;
  role?: number | RoleDto;
  store: number | null;
  aisles: number[];
};

export type UserDtoPayload = Omit<
  UserDto,
  'id' | 'store' | 'logged' | 'refreshToken'
> & {
  id?: string;
};
