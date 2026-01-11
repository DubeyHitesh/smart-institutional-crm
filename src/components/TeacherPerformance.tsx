import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 20px;
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 14px;
`;

const ChartSection = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 20px;
  margin-bottom: 20px;
`;

const ChartTitle = styled.h3`
  margin: 0 0 20px 0;
  color: #333;
`;

const StudentList = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const StudentItem = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
`;

const StudentInfo = styled.div`
  flex: 1;
`;

const StudentName = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 3px;
`;

const StudentClass = styled.div`
  font-size: 12px;
  color: #666;
`;

const PerformanceScore = styled.div<{ score: number }>`
  font-size: 18px;
  font-weight: bold;
  color: ${props => props.score >= 80 ? '#27ae60' : props.score >= 60 ? '#f39c12' : '#e74c3c'};
`;

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];

export default function TeacherPerformance() {
  const { state } = useApp();
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [classStats, setClassStats] = useState<any[]>([]);

  useEffect(() => {
    calculatePerformanceData();
  }, [state.classes, state.performances]);

  const calculatePerformanceData = () => {
    const currentUserId = state.currentUser?._id || state.currentUser?.id;
    
    // Get teacher's classes
    const teacherClasses = state.classes.filter(cls => {
      if (!cls.teacherId) return false;
      const teacherId = typeof cls.teacherId === 'object' ? 
        (cls.teacherId._id || cls.teacherId.id) : cls.teacherId;
      return teacherId === currentUserId;
    });

    // Get all students from teacher's classes
    const allStudents: any[] = [];
    teacherClasses.forEach(cls => {
      if (cls.studentIds && cls.studentIds.length > 0) {
        cls.studentIds.forEach(studentId => {
          if (typeof studentId === 'object' && studentId !== null) {
            const student = studentId as any;
            if (student.username && !allStudents.find(s => (s._id || s.id) === (student._id || student.id))) {
              allStudents.push({ ...student, className: cls.name });
            }
          }
        });
      }
    });

    // Calculate performance for each student
    const studentPerformances = allStudents.map(student => {
      const studentId = (student._id || student.id) as string;
      const grades = JSON.parse(localStorage.getItem('studentGrades') || '{}');
      const studentGrades = grades[studentId] || {};
      
      const gradeValues = Object.values(studentGrades) as any[];
      if (gradeValues.length === 0) {
        return {
          name: student.name || student.username,
          className: student.className,
          averageScore: 0,
          totalAssignments: 0
        };
      }

      const totalMarks = gradeValues.reduce((sum, grade) => sum + grade.marks, 0);
      const totalMaxMarks = gradeValues.reduce((sum, grade) => sum + grade.maxMarks, 0);
      const averageScore = totalMaxMarks > 0 ? Math.round((totalMarks / totalMaxMarks) * 100) : 0;

      return {
        name: student.name || student.username,
        className: student.className,
        averageScore,
        totalAssignments: gradeValues.length
      };
    });

    setPerformanceData(studentPerformances);

    // Calculate class-wise statistics
    const classWiseStats = teacherClasses.map(cls => {
      const classStudents = studentPerformances.filter(s => s.className === cls.name);
      const avgScore = classStudents.length > 0 
        ? Math.round(classStudents.reduce((sum, s) => sum + s.averageScore, 0) / classStudents.length)
        : 0;
      
      return {
        name: cls.name,
        averageScore: avgScore,
        studentCount: classStudents.length
      };
    });

    setClassStats(classWiseStats);
  };

  const overallStats = {
    totalStudents: performanceData.length,
    averagePerformance: performanceData.length > 0 
      ? Math.round(performanceData.reduce((sum, s) => sum + s.averageScore, 0) / performanceData.length)
      : 0,
    topPerformer: performanceData.length > 0 
      ? performanceData.reduce((prev, current) => prev.averageScore > current.averageScore ? prev : current)
      : null,
    totalAssignments: performanceData.reduce((sum, s) => sum + s.totalAssignments, 0)
  };

  return (
    <Container>
      <Header>
        <Title>Class Performance Dashboard</Title>
        <Subtitle>Overview of student performance across your classes</Subtitle>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatValue>{overallStats.totalStudents}</StatValue>
          <StatLabel>Total Students</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{overallStats.averagePerformance}%</StatValue>
          <StatLabel>Average Performance</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{overallStats.totalAssignments}</StatValue>
          <StatLabel>Total Assignments Graded</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{overallStats.topPerformer?.name || 'N/A'}</StatValue>
          <StatLabel>Top Performer</StatLabel>
        </StatCard>
      </StatsGrid>

      <ChartSection>
        <ChartTitle>Class-wise Performance</ChartTitle>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={classStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="averageScore" fill="#667eea" />
          </BarChart>
        </ResponsiveContainer>
      </ChartSection>

      <ChartSection>
        <ChartTitle>Performance Distribution</ChartTitle>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={[
                { name: 'Excellent (80-100%)', value: performanceData.filter(s => s.averageScore >= 80).length },
                { name: 'Good (60-79%)', value: performanceData.filter(s => s.averageScore >= 60 && s.averageScore < 80).length },
                { name: 'Needs Improvement (<60%)', value: performanceData.filter(s => s.averageScore < 60).length }
              ]}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label
            >
              {COLORS.map((color, index) => (
                <Cell key={`cell-${index}`} fill={color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartSection>

      <StudentList>
        <div style={{ padding: '20px', borderBottom: '1px solid #f0f0f0', background: '#f8f9fa' }}>
          <h3 style={{ margin: 0, color: '#333' }}>Individual Student Performance</h3>
        </div>
        {performanceData.map((student, index) => (
          <StudentItem key={index}>
            <StudentInfo>
              <StudentName>{student.name}</StudentName>
              <StudentClass>{student.className} • {student.totalAssignments} assignments</StudentClass>
            </StudentInfo>
            <PerformanceScore score={student.averageScore}>
              {student.averageScore}%
            </PerformanceScore>
          </StudentItem>
        ))}
        {performanceData.length === 0 && (
          <StudentItem>
            <StudentInfo>
              <StudentName>No performance data available</StudentName>
              <StudentClass>Start grading assignments to see performance metrics</StudentClass>
            </StudentInfo>
          </StudentItem>
        )}
      </StudentList>
    </Container>
  );
}