import { VisibilityOff, Visibility, Search } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { useState, SyntheticEvent } from 'react';
import {
  Control,
  Controller,
  FieldErrorsImpl,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { rulesValidationDictionary } from '@/helpers/rulesValidationDictionary';
import { capitalize } from '@/helpers/utils';

type RSInputProps<T extends FieldValues> = {
  className?: string;
  control?: Control<T, any>;
  errors: Partial<FieldErrorsImpl<T>>;
  endIcon?: 'search' | 'monetary';
  helperText?: string;
  id?: string;
  inputProps?: { [key: string]: any };
  label: string;
  name: Path<T>;
  multiline?: boolean;
  onChange?: (e: SyntheticEvent) => void;
  readOnly?: boolean;
  rules?: Exclude<
    RegisterOptions,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >;
  variant?: 'standard' | 'filled' | 'outlined';
  size?: 'small' | 'medium';
  type?: 'text' | 'email' | 'password' | 'number';
};

export function RSInput<T extends FieldValues>({
  className,
  control,
  errors,
  endIcon,
  helperText,
  id,
  inputProps,
  label,
  name,
  multiline = false,
  onChange,
  readOnly = false,
  rules,
  variant = 'filled',
  size = 'medium',
  type = 'text',
}: RSInputProps<T>) {
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

    if (endIcon === 'search') {
      inputPropsToReturn = {
        ...inputProps,
        endAdornment: (
          <InputAdornment position="end">
            <IconButton edge="end">
              <Search />
            </IconButton>
          </InputAdornment>
        ),
      };
    }

    if (endIcon === 'monetary') {
      inputPropsToReturn = {
        ...inputProps,
        endAdornment: <InputAdornment position="end">€</InputAdornment>,
      };
    }

    if (readOnly) {
      inputPropsToReturn = {
        ...inputProps,
        readOnly,
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
          multiline={multiline}
          label={label}
          type={show && type === 'password' ? 'text' : type}
          variant={variant}
          size={size}
          sx={{
            marginTop: '1rem',
          }}
          {...field}
          rows={3}
          onChange={onChange || field.onChange}
        />
      )}
    />
  );
}
