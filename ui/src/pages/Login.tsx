import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { useUserContext } from '../context/UserContext';

interface LoginResponse {
  userId: string;
  userName: string;
  token: string;
}

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const { setUserData } = useUserContext();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post<LoginResponse>('/login', {
        userName: username,
        password: password,
      });

      const { userId, userName, token } = response.data;

      localStorage.setItem('authToken', token);
      setUserData(userId, userName);

      navigate('/dashboard');
    } catch (error) {
      setError('Invalid username or password');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;