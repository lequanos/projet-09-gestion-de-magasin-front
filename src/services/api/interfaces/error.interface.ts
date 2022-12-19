import type { IApiResponse } from '.';

export type FormattedError = {
  title: 'Error.Error_Title' | 'Error.Warning_Title';
  type: 'error' | 'warning';
  errorDefault:
    | 'Error.Conflict_Label'
    | 'Error.Badrequest_Label'
    | 'Error.Unauthorized_Label'
    | 'Error.Forbidden_Label'
    | 'Error.Notfound_Label'
    | 'Error.General_Label';
};

export type ErrorsType = {
  ERROR: {
    type: 'error';
    title: 'Error.Error_Title';
  };
  WARNING: {
    type: 'warning';
    title: 'Error.Warning_Title';
  };
};

export interface IErrorResponse<T> extends IApiResponse<T> {
  /**
   * Error formatted
   */
  formatted: FormattedError;
}
