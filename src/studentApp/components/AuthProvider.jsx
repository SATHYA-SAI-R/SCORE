import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { onAuthChange } from '../../lib/authService';

const AuthProvider = ({ children }) => {
  const { setUser, clearUser } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        setUser(user);
      } else {
        clearUser();
      }
    });

    return () => unsubscribe();
  }, [setUser, clearUser]);

  return <>{children}</>;
};

export default AuthProvider;
