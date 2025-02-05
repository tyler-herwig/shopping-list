import React, { useEffect } from 'react';
import {Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import ShoppingLists from '../components/Lists';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { userName } = useUserContext();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }
  }, []);

  return (
    <>
        <Typography variant="h5">
            Welcome, {userName}. Here are your lists
        </Typography>
        <ShoppingLists/>
    </>
  );
};

export default Dashboard;