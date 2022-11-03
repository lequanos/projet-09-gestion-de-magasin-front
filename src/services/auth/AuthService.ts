import { LoginDto } from '../../models/auth';
import { ApiService } from '../api/ApiService';
import CRUD from '../api/interfaces/crud.interface';
import { IErrorResponse } from '../api/interfaces/error.interface';
import { LoginResponse } from './interfaces/loginResponse.interface';

export class AuthService extends ApiService {
  private readonly crud: CRUD;

  constructor(url?: string) {
    super(url);
    this.crud = this.createEntity('auth');
  }

  async login(loginDto: LoginDto) {
    const response = this.crud.post<LoginDto, LoginResponse>({
      complementURL: 'login',
      query: {
        body: {
          email: loginDto.email,
          password: loginDto.password,
        },
      },
    });

    let datas: LoginResponse | IErrorResponse<LoginResponse> | undefined;

    await response.then((res) => {
      const { ok } = res;
      if (ok) {
        datas = res.data;
      } else {
        datas = res as IErrorResponse<LoginResponse>;
      }
    });

    return datas;
  }
}
