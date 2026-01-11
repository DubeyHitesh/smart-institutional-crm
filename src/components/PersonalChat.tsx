import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';
import apiService from '../services/api';

const Container = styled.div`
  display: flex;
  height: 80vh;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1));
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const UserList = styled.div`
  width: 300px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  background: #2A3942;
`;

const UserItem = styled.div<{ $active?: boolean }>`
  padding: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  color: white;
  background: ${props => props.$active ? '#202C33' : 'transparent'};
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(236, 72, 153, 0.05));
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 50px,
        rgba(255, 255, 255, 0.02) 50px,
        rgba(255, 255, 255, 0.02) 51px
      ),
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 50px,
        rgba(255, 255, 255, 0.02) 50px,
        rgba(255, 255, 255, 0.02) 51px
      );
    pointer-events: none;
    opacity: 0.3;
  }
`;

const ChatHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: #E9EDEF;
  font-weight: 600;
  background: #202C33;
  position: relative;
  z-index: 1;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  position: relative;
  z-index: 1;
`;

const Message = styled.div<{ $isOwn?: boolean }>`
  margin-bottom: 8px;
  display: flex;
  justify-content: ${props => props.$isOwn ? 'flex-end' : 'flex-start'};
`;

const MessageBubble = styled.div<{ $isOwn?: boolean }>`
  max-width: 65%;
  padding: 8px 12px;
  border-radius: ${props => props.$isOwn ? '7.5px 7.5px 0 7.5px' : '7.5px 7.5px 7.5px 0'};
  background: ${props => props.$isOwn ? '#075E54' : '#343F46'};
  color: ${props => props.$isOwn ? 'white' : '#E7E7E7'};
  word-wrap: break-word;
  position: relative;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  
  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    width: 0;
    height: 0;
    ${props => props.$isOwn ? `
      right: -8px;
      border-left: 8px solid #075E54;
      border-bottom: 13px solid transparent;
    ` : `
      left: -8px;
      border-right: 8px solid #343F46;
      border-bottom: 13px solid transparent;
    `}
  }
`;

const SenderName = styled.div<{ $isOwn?: boolean }>`
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 2px;
  color: ${props => props.$isOwn ? 'rgba(255, 255, 255, 0.9)' : '#25D366'};
`;

const MessageContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MessageText = styled.div`
  word-wrap: break-word;
  white-space: pre-wrap;
`;

const MessageFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  margin-top: 2px;
`;

const MessageTime = styled.span`
  font-size: 11px;
  opacity: 0.8;
  color: ${props => props.color || 'rgba(255, 255, 255, 0.7)'};
`;

const ReadReceipt = styled.span`
  font-size: 14px;
  color: #53BDEB;
  opacity: 0.9;
  margin-left: 2px;
`;

const InputArea = styled.div`
  padding: 8px 12px;
  background: #202C33;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 1;
`;

const IconButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 21px;
  background: #2A3942;
  color: white;
  font-size: 15px;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    outline: none;
  }
`;

const SendButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ReplyPreview = styled.div`
  background: rgba(37, 211, 102, 0.2);
  border-left: 4px solid #25D366;
  padding: 8px 10px;
  margin-bottom: 8px;
  border-radius: 6px;
  font-size: 12px;
  border: 1px solid rgba(37, 211, 102, 0.3);
`;

const ReplyHeader = styled.div`
  font-weight: 600;
  color: #25D366;
  margin-bottom: 3px;
  font-size: 11px;
`;

const ReplyText = styled.div`
  color: rgba(255, 255, 255, 0.9);
  font-style: italic;
  font-size: 11px;
  line-height: 1.3;
`;

const ReplyingTo = styled.div`
  background: rgba(37, 211, 102, 0.1);
  border: 1px solid rgba(37, 211, 102, 0.3);
  border-radius: 8px;
  padding: 8px 12px;
  margin: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
`;

const ReplyContent = styled.div`
  flex: 1;
`;

const CancelReply = styled.button`
  background: none;
  border: none;
  color: #25D366;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
  
  &:hover {
    opacity: 0.7;
  }
`;

const EmojiPicker = styled.div`
  position: absolute;
  bottom: 60px;
  left: 12px;
  background: #2A3942;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  max-height: 300px;
  width: 300px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const EmojiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
`;

const EmojiButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  padding: 4px;
  cursor: pointer;
  border-radius: 4px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8696A0;
  font-size: 18px;
  position: relative;
  z-index: 1;
