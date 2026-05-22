import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-darkBg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-neonPurple border-r-neonBlue border-b-darkBorder border-l-darkBorder rounded-full animate-spin mb-4 shadow-glowBlue"></div>
          <p className="font-display text-neonBlue text-sm animate-pulse">SYNCHRONIZING SECURE SESSION...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
