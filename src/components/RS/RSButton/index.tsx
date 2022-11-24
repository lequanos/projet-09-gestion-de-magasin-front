import { Button, SxProps, Theme } from '@mui/material';
import { DefaultTFuncReturn } from 'i18next';
import { useRef } from 'react';

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
  // Hooks
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  if (variant === 'contained' && buttonRef && buttonRef.current) {
    sxProps.backgroundImage =
      'linear-gradient(to bottom left, #7CA2CB, #4578AD, #345A83)';
    sxProps.backgroundSize = `${buttonRef.current.offsetWidth * 2}px ${
      buttonRef.current.offsetHeight * 2
    }px`;
    sxProps.backgroundPosition = 'top right';
    sxProps.transition = 'background 0.5s ease-in-out';
    sxProps['&:hover'] = {
      backgroundPosition: 'bottom left',
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
      ref={buttonRef}
    >
      {children}
    </Button>
  );
}
