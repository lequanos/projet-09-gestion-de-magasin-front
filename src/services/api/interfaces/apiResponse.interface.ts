export interface IApiResponse<T> {
  /**
   * Show if request is in error or success
   */
  ok: boolean;
  /**
   * Status
   */
  status: number;
  /**
   * Data
   */
  data: T;
}
