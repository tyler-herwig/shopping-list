import React, { createContext, useContext, useState, useEffect } from 'react';
import { IUser } from '../models/user';

interface UserContextType {
  user: IUser | null;
  setUserData: (user: IUser) => void;
  clearUserData: () => void;
  isUserLoaded: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserContextProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<IUser | null>(null);
  const [isUserLoaded, setIsUserLoaded] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
      setIsUserLoaded(true);
    }
  }, []);

  const setUserData = (user: IUser) => {
    localStorage.setItem('user', JSON.stringify(user));
    setUserInfo(user);
    setIsUserLoaded(true);
  };

  const clearUserData = () => {
    localStorage.removeItem('user');
    setUserInfo(null);
    setIsUserLoaded(false);
  };

  return (
    <UserContext.Provider value={{ user: userInfo, setUserData, clearUserData, isUserLoaded }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  return context;
};