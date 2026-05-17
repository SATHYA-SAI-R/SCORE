import React from 'react';
import { useAuthStore } from '../store/authStore';
import StudentProfile from './student/Profile';
import RecruiterProfile from './recruiter/Profile';

const Profile = () => {
  const { user } = useAuthStore();
  const isRecruiter = user?.role === 'recruiter' || user?.role === 'Recruiter';

  // Conditional Rendering based on Role
  if (isRecruiter) {
    return <RecruiterProfile />;
  }
  
  return <StudentProfile />;
};

export default Profile;
