import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: white;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 3rem;
`;

const RoleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 800px;
`;

const RoleCard = styled.div<{ selected: boolean }>`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 2px solid ${props => props.selected ? '#EC4899' : 'rgba(255, 255, 255, 0.1)'};
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-10px);
    border-color: #8B5CF6;
    box-shadow: 0 20px 40px rgba(139, 92, 246, 0.3);
  }
`;

const RoleIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const RoleTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const RoleDescription = styled.p`
  font-size: 0.9rem;
  opacity: 0.9;
`;

const ContinueButton = styled.button`
  background: linear-gradient(45deg, #8B5CF6, #EC4899);
  color: white;
  border: none;
  padding: 15px 40px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  margin-top: 3rem;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(139, 92, 246, 0.4);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const BackButton = styled.button`
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 10px 30px;
  border-radius: 25px;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: #EC4899;
    transform: translateY(-2px);
  }
`;

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const navigate = useNavigate();

  const roles = [
    {
      id: 'admin',
      title: 'Admin',
      icon: '👨‍💼',
      description: 'Manage users, view analytics, and system administration'
    },
    {
      id: 'teacher',
      title: 'Teacher',
      icon: '👩‍🏫',
      description: 'Track student performance, manage assignments, and view timetables'
    },
    {
      id: 'student',
      title: 'Student',
      icon: '👨‍🎓',
      description: 'View performance, submit assignments, and track progress'
    }
  ];

  const handleContinue = () => {
    if (selectedRole) {
      navigate(`/login/${selectedRole}`);
    }
  };

  return (
    <Container>
      <Title>Select Your Role</Title>
      
      <RoleGrid>
        {roles.map(role => (
          <RoleCard
            key={role.id}
            selected={selectedRole === role.id}
            onClick={() => setSelectedRole(role.id)}
          >
            <RoleIcon>{role.icon}</RoleIcon>
            <RoleTitle>{role.title}</RoleTitle>
            <RoleDescription>{role.description}</RoleDescription>
          </RoleCard>
        ))}
      </RoleGrid>
      
      <ContinueButton 
        disabled={!selectedRole}
        onClick={handleContinue}
      >
        Continue
      </ContinueButton>
      
      <BackButton onClick={() => navigate('/')}>
        Back to Home
      </BackButton>
    </Container>
  );
}