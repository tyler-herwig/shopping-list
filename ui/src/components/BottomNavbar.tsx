import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import { useBottomNavbar } from '../context/BottomNavbarContext';
import { styled } from '@mui/system';

const BottomNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleOpenListModal, handleOpenListItemModal } = useBottomNavbar();

  if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

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

  const handleSearchButton = () => {
    alert('Settings button clicked!');
  };

  return (
    <StyledBottomNavbar showLabels>
      <StyledBottomNavigationAction
        icon={<ArrowBackIcon />}
        onClick={handleBackButton}
      />
      {/* Centered Add button */}
      <CenterAddButton 
        icon={<AddIcon />}
        onClick={handleAddButton}
      />
      <StyledBottomNavigationAction
        icon={<SettingsIcon />}
        onClick={handleSearchButton}
      />
    </StyledBottomNavbar>
  );
};

const StyledBottomNavbar = styled(BottomNavigation)({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  backgroundColor: "#f4f4f4",
  boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.1)',
});

const StyledBottomNavigationAction = styled(BottomNavigationAction)({
  minWidth: '60px',
  color: '#9e9e9e',
  '&.Mui-selected': {
    color: '#6a1b9a'
  },
});

const CenterAddButton = styled(BottomNavigationAction)({
  position: 'absolute',
  top: '-35px',
  backgroundColor: '#6a1b9a',
  borderRadius: '50%',
  border: '3px solid #f4f4f4',
  color: 'white',
  height: '75px',
  zIndex: 1
});

export default BottomNavbar;