import React from 'react';
import { Button, Typography, TextField, Box, styled, Card, CardContent } from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import axios from '../utils/axiosConfig';
import { IUser } from '../models/user';

interface LoginResponse extends IUser {
  token: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setUserData } = useUserContext();

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleLogin = async (values: { username: string; password: string }) => {
    try {
      const response = await axios.post<LoginResponse>('/login', {
        userName: values.username,
        password: values.password,
      });

      const { token, ...user } = response.data;

      localStorage.setItem('authToken', token);
      setUserData(user);
      navigate('/dashboard');
    } catch (error) {
      // Handle error if login fails
    }
  };

  return (
    <StyledContainer>
      <Box sx={{ height: '230px', width: '100%', padding: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', pt: 1 }}>
          <Typography
            variant="subtitle2"
            color="white"
            sx={{ marginTop: 2, marginBottom: 2 }}
          >
            Don't have an account?
          </Typography>
          <Button
            variant="outlined"
            sx={{
              borderRadius: '15px',
              color: 'white',
              borderColor: 'white',
              marginLeft: 1,
              padding: '6px 12px', 
              fontSize: '0.875rem',
              '&:hover': {
                backgroundColor: '#8e24aa',
                borderColor: '#8e24aa',
                color: 'white',
              },
            }}
            onClick={() => navigate('/register')}
          >
            Get Started
          </Button>
        </Box>
        <StyledTitle variant="h3">
          <AutoFixHighIcon fontSize='large' sx={{ mr: 1 }} />
          Listify
        </StyledTitle>
      </Box>
      <StyledFalseCard/>
      <StyledCard>
        <CardContent>
          <Typography variant="h5" sx={{ textAlign: 'center', paddingTop: 2, fontWeight: 'bold' }}>
            Welcome Back
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" sx={{ textAlign: 'center', marginTop: 2, marginBottom: 2 }}>
            Enter your details below
          </Typography>
          <Formik
            initialValues={{
              username: '',
              password: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {({ errors, touched, handleChange, handleBlur }) => (
              <Form>
                <Field
                  as={TextField}
                  fullWidth
                  label="Username"
                  name="username"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  margin="normal"
                  variant="outlined"
                  error={touched.username && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '15px',
                    },
                  }}
                />
                <Field
                  as={TextField}
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  margin="normal"
                  variant="outlined"
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '15px',
                    },
                  }}
                />
                <StyledLoginButton
                  type="submit"
                  color="primary"
                  fullWidth
                >
                  Login
                </StyledLoginButton>
              </Form>
            )}
          </Formik>
          <Typography variant="subtitle2" sx={{ textAlign: 'center', marginTop: 2 }}>
            Forgot your password?
          </Typography>
        </CardContent>
      </StyledCard>
    </StyledContainer>
  );
};

const StyledContainer = styled(Box)(() => ({
  height: '100vh',
  width: '100vw',
  background: 'linear-gradient(135deg, #6a1b9a 30%, #8e24aa 100%)',
}));

const StyledTitle = styled(Typography)(() => ({
  textAlign: 'center',
  color: 'white',
  marginTop: 40
}));

const StyledFalseCard = styled(Card)(() => ({
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  height: 'calc(100vh)',
  width: '90%',
  margin: 0,
  padding: 0,
  position: 'absolute',
  borderRadius: '30px',
  top: '215px',
  left: '50%',
  transform: 'translateX(-50%)',
}));

const StyledCard = styled(Card)(() => ({
  backgroundColor: 'white',
  height: 'calc(100vh)',
  width: '100vw',
  margin: 0,
  padding: 0,
  position: 'absolute',
  left: 0,
  borderRadius: '30px',
  zIndex: 1,
}));

const StyledLoginButton = styled(Button)(() => ({
  padding: '15px',
  marginTop: '15px',
  borderRadius: '15px',
  background: 'linear-gradient(135deg, #6a1b9a 30%, #8e24aa 100%)',
  color: 'white',
  '&:hover': {
    background: 'linear-gradient(135deg, #8e24aa 30%, #6a1b9a 100%)'
  }
}));

export default Login;