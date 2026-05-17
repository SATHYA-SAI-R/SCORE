import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useAuthStore } from '../../store/authStore';
import { subscribeToStudentApplications } from '../../../lib/applicationService';
import { getUserProfile } from '../../../lib/userService';
import { getGigById } from '../../../lib/gigService';

const nameCache = {};
const gigCache = {};

const StudentApplications = () => {
  const { user } = useAuthStore();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (user?.uid) {
      const unsub = subscribeToStudentApplications(user.uid, async (data) => {
         const resolved = await Promise.all(data.map(async (app) => {
            let rName = app.recruiterName;
            
            // Check if name is missing or seems to be a raw ID/token
            if (!rName || rName === app.recruiterId || (rName && rName.length > 20 && !rName.includes(" "))) {
               if (nameCache[app.recruiterId]) {
                  rName = nameCache[app.recruiterId];
               } else {
                  try {
                    const prof = await getUserProfile(app.recruiterId);
                    if (prof && prof.name) {
                       rName = prof.name;
                       nameCache[app.recruiterId] = rName;
                    }
                  } catch(e) {
                     console.error("Fetch profile failed", e);
                     rName = rName || app.recruiterId;
                  }
               }
            }
            
            let gigTitle = app.gigTitle;
            if (!gigTitle || gigTitle === app.gigId) {
               if (gigCache[app.gigId]) {
                  gigTitle = gigCache[app.gigId];
               } else {
                  try {
                     const gig = await getGigById(app.gigId);
                     if (gig && gig.title) {
                        gigTitle = gig.title;
                        gigCache[app.gigId] = gigTitle;
                     }
                  } catch(e) {
                     console.error("Fetch gig failed", e);
                     gigTitle = app.gigId;
                  }
               }
            }

            return { ...app, resolvedRecruiterName: rName || app.recruiterId, resolvedGigTitle: gigTitle || app.gigId };
         }));
         setApplications(resolved);
      });
      return () => unsub();
    }
  }, [user]);

  const statusColors = {
    pending: 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10',
    accepted: 'text-green-500 border-green-500/30 bg-green-500/10',
    rejected: 'text-red-500 border-red-500/30 bg-red-500/10',
  };

  const statusIcons = {
    pending: Clock,
    accepted: CheckCircle,
    rejected: XCircle,
  };

  return (
    <div className="min-h-screen bg-background font-mono selection:bg-primary selection:text-black">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-10 relative overflow-hidden">
          {/* Background Grid */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10">
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-2 flex items-center gap-3">
              <FileText className="w-8 h-8 text-primary" />
              My_<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-cyan-400 animate-gradient-x">Applications</span>
            </h1>
            <p className="text-text-muted text-sm border-l-2 border-primary pl-4 mb-8">
              Track status of submitted proposals.
            </p>

            <div className="space-y-4">
              {applications.map((app, index) => {
                const StatusIcon = statusIcons[app.status];
                return (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-surface border border-white/10 p-6 hover:border-primary/50 transition-all group relative overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">{app.resolvedGigTitle}</h3>
                        <p className="text-text-muted text-xs font-mono mb-2">Recruiter: {app.resolvedRecruiterName}</p>
                        <div className="flex items-center space-x-4 text-[10px] text-text-muted uppercase tracking-wider">
                          <span>Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${statusColors[app.status] || statusColors.pending}`}>
                          {StatusIcon && <StatusIcon className="w-3 h-3" />}
                          {app.status}
                        </span>
                        <button className="p-2 border border-white/10 text-text-muted hover:text-white hover:bg-white/5 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default StudentApplications;
