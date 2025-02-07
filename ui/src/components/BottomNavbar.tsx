import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useBottomNavbar } from '../context/BottomNavbarContext';

const BottomNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleOpenListModal, handleOpenListItemModal } = useBottomNavbar();

  const handleBackButton = () => {
    navigate(-1);
  };

  const handleAddButton = () => {
    if (location.pathname.includes('/dashboard/lists/')) {
      handleOpenListItemModal();
    } else if (location.pathname === '/dashboard') {
      handleOpenListModal();
    }
  };

  const handleProfileButton = () => {
    alert("Profile button clicked!");
  };

  return (
    <BottomNavigation
      showLabels
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: 'white',
      }}
    >
      <BottomNavigationAction
        label="Back"
        icon={<ArrowBackIcon />}
        onClick={handleBackButton}
      />
      <BottomNavigationAction
        label="Add"
        icon={<AddIcon />}
        onClick={handleAddButton}
      />
      <BottomNavigationAction
        label="Profile"
        icon={<AccountCircleIcon />}
        onClick={handleProfileButton}
      />
    </BottomNavigation>
  );
};

export default BottomNavbar;