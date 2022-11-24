import { Container, Box, Card, CardContent, CardHeader } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';

import './Dashboard.scss';
import DashboardCard from '@/components/Dashboard/DashboardCard';
import DashboardModal from './DashboardModal';
import { RSToast } from '@/components/RS';
import { useAccessToken, useGetAllQuery, useToast } from '@/hooks';
import { IErrorResponse } from '@/services/api/interfaces';
import { GetAllStoreResponse } from '@/services/store/interfaces/getAllStoreReponse.interface';

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'city', headerName: 'City', flex: 1 },
  { field: 'siret', headerName: 'SIRET', flex: 1 },
];

function Dashboard() {
  // Hooks
  const { t } = useTranslation('translation');
  const [toastValues, setToastValues] = useToast(
    'Error.Error_Title',
    'Error.General_Label',
    'info',
  );
  const [stores, setStores] = useState<GetAllStoreResponse>([]);
  const { accessToken } = useAccessToken();

  // Queries
  useGetAllQuery<GetAllStoreResponse>('store', accessToken, ({ pages }) => {
    const { ok, status, data } = pages[0];
    if ([401, 403].includes(status)) {
      throw new Response('', { status });
    }

    if (!ok) {
      const getStoreError = pages[0] as IErrorResponse<GetAllStoreResponse>;
      setToastValues({
        title: getStoreError.formatted.title,
        message: getStoreError.formatted.errorDefault,
        severity: getStoreError.formatted.type,
      });
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
      <DashboardModal setToastValues={setToastValues} stores={stores} />
      <RSToast toastValues={toastValues} setToastValues={setToastValues} />
    </>
  );
}

export default Dashboard;
