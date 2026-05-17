import React from 'react';
import { useAuthStore } from '../store/authStore';
import StudentDashboard from './student/Dashboard';
import RecruiterDashboard from './recruiter/Dashboard';

const Dashboard = () => {
  const { user } = useAuthStore();

  if (user?.role === 'recruiter' || user?.role === 'Recruiter') {
    return <RecruiterDashboard />;
  }

  // Default to Student Dashboard for now, or handle other roles
  return <StudentDashboard />;
};

export default Dashboard;
