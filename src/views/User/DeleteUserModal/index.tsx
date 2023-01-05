import { Backdrop, Fade, Box, Dialog } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction } from 'react';
import {
  RefetchOptions,
  RefetchQueryFilters,
  QueryObserverResult,
} from '@tanstack/react-query';

import '../User.scss';
import { useAccessToken, useDeleteMutation, useToastContext } from '@/hooks';
import { RSButton } from '@/components/RS';
import { onSuccess } from '@/helpers/utils';
import { UserDto } from '@/models/user';
import { ISuccessResponse, IErrorResponse } from '@/services/api/interfaces';

type DeleteUserModalProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  id: number;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
  ) => Promise<
    QueryObserverResult<
      ISuccessResponse<UserDto[]> | IErrorResponse<UserDto[] | undefined>,
      unknown
    >
  >;
};

function DeleteUserModal({ open, setOpen, id, refetch }: DeleteUserModalProps) {
  // Hooks
  const { t } = useTranslation('translation');
  const { accessToken } = useAccessToken();
  const { toast } = useToastContext();

  // States

  // Queries
  const deleteMutation = useDeleteMutation('user', accessToken);

  // Methods
  /**
   * Delete user
   */
  const handleDeleteUser = () => {
    deleteMutation.mutate(
      { id: id.toString() },
      {
        onSuccess: onSuccess<void>(
          () => {
            refetch();
            setOpen(false);
          },
          toast,
          'User',
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
        className="user--delete-modal"
      >
        <Fade in={open}>
          <Box className="user--delete-modal-container">
            <Box className="user--delete-modal-main">
              {t('User.DeleteModal.Text')}
            </Box>
            <div className="user--delete-modal-footer">
              <RSButton color="inherit" onClick={() => setOpen(false)}>
                {t('User.DeleteModal.Cancel')}
              </RSButton>
              <RSButton color="primary" onClick={handleDeleteUser}>
                {t('User.DeleteModal.Confirm')}
              </RSButton>
            </div>
          </Box>
        </Fade>
      </Dialog>
    </div>
  );
}

export default DeleteUserModal;
