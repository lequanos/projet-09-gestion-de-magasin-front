import { Box } from '@mui/material';
import { FieldValues, UseFormHandleSubmit } from 'react-hook-form';

type RSFormProps = {
  children: JSX.Element | JSX.Element[];
  className?: string;
  onSubmit?: ReturnType<UseFormHandleSubmit<FieldValues>>;
};

export function RSForm({ children, className, onSubmit }: RSFormProps) {
  return (
    <Box component="form" className={className} onSubmit={onSubmit}>
      {children}
    </Box>
  );
}
