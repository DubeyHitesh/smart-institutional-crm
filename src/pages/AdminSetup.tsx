import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
`;

const SetupCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  width: 100%;
  max-width: 500px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1rem;
  color: white;
  background: linear-gradient(45deg, #FFFFFF, #EC4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  text-align: center;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
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
  font-size: 14px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  &:focus {
    border-color: #8B5CF6;
    outline: none;
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
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

const ErrorMessage = styled.div`
  color: #F472B6;
  text-align: center;
  margin-top: 1rem;
  background: rgba(244, 114, 182, 0.1);
  padding: 10px;
  border-radius: 8px;
  border: 1px solid rgba(244, 114, 182, 0.3);
`;

const SuccessMessage = styled.div`
  color: #10B981;
  text-align: center;
  margin-top: 1rem;
  background: rgba(16, 185, 129, 0.1);
  padding: 10px;
  border-radius: 8px;
  border: 1px solid rgba(16, 185, 129, 0.3);
`;

export default function AdminSetup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin already exists
    const checkAdmin = async () => {
      try {
        const response = await fetch('/api/setup/check');
        const data = await response.json();
        if (data.adminExists) {
          navigate('/role-selection');
        }
      } catch (error) {
        console.error('Error checking admin:', error);
      }
    };
    
    checkAdmin();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/setup/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          secretKey
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Admin account created successfully! Redirecting...');
        setTimeout(() => {
          navigate('/role-selection');
        }, 2000);
      } else {
        setError(data.message || 'Failed to create admin account');
      }
    } catch (error: any) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <SetupCard>
        <Title>Admin Setup</Title>
        <Subtitle>
          Create the first admin account for Smart Institutional CRM. 
          You'll need the secret setup key to proceed.
        </Subtitle>
        
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Admin Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Secret Setup Key"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            required
          />
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating Admin...' : 'Create Admin Account'}
          </Button>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
        </Form>
      </SetupCard>
    </Container>
  );
}