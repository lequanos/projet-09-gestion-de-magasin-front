import { ApiService } from '../api/ApiService';
import { CRUD } from '../api/interfaces';

export class CategoryService extends ApiService {
  public crud: CRUD;

  constructor(accessToken?: string) {
    super('category', accessToken);
    this.crud = this.createEntity('category');
  }
}
