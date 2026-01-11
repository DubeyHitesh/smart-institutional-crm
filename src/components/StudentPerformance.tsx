import React from 'react';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 25px;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(139, 92, 246, 0.3);
  }
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  opacity: 0.9;
`;

const Section = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  padding: 30px;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  margin: 0 0 20px 0;
  color: white;
  font-size: 20px;
`;

export default function StudentPerformance() {
  const { state } = useApp();
  
  const currentUserId = state.currentUser?._id || state.currentUser?.id;
  
  // Get assignments assigned to current student
  const studentAssignments = (state.assignments || []).filter(assignment => {
    if (!assignment.studentIds) return false;
    return assignment.studentIds.some(studentId => {
      const idValue = studentId as any;
      const id = typeof idValue === 'object' && idValue !== null ? (idValue._id || idValue.id) : idValue;
      return id === currentUserId;
    });
  });

  // Get student grades
  const grades = JSON.parse(localStorage.getItem('studentGrades') || '{}');
  const studentGrades = grades[currentUserId as string] || {};

  // Calculate statistics
  const totalAssignments = studentAssignments.length;
  const gradedAssignments = Object.keys(studentGrades).length;
  const pendingAssignments = totalAssignments - gradedAssignments;

  // Calculate average score
  const gradeValues = Object.values(studentGrades) as Array<{marks: number, maxMarks: number}>;
  const averageScore = gradeValues.length > 0 
    ? Math.round((gradeValues.reduce((sum, grade) => sum + (grade.marks / grade.maxMarks * 100), 0) / gradeValues.length))
    : 0;

  // Calculate completion rate
  const completionRate = totalAssignments > 0 ? Math.round((gradedAssignments / totalAssignments) * 100) : 0;

  return (
    <>
      <StatsGrid>
        <StatCard>
          <StatValue>{averageScore}%</StatValue>
          <StatLabel>Average Score</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{gradedAssignments}/{totalAssignments}</StatValue>
          <StatLabel>Graded Assignments</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{pendingAssignments}</StatValue>
          <StatLabel>Pending</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{completionRate}%</StatValue>
          <StatLabel>Completion Rate</StatLabel>
        </StatCard>
      </StatsGrid>
      
      <Section>
        <SectionTitle>Performance Overview</SectionTitle>
        {totalAssignments === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>
            No assignments have been assigned to you yet. Your performance statistics will appear here once your teachers create assignments.
          </p>
        ) : (
          <div style={{ color: 'rgba(255,255,255,0.7)' }}>
            <p>You have {totalAssignments} total assignments with {gradedAssignments} graded.</p>
            {averageScore > 0 && <p>Your current average score is {averageScore}%.</p>}
            {pendingAssignments > 0 && <p>{pendingAssignments} assignments are still pending grades.</p>}
          </div>
        )}
      </Section>
    </>
  );
}