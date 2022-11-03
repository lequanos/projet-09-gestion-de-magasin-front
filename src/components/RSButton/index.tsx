import { Button } from '@mui/material';
import { DefaultTFuncReturn } from 'i18next';

type RSButtonProps = {
  variant?: 'contained' | 'text' | 'outlined' | undefined;
  children: string | string[] | DefaultTFuncReturn;
  onClick?: () => void;
};

function RSButton({ variant = 'contained', children, onClick }: RSButtonProps) {
  return (
    <Button
      variant={variant}
      sx={{
        marginTop: '2.5rem',
        borderRadius: 0,
      }}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

export default RSButton;
