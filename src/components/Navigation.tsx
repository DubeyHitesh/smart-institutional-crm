import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { User } from '../types';
import { useApp } from '../context/AppContext';

const ProfileIconContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1001;
`;

const ProfileIcon = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.8), rgba(236, 72, 153, 0.8));
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(139, 92, 246, 0.6);
  }
`;

const ProfileDropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 60px;
  left: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 15px;
  min-width: 200px;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
`;

const ProfileInfo = styled.div`
  color: white;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const ProfileName = styled.div`
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 5px;
`;

const ProfileRole = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
`;

const ProfileButton = styled.button`
  width: 100%;
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: white;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(139, 92, 246, 0.4);
  }
`;

const NavContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
`;

const NavBar = styled.div`
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  padding: 12px 20px;
  display: flex;
  gap: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
`;

const NavItem = styled.button<{ $active?: boolean }>`
  background: ${props => props.$active ? 'rgba(139, 92, 246, 0.4)' : 'transparent'};
  border: ${props => props.$active ? '1px solid rgba(139, 92, 246, 0.6)' : '1px solid transparent'};
  color: white;
  padding: 10px 16px;
  border-radius: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  position: relative;
  font-size: 14px;
  white-space: nowrap;
  
  &:hover {
    background: rgba(236, 72, 153, 0.3);
    transform: translateY(-2px);
  }
`;

const NavIcon = styled.span`
  font-size: 20px;
`;

const NotificationDot = styled.span`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  background: #e74c3c;
  border-radius: 50%;
  border: 2px solid rgba(0, 0, 0, 0.7);
`;

interface NavigationProps {
  user: User;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function Navigation({ user, activeSection, onSectionChange }: NavigationProps) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const { state, dispatch } = useApp();
  
  useEffect(() => {
    const checkUnreadMessages = async () => {
      if (user.role === 'teacher' || user.role === 'student') {
        try {
          const response = await fetch('http://localhost:5001/api/messages/unread/counts', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          });
          if (response.ok) {
            const counts = await response.json();
            setHasUnreadMessages(counts.length > 0);
          }
        } catch (error) {
          console.error('Error checking unread messages:', error);
        }
      }
    };
    
    checkUnreadMessages();
    const interval = setInterval(checkUnreadMessages, 30000);
    return () => clearInterval(interval);
  }, [user]);
  
  const hasUnreadNotifications = user.role !== 'admin' && (state.notices || []).some(notice => 
    notice.targetRoles.includes(user.role as 'teacher' | 'student') && 
    !notice.isRead?.[user.id || user._id || '']
  );

  const handleSectionChange = (section: string) => {
    if (section === 'inbox' && user.role !== 'admin') {
      dispatch({ type: 'MARK_NOTICES_READ', payload: user.id || user._id || '' });
    }
    if (section === 'chat') {
      setHasUnreadMessages(false);
    }
    onSectionChange(section);
  };

  const getMenuItems = () => {
    if (user.role === 'admin') {
      return [
        { id: 'users', icon: '👥', label: 'Users' },
        { id: 'classes', icon: '🏫', label: 'Classes' },
        { id: 'subjects', icon: '📚', label: 'Subjects' },
        { id: 'student-allotment', icon: '📝', label: 'Allotment' },
        { id: 'schedule', icon: '📅', label: 'Schedule' },
        { id: 'auto-timetable', icon: '🤖', label: 'Auto Timetable' },
        { id: 'calendar', icon: '📆', label: 'Calendar' },
        { id: 'reports', icon: '📊', label: 'Reports' },
        { id: 'settings', icon: '⚙️', label: 'Settings' },
      ];
    }

    if (user.role === 'teacher') {
      return [
        { id: 'classes', icon: '🏫', label: 'Classes' },
        { id: 'students', icon: '👥', label: 'Students' },
        { id: 'assignments', icon: '📝', label: 'Assignments' },
        { id: 'performance', icon: '📈', label: 'Performance' },
        { id: 'schedule', icon: '📅', label: 'Schedule' },
        { id: 'calendar', icon: '📆', label: 'Calendar' },
        { id: 'chat', icon: '💬', label: 'Chat', hasNotification: hasUnreadMessages },
        { id: 'inbox', icon: '📧', label: 'Inbox', hasNotification: hasUnreadNotifications },
      ];
    }

    return [
      { id: 'dashboard', icon: '📊', label: 'Dashboard' },
      { id: 'assignments', icon: '📝', label: 'Assignments' },
      { id: 'grades', icon: '🎯', label: 'Grades' },
      { id: 'schedule', icon: '📅', label: 'Schedule' },
      { id: 'calendar', icon: '📆', label: 'Calendar' },
      { id: 'chat', icon: '💬', label: 'Chat', hasNotification: hasUnreadMessages },
      { id: 'inbox', icon: '📧', label: 'Inbox', hasNotification: hasUnreadNotifications },
    ];
  };

  const getInitial = () => {
    const name = user.name || user.username || '';
    return name.charAt(0).toUpperCase();
  };

  return (
    <>
      <ProfileIconContainer>
        <ProfileIcon onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
          {getInitial()}
        </ProfileIcon>
        <ProfileDropdown $isOpen={showProfileDropdown}>
          <ProfileInfo>
            <ProfileName>{user.name || user.username}</ProfileName>
            <ProfileRole>{user.role}</ProfileRole>
          </ProfileInfo>
          <ProfileButton onClick={() => {
            setShowProfileDropdown(false);
            handleSectionChange('profile');
          }}>
            View Profile
          </ProfileButton>
        </ProfileDropdown>
      </ProfileIconContainer>

      <NavContainer>
        <NavBar>
          {getMenuItems().map(item => (
            <NavItem
              key={item.id}
              $active={activeSection === item.id}
              onClick={() => handleSectionChange(item.id)}
            >
              <NavIcon>{item.icon}</NavIcon>
              {item.label}
              {(item as any).hasNotification && <NotificationDot />}
            </NavItem>
          ))}
        </NavBar>
      </NavContainer>
    </>
  );
}
