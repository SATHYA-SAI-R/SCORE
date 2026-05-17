import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Filter, Download, MessageSquare, Check, X, Eye } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { subscribeToRecruiterApplications, updateApplicationStatus } from '../../../lib/applicationService';
import { getUserProfile } from '../../../lib/userService';
import { getGigById } from '../../../lib/gigService';
import toast from 'react-hot-toast';
import MandatoryReviewModal from '../../components/recruiter/ReviewModal';

const nameCache = {};
const gigCache = {};

const RecruiterApplications = () => {
  const { user } = useAuthStore();
  const [applicants, setApplicants] = useState([]);
  const [reviewModalData, setReviewModalData] = useState(null);

  useEffect(() => {
    if (user?.uid) {
      const unsub = subscribeToRecruiterApplications(user.uid, async (data) => {
         const resolved = await Promise.all(data.map(async (app) => {
            let name = app.studentName;
            
            // Check if name is missing or seems to be a raw ID/token
            if (!name || name === app.studentId || (name && name.length > 20 && !name.includes(" "))) {
               if (nameCache[app.studentId]) {
                  name = nameCache[app.studentId];
               } else {
                  try {
                    const prof = await getUserProfile(app.studentId);
                    if (prof && prof.name) {
                       name = prof.name;
                       nameCache[app.studentId] = name;
                    }
                  } catch(e) {
                     console.error("Fetch profile failed", e);
                     name = name || 'Unknown Applicant';
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

            return { ...app, resolvedName: name || 'Unknown Applicant', resolvedGigTitle: gigTitle || app.gigId };
         }));
         setApplicants(resolved);
      });
      return () => unsub();
    }
  }, [user]);

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      await updateApplicationStatus(appId, newStatus);
      toast.success(`Applicant ${newStatus} successfully!`);
    } catch (error) {
      toast.error('Failed to update: ' + error.message);
    }
  };

  const handleOpenReview = (applicant) => {
    setReviewModalData({
        applicant,
        gigId: applicant.gigId,
        gigTitle: applicant.resolvedGigTitle
    });
  };

  return (
    <div className="min-h-screen bg-background font-mono selection:bg-primary selection:text-black">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-10 relative overflow-hidden">
          {/* Background Grid */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative z-10 mb-8">
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-2 flex items-center gap-3">
               <Users className="w-8 h-8 text-primary" />
               Applicant_Common
            </h1>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
               <p className="text-text-muted text-sm border-l-2 border-primary pl-4">
                  Manage incoming talent protocols.
               </p>
               <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 border border-white/10 bg-black text-xs text-white uppercase tracking-wider hover:border-primary transition-colors">
                     <Filter className="w-3 h-3" /> Filter
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-white/10 bg-black text-xs text-white uppercase tracking-wider hover:border-primary transition-colors">
                     <Download className="w-3 h-3" /> Export_CSV
                  </button>
               </div>
            </div>
          </motion.div>

          <div className="relative z-10 grid grid-cols-1 gap-4">
             {applicants.map((applicant, index) => (
                <motion.div
                   key={applicant.id}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: index * 0.1 }}
                   className="bg-surface border border-white/10 p-6 hover:border-primary/50 transition-all group"
                >
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-xl font-bold text-white border border-white/20 uppercase">
                            {(applicant.resolvedName || 'U').charAt(0)}
                         </div>
                         <div>
                            <div className="flex items-center gap-2 mb-1">
                               <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{applicant.resolvedName}</h3>
                               <span className={`text-[10px] px-2 py-0.5 border rounded-full uppercase tracking-wider
                                  ${applicant.status === 'pending' ? 'text-yellow-500 border-yellow-500/30' : 
                                    applicant.status === 'interview' ? 'text-blue-500 border-blue-500/30' : 
                                    applicant.status === 'rejected' ? 'text-red-500 border-red-500/30' :
                                    'text-green-500 border-green-500/30'}
                               `}>
                                  {applicant.status}
                               </span>
                            </div>
                            <p className="text-text-muted text-xs font-mono">Applied on: <span className="text-white">{new Date(applicant.appliedAt).toLocaleDateString()}</span></p>
                         </div>
                      </div>

                       <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                         <div className="text-right hidden md:block">
                            <div className="text-primary font-bold text-lg">{applicant.resolvedGigTitle}</div>
                            <div className="text-[10px] text-text-muted uppercase tracking-wider">Gig_Title</div>
                         </div>
                         
                         <div className="flex items-center gap-2">
                            <Link to={`/student/applicant/${applicant.studentId}`} className="p-2 border border-white/10 text-white hover:bg-white/10 transition-colors" title="View Profile">
                               <Eye className="w-4 h-4" />
                            </Link>
                            <button className="p-2 border border-white/10 text-white hover:bg-white/10 transition-colors" title="Message">
                               <MessageSquare className="w-4 h-4" />
                            </button>
                            {(applicant.status === 'pending' || applicant.status === 'interview') && (
                              <>
                                <button onClick={() => handleStatusUpdate(applicant.id, 'accepted')} className="p-2 border border-green-500/30 text-green-500 hover:bg-green-500/10 transition-colors" title="Shortlist / Accept">
                                   <Check className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleStatusUpdate(applicant.id, 'rejected')} className="p-2 border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors" title="Reject">
                                   <X className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {applicant.status === 'accepted' && (
                               <button 
                                  onClick={() => handleOpenReview(applicant)} 
                                  className="p-2 border border-primary/50 text-black bg-primary/20 hover:bg-primary transition-colors flex items-center gap-2" 
                                  title="Mark Completed"
                               >
                                  <span className="text-[10px] font-bold uppercase tracking-widest hidden md:inline">Mark Completed</span>
                                  <Check className="w-4 h-4" />
                               </button>
                            )}
                         </div>
                      </div>
                   </div>
                </motion.div>
             ))}
          </div>

        </main>
      </div>

      {reviewModalData && (
         <MandatoryReviewModal 
            isOpen={!!reviewModalData}
            onClose={() => setReviewModalData(null)}
            applicant={reviewModalData.applicant}
            gigId={reviewModalData.gigId}
            gigTitle={reviewModalData.gigTitle}
         />
      )}
    </div>
  );
};

export default RecruiterApplications;
