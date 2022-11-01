import { Box } from '@mui/material';

type RSFormProps = {
  children: JSX.Element | JSX.Element[];
  className: string;
};

function RSForm({ children, className }: RSFormProps) {
  return (
    <Box component="form" className={className}>
      {children}
    </Box>
  );
}

export default RSForm;
