import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';
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

const Title = styled.h2`
  margin: 0;
  color: #333;
`;

const CreateButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
`;

const CreateForm = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 30px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: white;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  font-size: 14px;
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
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
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
`;

const SubmitButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
`;

const FileInput = styled.input`
  display: none;
`;

const AttachmentButton = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: white;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: #8B5CF6;
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
  }
`;

const AttachedFiles = styled.div`
  margin-top: 10px;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  margin-bottom: 5px;
  font-size: 14px;
  color: white;
`;

const RemoveFile = styled.button`
  background: none;
  border: none;
  color: #ff6b6b;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;
  
  &:hover {
    color: #ff5252;
    transform: scale(1.2);
  }
`;

const CancelButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
`;

const AssignmentsList = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const AssignmentItem = styled.div`
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  
  &:last-child {
    border-bottom: none;
  }
`;

const AssignmentContent = styled.div`
  flex: 1;
`;

const UpdateButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
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
  padding: 8px 16px;
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

const AssignmentTitle = styled.h3`
  margin: 0 0 8px 0;
  color: #333;
  font-size: 18px;
`;

const AssignmentDetails = styled.div`
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
`;

const AssignmentMeta = styled.div`
  display: flex;
  gap: 20px;
  font-size: 12px;
  color: #888;
`;

const FileModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
`;

const FileContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  max-width: 90%;
  max-height: 90%;
  text-align: center;
`;

const ReviewButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const AcceptButton = styled.button`
  background: #4caf50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
`;

const RejectButton = styled.button`
  background: #f44336;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
`;

const ReassignButton = styled.button`
  background: #ff9800;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
  font-size: 12px;
`;

const FileButton = styled.button`
  background: #2196f3;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  margin: 0 2px;
`;

const SubmissionsModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const SubmissionsContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  width: 90%;
`;

const SubmissionItem = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
`;

const GradeInput = styled.input`
  width: 60px;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin: 0 5px;
`;

const GradeButton = styled.button`
  background: #4caf50;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
