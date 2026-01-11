import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import LandingPage from './pages/NewLandingPage';
import RoleSelection from './pages/RoleSelection';
import LoginPage from './pages/LoginPage';
import AdminSetup from './pages/AdminSetup';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import './App.css';

function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) {
  const { state } = useApp();
  
  if (state.loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        color: 'white', 
        fontSize: '18px' 
      }}>
        Loading...
      </div>
    );
  }
  
  if (!state.currentUser) {
    return <Navigate to="/" replace />;
  }
  
  if (requiredRole && state.currentUser.role !== requiredRole) {
    return <Navigate to={`/dashboard/${state.currentUser.role}`} replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { state } = useApp();
  
  if (state.loading) {
    return <div>Loading...</div>;
  }
  
  // If user is logged in and on root path, redirect to their dashboard
  if (state.currentUser && window.location.pathname === '/') {
    return <Navigate to={`/dashboard/${state.currentUser.role}`} replace />;
  }
  
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin-setup" element={<AdminSetup />} />
      <Route path="/role-selection" element={<RoleSelection />} />
      <Route path="/login/:role" element={<LoginPage />} />
      <Route path="/dashboard/admin" element={
        <ProtectedRoute requiredRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/teacher" element={
        <ProtectedRoute requiredRole="teacher">
          <TeacherDashboard />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/student" element={
        <ProtectedRoute requiredRole="student">
          <StudentDashboard />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;