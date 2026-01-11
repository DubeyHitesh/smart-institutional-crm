import React, { useState } from 'react';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';
import { Notice } from '../types';

const Container = styled.div`
  padding: 20px;
`;

const Section = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  margin-bottom: 20px;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitle = styled.h3`
  margin: 0;
  color: white;
`;

const AddButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  
  &:hover {
    opacity: 0.9;
  }
`;

const NoticeList = styled.div`
  padding: 20px;
  color: white;
  
  p {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const NoticeItem = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
`;

const NoticeTitle = styled.h4`
  margin: 0 0 10px 0;
  color: white;
`;

const NoticeContent = styled.p`
  margin: 0 0 10px 0;
  color: rgba(255, 255, 255, 0.8);
`;

const NoticeInfo = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EditButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-right: 5px;
  
  &:hover {
    background: #218838;
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
  margin-left: 10px;
  
  &:hover {
    background: #c82333;
  }
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
  
  h3 {
    color: white;
    margin-bottom: 20px;
  }
  
  label {
    color: white;
    margin-bottom: 10px;
    display: block;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  &:focus {
    border-color: #8B5CF6;
    outline: none;
  }
`;

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  min-height: 100px;
  resize: vertical;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  &:focus {
    border-color: #8B5CF6;
    outline: none;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  gap: 20px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  background: ${props => props.variant === 'secondary' ? '#6c757d' : '#667eea'};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
`;

export default function Reports() {
  const { state, dispatch } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    targetRoles: [] as ('teacher' | 'student')[]
  });

  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);

  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      targetRoles: notice.targetRoles
    });
    setShowModal(true);
  };

  const handleDelete = async (noticeId: string) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      dispatch({ type: 'DELETE_NOTICE', payload: noticeId });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingNotice) {
      const updatedNotice: Notice = {
        ...editingNotice,
        ...formData,
        updatedAt: new Date()
      };
      dispatch({ type: 'ADD_NOTICE', payload: updatedNotice });
    } else {
      const newNotice: Notice = {
        id: Date.now().toString(),
        ...formData,
        createdBy: state.currentUser?.username || 'admin',
        createdAt: new Date()
      };
      dispatch({ type: 'ADD_NOTICE', payload: newNotice });
    }
    
    setShowModal(false);
    setEditingNotice(null);
    setFormData({ title: '', content: '', targetRoles: [] });
  };

  const handleRoleChange = (role: 'teacher' | 'student', checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, targetRoles: [...formData.targetRoles, role] });
    } else {
      setFormData({ ...formData, targetRoles: formData.targetRoles.filter(r => r !== role) });
    }
  };

  return (
    <Container>
      <Section>
        <SectionHeader>
          <SectionTitle>Notice Management</SectionTitle>
          <AddButton onClick={() => setShowModal(true)}>+ Send Notice</AddButton>
        </SectionHeader>
        <NoticeList>
          {(!state.notices || state.notices.length === 0) ? (
            <p>No notices sent yet.</p>
          ) : (
            state.notices.map(notice => (
              <NoticeItem key={notice.id}>
                <NoticeTitle>{notice.title}</NoticeTitle>
                <NoticeContent>{notice.content}</NoticeContent>
                <NoticeInfo>
                  <span>To: {notice.targetRoles.join(', ')}</span>
                  <div>
                    <span>Created: {new Date(notice.createdAt).toLocaleString()}</span>
                    {(notice as any).updatedAt && (
                      <span style={{ marginLeft: '10px' }}>Updated: {new Date((notice as any).updatedAt).toLocaleString()}</span>
                    )}
                    <EditButton onClick={() => handleEdit(notice)}>
                      Edit
                    </EditButton>
                    <DeleteButton onClick={() => {
                      const noticeId = notice.id || notice._id;
                      if (noticeId) {
                        handleDelete(noticeId);
                      }
                    }}>
                      Delete
                    </DeleteButton>
                  </div>
                </NoticeInfo>
              </NoticeItem>
            ))
          )}
        </NoticeList>
      </Section>

      {showModal && (
        <Modal>
          <ModalContent>
            <h3>{editingNotice ? 'Edit Notice' : 'Send New Notice'}</h3>
            <Form onSubmit={handleSubmit}>
              <Input
                type="text"
                placeholder="Notice Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <TextArea
                placeholder="Notice Content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
              />
              <div>
                <label>Send to:</label>
                <CheckboxGroup>
                  <CheckboxLabel>
                    <input
                      type="checkbox"
                      checked={formData.targetRoles.includes('teacher')}
                      onChange={(e) => handleRoleChange('teacher', e.target.checked)}
                    />
                    Teachers
                  </CheckboxLabel>
                  <CheckboxLabel>
                    <input
                      type="checkbox"
                      checked={formData.targetRoles.includes('student')}
                      onChange={(e) => handleRoleChange('student', e.target.checked)}
                    />
                    Students
                  </CheckboxLabel>
                </CheckboxGroup>
              </div>
              <ButtonGroup>
                <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingNotice ? 'Update Notice' : 'Send Notice'}</Button>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}