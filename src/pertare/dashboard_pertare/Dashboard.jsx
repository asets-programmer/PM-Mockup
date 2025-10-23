import React from 'react';
import { useAuth } from '../auth/AuthContext';
import PreventiveMaintenanceDashboard from './PageDashboard';
import DashboardTeknisi from './PageDashboardTeknisi';

const Dashboard = () => {
  const { user } = useAuth();

  // Tampilkan dashboard berdasarkan role
  if (user?.role === 'teknisi') {
    return <DashboardTeknisi />;
  }

  // Default untuk admin
  return <PreventiveMaintenanceDashboard />;
};

export default Dashboard;
