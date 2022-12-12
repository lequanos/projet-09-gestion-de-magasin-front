import { ApiService } from '../api/ApiService';
import { CRUD } from '../api/interfaces';

export class SupplierService extends ApiService {
  public crud: CRUD;

  constructor(accessToken?: string) {
    super('supplier', accessToken);
    this.crud = this.createEntity('supplier');
  }
}
