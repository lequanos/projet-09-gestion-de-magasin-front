import { Container, Card, CardContent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

import './Aisle.scss';
import DeleteAisleModal from './DeleteAisleModal';
import {
  useAccessToken,
  useGetAllQuery,
  useToastContext,
  useUserContext,
} from '@/hooks';
import { ISuccessResponse } from '@/services/api/interfaces';
import { RSButton } from '@/components/RS';
import { onSuccess } from '@/helpers/utils';
import { Permission } from '@/models/role';
import { AisleDto } from '@/models/aisle';
import AisleItem from './AisleItem';

function Aisle() {
  // Hooks
  const { t } = useTranslation('translation');
  const { toast } = useToastContext();
  const { accessToken } = useAccessToken();
  const { user } = useUserContext();

  // States
  const [data, setData] = useState<AisleDto[]>([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [aisleId, setAisleId] = useState(0);

  // Queries
  const { isFetching, refetch } = useGetAllQuery<AisleDto[]>(
    'aisle',
    accessToken,
    {
      params: { select: 'categories,name', nested: 'categories.name' },
    },
    true,
    onSuccess<AisleDto[]>(
      (response: ISuccessResponse<AisleDto[]>) => setData(response.data),
      toast,
      'Aisle',
    ),
  );

  // Methods
  /**
   * Open delete aisle modal
   */
  const handleDeleteAisle = () => {
    setOpenDelete(true);
  };

  return (
    <>
      <Container className="aisle--container">
        <RSButton
          className="aisle--add-btn"
          color="primary"
          onClick={() => console.log('Ouvert')}
          permissions={[Permission.MANAGE_ALL, Permission.MANAGE_AISLE]}
          startIcon="add"
        >
          {t('Aisle.AddAisle')}
        </RSButton>
        <Card className="aisle--accordion-container">
          <CardContent className="aisle--accordion-content">
            {data
              .filter((aisle) => aisle.name !== 'All')
              .map((datum) => (
                <AisleItem
                  key={datum.id}
                  aisleId={aisleId}
                  setAisleId={setAisleId}
                  aisle={datum}
                />
              ))}
          </CardContent>
        </Card>
      </Container>
      <DeleteAisleModal
        open={openDelete}
        setOpen={setOpenDelete}
        id={aisleId}
        refetch={refetch}
      />
    </>
  );
}

export default Aisle;
