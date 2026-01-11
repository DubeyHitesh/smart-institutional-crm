import React, { useState } from 'react';
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
  color: white;
  margin: 0;
`;

const GenerateButton = styled.button`
  background: linear-gradient(45deg, #8B5CF6, #EC4899);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(139, 92, 246, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Section = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 20px;
`;

const ConfigSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const ConfigItem = styled.div`
  label {
    display: block;
    color: white;
    margin-bottom: 8px;
    font-weight: 600;
  }
  
  select, input {
    width: 100%;
    padding: 10px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    
    option {
      background: #1a1a2e;
      color: white;
    }
  }
`;

const CheckboxList = styled.div`
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  padding: 8px 0;
  color: white;
  cursor: pointer;
  
  input {
    margin-right: 10px;
    transform: scale(1.2);
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    padding-left: 5px;
  }
`;

const TimeSlots = [
  '09:00-10:00', '10:00-11:00', '11:00-12:00',
  '12:30-13:30', '13:30-14:30'
];

const Days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const Subjects = [
  'Mathematics', 'English', 'Science', 'History', 'Geography',
  'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Art'
];

export default function AutoTimetableGenerator() {
  const { state, dispatch } = useApp();
  const [generating, setGenerating] = useState(false);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [config, setConfig] = useState({
    maxPeriodsPerDay: 4,
    maxPeriodsPerWeek: 20,
    preferredSubjects: [] as string[],
    avoidConsecutive: true
  });

  const teachers = state.users?.filter(u => u.role === 'teacher') || [];
  const classes = state.classes || [];

  const handleTeacherSelection = (teacherId: string) => {
    setSelectedTeachers(prev => 
      prev.includes(teacherId) 
        ? prev.filter(id => id !== teacherId)
        : [...prev, teacherId]
    );
  };

  const handleClassSelection = (classId: string) => {
    setSelectedClasses(prev => 
      prev.includes(classId) 
        ? prev.filter(id => id !== classId)
        : [...prev, classId]
    );
  };

  const generateAutoTimetable = async () => {
    setGenerating(true);
    
    try {
      const targetTeachers = selectedTeachers.length > 0 
        ? teachers.filter(t => {
            const id = t._id || t.id;
            return id && selectedTeachers.includes(id);
          })
        : teachers;
      
      const targetClasses = selectedClasses.length > 0 
        ? classes.filter(c => {
            const id = c._id || c.id;
            return id && selectedClasses.includes(id);
          })
        : classes;
      
      for (const teacher of targetTeachers) {
        const teacherClasses = targetClasses.filter(cls => {
          if (!cls || !cls.teacherId) return false;
          const teacherId = typeof cls.teacherId === 'object' ? 
            cls.teacherId._id || cls.teacherId.id : cls.teacherId;
          const currentTeacherId = teacher._id || teacher.id;
          return teacherId === currentTeacherId;
        });
        
        if (teacherClasses.length === 0) continue;
        
        const timetable = generateTeacherTimetable(teacher, teacherClasses);
        
        // Create schedules for this teacher
        for (const schedule of timetable) {
          try {
            await apiService.createSchedule({
              classId: schedule.classId,
              teacherId: teacher._id || teacher.id,
              subject: schedule.subject,
              day: schedule.day,
              startTime: schedule.startTime.split('-')[0],
              endTime: schedule.startTime.split('-')[1],
              academicYear: new Date().getFullYear().toString()
            });
          } catch (error) {
            console.error('Error creating schedule:', error);
          }
        }
      }
      
      // Refresh schedules
      const schedules = await apiService.getSchedules();
      dispatch({ type: 'SET_SCHEDULES', payload: schedules });
      
      const message = selectedTeachers.length > 0 || selectedClasses.length > 0
        ? 'Auto timetable generated successfully for selected teachers/classes!'
        : 'Auto timetable generated successfully for all teachers!';
      alert(message);
    } catch (error) {
      console.error('Error generating timetable:', error);
      alert('Error generating timetable. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const generateTeacherTimetable = (teacher: any, teacherClasses: any[]) => {
    const timetable: any[] = [];
    const usedSlots = new Set<string>();
    
    // Calculate periods per class
    const periodsPerClass = Math.floor(config.maxPeriodsPerWeek / teacherClasses.length);
    
    teacherClasses.forEach(cls => {
      let periodsAssigned = 0;
      const classSubjects = getClassSubjects(cls.grade);
      
      for (const day of Days) {
        if (periodsAssigned >= periodsPerClass) break;
        
        let consecutivePeriods = 0;
        
        for (const timeSlot of TimeSlots) {
          if (periodsAssigned >= periodsPerClass) break;
          
          const slotKey = `${day}-${timeSlot}`;
          if (usedSlots.has(slotKey)) continue;
          
          // Check daily limit
          const daySlots = Array.from(usedSlots).filter(slot => slot.startsWith(day));
          if (daySlots.length >= config.maxPeriodsPerDay) break;
          
          // Enforce break after 2 consecutive periods
          if (consecutivePeriods >= 2) {
            consecutivePeriods = 0;
            continue; // Skip this slot to create a break
          }
          
          // Assign subject
          const subject = classSubjects[periodsAssigned % classSubjects.length];
          
          timetable.push({
            classId: cls._id || cls.id,
            className: cls.name,
            day,
            startTime: timeSlot,
            subject,
            grade: cls.grade
          });
          
          usedSlots.add(slotKey);
          periodsAssigned++;
          consecutivePeriods++;
        }
      }
    });
    
    return timetable;
  };

  const getClassSubjects = (grade: string) => {
    // Return subjects based on grade level
    const gradeNum = parseInt(grade);
    if (gradeNum <= 5) {
      return ['Mathematics', 'English', 'Science', 'Art'];
    } else if (gradeNum <= 8) {
      return ['Mathematics', 'English', 'Science', 'History', 'Geography'];
    } else {
      return ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Computer Science'];
    }
  };

  return (
    <Container>
      <Header>
        <Title>Auto Timetable Generator</Title>
        <GenerateButton 
          onClick={generateAutoTimetable}
          disabled={generating}
        >
          {generating ? 'Generating...' : '🤖 Generate Auto Timetable'}
        </GenerateButton>
      </Header>

      <Section>
        <h3 style={{ color: 'white', marginBottom: '20px' }}>Teacher & Class Selection</h3>
        <ConfigSection>
          <ConfigItem>
            <label>Select Teachers (Leave empty for all)</label>
            <CheckboxList>
              {teachers.map(teacher => {
                const teacherId = teacher._id || teacher.id;
                if (!teacherId) return null;
                return (
                  <CheckboxItem key={teacherId}>
                    <input
                      type="checkbox"
                      checked={selectedTeachers.includes(teacherId)}
                      onChange={() => handleTeacherSelection(teacherId)}
                    />
                    {teacher.name || teacher.username}
                  </CheckboxItem>
                );
              })}
            </CheckboxList>
          </ConfigItem>
          
          <ConfigItem>
            <label>Select Classes (Leave empty for all)</label>
            <CheckboxList>
              {classes.map(cls => {
                const classId = cls._id || cls.id;
                if (!classId) return null;
                return (
                  <CheckboxItem key={classId}>
                    <input
                      type="checkbox"
                      checked={selectedClasses.includes(classId)}
                      onChange={() => handleClassSelection(classId)}
                    />
                    {cls.name} - Grade {cls.grade}
                  </CheckboxItem>
                );
              })}
            </CheckboxList>
          </ConfigItem>
        </ConfigSection>
      </Section>

      <Section>
        <h3 style={{ color: 'white', marginBottom: '20px' }}>Configuration</h3>
        <ConfigSection>
          <ConfigItem>
            <label>Max Periods Per Day</label>
            <select 
              value={config.maxPeriodsPerDay}
              onChange={(e) => setConfig({...config, maxPeriodsPerDay: parseInt(e.target.value)})}
            >
              <option value={3}>3 Periods</option>
              <option value={4}>4 Periods</option>
              <option value={5}>5 Periods</option>
            </select>
          </ConfigItem>
          
          <ConfigItem>
            <label>Max Periods Per Week (Per Class)</label>
            <select 
              value={config.maxPeriodsPerWeek}
              onChange={(e) => setConfig({...config, maxPeriodsPerWeek: parseInt(e.target.value)})}
            >
              <option value={3}>3 Periods</option>
              <option value={4}>4 Periods</option>
              <option value={5}>5 Periods</option>
              <option value={6}>6 Periods</option>
            </select>
          </ConfigItem>
        </ConfigSection>
        
        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
          <h4 style={{ marginBottom: '10px' }}>How it works:</h4>
          <ul style={{ paddingLeft: '20px' }}>
            <li>Automatically assigns subjects based on class grade level</li>
            <li>Distributes periods evenly across assigned classes</li>
            <li>Avoids scheduling conflicts and respects daily limits</li>
            <li>Skips lunch break (12:00-12:30) automatically</li>
            <li>Generates balanced weekly schedule for each teacher</li>
          </ul>
        </div>
      </Section>
    </Container>
  );
}