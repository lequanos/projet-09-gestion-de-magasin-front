import { SupplierDto } from '@/models/supplier';
import {
  CRUD,
  IErrorResponse,
  ISuccessResponse,
} from '@/services/api/interfaces';

export interface SupplierRequest extends CRUD {
  searchSuppliers(
    searchValue: string,
  ): Promise<
    ISuccessResponse<SupplierDto> | IErrorResponse<SupplierDto | undefined>
  >;
}
