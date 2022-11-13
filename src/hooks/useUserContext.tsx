import { createContext, useContext } from 'react';
import { UserDto } from '../models/user';

import { useLocalStorage } from './useLocalStorage';

export type UserContextType = {
  user: UserDto;
  setUser: (newValue: UserDto) => void;
};

export const emptyUser: UserDto = {
  id: '',
  firstname: '',
  lastname: '',
  email: '',
  pictureUrl: '',
  password: '',
  logged: false,
  refreshToken: '',
  role: 0,
  store: 0,
};

const initialContext: UserContextType = {
  user: emptyUser,
  setUser: (newValue: UserDto) => {
    console.log(newValue);
  },
};

export const UserContext = createContext<UserContextType>(initialContext);

export function ContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useLocalStorage<UserDto>('user', emptyUser);

  const contextValue = {
    user,
    setUser,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

// on prépare un hook custom qui nous permet de récupérer le contexte UserContext
export const useUserContext = () => useContext<UserContextType>(UserContext);
