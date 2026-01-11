import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';

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

const AssignmentsList = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const AssignmentItem = styled.div<{ $isOverdue?: boolean }>`
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  background: ${props => props.$isOverdue ? '#ffebee' : 'white'};
  border-left: ${props => props.$isOverdue ? '4px solid #f44336' : 'none'};
  
  &:last-child {
    border-bottom: none;
  }
`;

const AssignmentTitle = styled.h3<{ $isOverdue?: boolean }>`
  margin: 0 0 8px 0;
  color: ${props => props.$isOverdue ? '#d32f2f' : '#333'};
  font-size: 18px;
`;

const AssignmentDetails = styled.div<{ $isOverdue?: boolean }>`
  color: ${props => props.$isOverdue ? '#d32f2f' : '#666'};
  font-size: 14px;
  margin-bottom: 8px;
`;

const AssignmentMeta = styled.div`
  display: flex;
  gap: 20px;
  font-size: 12px;
  color: #888;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  background: ${props => {
    switch (props.status) {
      case 'Completed': return '#e8f5e8';
      case 'Pending': return '#fff3cd';
      case 'In Progress': return '#d1ecf1';
      default: return '#f8f9fa';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'Completed': return '#27ae60';
      case 'Pending': return '#f39c12';
      case 'In Progress': return '#17a2b8';
      default: return '#6c757d';
    }
  }};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const AttachButton = styled.button`
  background: #2196f3;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  
  &:hover {
    background: #1976d2;
  }
`;

const SubmitButton = styled.button<{ $submitted?: boolean }>`
  background: ${props => props.$submitted ? '#4caf50' : '#ff9800'};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: ${props => props.$submitted ? 'default' : 'pointer'};
  font-size: 12px;
  font-weight: 600;
  
  &:hover {
    background: ${props => props.$submitted ? '#4caf50' : '#f57c00'};
  }
`;

const FileInput = styled.input`
  display: none;
`;

const AttachedFiles = styled.div`
  margin-top: 10px;
  font-size: 12px;
  color: #666;
