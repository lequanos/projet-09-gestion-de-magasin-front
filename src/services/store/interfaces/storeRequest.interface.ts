import { StoreDto } from '@/models/store';
import {
  CRUD,
  IErrorResponse,
  ISuccessResponse,
} from '@/services/api/interfaces';

export interface StoreRequest extends CRUD {
  searchStores(
    searchValue: string,
  ): Promise<
    ISuccessResponse<StoreDto[]> | IErrorResponse<StoreDto[] | undefined>
  >;
}
