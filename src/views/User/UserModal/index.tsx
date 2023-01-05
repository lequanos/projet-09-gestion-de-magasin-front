import { Backdrop, Fade, Box, Dialog } from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';

import '../User.scss';
import { useAccessToken, useToastContext, useCreateMutation } from '@/hooks';
import { RSButton } from '@/components/RS';
import { IErrorResponse } from '@/services/api/interfaces';
import { UserDto, UserDtoPayload } from '@/models/user';
import UserForm, { UserFormValues } from '../UserForm';

type UserModalProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

function UserModal({ open, setOpen }: UserModalProps) {
  // Hooks
  const { accessToken } = useAccessToken();
  const { toast } = useToastContext();
  const { t } = useTranslation('translation');
  const methods = useForm<UserFormValues>({
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      aisles: [],
      role: undefined,
    },
  });

  const addUserPayload = methods.watch();

  // States
  const [user, setUser] = useState<UserDto>();

  // Queries
  const addUserMutation = useCreateMutation<UserDtoPayload, UserDto>(
    {
      toCreate: {
        body: {
          ...addUserPayload,
          pictureUrl: user?.pictureUrl || '',
        },
      },
    },
    'user',
    accessToken,
  );

  // Methods
  /**
   * Called when clicked on cancel button or close icon
   */
  const handleClose = () => {
    setOpen(false);
    setUser(undefined);
  };

  /**
   * Post user to backend API
   */
  const handleAddUser = () => {
    addUserMutation.mutate(undefined, {
      onSuccess: (response) => {
        const { ok, status } = response;

        if ([401, 403].includes(status)) {
          throw new Response('', { status });
        }

        if (!ok) {
          const addUserError = response as IErrorResponse<UserDto>;
          toast[addUserError.formatted.type](
            t(addUserError.formatted.errorDefault as string, {
              name: t(`Common.User`),
            }),
            addUserError.formatted.title,
          );
          return;
        }
        toast.success('User.Form.Success_Add', 'User.Form.Success_Add_Title');
        methods.reset();
        handleClose();
        setUser(undefined);
      },
    });
  };

  /**
   * Save the user
   */
  const handleSave = async () => {
    methods.handleSubmit(handleAddUser)();
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
        className="user--modal"
        sx={{
          width: '100%',
        }}
      >
        <Fade in={open}>
          <Box className="user--modal-container">
            <Box className="user--modal-main">
              <Box className="user--modal-content">
                <FormProvider {...methods}>
                  <UserForm user={user} readOnly={false} />
                </FormProvider>
              </Box>
            </Box>
            <div className="user--modal-footer">
              <RSButton color="inherit" onClick={handleClose}>
                {t('User.Modal.Cancel')}
              </RSButton>
              <RSButton
                color={user ? 'primary' : 'inherit'}
                disabled={!user}
                onClick={handleSave}
              >
                {t('User.Form.Save')}
              </RSButton>
            </div>
          </Box>
        </Fade>
      </Dialog>
    </div>
  );
}

export default UserModal;
