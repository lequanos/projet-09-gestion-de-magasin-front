import { LoginDto, SelectStoreDto } from '../../../models/auth';
import { LoginResponse, SelectStoreResponse } from './authResponse.interface';
import { IErrorResponse, ISuccessResponse, CRUD } from '../../api/interfaces';

export interface AuthRequest extends CRUD {
  login(
    loginDto: LoginDto,
  ): Promise<
    ISuccessResponse<LoginResponse> | IErrorResponse<LoginResponse | undefined>
  >;

  selectStore(
    selectStoreDto: SelectStoreDto,
  ): Promise<
    | ISuccessResponse<SelectStoreResponse>
    | IErrorResponse<SelectStoreResponse | undefined>
  >;
}
