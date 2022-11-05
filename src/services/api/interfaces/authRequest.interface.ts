import { LoginDto } from '../../../models/auth';
import { LoginResponse } from '../../auth/interfaces/loginResponse.interface';
import CRUD from './crud.interface';
import { IErrorResponse } from './error.interface';
import { ISuccessResponse } from './success.interface';

export interface AuthRequest extends CRUD {
  login(
    loginDto: LoginDto,
  ): Promise<
    ISuccessResponse<LoginResponse> | IErrorResponse<LoginResponse | undefined>
  >;
}
