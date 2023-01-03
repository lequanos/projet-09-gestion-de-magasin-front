import { Backdrop, Fade, Box, Dialog } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction } from 'react';
import {
  RefetchOptions,
  RefetchQueryFilters,
  QueryObserverResult,
} from '@tanstack/react-query';

import '../Product.scss';
import { useAccessToken, useDeleteMutation, useToastContext } from '@/hooks';
import { RSButton } from '@/components/RS';
import { onSuccess } from '@/helpers/utils';
import { ProductDto } from '@/models/product';
import { ISuccessResponse, IErrorResponse } from '@/services/api/interfaces';

type DeleteProductModalProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  id: number;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
  ) => Promise<
    QueryObserverResult<
      ISuccessResponse<ProductDto[]> | IErrorResponse<ProductDto[] | undefined>,
      unknown
    >
  >;
};

function DeleteProductModal({
  open,
  setOpen,
  id,
  refetch,
}: DeleteProductModalProps) {
  // Hooks
  const { t } = useTranslation('translation');
  const { accessToken } = useAccessToken();
  const { toast } = useToastContext();

  // States

  // Queries
  const deleteMutation = useDeleteMutation('product', accessToken);

  // Methods
  /**
   * Delete product
   */
  const handleDeleteProduct = () => {
    deleteMutation.mutate(
      { id: id.toString() },
      {
        onSuccess: onSuccess<void>(
          () => {
            refetch();
            setOpen(false);
          },
          toast,
          'Product',
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
        className="product--delete-modal"
      >
        <Fade in={open}>
          <Box className="product--delete-modal-container">
            <Box className="product--delete-modal-main">
              {t('Product.DeleteModal.Text')}
            </Box>
            <div className="product--delete-modal-footer">
              <RSButton color="inherit" onClick={() => setOpen(false)}>
                {t('Product.DeleteModal.Cancel')}
              </RSButton>
              <RSButton color="primary" onClick={handleDeleteProduct}>
                {t('Product.DeleteModal.Confirm')}
              </RSButton>
            </div>
          </Box>
        </Fade>
      </Dialog>
    </div>
  );
}

export default DeleteProductModal;
