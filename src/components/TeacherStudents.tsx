import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';
import apiService from '../services/api';

const Container = styled.div`
  padding: 20px;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
`;

const StudentList = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const StudentListHeader = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-bottom: 1px solid #eee;
`;

const StudentListTitle = styled.h3`
  margin: 0;
  color: #333;
`;

const StudentItem = styled.div<{ active?: boolean }>`
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: ${props => props.active ? '#e3f2fd' : 'white'};
  
  &:hover {
    background: #f5f5f5;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const StudentInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const StudentContent = styled.div`
  flex: 1;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ActionButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  min-width: 90px;
  
  &:hover {
    background: #5a67d8;
    transform: translateY(-1px);
  }
  
  &.assignments {
    background: #48bb78;
    
    &:hover {
      background: #38a169;
    }
  }
`;

const StudentName = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 3px;
`;

const StudentDetails = styled.div`
  font-size: 12px;
  color: #666;
`;

const StudentProfile = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 30px;
`;

const ProfileHeader = styled.div`
  margin-bottom: 30px;
`;

const ProfileTitle = styled.h2`
  margin: 0 0 10px 0;
  color: #333;
`;

const ProfileSubtitle = styled.p`
  margin: 0;
  color: #666;
`;

const Section = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 15px 0;
  color: #333;
  font-size: 18px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
`;

const AssignmentItem = styled.div`
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AssignmentContent = styled.div`
  flex: 1;
`;

const UpdateButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-right: 8px;
  
  &:hover {
    background: #0056b3;
    transform: translateY(-1px);
  }
`;

const DeleteButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: #c82333;
    transform: translateY(-1px);
  }
`;

const AssignmentButtonGroup = styled.div`
  display: flex;
  align-items: center;
`;

const GradeInput = styled.input`
  width: 60px;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  margin: 0 4px;
`;

const GradeButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-left: 8px;
  
  &:hover {
    background: #218838;
  }
`;

const GradeDisplay = styled.span`
  background: #e8f5e8;
  color: #27ae60;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
`;

const AssignmentTitle = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
`;

const AssignmentDetails = styled.div`
  font-size: 14px;
  color: #666;
`;

const PerformanceItem = styled.div`
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PerformanceSubject = styled.div`
  font-weight: 600;
  color: #333;
`;

