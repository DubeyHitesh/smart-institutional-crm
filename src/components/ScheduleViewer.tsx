import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ScheduleEntry, User } from '../types';
import { useApp } from '../context/AppContext';
import apiService from '../services/api';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.h2`
  color: #333;
  margin-bottom: 30px;
`;

const ScheduleGrid = styled.div`
  display: grid;
  grid-template-columns: 100px repeat(6, 1fr);
  gap: 1px;
  background: #ddd;
  border-radius: 8px;
  overflow: hidden;
`;

const TimeSlot = styled.div<{ $isBreak?: boolean }>`
  background: ${props => props.$isBreak ? '#ffeb3b' : '#f8f9fa'};
  padding: 15px 10px;
  font-weight: 600;
  text-align: center;
  color: ${props => props.$isBreak ? '#f57f17' : '#666'};
`;

const DayHeader = styled.div`
  background: #007bff;
  color: white;
  padding: 15px;
  font-weight: 600;
  text-align: center;
`;

const ScheduleCell = styled.div<{ $hasClass?: boolean; $isBreak?: boolean }>`
  background: ${props => props.$isBreak ? '#fff9c4' : props.$hasClass ? '#e3f2fd' : 'white'};
  padding: 10px;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: ${props => props.$hasClass ? '2px solid #2196f3' : 'none'};
  font-weight: ${props => props.$isBreak ? '600' : 'normal'};
  color: ${props => props.$isBreak ? '#f57f17' : 'inherit'};
`;

const SubjectName = styled.div`
  font-weight: 600;
  color: #1976d2;
  margin-bottom: 4px;
`;

const ClassInfo = styled.div`
  font-size: 12px;
  color: #666;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 4px;
  margin: 20px 0;
`;

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS = [
  '09:00-10:00',
  '10:00-11:00',
  '11:00-12:00',
  'BREAK',
  '12:30-13:30',
  '13:30-14:30'
];

interface ScheduleViewerProps {
  userRole: 'teacher' | 'student';
  currentUser: User;
}

const ScheduleViewer: React.FC<ScheduleViewerProps> = ({ userRole, currentUser }) => {
  const { state } = useApp();
  const [schedules, setSchedules] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get student's class ID from classes data
  const getStudentClassId = () => {
    if (userRole !== 'student') return null;
    const studentId = currentUser._id || currentUser.id;
    const assignedClass = (state.classes || []).find(cls => 
      cls.studentIds && cls.studentIds.some((student: any) => {
        const id = typeof student === 'object' ? student._id || student.id : student;
        return id === studentId;
      })
    );
    return assignedClass?._id || assignedClass?.id;
  };

  useEffect(() => {
    fetchSchedules();
  }, [state.classes]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      let data;
      
      if (userRole === 'teacher') {
        data = await apiService.getMySchedule();
      } else {
        // For students, get schedules for their assigned class
        const classId = getStudentClassId();
        if (classId) {
          data = await apiService.getClassSchedule(classId);
        } else {
          data = [];
          setError('You are not assigned to any class yet.');
        }
      }
      
      setSchedules(data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      setError('Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  const getScheduleForSlot = (day: string, timeSlot: string) => {
    const [startTime] = timeSlot.split('-');
    return schedules.find(schedule => 
      schedule.day === day && schedule.startTime === startTime
    );
  };

  const formatTimeSlot = (timeSlot: string) => {
    return timeSlot.replace('-', ' - ');
  };

  if (loading) {
    return <LoadingMessage>Loading schedule...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <Container>
      <Header>
        {userRole === 'teacher' ? 'My Teaching Schedule' : 'My Class Schedule'}
      </Header>
      
      <ScheduleGrid>
        <TimeSlot>Time</TimeSlot>
        {DAYS.map(day => (
          <DayHeader key={day}>{day}</DayHeader>
        ))}
        
        {TIME_SLOTS.map(timeSlot => (
          <React.Fragment key={timeSlot}>
            <TimeSlot $isBreak={timeSlot === 'BREAK'}>
              {timeSlot === 'BREAK' ? '12:00 - 12:30 BREAK' : formatTimeSlot(timeSlot)}
            </TimeSlot>
            {DAYS.map(day => {
              if (timeSlot === 'BREAK') {
                return (
                  <ScheduleCell key={`${day}-${timeSlot}`} $isBreak={true}>
                    BREAK
                  </ScheduleCell>
                );
              }
              
              const schedule = getScheduleForSlot(day, timeSlot);
              return (
                <ScheduleCell key={`${day}-${timeSlot}`} $hasClass={!!schedule}>
                  {schedule && (
                    <>
                      <SubjectName>{schedule.subject}</SubjectName>
                      <ClassInfo>
                        {typeof schedule.classId === 'object' && schedule.classId !== null
                          ? `${(schedule.classId as any).name} - Grade ${(schedule.classId as any).grade}`
                          : 'Class Info'
                        }
                      </ClassInfo>
                      {userRole === 'student' && typeof schedule.teacherId === 'object' && schedule.teacherId !== null && (
                        <ClassInfo>
                          Teacher: {(schedule.teacherId as any).name || (schedule.teacherId as any).username}
                        </ClassInfo>
                      )}
                    </>
                  )}
                </ScheduleCell>
              );
            })}
          </React.Fragment>
        ))}
      </ScheduleGrid>
      
      {schedules.length === 0 && (
        <LoadingMessage>No schedule found for this academic year.</LoadingMessage>
      )}
    </Container>
  );
};

export default ScheduleViewer;