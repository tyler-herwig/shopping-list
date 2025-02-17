import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserContextProvider } from './context/UserContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './pages/Login';
import Lists from './pages/Lists';
import ListDetail from './pages/ListDetail';
import './utils/axiosConfig';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import BottomNavbar from './components/BottomNavbar';
import { BottomNavbarProvider } from './context/BottomNavbarContext';
import ProtectedRoute from './components/ProtectedRoute';
import RedirectIfAuthenticated from './components/RedirectIfAuthenticated';

const queryClient = new QueryClient();

const theme = createTheme({
  typography: {
    fontFamily: "'Poppins', sans-serif"
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <UserContextProvider>
          <BottomNavbarProvider>
            <Router>
              <CssBaseline />
              <BottomNavbar/>
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <RedirectIfAuthenticated>
                      <Login />
                    </RedirectIfAuthenticated>
                  } 
                />
                <Route 
                  path="/login" 
                  element={
                    <RedirectIfAuthenticated>
                      <Login />
                    </RedirectIfAuthenticated>
                  }
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Lists />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard/lists/:id" 
                  element={
                    <ProtectedRoute>
                      <ListDetail />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </Router>
          </BottomNavbarProvider>
        </UserContextProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;