`;

const ViewButton = styled.button`
  background: #2196f3;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  margin-left: 8px;
  
  &:hover {
    background: #1976d2;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
`;

export default function TeacherAssignments() {
  const { state, dispatch } = useApp();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<any>(null);
  const [viewingSubmissions, setViewingSubmissions] = useState<any>(null);
  const [viewingFile, setViewingFile] = useState<string | null>(null);
  const [submissionReviews, setSubmissionReviews] = useState<any>({});
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [allClasses, setAllClasses] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any>({});
  const [assignments, setAssignments] = useState([
    {
      id: '1',
      title: 'Mathematics Quiz - Chapter 5',
      description: 'Complete the quiz on algebraic equations',
      dueDate: '2024-01-20',
      classes: 'Grade 10A, Grade 9B',
      status: 'Active'
    }
  ]);

  // Load submissions and reviews on mount
  useEffect(() => {
    const savedSubmissions = JSON.parse(localStorage.getItem('assignmentSubmissions') || '{}');
    const savedReviews = JSON.parse(localStorage.getItem('submissionReviews') || '{}');
    setSubmissions(savedSubmissions);
    setSubmissionReviews(savedReviews);
  }, []);

  // Reassign assignment to student
  const handleReassignToStudent = (assignmentId: string, studentId: string) => {
    // Remove the student's submission
    const newSubmissions = { ...submissions };
    delete newSubmissions[assignmentId];
    setSubmissions(newSubmissions);
    localStorage.setItem('assignmentSubmissions', JSON.stringify(newSubmissions));
    
    // Remove the review status
    const reviewKey = `${assignmentId}-${studentId}`;
    const newReviews = { ...submissionReviews };
    delete newReviews[reviewKey];
    setSubmissionReviews(newReviews);
    localStorage.setItem('submissionReviews', JSON.stringify(newReviews));
    
    // Remove the grade
    const grades = JSON.parse(localStorage.getItem('studentGrades') || '{}');
    if (grades[studentId] && grades[studentId][assignmentId]) {
      delete grades[studentId][assignmentId];
      localStorage.setItem('studentGrades', JSON.stringify(grades));
    }
    
    alert('Assignment reassigned to student. They can now resubmit.');
  };

  // Handle submission review (accept/reject)
  const handleSubmissionReview = (assignmentId: string, studentId: string, action: 'accept' | 'reject') => {
    const reviewKey = `${assignmentId}-${studentId}`;
    const newReviews = {
      ...submissionReviews,
      [reviewKey]: { action, reviewedAt: new Date() }
    };
    setSubmissionReviews(newReviews);
    localStorage.setItem('submissionReviews', JSON.stringify(newReviews));
  };

  // Check if submission is reviewed
  const getSubmissionReview = (assignmentId: string, studentId: string) => {
    const reviewKey = `${assignmentId}-${studentId}`;
    return submissionReviews[reviewKey];
  };

  // Grade student submission
  const handleGradeSubmission = (assignmentId: string, studentId: string, marks: number, maxMarks: number) => {
    const grades = JSON.parse(localStorage.getItem('studentGrades') || '{}');
    if (!grades[studentId]) grades[studentId] = {};
    grades[studentId][assignmentId] = { marks, maxMarks };
    localStorage.setItem('studentGrades', JSON.stringify(grades));
    alert('Grade saved successfully!');
  };

  // Load all classes data when component mounts
  useEffect(() => {
    const loadClasses = async () => {
      try {
        const classes = await apiService.getClasses();
        setAllClasses(classes);
      } catch (error) {
        console.error('Failed to load classes:', error);
      }
    };
    
    loadClasses();
  }, []);

  const currentUserId = state.currentUser?._id || state.currentUser?.id;
  
  // Get class where teacher is class teacher (homeroom)
  const homeroomClass = state.classes?.find(cls => {
    if (!cls || !cls.teacherId) return false;
    const teacherId = typeof cls.teacherId === 'object' ? 
      (cls.teacherId._id || cls.teacherId.id) : cls.teacherId;
    return teacherId === currentUserId;
  });

  // Get all classes where teacher teaches (including homeroom)
  const teachingClasses = state.classes?.filter(cls => {
    if (!cls || !cls.teacherId) return false;
    const teacherId = typeof cls.teacherId === 'object' ? 
      (cls.teacherId._id || cls.teacherId.id) : cls.teacherId;
    return teacherId === currentUserId;
  }) || [];

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles([...attachedFiles, ...files]);
  };

  const removeFile = (index: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const selectedClassIds = formData.getAll('classIds') as string[];
    const selectedClasses = allClasses.filter(cls => 
      selectedClassIds.includes((cls._id || cls.id) as string)
    );
    
    if (editingAssignment) {
      // Update existing assignment
      const updatedAssignment = {
        ...editingAssignment,
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        dueDate: formData.get('dueDate') as string,
        classes: selectedClasses.map(cls => cls.name).join(', '),
        classId: selectedClasses.length === 1 ? (selectedClasses[0]._id || selectedClasses[0].id) : null,
        classIds: selectedClasses.map(cls => cls._id || cls.id),
        studentIds: selectedClasses.flatMap(cls => {
          console.log('Class:', cls.name, 'studentIds:', cls.studentIds);
          return (cls.studentIds || []).map((studentId: any) => {
            const id = typeof studentId === 'object' && studentId !== null ? 
              (studentId._id || studentId.id) : studentId;
            console.log('Extracted student ID:', id);
            return id;
          });
        })
      };
      setAssignments(assignments.map(a => a.id === editingAssignment.id ? updatedAssignment : a));
      
      // Update in context
      dispatch({ type: 'UPDATE_ASSIGNMENT', payload: updatedAssignment });
    } else {
      // Create new assignment
      const newAssignment = {
        id: Date.now().toString(),
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        dueDate: formData.get('dueDate') as string,
        classes: selectedClasses.map(cls => cls.name).join(', '),
        status: 'Active',
        teacherId: state.currentUser?.id || state.currentUser?._id || '',
        classId: selectedClasses.length === 1 ? (selectedClasses[0]._id || selectedClasses[0].id) : null,
        classIds: selectedClasses.map(cls => cls._id || cls.id),
        studentIds: selectedClasses.flatMap(cls => {
          console.log('Class:', cls.name, 'studentIds:', cls.studentIds);
          return (cls.studentIds || []).map((studentId: any) => {
            const id = typeof studentId === 'object' && studentId !== null ? 
              (studentId._id || studentId.id) : studentId;
            console.log('Extracted student ID:', id);
            return id;
          });
        }),
        submissions: []
      };
      
      console.log('New assignment created:', newAssignment);
      setAssignments([...assignments, newAssignment]);
      
      // Add to context
      dispatch({ type: 'ADD_ASSIGNMENT', payload: newAssignment });
    }
    
    // Send notice to all students in selected classes
    const notice = {
      id: Date.now().toString(),
      title: `${editingAssignment ? 'Updated' : 'New'} Assignment: ${formData.get('title')}`,
      content: `Assignment "${formData.get('title')}" has been ${editingAssignment ? 'updated' : 'posted'}. Due date: ${formData.get('dueDate')}`,
      createdBy: state.currentUser?.id || state.currentUser?._id || '',
      createdAt: new Date(),
      targetRoles: ['student' as const]
    };
    dispatch({ type: 'ADD_NOTICE', payload: notice });
    
    setShowCreateForm(false);
    setEditingAssignment(null);
    setAttachedFiles([]);
  };

  return (
    <Container>
      <Header>
        <Title>My Assignments</Title>
        <CreateButton onClick={() => {
          setEditingAssignment(null);
          setShowCreateForm(true);
        }}>
          <span>➕</span>
          Create Assignment
        </CreateButton>
      </Header>

      {showCreateForm && (
        <CreateForm>
          <form onSubmit={handleCreateAssignment}>
            <FormGroup>
              <Label>Assignment Title</Label>
              <Input name="title" type="text" defaultValue={editingAssignment?.title || ''} required />
            </FormGroup>
            
            <FormGroup>
              <Label>Description</Label>
              <TextArea name="description" defaultValue={editingAssignment?.description || ''} required />
            </FormGroup>
            
            <FormGroup>
              <Label>Due Date</Label>
              <Input name="dueDate" type="date" defaultValue={editingAssignment?.dueDate || ''} required />
            </FormGroup>
            
            <FormGroup>
              <Label>Share with Classes</Label>
              <div>
                {allClasses.map(cls => (
                  <label key={(cls._id || cls.id) as string} style={{ display: 'block', marginBottom: '8px', color: 'white' }}>
                    <input 
                      type="checkbox" 
                      name="classIds" 
                      value={(cls._id || cls.id) as string}
                      defaultChecked={homeroomClass && (cls._id || cls.id) === (homeroomClass._id || homeroomClass.id)}
                      style={{ marginRight: '8px' }}
                    />
                    {cls.name} - {cls.grade} {homeroomClass && (cls._id || cls.id) === (homeroomClass._id || homeroomClass.id) ? '(Homeroom)' : ''}
                  </label>
                ))}
              </div>
            </FormGroup>
            
            <FormGroup>
              <Label>Attachments</Label>
              <AttachmentButton htmlFor="file-upload">
                <span>📎</span>
                Attach Files
              </AttachmentButton>
              <FileInput
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileAttach}
              />
              {attachedFiles.length > 0 && (
                <AttachedFiles>
                  {attachedFiles.map((file, index) => (
                    <FileItem key={index}>
                      <span>{file.name}</span>
                      <RemoveFile onClick={() => removeFile(index)}>×</RemoveFile>
                    </FileItem>
                  ))}
                </AttachedFiles>
              )}
            </FormGroup>
            
            <ButtonGroup>
              <CancelButton type="button" onClick={() => {
                setShowCreateForm(false);
                setEditingAssignment(null);
              }}>
                Cancel
              </CancelButton>
              <SubmitButton type="submit">
                {editingAssignment ? 'Update Assignment' : 'Create & Assign'}
              </SubmitButton>
            </ButtonGroup>
          </form>
        </CreateForm>
      )}

      <AssignmentsList>
        {assignments.length > 0 ? (
          assignments.map(assignment => (
            <AssignmentItem key={assignment.id}>
              <AssignmentContent>
                <AssignmentTitle>{assignment.title}</AssignmentTitle>
                <AssignmentDetails>{assignment.description}</AssignmentDetails>
                <AssignmentMeta>
                  <span>Due: {assignment.dueDate}</span>
                  <span>Classes: {assignment.classes}</span>
                  <span>Status: {assignment.status}</span>
                </AssignmentMeta>
              </AssignmentContent>
              <AssignmentButtonGroup>
                <UpdateButton onClick={() => {
                  setEditingAssignment(assignment);
                  setShowCreateForm(true);
                }}>
                  Update
                </UpdateButton>
                <ViewButton onClick={() => setViewingSubmissions(assignment)}>
                  View Submissions
                </ViewButton>
                <DeleteButton onClick={() => {
                  if (window.confirm(`Are you sure you want to delete "${assignment.title}"?`)) {
                    setAssignments(assignments.filter(a => a.id !== assignment.id));
                  }
                }}>
                  Delete
                </DeleteButton>
              </AssignmentButtonGroup>
            </AssignmentItem>
          ))
        ) : (
          <EmptyState>
            <h3>No assignments yet</h3>
            <p>Click "Create Assignment" to get started</p>
          </EmptyState>
        )}
      </AssignmentsList>
      
      {viewingSubmissions && (
        <SubmissionsModal onClick={() => setViewingSubmissions(null)}>
          <SubmissionsContent onClick={(e) => e.stopPropagation()}>
            <h3>Submissions for: {viewingSubmissions.title}</h3>
            <button onClick={() => setViewingSubmissions(null)} style={{ float: 'right', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
            
            {Object.entries(submissions).filter(([assignmentId]) => assignmentId === viewingSubmissions.id).length > 0 ? (
              Object.entries(submissions)
                .filter(([assignmentId]) => assignmentId === viewingSubmissions.id)
                .map(([assignmentId, submission]: [string, any]) => {
                  const student = state.users?.find(u => u.id === submission.studentId || u._id === submission.studentId);
                  const review = getSubmissionReview(assignmentId, submission.studentId);
                  return (
                    <SubmissionItem key={submission.studentId}>
                      <h4>{student?.name || 'Unknown Student'}</h4>
                      <p>Submitted: {new Date(submission.submittedAt).toLocaleString()}</p>
                      <p>Files: {submission.files.map((fileName: string, index: number) => (
                        <FileButton key={index} onClick={() => setViewingFile(fileName)}>
                          {fileName}
                        </FileButton>
                      ))}</p>
                      
                      {review && (
                        <p style={{ color: review.action === 'accept' ? '#4caf50' : '#f44336', fontWeight: 'bold' }}>
                          Status: {review.action === 'accept' ? 'Accepted' : 'Rejected'}
                        </p>
                      )}
                      
                      {review?.action === 'accept' ? (
                        <div style={{ marginTop: '10px' }}>
                          <span>Grade: </span>
                          <GradeInput 
                            type="number" 
                            placeholder="Marks"
                            id={`marks-${submission.studentId}`}
                          />
                          <span> / </span>
                          <GradeInput 
                            type="number" 
                            placeholder="Max"
                            defaultValue="100"
                            id={`max-${submission.studentId}`}
                          />
                          <GradeButton onClick={() => {
                            const marks = (document.getElementById(`marks-${submission.studentId}`) as HTMLInputElement).value;
                            const maxMarks = (document.getElementById(`max-${submission.studentId}`) as HTMLInputElement).value;
                            if (marks && maxMarks) {
                              handleGradeSubmission(assignmentId, submission.studentId, parseInt(marks), parseInt(maxMarks));
                            }
                          }}>
                            Save Grade
                          </GradeButton>
                          <ReassignButton onClick={() => {
                            if (window.confirm('Are you sure you want to reassign this assignment? This will remove the current submission and grade.')) {
                              handleReassignToStudent(assignmentId, submission.studentId);
                            }
                          }}>
                            Reassign
                          </ReassignButton>
                        </div>
                      ) : (
                        <p style={{ color: '#666', fontStyle: 'italic' }}>
                          {review?.action === 'reject' ? 'Submission rejected - cannot grade' : 'Review submission to enable grading'}
                        </p>
                      )}
                    </SubmissionItem>
                  );
                })
            ) : (
              <p>No submissions yet for this assignment.</p>
            )}
          </SubmissionsContent>
        </SubmissionsModal>
      )}
      
      {viewingFile && (
        <FileModal onClick={() => setViewingFile(null)}>
          <FileContent onClick={(e) => e.stopPropagation()}>
            <h3>Viewing: {viewingFile}</h3>
            <p>File content preview would appear here</p>
            <p style={{ color: '#666', fontSize: '14px' }}>In a real application, this would show the actual file content</p>
            
            <ReviewButtons>
              <AcceptButton onClick={() => {
                const submission = Object.entries(submissions).find(([_, sub]: [string, any]) => 
                  sub.files.includes(viewingFile)
                );
                if (submission) {
                  const [assignmentId, sub] = submission as [string, any];
                  handleSubmissionReview(assignmentId, sub.studentId, 'accept');
                  setViewingFile(null);
                }
              }}>
                Accept Submission
              </AcceptButton>
              <RejectButton onClick={() => {
                const submission = Object.entries(submissions).find(([_, sub]: [string, any]) => 
                  sub.files.includes(viewingFile)
                );
                if (submission) {
                  const [assignmentId, sub] = submission as [string, any];
                  handleSubmissionReview(assignmentId, sub.studentId, 'reject');
                  setViewingFile(null);
                }
              }}>
                Reject Submission
              </RejectButton>
            </ReviewButtons>
            
            <button onClick={() => setViewingFile(null)} style={{ marginTop: '15px', background: '#666', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
              Close
            </button>
          </FileContent>
        </FileModal>
      )}
    </Container>
  );
}