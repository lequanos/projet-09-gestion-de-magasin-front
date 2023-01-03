import { Container, Box, Card, CardContent, CardHeader } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';

import './Dashboard.scss';
import DashboardCard from '@/components/Dashboard/DashboardCard';
import DashboardModal from './DashboardModal';
import { useAccessToken, useGetDashboardInfos, useToastContext } from '@/hooks';
import { IErrorResponse, ISuccessResponse } from '@/services/api/interfaces';
import {
  GetDashboardInfosResponse,
  StatsResponse,
  TableDataResponse,
} from '@/services/dashboard/interfaces/dashboardResponse.interface';
import { capitalize, getColumns } from '@/helpers/utils';

function Dashboard() {
  // Hooks
  const { t } = useTranslation('translation');
  const { toast } = useToastContext();
  const [tableData, setTableData] = useState<TableDataResponse>([]);
  const [stats, setStats] = useState<StatsResponse>({});
  const { accessToken } = useAccessToken();

  // Queries
  const { isLoading } = useGetDashboardInfos(accessToken, (response) => {
    const { ok, status } = response;

    if ([401, 403].includes(status)) {
      throw new Response('', { status });
    }

    if (!ok) {
      const getInfosError =
        response as IErrorResponse<GetDashboardInfosResponse>;

      toast[getInfosError.formatted.type](
        getInfosError.formatted.errorDefault,
        getInfosError.formatted.title,
      );
      return;
    }

    const getInfosResponse =
      response as ISuccessResponse<GetDashboardInfosResponse>;
    setStats(getInfosResponse.data.stats);
    setTableData(getInfosResponse.data.tableData);
  });

  // Methods
  /**
   * Get table title depending on tableData
   */
  const getTableTitle = (): string => {
    if (!tableData.length) return '';

    const dataKeys = Object.keys(tableData[0]);

    return dataKeys.includes('sales')
      ? 'Dashboard.MostSoldProducts'
      : 'Dashboard.MostActiveStores';
  };

  return (
    <>
      <Container className="dashboard--container">
        <Box className="dashboard--indicators">
          {Object.entries(stats).map(([key, value]) => (
            <DashboardCard
              key={key}
              title={`Dashboard.Card.Active${capitalize(key)}s`}
              evolution={Number(value.progression.toFixed(2))}
              active={value[`active${capitalize(key)}sCount`]}
              total={value[`${key}sCount`]}
            />
          ))}
        </Box>
        <Card className="dashboard--active-stores">
          <CardHeader title={t(getTableTitle())} />
          <CardContent className="dashboard--active-stores-table">
            <DataGrid
              rows={tableData}
              columns={getColumns(tableData, 'dashboard')}
              loading={isLoading}
              disableSelectionOnClick
              autoPageSize
            />
          </CardContent>
        </Card>
      </Container>
      <DashboardModal />
    </>
  );
}

export default Dashboard;
