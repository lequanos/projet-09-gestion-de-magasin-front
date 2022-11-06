import { Button } from '@mui/material';
import { DefaultTFuncReturn } from 'i18next';

type RSButtonProps = {
  variant?: 'contained' | 'text' | 'outlined' | undefined;
  className?: string;
  children: string | string[] | DefaultTFuncReturn;
  onClick?: () => void;
};

export function RSButton({
  variant = 'contained',
  className,
  children,
  onClick,
}: RSButtonProps) {
  return (
    <Button
      variant={variant}
      sx={{
        marginTop: '2.5rem',
        borderRadius: 0,
        backgroundImage: 'linear-gradient(to bottom left, #7CA2CB, #4578AD)',
        '&:hover': {
          backgroundImage: 'linear-gradient(to bottom left, #4578AD, #345A83)',
          color: 'secondary.main',
        },
      }}
      onClick={onClick}
      className={className}
    >
      {children}
    </Button>
  );
}
// main: '#4578AD',
// dark: '#345A83',
// light: '#7CA2CB',
