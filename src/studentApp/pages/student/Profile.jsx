import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Mail, Briefcase, Award, Edit, Save, X, Check, Code, ExternalLink, Loader2, AlertTriangle, Trash2 } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { updateUserProfile, deleteUserData } from '../../../lib/userService';
import { deleteUserAccount } from '../../../lib/authService';
import toast from 'react-hot-toast';

const StudentProfile = () => {
   const navigate = useNavigate();
   const { user, updateUser, logout } = useAuthStore();
   const [isEditing, setIsEditing] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   
   // Delete confirmation states
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [deleteStep, setDeleteStep] = useState(1);
   const [isDeleting, setIsDeleting] = useState(false);

   const [formData, setFormData] = useState({
      name: '',
      role: '',
      location: '',
      email: '',
      bio: '',
      skills: [],
      experience: '',
      education: '',
      portfolio: '',
      portfolioImage: '',
   });

   useEffect(() => {
      if (user) {
          setFormData({
             name: user.name || '',
             role: user.roleTitle || '',
             location: user.location || '',
             email: user.email || '',
             bio: user.bio || '',
             skills: user.skills || [],
             experience: user.experience || '',
             education: user.education || '',
             portfolio: user.portfolio || '',
             portfolioImage: user.portfolioImage || ''
          });
      }
   }, [user]);

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
   };

   const handleSkillsChange = (e) => {
      const skillsArray = e.target.value.split(',').map(s => s.trim());
      setFormData(prev => ({ ...prev, skills: skillsArray }));
   };

   const handleSave = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
         const baseUpdate = {
            name: formData.name,
            bio: formData.bio,
            location: formData.location || ''
         };
         const roleUpdate = {
            roleTitle: formData.role,
            skills: formData.skills,
            portfolio: formData.portfolio,
            portfolioImage: formData.portfolioImage
         };
         await updateUserProfile(user.uid, baseUpdate, roleUpdate);
         updateUser(formData);
         toast.success('PROFILE SYNCHRONIZED');
         setIsEditing(false);
      } catch (err) {
         toast.error('SYNC FAILED: ' + err.message);
      } finally {
         setIsLoading(false);
      }
   };

   const handleCancel = () => {
      setIsEditing(false);
      if (user) {
         setFormData({
            name: user.name || '',
            role: user.roleTitle || '',
            location: user.location || '',
            email: user.email || '',
            bio: user.bio || '',
            skills: user.skills || [],
            experience: user.experience || '',
            education: user.education || '',
            portfolio: user.portfolio || '',
            portfolioImage: user.portfolioImage || ''
         });
      }
   };

   const handleDeleteProfile = async () => {
      if (!user) return;
      setIsDeleting(true);
      try {
         // Delete Firestore Data
         await deleteUserData(user.uid, user.role);
         // Delete Authentication Account
         await deleteUserAccount();
         
         // Clear Store & redirect
         logout();
         toast.success('PROFILE DELETED PERMANENTLY');
         navigate('/student/login');
      } catch (error) {
         console.error("Deletion Error:", error);
         if (error.code === 'auth/requires-recent-login') {
            toast.error('SECURITY: Please log out and back in to verify identity before deletion.');
         } else {
            toast.error('DELETE FAILED: ' + (error.code || error.message));
         }
         setIsDeleting(false);
         setShowDeleteModal(false);
      }
   };

   return (
      <div className="min-h-screen bg-background font-mono selection:bg-primary selection:text-black">
         <Navbar />
         <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6 lg:p-10 relative overflow-hidden">
               <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-5xl mx-auto">

                  <div className="bg-surface border border-white/10 relative overflow-hidden mb-8 group">
                     <div className="h-48 bg-gradient-to-r from-primary/10 to-secondary/10 relative">
                        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                     </div>

                     <div className="px-8 pb-8 relative z-10 flex flex-col md:flex-row items-end gap-6 -mt-16">
                        <div className="w-32 h-32 bg-black rounded-full border-4 border-surface flex items-center justify-center relative group-hover:scale-105 transition-transform duration-500">
                           <div className="w-full h-full rounded-full bg-white/5 flex items-center justify-center text-4xl font-bold text-white overflow-hidden">
                              <span className="text-secondary">{formData.name ? formData.name.charAt(0) : 'U'}</span>
                           </div>
                           {isEditing && (
                              <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                                 <span className="text-[10px] uppercase text-white font-bold">Upload</span>
                              </div>
                           )}
                        </div>

                        <div className="flex-1 mb-2">
                           {isEditing ? (
                              <div className="space-y-4 max-w-md">
                                 <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/20 px-4 py-2 text-white font-bold text-2xl focus:border-primary focus:outline-none"
                                    placeholder="Name"
                                 />
                                 <input
                                    type="text"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/20 px-4 py-2 text-white text-sm focus:border-primary focus:outline-none"
                                    placeholder="Role (e.g. Full Stack Dev)"
                                 />
                              </div>
                           ) : (
                              <div>
                                 <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-cyan-400 animate-gradient-x">
                                    {formData.name}
                                 </h1>
                                 <p className="text-primary text-sm uppercase tracking-widest font-bold mb-1">{formData.role}</p>
                              </div>
                           )}

                           <div className="flex flex-wrap items-center gap-6 text-xs text-text-muted mt-4 uppercase tracking-wider">
                              <div className="flex items-center gap-2">
                                 <MapPin className="w-4 h-4 text-secondary" />
                                 {isEditing ? (
                                    <input
                                       type="text"
                                       name="location"
                                       value={formData.location}
                                       onChange={handleChange}
                                       className="bg-white/5 border border-white/20 px-2 py-1 text-white focus:border-primary focus:outline-none w-40"
                                    />
                                 ) : (
                                    <span>{formData.location}</span>
                                 )}
                              </div>
                              <div className="flex items-center gap-2">
                                 <Mail className="w-4 h-4 text-accent" />
                                 <span>{formData.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                 <Award className="w-4 h-4 text-yellow-500" />
                                 <span>Top Rated (4.8)</span>
                              </div>
                           </div>
                        </div>

                        <div className="flex flex-col gap-2 min-w-[140px]">
                           {isEditing ? (
                              <>
                                 <button
                                    onClick={handleSave}
                                    disabled={isLoading}
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-black font-bold uppercase tracking-wider hover:bg-white transition-colors text-xs disabled:opacity-50"
                                 >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
                                 </button>
                                 <button
                                    onClick={handleCancel}
                                    disabled={isLoading}
                                    className="flex items-center justify-center gap-2 px-6 py-3 border border-white/10 text-white font-bold uppercase tracking-wider hover:bg-white/5 transition-colors text-xs disabled:opacity-50"
                                 >
                                    <X className="w-4 h-4" /> Cancel
                                 </button>
                              </>
                           ) : (
                              <button
                                 onClick={() => setIsEditing(true)}
                                 className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-wider hover:bg-white/10 hover:border-primary transition-all text-xs"
                              >
                                 <Edit className="w-4 h-4" /> Edit_Profile
                              </button>
                           )}
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     <div className="lg:col-span-2 space-y-8">
                        <div className="bg-surface border border-white/10 p-8 relative group">
                           <h2 className="text-xl font-bold text-white uppercase mb-6 flex items-center gap-2">
                              <Briefcase className="w-5 h-5 text-secondary" />
                              About_<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-cyan-400 animate-gradient-x">Me</span>
                           </h2>
                           {isEditing ? (
                              <textarea
                                 name="bio"
                                 value={formData.bio}
                                 onChange={handleChange}
                                 rows={6}
                                 className="w-full bg-black/50 border border-white/20 p-4 text-white text-sm focus:border-primary focus:outline-none font-mono leading-relaxed"
                                 placeholder="Tell us about yourself..."
                              />
                           ) : (
                              <p className="text-text-muted text-sm leading-relaxed border-l-2 border-white/10 pl-4">
                                 {formData.bio || 'No bio provided yet.'}
                              </p>
                           )}
                        </div>

                        <div className="bg-surface border border-white/10 p-8">
                           <h2 className="text-xl font-bold text-white uppercase mb-6 flex items-center gap-2">
                              <Code className="w-5 h-5 text-accent" /> Skills_&_<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-cyan-400 animate-gradient-x">Stack</span>
                           </h2>
                           {isEditing ? (
                              <div>
                                 <p className="text-[10px] text-text-muted uppercase mb-2">Comma separated values</p>
                                 <input
                                    type="text"
                                    name="skills"
                                    value={formData.skills.join(', ')}
                                    onChange={handleSkillsChange}
                                    className="w-full bg-black/50 border border-white/20 p-4 text-white text-sm focus:border-primary focus:outline-none"
                                 />
                              </div>
                           ) : (
                              <div className="flex flex-wrap gap-2">
                                 {formData.skills.map((skill, index) => (
                                    <span key={index} className="px-3 py-1.5 bg-white/5 border border-white/10 text-white text-xs uppercase tracking-wider hover:border-primary/50 transition-colors cursor-default">
                                       {skill}
                                    </span>
                                 ))}
                              </div>
                           )}
                        </div>
                     </div>

                     <div className="space-y-8">
                        <div className="bg-surface border border-white/10 p-6">
                           <h3 className="text-sm font-bold text-white uppercase mb-4 tracking-wider">System_<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-cyan-400 animate-gradient-x">Status</span></h3>
                           <div className="space-y-4">
                              <div className="flex items-center justify-between text-xs text-text-muted">
                                 <span>Identity</span>
                                 <span className="text-green-500 flex items-center gap-1"><Check className="w-3 h-3" /> Verified</span>
                              </div>
                              <div className="flex items-center justify-between text-xs text-text-muted">
                                 <span>Email</span>
                                 <span className="text-green-500 flex items-center gap-1"><Check className="w-3 h-3" /> Verified</span>
                              </div>
                              <div className="pt-4 border-t border-white/10 mt-4">
                                 <p className="text-[10px] text-text-muted uppercase mb-2">Availability</p>
                                 <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-white text-xs font-bold uppercase">Open for Work</span>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="bg-surface border border-white/10 p-6">
                           <h3 className="text-sm font-bold text-white uppercase mb-4 tracking-wider flex justify-between items-center">
                              <span>Portfolio_<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-cyan-400 animate-gradient-x">Link</span></span>
                           </h3>
                           
                           {isEditing ? (
                              <div className="space-y-4">
                                 <div>
                                    <label className="text-[10px] text-text-muted uppercase mb-1 block">Portfolio Link</label>
                                    <input
                                       type="text"
                                       name="portfolio"
                                       value={formData.portfolio}
                                       onChange={handleChange}
                                       placeholder="https://yourportfolio.com"
                                       className="w-full bg-white/5 border border-white/20 px-4 py-2 text-white text-xs focus:border-primary focus:outline-none"
                                    />
                                 </div>
                                 <div>
                                    <label className="text-[10px] text-text-muted uppercase mb-1 block">Showcase Image URL</label>
                                    <input
                                       type="text"
                                       name="portfolioImage"
                                       value={formData.portfolioImage}
                                       onChange={handleChange}
                                       placeholder="https://image-url.com/preview.jpg"
                                       className="w-full bg-white/5 border border-white/20 px-4 py-2 text-white text-xs mb-4 focus:border-primary focus:outline-none"
                                    />
                                 </div>
                              </div>
                           ) : (
                              formData.portfolio ? (
                                 <a href={formData.portfolio.startsWith('http') ? formData.portfolio : `https://${formData.portfolio}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline text-xs mb-4 truncate">
                                    <ExternalLink className="w-4 h-4" /> {formData.portfolio}
                                 </a>
                              ) : (
                                 <p className="text-xs text-text-muted mb-4 uppercase">No portfolio link provided.</p>
                              )
                           )}

                           <div className="min-h-[160px] max-h-[300px] w-full bg-black/40 border border-white/10 flex flex-col items-center justify-center text-text-muted text-[10px] uppercase p-4 text-center group relative overflow-hidden">
                               {formData.portfolioImage ? (
                                   <img src={formData.portfolioImage} alt="Showcase" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                               ) : (
                                   <>
                                     <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                     <ExternalLink className="w-8 h-8 mb-2 opacity-50 group-hover:opacity-100 group-hover:text-primary transition-all" />
                                     <span className="relative z-10 transition-colors group-hover:text-white">Central Project Showcase Repository</span>
                                     <span className="relative z-10 text-[8px] mt-2 opacity-50">Sync your portfolio link and image above to share your work</span>
                                   </>
                               )}
                           </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="bg-surface border border-red-500/30 p-6 mt-8">
                           <h3 className="text-sm font-bold text-red-500 uppercase mb-4 tracking-wider flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4" /> Danger_Zone
                           </h3>
                           <p className="text-xs text-text-muted mb-4 leading-relaxed">
                              Once you delete your profile, there is no going back. All your data, applications, and settings will be permanently destroyed.
                           </p>
                           <button
                              onClick={() => {
                                 setShowDeleteModal(true);
                                 setDeleteStep(1);
                              }}
                              className="px-4 py-2 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white transition-colors text-xs uppercase tracking-wider font-bold w-full flex items-center justify-center gap-2"
                           >
                              <Trash2 className="w-4 h-4" /> Delete_Profile
                           </button>
                        </div>
                     </div>
                  </div>

               </motion.div>
            </main>
         </div>

         {/* Delete Confirmation Modal */}
         <AnimatePresence>
            {showDeleteModal && (
               <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                  <motion.div 
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     className="bg-surface border border-red-500 max-w-md w-full p-6 relative font-mono"
                  >
                     <h2 className="text-xl font-bold text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2 shadow-neon">
                        <AlertTriangle className="w-6 h-6 animate-pulse" /> System Warning
                     </h2>
                     
                     {deleteStep === 1 ? (
                        <>
                           <p className="text-white text-sm leading-relaxed mb-6">
                              WARNING: You are about to initiate the profile deletion sequence. All data will be <span className="text-red-500 font-bold">permanently wiped</span> from the servers.
                              <br /><br />
                              Are you absolutely sure you want to proceed?
                           </p>
                           <div className="flex gap-4">
                              <button
                                 onClick={() => setShowDeleteModal(false)}
                                 className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-wider hover:bg-white/10 transition-colors text-xs"
                              >
                                 Abort
                              </button>
                              <button
                                 onClick={() => setDeleteStep(2)}
                                 className="flex-1 px-4 py-3 bg-red-500/10 border border-red-500 text-red-500 font-bold uppercase tracking-wider hover:bg-red-500 hover:text-white transition-colors text-xs"
                              >
                                 Yes, Proceed
                              </button>
                           </div>
                        </>
                     ) : (
                        <>
                           <p className="text-white text-sm leading-relaxed mb-6 border-l-2 border-red-500 pl-4 bg-red-500/5 py-2">
                              FINAL CONFIRMATION: This action is <span className="text-red-500 font-bold">irreversible</span>. All records, connections, and system access will be terminated.
                              <br /><br />
                              Confirm deletion?
                           </p>
                           <div className="flex gap-4">
                              <button
                                 disabled={isDeleting}
                                 onClick={() => setShowDeleteModal(false)}
                                 className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-wider hover:bg-white/10 transition-colors text-xs disabled:opacity-50"
                              >
                                 Cancel
                              </button>
                              <button
                                 disabled={isDeleting}
                                 onClick={handleDeleteProfile}
                                 className="flex-1 px-4 py-3 bg-red-500 border border-red-500 text-white font-bold uppercase tracking-wider hover:bg-red-600 transition-colors text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                              >
                                 {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Delete Forever
                              </button>
                           </div>
                        </>
                     )}
                  </motion.div>
               </div>
            )}
         </AnimatePresence>
      </div>
   );
};

export default StudentProfile;
