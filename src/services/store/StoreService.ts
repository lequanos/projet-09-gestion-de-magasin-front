import { ApiService } from '../api/ApiService';
import { CRUD } from '../api/interfaces';

export class StoreService extends ApiService {
  public crud: CRUD;

  constructor(accessToken?: string) {
    super('store', accessToken);
    this.crud = super.createEntity('store');
  }
}
