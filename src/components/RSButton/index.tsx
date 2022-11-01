import { Button } from '@mui/material';

type RSButtonProps = {
  variant?: 'contained' | 'text' | 'outlined' | undefined;
  children: string | string[];
};

function RSButton({ variant = 'contained', children }: RSButtonProps) {
  return (
    <Button
      variant={variant}
      sx={{
        marginTop: '3rem',
        borderRadius: 0,
      }}
    >
      {children}
    </Button>
  );
}

export default RSButton;
