import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RefreshCw } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#0f172a',
        color: '#f8fafc'
      }}>
        <RefreshCw style={{ animation: 'spin 2s linear infinite', color: '#8b5cf6', marginBottom: '16px' }} size={32} />
        <p>Verifying authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (allowedRoles && allowedRoles.includes('RECRUITER')) {
      return <Navigate to="/recruiter/login" replace />;
    }
    return <Navigate to="/candidate/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'CANDIDATE') {
      return <Navigate to="/candidate" replace />;
    }
    if (user.role === 'RECRUITER') {
      return <Navigate to="/recruiter" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
