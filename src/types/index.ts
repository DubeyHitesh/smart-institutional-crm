export interface User {
  id?: string;
  _id?: string;
  username: string;
  password: string;
  role: 'admin' | 'teacher' | 'student';
  lastLogin?: Date;
  isActive: boolean;
  createdAt: Date;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  classId?: string;
}

export interface Student extends User {
  teacherId?: string;
  class?: string;
  rollNumber?: string;
  performance: Performance[];
}

export interface Teacher extends User {
  assignedClasses: string[];
  assignedStudents: string[];
  schedule: ScheduleEntry[];
  department?: string;
  employeeId?: string;
}

export interface Class {
  id?: string;
  _id?: string;
  name: string;
  grade: string;
  teacherId?: string | any;
  studentIds: string[];
  createdAt: Date;
}

export interface ScheduleEntry {
  id?: string;
  _id?: string;
  classId: string | Class;
  subject: string;
  day: string;
  startTime: string;
  endTime: string;
  teacherId: string | User;
  isRecurring?: boolean;
  academicYear?: string;
}

export interface ScheduleConflict {
  day: string;
  startTime: string;
  endTime: string;
  type: 'teacher' | 'class';
  conflictWith: ScheduleEntry;
}

export interface WeeklyScheduleRequest {
  classId: string;
  teacherId: string;
  subject: string;
  academicYear: string;
  weeklySchedule: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
}

export interface Performance {
  id: string;
  studentId: string;
  subject: string;
  marks: number;
  maxMarks: number;
  examDate: Date;
  examType: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  studentIds: string[];
  dueDate: string;
  status?: string;
  submissions: AssignmentSubmission[];
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedAt: Date;
  marks?: number;
  feedback?: string;
}

export interface TimetableEntry {
  id: string;
  subject: string;
  class: string;
  startTime: string;
  endTime: string;
  day: string;
  teacherId: string;
}

export interface LoginHistory {
  userId: string;
  loginTime: Date;
  logoutTime?: Date;
}

export interface Notice {
  id?: string;
  _id?: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date;
  targetRoles: ('teacher' | 'student')[];
  isRead?: { [userId: string]: boolean };
}