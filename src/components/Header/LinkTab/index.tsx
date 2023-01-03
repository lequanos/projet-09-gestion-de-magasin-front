import { SxProps, Tab, Theme } from '@mui/material';
import { Link } from 'react-router-dom';
import { Permission, RoleDto } from '@/models/role';
import { useUserContext } from '@/hooks';

type LinkTabProps = {
  [key: string]: any;
  permissions?: Permission[];
};

function LinkTab(props: LinkTabProps) {
  const { user } = useUserContext();

  const isDisplayed = (): SxProps<Theme> | undefined => {
    return (user.role as RoleDto).permissions.some((perm) =>
      props.permissions?.includes(perm),
    ) || !props.permissions
      ? undefined
      : ({ display: 'none' } as SxProps<Theme>);
  };
  return (
    <>
      <Tab
        component={Link}
        to={props.pathname}
        {...props}
        sx={isDisplayed()}
        disabled={!user.store && props.value > 1}
      />
    </>
  );
}

export default LinkTab;
