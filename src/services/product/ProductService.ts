import { ApiService } from '../api/ApiService';
import { ISuccessResponse, IErrorResponse } from '../api/interfaces';
import { ProductRequest } from './interfaces/productRequest.interface';
import { ProductResponse } from './interfaces/productResponse.interface';

export class ProductService extends ApiService {
  public crud: ProductRequest;

  constructor(accessToken?: string) {
    super('product', accessToken);
    this.crud = this.createProductEntity();
  }

  private createProductEntity(): ProductRequest {
    const baseCrud = super.createEntity('product') as ProductRequest;

    baseCrud.searchProduct = async (
      searchValue: string,
    ): Promise<
      | ISuccessResponse<ProductResponse>
      | IErrorResponse<ProductResponse | undefined>
    > => {
      const response = await baseCrud.get<ProductResponse>({
        complementURL: `search?search=${searchValue}`,
      });

      return response;
    };

    return baseCrud;
  }
}
