import React, { useState } from 'react';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';

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
`;

const SectionTitle = styled.h3`
  margin: 0;
  color: #333;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 15px;
  text-align: left;
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #eee;
`;

const Td = styled.td`
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 80px;
`;

const SaveButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background: #218838;
  }
`;

export default function StudentRollAssignment() {
  const { state } = useApp();
  const [rollNumbers, setRollNumbers] = useState<{ [key: string]: string }>({});

  const students = state.users.filter(user => user.role === 'student');

  const handleRollNumberChange = (studentId: string, rollNumber: string) => {
    setRollNumbers({ ...rollNumbers, [studentId]: rollNumber });
  };

  const handleSaveRollNumber = (studentId: string) => {
    // In a real app, this would update the backend
    console.log(`Assigning roll number ${rollNumbers[studentId]} to student ${studentId}`);
    alert('Roll number assigned successfully!');
  };

  return (
    <Container>
      <Section>
        <SectionHeader>
          <SectionTitle>Assign Roll Numbers</SectionTitle>
        </SectionHeader>
        <Table>
          <thead>
            <tr>
              <Th>Student Name</Th>
              <Th>Username</Th>
              <Th>Current Roll Number</Th>
              <Th>New Roll Number</Th>
              <Th>Action</Th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id || student._id}>
                <Td>{student.name || 'Not set'}</Td>
                <Td>{student.username}</Td>
                <Td>{(student as any).rollNumber || 'Not assigned'}</Td>
                <Td>
                  <Input
                    type="text"
                    placeholder="Roll No."
                    value={rollNumbers[(student.id || student._id) as string] || ''}
                    onChange={(e) => handleRollNumberChange((student.id || student._id) as string, e.target.value)}
                  />
                </Td>
                <Td>
                  <SaveButton 
                    onClick={() => handleSaveRollNumber((student.id || student._id) as string)}
                    disabled={!rollNumbers[(student.id || student._id) as string]}
                  >
                    Save
                  </SaveButton>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>
    </Container>
  );
}