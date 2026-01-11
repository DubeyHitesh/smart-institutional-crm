import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { User } from '../types';
import { useApp } from '../context/AppContext';

const SidebarContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  left: 0;
  bottom: 0;
  height: ${props => props.$isOpen ? '300px' : '80px'};
  width: 100vw;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.15s ease;
  z-index: 1000;
  overflow: hidden;
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 20px;
  right: 15px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
  
  @media (max-width: 768px) {
    top: 15px;
    right: 15px;
    z-index: 1001;
  }
`;

const UserSection = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  font-weight: 600;
  font-size: 14px;
  opacity: ${props => props.$isOpen ? 1 : 0.8};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

const Avatar = styled.div<{ $isOpen: boolean }>`
  width: ${props => props.$isOpen ? '60px' : '40px'};
  height: ${props => props.$isOpen ? '60px' : '40px'};
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10px;
  font-size: ${props => props.$isOpen ? '24px' : '18px'};
  color: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

const UserName = styled.div<{ $isOpen: boolean }>`
  color: white;
  font-weight: 600;
  margin-bottom: 5px;
  opacity: ${props => props.$isOpen ? 1 : 0};
  transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: ${props => props.$isOpen ? '16px' : '12px'};
  
  @media (max-width: 768px) {
    opacity: 1;
    transform: translateY(0);
  }
`;

const UserRole = styled.div<{ $isOpen: boolean }>`
  color: rgba(255,255,255,0.8);
  font-size: ${props => props.$isOpen ? '12px' : '10px'};
  text-transform: uppercase;
  opacity: ${props => props.$isOpen ? 1 : 0};
  transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  @media (max-width: 768px) {
    opacity: 1;
    transform: translateY(0);
  }
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 10px;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 5px;
`;

const MenuItem = styled.li<{ $active?: boolean }>`
  margin: 5px 0;
`;

const MenuLink = styled.button<{ $active?: boolean; $isOpen: boolean }>`
  width: ${props => props.$isOpen ? '120px' : '80px'};
  height: ${props => props.$isOpen ? '60px' : '50px'};
  background: ${props => props.$active ? 'rgba(139, 92, 246, 0.3)' : 'transparent'};
  border: ${props => props.$active ? '1px solid rgba(139, 92, 246, 0.5)' : 'none'};
  color: white;
  padding: ${props => props.$isOpen ? '8px' : '12px'};
  cursor: pointer;
  display: flex;
  flex-direction: ${props => props.$isOpen ? 'column' : 'column'};
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  position: relative;
  border-radius: 8px;
  
  &:hover {
    background: rgba(236, 72, 153, 0.2);
    transform: translateY(-2px);
  }
`;

const MenuIcon = styled.span<{ $isOpen: boolean }>`
  font-size: ${props => props.$isOpen ? '32px' : '22px'};
  margin-right: 0;
  width: ${props => props.$isOpen ? '40px' : '28px'};
  height: ${props => props.$isOpen ? '40px' : '28px'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  flex-shrink: 0;
`;

const MenuText = styled.span<{ $isOpen: boolean }>`
  display: ${props => props.$isOpen ? 'block' : 'none'};
  font-size: 12px;
  margin-top: 4px;
  color: white;
  text-align: center;
  white-space: nowrap;
`;

const NotificationDot = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  background: #e74c3c;
  border-radius: 50%;
  border: 2px solid white;
`;

interface NavigationProps {
  user: User;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function Navigation({ user, activeSection, onSectionChange }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const { state, dispatch } = useApp();
  
  // Check for unread messages
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
    // Check every 30 seconds for new messages
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
    const commonItems = [
      { id: 'profile', icon: '👤', label: 'Profile' },
    ];

    if (user.role === 'admin') {
      return [
        ...commonItems,
        { id: 'users', icon: '👥', label: 'User Management' },
        { id: 'classes', icon: '🏫', label: 'Class Management' },
        { id: 'subjects', icon: '📚', label: 'Subject Management' },
        { id: 'student-allotment', icon: '📝', label: 'Student Allotment' },
        { id: 'schedule', icon: '📅', label: 'Schedule Management' },
        { id: 'auto-timetable', icon: '🤖', label: 'Auto Timetable' },
        { id: 'calendar', icon: '📆', label: 'Calendar' },
        { id: 'reports', icon: '📊', label: 'Reports' },
        { id: 'settings', icon: '⚙️', label: 'Settings' },
      ];
    }

    if (user.role === 'teacher') {
      return [
        ...commonItems,
        { id: 'classes', icon: '🏫', label: 'My Classes' },
        { id: 'students', icon: '👥', label: 'Students' },
        { id: 'assignments', icon: '📝', label: 'Assignments' },
        { id: 'performance', icon: '📈', label: 'Performance' },
        { id: 'schedule', icon: '📅', label: 'My Schedule' },
        { id: 'calendar', icon: '📆', label: 'Calendar' },
        { id: 'chat', icon: '💬', label: 'Chat', hasNotification: hasUnreadMessages },
        { id: 'inbox', icon: '📧', label: 'Inbox', hasNotification: hasUnreadNotifications },
      ];
    }

    return [
      ...commonItems,
      { id: 'dashboard', icon: '📊', label: 'Dashboard' },
      { id: 'assignments', icon: '📝', label: 'My Assignments' },
      { id: 'grades', icon: '🎯', label: 'Grades' },
      { id: 'schedule', icon: '📅', label: 'Schedule' },
      { id: 'calendar', icon: '📆', label: 'Calendar' },
      { id: 'chat', icon: '💬', label: 'Chat', hasNotification: hasUnreadMessages },
      { id: 'inbox', icon: '📧', label: 'Inbox', hasNotification: hasUnreadNotifications },
    ];
  };

  return (
    <SidebarContainer $isOpen={isOpen}>
      <ToggleButton onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '↓' : '↑'}
      </ToggleButton>
      
      <UserSection $isOpen={isOpen}>
        {user.name || user.username}
      </UserSection>

      <MenuList>
        {getMenuItems().map(item => (
          <MenuItem key={item.id}>
            <MenuLink
              $active={activeSection === item.id}
              $isOpen={isOpen}
              onClick={() => handleSectionChange(item.id)}
            >
              <MenuIcon $isOpen={isOpen}>{item.icon}</MenuIcon>
              <MenuText $isOpen={isOpen}>{item.label}</MenuText>
              {(item as any).hasNotification && <NotificationDot />}
            </MenuLink>
          </MenuItem>
        ))}
      </MenuList>
    </SidebarContainer>
  );
}