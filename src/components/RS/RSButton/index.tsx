import { Button, SxProps, Theme } from '@mui/material';
import { DefaultTFuncReturn } from 'i18next';

type RSButtonProps = {
  variant?: 'contained' | 'text' | 'outlined' | undefined;
  className?: string;
  children: string | string[] | DefaultTFuncReturn;
  color?:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning'
    | undefined;
  onClick?: () => void;
  sx?: SxProps<Theme>;
  type?: 'button' | 'submit' | 'reset' | undefined;
};

export function RSButton({
  variant = 'contained',
  className,
  children,
  onClick,
  sx,
  color = 'primary',
  type = 'button',
}: RSButtonProps) {
  let sxProps: SxProps<Theme> & { [key: string]: any } = {
    marginTop: '2.5rem',
    borderRadius: 0,
  };

  if (sx) {
    sxProps = {
      ...sxProps,
      ...sx,
    };
  }

  if (variant === 'contained') {
    sxProps.backgroundImage =
      'linear-gradient(to bottom left, #7CA2CB, #4578AD)';
    sxProps['&:hover'] = {
      backgroundImage: 'linear-gradient(to bottom left, #4578AD, #345A83)',
      color: 'secondary.main',
    };
  }

  return (
    <Button
      variant={variant}
      sx={sxProps}
      onClick={onClick}
      className={className}
      type={type}
      color={color}
    >
      {children}
    </Button>
  );
}
