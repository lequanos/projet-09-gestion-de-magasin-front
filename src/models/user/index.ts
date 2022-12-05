import { RoleDto } from '../role';

export type UserDto = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  logged: boolean;
  pictureUrl: string;
  refreshToken: string;
  role: number | RoleDto;
  store: number | null;
};
