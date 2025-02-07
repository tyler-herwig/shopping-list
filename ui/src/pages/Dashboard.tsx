import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Lists from '../components/Lists';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }
  }, []);

  return (
    <Lists/>
  );
};

export default Dashboard;