import { useUserContext } from '@/hooks';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

function RequireStore() {
  // Hooks
  const { user } = useUserContext();
  const navigate = useNavigate();

  // useEffect
  useEffect(() => {
    if (!user.store) {
      navigate('/dashboard');
    }
  });

  return (
    <>
      <Outlet />
    </>
  );
}

export default RequireStore;
