import type { IApiResponse } from '.';

export interface ISuccessResponse<T> extends IApiResponse<T> {
  /**
   * API header response
   */
  headers: any;
}
