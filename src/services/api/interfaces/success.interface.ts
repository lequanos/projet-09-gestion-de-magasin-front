import type { IApiResponse } from './apiResponse.interface';

export interface ISuccessResponse<T> extends IApiResponse<T> {
  /**
   * API header response
   */
  headers: any;
}
