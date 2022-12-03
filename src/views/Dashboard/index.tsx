import { Container, Box, Card, CardContent, CardHeader } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';

import './Dashboard.scss';
import DashboardCard from '@/components/Dashboard/DashboardCard';
import DashboardModal from './DashboardModal';
import { useAccessToken, useGetMostActive, useToastContext } from '@/hooks';
import { IErrorResponse } from '@/services/api/interfaces';
import { GetStoresResponse } from '@/services/store/interfaces/getStoresReponse.interface';

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'city', headerName: 'City', flex: 1 },
  { field: 'siret', headerName: 'SIRET', flex: 1 },
  { field: 'movement', headerName: 'Movement', flex: 1 },
];

function Dashboard() {
  // Hooks
  const { t } = useTranslation('translation');
  const { toast } = useToastContext();
  const [stores, setStores] = useState<GetStoresResponse>([]);
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

  return (
    <>
      <Container className="dashboard--container">
        <Box className="dashboard--indicators">
          <DashboardCard
            title="Dashboard.Card.ActiveStores"
            evolution={101010}
            active={10}
            total={100}
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
            <DataGrid rows={stores} columns={columns} />
          </CardContent>
        </Card>
      </Container>
      <DashboardModal />
    </>
  );
}

export default Dashboard;
