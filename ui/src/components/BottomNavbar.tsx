import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import Search from '@mui/icons-material/Search';
import { useBottomNavbar } from '../context/BottomNavbarContext';
import { styled } from '@mui/system';

// Styled components for Bottom Navbar
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

const CenterAddButton = styled(Box)({
  cursor: 'pointer',
  height: '60px',
  width: '60px',
  textAlign: 'center',
  position: 'absolute',
  top: '-22px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: '#6a1b9a',
  borderRadius: '50%',
  padding: '12px',
  zIndex: 1,
  border: '3px solid #f4f4f4'
});

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

  const handleSearchButton = () => {
    alert('Search button clicked!');
  };

  return (
    <StyledBottomNavbar showLabels>
      <StyledBottomNavigationAction
        icon={<ArrowBackIcon />}
        onClick={handleBackButton}
      />
      {/* Centered Add button */}
      <CenterAddButton onClick={handleAddButton}>
        <AddIcon sx={{ color: 'white' }} />
      </CenterAddButton>
      <StyledBottomNavigationAction
        icon={<Search />}
        onClick={handleSearchButton}
      />
    </StyledBottomNavbar>
  );
};

export default BottomNavbar;