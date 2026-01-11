import React, { useState } from 'react';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';
import { User } from '../types';
import apiService from '../services/api';

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  align-items: center;
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  min-width: 120px;
  
  option {
    background: #1a1a2e;
    color: white;
  }
`;

const SortButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const Title = styled.h2`
  color: white;
  margin: 0;
`;

const AddButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  
  &:hover {
    opacity: 0.9;
  }
`;

const Table = styled.table`
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 20px;
  text-align: left;
  background: rgba(255, 255, 255, 0.1);
  font-weight: 600;
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Td = styled.td`
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  
  &:last-child {
    border-bottom: none;
  }
  
  em {
    color: rgba(255, 255, 255, 0.6);
  }
  
  strong {
    color: #EC4899;
  }
`;

const ActionButton = styled.button<{ $variant?: 'edit' | 'delete' }>`
  background: ${props => props.$variant === 'delete' ? '#e74c3c' : '#3498db'};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 8px;
  font-size: 12px;
  font-weight: 600;
  vertical-align: middle;
  
  &:hover {
    opacity: 0.8;
  }
  
  &:last-child {
    margin-right: 0;
  }
`;

const StatusBadge = styled.span<{ $active: boolean }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.$active ? '#e8f5e8' : '#ffeaa7'};
  color: ${props => props.$active ? '#27ae60' : '#f39c12'};
`;

const RoleBadge = styled.span<{ $role: string }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
  background: ${props => 
    props.$role === 'admin' ? '#ffe6e6' : 
    props.$role === 'teacher' ? '#e6f3ff' : '#f0f8e6'
  };
  color: ${props => 
    props.$role === 'admin' ? '#d63384' : 
    props.$role === 'teacher' ? '#0d6efd' : '#198754'
  };
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
  max-width: 500px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
`;

const ModalTitle = styled.h3`
  margin: 0 0 20px 0;
  color: white;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  background: ${props => props.$variant === 'secondary' ? 'rgba(108, 117, 125, 0.8)' : 'linear-gradient(45deg, #8B5CF6, #EC4899)'};
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

export default function UserManagement() {
  const { state, dispatch } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [roleFilter, setRoleFilter] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'student' as 'admin' | 'teacher' | 'student'
  });

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({ username: '', password: '', role: 'student' });
    setShowModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({ username: user.username, password: user.password, role: user.role });
    setShowModal(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await apiService.deleteUser(userId);
        dispatch({ type: 'DELETE_USER', payload: userId });
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete user');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check student-teacher ratio before creating users
    if (!editingUser && formData.role === 'student') {
      const currentStudents = state.users.filter(u => u.role === 'student').length;
      const currentTeachers = state.users.filter(u => u.role === 'teacher').length;
      
      if (currentTeachers === 0) {
        alert('Cannot create student account. At least one teacher must be created first to maintain the 25:1 student-teacher ratio.');
        return;
      }
      
      const newStudentCount = currentStudents + 1;
      const ratio = newStudentCount / currentTeachers;
      
      if (ratio > 25) {
        alert(`Cannot create student account. This would exceed the maximum 25:1 student-teacher ratio. Current ratio would be ${ratio.toFixed(1)}:1. Please create more teachers first.`);
        return;
      }
    }
    
    try {
      if (editingUser) {
        const updatedUser = await apiService.updateUser((editingUser._id || editingUser.id) as string, formData);
        dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      } else {
        const newUser = await apiService.createUser(formData);
        dispatch({ type: 'ADD_USER', payload: newUser });
      }
      setShowModal(false);
    } catch (error: any) {
      alert(error.message || 'Failed to save user');
    }
  };

  const filteredUsers = state.users
    .filter(user => roleFilter === '' || user.role === roleFilter);

  return (
    <Container>
      <Header>
        <Title>User Management</Title>
        <AddButton onClick={handleAddUser}>+ Add New User</AddButton>
      </Header>

      <FilterContainer>
        <FilterSelect value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
        </FilterSelect>
      </FilterContainer>

      <Table>
        <thead>
          <tr>
            <Th>Username</Th>
            <Th>Name</Th>
            <Th>Role</Th>
            <Th>Status</Th>
            <Th>Last Login</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <Td><strong>{user.username}</strong></Td>
              <Td>{user.name || <em>Not set</em>}</Td>
              <Td><RoleBadge $role={user.role}>{user.role}</RoleBadge></Td>
              <Td><StatusBadge $active={user.isActive}>{user.isActive ? 'Active' : 'Inactive'}</StatusBadge></Td>
              <Td>{user.lastLogin ? user.lastLogin.toLocaleString() : <em>Never</em>}</Td>
              <Td>
                <ActionButton onClick={() => handleEditUser(user)}>Edit</ActionButton>
                {user.role !== 'admin' && (
                  <ActionButton $variant="delete" onClick={() => handleDeleteUser((user._id || user.id) as string)}>Delete</ActionButton>
                )}
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {showModal && (
        <Modal>
          <ModalContent>
            <ModalTitle>{editingUser ? 'Edit User' : 'Add New User'}</ModalTitle>
            <Form onSubmit={handleSubmit}>
              <Input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </Select>
              <ButtonGroup>
                <Button type="button" $variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" $variant="primary">
                  {editingUser ? 'Update User' : 'Create User'}
                </Button>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}