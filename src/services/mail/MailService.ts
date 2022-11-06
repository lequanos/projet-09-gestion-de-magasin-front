import { MailDto } from '../../models/mail';
import { ApiService } from '../api/ApiService';
import { IErrorResponse, ISuccessResponse } from '../api/interfaces';
import { MailRequest } from './interfaces/mailRequest.interface';

export class MailService extends ApiService {
  public crud: MailRequest;
  constructor() {
    super('mail');
    this.crud = this.createMailEntity();
  }

  private createMailEntity(): MailRequest {
    const baseCrud = super.createEntity('mail') as MailRequest;

    baseCrud.askSubscription = async ({
      firstname,
      lastname,
      email,
    }: MailDto): Promise<
      ISuccessResponse<string> | IErrorResponse<string | undefined>
    > => {
      const response = await baseCrud.get({
        query: {
          params: {
            firstname,
            lastname,
            email,
          },
        },
      });

      return response;
    };

    return baseCrud;
  }
}
