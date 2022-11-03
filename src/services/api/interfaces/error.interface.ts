import type { IApiResponse } from './apiResponse.interface';

export interface IErrorResponse<T> extends IApiResponse<T> {
  /**
   * Error formatted
   */
  formatted: any;
}
