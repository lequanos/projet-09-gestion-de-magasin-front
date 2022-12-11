import { ProductDto } from '@/models/product';
import { StoreDto } from '@/models/store';
import { GetProductStatsResponse } from '@/services/product/interfaces/productResponse.interface';
import { GetStoreStatsResponse } from '@/services/store/interfaces/storeReponse.interface';
import { GetSupplierStatsResponse } from '@/services/supplier/interfaces/supplierResponse.interface';
import { GetUserStatsResponse } from '@/services/user/interfaces/userResponse.interface';

export type GetDashboardInfosResponse = {
  stats: StatsResponse;
  tableData: TableDataResponse;
};

export type StatsResponse = {
  store?: GetStoreStatsResponse;
  product?: GetProductStatsResponse;
  supplier?: GetSupplierStatsResponse;
  user?: GetUserStatsResponse;
};

export type TableDataResponse = StoreDto[] | ProductDto[];