`;

const SummarizeButton = styled.button`
  background: #9c27b0;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  margin-left: 10px;
  
  &:hover {
    background: #7b1fa2;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const SummaryBox = styled.div`
  background: rgba(156, 39, 176, 0.1);
  border: 1px solid rgba(156, 39, 176, 0.3);
  border-radius: 8px;
  padding: 15px;
  margin-top: 10px;
  color: #333;
  font-size: 14px;
  line-height: 1.5;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
`;

export default function StudentAssignments() {
  const { state } = useApp();
  const [attachedFiles, setAttachedFiles] = useState<{[key: string]: File[]}>({});
  const [submissions, setSubmissions] = useState<{[key: string]: any}>({});
  const [summaries, setSummaries] = useState<{[key: string]: string}>({});
  const [loadingSummary, setLoadingSummary] = useState<{[key: string]: boolean}>({});
  
  const currentUserId = state.currentUser?._id || state.currentUser?.id;
  
  // Check if assignment is overdue
  const isOverdue = (dueDate: string, submitted: boolean) => {
    if (submitted) return false;
    const due = new Date(dueDate);
    const now = new Date();
    return now > due;
  };

  // Handle file attachment
  const handleFileAttach = (assignmentId: string, files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setAttachedFiles(prev => ({
        ...prev,
        [assignmentId]: [...(prev[assignmentId] || []), ...fileArray]
      }));
    }
  };

  // Handle assignment submission
  const handleSubmit = (assignmentId: string) => {
    const files = attachedFiles[assignmentId] || [];
    const submission = {
      studentId: currentUserId,
      submittedAt: new Date(),
      files: files.map(f => f.name),
      status: 'submitted'
    };
    
    setSubmissions(prev => ({
      ...prev,
      [assignmentId]: submission
    }));
    
    // Save to localStorage
    const savedSubmissions = JSON.parse(localStorage.getItem('assignmentSubmissions') || '{}');
    savedSubmissions[assignmentId] = submission;
    localStorage.setItem('assignmentSubmissions', JSON.stringify(savedSubmissions));
  };

  // Summarize assignment using Gemini API
  const summarizeAssignment = async (assignmentId: string, title: string, description: string) => {
    setLoadingSummary(prev => ({ ...prev, [assignmentId]: true }));
    
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyDhkVx7QgJzKjB8mF2nL4pR6sT9uW3vX8Y', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Please provide a concise summary of this assignment in 2-3 sentences:\n\nTitle: ${title}\n\nDescription: ${description}`
            }]
          }]
        })
      });
      
      const data = await response.json();
      const summary = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate summary';
      
      setSummaries(prev => ({ ...prev, [assignmentId]: summary }));
    } catch (error) {
      console.error('Error generating summary:', error);
      setSummaries(prev => ({ ...prev, [assignmentId]: 'Error generating summary. Please try again.' }));
    } finally {
      setLoadingSummary(prev => ({ ...prev, [assignmentId]: false }));
    }
  };

  // Load submissions on mount
  useEffect(() => {
    const savedSubmissions = JSON.parse(localStorage.getItem('assignmentSubmissions') || '{}');
    setSubmissions(savedSubmissions);
  }, []);
  
  // Get student's assigned class ID
  const getStudentClassId = () => {
    const studentId = currentUserId;
    const assignedClass = (state.classes || []).find(cls => 
      cls.studentIds && cls.studentIds.some((student: any) => {
        const id = typeof student === 'object' ? student._id || student.id : student;
        return id === studentId;
      })
    );
    return assignedClass?._id || assignedClass?.id;
  };
  
  const studentClassId = getStudentClassId();
  
  // Get assignments assigned to current student's class or directly to student
  const studentAssignments = (state.assignments || []).filter(assignment => {
    console.log('Checking assignment:', assignment.title);
    console.log('Assignment studentIds:', assignment.studentIds);
    console.log('Current user ID:', currentUserId);
    console.log('Student class ID:', studentClassId);
    
    // Check if assignment is assigned to student's class
    if ((assignment as any).classId && studentClassId) {
      const assignmentClassId = typeof (assignment as any).classId === 'object' ? 
        (assignment as any).classId._id || (assignment as any).classId.id : (assignment as any).classId;
      if (assignmentClassId === studentClassId) {
        console.log('Assignment matches student class');
        return true;
      }
    }
    
    // Check if assignment is directly assigned to student
    if (assignment.studentIds && assignment.studentIds.length > 0) {
      const isAssigned = assignment.studentIds.some(studentId => {
        const idValue = studentId as any;
        const id = typeof idValue === 'object' && idValue !== null ? (idValue._id || idValue.id) : idValue;
        console.log('Comparing:', id, 'with', currentUserId, 'match:', id === currentUserId);
        return id === currentUserId;
      });
      if (isAssigned) {
        console.log('Assignment directly assigned to student');
        return true;
      }
    }
    
    return false;
  });
  
  console.log('Student assignments found:', studentAssignments.length);

  // Get student grades for assignments
  const getStudentGrade = (assignmentId: string) => {
    const grades = JSON.parse(localStorage.getItem('studentGrades') || '{}');
    const studentGrades = grades[currentUserId as string] || {};
    return studentGrades[assignmentId];
  };

  return (
    <Container>
      <Header>
        <Title>My Assignments</Title>
        <Subtitle>View your assigned tasks and their status</Subtitle>
      </Header>

      <AssignmentsList>
        {studentAssignments.length > 0 ? (
          studentAssignments.map(assignment => {
            const grade = getStudentGrade(assignment.id);
            const submitted = submissions[assignment.id];
            const overdue = isOverdue(assignment.dueDate, !!submitted);
            const files = attachedFiles[assignment.id] || [];
            
            return (
              <AssignmentItem key={assignment.id} $isOverdue={overdue}>
                <AssignmentTitle $isOverdue={overdue}>
                  {assignment.title}
                  <SummarizeButton 
                    onClick={() => summarizeAssignment(assignment.id, assignment.title, assignment.description)}
                    disabled={loadingSummary[assignment.id]}
                  >
                    {loadingSummary[assignment.id] ? 'Summarizing...' : '✨ Summarize'}
                  </SummarizeButton>
                </AssignmentTitle>
                <AssignmentDetails $isOverdue={overdue}>{assignment.description}</AssignmentDetails>
                
                {summaries[assignment.id] && (
                  <SummaryBox>
                    <strong>AI Summary:</strong> {summaries[assignment.id]}
                  </SummaryBox>
                )}
                <AssignmentMeta>
                  <span style={{ color: overdue ? '#d32f2f' : 'inherit' }}>Due: {assignment.dueDate}</span>
                  <StatusBadge status={submitted ? 'Submitted' : overdue ? 'Overdue' : assignment.status || 'Pending'}>
                    {submitted ? 'Submitted' : overdue ? 'Overdue' : assignment.status || 'Pending'}
                  </StatusBadge>
                  {grade && (
                    <span style={{ color: '#27ae60', fontWeight: 600 }}>
                      Grade: {grade.marks}/{grade.maxMarks}
                    </span>
                  )}
                </AssignmentMeta>
                
                {!submitted && (
                  <>
                    <ButtonGroup>
                      <label htmlFor={`file-${assignment.id}`}>
                        <AttachButton as="span">
                          📎 Attach Files
                        </AttachButton>
                      </label>
                      <FileInput
                        id={`file-${assignment.id}`}
                        type="file"
                        multiple
                        onChange={(e) => handleFileAttach(assignment.id, e.target.files)}
                      />
                      <SubmitButton
                        onClick={() => handleSubmit(assignment.id)}
                        disabled={overdue}
                      >
                        {overdue ? 'Overdue' : 'Submit'}
                      </SubmitButton>
                    </ButtonGroup>
                    
                    {files.length > 0 && (
                      <AttachedFiles>
                        <strong>Attached files:</strong> {files.map(f => f.name).join(', ')}
                      </AttachedFiles>
                    )}
                  </>
                )}
                
                {submitted && (
                  <div style={{ marginTop: '10px', fontSize: '12px', color: '#4caf50' }}>
                    ✅ Submitted on {new Date(submitted.submittedAt).toLocaleDateString()}
                  </div>
                )}
              </AssignmentItem>
            );
          })
        ) : (
          <EmptyState>
            <h3>No assignments yet</h3>
            <p>Your teachers haven't assigned any tasks yet</p>
          </EmptyState>
        )}
      </AssignmentsList>
    </Container>
  );
}