import React, { useState } from 'react';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';

const Container = styled.div`
  padding: 20px;
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
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 20px;
`;

const StudentList = styled.div`
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #e9ecef;
  border-radius: 8px;
`;

const StudentItem = styled.div<{ assigned?: boolean }>`
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${props => props.assigned ? '#f8f9fa' : 'white'};
  
  &:last-child {
    border-bottom: none;
  }
`;

const StudentInfo = styled.div`
  flex: 1;
`;

const StudentName = styled.div`
  font-weight: 600;
  color: #333;
`;

const StudentDetails = styled.div`
  font-size: 12px;
  color: #666;
`;

const AssignButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background: #218838;
  }
  
  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const ChangeClassButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background: #0056b3;
  }
`;

const ClassSelect = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 15px;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  padding: 0 20px;
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
`;

const ModalTitle = styled.h3`
  margin: 0 0 20px 0;
  color: #333;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const ModalButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  background: ${props => props.variant === 'secondary' ? '#6c757d' : '#007bff'};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
`;

export default function StudentAllotment() {
  const { state, dispatch } = useApp();
  const [selectedClass, setSelectedClass] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [changeStudentId, setChangeStudentId] = useState('');
  const [changeToClass, setChangeToClass] = useState('');

  const students = state.users.filter(user => user.role === 'student');
  const availableClasses = state.classes.filter(cls => gradeFilter === '' || cls.grade === gradeFilter);

  const getStudentClass = (studentId: string) => {
    return state.classes.find(cls => {
      if (!cls.studentIds) return false;
      return cls.studentIds.some(id => {
        const idValue = id as any;
        const classStudentId = typeof idValue === 'object' && idValue !== null ? (idValue._id || idValue.id) : idValue;
        return classStudentId === studentId;
      });
    });
  };

  const handleAssignStudent = async (studentId: string) => {
    if (!selectedClass) {
      alert('Please select a class first');
      return;
    }

    try {
      const currentClass = getStudentClass(studentId);
      if (currentClass && (currentClass._id || currentClass.id) !== selectedClass) {
        if (!window.confirm('Student is already assigned to another class. Do you want to reassign?')) {
          return;
        }
        
        await fetch(`http://localhost:5001/api/classes/${currentClass._id || currentClass.id}/remove-student`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ studentId })
        });
      }

      const response = await fetch(`http://localhost:5001/api/classes/${selectedClass}/add-student`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ studentId })
      });
      
      if (response.ok) {
        const updatedClass = await response.json();
        dispatch({ type: 'UPDATE_CLASS', payload: updatedClass });
        
        // Refresh users data to get updated classId
        const users = await fetch('http://localhost:5001/api/users', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }).then(res => res.json());
        dispatch({ type: 'SET_USERS', payload: users });
        
        alert('Student assigned successfully!');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to assign student');
      }
    } catch (error) {
      console.error('Assignment error:', error);
      alert('Failed to assign student. Please try again.');
    }
  };

  const handleChangeClass = (studentId: string) => {
    setChangeStudentId(studentId);
    setChangeToClass('');
    setShowChangeModal(true);
  };

  const confirmChangeClass = async () => {
    if (!changeToClass) {
      alert('Please select a class');
      return;
    }

    try {
      const currentClass = getStudentClass(changeStudentId);
      if (currentClass) {
        await fetch(`http://localhost:5001/api/classes/${currentClass._id || currentClass.id}/remove-student`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ studentId: changeStudentId })
        });
      }

      const response = await fetch(`http://localhost:5001/api/classes/${changeToClass}/add-student`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ studentId: changeStudentId })
      });
      
      if (response.ok) {
        const updatedClass = await response.json();
        dispatch({ type: 'UPDATE_CLASS', payload: updatedClass });
        
        // Refresh users data to get updated classId
        const users = await fetch('http://localhost:5001/api/users', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }).then(res => res.json());
        dispatch({ type: 'SET_USERS', payload: users });
        
        setShowChangeModal(false);
        alert('Student class changed successfully!');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to change class');
      }
    } catch (error) {
      console.error('Change class error:', error);
      alert('Failed to change class. Please try again.');
    }
  };

  const unassignedStudents = students.filter(student => {
    const studentId = (student._id || student.id) as string;
    return !getStudentClass(studentId);
  });

  const assignedStudents = students.filter(student => {
    const studentId = (student._id || student.id) as string;
    return getStudentClass(studentId);
  });

  return (
    <Container>
      <Section>
        <SectionHeader>
          <SectionTitle>Student Class Allotment</SectionTitle>
        </SectionHeader>
        
        <FilterContainer>
          <FilterSelect value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)}>
            <option value="">All Grades</option>
            <option value="1st">1st</option>
            <option value="2nd">2nd</option>
            <option value="3rd">3rd</option>
            <option value="4th">4th</option>
            <option value="5th">5th</option>
            <option value="6th">6th</option>
            <option value="7th">7th</option>
            <option value="8th">8th</option>
            <option value="9th">9th</option>
            <option value="10th">10th</option>
            <option value="11th">11th</option>
            <option value="12th">12th</option>
          </FilterSelect>
          
          <ClassSelect value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
            <option value="">Select Class for Assignment</option>
            {availableClasses.map(cls => (
              <option key={(cls._id || cls.id) as string} value={(cls._id || cls.id) as string}>
                {cls.name} - {cls.grade}
              </option>
            ))}
          </ClassSelect>
        </FilterContainer>

        <Grid>
          <div>
            <h4>Unassigned Students ({unassignedStudents.length})</h4>
            <StudentList>
              {unassignedStudents.map(student => (
                <StudentItem key={(student._id || student.id) as string}>
                  <StudentInfo>
                    <StudentName>{student.name || student.username}</StudentName>
                    <StudentDetails>@{student.username}</StudentDetails>
                  </StudentInfo>
                  <AssignButton 
                    onClick={() => handleAssignStudent((student._id || student.id) as string)}
                    disabled={!selectedClass}
                  >
                    Assign
                  </AssignButton>
                </StudentItem>
              ))}
              {unassignedStudents.length === 0 && (
                <StudentItem>
                  <StudentInfo>
                    <StudentName>No unassigned students</StudentName>
                  </StudentInfo>
                </StudentItem>
              )}
            </StudentList>
          </div>

          <div>
            <h4>Assigned Students ({assignedStudents.length})</h4>
            <StudentList>
              {assignedStudents.map(student => {
                const studentClass = getStudentClass((student._id || student.id) as string);
                return (
                  <StudentItem key={(student._id || student.id) as string} assigned>
                    <StudentInfo>
                      <StudentName>{student.name || student.username}</StudentName>
                      <StudentDetails>
                        @{student.username} • {studentClass?.name} - {studentClass?.grade}
                      </StudentDetails>
                    </StudentInfo>
                    <ButtonGroup>
                      <AssignButton 
                        onClick={() => handleAssignStudent((student._id || student.id) as string)}
                        disabled={!selectedClass}
                      >
                        Reassign
                      </AssignButton>
                      <ChangeClassButton 
                        onClick={() => handleChangeClass((student._id || student.id) as string)}
                      >
                        Change Class
                      </ChangeClassButton>
                    </ButtonGroup>
                  </StudentItem>
                );
              })}
            </StudentList>
          </div>
        </Grid>
      </Section>
      
      {showChangeModal && (
        <Modal>
          <ModalContent>
            <ModalTitle>Change Student Class</ModalTitle>
            <ClassSelect value={changeToClass} onChange={(e) => setChangeToClass(e.target.value)}>
              <option value="">Select New Class</option>
              {state.classes.map(cls => (
                <option key={(cls._id || cls.id) as string} value={(cls._id || cls.id) as string}>
                  {cls.name} - {cls.grade}
                </option>
              ))}
            </ClassSelect>
            <ModalButtons>
              <ModalButton variant="secondary" onClick={() => setShowChangeModal(false)}>
                Cancel
              </ModalButton>
              <ModalButton variant="primary" onClick={confirmChangeClass}>
                Change Class
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}