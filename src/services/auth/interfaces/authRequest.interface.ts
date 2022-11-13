import { LoginDto } from '../../../models/auth';
import { LoginResponse } from './loginResponse.interface';
import { IErrorResponse, ISuccessResponse, CRUD } from '../../api/interfaces';

export interface AuthRequest extends CRUD {
  login(
    loginDto: LoginDto,
  ): Promise<
    ISuccessResponse<LoginResponse> | IErrorResponse<LoginResponse | undefined>
  >;
}
