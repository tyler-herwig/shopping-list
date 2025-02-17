import React from 'react';
import { Button, Typography, TextField, Box, styled, Card, CardContent } from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { IUser } from '../models/user';

const Register: React.FC = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    userName: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const handleRegister = async (values: IUser) => {
    try {
      await axios.post('/user', values);
      navigate('/login');
    } catch (error) {
      // Handle error if registration fails
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
              userName: '',
              email: '',
              firstName: '',
              lastName: '',
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
                  name="userName"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  margin="normal"
                  variant="outlined"
                  error={touched.userName && Boolean(errors.userName)}
                  helperText={touched.userName && errors.userName}
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
                  name="firstName"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  margin="normal"
                  variant="outlined"
                  error={touched.firstName && Boolean(errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '15px' } }}
                />
                <Field
                  as={TextField}
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  margin="normal"
                  variant="outlined"
                  error={touched.lastName && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
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