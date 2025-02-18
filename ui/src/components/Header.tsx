import { Box, Typography, Avatar, Menu, MenuItem } from '@mui/material';
import React, { useState } from 'react';
import { useUserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
    title?: string | undefined;
    subTitle?: string | undefined;
}

const Header: React.FC<HeaderProps> = ({ title, subTitle }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const navigate = useNavigate();
    const { user, clearUserData } = useUserContext();

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        clearUserData();
        localStorage.removeItem('authToken');
        navigate('/login');
        return;
    }

    return (
        <>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={3}
                sx={{
                    width: "100%",
                    backgroundColor: "#f4f4f4",
                    borderBottomLeftRadius: "20px",
                    borderBottomRightRadius: "20px",
                    padding: "20px",
                }}
            >
                <Box>
                    {title  && (
                        <Typography variant="h4" fontWeight="bold">
                            {title}
                        </Typography>
                    )}
                    {subTitle && (
                        <Typography variant="h6" color="textSecondary" gutterBottom>
                            {subTitle}
                        </Typography>
                    )}
                </Box>
                <Avatar sx={{ width: 56, height: 56 }} onClick={handleMenuClick}>
                    {user?.first_name?.charAt(0).toUpperCase()}
                </Avatar>
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
      </>
    )
}

export default Header;