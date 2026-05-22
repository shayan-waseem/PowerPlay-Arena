import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import Sidebar from '../components/sidebar/Sidebar';

// Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import Reception from '../pages/Reception';
import KidsActivities from '../pages/KidsActivities';
import AdultActivities from '../pages/AdultActivities';
import GamingZone from '../pages/GamingZone';
import Simulation from '../pages/Simulation';
import Analytics from '../pages/Analytics';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageUsers from '../pages/admin/ManageUsers';
import ManageBookings from '../pages/admin/ManageBookings';
import SystemLogs from '../pages/admin/SystemLogs';

// Route Guards
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// Layout wrapper for dashboard pages (includes Sidebar on the left)
const DashboardLayout = ({ children }) => {
  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-73px)] max-w-7xl mx-auto w-full p-4 lg:p-6 gap-6">
      <Sidebar />
      <main className="flex-1 w-full overflow-hidden">
        {children}
      </main>
    </div>
  );
};

// Layout wrapper for normal pages (no sidebar)
const NormalLayout = ({ children }) => {
  return (
    <div className="min-h-[calc(100vh-73px)] max-w-7xl mx-auto w-full p-4 lg:p-6">
      {children}
    </div>
  );
};

const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Dashboard/Simulation Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reception"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Reception />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/kids-activities"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <KidsActivities />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/adult-activities"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AdultActivities />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/gaming-zone"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <GamingZone />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/simulation"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Simulation />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Analytics />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <NormalLayout>
                <Profile />
              </NormalLayout>
            </ProtectedRoute>
          }
        />

        {/* Hidden Admin Routes */}
        <Route
          path="/powerplay-secret-admin"
          element={
            <AdminRoute>
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/powerplay-secret-admin/users"
          element={
            <AdminRoute>
              <DashboardLayout>
                <ManageUsers />
              </DashboardLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/powerplay-secret-admin/bookings"
          element={
            <AdminRoute>
              <DashboardLayout>
                <ManageBookings />
              </DashboardLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/powerplay-secret-admin/logs"
          element={
            <AdminRoute>
              <DashboardLayout>
                <SystemLogs />
              </DashboardLayout>
            </AdminRoute>
          }
        />

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
