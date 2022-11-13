import { VisibilityOff, Visibility } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { useState } from 'react';
import {
  Control,
  Controller,
  FieldErrorsImpl,
  RegisterOptions,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { rulesValidationDictionary } from '../../../helpers/rulesValidationDictionary';
import { capitalize } from '../../../helpers/utils';

type RSInputProps = {
  className?: string;
  control?: Control<
    {
      [x: string]: any;
    },
    any
  >;
  errors: Partial<
    FieldErrorsImpl<{
      [x: string]: any;
    }>
  >;
  helperText?: string;
  id?: string;
  inputProps?: { [key: string]: any };
  label: string;
  name: string;
  rules?: Exclude<
    RegisterOptions,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >;
  variant?: 'standard' | 'filled' | 'outlined' | undefined;
  type?: 'text' | 'email' | 'password' | 'number';
};

export function RSInput({
  className,
  control,
  errors,
  helperText,
  id,
  inputProps,
  label,
  name,
  rules,
  variant = 'filled',
  type = 'text',
}: RSInputProps) {
  // Hooks
  const { t } = useTranslation('translation');
  const [show, setShow] = useState(false);

  const getHelperText = () => {
    const message = errors[name]?.message;

    if (!message || !errors[name]) {
      return helperText;
    }
    return t(message as string, { name: t(`Common.${capitalize(name)}`) });
  };

  const handleClickShowPassword = () => {
    setShow(!show);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const getInputProps = () => {
    let inputPropsToReturn = inputProps || {};

    if (type === 'password') {
      inputPropsToReturn = {
        ...inputProps,
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {show ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      };
    }

    return inputPropsToReturn;
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules || rulesValidationDictionary[name]}
      render={({ field }) => (
        <TextField
          className={className}
          error={!!errors[name]}
          helperText={getHelperText()}
          id={id}
          InputProps={getInputProps()}
          label={label}
          type={show && type === 'password' ? 'text' : type}
          variant={variant}
          sx={{
            marginTop: '1rem',
          }}
          {...field}
        />
      )}
    />
  );
}
