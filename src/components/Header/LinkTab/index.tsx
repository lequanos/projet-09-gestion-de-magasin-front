import { Tab } from '@mui/material';
import { Link } from 'react-router-dom';
import { Permission, RoleDto } from '@/models/role';
import { useUserContext } from '@/hooks';

type LinkTabProps = {
  [key: string]: any;
  permissions?: Permission[];
};

function LinkTab(props: LinkTabProps) {
  const { user } = useUserContext();
  return (
    <>
      {((user.role as RoleDto).permissions.some((perm) =>
        props.permissions?.includes(perm),
      ) ||
        !props.permissions) && (
        <Tab component={Link} to={props.pathname} {...props} />
      )}
    </>
  );
}

export default LinkTab;
