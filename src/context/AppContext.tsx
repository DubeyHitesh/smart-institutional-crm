import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, Student, Teacher, Performance, Assignment, TimetableEntry, LoginHistory, Class, ScheduleEntry, Notice } from '../types';
import apiService from '../services/api';

interface AppState {
  currentUser: User | null;
  users: User[];
  students: Student[];
  teachers: Teacher[];
  classes: Class[];
  schedules: ScheduleEntry[];
  notices: Notice[];
  performances: Performance[];
  assignments: Assignment[];
  timetables: TimetableEntry[];
  loginHistory: LoginHistory[];
  loading: boolean;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'UPDATE_PROFILE'; payload: User }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'SET_CLASSES'; payload: Class[] }
  | { type: 'ADD_CLASS'; payload: Class }
  | { type: 'UPDATE_CLASS'; payload: Class }
  | { type: 'DELETE_CLASS'; payload: string }
  | { type: 'ASSIGN_TEACHER_TO_CLASS'; payload: { classId: string; teacherId: string } }
  | { type: 'SET_SCHEDULES'; payload: ScheduleEntry[] }
  | { type: 'ADD_SCHEDULE'; payload: ScheduleEntry }
  | { type: 'UPDATE_SCHEDULE'; payload: ScheduleEntry }
  | { type: 'DELETE_SCHEDULE'; payload: string }
  | { type: 'SET_ASSIGNMENTS'; payload: Assignment[] }
  | { type: 'ADD_ASSIGNMENT'; payload: Assignment }
  | { type: 'UPDATE_ASSIGNMENT'; payload: Assignment }
  | { type: 'SET_NOTICES'; payload: Notice[] }
  | { type: 'ADD_NOTICE'; payload: Notice }
  | { type: 'DELETE_NOTICE'; payload: string }
  | { type: 'MARK_NOTICES_READ'; payload: string }
  | { type: 'ADD_PERFORMANCE'; payload: Performance }
  | { type: 'UPDATE_PERFORMANCE'; payload: Performance }
  | { type: 'ADD_ASSIGNMENT'; payload: Assignment }
  | { type: 'UPDATE_ASSIGNMENT'; payload: Assignment }
  | { type: 'ADD_TIMETABLE'; payload: TimetableEntry }
  | { type: 'ADD_LOGIN_HISTORY'; payload: LoginHistory };

