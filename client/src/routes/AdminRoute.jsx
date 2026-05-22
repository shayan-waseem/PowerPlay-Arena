import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-darkBg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-neonPink border-r-neonPurple border-b-darkBorder border-l-darkBorder rounded-full animate-spin mb-4 shadow-glowPurple"></div>
          <p className="font-display text-neonPurple text-sm animate-pulse">AUTHORIZING ADMIN DECRYPTOR...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    // Hidden panels should redirect to 404 or home to avoid letting hackers know the panel exists
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
