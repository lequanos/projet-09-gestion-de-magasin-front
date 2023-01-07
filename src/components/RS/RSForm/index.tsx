import { Box } from '@mui/material';
import { SyntheticEvent } from 'react';
import { FieldValues, UseFormHandleSubmit } from 'react-hook-form';

type RSFormProps = {
  children: JSX.Element | JSX.Element[];
  className?: string;
  onSubmit?: ReturnType<UseFormHandleSubmit<FieldValues>>;
  onClick?: (e: SyntheticEvent) => void;
};

export function RSForm({
  children,
  className,
  onSubmit,
  onClick,
}: RSFormProps) {
  return (
    <Box
      component="form"
      className={className}
      onSubmit={onSubmit}
      onClick={onClick}
    >
      {children}
    </Box>
  );
}
