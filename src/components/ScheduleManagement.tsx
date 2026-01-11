import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Class, User, ScheduleEntry } from '../types';
import apiService from '../services/api';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.h2`
  color: white;
  margin-bottom: 30px;
`;

const FormSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  margin-bottom: 30px;
  
  h3, h4 {
    color: white;
    margin-bottom: 20px;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 5px;
  color: white;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
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
  }
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
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
  }
`;

const WeeklyScheduleGrid = styled.div`
  display: grid;
  grid-template-columns: 120px repeat(6, 1fr);
  gap: 10px;
  margin: 20px 0;
  align-items: center;
`;

const DayHeader = styled.div`
  font-weight: bold;
  text-align: center;
  padding: 10px;
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 4px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const TimeSlot = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const TimeInput = styled.input`
  padding: 5px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  font-size: 12px;
  width: 80px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  
  &:focus {
    border-color: #8B5CF6;
    outline: none;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CheckBox = styled.input`
  margin-right: 5px;
  transform: scale(1.2);
  accent-color: #EC4899;
`;

const Button = styled.button`
  background: linear-gradient(45deg, #8B5CF6, #EC4899);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 40px rgba(139, 92, 246, 0.4);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
`;

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
`;

const ConflictItem = styled.div`
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  padding: 10px;
  margin: 5px 0;
  border-radius: 4px;
`;

const ScheduleList = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  margin-bottom: 30px;
  
  h3 {
    color: white;
    margin-bottom: 20px;
  }
  
  p {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const FilterSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const ScheduleTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
`;

const TableHeader = styled.th`
  background: rgba(139, 92, 246, 0.2);
  padding: 12px;
  text-align: left;
  border-bottom: 2px solid rgba(139, 92, 246, 0.3);
  font-weight: 600;
  color: white;
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
`;

const TableRow = styled.tr`
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const ActionButton = styled.button`
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
  
  &.delete {
    background: #dc3545;
    
    &:hover {
      background: #c82333;
    }
  }
`;

interface WeeklyScheduleEntry {
  day: string;
  startTime: string;
  endTime: string;
  enabled: boolean;
}

const TIME_SLOTS = [
  '09:30-10:30', '10:30-11:30', '11:30-12:30',
  '13:00-14:00', '14:00-15:00'
];

const ScheduleViewer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  margin-bottom: 30px;
  
  h4 {
    color: white;
    margin-bottom: 15px;
  }
  
  .lunch-break {
    background: #fff3cd;
    color: #856404;
    text-align: center;
    padding: 10px;
    margin: 10px 0;
    border-radius: 4px;
    font-weight: bold;
  }
`;

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ScheduleManagement: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [subject, setSubject] = useState('');
  const [academicYear, setAcademicYear] = useState(new Date().getFullYear().toString());
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklyScheduleEntry[]>(
    DAYS.map(day => ({ day, startTime: '09:30', endTime: '10:30', enabled: false }))
  );
  const [schedules, setSchedules] = useState<ScheduleEntry[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<ScheduleEntry[]>([]);
  const [filterTeacher, setFilterTeacher] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterDay, setFilterDay] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleEntry | null>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teacherSubjects, setTeacherSubjects] = useState<any[]>([]);

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
    fetchSchedules();
    fetchSubjects();
  }, []);

  const fetchSchedules = async () => {
    try {
      const data = await apiService.getSchedules();
      setSchedules(data);
      setFilteredSchedules(data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  // Filter schedules based on selected filters
  useEffect(() => {
    let filtered = schedules;
    
    if (filterTeacher) {
      filtered = filtered.filter(schedule => {
        const teacherId = typeof schedule.teacherId === 'object' ? (schedule.teacherId as any)._id : schedule.teacherId;
        return teacherId === filterTeacher;
      });
    }
    
    if (filterClass) {
      filtered = filtered.filter(schedule => {
        const classId = typeof schedule.classId === 'object' ? (schedule.classId as any)._id : schedule.classId;
        return classId === filterClass;
      });
    }
    
    if (filterDay) {
      filtered = filtered.filter(schedule => schedule.day === filterDay);
    }
    
    if (filterSubject) {
      filtered = filtered.filter(schedule => schedule.subject.toLowerCase().includes(filterSubject.toLowerCase()));
    }
    
    setFilteredSchedules(filtered);
  }, [schedules, filterTeacher, filterClass, filterDay, filterSubject]);

  const fetchSubjects = async () => {
    try {
      const data = await apiService.getSubjects();
      setSubjects(data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  // Update teacher subjects when selected teacher changes
  useEffect(() => {
    if (selectedTeacher) {
      const assignedSubjects = subjects.filter(subject => 
        subject.teacherId === selectedTeacher
      );
      setTeacherSubjects(assignedSubjects);
    } else {
      setTeacherSubjects([]);
    }
  }, [selectedTeacher, subjects]);

  const fetchClasses = async () => {
    try {
      const data = await apiService.getClasses();
      setClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const data = await apiService.getUsers();
      setTeachers(data.filter((user: User) => user.role === 'teacher'));
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const handleEdit = (schedule: ScheduleEntry) => {
    setEditingSchedule(schedule);
    setSelectedClass(typeof schedule.classId === 'object' ? (schedule.classId as any)._id : schedule.classId);
    setSelectedTeacher(typeof schedule.teacherId === 'object' ? (schedule.teacherId as any)._id : schedule.teacherId);
    setSubject(schedule.subject);
  };

  const handleDeleteAll = async () => {
    console.log('Delete all button clicked, schedules count:', schedules.length);
    if (window.confirm('Are you sure you want to delete ALL schedules? This action cannot be undone.')) {
      try {
        console.log('Calling delete all API...');
        const result = await apiService.deleteAllSchedules();
        console.log('Delete all result:', result);
        // Clear local state
        setSchedules([]);
        setFilteredSchedules([]);
        setMessage(result.message || 'All schedules deleted successfully');
      } catch (error: any) {
        console.error('Error deleting all schedules:', error);
        setError(error.message || 'Failed to delete all schedules');
      }
    }
  };

  const handleDelete = async (scheduleId: string) => {
    console.log('Attempting to delete schedule:', scheduleId);
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        console.log('Calling API to delete schedule...');
        await apiService.deleteSchedule(scheduleId);
        console.log('Schedule deleted successfully from API');
        // Update local state immediately for instant UI feedback
        setSchedules(prev => prev.filter(schedule => schedule._id !== scheduleId));
        setFilteredSchedules(prev => prev.filter(schedule => schedule._id !== scheduleId));
        setMessage('Schedule deleted successfully');
      } catch (error: any) {
        console.error('Error deleting schedule:', error);
        setError(error.message || 'Failed to delete schedule');
      }
    }
  };

  const handleScheduleChange = (index: number, field: keyof WeeklyScheduleEntry, value: string | boolean) => {
    const updated = [...weeklySchedule];
    updated[index] = { ...updated[index], [field]: value };
    setWeeklySchedule(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !selectedTeacher || !subject) {
      setError('Please fill in all required fields');
      return;
    }

    const enabledSchedules = weeklySchedule.filter(s => s.enabled);
    if (enabledSchedules.length === 0) {
      setError('Please select at least one day for the schedule');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');
    setConflicts([]);

    try {
      const response = await apiService.createWeeklySchedule({
        classId: selectedClass,
        teacherId: selectedTeacher,
        subject,
        academicYear,
        weeklySchedule: enabledSchedules
      });

      setMessage(`Successfully created ${response.schedules.length} schedule entries for the academic year`);
      fetchSchedules(); // Refresh schedules
      // Reset form
      setSelectedClass('');
      setSelectedTeacher('');
      setSubject('');
      setWeeklySchedule(DAYS.map(day => ({ day, startTime: '09:30', endTime: '10:30', enabled: false })));
    } catch (error: any) {
      try {
        const errorData = JSON.parse(error.message);
        if (errorData.conflicts) {
          setError('Schedule conflicts detected:');
          setConflicts(errorData.conflicts);
        } else {
          setError(errorData.message || 'Failed to create schedule');
        }
      } catch {
        if (error.message.includes('conflicts')) {
          setError('Schedule conflicts detected. Please check the times and try again.');
        } else {
          setError(error.message || 'Failed to create schedule');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>Schedule Management</Header>
      
      <ScheduleList>
        <h3>Current Schedules ({filteredSchedules.length})</h3>
        
        <FilterSection>
          <FormGroup>
            <Label>Filter by Teacher</Label>
            <Select value={filterTeacher} onChange={(e) => setFilterTeacher(e.target.value)}>
              <option value="">All Teachers</option>
              {teachers.map(teacher => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.name || teacher.username}
                </option>
              ))}
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label>Filter by Class</Label>
            <Select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
              <option value="">All Classes</option>
              {classes.map(cls => (
                <option key={cls._id} value={cls._id}>
                  {cls.name} - Grade {cls.grade}
                </option>
              ))}
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label>Filter by Day</Label>
            <Select value={filterDay} onChange={(e) => setFilterDay(e.target.value)}>
              <option value="">All Days</option>
              {DAYS.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label>Filter by Subject</Label>
            <Input
              type="text"
              placeholder="Search subjects..."
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>&nbsp;</Label>
            <Button 
              type="button" 
              style={{ background: '#dc3545' }}
              onClick={handleDeleteAll}
            >
              Delete All Schedules
            </Button>
          </FormGroup>
        </FilterSection>
        
        {filteredSchedules.length > 0 ? (
          <ScheduleTable>
            <thead>
              <tr>
                <TableHeader>Class</TableHeader>
                <TableHeader>Teacher</TableHeader>
                <TableHeader>Subject</TableHeader>
                <TableHeader>Day</TableHeader>
                <TableHeader>Time</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </thead>
            <tbody>
              {filteredSchedules.map((schedule) => (
                <TableRow key={schedule._id}>
                  <TableCell>
                    {typeof schedule.classId === 'object' && schedule.classId !== null
                      ? `${(schedule.classId as any).name} - Grade ${(schedule.classId as any).grade}`
                      : 'N/A'
                    }
                  </TableCell>
                  <TableCell>
                    {typeof schedule.teacherId === 'object' && schedule.teacherId !== null
                      ? (schedule.teacherId as any).name || (schedule.teacherId as any).username
                      : 'N/A'
                    }
                  </TableCell>
                  <TableCell>{schedule.subject}</TableCell>
                  <TableCell>{schedule.day}</TableCell>
                  <TableCell>{schedule.startTime} - {schedule.endTime}</TableCell>
                  <TableCell>
                    <ActionButton onClick={() => handleEdit(schedule)}>Edit</ActionButton>
                    <ActionButton className="delete" onClick={() => handleDelete(schedule._id!)}>Delete</ActionButton>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </ScheduleTable>
        ) : (
          <p>No schedules created yet.</p>
        )}
      </ScheduleList>
      
      <FormSection>
        <h3>Create Weekly Schedule</h3>
        <form onSubmit={handleSubmit}>
          <FormGrid>
            <FormGroup>
              <Label>Class *</Label>
              <Select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} required>
                <option value="">Select Class</option>
                {classes.map(cls => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name} - Grade {cls.grade}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Teacher *</Label>
              <Select value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)} required>
                <option value="">Select Teacher</option>
                {teachers.map(teacher => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.name || teacher.username}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Subject *</Label>
              <Select value={subject} onChange={(e) => setSubject(e.target.value)} required>
                <option value="">Select Subject</option>
                {teacherSubjects.map(subj => (
                  <option key={subj._id} value={subj.name}>
                    {subj.name}
                  </option>
                ))}
                {teacherSubjects.length === 0 && selectedTeacher && (
                  <option disabled>No subjects assigned to this teacher</option>
                )}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Day *</Label>
              <Select required>
                <option value="">Select Day</option>
                {DAYS.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Time Slot *</Label>
              <Select required>
                <option value="">Select Time</option>
                {TIME_SLOTS.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Academic Year</Label>
              <Input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="2024"
              />
            </FormGroup>
          </FormGrid>

          <h4>Weekly Schedule</h4>
          <WeeklyScheduleGrid>
            <div></div>
            {DAYS.map(day => (
              <DayHeader key={day}>{day}</DayHeader>
            ))}
            
            <div style={{ fontWeight: 'bold', padding: '10px 0', color: 'white' }}>Enable</div>
            {weeklySchedule.map((schedule, index) => (
              <div key={schedule.day}>
                <CheckBox
                  type="checkbox"
                  checked={schedule.enabled}
                  onChange={(e) => handleScheduleChange(index, 'enabled', e.target.checked)}
                />
              </div>
            ))}

            <div style={{ fontWeight: 'bold', padding: '10px 0', color: 'white' }}>Start Time</div>
            {weeklySchedule.map((schedule, index) => (
              <TimeSlot key={`start-${schedule.day}`}>
                <TimeInput
                  type="time"
                  value={schedule.startTime}
                  onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                  disabled={!schedule.enabled}
                />
              </TimeSlot>
            ))}

            <div style={{ fontWeight: 'bold', padding: '10px 0', color: 'white' }}>End Time</div>
            {weeklySchedule.map((schedule, index) => (
              <TimeSlot key={`end-${schedule.day}`}>
                <TimeInput
                  type="time"
                  value={schedule.endTime}
                  onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                  disabled={!schedule.enabled}
                />
              </TimeSlot>
            ))}
          </WeeklyScheduleGrid>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {message && <SuccessMessage>{message}</SuccessMessage>}
          
          {conflicts.length > 0 && (
            <div>
              <h4>Conflicts Detected:</h4>
              {conflicts.map((conflict, index) => (
                <ConflictItem key={index}>
                  <strong>{conflict.day} {conflict.startTime}-{conflict.endTime}</strong><br/>
                  <strong>Conflict Type:</strong> {conflict.type === 'teacher' ? 'Teacher already scheduled' : 'Class already has a subject'}<br/>
                  <strong>Existing Schedule:</strong> {conflict.conflictWith.subject}<br/>
                  <strong>Class:</strong> {conflict.conflictWith.classId?.name} - Grade {conflict.conflictWith.classId?.grade}<br/>
                  <strong>Teacher:</strong> {conflict.conflictWith.teacherId?.name || conflict.conflictWith.teacherId?.username}<br/>
                  <strong>Time:</strong> {conflict.conflictWith.startTime} - {conflict.conflictWith.endTime}
                </ConflictItem>
              ))}
            </div>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? 'Creating Schedule...' : 'Create Weekly Schedule'}
          </Button>
        </form>
      </FormSection>
    </Container>
  );
};

export default ScheduleManagement;