import { ApiService } from '../api/ApiService';
import { CRUD } from '../api/interfaces';

export class ProductService extends ApiService {
  public crud: CRUD;

  constructor(accessToken?: string) {
    super('product', accessToken);
    this.crud = this.createEntity('product');
  }
}
