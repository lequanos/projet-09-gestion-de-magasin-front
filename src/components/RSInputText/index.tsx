import { TextField } from '@mui/material';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';

type CommonRSInputTextProps = {
  className?: string;
  defaultValue?: any;
  error?: boolean;
  helperText?: string;
  id?: string;
  inputProps?: { [key: string]: any };
  label: string;
  required?: boolean;
  variant?: 'standard' | 'filled' | 'outlined' | undefined;
};

type ConditionalRSInputTextProps =
  | {
      value: string;
      setValue: Dispatch<SetStateAction<string>>;
      type?: 'text' | 'email' | 'password';
    }
  | {
      value: number;
      setValue: Dispatch<SetStateAction<number>>;
      type?: 'number';
    };

type RSInputTextProps = CommonRSInputTextProps & ConditionalRSInputTextProps;

function RSInputText({
  className,
  defaultValue,
  error = false,
  helperText,
  id,
  inputProps,
  label,
  required = false,
  value,
  variant = 'standard',
  setValue,
  type = 'text',
}: RSInputTextProps) {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setValue(e.target.value as SetStateAction<string> & SetStateAction<number>);
  };

  return (
    <TextField
      className={className}
      defaultValue={defaultValue}
      error={error}
      helperText={helperText}
      id={id}
      InputProps={inputProps}
      label={label}
      onChange={handleChange}
      required={required}
      type={type}
      value={value}
      variant={variant}
      sx={{
        marginTop: '1rem',
      }}
    />
  );
}

export default RSInputText;
