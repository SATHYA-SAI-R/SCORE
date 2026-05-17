import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Briefcase, Edit, Save, X, Globe, Building, Check, Loader2 } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useAuthStore } from '../../store/authStore';
import PostGigModal from '../../components/recruiter/PostGigModal';
import { updateUserProfile } from '../../../lib/userService';
import toast from 'react-hot-toast';

const RecruiterProfile = () => {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isPostGigOpen, setIsPostGigOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    email: '',
    bio: '',
    company: '',
    website: '',
    industry: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        location: user.location || 'San Francisco, CA',
        email: user.email || '',
        bio: user.bio || 'We are a leading tech company looking for the best talent in the universe.',
        company: user.company || 'TechCorp Inc.',
        website: user.website || 'https://techcorp.com',
        industry: user.industry || 'Software & Technology',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
       const baseUpdate = {
          name: formData.name,
          bio: formData.bio,
          location: formData.location || '',
       };
       const roleUpdate = {
          company: formData.company,
          website: formData.website,
          industry: formData.industry,
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
        location: user.location || 'San Francisco, CA',
        email: user.email || '',
        bio: user.bio || '',
        company: user.company || '',
        website: user.website || '',
        industry: user.industry || '',
      });
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
                        <Building className="w-12 h-12 text-primary" />
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
                              name="company"
                              value={formData.company}
                              onChange={handleChange}
                              className="w-full bg-white/5 border border-white/20 px-4 py-2 text-white text-sm focus:border-primary focus:outline-none"
                              placeholder="Company Name"
                           />
                        </div>
                     ) : (
                        <div>
                           <h1 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                              {formData.name} 
                              {formData.company && <span className="text-lg font-normal text-text-muted">at <span className="text-primary">{formData.company}</span></span>}
                           </h1>
                           <p className="text-primary text-sm uppercase tracking-widest font-bold mb-1">Talent Acquisition</p>
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
                           <Globe className="w-4 h-4 text-primary" />
                           {isEditing ? (
                              <input 
                                 type="text" 
                                 name="website" 
                                 value={formData.website} 
                                 onChange={handleChange} 
                                 className="bg-white/5 border border-white/20 px-2 py-1 text-white focus:border-primary focus:outline-none w-40"
                              />
                           ) : (
                              <a href={formData.website} target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline">{formData.website || 'Add Website'}</a>
                           )}
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
                        Company_Bio
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
                        <Briefcase className="w-5 h-5 text-primary" /> Active_Listings
                     </h2>
                     <div className="space-y-4">
                        <div className="p-4 bg-white/5 border border-white/10 flex justify-between items-center group hover:border-primary/50 transition-colors">
                           <div>
                              <h3 className="text-white font-bold mb-1">Senior React Engineer</h3>
                              <p className="text-[10px] text-text-muted uppercase">San Francisco • Full Time</p>
                           </div>
                           <div className="px-2 py-1 bg-green-500/20 text-green-500 text-[10px] uppercase border border-green-500/30">Active</div>
                        </div>
                        <button 
                          onClick={() => setIsPostGigOpen(true)}
                          className="w-full py-3 border border-dashed border-white/20 text-text-muted uppercase text-xs hover:border-primary hover:text-white transition-colors"
                        >
                           + Post_New_Opening
                        </button>
                     </div>
                  </div>
               </div>

               <div className="space-y-8">
                  <div className="bg-surface border border-white/10 p-6">
                     <h3 className="text-sm font-bold text-white uppercase mb-4 tracking-wider">System_Status</h3>
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
                           <p className="text-[10px] text-text-muted uppercase mb-2">Industry</p>
                           {isEditing ? (
                              <input
                                 type="text"
                                 name="industry"
                                 value={formData.industry}
                                 onChange={handleChange}
                                 className="w-full bg-white/5 border border-white/20 px-2 py-1 text-white text-xs"
                              />
                           ) : (
                              <span className="text-white text-xs font-bold uppercase">{formData.industry || 'Not Specified'}</span>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            </div>

          </motion.div>
        </main>
      </div>
      
      <PostGigModal isOpen={isPostGigOpen} onClose={() => setIsPostGigOpen(false)} />
    </div>
  );
};

export default RecruiterProfile;
