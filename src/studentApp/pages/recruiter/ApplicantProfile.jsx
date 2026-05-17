import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Briefcase, Star, Download, MessageSquare, Check, X, ExternalLink, Code, Globe, GraduationCap } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getUserProfile } from '../../../lib/userService';
import { useAuthStore } from '../../store/authStore';
import { sendMessage } from '../../../lib/messageService';

const ApplicantProfile = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const { user } = useAuthStore();
   const [applicant, setApplicant] = useState(null);
   const [pendingApps, setPendingApps] = useState([]);
   const [isHiring, setIsHiring] = useState(false);
   useEffect(() => {
      const getProfile = async () => {
         try {
            const profile = await getUserProfile(id);
            setApplicant(profile);
         } catch(e) {
            console.error("Failed to fetch applicant profile", e);
         }
      };
      if (id) getProfile();

      const fetchPendingApps = async () => {
         if (id && user?.uid) {
            import('../../../lib/applicationService').then(({ getApplicationsByStudent }) => {
               getApplicationsByStudent(id).then(apps => {
                  setPendingApps(apps.filter(app => app.recruiterId === user.uid && (app.status === 'pending' || app.status === 'interview')));
               });
            }).catch(e => console.error("Could not load applications", e));
         }
      };
      fetchPendingApps();
   }, [id, user]);

   const handleHire = async () => {
      if (pendingApps.length === 0) return;
      setIsHiring(true);
      try {
         const { updateApplicationStatus } = await import('../../../lib/applicationService');
         await updateApplicationStatus(pendingApps[0].id, 'accepted');
         import('react-hot-toast').then(mod => mod.default.success(`Student hired successfully!`));
         setPendingApps(prev => prev.slice(1));
      } catch (error) {
         import('react-hot-toast').then(mod => mod.default.error('Failed to hire: ' + error.message));
      } finally {
         setIsHiring(false);
      }
   };
   const handleMessage = async () => {
      if (!user) return;
      try {
         const convId = user.uid < id ? `${user.uid}_${id}` : `${id}_${user.uid}`;
         const participants = [user.uid, id];
         await sendMessage(convId, user.uid, "Hello, I am interested in your profile.", participants);
         navigate('/student/messages');
      } catch (err) {
         console.error(err);
      }
   };

   if (!applicant) {
       return (
           <div className="min-h-screen bg-background font-mono flex items-center justify-center text-primary">
               Loading_Profile...
           </div>
       );
   }

   return (
      <div className="min-h-screen bg-background font-mono selection:bg-primary selection:text-black">
         <Navbar />
         <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6 lg:p-10 relative overflow-hidden">
               {/* Background Grid */}
               <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-4xl mx-auto">

                  {/* Header Actions */}
                  <div className="flex justify-between items-center mb-8">
                     <Link to="/student/applications" className="text-xs text-text-muted hover:text-white uppercase tracking-wider flex items-center gap-2">
                        ← Back_to_Applications
                     </Link>
                     <div className="flex gap-2">
                        <button 
                           onClick={handleHire} 
                           disabled={pendingApps.length === 0 || isHiring}
                           className={`flex items-center gap-2 px-4 py-2 border transition-colors text-xs uppercase tracking-wider ${
                              pendingApps.length > 0 && !isHiring 
                                 ? 'border-green-500/30 text-green-500 bg-green-500/5 hover:bg-green-500/10' 
                                 : 'border-white/10 text-white/30 bg-white/5 cursor-not-allowed'
                           }`}
                        >
                           <Check className="w-3 h-3" /> {isHiring ? 'Processing...' : (pendingApps.length > 0 ? 'Hire_Candidate' : 'No_Pending_Apps')}
                        </button>
                        <button onClick={handleMessage} className="flex items-center gap-2 px-4 py-2 border border-blue-500/30 text-blue-500 bg-blue-500/5 hover:bg-blue-500/10 transition-colors text-xs uppercase tracking-wider">
                           <MessageSquare className="w-3 h-3" /> Interview
                        </button>
                     </div>
                  </div>

                  <div className="bg-surface border border-white/10 p-8 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-10">
                        <User className="w-64 h-64 text-primary" />
                     </div>

                     <div className="flex flex-col md:flex-row items-start gap-8 relative z-10">
                        <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center text-4xl font-bold text-white border-2 border-primary shadow-[0_0_20px_rgba(204,255,0,0.3)] uppercase">
                           {(applicant.name || 'U').charAt(0)}
                        </div>

                        <div className="flex-1">
                           <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-1">{applicant.name || 'Unknown'}</h1>
                           <p className="text-primary text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                              <Briefcase className="w-4 h-4" /> {applicant.roleTitle || applicant.role || 'Developer'}
                           </p>

                           <div className="flex flex-wrap gap-6 text-xs text-text-muted font-mono uppercase tracking-wider mb-6">
                              <span className="flex items-center gap-2"><Mail className="w-3 h-3" /> {applicant.email}</span>
                              <span className="flex items-center gap-2"><GraduationCap className="w-3 h-3" /> {applicant.education || 'Self-Taught'}</span>
                              <span className="flex items-center gap-2 text-white"><Star className="w-3 h-3 text-yellow-500" /> {applicant.rating || 'New'} ({applicant.reviews || 0} Reviews)</span>
                           </div>

                           <div className="flex gap-2">
                              {applicant.skills?.map(skill => (
                                 <span key={skill} className="px-2 py-1 bg-white/5 border border-white/10 text-white text-[10px] uppercase tracking-wider">
                                    {skill}
                                 </span>
                              ))}
                           </div>
                        </div>
                     </div>

                     <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                        <div className="md:col-span-2 space-y-8">
                           <div>
                              <h3 className="text-lg font-bold text-white uppercase mb-4 flex items-center gap-2">
                                 <Code className="w-5 h-5 text-secondary" /> About
                              </h3>
                              <p className="text-text-muted text-sm leading-relaxed border-l-2 border-white/10 pl-4">
                                 {applicant.bio || applicant.about || 'No bio provided'}
                              </p>
                           </div>

                           <div>
                              <h3 className="text-lg font-bold text-white uppercase mb-4 flex items-center gap-2">
                                 <Globe className="w-5 h-5 text-accent" /> Portfolio_Nodes
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 {applicant.portfolio && Array.isArray(applicant.portfolio) ? applicant.portfolio.map((item, i) => (
                                    <div key={i} className="bg-black/40 border border-white/10 p-4 hover:border-white/30 transition-colors group">
                                       <div className="h-32 bg-white/5 mb-4 flex items-center justify-center text-text-muted text-xs">
                                          [IMG_PLACEHOLDER]
                                       </div>
                                       <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                                       <a href={item.link} className="text-[10px] text-primary uppercase tracking-wider flex items-center gap-1 hover:underline">
                                          View_Project <ExternalLink className="w-3 h-3" />
                                       </a>
                                    </div>
                                 )) : (
                                    <div className="text-text-muted text-xs font-mono">No portfolio items available.</div>
                                 )}
                              </div>
                           </div>
                        </div>

                        <div>
                           <div className="bg-white/5 border border-white/10 p-6 mb-6">
                              <h3 className="text-sm font-bold text-white uppercase mb-4">Verification</h3>
                              <ul className="space-y-3 text-xs text-text-muted font-mono">
                                 <li className="flex items-center justify-between">
                                    <span>Identity</span>
                                    <span className="text-green-500 flex items-center gap-1"><Check className="w-3 h-3" /> Verified</span>
                                 </li>
                                 <li className="flex items-center justify-between">
                                    <span>Education</span>
                                    <span className="text-green-500 flex items-center gap-1"><Check className="w-3 h-3" /> Verified</span>
                                 </li>
                                 <li className="flex items-center justify-between">
                                    <span>Skills</span>
                                    <span className="text-green-500 flex items-center gap-1"><Check className="w-3 h-3" /> Verified</span>
                                 </li>
                              </ul>
                           </div>

                           <button className="w-full py-3 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-primary transition-colors flex items-center justify-center gap-2 mb-4">
                              <Download className="w-4 h-4" /> Download_Resume
                           </button>
                        </div>
                     </div>
                  </div>

               </motion.div>
            </main>
         </div>
      </div>
   );
};

export default ApplicantProfile;
