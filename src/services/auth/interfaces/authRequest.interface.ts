import { LoginDto, SelectStoreDto } from '@/models/auth';
import {
  IErrorResponse,
  ISuccessResponse,
  CRUD,
} from '@/services/api/interfaces';
import { LoginResponse, SelectStoreResponse } from './authResponse.interface';

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