const PerformanceScore = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #667eea;
`;

export default function TeacherStudents() {
  const { state, dispatch } = useApp();
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  // Load data when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        if (state.currentUser?.role === 'teacher') {
          // Teachers only need their classes with populated students
          const classes = await apiService.getMyClasses();
          dispatch({ type: 'SET_CLASSES', payload: classes });
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    
    loadData();
  }, [dispatch, state.currentUser?.role]);

  const currentUserId = state.currentUser?._id || state.currentUser?.id;
  
  // Get classes assigned to current teacher
  const assignedClasses = state.classes.filter(cls => {
    if (!cls.teacherId) return false;
    const teacherId = typeof cls.teacherId === 'object' ? 
      (cls.teacherId._id || cls.teacherId.id) : cls.teacherId;
    return teacherId === currentUserId;
  });

  // Get all students from assigned classes
  const students: any[] = [];
  
  assignedClasses.forEach(cls => {
    if (cls.studentIds && cls.studentIds.length > 0) {
      cls.studentIds.forEach(studentId => {
        // If studentId is already a populated object, use it directly
        if (typeof studentId === 'object' && studentId !== null) {
          const student = studentId as any;
          if (student.username && !students.find(s => (s._id || s.id) === (student._id || student.id))) {
            students.push(student);
          }
        }
      });
    }
  });

  const selectedStudentData = selectedStudent ? 
    students.find(s => (s._id || s.id) === selectedStudent) : null;

  // Get real performance data for selected student
  const getStudentPerformance = (studentId: string) => {
    return state.performances?.filter(perf => perf.studentId === studentId) || [];
  };

  const studentPerformance = selectedStudentData ? 
    getStudentPerformance((selectedStudentData._id || selectedStudentData.id) as string) : [];

  // Get real assignments for selected student
  const getStudentAssignments = (studentId: string) => {
    return state.assignments?.filter(assignment => 
      assignment.studentIds?.includes(studentId)
    ) || [];
  };

  // Get student grades for assignments
  const getStudentGrades = (studentId: string) => {
    const grades = JSON.parse(localStorage.getItem('studentGrades') || '{}');
    return grades[studentId] || {};
  };

  // Save student grade
  const saveStudentGrade = (studentId: string, assignmentId: string, marks: number, maxMarks: number) => {
    const grades = JSON.parse(localStorage.getItem('studentGrades') || '{}');
    if (!grades[studentId]) grades[studentId] = {};
    grades[studentId][assignmentId] = { marks, maxMarks, gradedAt: new Date().toISOString() };
    localStorage.setItem('studentGrades', JSON.stringify(grades));
    
    // Update performance in context
    const performance = {
      id: `${studentId}-${assignmentId}`,
      studentId,
      subject: 'Assignment',
      marks,
      maxMarks,
      examDate: new Date(),
      examType: 'Assignment'
    };
    dispatch({ type: 'ADD_PERFORMANCE', payload: performance });
  };

  const studentAssignments = selectedStudentData ? 
    getStudentAssignments((selectedStudentData._id || selectedStudentData.id) as string) : [];
  
  const studentGrades = selectedStudentData ? 
    getStudentGrades((selectedStudentData._id || selectedStudentData.id) as string) : {};

  return (
    <Container>
      <StudentList>
        <StudentListHeader>
          <StudentListTitle>My Students ({students.length})</StudentListTitle>
        </StudentListHeader>
        {students.map(student => (
          <StudentItem
            key={(student._id || student.id) as string}
            active={selectedStudent === ((student._id || student.id) as string)}
          >
            <StudentInfo onClick={() => setSelectedStudent((student._id || student.id) as string)}>
              <StudentContent>
                <StudentName>{student.name || student.username}</StudentName>
                <StudentDetails>@{student.username}</StudentDetails>
              </StudentContent>
              <ButtonGroup>
                <ActionButton onClick={(e) => {
                  e.stopPropagation();
                  setSelectedStudent((student._id || student.id) as string);
                  // TODO: Navigate to performance view
                }}>
                  Performance
                </ActionButton>
                <ActionButton className="assignments" onClick={(e) => {
                  e.stopPropagation();
                  setSelectedStudent((student._id || student.id) as string);
                  // TODO: Navigate to assignments view
                }}>
                  Assignments
                </ActionButton>
              </ButtonGroup>
            </StudentInfo>
          </StudentItem>
        ))}
        {students.length === 0 && (
          <StudentItem>
            <StudentName>No students assigned</StudentName>
          </StudentItem>
        )}
      </StudentList>

      <StudentProfile>
        {selectedStudentData ? (
          <>
            <ProfileHeader>
              <ProfileTitle>{selectedStudentData.name || selectedStudentData.username}</ProfileTitle>
              <ProfileSubtitle>@{selectedStudentData.username}</ProfileSubtitle>
            </ProfileHeader>

            <Section>
              <SectionTitle>Assignments</SectionTitle>
              {studentAssignments.length > 0 ? (
                studentAssignments.map((assignment: any) => {
                  const grade = studentGrades[assignment.id];
                  return (
                    <AssignmentItem key={assignment.id}>
                      <AssignmentContent>
                        <AssignmentTitle>{assignment.title}</AssignmentTitle>
                        <AssignmentDetails>
                          Due: {assignment.dueDate} • Status: {assignment.status}
                        </AssignmentDetails>
                        {grade ? (
                          <GradeDisplay>Graded: {grade.marks}/{grade.maxMarks}</GradeDisplay>
                        ) : (
                          <div style={{ marginTop: '8px' }}>
                            <GradeInput 
                              type="number" 
                              placeholder="Marks"
                              id={`marks-${assignment.id}`}
                            />
                            /
                            <GradeInput 
                              type="number" 
                              placeholder="Max"
                              id={`max-${assignment.id}`}
                            />
                            <GradeButton onClick={() => {
                              const marksInput = document.getElementById(`marks-${assignment.id}`) as HTMLInputElement;
                              const maxInput = document.getElementById(`max-${assignment.id}`) as HTMLInputElement;
                              const marks = parseInt(marksInput.value);
                              const maxMarks = parseInt(maxInput.value);
                              if (marks >= 0 && maxMarks > 0) {
                                saveStudentGrade(
                                  (selectedStudentData._id || selectedStudentData.id) as string,
                                  assignment.id,
                                  marks,
                                  maxMarks
                                );
                                window.location.reload();
                              }
                            }}>
                              Grade
                            </GradeButton>
                          </div>
                        )}
                      </AssignmentContent>
                    </AssignmentItem>
                  );
                })
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                  No assignments available
                </div>
              )}
            </Section>

            <Section>
              <SectionTitle>Performance</SectionTitle>
              {studentPerformance.length > 0 ? (
                studentPerformance.map((perf, index) => (
                  <PerformanceItem key={index}>
                    <PerformanceSubject>{perf.subject}</PerformanceSubject>
                    <PerformanceScore>{perf.marks}/{perf.maxMarks}</PerformanceScore>
                  </PerformanceItem>
                ))
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                  No performance data available
                </div>
              )}
            </Section>
          </>
        ) : (
          <EmptyState>
            <h3>Select a student</h3>
            <p>Click on a student name to view their assignments and performance</p>
          </EmptyState>
        )}
      </StudentProfile>
    </Container>
  );
}