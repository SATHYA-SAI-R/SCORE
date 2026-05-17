import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Clock, MapPin, Briefcase, FileText, CheckCircle } from 'lucide-react';

const GigDetailsModal = ({ isOpen, onClose, gig, onApply, isStudent }) => {
  if (!isOpen || !gig) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-background border border-white/10 shadow-2xl overflow-hidden font-mono"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-surface">
            <h2 className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Contract_Details
            </h2>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto w-full">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{gig.title}</h1>
              <p className="text-primary uppercase tracking-widest text-sm font-bold flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                {gig.recruiterName || gig.company || 'Unknown Entity'}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-surface border border-white/5 p-4 flex flex-col gap-1 items-center justify-center text-center">
                <DollarSign className="w-5 h-5 text-primary mb-1" />
                <span className="text-[10px] text-text-muted uppercase">Budget</span>
                <span className="text-sm text-white font-bold">{gig.budget || 'Negotiable'}</span>
              </div>
              <div className="bg-surface border border-white/5 p-4 flex flex-col gap-1 items-center justify-center text-center">
                <Clock className="w-5 h-5 text-secondary mb-1" />
                <span className="text-[10px] text-text-muted uppercase">Duration</span>
                <span className="text-sm text-white font-bold">{gig.duration || 'Flexible'}</span>
              </div>
              <div className="bg-surface border border-white/5 p-4 flex flex-col gap-1 items-center justify-center text-center">
                <MapPin className="w-5 h-5 text-accent mb-1" />
                <span className="text-[10px] text-text-muted uppercase">Location</span>
                <span className="text-sm text-white font-bold">{gig.location || 'Remote'}</span>
              </div>
              <div className="bg-surface border border-white/5 p-4 flex flex-col gap-1 items-center justify-center text-center">
                <CheckCircle className="w-5 h-5 text-green-500 mb-1" />
                <span className="text-[10px] text-text-muted uppercase">Status</span>
                <span className="text-sm text-white font-bold uppercase">{gig.status || 'Active'}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-bold uppercase tracking-widest border-b border-white/10 pb-2">Description</h3>
              <p className="text-text-muted leading-relaxed whitespace-pre-wrap text-sm">
                {gig.description || 'No detailed description provided parameter array.'}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-bold uppercase tracking-widest border-b border-white/10 pb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {gig.skills && gig.skills.length > 0 ? (
                  gig.skills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-white/5 border border-white/10 text-white text-xs uppercase tracking-wider">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-text-muted text-sm">N/A</span>
                )}
              </div>
            </div>

          </div>

          {/* Footer actions */}
          <div className="p-6 border-t border-white/10 bg-surface flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-white/10 text-white font-bold uppercase text-xs hover:bg-white/5 transition-colors"
            >
              Close
            </button>
            {isStudent && (
              <button
                onClick={() => {
                  onApply(gig);
                  onClose();
                }}
                className="px-6 py-2 bg-primary text-black font-bold uppercase text-xs hover:bg-white transition-colors clip-diagonal"
              >
                Accept_Contract
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default GigDetailsModal;
