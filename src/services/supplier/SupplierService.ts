import { SupplierDto } from '@/models/supplier';
import { ApiService } from '../api/ApiService';
import { IErrorResponse, ISuccessResponse } from '../api/interfaces';
import { SupplierRequest } from './interfaces/supplierRequest.interface';

export class SupplierService extends ApiService {
  public crud: SupplierRequest;

  constructor(accessToken?: string) {
    super('supplier', accessToken);
    this.crud = this.createSupplierEntity();
  }

  private createSupplierEntity(): SupplierRequest {
    const baseCrud = super.createEntity('supplier') as SupplierRequest;

    baseCrud.searchSuppliers = async (
      searchValue: string,
    ): Promise<
      ISuccessResponse<SupplierDto> | IErrorResponse<SupplierDto | undefined>
    > => {
      const response = await baseCrud.get<SupplierDto>({
        complementURL: `search-siret?search=${searchValue}`,
      });

      return response;
    };

    return baseCrud;
  }
}
