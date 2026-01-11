import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const Container = styled.div`
  padding: 20px;
`;

const Section = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  margin-bottom: 20px;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const SectionTitle = styled.h3`
  margin: 0;
  color: white;
`;

const SettingItem = styled.div`
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
`;

const SettingLabel = styled.div`
  font-weight: 600;
  color: white;
`;

const SettingDescription = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 4px;
`;

const Toggle = styled.button<{ active: boolean }>`
  position: relative;
  width: 60px;
  height: 30px;
  border-radius: 15px;
  border: none;
  cursor: pointer;
  background: ${props => props.active ? 'linear-gradient(45deg, #8B5CF6, #EC4899)' : 'rgba(255, 255, 255, 0.2)'};
  transition: background 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${props => props.active ? '33px' : '3px'};
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: white;
    transition: left 0.3s ease;
  }
`;

const DeleteButton = styled.button`
  background: linear-gradient(45deg, #EF4444, #DC2626);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(239, 68, 68, 0.4);
  }
`;

const ConfirmDialog = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const DialogContent = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 30px;
  max-width: 400px;
  text-align: center;
`;

const DialogTitle = styled.h3`
  color: white;
  margin-bottom: 15px;
`;

const DialogText = styled.p`
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 25px;
`;

const DialogButtons = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
`;

const CancelButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

export default function Settings() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-theme');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await apiService.deleteAccount();
      dispatch({ type: 'LOGOUT' });
      navigate('/');
    } catch (error) {
      console.error('Failed to delete account:', error);
      alert('Failed to delete account. Please try again.');
    }
  };

  return (
    <Container>
      <Section>
        <SectionHeader>
          <SectionTitle>Appearance</SectionTitle>
        </SectionHeader>
        <SettingItem>
          <div>
            <SettingLabel>Dark Mode</SettingLabel>
            <SettingDescription>Switch between light and dark theme</SettingDescription>
          </div>
          <Toggle active={isDarkMode} onClick={toggleTheme} />
        </SettingItem>
      </Section>

      {state.currentUser?.role === 'admin' && (
        <Section>
          <SectionHeader>
            <SectionTitle>Account Management</SectionTitle>
          </SectionHeader>
          <SettingItem>
            <div>
              <SettingLabel>Delete Account</SettingLabel>
              <SettingDescription>Permanently delete your admin account</SettingDescription>
            </div>
            <DeleteButton onClick={() => setShowDeleteConfirm(true)}>
              Delete Account
            </DeleteButton>
          </SettingItem>
        </Section>
      )}

      {showDeleteConfirm && (
        <ConfirmDialog>
          <DialogContent>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogText>
              Are you sure you want to delete your account? This action cannot be undone.
            </DialogText>
            <DialogButtons>
              <CancelButton onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </CancelButton>
              <DeleteButton onClick={handleDeleteAccount}>
                Delete
              </DeleteButton>
            </DialogButtons>
          </DialogContent>
        </ConfirmDialog>
      )}
    </Container>
  );
}