import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';
import { User } from '../types';
import apiService from '../services/api';

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h2`
  color: #333;
  margin: 0 0 10px 0;
`;

const Subtitle = styled.p`
  color: #666;
  margin: 0;
`;

const ClassGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const ClassCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const ClassHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ClassHeaderContent = styled.div`
  flex: 1;
`;

const HeaderButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const EditButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`;

const DeleteButton = styled.button`
  background: rgba(239, 68, 68, 0.8);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(239, 68, 68, 1);
    transform: translateY(-2px);
  }
`;

const ClassName = styled.h3`
  margin: 0 0 5px 0;
  font-size: 18px;
`;

const ClassInfo = styled.div`
  font-size: 14px;
  opacity: 0.9;
`;

const StudentList = styled.div<{ isExpanded: boolean }>`
  max-height: ${props => props.isExpanded ? '400px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
`;

const StudentItem = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
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
  margin-bottom: 3px;
`;

const StudentDetails = styled.div`
  font-size: 12px;
  color: #666;
`;

const StudentStatus = styled.span<{ status: 'active' | 'inactive' }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  background: ${props => props.status === 'active' ? '#e8f5e8' : '#ffeaa7'};
  color: ${props => props.status === 'active' ? '#27ae60' : '#f39c12'};
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  align-items: center;
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  min-width: 150px;
`;

const FilterLabel = styled.label`
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SortButton = styled.button`
  background: #f8f9fa;
  border: 1px solid #ddd;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  margin-left: 10px;
  
  &:hover {
    background: #e9ecef;
  }
`;

const AddClassButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  margin-bottom: 20px;
  
  &:hover {
    opacity: 0.9;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
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
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
`;

const ModalTitle = styled.h3`
  margin: 0 0 20px 0;
  color: white;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  background: ${props => props.variant === 'secondary' ? 'rgba(108, 117, 125, 0.8)' : 'linear-gradient(45deg, #8B5CF6, #EC4899)'};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(139, 92, 246, 0.3);
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  
  option {
    background: #1a1a2e;
    color: white;
  }
  
  &:focus {
    border-color: #8B5CF6;
    outline: none;
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
  }
`;

interface ClassManagementProps {
  userRole: 'admin' | 'teacher' | 'student';
}

export default function ClassManagement({ userRole }: ClassManagementProps) {
  const { state, dispatch } = useApp();
  const [expandedClasses, setExpandedClasses] = useState<string[]>([]);
  const [classNameFilter, setClassNameFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [gradeSortOrder, setGradeSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', grade: '', teacherId: '' });

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classes = await apiService.getClasses();
        dispatch({ type: 'SET_CLASSES', payload: classes });
      } catch (error) {
        console.error('Failed to fetch classes:', error);
      }
    };
    
    fetchClasses();
  }, [dispatch]);

  const handleAddClass = () => {
    setFormData({ name: '', grade: '', teacherId: '' });
    setShowModal(true);
  };

  const [editingClass, setEditingClass] = useState<any>(null);

  const handleEditClass = (classItem: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingClass(classItem);
    const teacherId = typeof classItem.teacherId === 'object' ? classItem.teacherId?._id || classItem.teacherId?.id : classItem.teacherId;
    setFormData({ name: classItem.name, grade: classItem.grade, teacherId: teacherId || '' });
    setShowModal(true);
  };

  const handleDeleteClass = async (classItem: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete class "${classItem.name}"?`)) {
      try {
        const classId = classItem._id || classItem.id;
        await apiService.deleteClass(classId);
        dispatch({ type: 'DELETE_CLASS', payload: classId });
      } catch (error: any) {
        alert(error.message || 'Failed to delete class');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingClass) {
        const classId = editingClass._id || editingClass.id;
        const updatedClass = await apiService.updateClass(classId, formData);
        dispatch({ type: 'UPDATE_CLASS', payload: updatedClass });
      } else {
        const newClass = await apiService.createClass(formData);
        dispatch({ type: 'ADD_CLASS', payload: newClass });
      }
      setShowModal(false);
      setEditingClass(null);
    } catch (error: any) {
      alert(error.message || 'Failed to save class');
    }
  };

  // Mock class data with students - replace with actual state.classes
  const mockClasses = state.classes.map(cls => {
    const teacher = cls.teacherId ? state.users.find(user => 
      (user._id || user.id) === (typeof cls.teacherId === 'object' ? cls.teacherId._id || cls.teacherId.id : cls.teacherId)
    ) : null;
    
    // Count actual assigned students
    const assignedStudents = state.users.filter(user => {
      if (user.role !== 'student') return false;
      const userId = (user._id || user.id) as string;
      return (cls.studentIds || []).some(studentId => {
        const idValue = studentId as any;
        const id = typeof idValue === 'object' && idValue !== null ? (idValue._id || idValue.id) : idValue;
        return id === userId;
      });
    });
    
    return {
      id: cls._id || cls.id,
      name: cls.name,
      grade: cls.grade,
      teacher: teacher ? (teacher.name || teacher.username) : 'No teacher assigned',
      studentCount: assignedStudents.length, // Dynamic count
      students: assignedStudents.map(user => ({
        id: (user._id || user.id) as string,
        name: user.name || user.username,
        username: user.username,
        rollNumber: '001',
        status: 'active' as const
      }))
    };
  });

  const toggleClass = (classId: string) => {
    setExpandedClasses(prev => 
      prev.includes(classId) 
        ? prev.filter(id => id !== classId)
        : [...prev, classId]
    );
  };

  const getTitle = () => {
    switch (userRole) {
      case 'admin': return 'Class Management';
      case 'teacher': return 'My Classes';
      default: return 'Classes';
    }
  };

  const getSubtitle = () => {
    switch (userRole) {
      case 'admin': return 'Manage all classes and students in the institution';
      case 'teacher': return 'View and manage your assigned classes';
      default: return 'Your class information';
    }
  };

  const filteredClasses = mockClasses.filter(classItem => {
    const matchesName = classNameFilter === '' || classItem.name.toLowerCase().includes(classNameFilter.toLowerCase());
    const matchesGrade = gradeFilter === '' || classItem.grade === gradeFilter;
    return matchesName && matchesGrade;
  }).sort((a, b) => {
    if (gradeFilter) {
      const gradeA = a.grade.toLowerCase();
      const gradeB = b.grade.toLowerCase();
      return gradeSortOrder === 'asc' ? gradeA.localeCompare(gradeB) : gradeB.localeCompare(gradeA);
    }
    return 0;
  });

  const uniqueGrades = Array.from(new Set(mockClasses.map(c => c.grade)));

  return (
    <Container>
      <Header>
        <Title>{getTitle()}</Title>
        <Subtitle>{getSubtitle()}</Subtitle>
      </Header>

      {userRole === 'admin' && (
        <AddClassButton onClick={handleAddClass}>
          + Add New Class
        </AddClassButton>
      )}

      <FilterContainer>
        <FilterLabel>
          Class Name:
          <FilterSelect value={classNameFilter} onChange={(e) => setClassNameFilter(e.target.value)}>
            <option value="">All Classes</option>
            {Array.from(new Set(mockClasses.map(c => c.name))).map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </FilterSelect>
        </FilterLabel>
        <FilterLabel>
          Grade:
          <FilterSelect value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)}>
            <option value="">All Grades</option>
            {uniqueGrades.map(grade => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </FilterSelect>
          {gradeFilter && (
            <SortButton onClick={() => setGradeSortOrder(gradeSortOrder === 'asc' ? 'desc' : 'asc')}>
              Sort {gradeSortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </SortButton>
          )}
        </FilterLabel>
      </FilterContainer>

      {mockClasses.length === 0 ? (
        <EmptyState>
          <h3>No classes found</h3>
          <p>Start by creating your first class</p>
        </EmptyState>
      ) : (
        <ClassGrid>
          {filteredClasses.map(classItem => {
            const classId = classItem.id || '';
            return (
            <ClassCard key={classId}>
              <ClassHeader>
                <ClassHeaderContent onClick={() => toggleClass(classId)}>
                  <ClassName>{classItem.name}</ClassName>
                  <ClassInfo>
                    {classItem.grade} • {classItem.studentCount} students • Teacher: {classItem.teacher}
                  </ClassInfo>
                </ClassHeaderContent>
                {userRole === 'admin' && (
                  <HeaderButtonGroup>
                    <EditButton onClick={(e) => handleEditClass(classItem, e)}>
                      Edit
                    </EditButton>
                    <DeleteButton onClick={(e) => handleDeleteClass(classItem, e)}>
                      Delete
                    </DeleteButton>
                  </HeaderButtonGroup>
                )}
              </ClassHeader>
              
              <StudentList isExpanded={expandedClasses.includes(classId)}>
                {classItem.students.map(student => (
                  <StudentItem key={student.id}>
                    <StudentInfo>
                      <StudentName>{student.name}</StudentName>
                      <StudentDetails>
                        @{student.username} • Roll: {student.rollNumber}
                      </StudentDetails>
                    </StudentInfo>
                    <StudentStatus status={student.status}>
                      {student.status}
                    </StudentStatus>
                  </StudentItem>
                ))}
              </StudentList>
            </ClassCard>
            );
          })}
        </ClassGrid>
      )}
      
      {showModal && (
        <Modal>
          <ModalContent>
            <ModalTitle>{editingClass ? 'Edit Class' : 'Add New Class'}</ModalTitle>
            <Form onSubmit={handleSubmit}>
              <Input
                type="text"
                placeholder="Class Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Select
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                required
              >
                <option value="">Select Grade</option>
                <option value="1st">1st Grade</option>
                <option value="2nd">2nd Grade</option>
                <option value="3rd">3rd Grade</option>
                <option value="4th">4th Grade</option>
                <option value="5th">5th Grade</option>
                <option value="6th">6th Grade</option>
                <option value="7th">7th Grade</option>
                <option value="8th">8th Grade</option>
                <option value="9th">9th Grade</option>
                <option value="10th">10th Grade</option>
                <option value="11th">11th Grade</option>
                <option value="12th">12th Grade</option>
              </Select>
              <Select
                value={formData.teacherId}
                onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
              >
                <option value="">No teacher assigned</option>
                {state.users.filter(user => user.role === 'teacher').map(teacher => (
                  <option key={teacher._id || teacher.id} value={teacher._id || teacher.id}>
                    {teacher.name || teacher.username}
                  </option>
                ))}
              </Select>
              <ButtonGroup>
                <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  {editingClass ? 'Update Class' : 'Create Class'}
                </Button>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}