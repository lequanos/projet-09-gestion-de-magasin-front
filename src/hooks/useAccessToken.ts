import { useLocation, useNavigate } from 'react-router-dom';
import { useLocalStorage } from './useLocalStorage';

export function useAccessToken() {
  const [accessToken, setAccessToken] = useLocalStorage<string>('access_token');
  const location = useLocation();
  const navigate = useNavigate();

  const getAccessToken = (): string | undefined => {
    if (!accessToken && location.pathname !== '/') {
      throw new Response('', { status: 401 });
    }

    if (accessToken && location.pathname === '/') {
      navigate('/dashboard');
    }

    return accessToken;
  };

  return {
    accessToken: getAccessToken(),
    setAccessToken,
  };
}
