import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Briefcase, FileText, MessageCircle,
  Star, User, GraduationCap, Settings, LogOut, Terminal, Users
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { logoutUser } from '../../lib/authService';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/student/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const studentMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/student/dashboard' },
    { icon: Briefcase, label: 'Browse_Gigs', path: '/student/gigs' },
    { icon: FileText, label: 'Applications', path: '/student/applications' },
    { icon: MessageCircle, label: 'Messages', path: '/student/messages' },
    { icon: Star, label: 'Reviews', path: '/student/reviews' },
    { icon: User, label: 'Profile', path: '/student/profile' },
    { icon: GraduationCap, label: 'Mentorship', path: '/student/mentorship' },
    { icon: Users, label: 'Mentor_Community', path: '/community' },
    { icon: Settings, label: 'System', path: '/student/settings' },
  ];

  const recruiterMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/student/dashboard' },
    { icon: Briefcase, label: 'My_Job_Posts', path: '/student/gigs' },
    { icon: Users, label: 'Find_Talent', path: '/student/find-talent' },
    { icon: Users, label: 'Applicants', path: '/student/applications' },
    { icon: MessageCircle, label: 'Interviews', path: '/student/messages' },
    { icon: Star, label: 'Company_Profile', path: '/student/profile' },
    { icon: Settings, label: 'Settings', path: '/student/settings' },
  ];

  const mentorMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/mentor-dashboard' },
    { icon: Users, label: 'Community', path: '/community' },
    { icon: Briefcase, label: 'My_Gigs', path: '/student/gigs' },
    { icon: Briefcase, label: 'Sessions', path: '/mentor-dashboard' },
    { icon: MessageCircle, label: 'Notifications', path: '/student/messages' },
    { icon: User, label: 'Profile', path: '/student/profile' },
  ];

  let menuItems = studentMenuItems;
  if (user?.role === 'recruiter' || user?.role === 'Recruiter') {
    menuItems = recruiterMenuItems;
  } else if (user?.role === 'mentor' || user?.role === 'Mentor') {
    menuItems = mentorMenuItems;
  } else if (user?.role === 'Alumni/Mentor') {
    menuItems = studentMenuItems
      .filter(item => item.label !== 'Applications')
      .map(item => {
        if (item.label === 'Dashboard') return { ...item, path: '/mentor-dashboard' };
        if (item.label === 'Browse_Gigs') return { ...item, label: 'My_Gigs' };
        return item;
      });
  }

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-background border-r border-white/10 min-h-screen relative">
      {/* Decorative vertical line */}
      <div className="absolute left-6 top-0 bottom-0 w-px bg-white/5" />

      <div className="flex-1 flex flex-col pt-8 pb-4 overflow-y-auto">
        <nav className="flex-1 px-2 space-y-1 relative z-10">
          <div className="px-4 mb-6">
            <p className="text-xs text-text-muted uppercase tracking-widest font-mono">Navigation</p>
          </div>

          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  group flex items-center px-4 py-3 text-sm transition-all relative font-mono uppercase tracking-wider
                  ${isActive
                    ? 'text-primary bg-primary/5'
                    : 'text-text-muted hover:text-white hover:bg-white/5'
                  }
                `}
              >
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_rgba(204,255,0,0.5)]" />
                )}

                <item.icon className={`
                  mr-3 h-4 w-4 transition-colors
                  ${isActive ? 'text-primary' : 'text-text-muted group-hover:text-white'}
                `} />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto inline-flex items-center px-1.5 py-0.5 text-xs font-bold bg-accent text-black font-mono">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="px-2 mt-4 relative z-10">
          <button
            onClick={handleLogout}
            className="w-full group flex items-center px-4 py-3 text-sm font-mono uppercase tracking-wider text-text-muted hover:text-accent hover:bg-accent/5 transition-all"
          >
            <LogOut className="mr-3 h-4 w-4" />
            <span>Disconnect</span>
          </button>
        </div>
      </div>

      {/* Footer System Info */}
      <div className="p-4 border-t border-white/10 bg-surface/50">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-text-muted font-mono">SYSTEM ONLINE</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
