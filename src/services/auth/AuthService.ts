import { LoginDto } from '../../models/auth';
import { ApiService } from '../api/ApiService';
import { AuthRequest } from './interfaces/authRequest.interface';
import { LoginResponse } from './interfaces/loginResponse.interface';
import { IErrorResponse, ISuccessResponse } from '../api/interfaces';

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
      | IErrorResponse<LoginResponse | undefined>
    > => {
      const response = await baseCrud.post<LoginDto, LoginResponse>({
        complementURL: 'login',
        query: {
          body: {
            email: loginDto.email,
            password: loginDto.password,
          },
        },
      });

      return response;
    };

    return baseCrud;
  }
}
