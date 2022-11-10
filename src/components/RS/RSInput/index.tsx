import { TextField } from '@mui/material';
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

  const getHelperText = () => {
    const message = errors[name]?.message;

    if (!message || !errors[name]) {
      return helperText;
    }
    return t(message as string, { name: t(`Common.${capitalize(name)}`) });
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
          InputProps={inputProps}
          label={label}
          type={type}
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
