import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserContextType {
  userId: string | null;
  userName: string | null;
  firstName: string | null;
  setUserData: (userId: string, userName: string, firstName: string) => void;
  clearUserData: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserContextProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');
    const storedfirstName = localStorage.getItem('firstName');
    if (storedUserId && storedUserName && storedfirstName) {
      setUserId(storedUserId);
      setUserName(storedUserName);
      setFirstName(storedfirstName);
    }
  }, []);

  const setUserData = (userId: string, userName: string, firstName: string) => {
    localStorage.setItem('userId', userId);
    localStorage.setItem('userName', userName);
    localStorage.setItem('firstName', firstName);
    setUserId(userId);
    setUserName(userName);
    setFirstName(firstName);
  };

  const clearUserData = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('firstName');
    setUserId(null);
    setUserName(null);
    setFirstName(null);
  };

  return (
    <UserContext.Provider value={{ userId, userName, firstName, setUserData, clearUserData }}>
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