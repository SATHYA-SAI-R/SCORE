import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import LoadingScreen from '../pages/LoadingScreen';
import { useAuthStore } from '../store/authStore';
import '../index.css';

const StudentLayout = () => {
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const { user } = useAuthStore();

    // Determine the theme based on the user's role
    const getThemeClass = () => {
        if (!user || !user.role) return 'theme-student';
        if (user.role === 'Alumni/Mentor' || user.role === 'mentor' || user.role === 'Mentor') {
            return 'theme-mentor';
        }
        if (user.role === 'recruiter' || user.role === 'Recruiter') {
            return 'theme-recruiter';
        }
        return 'theme-student';
    };

    const themeClass = getThemeClass();

    useEffect(() => {
        // Remove any existing themes explicitly
        document.body.classList.remove('theme-student', 'theme-mentor', 'theme-recruiter');
        
        // Apply appropriate theme to body
        document.body.classList.add(themeClass);

        // Always show the system boot loading screen on component mount
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 4500); // 4.5s to match the boot sequence roughly
        
        return () => {
            clearTimeout(timer);
            document.body.classList.remove(themeClass);
        };
    }, [themeClass]);

    if (isLoading) {
        return (
            <div className={themeClass}>
                <LoadingScreen />
            </div>
        );
    }

    return (
        <div className={`${themeClass} contents min-h-screen`}>
            <Outlet />
        </div>
    );
};

export default StudentLayout;
