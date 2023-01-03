import { Backdrop, Fade, Box, Dialog } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction } from 'react';
import {
  RefetchOptions,
  RefetchQueryFilters,
  QueryObserverResult,
} from '@tanstack/react-query';

import '../Store.scss';
import { useAccessToken, useDeleteMutation, useToastContext } from '@/hooks';
import { RSButton } from '@/components/RS';
import { onSuccess } from '@/helpers/utils';
import { StoreDto } from '@/models/store';
import { ISuccessResponse, IErrorResponse } from '@/services/api/interfaces';

type DeleteStoreModalProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  id: number;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
  ) => Promise<
    QueryObserverResult<
      ISuccessResponse<StoreDto[]> | IErrorResponse<StoreDto[] | undefined>,
      unknown
    >
  >;
};

function DeleteStoreModal({
  open,
  setOpen,
  id,
  refetch,
}: DeleteStoreModalProps) {
  // Hooks
  const { t } = useTranslation('translation');
  const { accessToken } = useAccessToken();
  const { toast } = useToastContext();

  // States

  // Queries
  const deleteMutation = useDeleteMutation('store', accessToken);

  // Methods
  /**
   * Delete store
   */
  const handleDeleteStore = () => {
    deleteMutation.mutate(
      { id: id.toString() },
      {
        onSuccess: onSuccess<void>(
          () => {
            refetch();
            setOpen(false);
          },
          toast,
          'Store',
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
        className="store--delete-modal"
      >
        <Fade in={open}>
          <Box className="store--delete-modal-container">
            <Box className="store--delete-modal-main">
              {t('Store.DeleteModal.Text')}
            </Box>
            <div className="store--delete-modal-footer">
              <RSButton color="inherit" onClick={() => setOpen(false)}>
                {t('Store.DeleteModal.Cancel')}
              </RSButton>
              <RSButton color="primary" onClick={handleDeleteStore}>
                {t('Store.DeleteModal.Confirm')}
              </RSButton>
            </div>
          </Box>
        </Fade>
      </Dialog>
    </div>
  );
}

export default DeleteStoreModal;
