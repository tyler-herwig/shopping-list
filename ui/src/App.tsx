import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserContextProvider } from './context/UserContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ListDetail from './pages/ListDetail';
import './utils/axiosConfig';
import { CssBaseline } from '@mui/material';
import BottomNavbar from './components/BottomNavbar';
import { BottomNavbarProvider } from './context/BottomNavbarContext';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <BottomNavbarProvider>
          <Router>
            <CssBaseline />
            <BottomNavbar/>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/lists/:id" element={<ListDetail/>} />
              <Route path="/" element={<Login />} />
            </Routes>
          </Router>
        </BottomNavbarProvider>
      </UserContextProvider>
    </QueryClientProvider>
  );
};

export default App;