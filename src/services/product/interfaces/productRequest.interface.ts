import {
  CRUD,
  IErrorResponse,
  ISuccessResponse,
} from '@/services/api/interfaces';
import { ProductResponse } from './productResponse.interface';

export interface ProductRequest extends CRUD {
  searchProduct(
    searchValue: string,
  ): Promise<
    | ISuccessResponse<ProductResponse>
    | IErrorResponse<ProductResponse | undefined>
  >;
}
