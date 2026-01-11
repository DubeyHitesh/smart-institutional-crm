import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';
import apiService from '../services/api';

const Container = styled.div`
  padding: 20px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 20px;
`;

const EmptyTitle = styled.h3`
  color: #333;
  margin-bottom: 10px;
`;

const EmptyText = styled.p`
  color: #666;
  margin: 0;
`;

const Section = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-bottom: 20px;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-bottom: 1px solid #eee;
`;

const SectionTitle = styled.h3`
  margin: 0;
  color: #333;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const Card = styled.div`
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  background: #f8f9fa;
`;

const CardTitle = styled.h4`
  margin: 0 0 10px 0;
  color: #333;
`;

const CardInfo = styled.div`
  color: #666;
  font-size: 14px;
  line-height: 1.5;
`;

const ScheduleItem = styled.div`
  background: white;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 10px;
  border-left: 4px solid #667eea;
`;

const ScheduleSubject = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
`;

const ScheduleTime = styled.div`
  color: #666;
  font-size: 13px;
`;

export default function TeacherClassView() {
  const { state, dispatch } = useApp();
  
  // Load classes and users when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        // For teachers, use the my-classes endpoint to get populated data
        if (state.currentUser?.role === 'teacher') {
          const classes = await apiService.getMyClasses();
          dispatch({ type: 'SET_CLASSES', payload: classes });
        } else if (state.classes.length === 0 || state.users.length === 0) {
          const [classes, users] = await Promise.all([
            apiService.getClasses(),
            apiService.getUsers()
          ]);
          dispatch({ type: 'SET_CLASSES', payload: classes });
          dispatch({ type: 'SET_USERS', payload: users });
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    
    loadData();
  }, [dispatch, state.classes.length, state.users.length, state.currentUser?.role]);
  
  if (!state.currentUser) return null;

  // Get classes assigned to current teacher
  const currentUserId = state.currentUser?._id || state.currentUser?.id;
  console.log('Teacher ID:', currentUserId);
  console.log('Available classes:', state.classes);
  
  const assignedClasses = state.classes.filter(cls => {
    if (!cls.teacherId) return false;
    const teacherId = typeof cls.teacherId === 'object' ? 
      (cls.teacherId._id || cls.teacherId.id) : cls.teacherId;
    console.log(`Class ${cls.name} teacher ID:`, teacherId, 'Current user ID:', currentUserId);
    console.log('Match result:', teacherId === currentUserId);
    console.log('Teacher ID type:', typeof teacherId, 'User ID type:', typeof currentUserId);
    return teacherId === currentUserId;
  });
  
  console.log('Assigned classes:', assignedClasses);
  
  // Get schedules for current teacher
  const teacherSchedules = (state.schedules || []).filter(schedule => {
    if (!schedule || !schedule.teacherId) return false;
    const teacherIdValue = schedule.teacherId as any;
    const scheduleTeacherId = typeof teacherIdValue === 'object' && teacherIdValue !== null ? 
      (teacherIdValue._id || teacherIdValue.id) : teacherIdValue;
    return scheduleTeacherId === currentUserId;
  });

  if (assignedClasses.length === 0) {
    return (
      <Container>
        <EmptyState>
          <EmptyIcon>📚</EmptyIcon>
          <EmptyTitle>No Classes Assigned</EmptyTitle>
          <EmptyText>
            You haven't been assigned to any classes yet. Please contact your administrator to get class assignments.
          </EmptyText>
        </EmptyState>
      </Container>
    );
  }

  const getClassStudents = (classId: string) => {
    const classItem = state.classes.find(c => (c._id || c.id) === classId);
    if (!classItem || !classItem.studentIds) return [];
    
    // If studentIds are populated objects, return them directly
    if (classItem.studentIds.length > 0 && typeof classItem.studentIds[0] === 'object') {
      return classItem.studentIds.filter(student => student && typeof student === 'object');
    }
    
    // Fallback: match by ID if not populated
    return state.users.filter(user => {
      if (user.role !== 'student') return false;
      const userId = (user._id || user.id) as string;
      return classItem.studentIds.some(studentId => {
        const idValue = studentId as any;
        const id = typeof idValue === 'object' && idValue !== null ? (idValue._id || idValue.id) : idValue;
        return id === userId;
      });
    });
  };

  const getClassSchedules = (classId: string) => {
    return teacherSchedules.filter(schedule => (schedule.classId === classId));
  };

  return (
    <Container>
      <Section>
        <SectionHeader>
          <SectionTitle>My Assigned Classes</SectionTitle>
        </SectionHeader>
        <Grid>
          {assignedClasses.map(classItem => {
            const students = getClassStudents((classItem._id || classItem.id) as string);
            return (
              <Card key={(classItem._id || classItem.id) as string}>
                <CardTitle>{classItem.name}</CardTitle>
                <CardInfo>
                  Grade: {classItem.grade}<br/>
                  Students: {students.length}<br/>
                  {students.length > 0 && (
                    <>
                      Student List:<br/>
                      {students.map(student => {
                        const studentObj = typeof student === 'object' ? student : null;
                        if (!studentObj) return null;
                        return (
                          <div key={(studentObj._id || studentObj.id) as string} style={{ marginLeft: '10px', fontSize: '12px' }}>
                            • {studentObj.name || studentObj.username}
                          </div>
                        );
                      })}
                    </>
                  )}
                </CardInfo>
              </Card>
            );
          })}
        </Grid>
      </Section>

      {teacherSchedules.length > 0 && (
        <Section>
          <SectionHeader>
            <SectionTitle>My Schedule</SectionTitle>
          </SectionHeader>
          <div style={{ padding: '20px' }}>
            {assignedClasses.map(classItem => {
              const schedules = getClassSchedules((classItem._id || classItem.id) as string);
              if (schedules.length === 0) return null;
              
              return (
                <div key={(classItem._id || classItem.id) as string} style={{ marginBottom: '30px' }}>
                  <h4 style={{ color: '#333', marginBottom: '15px' }}>{classItem.name}</h4>
                  {schedules.map(schedule => (
                    <ScheduleItem key={schedule.id}>
                      <ScheduleSubject>{schedule.subject}</ScheduleSubject>
                      <ScheduleTime>
                        {schedule.day} • {schedule.startTime} - {schedule.endTime}
                      </ScheduleTime>
                    </ScheduleItem>
                  ))}
                </div>
              );
            })}
          </div>
        </Section>
      )}
    </Container>
  );
}