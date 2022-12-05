import {
  CRUD,
  IErrorResponse,
  ISuccessResponse,
} from '@/services/api/interfaces';
import { GetDashboardInfosResponse } from './dashboardResponse.interface';

export interface DashboardRequest extends CRUD {
  getInfos(): Promise<
    | ISuccessResponse<GetDashboardInfosResponse>
    | IErrorResponse<GetDashboardInfosResponse | undefined>
  >;
}
