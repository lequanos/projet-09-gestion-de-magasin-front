import { Button } from '@mui/material';
import { DefaultTFuncReturn } from 'i18next';

type RSButtonProps = {
  variant?: 'contained' | 'text' | 'outlined' | undefined;
  className?: string;
  children: string | string[] | DefaultTFuncReturn;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset' | undefined;
};

export function RSButton({
  variant = 'contained',
  className,
  children,
  onClick,
  type = 'button',
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
      type={type}
    >
      {children}
    </Button>
  );
}
