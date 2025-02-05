import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, BottomNavigation, BottomNavigationAction, Modal, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const BottomNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openModal, setOpenModal] = useState(false);

  const handleBackButton = () => {
    navigate(-1);
  };

  // Handle the add button click
  const handleAddButton = () => {
    if (location.pathname.includes('/dashboard/lists/')) {
      setOpenModal(true);
    } else if (location.pathname === '/dashboard') {
      setOpenModal(true);
    }
  };

  const handleProfileButton = () => {
    alert("Profile button clicked!");
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div>
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

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="add-modal-title"
        aria-describedby="add-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2 id="add-modal-title">Add Content</h2>
          <p id="add-modal-description">Content will be added based on the current page.</p>
          <Button onClick={handleCloseModal}>Close</Button>
        </Box>
      </Modal>
    </div>
  );
};

export default BottomNavbar;