`;

interface ChatMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  senderName: string;
  replyTo?: {
    messageId: string;
    message: string;
    senderName: string;
  };
}

export default function PersonalChat() {
  const { state } = useApp();
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [unreadCounts, setUnreadCounts] = useState<{[key: string]: number}>({});
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUser = state.currentUser;

  useEffect(() => {
    // Add test students for debugging
    const testStudents = [
      { _id: 'test1', name: 'Test Student 1', username: 'student1', role: 'student' },
      { _id: 'test2', name: 'Test Student 2', username: 'student2', role: 'student' }
    ];
    
    if (currentUser?.role === 'teacher') {
      setUsers(testStudents);
    }
    
    fetchUsers();
    fetchUnreadCounts();
  }, [currentUser]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchUnreadCounts = async () => {
    try {
      const counts = await apiService.getUnreadCounts();
      const countMap: {[key: string]: number} = {};
      counts.forEach((item: any) => {
        countMap[item.senderId] = item.count;
      });
      setUnreadCounts(countMap);
    } catch (error) {
      console.error('Error fetching unread counts:', error);
    }
  };

  const fetchUsers = async () => {
    if (!currentUser) return;
    
    try {
      const response = await fetch('http://localhost:5001/api/users/chat', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const users = await response.json();
        console.log('Chat users fetched:', users);
        setUsers(users);
      } else {
        console.error('API response not ok:', response.status);
      }
    } catch (error) {
      console.error('Direct API fetch error:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const data = await apiService.getMessages(selectedUser._id);
      console.log('Fetched messages:', data);
      setMessages(data);
      // Clear unread count for this user since messages are now read
      setUnreadCounts(prev => {
        const updated = { ...prev };
        delete updated[selectedUser._id];
        return updated;
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const messageData: any = {
        receiverId: selectedUser._id,
        message: newMessage
      };

      if (replyingTo) {
        messageData.replyTo = {
          messageId: replyingTo._id,
          message: replyingTo.message,
          senderName: replyingTo.senderName
        };
        console.log('Sending reply with data:', messageData.replyTo);
      }

      const message = await apiService.sendMessage(messageData);
      console.log('Received message response:', message);
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const emojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰',
    '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏',
    '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠',
    '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥',
    '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐',
    '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻',
    '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '❤️',
    '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘',
    '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉',
    '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳'
  ];

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <Container>
      <UserList>
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'white', fontWeight: '600', background: '#202C33' }}>
          {currentUser?.role === 'teacher' ? 'Students' : 'Teachers'} ({users.length})
        </div>
        {users.length === 0 ? (
          <div style={{ padding: '20px', color: '#8696A0', textAlign: 'center' }}>
            Loading students... Current user: {currentUser?.role}
            <br />State users: {state.users?.length || 0}
            <br />Test students should appear here
          </div>
        ) : (
          users.map(user => (
            <UserItem
              key={user._id}
              $active={selectedUser?._id === user._id}
              onClick={() => setSelectedUser(user)}
            >
              <div style={{ fontWeight: '600', color: '#E9EDEF', position: 'relative' }}>
                {user.name || user.username}
                {unreadCounts[user._id] && (
                  <span style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-10px',
                    background: '#25D366',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}>
                    {unreadCounts[user._id]}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '12px', opacity: '0.7', color: '#8696A0', marginTop: '4px' }}>{user.role}</div>
            </UserItem>
          ))
        )}
      </UserList>

      <ChatArea>
        {selectedUser ? (
          <>
            <ChatHeader>
              Chat with {selectedUser.name || selectedUser.username}
            </ChatHeader>
            
            <MessagesContainer>
              {messages.map(message => {
                const isOwn = message.senderId === currentUser?._id;
                const timeString = new Date(message.timestamp).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                }).toLowerCase();
                console.log('Message with reply:', message); // Debug log
                console.log('Reply data:', message.replyTo); // Debug reply data
                return (
                  <Message key={message._id} $isOwn={isOwn}>
                    <MessageBubble $isOwn={isOwn} onClick={() => setReplyingTo(message)}>
                      <MessageContent>
                        <SenderName $isOwn={isOwn}>
                          {isOwn ? 'You' : message.senderName}
                        </SenderName>
                        {message.replyTo ? (
                          <ReplyPreview>
                            <ReplyHeader>↳ {message.replyTo.senderName}</ReplyHeader>
                            <ReplyText>{message.replyTo.message}</ReplyText>
                          </ReplyPreview>
                        ) : null}
                        <MessageText>{message.message}</MessageText>
                        <MessageFooter>
                          <MessageTime color={isOwn ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.6)'}>
                            {timeString}
                          </MessageTime>
                          {isOwn && (
                            <ReadReceipt>✓✓</ReadReceipt>
                          )}
                        </MessageFooter>
                      </MessageContent>
                    </MessageBubble>
                  </Message>
                );
              })}
              <div ref={messagesEndRef} />
            </MessagesContainer>

            <InputArea>
              {replyingTo && (
                <ReplyingTo>
                  <ReplyContent>
                    <div style={{ fontWeight: '600', color: '#25D366', fontSize: '12px' }}>
                      Replying to {replyingTo.senderName}
                    </div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', marginTop: '2px' }}>
                      {replyingTo.message.length > 50 ? replyingTo.message.substring(0, 50) + '...' : replyingTo.message}
                    </div>
                  </ReplyContent>
                  <CancelReply onClick={() => setReplyingTo(null)}>
                    ✕
                  </CancelReply>
                </ReplyingTo>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px' }}>
                <IconButton 
                  type="button" 
                  aria-label="Emoji"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <span>🙂</span>
                </IconButton>
                {showEmojiPicker && (
                  <EmojiPicker>
                    <EmojiGrid>
                      {emojis.map((emoji, index) => (
                        <EmojiButton key={index} onClick={() => addEmoji(emoji)}>
                          {emoji}
                        </EmojiButton>
                      ))}
                    </EmojiGrid>
                  </EmojiPicker>
                )}
                <MessageInput
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={replyingTo ? `Reply to ${replyingTo.senderName}...` : "Type a message"}
                />
                <SendButton onClick={sendMessage} aria-label="Send">
                  <span>➤</span>
                </SendButton>
              </div>
            </InputArea>
          </>
        ) : (
          <EmptyState>
            Select a {currentUser?.role === 'teacher' ? 'student' : 'teacher'} to start chatting
          </EmptyState>
        )}
      </ChatArea>
    </Container>
  );
}