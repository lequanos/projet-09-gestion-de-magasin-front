import { RSForm, RSInput } from '@/components/RS';
import { Box } from '@mui/material';

import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { UserDto, UserDtoPayload } from '@/models/user';

type UserFormProps = {
  user?: UserDtoPayload | UserDto;
  readOnly?: boolean;
  update: boolean;
};

export type UserFormValues = {
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  aisles: number[];
  role?: number;
};

function UserForm({ user, readOnly = true, update = false }: UserFormProps) {
  // Hooks
  const { t } = useTranslation('translation');
  const {
    control,
    formState: { errors },
  } = useFormContext<UserFormValues>();

  return (
    <Box className="user--form">
      <Box
        className="user--form-picture"
        sx={{ backgroundImage: `url(${user?.pictureUrl})` }}
      />
      <RSForm className="user--form-form">
        <RSInput
          className="user--form-input"
          label={t('User.Form.Firstname')}
          name="firstname"
          control={control}
          errors={errors}
          size="small"
          readOnly={readOnly}
        />
        <RSInput
          className="user--form-input"
          label={t('User.Form.Lastname')}
          name="lastname"
          control={control}
          errors={errors}
          size="small"
          readOnly={readOnly}
        />
        <RSInput
          className="user--form-input"
          label={t('User.Form.Email')}
          name="email"
          control={control}
          errors={errors}
          size="small"
          readOnly={readOnly}
          inputProps={{
            maxLength: 5,
          }}
        />
        <RSInput
          className="user--form-input"
          label={t('User.Form.Password')}
          name="password"
          control={control}
          errors={errors}
          size="small"
          readOnly={update}
          type="password"
        />
      </RSForm>
    </Box>
  );
}

export default UserForm;
