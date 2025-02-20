import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Badge, BottomNavigation, BottomNavigationAction, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import { useBottomNavbar } from '../context/BottomNavbarContext';
import { Box, styled } from '@mui/system';
import { Close, ViewList } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { fetchListCount } from '../api/lists';
import { useUserContext } from '../context/UserContext';

const BottomNavbar: React.FC = () => {
  const [menuDrawerOpen, setMenuDrawerOpen] = useState<boolean>(false);

  const { user } = useUserContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { handleOpenListModal, handleOpenListItemModal } = useBottomNavbar();

  const { data: activeListCount, isLoading: isLoadingActiveListCount } = useQuery({
    queryKey: ['active-list-count', user?.user_id],
    queryFn: () => user?.user_id ? fetchListCount(user.user_id, false) : null,
    enabled: !!user?.user_id && window.location.pathname !== '/login'
  });

  const { data: completedListCount, isLoading: isLoadingCompletedListCount } = useQuery({
    queryKey: ['completed-list-count', user?.user_id],
    queryFn: () => user?.user_id ? fetchListCount(user.user_id, true) : null,
    enabled: !!user?.user_id && window.location.pathname !== '/login'
  });

  const showAddButton = location.pathname !== '/dashboard/completed' ? true : false;

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

  const handleMenuButton = () => {
    setMenuDrawerOpen(true);
  };

  if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <>
    <StyledBottomNavbar showLabels>
      <StyledBottomNavigationAction
        icon={<ArrowBackIcon />}
        onClick={handleBackButton}
      />
      {showAddButton && (
        <CenterAddButton 
          icon={<AddIcon />}
          onClick={handleAddButton}
        />
      )}
      <StyledBottomNavigationAction
        icon={<MenuIcon />}
        onClick={handleMenuButton}
      />
    </StyledBottomNavbar>
    <Drawer
        anchor="bottom"
        open={menuDrawerOpen}
        onClose={() => setMenuDrawerOpen(false)}
        sx={{
        width: 'auto',
        flexShrink: 0,
          '& .MuiDrawer-paper': {
              width: '100%',
              height: 'auto',
              borderRadius: '20px 20px 0 0',
              padding: '20px',
              boxSizing: 'border-box',
          },
        }}
      >
          <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Menu
          </Typography>
          <IconButton sx={{ padding: 0 }} onClick={() => setMenuDrawerOpen(false)}>
              <Close />
          </IconButton>
          </Box>

          <List>
          <ListItem 
            onClick={
              () => {
                setMenuDrawerOpen(false);
                navigate('/dashboard');
              }
            }
          >
              <ListItemIcon>
                <Badge badgeContent={isLoadingActiveListCount ? '...' : activeListCount} color="secondary">
                  <ViewList/>
                </Badge>
              </ListItemIcon>
              <ListItemText primary="Active Lists" />
          </ListItem>
          <Divider />
          <ListItem 
            onClick={
              () => {
                setMenuDrawerOpen(false);
                navigate('/dashboard/completed');
              }
            }
          >
              <ListItemIcon>
                <Badge badgeContent={isLoadingCompletedListCount ? '...' : completedListCount} color="primary">
                  <ViewList/>
                </Badge>
              </ListItemIcon>
              <ListItemText primary="Completed Lists" />
          </ListItem>
          </List>
      </Drawer>
    </>
    
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