import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Check, AlertCircle } from 'lucide-react';
import { subscribeToRecruiterApplications } from '../../../lib/applicationService';
import { useAuthStore } from '../../store/authStore';
import MandatoryReviewModal from './ReviewModal';

const ManageTeamModal = ({ isOpen, onClose, gig }) => {
  const { user } = useAuthStore();
  const [teamMembers, setTeamMembers] = useState([]);
  const [reviewModalData, setReviewModalData] = useState(null);

  useEffect(() => {
    if (!user?.uid || !gig?.id || !isOpen) return;

    const unsub = subscribeToRecruiterApplications(user.uid, (apps) => {
      // Filter for applications that belong to this gig and are either accepted or completed
      const relevantApps = apps.filter(app => 
         app.gigId === gig.id && 
         (app.status === 'accepted' || app.status === 'completed')
      );
      setTeamMembers(relevantApps);
    });

    return () => unsub();
  }, [user, gig, isOpen]);

  const handleOpenReview = (applicant) => {
    // We pass resolved properties expected by MandatoryReviewModal
    setReviewModalData({
        applicant: { ...applicant, resolvedName: applicant.studentName },
        gigId: gig.id,
        gigTitle: gig.title
    });
  };

  if (!isOpen || !gig) return null;

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-surface border border-white/10 shadow-2xl overflow-hidden font-mono"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-primary/5 to-transparent">
              <div>
                 <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" /> Active_Team
                 </h2>
                 <p className="text-xs text-primary mt-1 uppercase tracking-widest">{gig.title}</p>
              </div>
               <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
                  <X className="w-5 h-5" />
               </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
               {teamMembers.length === 0 ? (
                  <div className="text-center py-12 text-text-muted uppercase text-sm border border-dashed border-white/10">
                     No hired contractors found for this protocol.
                  </div>
               ) : (
                  <div className="space-y-4">
                     {teamMembers.map(member => (
                        <div key={member.id} className="bg-black/40 border border-white/10 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-bold text-white uppercase">
                                 {(member.studentName || 'U').charAt(0)}
                              </div>
                              <div>
                                 <div className="font-bold text-white uppercase text-sm">{member.studentName || 'Unknown Handler'}</div>
                                 <div className={`text-[10px] uppercase font-bold tracking-widest ${
                                    member.status === 'completed' ? 'text-blue-400' : 'text-green-500'
                                 }`}>
                                    Status: {member.status}
                                 </div>
                              </div>
                           </div>
                           
                           {member.status === 'accepted' ? (
                              <button 
                                 onClick={() => handleOpenReview(member)}
                                 className="w-full md:w-auto px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-black transition-colors text-xs font-bold flex items-center justify-center gap-2 uppercase tracking-widest"
                              >
                                 <Check className="w-4 h-4" /> Mark_Complete
                              </button>
                           ) : (
                              <div className="text-xs text-blue-400 border border-blue-400/30 px-3 py-2 uppercase bg-blue-400/5">
                                 Contract Completed
                              </div>
                           )}
                        </div>
                     ))}
                  </div>
               )}
            </div>
            
            <div className="p-4 bg-black/40 border-t border-white/10">
               <p className="text-[10px] text-text-muted uppercase tracking-widest flex items-center gap-2">
                  <AlertCircle className="w-3 h-3 text-secondary" /> When changing a gig status to Completed, ensure you Mark Complete each member to file mandatory reviews.
               </p>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Embedded Mandatory Review Modal handling the complete flow */}
      {reviewModalData && (
         <MandatoryReviewModal 
            isOpen={!!reviewModalData}
            onClose={() => setReviewModalData(null)}
            applicant={reviewModalData.applicant}
            gigId={reviewModalData.gigId}
            gigTitle={reviewModalData.gigTitle}
         />
      )}
    </>
  );
};

export default ManageTeamModal;
