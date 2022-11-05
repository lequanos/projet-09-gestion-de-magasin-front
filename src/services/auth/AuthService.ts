import { LoginDto } from '../../models/auth';
import { ApiService } from '../api/ApiService';
import { AuthRequest } from '../api/interfaces/authRequest.interface';
import { IErrorResponse } from '../api/interfaces/error.interface';
import { ISuccessResponse } from '../api/interfaces/success.interface';
import { LoginResponse } from './interfaces/loginResponse.interface';

export class AuthService extends ApiService {
  public crud: AuthRequest;
  constructor(accessToken?: string) {
    super('auth', accessToken);
    this.crud = this.createAuthEntity();
  }

  private createAuthEntity(): AuthRequest {
    const baseCrud = super.createEntity('auth') as AuthRequest;

    baseCrud.login = async (
      loginDto: LoginDto,
    ): Promise<
      | ISuccessResponse<LoginResponse>
      | IErrorResponse<LoginResponse>
      | undefined
    > => {
      const response = baseCrud.post<LoginDto, LoginResponse>({
        complementURL: 'login',
        query: {
          body: {
            email: loginDto.email,
            password: loginDto.password,
          },
        },
      });

      return await response;
    };

    return baseCrud;
  }
}
