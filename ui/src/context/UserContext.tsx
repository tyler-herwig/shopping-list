import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserContextType {
  userId: string | null;
  userName: string | null;
  setUserData: (userId: string, userName: string) => void;
  clearUserData: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserContextProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');
    if (storedUserId && storedUserName) {
      setUserId(storedUserId);
      setUserName(storedUserName);
    }
  }, []);

  const setUserData = (userId: string, userName: string) => {
    localStorage.setItem('userId', userId);
    localStorage.setItem('userName', userName);
    setUserId(userId);
    setUserName(userName);
  };

  const clearUserData = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    setUserId(null);
    setUserName(null);
  };

  return (
    <UserContext.Provider value={{ userId, userName, setUserData, clearUserData }}>
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