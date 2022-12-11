import { ApiService } from '../api/ApiService';
import { CRUD } from '../api/interfaces';

export class AisleService extends ApiService {
  public crud: CRUD;

  constructor(accessToken?: string) {
    super('aisle', accessToken);
    this.crud = this.createEntity('aisle');
  }
}
