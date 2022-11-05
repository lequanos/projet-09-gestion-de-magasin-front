import type { IApiResponse } from './apiResponse.interface';

export type FormattedError = {
  title: 'Error_Title' | 'Warning_Title';
  type: 'error' | 'warning';
  errorDefault:
    | 'Badrequest_Label'
    | 'Unauthorized_Label'
    | 'Forbidden_Label'
    | 'Notfound_Label'
    | 'General_Label';
};

export type ErrorsType = {
  ERROR: {
    type: 'error';
    title: 'Error_Title';
  };
  WARNING: {
    type: 'warning';
    title: 'Warning_Title';
  };
};

export interface IErrorResponse<T> extends IApiResponse<T> {
  /**
   * Error formatted
   */
  formatted: FormattedError;
}
