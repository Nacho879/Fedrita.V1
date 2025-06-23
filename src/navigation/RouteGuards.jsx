import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/layout/DashboardLayout.jsx';

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  return user ? children : <Navigate to="/login" />;
};

export const CompanySetupRoute = ({ children }) => {
  const { user, company, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;
  const needsSetup = user.needsCompanySetup === undefined ? !company : user.needsCompanySetup;
  if (needsSetup && !company) return children;
  return <Navigate to="/dashboard" />;
};

export const DashboardRoute = () => {
  const { user, company, userRole, managedSalon, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;
  if (userRole === 'super_admin') return <Navigate to="/super-admin" />;
  if (userRole === 'manager' && managedSalon) return <Navigate to="/dashboard-manager" />;
  if (userRole === 'employee' && managedSalon) return <Navigate to="/dashboard-empleado" />;
  const needsSetup = user.needsCompanySetup === undefined ? !company : user.needsCompanySetup;
  if (needsSetup && !company) return <Navigate to="/registro-empresa" />;
  return <DashboardLayout />;
};

export const ManagerRoute = () => {
  const { user, userRole, managedSalon, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;
  if (userRole === 'admin') return <Navigate to="/dashboard" />;
  if (userRole !== 'manager' || !managedSalon) return <Navigate to="/dashboard" />;
  return <DashboardLayout />;
};

export const EmployeeRoute = () => {
  const { user, userRole, managedSalon, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;
  if (userRole === 'admin') return <Navigate to="/dashboard" />;
  if ((userRole !== 'manager' && userRole !== 'employee') || !managedSalon) return <Navigate to="/dashboard" />;
  return <DashboardLayout />;
};

export const DashboardEmployeeRoute = ({ children }) => {
  const { user, userRole, managedSalon, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;
  if (userRole === 'admin') return <Navigate to="/dashboard" />;
  if (userRole === 'manager') return <Navigate to="/dashboard-manager" />;
  if (userRole !== 'employee' || !managedSalon) return <Navigate to="/dashboard" />;
  return children;
};

export const AdminOrManagerRoute = () => {
  const { user, userRole, company, managedSalon, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;
  if (userRole === 'admin' && company) return <DashboardLayout />;
  if (userRole === 'manager' && managedSalon) return <DashboardLayout />;
  const needsSetup = user.needsCompanySetup === undefined ? !company : user.needsCompanySetup;
  if (needsSetup && !company) return <Navigate to="/registro-empresa" />;
  return <Navigate to="/dashboard" />;
};

export const SuperAdminRoute = ({ children }) => {
    const { user, userRole, loading } = useAuth();
    if (loading) return <LoadingSpinner />;
    if (!user) return <Navigate to="/login" />;
    if (userRole !== 'super_admin') return <Navigate to="/dashboard" />;
    return children;
};