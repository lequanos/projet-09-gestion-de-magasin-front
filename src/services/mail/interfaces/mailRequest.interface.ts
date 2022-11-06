import { MailDto } from '../../../models/mail';
import { IErrorResponse, ISuccessResponse, CRUD } from '../../api/interfaces';

export interface MailRequest extends CRUD {
  askSubscription({
    firstname,
    lastname,
    email,
  }: MailDto): Promise<
    ISuccessResponse<string> | IErrorResponse<string | undefined>
  >;
}
