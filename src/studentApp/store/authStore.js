import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isAuthResolved: false, // For initial loading check
  
  setUser: (userData) => set({ 
    user: userData, 
    isAuthenticated: !!userData, 
    isAuthResolved: true 
  }),
  
  clearUser: () => set({ 
    user: null, 
    isAuthenticated: false, 
    isAuthResolved: true 
  }),
  
  // Kept for backward compatibility, but we now use authService for real login
  login: (userData) => set({ user: userData, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  
  updateUser: (userData) => set((state) => ({ 
    user: { ...state.user, ...userData } 
  })),
}));
