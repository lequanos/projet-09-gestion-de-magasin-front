import { Box } from '@mui/material';

type RSFormProps = {
  children: JSX.Element | JSX.Element[];
  className: string;
  onSubmit?: () => void;
};

export function RSForm({ children, className, onSubmit }: RSFormProps) {
  return (
    <Box component="form" className={className} onSubmit={onSubmit}>
      {children}
    </Box>
  );
}
