import { Box, AppBar, Toolbar, IconButton, Typography, Button } from '@mui/material';
import { Menu } from '@mui/icons-material';
import React from 'react';
import { useUserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const { clearUserData } = useUserContext();

      const handleLogout = async (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.removeItem('authToken');
        clearUserData();
        navigate('/login');
      };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <Menu />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Listify
                </Typography>
                <Button color="inherit" onClick={(e) => handleLogout(e)}>Logout</Button>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Header;