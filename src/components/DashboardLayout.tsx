import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Navigation from './Navigation';
import ProfileEditor from './ProfileEditor';
import ClassManagement from './ClassManagement';
import UserManagement from './UserManagement';
import AdminClassAssignment from './AdminClassAssignment';
import TeacherClassView from './TeacherClassView';
import Reports from './Reports';
import Inbox from './Inbox';
import Settings from './Settings';
import StudentAllotment from './StudentAllotment';
import TeacherStudents from './TeacherStudents';
import TeacherAssignments from './TeacherAssignments';
import StudentAssignments from './StudentAssignments';
import StudentPerformance from './StudentPerformance';
import ScheduleManagement from './ScheduleManagement';
import AutoTimetableGenerator from './AutoTimetableGenerator';
import ScheduleViewer from './ScheduleViewer';
import SubjectManagement from './SubjectManagement';
import PersonalChat from './PersonalChat';
import Calendar from './Calendar';
import apiService from '../services/api';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: transparent;
`;

const MainContent = styled.div`
  flex: 1;
  margin-bottom: 100px;
  
  @media (max-width: 768px) {
    margin-bottom: 20px;
    margin-right: 80px;
  }
`;

const Header = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px 30px 20px 90px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    padding: 15px 20px;
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
`;

const HeaderTitle = styled.h1`
  margin: 0;
  color: white;
  font-size: 24px;
  background: linear-gradient(45deg, #FFFFFF, #EC4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100vw - 250px);
  
  @media (max-width: 768px) {
    font-size: 20px;
    max-width: 100%;
    text-align: center;
  }
`;

const LogoutButton = styled.button`
  background: linear-gradient(45deg, #8B5CF6, #EC4899);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(139, 92, 246, 0.4);
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ContentArea = styled.div`
  padding: 30px;
  
  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const Section = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  padding: 30px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    padding: 20px 15px;
  }
`;

const SectionTitle = styled.h2`
  margin: 0 0 20px 0;
  color: white;
  font-size: 20px;
  
  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 25px;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(139, 92, 246, 0.3);
  }
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  opacity: 0.9;
`;

interface DashboardLayoutProps {
  userRole: 'admin' | 'teacher' | 'student';
}

export default function DashboardLayout({ userRole }: DashboardLayoutProps) {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(() => {
    return sessionStorage.getItem('activeSection') || 'profile';
  });

  useEffect(() => {
    sessionStorage.setItem('activeSection', activeSection);
  }, [activeSection]);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        if (state.currentUser && state.currentUser.role === 'admin') {
          const [users, schedules] = await Promise.all([
            apiService.getUsers(),
            apiService.getSchedules()
          ]);
          dispatch({ type: 'SET_USERS', payload: users });
          dispatch({ type: 'SET_SCHEDULES', payload: schedules });
        }
        
        // Load classes for all users to show student assignments
        const classes = await apiService.getClasses();
        dispatch({ type: 'SET_CLASSES', payload: classes });
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    
    loadData();
  }, [state.currentUser, dispatch]);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'profile': return 'Profile Management';
      case 'users': return 'User Management';
      case 'subjects': return 'Subject Management';
      case 'student-allotment': return 'Student Allotment';
      case 'classes': return 'Class Management';
      case 'students': return 'My Students';
      case 'assignments': return 'Assignments';
      case 'performance': return 'Performance Analytics';
      case 'dashboard': return 'Dashboard';
      case 'grades': return 'My Grades';
      case 'schedule': return 'Schedule';
      case 'calendar': return 'Calendar & Events';
      case 'chat': return 'Personal Chat';
      case 'auto-timetable': return 'Auto Timetable Generator';
      case 'inbox': return 'Inbox';
      case 'reports': return 'Reports';
      case 'settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <Section>
            <SectionTitle>My Profile</SectionTitle>
            {state.currentUser && (
              <ProfileEditor user={state.currentUser} showRoleSpecificFields={true} />
            )}
          </Section>
        );
      
      case 'assignments':
        if (userRole === 'teacher') {
          return <TeacherAssignments />;
        } else if (userRole === 'student') {
          return <StudentAssignments />;
        }
        break;
      
      case 'students':
        if (userRole === 'teacher') {
          return <TeacherStudents />;
        }
        break;
      
      case 'classes':
        if (userRole === 'admin') {
          return <ClassManagement userRole={userRole} />;
        } else if (userRole === 'teacher') {
          return <TeacherClassView />;
        }
        return <ClassManagement userRole={userRole} />;
      
      case 'reports':
        if (userRole === 'admin') {
          return <Reports />;
        }
        break;
      
      case 'schedule':
        if (userRole === 'admin') {
          return <ScheduleManagement />;
        } else if (userRole === 'teacher' || userRole === 'student') {
          return <ScheduleViewer userRole={userRole} currentUser={state.currentUser!} />;
        }
        break;
      
      case 'auto-timetable':
        if (userRole === 'admin') {
          return <AutoTimetableGenerator />;
        }
        break;
      
      case 'users':
        if (userRole === 'admin') {
          return <UserManagement />;
        }
        break;
      
      case 'subjects':
        if (userRole === 'admin') {
          return <SubjectManagement />;
        }
        break;
      
      case 'student-allotment':
        if (userRole === 'admin') {
          return <StudentAllotment />;
        }
        break;
      
      case 'inbox':
        if (userRole === 'teacher' || userRole === 'student') {
          return <Inbox userRole={userRole} />;
        }
        break;
      
      case 'chat':
        if (userRole === 'teacher' || userRole === 'student') {
          return <PersonalChat />;
        }
        break;
      
      case 'calendar':
        return <Calendar />;
      
      case 'dashboard':
        if (userRole === 'student') {
          return <StudentPerformance />;
        }
        return (
          <>
            <StatsGrid>
              <StatCard>
                <StatValue>85%</StatValue>
                <StatLabel>Average Score</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>12/15</StatValue>
                <StatLabel>Assignments</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>#5</StatValue>
                <StatLabel>Class Rank</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>98%</StatValue>
                <StatLabel>Attendance</StatLabel>
              </StatCard>
            </StatsGrid>
            <Section>
              <SectionTitle>Recent Activity</SectionTitle>
              <p>Your recent activities and updates will appear here.</p>
            </Section>
          </>
        );
      
      case 'settings':
        return <Settings />;
      
      default:
        return (
          <Section>
            <SectionTitle>{getSectionTitle()}</SectionTitle>
            <p>This section is under development.</p>
          </Section>
        );
    }
  };

  if (!state.currentUser) {
    return null;
  }

  return (
    <Container>
      <Navigation
        user={state.currentUser}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      <MainContent>
        <Header>
          <HeaderTitle>{getSectionTitle()}</HeaderTitle>
          <LogoutButton onClick={handleLogout}>
            Logout
          </LogoutButton>
        </Header>
        
        <ContentArea>
          {renderContent()}
        </ContentArea>
      </MainContent>
    </Container>
  );
}