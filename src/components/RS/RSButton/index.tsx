import { useUserContext } from '@/hooks';
import { Permission, RoleDto } from '@/models/role';
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
    | 'primaryDark'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning';
  disabled?: boolean;
  disableRipple?: boolean;
  onClick?: () => void;
  permissions?: Permission[];
  sx?: SxProps<Theme>;
  type?: 'button' | 'submit' | 'reset';
};

export function RSButton({
  className,
  children,
  color = 'primary',
  disabled = false,
  disableRipple = true,
  sx,
  permissions,
  type = 'button',
  variant = 'contained',
  onClick,
}: RSButtonProps) {
  // Hooks
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { user } = useUserContext();

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

  if (
    variant === 'contained' &&
    color === 'primary' &&
    buttonRef &&
    buttonRef.current
  ) {
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

  /**
   * Get colorProps for Mui button from custom button props
   */
  const getColor = () => {
    return color.split(/(?=[A-Z])/)[0] as
      | 'inherit'
      | 'primary'
      | 'secondary'
      | 'success'
      | 'error'
      | 'info'
      | 'warning'
      | undefined;
  };

  return (
    <>
      {(!permissions ||
        (user.role as RoleDto).permissions.some((perm) =>
          permissions?.includes(perm),
        )) && (
        <Button
          variant={variant}
          sx={sxProps}
          onClick={onClick}
          className={className}
          type={type}
          color={getColor()}
          ref={buttonRef}
          disableRipple={disableRipple}
          disabled={disabled}
        >
          {children}
        </Button>
      )}
    </>
  );
}
