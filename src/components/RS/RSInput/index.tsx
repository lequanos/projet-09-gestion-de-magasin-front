import { VisibilityOff, Visibility, Search, Edit } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { useState, SyntheticEvent, useRef } from 'react';
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
import { capitalize, userHasPermission } from '@/helpers/utils';
import { useUserContext } from '@/hooks';
import { Permission } from '@/models/role';

type RSInputProps<T extends FieldValues> = {
  className?: string;
  control?: Control<T, any>;
  errors: Partial<FieldErrorsImpl<T>>;
  endIcon?: 'search';
  helperText?: string;
  hiddenLabel?: boolean;
  id?: string;
  inputProps?: { [key: string]: any };
  InputProps?: { [key: string]: any };
  label?: string;
  name: Path<T>;
  multiline?: boolean;
  onChange?: (e: SyntheticEvent) => void;
  onClick?: (e: SyntheticEvent) => void;
  onStartIconClick?: (e: SyntheticEvent) => void;
  permissions?: Permission[];
  readOnly?: boolean;
  rules?: Exclude<
    RegisterOptions,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >;
  variant?: 'standard' | 'filled' | 'outlined';
  size?: 'small' | 'medium';
  startIcon?: 'monetary' | 'edit';
  type?: 'text' | 'email' | 'password' | 'number';
};

export function RSInput<T extends FieldValues>({
  className,
  control,
  errors,
  endIcon,
  helperText,
  hiddenLabel = false,
  id,
  inputProps,
  InputProps,
  label = '',
  name,
  multiline = false,
  onChange,
  onClick,
  onStartIconClick,
  permissions,
  readOnly = false,
  rules,
  variant = 'filled',
  size = 'medium',
  startIcon,
  type = 'text',
}: RSInputProps<T>) {
  // Hooks
  const { t } = useTranslation('translation');
  const [show, setShow] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useUserContext();

  const getHelperText = () => {
    const message = errors[name]?.message;

    if (!message || !errors[name]) {
      return helperText;
    }

    if (['threshold', 'price'].includes(name)) {
      return t(message as string, {
        [name]: inputProps?.min,
      });
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
    let inputPropsToReturn: {
      [key: string]: any;
    } = inputProps || {};

    if (readOnly) {
      inputPropsToReturn = {
        ...inputProps,
        readOnly,
      };
    }

    return inputPropsToReturn;
  };

  const getFilledInputProps = () => {
    let InputPropsToReturn: {
      [key: string]: any;
    } = InputProps || {};

    if (type === 'password') {
      InputPropsToReturn = {
        ...InputProps,
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
      InputPropsToReturn = {
        ...InputProps,
        endAdornment: (
          <InputAdornment position="end">
            <IconButton edge="end">
              <Search />
            </IconButton>
          </InputAdornment>
        ),
      };
    }

    if (startIcon === 'edit') {
      InputPropsToReturn = {
        ...InputProps,
        startAdornment: (
          <InputAdornment position="start">
            <IconButton
              edge="start"
              disabled={
                (!readOnly && userHasPermission(user, permissions)) ||
                !userHasPermission(user, permissions)
              }
              onClick={(e) => {
                if (onStartIconClick) onStartIconClick(e);
                if (inputRef.current && readOnly) {
                  (
                    inputRef.current.children[0].children[1] as HTMLInputElement
                  ).focus();
                }
              }}
            >
              <Edit color="primary" />
            </IconButton>
          </InputAdornment>
        ),
      };
    }

    if (startIcon === 'monetary') {
      InputPropsToReturn = {
        ...InputProps,
        startAdornment: <InputAdornment position="start">€</InputAdornment>,
      };
    }

    return InputPropsToReturn;
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
          inputProps={getInputProps()}
          InputProps={getFilledInputProps()}
          multiline={multiline}
          label={label}
          hiddenLabel={hiddenLabel}
          type={show && type === 'password' ? 'text' : type}
          variant={variant}
          size={size}
          sx={{
            marginTop: '1rem',
          }}
          {...field}
          rows={3}
          onChange={onChange || field.onChange}
          onClick={onClick}
          ref={(e) => {
            field.ref(e);
            (inputRef.current as any) = e;
          }}
        />
      )}
    />
  );
}
