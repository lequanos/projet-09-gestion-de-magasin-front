import { ApiService } from '../api/ApiService';
import { IErrorResponse, ISuccessResponse } from '../api/interfaces';
import { GetStoresResponse } from './interfaces/getStoresReponse.interface';
import { StoreRequest } from './interfaces/storeRequest.interface';

export class StoreService extends ApiService {
  public crud: StoreRequest;

  constructor(accessToken?: string) {
    super('store', accessToken);
    this.crud = this.createStoreEntity();
  }

  private createStoreEntity(): StoreRequest {
    const baseCrud = super.createEntity('store') as StoreRequest;

    baseCrud.searchStores = async (
      searchValue: string,
    ): Promise<
      | ISuccessResponse<GetStoresResponse>
      | IErrorResponse<GetStoresResponse | undefined>
    > => {
      const response = await baseCrud.get<GetStoresResponse>({
        complementURL: `search/${searchValue}`,
      });

      return response;
    };

    return baseCrud;
  }
}
