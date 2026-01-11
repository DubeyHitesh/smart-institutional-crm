import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import apiService from '../services/api';

const Container = styled.div`
  padding: 20px;
  background: linear-gradient(135deg, rgba(74, 0, 224, 0.1) 0%, rgba(142, 45, 226, 0.1) 100%);
  min-height: 100vh;
`;

const Header = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  color: white;
`;

const FormContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 150px;
  gap: 15px;
  align-items: end;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 14px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  &:focus {
    outline: none;
    border-color: #8e2de2;
    box-shadow: 0 0 10px rgba(142, 45, 226, 0.3);
  }
`;

const Button = styled.button`
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SubjectList = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 20px;
`;

const SubjectCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  display: grid;
  grid-template-columns: 1fr 200px 150px 100px;
  gap: 15px;
  align-items: center;
`;

const SubjectInfo = styled.div`
  color: white;
  
  h4 {
    margin: 0 0 5px 0;
    font-size: 16px;
  }
  
  p {
    margin: 0;
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
  }
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 14px;

  option {
    background: #2a2a2a;
    color: white;
  }

  &:focus {
    outline: none;
    border-color: #8e2de2;
  }
`;

const SmallButton = styled(Button)`
  padding: 6px 12px;
  font-size: 12px;
`;

const DeleteButton = styled(SmallButton)`
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
`;

const TeacherInfo = styled.div`
  color: white;
  font-size: 14px;
  
  .teacher-name {
    font-weight: 500;
  }
  
  .no-teacher {
    color: rgba(255, 255, 255, 0.5);
    font-style: italic;
  }
`;

interface Subject {
  _id: string;
  name: string;
  description?: string;
  assignedTeacher?: {
    _id: string;
    name: string;
    email: string;
  };
  createdBy: string;
  createdAt: string;
}

interface Teacher {
  _id: string;
  name: string;
  username: string;
  email: string;
  role: string;
}

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [newSubject, setNewSubject] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubjects();
    fetchTeachers();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await apiService.getSubjects();
      setSubjects(response);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await apiService.getUsers();
      console.log('All users:', response);
      const teacherUsers = response.filter((user: any) => user.role === 'teacher');
      console.log('Filtered teachers:', teacherUsers);
      setTeachers(teacherUsers);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.name.trim()) return;

    setLoading(true);
    try {
      await apiService.createSubject(newSubject);
      setNewSubject({ name: '', description: '' });
      fetchSubjects();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error creating subject');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTeacher = async (subjectId: string, teacherId: string) => {
    try {
      await apiService.assignTeacherToSubject(subjectId, teacherId);
      fetchSubjects();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error assigning teacher');
    }
  };

  const handleUnassignTeacher = async (subjectId: string) => {
    try {
      await apiService.unassignTeacherFromSubject(subjectId);
      fetchSubjects();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error unassigning teacher');
    }
  };

  const handleDeleteSubject = async (subjectId: string) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) return;

    try {
      await apiService.deleteSubject(subjectId);
      fetchSubjects();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error deleting subject');
    }
  };

  return (
    <Container>
      <Header>
        <h2>Subject Management</h2>
        <p>Create subjects and assign teachers to them</p>
      </Header>

      <FormContainer>
        <h3 style={{ color: 'white', marginBottom: '15px' }}>Create New Subject</h3>
        <form onSubmit={handleCreateSubject}>
          <FormGrid>
            <Input
              type="text"
              placeholder="Subject Name"
              value={newSubject.name}
              onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
              required
            />
            <Input
              type="text"
              placeholder="Description (optional)"
              value={newSubject.description}
              onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Subject'}
            </Button>
          </FormGrid>
        </form>
      </FormContainer>

      <SubjectList>
        <h3 style={{ color: 'white', marginBottom: '20px' }}>
          All Subjects ({subjects.length})
        </h3>
        
        {subjects.length === 0 ? (
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', padding: '20px' }}>
            No subjects created yet
          </p>
        ) : (
          subjects.map((subject) => (
            <SubjectCard key={subject._id}>
              <SubjectInfo>
                <h4>{subject.name}</h4>
                {subject.description && <p>{subject.description}</p>}
              </SubjectInfo>
              
              <TeacherInfo>
                {subject.assignedTeacher ? (
                  <div className="teacher-name">{subject.assignedTeacher.name}</div>
                ) : (
                  <div className="no-teacher">No teacher assigned</div>
                )}
              </TeacherInfo>
              
              <Select
                value={subject.assignedTeacher?._id || ''}
                onChange={(e) => {
                  if (e.target.value) {
                    handleAssignTeacher(subject._id, e.target.value);
                  } else {
                    handleUnassignTeacher(subject._id);
                  }
                }}
              >
                <option value="">Select Teacher</option>
                {teachers.map((teacher) => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.name || teacher.username}
                  </option>
                ))}
              </Select>
              
              <DeleteButton onClick={() => handleDeleteSubject(subject._id)}>
                Delete
              </DeleteButton>
            </SubjectCard>
          ))
        )}
      </SubjectList>
    </Container>
  );
};

export default SubjectManagement;