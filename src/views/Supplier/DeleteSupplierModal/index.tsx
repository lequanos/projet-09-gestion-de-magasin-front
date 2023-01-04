import { Backdrop, Fade, Box, Dialog } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction } from 'react';
import {
  RefetchOptions,
  RefetchQueryFilters,
  QueryObserverResult,
} from '@tanstack/react-query';

import '../Supplier.scss';
import { useAccessToken, useDeleteMutation, useToastContext } from '@/hooks';
import { RSButton } from '@/components/RS';
import { onSuccess } from '@/helpers/utils';
import { SupplierDto } from '@/models/supplier';
import { ISuccessResponse, IErrorResponse } from '@/services/api/interfaces';

type DeleteSupplierModalProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  id: number;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
  ) => Promise<
    QueryObserverResult<
      ISuccessResponse<SupplierDto[]> | IErrorResponse<SupplierDto[] | undefined>,
      unknown
    >
  >;
};

function DeleteSupplierModal({
  open,
  setOpen,
  id,
  refetch,
}: DeleteSupplierModalProps) {
  // Hooks
  const { t } = useTranslation('translation');
  const { accessToken } = useAccessToken();
  const { toast } = useToastContext();

  // States

  // Queries
  const deleteMutation = useDeleteMutation('supplier', accessToken);

  // Methods
  /**
   * Delete supplier
   */
  const handleDeleteSupplier = () => {
    deleteMutation.mutate(
      { id: id.toString() },
      {
        onSuccess: onSuccess<void>(
          () => {
            refetch();
            setOpen(false);
          },
          toast,
          'Supplier',
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
        className="supplier--delete-modal"
      >
        <Fade in={open}>
          <Box className="supplier--delete-modal-container">
            <Box className="supplier--delete-modal-main">
              {t('Supplier.DeleteModal.Text')}
            </Box>
            <div className="supplier--delete-modal-footer">
              <RSButton color="inherit" onClick={() => setOpen(false)}>
                {t('Supplier.DeleteModal.Cancel')}
              </RSButton>
              <RSButton color="primary" onClick={handleDeleteSupplier}>
                {t('Supplier.DeleteModal.Confirm')}
              </RSButton>
            </div>
          </Box>
        </Fade>
      </Dialog>
    </div>
  );
}

export default DeleteSupplierModal;
