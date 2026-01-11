import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';
import { Class, ScheduleEntry } from '../types';
import apiService from '../services/api';

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
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitle = styled.h3`
  margin: 0;
  color: #333;
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const Card = styled.div`
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  background: #f8f9fa;
`;

const CardTitle = styled.h4`
  margin: 0 0 10px 0;
  color: #333;
`;

const CardInfo = styled.div`
  color: #666;
  font-size: 14px;
  margin-bottom: 15px;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
`;

const AssignButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background: #218838;
  }
`;

const EditButton = styled.button`
  background: #f39c12;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-left: 10px;
  
  &:hover {
    background: #e67e22;
  }
`;

const DeleteButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-left: 10px;
  
  &:hover {
    background: #c0392b;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  align-items: center;
  padding: 0 20px;
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
  max-width: 500px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
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

export default function AdminClassAssignment() {
  const { state, dispatch } = useApp();
  const [showClassModal, setShowClassModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<{ [key: string]: string }>({});
  const [classForm, setClassForm] = useState({ name: '', grade: '', teacherId: '' });
  const [scheduleForm, setScheduleForm] = useState({
    classId: '',
    subject: '',
    day: '',
    startTime: '',
    endTime: '',
    teacherId: '',
    grade: ''
  });
  const [subjectFilter, setSubjectFilter] = useState('');
  const [teacherFilter, setTeacherFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [gradeSortOrder, setGradeSortOrder] = useState<'asc' | 'desc'>('asc');

  const teachers = state.users.filter(user => user.role === 'teacher');
  const students = state.users.filter(user => user.role === 'student');

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [classes, schedules, users] = await Promise.all([
          apiService.getClasses(),
          apiService.getSchedules(),
          apiService.getUsers()
        ]);
        dispatch({ type: 'SET_CLASSES', payload: classes });
        dispatch({ type: 'SET_SCHEDULES', payload: schedules });
        dispatch({ type: 'SET_USERS', payload: users });
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    loadData();
  }, [dispatch]);

  const handleAssignTeacher = async (classId: string) => {
    const teacherId = selectedTeacher[classId];
    if (teacherId) {
      try {
        await apiService.assignTeacherToClass(classId, teacherId);
        dispatch({ type: 'ASSIGN_TEACHER_TO_CLASS', payload: { classId, teacherId } });
        // Clear the selection
        setSelectedTeacher({ ...selectedTeacher, [classId]: '' });
      } catch (error) {
        alert('Failed to assign teacher');
      }
    }
  };

  const handleDeleteClass = async (classId: string) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await apiService.deleteClass(classId);
        dispatch({ type: 'DELETE_CLASS', payload: classId });
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete class');
      }
    }
  };

  const handleEditClass = (classItem: any) => {
    console.log('Editing class:', classItem);
    setEditingClass(classItem);
    const teacherId = classItem.teacherId?._id || classItem.teacherId?.id || classItem.teacherId || '';
    console.log('Setting teacher ID:', teacherId);
    setClassForm({ 
      name: classItem.name, 
      grade: classItem.grade,
      teacherId: teacherId
    });
    setShowClassModal(true);
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Check if teacher is already assigned to another class
      if (classForm.teacherId) {
        const isTeacherAssigned = state.classes.some(cls => {
          const classId = cls._id || cls.id;
          const editingId = editingClass ? (editingClass._id || editingClass.id) : null;
          const teacherId = typeof cls.teacherId === 'object' ? cls.teacherId._id || cls.teacherId.id : cls.teacherId;
          return teacherId === classForm.teacherId && classId !== editingId;
        });
        
        if (isTeacherAssigned) {
          const teacher = state.users.find(u => (u._id || u.id) === classForm.teacherId);
          alert(`Teacher ${teacher?.name || teacher?.username} is already assigned to another class. Each teacher can only be assigned to one class.`);
          return;
        }
      }
      
      const formData = {
        name: classForm.name,
        grade: classForm.grade,
        teacherId: classForm.teacherId || null
      };
      
      if (editingClass && (editingClass._id || editingClass.id)) {
        const classId = editingClass._id || editingClass.id;
        console.log('Updating class with ID:', classId, 'Data:', formData);
        const updatedClass = await apiService.updateClass(classId, formData);
        dispatch({ type: 'UPDATE_CLASS', payload: { ...updatedClass, _id: classId, id: classId } });
      } else {
        const newClass = await apiService.createClass(formData);
        // Ensure the teacher data is properly populated
        if (newClass.teacherId && typeof newClass.teacherId === 'string') {
          const teacher = state.users.find(u => (u._id || u.id) === newClass.teacherId);
          if (teacher) {
            newClass.teacherId = teacher;
          }
        }
        dispatch({ type: 'ADD_CLASS', payload: newClass });
      }
      setShowClassModal(false);
      setClassForm({ name: '', grade: '', teacherId: '' });
      setEditingClass(null);
    } catch (error) {
      console.error('Class save error:', error);
      console.error('Error details:', {
        editingClass,
        classForm
      });
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`Failed to save class: ${errorMessage}`);
    }
  };

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Creating schedule with form data:', scheduleForm);
      const newSchedule = await apiService.createSchedule(scheduleForm);
      console.log('Created schedule:', newSchedule);
      dispatch({ type: 'ADD_SCHEDULE', payload: newSchedule });
      
      // Automatically create teacher schedule entry
      const teacherSchedule = {
        ...newSchedule,
        id: `teacher-${newSchedule.id || Date.now()}`,
        _id: `teacher-${newSchedule._id || Date.now()}`,
        type: 'teacher' // Mark as teacher schedule
      };
      dispatch({ type: 'ADD_SCHEDULE', payload: teacherSchedule });
      
      setShowScheduleModal(false);
      setScheduleForm({ classId: '', subject: '', day: '', startTime: '', endTime: '', teacherId: '', grade: '' });
    } catch (error) {
      console.error('Schedule creation error:', error);
      alert('Failed to create schedule');
    }
  };

  const getTeacherName = (teacherData: any) => {
    if (!teacherData) return 'Not assigned';
    
    // If teacherData is populated object
    if (typeof teacherData === 'object' && (teacherData.name || teacherData.username)) {
      return teacherData.name || teacherData.username;
    }
    
    // If teacherData is just an ID, find in users array
    if (typeof teacherData === 'string' && teacherData.trim() !== '') {
      const teacher = teachers.find(u => (u._id || u.id) === teacherData);
      return teacher?.name || teacher?.username || 'Not assigned';
    }
    
    return 'Not assigned';
  };

  const getClassSchedules = (classId: string) => {
    console.log('Getting schedules for class:', classId);
    console.log('All schedules:', state.schedules);
    const classSchedules = state.schedules.filter(s => {
      const scheduleClassId = s.classId;
      console.log('Comparing:', scheduleClassId, 'with', classId);
      return scheduleClassId === classId;
    });
    console.log('Found schedules:', classSchedules);
    return classSchedules;
  };

  const filteredClasses = state.classes.filter(classItem => {
    const schedules = getClassSchedules((classItem._id || classItem.id) as string);
    
    if (subjectFilter && !schedules.some(s => s.subject.toLowerCase().includes(subjectFilter.toLowerCase()))) {
      return false;
    }
    
    if (teacherFilter && !schedules.some(s => {
      const teacherName = getTeacherName(s.teacherId);
      return teacherName.toLowerCase().includes(teacherFilter.toLowerCase());
    })) {
      return false;
    }
    
    if (classFilter && !classItem.name.toLowerCase().includes(classFilter.toLowerCase())) {
      return false;
    }
    
    if (gradeFilter && !classItem.grade.toLowerCase().includes(gradeFilter.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const uniqueSubjects = Array.from(new Set(state.schedules.map(s => s.subject)));

  return (
    <Container>
      <Section>
        <SectionHeader>
          <SectionTitle>Class Management</SectionTitle>
          <AddButton onClick={() => {
            setEditingClass(null);
            setClassForm({ name: '', grade: '', teacherId: '' });
            setShowClassModal(true);
          }}>+ Create Class</AddButton>
        </SectionHeader>
        <FilterContainer>
          <FilterLabel>
            Grade:
            <FilterSelect value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)}>
              <option value="">All Grades</option>
              {Array.from(new Set(state.classes.map(c => c.grade))).map(grade => (
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
        <Grid>
          {state.classes
            .filter(classItem => gradeFilter === '' || classItem.grade === gradeFilter)
            .sort((a, b) => {
              if (gradeFilter) {
                const gradeA = a.grade.toLowerCase();
                const gradeB = b.grade.toLowerCase();
                return gradeSortOrder === 'asc' ? gradeA.localeCompare(gradeB) : gradeB.localeCompare(gradeA);
              }
              return 0;
            })
            .map(classItem => (
            <Card key={classItem._id || classItem.id}>
              <CardTitle>{classItem.name}</CardTitle>
              <CardInfo>
                Grade: {classItem.grade}<br/>
                Students: {(classItem.studentIds || []).length}<br/>
                Teacher: {getTeacherName(classItem.teacherId)}
              </CardInfo>
              <div style={{ marginTop: '15px' }}>
                <EditButton onClick={() => handleEditClass(classItem)}>
                  Edit Class
                </EditButton>
                <DeleteButton onClick={() => handleDeleteClass((classItem._id || classItem.id) as string)}>
                  Delete Class
                </DeleteButton>
              </div>
            </Card>
          ))}
        </Grid>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Schedule Management</SectionTitle>
          <AddButton onClick={() => setShowScheduleModal(true)}>+ Add Schedule</AddButton>
        </SectionHeader>
        <FilterContainer>
          <FilterLabel>
            Subject:
            <FilterSelect value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}>
              <option value="">All Subjects</option>
              {uniqueSubjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </FilterSelect>
          </FilterLabel>
          <FilterLabel>
            Teacher:
            <FilterSelect value={teacherFilter} onChange={(e) => setTeacherFilter(e.target.value)}>
              <option value="">All Teachers</option>
              {teachers.map(teacher => (
                <option key={(teacher._id || teacher.id) as string} value={teacher.name || teacher.username}>
                  {teacher.name || teacher.username}
                </option>
              ))}
            </FilterSelect>
          </FilterLabel>
          <FilterLabel>
            Class:
            <FilterSelect value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
              <option value="">All Classes</option>
              {state.classes.map(cls => (
                <option key={(cls._id || cls.id) as string} value={cls.name}>{cls.name}</option>
              ))}
            </FilterSelect>
          </FilterLabel>
          <FilterLabel>
            Grade:
            <FilterSelect value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)}>
              <option value="">All Grades</option>
              {Array.from(new Set(state.classes.map(c => c.grade))).map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </FilterSelect>
          </FilterLabel>
        </FilterContainer>
        <Grid>
          {filteredClasses.map(classItem => {
            const schedules = getClassSchedules((classItem._id || classItem.id) as string);
            const groupedSchedules = schedules.reduce((acc, schedule) => {
              const key = `${schedule.day}-${schedule.teacherId}`;
              if (!acc[key]) {
                acc[key] = [];
              }
              acc[key].push(schedule);
              return acc;
            }, {} as { [key: string]: any[] });
            
            return (
              <Card key={(classItem._id || classItem.id) as string}>
                <CardTitle>{classItem.name} Schedule</CardTitle>
                {Object.keys(groupedSchedules).length === 0 ? (
                  <CardInfo>No schedule assigned</CardInfo>
                ) : (
                  Object.entries(groupedSchedules).map(([key, scheduleGroup]) => (
                    <div key={key}>
                      <CardInfo style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                        {scheduleGroup[0].day} - {getTeacherName(scheduleGroup[0].teacherId)}
                      </CardInfo>
                      {scheduleGroup.map(schedule => (
                        <CardInfo key={(schedule._id || schedule.id) as string} style={{ marginLeft: '10px' }}>
                          {schedule.subject}: {schedule.startTime} - {schedule.endTime}
                        </CardInfo>
                      ))}
                    </div>
                  ))
                )}
              </Card>
            );
          })}
        </Grid>
      </Section>

      {showClassModal && (
        <Modal>
          <ModalContent>
            <h3>{editingClass ? 'Edit Class' : 'Create New Class'}</h3>
            <Form onSubmit={handleCreateClass}>
              <Input
                type="text"
                placeholder="Class Name (e.g., Class A)"
                value={classForm.name}
                onChange={(e) => setClassForm({...classForm, name: e.target.value})}
                required
              />
              <Select
                value={classForm.grade}
                onChange={(e) => setClassForm({...classForm, grade: e.target.value})}
                required
              >
                <option value="">Select Grade</option>
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
              </Select>
              <Select
                value={classForm.teacherId}
                onChange={(e) => {
                  console.log('Teacher selected:', e.target.value);
                  setClassForm({...classForm, teacherId: e.target.value});
                }}
              >
                <option value="">Select Teacher (Optional)</option>
                {teachers.map(teacher => (
                  <option key={(teacher._id || teacher.id) as string} value={(teacher._id || teacher.id) as string}>
                    {teacher.name || teacher.username}
                  </option>
                ))}
              </Select>
              <ButtonGroup>
                <Button type="button" variant="secondary" onClick={() => {
                  setShowClassModal(false);
                  setEditingClass(null);
                  setClassForm({ name: '', grade: '', teacherId: '' });
                }}>
                  Cancel
                </Button>
                <Button type="submit">{editingClass ? 'Update Class' : 'Create Class'}</Button>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}

      {showScheduleModal && (
        <Modal>
          <ModalContent>
            <h3>Add Schedule</h3>
            <Form onSubmit={handleCreateSchedule}>
              <Select
                value={scheduleForm.grade}
                onChange={(e) => {
                  setScheduleForm({...scheduleForm, grade: e.target.value, classId: ''});
                }}
                required
              >
                <option value="">Select Grade</option>
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
              </Select>
              <Select
                value={scheduleForm.classId}
                onChange={(e) => setScheduleForm({...scheduleForm, classId: e.target.value})}
                required
                disabled={!scheduleForm.grade}
              >
                <option value="">Select Class</option>
                {(() => {
                  const filteredClasses = state.classes.filter(cls => cls.grade === scheduleForm.grade);
                  console.log('Selected grade:', scheduleForm.grade);
                  console.log('All classes:', state.classes.map(c => ({ name: c.name, grade: c.grade })));
                  console.log('Filtered classes:', filteredClasses);
                  return filteredClasses.map(cls => (
                    <option key={(cls._id || cls.id) as string} value={(cls._id || cls.id) as string}>{cls.name}</option>
                  ));
                })()}
              </Select>
              <Input
                type="text"
                placeholder="Subject"
                value={scheduleForm.subject}
                onChange={(e) => setScheduleForm({...scheduleForm, subject: e.target.value})}
                required
              />
              <Select
                value={scheduleForm.day}
                onChange={(e) => setScheduleForm({...scheduleForm, day: e.target.value})}
                required
              >
                <option value="">Select Day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
              </Select>
              <Input
                type="time"
                value={scheduleForm.startTime}
                onChange={(e) => setScheduleForm({...scheduleForm, startTime: e.target.value})}
                required
              />
              <Input
                type="time"
                value={scheduleForm.endTime}
                onChange={(e) => setScheduleForm({...scheduleForm, endTime: e.target.value})}
                required
              />
              <Select
                value={scheduleForm.teacherId}
                onChange={(e) => setScheduleForm({...scheduleForm, teacherId: e.target.value})}
                required
              >
                <option value="">Select Teacher</option>
                {teachers.map(teacher => (
                  <option key={(teacher._id || teacher.id) as string} value={(teacher._id || teacher.id) as string}>
                    {teacher.name || teacher.username}
                  </option>
                ))}
              </Select>
              <ButtonGroup>
                <Button type="button" variant="secondary" onClick={() => setShowScheduleModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Schedule</Button>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}