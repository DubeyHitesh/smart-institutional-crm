import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';
import apiService from '../services/api';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
`;

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: white;
  text-transform: capitalize;
  background: linear-gradient(45deg, #FFFFFF, #EC4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 12px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  backdrop-filter: blur(10px);
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  &:focus {
    outline: none;
    border-color: #8B5CF6;
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
  }
`;

const PasswordContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const EyeButton = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-size: 18px;
  
  &:hover {
    color: white;
  }
`;

const Button = styled.button`
  background: linear-gradient(45deg, #8B5CF6, #EC4899);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 40px rgba(139, 92, 246, 0.4);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const SecondaryButton = styled.button`
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;
  width: 100%;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: #EC4899;
    transform: translateY(-2px);
  }
`;

const ErrorMessage = styled.div`
  color: #F472B6;
  text-align: center;
  margin-top: 1rem;
  background: rgba(244, 114, 182, 0.1);
  padding: 10px;
  border-radius: 8px;
  border: 1px solid rgba(244, 114, 182, 0.3);
`;

const ToggleText = styled.p`
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 1rem;
  cursor: pointer;
  
  &:hover {
    color: #EC4899;
  }
`;

export default function LoginPage() {
  const { role } = useParams<{ role: string }>();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister && role === 'admin') {
        await apiService.request('/setup/admin', {
          method: 'POST',
          body: { username, password, name, institutionName }
        });
        setError('');
        alert('Admin registered successfully! Please login.');
        setIsRegister(false);
        setUsername('');
        setPassword('');
        setName('');
        setInstitutionName('');
      } else {
        const response = await apiService.login(username, password);
        
        if (response.user.role !== role) {
          setError(`Invalid credentials for ${role} role`);
          setLoading(false);
          return;
        }
        
        dispatch({ type: 'LOGIN', payload: response.user });
        
        if (response.user.role === 'admin') {
          const users = await apiService.getUsers();
          dispatch({ type: 'SET_USERS', payload: users });
        }
        
        navigate(`/dashboard/${role}`);
      }
    } catch (error: any) {
      setError(error.message || (isRegister ? 'Registration failed' : 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <LoginCard>
        <Title>{isRegister ? `Register ${role}` : `${role} Login`}</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <PasswordContainer>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ paddingRight: '45px' }}
            />
            <EyeButton
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </EyeButton>
          </PasswordContainer>
          {isRegister && role === 'admin' && (
            <>
              <Input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                type="text"
                placeholder="Institution Name"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                required
              />
            </>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? (isRegister ? 'Registering...' : 'Logging in...') : (isRegister ? 'Register' : 'Login')}
          </Button>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Form>
        {role === 'admin' && (
          <ToggleText onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Already have an account? Login' : 'New admin? Register here'}
          </ToggleText>
        )}
        <SecondaryButton onClick={() => navigate('/role-selection')}>
          Back to Role Selection
        </SecondaryButton>
      </LoginCard>
    </Container>
  );
}