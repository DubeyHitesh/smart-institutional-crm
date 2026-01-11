import React from 'react';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';
import apiService from '../services/api';

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
`;

const SectionTitle = styled.h3`
  margin: 0;
  color: white;
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

interface InboxProps {
  userRole: 'admin' | 'teacher' | 'student';
}

export default function Inbox({ userRole }: InboxProps) {
  const { state, dispatch } = useApp();

  const handleDelete = async (noticeId: string) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      try {
        await apiService.deleteNotice(noticeId);
        dispatch({ type: 'DELETE_NOTICE', payload: noticeId });
      } catch (error) {
        console.error('Failed to delete notice:', error);
      }
    }
  };

  const relevantNotices = userRole === 'admin' 
    ? (state.notices || [])
    : (state.notices || []).filter(notice => notice.targetRoles.includes(userRole as 'teacher' | 'student'));

  return (
    <Container>
      <Section>
        <SectionHeader>
          <SectionTitle>Inbox</SectionTitle>
        </SectionHeader>
        <NoticeList>
          {relevantNotices.length === 0 ? (
            <p>No messages yet.</p>
          ) : (
            relevantNotices.map(notice => (
              <NoticeItem key={notice.id}>
                <NoticeTitle>{notice.title}</NoticeTitle>
                <NoticeContent>{notice.content}</NoticeContent>
                <NoticeInfo>
                  <span>From: {notice.createdBy}</span>
                  <div>
                    <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                    {userRole === 'admin' && (
                      <DeleteButton onClick={() => {
                        const noticeId = notice.id || notice._id;
                        if (noticeId) {
                          handleDelete(noticeId);
                        }
                      }}>
                        Delete
                      </DeleteButton>
                    )}
                  </div>
                </NoticeInfo>
              </NoticeItem>
            ))
          )}
        </NoticeList>
      </Section>
    </Container>
  );
}