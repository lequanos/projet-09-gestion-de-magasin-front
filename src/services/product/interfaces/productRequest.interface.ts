import { ProductDto } from '@/models/product';
import {
  CRUD,
  IErrorResponse,
  ISuccessResponse,
} from '@/services/api/interfaces';

export interface ProductRequest extends CRUD {
  searchProduct(
    searchValue: string,
  ): Promise<
    ISuccessResponse<ProductDto> | IErrorResponse<ProductDto | undefined>
  >;
}
