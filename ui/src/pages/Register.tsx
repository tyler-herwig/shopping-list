import React from 'react';
import { Button, Typography, TextField, Box, styled, Card, CardContent } from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { IUser } from '../models/user';
import useErrorHandling from '../hooks/useErrorHandling';

const Register: React.FC = () => {
  const navigate = useNavigate();

  const { errorMessage, handleError, clearError } = useErrorHandling();

  const validationSchema = Yup.object({
    user_name: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const handleRegister = async (values: IUser) => {
    try {
      await axios.post('/user', values);
      navigate('/login');
      clearError();
    } catch (error) {
      handleError(error);
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
            Already have an account?
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
            onClick={() => navigate('/login')}
          >
            Login
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
            Create an Account
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" sx={{ textAlign: 'center', marginTop: 2, marginBottom: 2 }}>
            Enter your details below
          </Typography>
          <Formik
            initialValues={{
              user_name: '',
              email: '',
              first_name: '',
              last_name: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleRegister}
          >
            {({ errors, touched, handleChange, handleBlur }) => (
              <Form>
                <Field
                  as={TextField}
                  fullWidth
                  label="Username"
                  name="user_name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  margin="normal"
                  variant="outlined"
                  error={touched.user_name && Boolean(errors.user_name)}
                  helperText={touched.user_name && errors.user_name}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '15px' } }}
                />
                <Field
                  as={TextField}
                  fullWidth
                  label="Email"
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  margin="normal"
                  variant="outlined"
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '15px' } }}
                />
                <Field
                  as={TextField}
                  fullWidth
                  label="First Name"
                  name="first_name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  margin="normal"
                  variant="outlined"
                  error={touched.first_name && Boolean(errors.first_name)}
                  helperText={touched.first_name && errors.first_name}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '15px' } }}
                />
                <Field
                  as={TextField}
                  fullWidth
                  label="Last Name"
                  name="last_name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  margin="normal"
                  variant="outlined"
                  error={touched.last_name && Boolean(errors.last_name)}
                  helperText={touched.last_name && errors.last_name}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '15px' } }}
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
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '15px' } }}
                />
                <Field
                  as={TextField}
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  margin="normal"
                  variant="outlined"
                  error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '15px' } }}
                />
                {errorMessage && <Typography variant="body2" textAlign="center" color="error">{errorMessage}</Typography>}
                <StyledRegisterButton type="submit" color="primary" fullWidth>
                  Register
                </StyledRegisterButton>
              </Form>
            )}
          </Formik>
        </CardContent>
      </StyledCard>
    </StyledContainer>
  );
};

const StyledContainer = styled(Box)(() => ({
  height: '100vh',
  width: '100vw',
  background: 'linear-gradient(135deg, #6a1b9a 30%, #8e24aa 100%)'
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
  position: 'absolute',
  left: 0,
  borderRadius: '30px',
  zIndex: 1,
}));

const StyledRegisterButton = styled(Button)(() => ({
  padding: '15px',
  marginTop: '15px',
  borderRadius: '15px',
  background: 'linear-gradient(135deg, #6a1b9a 30%, #8e24aa 100%)',
  color: 'white',
  '&:hover': {
    background: 'linear-gradient(135deg, #8e24aa 30%, #6a1b9a 100%)',
  },
}));

export default Register;