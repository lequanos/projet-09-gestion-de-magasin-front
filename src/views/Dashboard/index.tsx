import { Container, Box, Card, CardContent, CardHeader } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';

import './Dashboard.scss';
import DashboardCard from '@/components/Dashboard/DashboardCard';
import DashboardModal from './DashboardModal';
import {
  useAccessToken,
  useGetMostActive,
  useGetStatsQuery,
  useToastContext,
} from '@/hooks';
import { IErrorResponse } from '@/services/api/interfaces';
import {
  GetStoresResponse,
  GetStoreStatsResponse,
} from '@/services/store/interfaces/getStoresReponse.interface';

function Dashboard() {
  // Hooks
  const { t } = useTranslation('translation');
  const { toast } = useToastContext();
  const [stores, setStores] = useState<GetStoresResponse>([]);
  const [storeStats, setStoreStats] = useState<GetStoreStatsResponse | null>(
    null,
  );
  const { accessToken } = useAccessToken();

  // Queries
  useGetMostActive<GetStoresResponse>('store', accessToken, ({ pages }) => {
    if (!pages) return;
    const { ok, status, data } = pages[0];
    if ([401, 403].includes(status)) {
      throw new Response('', { status });
    }

    if (!ok) {
      const getStoreError = pages[0] as IErrorResponse<GetStoresResponse>;
      toast[getStoreError.formatted.type](
        getStoreError.formatted.errorDefault,
        getStoreError.formatted.title,
      );
      return;
    }

    setStores(data || []);
  });

  useGetStatsQuery<GetStoreStatsResponse>('store', accessToken, (response) => {
    const { ok, status, data } = response;
    if ([401, 403].includes(status)) {
      throw new Response('', { status });
    }

    setStoreStats(data);
  });

  // Data
  const columns: GridColDef[] = [
    { field: 'name', headerName: t('Dashboard.Columns.Name'), flex: 1 },
    { field: 'city', headerName: t('Dashboard.Columns.City'), flex: 1 },
    { field: 'siret', headerName: t('Dashboard.Columns.Siret'), flex: 1 },
    { field: 'movement', headerName: t('Dashboard.Columns.Movement'), flex: 1 },
  ];

  return (
    <>
      <Container className="dashboard--container">
        <Box className="dashboard--indicators">
          <DashboardCard
            title="Dashboard.Card.ActiveStores"
            evolution={storeStats?.progression}
            active={storeStats?.activeStoresCount}
            total={storeStats?.storesCount}
          />
          <DashboardCard
            title="Dashboard.Card.ActiveUsers"
            evolution={-10.56}
            active={10}
            total={100}
          />
        </Box>
        <Card className="dashboard--active-stores">
          <CardHeader title={t('Dashboard.MostActiveStores')} />
          <CardContent className="dashboard--active-stores-table">
            <DataGrid
              rows={stores}
              columns={columns}
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
