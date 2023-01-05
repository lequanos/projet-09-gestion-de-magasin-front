import { ApiService } from '../api/ApiService';
import { CRUD } from '../api/interfaces';

export class UserService extends ApiService {
  public crud: CRUD;

  constructor(accessToken?: string) {
    super('user', accessToken);
    this.crud = this.createEntity('user');
  }
}
