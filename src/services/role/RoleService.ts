import { ApiService } from '../api/ApiService';
import { CRUD } from '../api/interfaces';

export class RoleService extends ApiService {
  public crud: CRUD;

  constructor(accessToken?: string) {
    super('role', accessToken);
    this.crud = this.createEntity('role');
  }
}
