import { RSForm, RSInput, RSSelect } from '@/components/RS';
import { Box } from '@mui/material';

import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { UserDto, UserDtoPayload } from '@/models/user';
import { RoleDto } from '@/models/role';
import { AisleDto } from '@/models/aisle';

type UserFormProps = {
  user?: UserDtoPayload | UserDto;
  readOnly?: boolean;
  update?: boolean;
  roles: RoleDto[];
  aisles: AisleDto[];
};

export type UserFormValues = {
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  aisles: number[];
  role: number;
};

function UserForm({
  user,
  roles,
  aisles,
  readOnly = true,
  update = false,
}: UserFormProps) {
  // Hooks
  const { t } = useTranslation('translation');
  const {
    control,
    formState: { errors },
    setValue,
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
        <div className="user--form-input">
          <RSSelect
            className="user--form-select"
            id="role"
            label={'User.Form.Role'}
            labelId="roleLabel"
            name="role"
            errors={errors}
            control={control}
            items={roles}
            size="small"
            onChange={(e) => setValue('role', e.target.value)}
            readOnly={readOnly}
          />
          <RSSelect
            className="user--form-select"
            id="aisles"
            label={'User.Form.Aisles'}
            labelId="aislesLabel"
            name="aisles"
            errors={errors}
            control={control}
            items={aisles}
            multiple
            size="small"
            readOnly={readOnly}
          />
        </div>
      </RSForm>
    </Box>
  );
}

export default UserForm;
