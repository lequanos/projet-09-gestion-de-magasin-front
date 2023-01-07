import { Container, Card, CardContent, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

import './Aisle.scss';
import DeleteAisleModal from './DeleteAisleModal';
import {
  useAccessToken,
  useCreateMutation,
  useGetAllQuery,
  useToastContext,
  useUserContext,
} from '@/hooks';
import { IErrorResponse, ISuccessResponse } from '@/services/api/interfaces';
import { RSButton } from '@/components/RS';
import { onSuccess } from '@/helpers/utils';
import { Permission } from '@/models/role';
import { AisleDto, AisleDtoPayload } from '@/models/aisle';
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

  const addAisleMutation = useCreateMutation<AisleDtoPayload, AisleDto>(
    {
      toCreate: {
        body: {
          name: `${t('Common.Aisle')} ${data.length - 1}`,
        },
      },
    },
    'aisle',
    accessToken,
  );

  // Methods
  /**
   * Add a new aisle
   */
  const handleAddAisle = () => {
    addAisleMutation.mutate(undefined, {
      onSuccess: (response) => {
        const { ok, status } = response;

        if ([401, 403].includes(status)) {
          throw new Response('', { status });
        }

        if (!ok) {
          const addAisleError = response as IErrorResponse<AisleDto>;
          toast[addAisleError.formatted.type](
            t(addAisleError.formatted.errorDefault as string, {
              name: t(`Common.Aisle`),
            }),
            addAisleError.formatted.title,
          );
          return;
        }
        toast.success('Aisle.Success_Add', 'Aisle.Success_Add_Title');
        refetch();
      },
    });
  };

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
          onClick={handleAddAisle}
          permissions={[Permission.MANAGE_ALL, Permission.MANAGE_AISLE]}
          startIcon="add"
        >
          {t('Aisle.AddAisle')}
        </RSButton>
        <Card className="aisle--accordion-container">
          {isFetching ? (
            <CircularProgress />
          ) : (
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
          )}
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
