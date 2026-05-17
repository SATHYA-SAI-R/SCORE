import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, Calendar, TrendingUp, Search, MessageSquare, Plus, Bell } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';
import PostGigModal from '../../components/recruiter/PostGigModal';
import { subscribeToRecruiterGigs, updateGig } from '../../../lib/gigService';
import { subscribeToRecruiterApplications } from '../../../lib/applicationService';
import ManageTeamModal from '../../components/recruiter/ManageTeamModal';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const RecruiterDashboard = () => {
  const { user } = useAuthStore();
  const [isPostGigOpen, setIsPostGigOpen] = useState(false);
  const [activePostings, setActivePostings] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [manageTeamGig, setManageTeamGig] = useState(null);

  useEffect(() => {
    if (user?.uid) {
      const unsubGigs = subscribeToRecruiterGigs(user.uid, setActivePostings);
      const unsubApps = subscribeToRecruiterApplications(user.uid, (apps) => setRecentApplications(apps.slice(0, 5)));
      return () => {
        unsubGigs();
        unsubApps();
      };
    }
  }, [user]);

  const handleStatusChange = async (gigId, newStatus) => {
    try {
      await updateGig(gigId, { status: newStatus });
      toast.success(`Gig status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const stats = [
    { icon: FileText, label: 'Applications', value: recentApplications.length.toString(), change: 'Live total', color: 'text-primary' },
    { icon: Users, label: 'Gigs', value: activePostings.length.toString(), change: 'Active gigs', color: 'text-secondary' },
    { icon: TrendingUp, label: 'Hires', value: user?.totalHired?.toString() || '0', change: 'Total Hired', color: 'text-accent' },
    { icon: MessageSquare, label: 'Messages', value: '0', change: '0 Unread', color: 'text-white' },
  ];

  return (
    <div className="min-h-screen bg-background font-mono selection:bg-primary selection:text-black">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-10 relative overflow-hidden">
          {/* Background Grid */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-12 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div>
              <div className="flex items-center space-x-4 mb-2">
                <div className="h-px w-10 bg-primary"></div>
                <p className="text-primary text-xs uppercase tracking-widest">Recruiter Terminal v1.0</p>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter shadow-neon">
                Dashboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-cyan-400 animate-gradient-x">Create</span>
              </h1>
            </div>

            <button
              onClick={() => setIsPostGigOpen(true)}
              className="bg-primary hover:bg-white text-black font-bold py-3 px-6 uppercase tracking-widest text-xs transition-all clip-diagonal flex items-center gap-2 group"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              <span>Post_New_Gig</span>
            </button>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 relative z-10">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-surface border border-white/10 p-6 hover:bg-primary/10 hover:border-primary/50 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity">
                  <stat.icon className={`w-8 h-8 ${stat.color} opacity-20 group-hover:opacity-100 transition-all`} />
                </div>
                <div className="relative z-10">
                  <div className="text-3xl font-bold text-white mb-1 group-hover:scale-110 transition-transform origin-left">{stat.value}</div>
                  <div className="text-xs text-text-muted uppercase tracking-wider mb-4">{stat.label}</div>
                  <div className="text-xs text-primary bg-primary/10 inline-block px-2 py-1 border border-primary/20">
                    {stat.change}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            {/* Recent Applications */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-surface border border-white/10 p-6"
              >
                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                  <h2 className="text-xl font-bold text-white uppercase flex items-center">
                    <FileText className="w-5 h-5 text-primary mr-2" />
                    Incoming_Applications
                  </h2>
                  <Link to="/student/applications" className="text-xs text-text-muted hover:text-white uppercase tracking-wider">
                    View_All
                  </Link>
                </div>

                <div className="space-y-4">
                  {recentApplications.map((app) => (
                    <div
                      key={app.id}
                      className="bg-black/40 border border-white/5 p-4 hover:bg-white/5 transition-colors group flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white font-bold uppercase">
                          {(app.studentName || 'U').charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-sm group-hover:text-primary transition-colors">{app.studentName || 'Unknown Applicant'}</h3>
                          <p className="text-text-muted text-xs font-mono">{new Date(app.appliedAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-primary font-bold text-sm mb-1">{app.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Active Postings */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-surface border border-white/10 p-6 h-full"
              >
                <h2 className="text-xl font-bold text-white uppercase mb-6 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-secondary" />
                  Active_Protocols
                </h2>
                <div className="space-y-4">
                  {activePostings.map((post) => (
                    <div key={post.id} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-white font-bold text-sm">{post.title}</h3>
                        <div className="flex items-center gap-2">
                          <select 
                            value={post.status || 'hiring'}
                            onChange={(e) => handleStatusChange(post.id, e.target.value)}
                            className={`text-[10px] uppercase font-bold tracking-widest bg-black border px-2 py-1 outline-none
                              ${post.status === 'hiring' || post.status === 'open' ? 'text-primary border-primary/30' : 
                                post.status === 'ongoing' ? 'text-blue-400 border-blue-400/30' :
                                'text-green-500 border-green-500/30'}
                            `}
                          >
                            <option value="hiring">Hiring</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-between text-[10px] text-text-muted font-mono uppercase mt-2">
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        <span>{post.duration}</span>
                      </div>
                      
                      {post.status !== 'hiring' && post.status !== 'open' && (
                         <div className="mt-4 pt-4 border-t border-white/10">
                            <button 
                               onClick={() => setManageTeamGig(post)} 
                               className="w-full py-2 bg-primary/10 border border-primary/50 text-primary hover:bg-primary hover:text-black font-bold uppercase text-xs tracking-widest transition-colors flex justify-center items-center gap-2"
                            >
                               <Users className="w-4 h-4" />
                               Manage Team ({post.status})
                            </button>
                         </div>
                      )}
                    </div>
                  ))}
                </div>

                <Link 
                  to="/student/gigs" 
                  className="w-full mt-6 py-2 border border-white/10 text-text-muted hover:text-white hover:border-white transition-colors text-xs uppercase tracking-widest block text-center"
                >
                  Manage_Micros
                </Link>
              </motion.div>
            </div>
          </div>
        </main>
      </div>

      <PostGigModal isOpen={isPostGigOpen} onClose={() => setIsPostGigOpen(false)} />
      
      {manageTeamGig && (
         <ManageTeamModal isOpen={!!manageTeamGig} onClose={() => setManageTeamGig(null)} gig={manageTeamGig} />
      )}
    </div>
  );
};

export default RecruiterDashboard;
