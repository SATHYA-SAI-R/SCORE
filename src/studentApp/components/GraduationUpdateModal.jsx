import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Calendar, Loader2 } from 'lucide-react';
import { updateUserProfile } from '../../lib/userService';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const GraduationUpdateModal = () => {
   const { user, updateUser } = useAuthStore();
   const [isLoading, setIsLoading] = useState(false);
   const [formData, setFormData] = useState({
      graduationMonth: '',
      graduationYear: ''
   });

   const handleChange = (e) => {
      setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!formData.graduationMonth || !formData.graduationYear) {
         toast.error("Please fill in both fields");
         return;
      }
      setIsLoading(true);
      try {
         // Clear the flag from the base user document
         const baseUpdate = { needsGraduationUpdate: false };
         // Update the role data
         const roleUpdate = { 
            graduationMonth: formData.graduationMonth,
            graduationYear: formData.graduationYear,
         };
         
         await updateUserProfile(user.uid, baseUpdate, roleUpdate);
         
         // Update auth store to remove modal
         updateUser({ 
            needsGraduationUpdate: false,
            graduationMonth: formData.graduationMonth,
            graduationYear: formData.graduationYear
         });
         
         toast.success("Graduation details updated successfully.");
      } catch (err) {
         toast.error("Update failed: " + err.message);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 font-mono selection:bg-primary selection:text-black text-white">
         <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-surface border-2 border-primary max-w-md w-full p-8 relative overflow-hidden shadow-[0_0_30px_rgba(204,255,0,0.15)]"
         >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] -mr-16 -mt-16 pointer-events-none"></div>
            
            <h2 className="text-2xl font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-3 shadow-neon">
               <AlertTriangle className="w-8 h-8 text-primary animate-pulse" /> Profile Update Required
            </h2>
            
            <p className="text-sm font-mono text-text-muted mb-8 leading-relaxed border-l-2 border-primary/50 pl-4 py-1">
               Congratulations! You have transitioned to a College Student class. Please provide your new projected graduation date.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="space-y-4">
                  <div className="group">
                     <label className="block text-[10px] uppercase tracking-widest text-text-muted mb-2 group-focus-within:text-primary transition-colors">
                        New Graduation Date
                     </label>
                     <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <div className="flex space-x-2">
                           <select
                              name="graduationMonth"
                              value={formData.graduationMonth}
                              onChange={handleChange}
                              className="w-1/2 bg-black border border-white/20 py-3 pl-12 pr-4 text-sm text-white focus:border-primary focus:outline-none transition-colors font-mono appearance-none"
                              required
                           >
                              <option value="">MONTH</option>
                              <option value="1">JANUARY</option>
                              <option value="2">FEBRUARY</option>
                              <option value="3">MARCH</option>
                              <option value="4">APRIL</option>
                              <option value="5">MAY</option>
                              <option value="6">JUNE</option>
                              <option value="7">JULY</option>
                              <option value="8">AUGUST</option>
                              <option value="9">SEPTEMBER</option>
                              <option value="10">OCTOBER</option>
                              <option value="11">NOVEMBER</option>
                              <option value="12">DECEMBER</option>
                           </select>
                           <select
                              name="graduationYear"
                              value={formData.graduationYear}
                              onChange={handleChange}
                              className="w-1/2 bg-black border border-white/20 py-3 pl-4 pr-4 text-sm text-white focus:border-primary focus:outline-none transition-colors font-mono appearance-none"
                              required
                           >
                              <option value="">YEAR</option>
                              {[...Array(7)].map((_, i) => {
                                 const year = new Date().getFullYear() + i;
                                 return <option key={year} value={year}>{year}</option>;
                              })}
                           </select>
                        </div>
                     </div>
                  </div>
               </div>

               <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-white text-black font-bold py-4 uppercase tracking-widest transition-all clip-diagonal flex items-center justify-center gap-2 group disabled:opacity-50"
               >
                  {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <span>Update Database</span>}
               </button>
            </form>
         </motion.div>
      </div>
   );
};

export default GraduationUpdateModal;
