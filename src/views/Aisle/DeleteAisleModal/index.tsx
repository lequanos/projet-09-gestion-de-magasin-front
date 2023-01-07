import { Backdrop, Fade, Box, Dialog } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction } from 'react';
import {
  RefetchOptions,
  RefetchQueryFilters,
  QueryObserverResult,
} from '@tanstack/react-query';

import '../Aisle.scss';
import { useAccessToken, useDeleteMutation, useToastContext } from '@/hooks';
import { RSButton } from '@/components/RS';
import { onSuccess } from '@/helpers/utils';
import { AisleDto } from '@/models/aisle';
import { ISuccessResponse, IErrorResponse } from '@/services/api/interfaces';

type DeleteAisleModalProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  id: number;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
  ) => Promise<
    QueryObserverResult<
      ISuccessResponse<AisleDto[]> | IErrorResponse<AisleDto[] | undefined>,
      unknown
    >
  >;
};

function DeleteAisleModal({
  open,
  setOpen,
  id,
  refetch,
}: DeleteAisleModalProps) {
  // Hooks
  const { t } = useTranslation('translation');
  const { accessToken } = useAccessToken();
  const { toast } = useToastContext();

  // Queries
  const deleteMutation = useDeleteMutation('aisle', accessToken);

  // Methods
  /**
   * Delete aisle
   */
  const handleDeleteAisle = () => {
    deleteMutation.mutate(
      { id: id.toString() },
      {
        onSuccess: onSuccess<void>(
          () => {
            refetch();
            setOpen(false);
          },
          toast,
          'Aisle',
        ),
      },
    );
  };

  return (
    <div>
      <Dialog
        open={open}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        className="aisle--delete-modal"
      >
        <Fade in={open}>
          <Box className="aisle--delete-modal-container">
            <Box className="aisle--delete-modal-main">
              {t('Aisle.DeleteModal.Text')}
            </Box>
            <div className="aisle--delete-modal-footer">
              <RSButton color="inherit" onClick={() => setOpen(false)}>
                {t('Aisle.DeleteModal.Cancel')}
              </RSButton>
              <RSButton color="primary" onClick={handleDeleteAisle}>
                {t('Aisle.DeleteModal.Confirm')}
              </RSButton>
            </div>
          </Box>
        </Fade>
      </Dialog>
    </div>
  );
}

export default DeleteAisleModal;