const initialState: AppState = {
  currentUser: null,
  users: [],
  students: [],
  teachers: [],
  classes: [],
  schedules: [],
  notices: [],
  performances: [],
  assignments: [],
  timetables: [],
  loginHistory: [],
  loading: false,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'LOGIN':
      return { ...state, currentUser: action.payload };
    case 'LOGOUT':
      apiService.logout();
      return { ...state, currentUser: null };
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? action.payload : user
        ),
      };
    case 'UPDATE_PROFILE':
      const updatedUsers = state.users.map(user =>
        user.id === action.payload.id ? action.payload : user
      );
      return {
        ...state,
        users: updatedUsers,
        currentUser: state.currentUser?.id === action.payload.id ? action.payload : state.currentUser,
      };
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload),
      };
    case 'SET_CLASSES':
      return { ...state, classes: action.payload };
    case 'ADD_CLASS':
      const newClasses = [...state.classes, action.payload];
      localStorage.setItem('classes', JSON.stringify(newClasses));
      return { ...state, classes: newClasses };
    case 'UPDATE_CLASS':
      const updatedClasses = state.classes.map(cls => {
        const classId = cls._id || cls.id;
        const payloadId = action.payload._id || action.payload.id;
        if (classId === payloadId) {
          // Ensure the updated class data is properly merged
          return { ...cls, ...action.payload };
        }
        return cls;
      });
      localStorage.setItem('classes', JSON.stringify(updatedClasses));
      return {
        ...state,
        classes: updatedClasses,
      };
    case 'DELETE_CLASS':
      return {
        ...state,
        classes: state.classes.filter(cls => cls.id !== action.payload),
      };
    case 'ASSIGN_TEACHER_TO_CLASS':
      return {
        ...state,
        classes: state.classes.map(cls => {
          const classId = cls._id || cls.id;
          return classId === action.payload.classId 
            ? { ...cls, teacherId: action.payload.teacherId }
            : cls;
        }),
      };
    case 'SET_SCHEDULES':
      return { ...state, schedules: action.payload };
    case 'ADD_SCHEDULE':
      return { ...state, schedules: [...state.schedules, action.payload] };
    case 'UPDATE_SCHEDULE':
      return {
        ...state,
        schedules: state.schedules.map(schedule =>
          schedule.id === action.payload.id ? action.payload : schedule
        ),
      };
    case 'DELETE_SCHEDULE':
      return {
        ...state,
        schedules: state.schedules.filter(schedule => schedule.id !== action.payload),
      };
    case 'SET_ASSIGNMENTS':
      return { ...state, assignments: action.payload };
    case 'ADD_ASSIGNMENT':
      const newAssignments = [...state.assignments, action.payload];
      localStorage.setItem('assignments', JSON.stringify(newAssignments));
      return { ...state, assignments: newAssignments };
    case 'UPDATE_ASSIGNMENT':
      const updatedAssignments = state.assignments.map(assignment =>
        assignment.id === action.payload.id ? { ...assignment, ...action.payload } : assignment
      );
      localStorage.setItem('assignments', JSON.stringify(updatedAssignments));
      return { ...state, assignments: updatedAssignments };
    case 'SET_NOTICES':
      return { ...state, notices: action.payload };
    case 'ADD_NOTICE':
      const updatedNotices = [...state.notices, action.payload];
      localStorage.setItem('notices', JSON.stringify(updatedNotices));
      return { ...state, notices: updatedNotices };
    case 'DELETE_NOTICE':
      const filteredNotices = state.notices.filter(notice => {
        const noticeId = notice.id || notice._id;
        return noticeId !== action.payload;
      });
      localStorage.setItem('notices', JSON.stringify(filteredNotices));
      return { ...state, notices: filteredNotices };
    case 'MARK_NOTICES_READ':
      const noticesWithRead = state.notices.map(notice => ({
        ...notice,
        isRead: { ...notice.isRead, [action.payload]: true }
      }));
      localStorage.setItem('notices', JSON.stringify(noticesWithRead));
      return { ...state, notices: noticesWithRead };
    case 'ADD_PERFORMANCE':
      return { ...state, performances: [...state.performances, action.payload] };
    case 'UPDATE_PERFORMANCE':
      return {
        ...state,
        performances: state.performances.map(perf =>
          perf.id === action.payload.id ? action.payload : perf
        ),
      };
    case 'ADD_TIMETABLE':
      return { ...state, timetables: [...state.timetables, action.payload] };
    case 'ADD_LOGIN_HISTORY':
      return { ...state, loginHistory: [...state.loginHistory, action.payload] };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data on app start
  useEffect(() => {
    const loadInitialData = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          dispatch({ type: 'SET_LOADING', payload: true });
          const user = await apiService.getCurrentUser();
          dispatch({ type: 'LOGIN', payload: user });
          
          // Load data in background after login
          setTimeout(async () => {
            if (user.role === 'admin') {
              try {
                const [users, classes] = await Promise.all([
                  apiService.getUsers().catch(() => []),
                  apiService.getClasses().catch(() => [])
                ]);
                dispatch({ type: 'SET_USERS', payload: users });
                dispatch({ type: 'SET_CLASSES', payload: classes });
              } catch (error) {
                console.error('Failed to load admin data:', error);
              }
            } else if (user.role === 'teacher' || user.role === 'student') {
              try {
                const classes = await apiService.getClasses().catch(() => []);
                dispatch({ type: 'SET_CLASSES', payload: classes });
              } catch (error) {
                console.error('Failed to load classes:', error);
              }
            }
            
            // Load notices for all users
            try {
              const savedNotices = localStorage.getItem('notices');
              if (savedNotices) {
                const notices = JSON.parse(savedNotices);
                dispatch({ type: 'SET_NOTICES', payload: notices });
              }
            } catch (error) {
              console.error('Failed to load notices:', error);
            }
            
            // Load assignments for students and teachers
            if (user.role === 'student' || user.role === 'teacher') {
              try {
                const savedAssignments = localStorage.getItem('assignments');
                if (savedAssignments) {
                  const assignments = JSON.parse(savedAssignments);
                  dispatch({ type: 'SET_ASSIGNMENTS', payload: assignments });
                }
              } catch (error) {
                console.error('Failed to load assignments:', error);
              }
            }
          }, 100);
          
        } catch (error) {
          console.error('Failed to load initial data:', error);
          dispatch({ type: 'SET_LOADING', payload: false });
          return;
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadInitialData();
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}