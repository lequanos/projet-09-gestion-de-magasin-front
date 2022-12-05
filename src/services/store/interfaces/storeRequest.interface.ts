import {
  CRUD,
  IErrorResponse,
  ISuccessResponse,
} from '@/services/api/interfaces';
import { GetStoresResponse } from './getStoresReponse.interface';

export interface StoreRequest extends CRUD {
  searchStores(
    searchValue: string,
  ): Promise<
    | ISuccessResponse<GetStoresResponse>
    | IErrorResponse<GetStoresResponse | undefined>
  >;
}
