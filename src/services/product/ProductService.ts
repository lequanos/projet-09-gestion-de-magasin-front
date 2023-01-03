import { ProductDto } from '@/models/product';
import { ApiService } from '../api/ApiService';
import { ISuccessResponse, IErrorResponse } from '../api/interfaces';
import { ProductRequest } from './interfaces/productRequest.interface';

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
      ISuccessResponse<ProductDto> | IErrorResponse<ProductDto | undefined>
    > => {
      const response = await baseCrud.get<ProductDto>({
        complementURL: `search?search=${searchValue}`,
      });

      return response;
    };

    return baseCrud;
  }
}
