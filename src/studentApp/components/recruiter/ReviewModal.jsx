import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, AlertCircle, Loader2 } from 'lucide-react';
import { createReview } from '../../../lib/reviewService';
import { updateApplicationStatus } from '../../../lib/applicationService';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

const MandatoryReviewModal = ({ isOpen, onClose, applicant, gigId, gigTitle }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthStore();

  if (!isOpen || !applicant) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating before submitting.');
      return;
    }
    if (comment.trim().length < 10) {
      toast.error('Please provide a descriptive text review (min 10 chars).');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Save Review and Update Aggregate Profile stats transactionally
      await createReview(
        gigId, 
        gigTitle, 
        applicant.studentId, 
        user.uid, 
        rating, 
        comment
      );
      
      // 2. Mark the application status as 'completed'
      await updateApplicationStatus(applicant.id, 'completed');
      
      toast.success('Review submitted successfully. Contract complete.');
      onClose(); // Allow closing only after successful commit
    } catch (err) {
      toast.error('Failed to submit review: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop - Explicitly removed onClose from backdrop click to force mandatory completion! */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-surface border-2 border-primary shadow-2xl p-8 font-mono"
        >
          <div className="flex items-start justify-between mb-6 border-b border-primary/30 pb-4">
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter shadow-neon mb-1">
                CONTRACT_<span className="text-primary">EVALUATION</span>
              </h2>
              <p className="text-xs text-primary uppercase tracking-widest flex items-center gap-2">
                <AlertCircle className="w-3 h-3" /> Mandatory Performance Review
              </p>
            </div>
            {/* NO CLOSE BUTTON - MUST COMPLETE */}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-black/40 p-4 border border-white/10 text-center">
              <p className="text-sm text-text-muted mb-2 uppercase">Evaluating</p>
              <p className="text-xl font-bold text-white uppercase tracking-wider">{applicant.resolvedName}</p>
              <p className="text-xs text-primary font-bold mt-1 uppercase">{gigTitle}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-widest mb-3 text-center">Select Rating</label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        star <= (hoveredRating || rating)
                          ? 'fill-primary text-primary drop-shadow-[0_0_8px_rgba(204,255,0,0.6)]'
                          : 'text-white/20'
                      } transition-colors duration-200`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-widest mb-2">Public_Feedback_Log</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Detail the student's performance, communication, and execution..."
                rows={4}
                required
                className="w-full bg-black/50 border border-white/20 p-4 text-white text-sm focus:border-primary focus:outline-none placeholder:text-white/20 font-mono transition-colors"
              />
              <p className="text-[10px] text-text-muted mt-2 text-right">Min 10 chars | Visible on student profile</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || rating === 0 || comment.length < 10}
              className="w-full flex justify-center items-center py-4 bg-primary text-black font-black uppercase tracking-widest text-sm hover:bg-white transition-colors clip-diagonal disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-text-muted mt-8"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'SUBMIT_EVALUATION & CLOSE'}
            </button>
            <div className="text-center mt-4">
              <button 
                type="button" 
                onClick={onClose} 
                className="text-[10px] text-text-muted hover:text-white uppercase underline underline-offset-4"
              >
                Abort & Return to Applications
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MandatoryReviewModal;
