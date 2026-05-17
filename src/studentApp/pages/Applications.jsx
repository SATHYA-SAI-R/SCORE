import React from 'react';
import { useAuthStore } from '../store/authStore';
import StudentApplications from './student/Applications';
import RecruiterApplications from './recruiter/Applications';

const Applications = () => {
  const { user } = useAuthStore();

  if (user?.role === 'recruiter' || user?.role === 'Recruiter') {
    return <RecruiterApplications />;
  }

  return <StudentApplications />;
};

export default Applications;
