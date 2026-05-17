import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Briefcase, DollarSign, Star, ArrowRight, Clock, MapPin, Zap, ExternalLink } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useAuthStore } from '../../store/authStore';
import { subscribeToGigs } from '../../../lib/gigService';
import { subscribeToStudentApplications, applyForGig } from '../../../lib/applicationService';
import { updateUserProfile } from '../../../lib/userService';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const { user, updateUser } = useAuthStore();
  const [recommendedGigs, setRecommendedGigs] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (user?.uid) {
      const unsubGigs = subscribeToGigs((data) => {
         const nonArchived = data.filter(gig => !user?.archivedGigs?.includes(gig.id));
         setRecommendedGigs(nonArchived.slice(0, 5));
      });
      const unsubApps = subscribeToStudentApplications(user.uid, setApplications);
      return () => {
        unsubGigs();
        unsubApps();
      };
    }
  }, [user]);

  const stats = [
    { icon: Briefcase, label: 'Applications', value: applications.length.toString(), change: 'Live data', color: 'text-primary' },
    { icon: TrendingUp, label: 'Active_Proj', value: '00', change: 'In progress', color: 'text-secondary' },
    { icon: DollarSign, label: 'Earnings', value: user?.totalEarnings?.toString() || '0', change: 'Lifetime', color: 'text-accent' },
    { icon: Star, label: 'Reputation', value: user?.rating?.toString() || 'New', change: 'Current rating', color: 'text-white' },
  ];

  const handleApply = async (gig) => {
    try {
      await applyForGig({
        gigId: gig.id,
        studentId: user.uid,
        studentName: user.name,
        coverLetter: "Standard fast-apply from dashboard",
        recruiterId: gig.postedBy
      });
      toast.success('APPLICATION SUBMITTED: ' + gig.title);
    } catch (err) {
      toast.error('APPLICATION FAILED: ' + err.message);
    }
  };

  const handleToggleArchive = async (gigId) => {
     if (!user?.uid) return;
     const currentArchived = user.archivedGigs || [];
     const isArchived = currentArchived.includes(gigId);
     
     let newArchived;
     if (isArchived) {
        newArchived = currentArchived.filter(id => id !== gigId);
     } else {
        newArchived = [...currentArchived, gigId];
     }
     
     try {
        await updateUserProfile(user.uid, { archivedGigs: newArchived });
        updateUser({ archivedGigs: newArchived });
        if (isArchived) {
           toast.success("Protocol removed from archives.");
        } else {
           toast.success("Protocol archived successfully.");
        }
     } catch (err) {
        toast.error("Failed to update archive status.");
     }
  };

  const activities = [
    { type: 'view', text: 'SYSTEM_ONLINE: Welcome to S_CORE_', time: 'Just now' },
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
            className="mb-12 relative z-10"
          >
            <div className="flex items-center space-x-4 mb-2">
              <div className="h-px w-10 bg-primary"></div>
              <p className="text-primary text-xs uppercase tracking-widest">Dashboard v2.1</p>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter shadow-neon">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-cyan-400 animate-gradient-x">{user?.name || 'OPERATIVE'}</span>
            </h1>
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
            {/* Recommended Gigs */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-8"
              >
                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                  <h2 className="text-xl font-bold text-white uppercase flex items-center">
                    <Zap className="w-5 h-5 text-primary mr-2" />
                    Available_Contracts
                  </h2>
                  <button className="flex items-center space-x-2 text-text-muted hover:text-white transition-colors text-xs uppercase tracking-wider group">
                    <span>View_All_Nodes</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="space-y-4">
                  {recommendedGigs.map((gig) => (
                    <div
                      key={gig.id}
                      className="bg-surface border border-white/10 p-6 hover:bg-white/5 transition-colors group relative"
                    >
                      {gig.featured && (
                        <div className="absolute -top-px -right-px bg-primary text-black text-[10px] font-bold px-2 py-1 uppercase">
                          Priority
                        </div>
                      )}
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">{gig.title}</h3>
                          <p className="text-text-muted text-sm mb-4 font-mono">{gig.recruiterName || gig.company || 'Unknown Entity'}</p>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {(gig.skills || []).map((skill) => (
                              <span
                                key={skill}
                                className="px-2 py-1 bg-black border border-white/20 text-white text-[10px] uppercase tracking-wider"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center space-x-6 text-xs text-text-muted font-mono uppercase">
                            <span className="flex items-center space-x-1">
                              <DollarSign className="w-3 h-3 text-primary" />
                              <span>{gig.budget || 'Negotiable'}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3 text-primary" />
                              <span>{gig.duration || 'Flexible'}</span>
                            </span>
                          </div>
                        </div>

                        <div className="flex md:flex-col gap-2">
                          <button
                            onClick={() => handleApply(gig)}
                            className="flex-1 bg-white text-black font-bold py-2 px-6 uppercase text-xs hover:bg-primary transition-colors clip-diagonal"
                          >
                            Apply
                          </button>
                          <button 
                             onClick={() => handleToggleArchive(gig.id)}
                             className={`px-4 py-2 border text-xs uppercase transition-colors ${
                                user?.archivedGigs?.includes(gig.id) 
                                   ? 'bg-primary/10 border-primary text-primary hover:bg-transparent hover:text-white hover:border-white/20' 
                                   : 'bg-transparent border-white/20 text-white hover:border-primary hover:text-primary'
                             }`}
                          >
                            {user?.archivedGigs?.includes(gig.id) ? 'Archived' : 'Archive'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Recent Activity */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-black border border-white/10 p-6 h-full"
              >
                <h2 className="text-xl font-bold text-white uppercase mb-6 flex items-center">
                  <div className="w-2 h-2 bg-secondary mr-3 animate-pulse"></div>
                  System_Logs
                </h2>
                <div className="space-y-6 relative">
                  <div className="absolute left-1.5 top-2 bottom-2 w-px bg-white/10"></div>
                  {activities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4 relative">
                      <div className="w-3 h-3 bg-black border border-primary rounded-full mt-1.5 z-10"></div>
                      <div className="flex-1">
                        <p className="text-white text-sm leading-tight mb-1 font-mono">{activity.text}</p>
                        <p className="text-[10px] text-text-muted uppercase tracking-widest">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
