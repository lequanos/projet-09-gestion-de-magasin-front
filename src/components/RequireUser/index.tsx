import { Navigate, useLocation } from 'react-router-dom';

import { useUserContext } from '../../hooks/useUserContext';

type RequireUserProps = {
  role: number;
  children: JSX.Element;
};

function RequireUser({ role, children }: RequireUserProps) {
  const { user } = useUserContext();
  console.log(user);
  const location = useLocation();

  if (!user.logged && location.pathname === '/') {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!user.logged) {
    return <Navigate to="/401" state={{ from: location }} replace />;
  }

  if (role != user.role) {
    return <Navigate to="/403" state={{ from: location }} replace />;
  }

  return children;
}

export default RequireUser;
