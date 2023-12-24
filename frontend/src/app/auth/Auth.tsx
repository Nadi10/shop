import { Box, Button, Container, Tab, Tabs, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import api from '../../repository';
import { loginFailure, loginSuccess } from './store/authActions';

interface AuthProps {}

interface RegistrationData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

const Auth: React.FC<AuthProps> = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tabValue, setTabValue] = useState<number>(0);
  const dispatch = useDispatch();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError('');
    setSuccessMessage('');
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter(e.target.value);
  };

  const handleRegistrationSubmit = async () => {
    setError('');
    setIsLoading(true);

    try {
      const registrationData: RegistrationData = { name, email, password };
      await api.post('auth/register', registrationData);

      setSuccessMessage('Successfully registered');
      setName('');
      setEmail('');
      setPassword('');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async () => {
    setError('');
    setIsLoading(true);

    try {
      const loginData: LoginData = { email: loginEmail, password: loginPassword };
      const response = await api.post('auth/login', loginData);

      const { accessToken, refreshToken, user } = response.data.tokens;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userId', user.id);

      dispatch(loginSuccess());

      setSuccessMessage('Successfully logged in');
      setLoginEmail('');
      setLoginPassword('');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
      dispatch(loginFailure(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label="Registration" />
        <Tab label="Login" />
      </Tabs>
      <Box>
        {successMessage && (
          <Typography color="success" variant="body2" gutterBottom sx={{ color: 'green' }}>
            {successMessage}
          </Typography>
        )}
        {tabValue === 0 && (
          <form>
            <TextField
              label="Name"
              fullWidth
              value={name}
              onChange={(e) => handleInputChange(e, setName)}
              margin="normal"
            />
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => handleInputChange(e, setEmail)}
              margin="normal"
              error={Boolean(error && error.includes('Invalid email'))}
            />
            <TextField
              label="Password"
              fullWidth
              type="password"
              value={password}
              onChange={(e) => handleInputChange(e, setPassword)}
              margin="normal"
              error={Boolean(error && error.includes('Password must be at least 6 characters long'))}
            />
            <Button variant="contained" color="primary" onClick={handleRegistrationSubmit} disabled={isLoading}>
              {isLoading ? 'Registering...' : 'Register'}
            </Button>
            {error && !successMessage && !error.includes('Invalid email') && (
              <Typography color="error" variant="body2" gutterBottom>
                {error}
              </Typography>
            )}
          </form>
        )}
        {tabValue === 1 && (
          <form>
            <TextField
              label="Email"
              fullWidth
              value={loginEmail}
              onChange={(e) => handleInputChange(e, setLoginEmail)}
              margin="normal"
            />
            <TextField
              label="Password"
              fullWidth
              type="password"
              value={loginPassword}
              onChange={(e) => handleInputChange(e, setLoginPassword)}
              margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleLoginSubmit} disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
            {error && (
              <Typography color="error" variant="body2" gutterBottom>
                {error}
              </Typography>
            )}
          </form>
        )}
      </Box>
    </Container>
  );
};

export default Auth;
