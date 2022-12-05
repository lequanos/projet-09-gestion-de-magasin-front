import { ApiService } from '../api/ApiService';
import { IErrorResponse, ISuccessResponse } from '../api/interfaces';
import { DashboardRequest } from './interfaces/dashboardRequest.interface';
import { GetDashboardInfosResponse } from './interfaces/dashboardResponse.interface';

export class DashboardService extends ApiService {
  public crud: DashboardRequest;

  constructor(accessToken?: string) {
    super('dashboard', accessToken);
    this.crud = this.createDashboardEntity();
  }

  private createDashboardEntity(): DashboardRequest {
    const baseCrud = super.createEntity('dashboard') as DashboardRequest;

    baseCrud.getInfos = async (): Promise<
      | ISuccessResponse<GetDashboardInfosResponse>
      | IErrorResponse<GetDashboardInfosResponse | undefined>
    > => {
      const response = await baseCrud.get<GetDashboardInfosResponse>({});

      return response;
    };

    return baseCrud;
  }
}
