import React, { useState } from 'react';
import styled from 'styled-components';
import { User } from '../types';
import { useApp } from '../context/AppContext';

const EditButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 1rem;
  
  &:hover {
    background: #5a6fd8;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SaveButton = styled.button`
  background: #27ae60;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  
  &:hover {
    background: #219a52;
  }
`;

const CancelButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  
  &:hover {
    background: #5a6268;
  }
`;

const ProfileItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Label = styled.span`
  font-weight: bold;
  color: rgba(255, 255, 255, 0.9);
`;

const Value = styled.span`
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
`;

interface ProfileEditorProps {
  user: User;
  showRoleSpecificFields?: boolean;
}

export default function ProfileEditor({ user, showRoleSpecificFields = false }: ProfileEditorProps) {
  const { state, dispatch } = useApp();
  // Get student's assigned class name
  const getStudentClassName = () => {
    if (user.role !== 'student') return null;
    const studentId = user._id || user.id;
    const assignedClass = (state.classes || []).find(cls => 
      cls.studentIds && cls.studentIds.some((student: any) => {
        const id = typeof student === 'object' ? student._id || student.id : student;
        return id === studentId;
      })
    );
    return assignedClass ? `${assignedClass.name} - Grade ${assignedClass.grade}` : 'Not assigned';
  };

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || '',
    class: (user as any).class || '',
    rollNumber: (user as any).rollNumber || '',
    department: (user as any).department || '',
    employeeId: (user as any).employeeId || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: User = {
      ...user,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      ...(user.role === 'student' && {
        class: formData.class,
        rollNumber: formData.rollNumber
      }),
      ...(user.role === 'teacher' && {
        department: formData.department,
        employeeId: formData.employeeId
      })
    };
    
    dispatch({ type: 'UPDATE_PROFILE', payload: updatedUser });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      class: (user as any).class || '',
      rollNumber: (user as any).rollNumber || '',
      department: (user as any).department || '',
      employeeId: (user as any).employeeId || ''
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <Input
          type="tel"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        {user.role !== 'student' && (
          <Input
            type="text"
            placeholder="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        )}
        
        {showRoleSpecificFields && user.role === 'student' && (
          <>
            <Input
              type="text"
              placeholder="Class"
              value={formData.class}
              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
            />
            <Input
              type="text"
              placeholder="Roll Number"
              value={formData.rollNumber}
              onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
            />
          </>
        )}
        
        {showRoleSpecificFields && user.role === 'teacher' && (
          <>
            <Input
              type="text"
              placeholder="Department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
            <Input
              type="text"
              placeholder="Employee ID"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
            />
          </>
        )}
        
        <ButtonGroup>
          <SaveButton type="submit">Save Changes</SaveButton>
          <CancelButton type="button" onClick={handleCancel}>Cancel</CancelButton>
        </ButtonGroup>
      </Form>
    );
  }

  return (
    <>
      <EditButton onClick={() => setIsEditing(true)}>Edit Profile</EditButton>
      <div>
        <ProfileItem>
          <Label>Name:</Label>
          <Value>{user.name || 'Not set'}</Value>
        </ProfileItem>
        <ProfileItem>
          <Label>Username:</Label>
          <Value>{user.username}</Value>
        </ProfileItem>
        <ProfileItem>
          <Label>Email:</Label>
          <Value>{user.email || 'Not set'}</Value>
        </ProfileItem>
        <ProfileItem>
          <Label>Phone:</Label>
          <Value>{user.phone || 'Not set'}</Value>
        </ProfileItem>
        {user.role === 'student' ? (
          <ProfileItem>
            <Label>Assigned Class:</Label>
            <Value>{getStudentClassName()}</Value>
          </ProfileItem>
        ) : (
          <ProfileItem>
            <Label>Address:</Label>
            <Value>{user.address || 'Not set'}</Value>
          </ProfileItem>
        )}
        
        {showRoleSpecificFields && user.role === 'student' && (
          <>
            <ProfileItem>
              <Label>Class:</Label>
              <Value>{(user as any).class || 'Not set'}</Value>
            </ProfileItem>
            <ProfileItem>
              <Label>Roll Number:</Label>
              <Value>{(user as any).rollNumber || 'Not set'}</Value>
            </ProfileItem>
          </>
        )}
        
        {showRoleSpecificFields && user.role === 'teacher' && (
          <>
            <ProfileItem>
              <Label>Department:</Label>
              <Value>{(user as any).department || 'Not set'}</Value>
            </ProfileItem>
            <ProfileItem>
              <Label>Employee ID:</Label>
              <Value>{(user as any).employeeId || 'Not set'}</Value>
            </ProfileItem>
          </>
        )}
      </div>
    </>
  );
}