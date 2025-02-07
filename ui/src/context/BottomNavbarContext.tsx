import React, { createContext, useState, useContext } from 'react';

interface BottomNavbarContextProps {
  openListModal: boolean;
  openListItemModal: boolean;
  handleOpenListModal: () => void;
  handleOpenListItemModal: () => void;
  handleCloseModal: () => void;
}

const BottomNavbarContext = createContext<BottomNavbarContextProps | undefined>(undefined);

export const BottomNavbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [openListModal, setOpenListModal] = useState<boolean>(false);
  const [openListItemModal, setOpenListItemModal] = useState<boolean>(false);

  const handleOpenListModal = () => setOpenListModal(true);
  const handleOpenListItemModal = () => setOpenListItemModal(true);
  const handleCloseModal = () => {
    setOpenListModal(false);
    setOpenListItemModal(false);
  };

  return (
    <BottomNavbarContext.Provider value={{ openListModal, openListItemModal, handleOpenListModal, handleOpenListItemModal, handleCloseModal }}>
      {children}
    </BottomNavbarContext.Provider>
  );
};

export const useBottomNavbar = () => {
  const context = useContext(BottomNavbarContext);
  if (!context) {
    throw new Error('useBottomNavbar must be used within a BottomNavbarProvider');
  }
  return context;
};