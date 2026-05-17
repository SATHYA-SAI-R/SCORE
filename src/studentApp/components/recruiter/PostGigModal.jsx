import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, DollarSign, Clock, Hash, Code, Save, Zap, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { createGig, updateGig } from '../../../lib/gigService';

const PostGigModal = ({ isOpen, onClose, initialData }) => {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    role: '',
    skills: '',
    budget: '',
    duration: '1 Month',
    type: 'Project',
  });

  // Load initial data for edits
  React.useEffect(() => {
    if (initialData && isOpen) {
       setFormData({
          ...initialData,
          skills: Array.isArray(initialData.skills) ? initialData.skills.join(', ') : (initialData.skills || '')
       });
    } else if (isOpen) {
       // reset
       setFormData({
          title: '',
          description: '',
          role: '',
          skills: '',
          budget: '',
          duration: '1 Month',
          type: 'Project',
       });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);
    
    try {
      // Split skills string into array
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
      
      if (initialData?.id) {
         // Update existing
         await updateGig(initialData.id, {
            title: formData.title,
            description: formData.description,
            type: formData.type,
            budget: formData.budget,
            duration: formData.duration,
            skills: skillsArray,
         });
         toast.success("PROTOCOL_UPDATED: Gig updated successfully!", {
             style: { background: '#000', color: '#CCFF00', border: '1px solid #CCFF00' }
         });
      } else {
         // Create new
         await createGig({
            title: formData.title,
            description: formData.description,
            type: formData.type,
            budget: formData.budget,
            duration: formData.duration,
            skills: skillsArray,
            postedBy: user.uid,
            recruiterName: user.name || user.email,
            company: user.company || user.institution || "Unknown Company",
            applicants: 0
         });
         toast.success("PROTOCOL_INITIATED: New gig posted successfully!", {
             style: { background: '#000', color: '#CCFF00', border: '1px solid #CCFF00' }
         });
      }
      


      onClose();
      setFormData({
          title: '',
          description: '',
          role: '',
          skills: '',
          budget: '',
          duration: '1 Month',
          type: 'Project',
      });
    } catch (err) {
      toast.error('FAILED TO POST: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="relative w-full max-w-2xl bg-surface border border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-primary/5 to-transparent">
               <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" /> {initialData?.id ? 'Edit_Protocol' : 'Post_New_Protocol'}
               </h2>
               <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
                  <X className="w-5 h-5" />
               </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
               
               <div className="space-y-4">
                  <div>
                     <label className="block text-xs uppercase text-text-muted mb-1 font-bold">Job_Title</label>
                     <div className="relative group">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                        <input
                           required
                           type="text"
                           name="title"
                           value={formData.title}
                           onChange={handleChange}
                           placeholder="e.g. Senior React Developer needed for DeFi Protocol"
                           className="w-full bg-black/50 border border-white/20 py-3 pl-10 pr-4 text-white text-sm focus:border-primary focus:outline-none transition-colors"
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs uppercase text-text-muted mb-1 font-bold">Role_Type</label>
                        <select
                           name="type"
                           value={formData.type}
                           onChange={handleChange}
                           className="w-full bg-black/50 border border-white/20 py-3 px-4 text-white text-sm focus:border-primary focus:outline-none appearance-none"
                        >
                           <option value="Project">Contract / Project</option>
                           <option value="Internship">Internship</option>
                           <option value="Full-time">Full-time Employment</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-xs uppercase text-text-muted mb-1 font-bold">Duration</label>
                        <div className="relative group">
                           <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                           <input
                              type="text"
                              name="duration"
                              value={formData.duration}
                              onChange={handleChange}
                              placeholder="e.g. 3 Months"
                              className="w-full bg-black/50 border border-white/20 py-3 pl-10 pr-4 text-white text-sm focus:border-primary focus:outline-none transition-colors"
                           />
                        </div>
                     </div>
                  </div>

                  <div>
                     <label className="block text-xs uppercase text-text-muted mb-1 font-bold">Budget / Compensation</label>
                     <div className="relative group">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                        <input
                           required
                           type="text"
                           name="budget"
                           value={formData.budget}
                           onChange={handleChange}
                           placeholder="e.g. $5000 - $8000 or $40/hr"
                           className="w-full bg-black/50 border border-white/20 py-3 pl-10 pr-4 text-white text-sm focus:border-primary focus:outline-none transition-colors"
                        />
                     </div>
                  </div>

                  <div>
                     <label className="block text-xs uppercase text-text-muted mb-1 font-bold">Required_Skills_Stack</label>
                     <div className="relative group">
                        <Code className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                        <input
                           required
                           type="text"
                           name="skills"
                           value={formData.skills}
                           onChange={handleChange}
                           placeholder="Comma separated: React, Node.js, Solidity..."
                           className="w-full bg-black/50 border border-white/20 py-3 pl-10 pr-4 text-white text-sm focus:border-primary focus:outline-none transition-colors"
                        />
                     </div>
                  </div>

                  <div>
                     <label className="block text-xs uppercase text-text-muted mb-1 font-bold">Protocol_Description</label>
                     <div className="relative group">
                        <Hash className="absolute left-3 top-4 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                        <textarea
                           required
                           name="description"
                           value={formData.description}
                           onChange={handleChange}
                           rows={5}
                           placeholder="Describe the project requirements, deliverables, and expectations..."
                           className="w-full bg-black/50 border border-white/20 py-3 pl-10 pr-4 text-white text-sm focus:border-primary focus:outline-none transition-colors font-mono leading-relaxed"
                        />
                     </div>
                  </div>
               </div>

               <div className="pt-4 border-t border-white/10 flex justify-end gap-4">
                  <button
                     type="button"
                     onClick={onClose}
                     disabled={isLoading}
                     className="px-6 py-3 border border-white/10 text-white font-bold uppercase tracking-wider hover:bg-white/5 transition-colors text-xs disabled:opacity-50"
                  >
                     Cancel_Op
                  </button>
                  <button
                     type="submit"
                     disabled={isLoading}
                     className="px-6 py-3 bg-primary text-black font-bold uppercase tracking-wider hover:bg-white transition-colors text-xs flex items-center gap-2 disabled:opacity-50"
                  >
                     {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                     {isLoading ? 'Processing...' : (initialData?.id ? 'Update_Protocol' : 'Initiate_Protocol')}
                  </button>
               </div>

            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PostGigModal;
