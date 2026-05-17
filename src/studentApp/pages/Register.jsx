import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
   User, Mail, Lock, Building, Calendar, BookOpen,
   CheckCircle, ArrowRight, ArrowLeft, Hexagon, Shield, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { registerWithEmail, sendVerification } from '../../lib/authService';
import { createUserProfile, getUserProfile } from '../../lib/userService';
import { useAuthStore } from '../store/authStore';
import { auth } from '../../lib/firebase';

const Register = () => {
   const navigate = useNavigate();
   const { setUser } = useAuthStore();
   const location = useLocation();
   const googleUser = location.state?.googleUser || null;
   const preselectedRole = location.state?.preselectedRole || '';
   const isGoogleAuth = !!googleUser;
   
   const [currentStep, setCurrentStep] = useState(isGoogleAuth ? 2 : 1);
   const [isLoading, setIsLoading] = useState(false);
   const [customSkill, setCustomSkill] = useState("");
   const [formData, setFormData] = useState({
      accountType: isGoogleAuth ? preselectedRole : '',
      fullName: isGoogleAuth ? googleUser.displayName || '' : '',
      email: isGoogleAuth ? googleUser.email || '' : '',
      password: '',
      confirmPassword: '',
      institution: '',
      graduationYear: '',
      course: '',
      skills: [],
      bio: '',
      portfolio: '',
      verificationCode: '',
      graduationMonth: '',
   });

   const totalSteps = 4;

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
   };

   const handleSkillToggle = (skill) => {
      setFormData(prev => ({
         ...prev,
         skills: prev.skills.includes(skill)
            ? prev.skills.filter(s => s !== skill)
            : [...prev.skills, skill]
      }));
   };

   const handleAddCustomSkill = (e) => {
      if (e) e.preventDefault();
      if (!customSkill.trim()) return;
      const formatted = customSkill.trim().toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '');
      if (formatted && !formData.skills.includes(formatted)) {
         setFormData(prev => ({
            ...prev,
            skills: [...prev.skills, formatted]
         }));
      }
      setCustomSkill("");
   };

   const nextStep = () => {
      if (currentStep < totalSteps) {
         setCurrentStep(prev => prev + 1);
      }
   };

   const prevStep = () => {
      if (currentStep > 1) {
         setCurrentStep(prev => prev - 1);
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      // The old form had 5 steps, but we'll submit everything at the end of Step 4 (Profile Setup)
      // Step 5 is just a verification screen.
      if (currentStep === 4) {
         if (!isGoogleAuth && formData.password !== formData.confirmPassword) {
            toast.error('PASSWORDS DO NOT MATCH');
            return;
         }
         setIsLoading(true);
         try {
            if (isGoogleAuth) {
               // Google user already exists in Auth, just create the Firestore profile
               await createUserProfile(googleUser.uid, googleUser.email, formData.accountType, {
                  ...formData,
                  photoURL: googleUser.photoURL,
               });
               
               // Fetch and update the global store with the new complete profile
               try {
                  const newProfile = await getUserProfile(googleUser.uid);
                  setUser({ ...auth.currentUser, ...newProfile });
               } catch (e) {
                  console.error("Failed to sync new profile to store", e);
               }

               toast.success('PROFILE INITIALIZED SUCCESSFULLY.');
               setTimeout(() => navigate(formData.accountType === 'Recruiter' || formData.accountType === 'Alumni/Mentor' ? '/mentor-dashboard' : '/student/dashboard'), 1500);
            } else {
               // Normal Email Registration
               await registerWithEmail(formData.email, formData.password, formData.accountType, formData);
               toast.success('PROFILE CREATED. CHECK EMAIL.');
               
               // Fetch and update the global store with the new complete profile
               try {
                  const newProfile = await getUserProfile(auth.currentUser.uid);
                  setUser({ ...auth.currentUser, ...newProfile });
               } catch (e) {
                  console.error("Failed to sync new profile to store", e);
               }
               
               setTimeout(() => navigate('/student/login'), 2000);
            }
         } catch (error) {
            toast.error('REGISTRATION FAILED: ' + error.message);
         } finally {
            setIsLoading(false);
         }
      } else {
         nextStep();
      }
   };

   const skillOptions = [
      'REACT_JS', 'NODE_JS', 'PYTHON_CORE', 'JAVA_SYS', 'UI/UX_PROTO',
      'CONTENT_GEN', 'DIGITAL_OPS', 'DATA_MINING',
      'MOBILE_DEV', 'WORDPRESS', 'SEO_OPT', 'VIDEO_SYNTH'
   ];

   return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden font-mono selection:bg-primary selection:text-black">
         {/* Background Grid */}
         <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none" />
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />

         <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl relative z-10"
         >
            {/* Header */}
            <div className="text-center mb-10">
               <Link to="/student/login" className="inline-flex flex-col items-center space-y-4 mb-6 group">
                  <div className="w-16 h-16 bg-surface border border-white/20 flex items-center justify-center group-hover:border-primary transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                     <Hexagon className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                  <div className="flex flex-col items-center">
                     <span className="text-2xl font-black text-white uppercase tracking-tighter shadow-neon">
                        S_CORE_
                     </span>
                     <span className="text-[10px] text-primary uppercase tracking-[0.5em]">System_Access</span>
                  </div>
               </Link>
               <div className="relative inline-block">
                  <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary"></div>
                  <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary"></div>
                  <h1 className="text-3xl font-bold text-white uppercase tracking-wider mb-2">Initiate Protocol</h1>
               </div>
               <p className="text-text-muted text-sm font-mono mt-2">New User Registration Sequence</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-10 bg-surface/50 p-4 border border-white/10 backdrop-blur-sm">
               <div className="flex justify-between mb-2">
                  {[...Array(totalSteps)].map((_, i) => (
                     <div key={i} className="flex-1 flex flex-col items-center">
                        <div className={`
                  w-8 h-8 flex items-center justify-center text-xs font-bold border-2 transition-all duration-300
                  ${i + 1 <= currentStep
                              ? 'bg-primary text-black border-primary shadow-[0_0_10px_rgba(204,255,0,0.5)]'
                              : 'bg-transparent text-text-muted border-white/10'
                           }
                `}>
                           {i + 1 < currentStep ? <CheckCircle className="w-4 h-4" /> : `0${i + 1}`}
                        </div>
                        <div className={`h-1 w-full mt-2 transition-all duration-300 ${i + 1 <= currentStep ? 'bg-primary' : 'bg-white/5'}`} />
                     </div>
                  ))}
               </div>
               <div className="text-right text-[10px] text-text-muted uppercase tracking-widest mt-2">
                  Phase {currentStep}/{totalSteps} Executing...
               </div>
            </div>

            {/* Form Card */}
            <div className="bg-surface border border-white/10 p-8 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-primary opacity-50"></div>
               <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-primary opacity-50"></div>

               <form onSubmit={handleSubmit}>
                  <AnimatePresence mode="wait">
                     {/* Step 1: Account Type */}
                     {currentStep === 1 && (
                        <motion.div
                           key="step1"
                           initial={{ opacity: 0, x: 20 }}
                           animate={{ opacity: 1, x: 0 }}
                           exit={{ opacity: 0, x: -20 }}
                           transition={{ duration: 0.3 }}
                        >
                           <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                              <Shield className="w-5 h-5 text-primary" />
                              Select Clearance Level
                           </h2>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {['School Student', 'College Student', 'Recruiter', 'Alumni/Mentor'].map((type) => (
                                 <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, accountType: type }))}
                                    className={`
                          p-6 border transition-all text-left relative overflow-hidden group
                          ${formData.accountType === type
                                          ? 'border-primary bg-primary/10'
                                          : 'border-white/10 hover:border-white/50 bg-black/50'
                                       }
                        `}
                                 >
                                    {formData.accountType === type && <div className="absolute inset-0 bg-primary/5 animate-pulse"></div>}
                                    <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                       {type === 'School Student' ? '🎒' : type === 'College Student' ? '🎓' : type === 'Recruiter' ? '💼' : '🌟'}
                                    </div>
                                    <h3 className={`text-sm font-bold uppercase tracking-wider mb-1 ${formData.accountType === type ? 'text-primary' : 'text-white'}`}>
                                       {type}
                                    </h3>
                                    <p className="text-[10px] text-text-muted font-mono">
                                       {type === 'School Student'
                                          ? 'LEVEL_1 CHECK [GRADES 9-12]'
                                          : type === 'College Student'
                                             ? 'LEVEL_2 CHECK [UNDERGRAD/GRAD]'
                                             : type === 'Recruiter'
                                                ? 'CORPORATE_ACCESS [HIRING]'
                                                : 'MENTOR_ACCESS [GUIDANCE]'
                                       }
                                    </p>
                                 </button>
                              ))}
                           </div>
                        </motion.div>
                     )}

                     {/* Step 2: Basic Information */}
                     {currentStep === 2 && (
                        <motion.div
                           key="step2"
                           initial={{ opacity: 0, x: 20 }}
                           animate={{ opacity: 1, x: 0 }}
                           exit={{ opacity: 0, x: -20 }}
                           transition={{ duration: 0.3 }}
                           className="space-y-6"
                        >
                           <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-6">User Parameters</h2>

                           <div className="space-y-4">
                              <div className="group">
                                 <label className="block text-[10px] uppercase tracking-widest text-text-muted mb-2 group-focus-within:text-primary transition-colors">
                                    Full_Name
                                 </label>
                                 <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                    <input
                                       type="text"
                                       name="fullName"
                                       value={formData.fullName}
                                       onChange={handleChange}
                                       placeholder="IDENTIFIER..."
                                       className={`w-full bg-black/50 border border-white/10 py-3 pl-12 pr-4 text-sm text-white focus:border-primary focus:outline-none transition-colors font-mono uppercase ${isGoogleAuth ? 'opacity-50 cursor-not-allowed' : ''}`}
                                       required
                                    />
                                 </div>
                              </div>

                              <div className="group">
                                 <label className="block text-[10px] uppercase tracking-widest text-text-muted mb-2 group-focus-within:text-primary transition-colors">
                                    Institution_Email
                                 </label>
                                 <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                    <input
                                       type="email"
                                       name="email"
                                       value={formData.email}
                                       onChange={handleChange}
                                       disabled={isGoogleAuth}
                                       placeholder="USER@HOST.EDU"
                                       className={`w-full bg-black/50 border border-white/10 py-3 pl-12 pr-4 text-sm text-white focus:border-primary focus:outline-none transition-colors font-mono uppercase ${isGoogleAuth ? 'opacity-50 cursor-not-allowed' : ''}`}
                                       required
                                    />
                                 </div>
                              </div>

                              {!isGoogleAuth && (
                                 <div className="grid grid-cols-2 gap-4">
                                    <div className="group">
                                       <label className="block text-[10px] uppercase tracking-widest text-text-muted mb-2 group-focus-within:text-primary transition-colors">
                                          Pass_Key
                                       </label>
                                       <div className="relative">
                                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                          <input
                                             type="password"
                                             name="password"
                                             value={formData.password}
                                             onChange={handleChange}
                                             placeholder="******"
                                             className="w-full bg-black/50 border border-white/10 py-3 pl-12 pr-4 text-sm text-white focus:border-primary focus:outline-none transition-colors font-mono"
                                             required
                                          />
                                       </div>
                                    </div>
                                    <div className="group">
                                       <label className="block text-[10px] uppercase tracking-widest text-text-muted mb-2 group-focus-within:text-primary transition-colors">
                                          Confirm_Key
                                       </label>
                                       <div className="relative">
                                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                          <input
                                             type="password"
                                             name="confirmPassword"
                                             value={formData.confirmPassword}
                                             onChange={handleChange}
                                             placeholder="******"
                                             className="w-full bg-black/50 border border-white/10 py-3 pl-12 pr-4 text-sm text-white focus:border-primary focus:outline-none transition-colors font-mono"
                                             required
                                          />
                                       </div>
                                    </div>
                                 </div>
                              )}
                           </div>
                        </motion.div>
                     )}

                     {/* Step 3: Role-Specific Details */}
                     {currentStep === 3 && (
                        <motion.div
                           key="step3"
                           initial={{ opacity: 0, x: 20 }}
                           animate={{ opacity: 1, x: 0 }}
                           exit={{ opacity: 0, x: -20 }}
                           transition={{ duration: 0.3 }}
                           className="space-y-6"
                        >
                           <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-6">
                              {(formData.accountType === 'Recruiter' || formData.accountType === 'Alumni/Mentor') ? 'Professional Data' : 'Origin Data'}
                           </h2>

                           <div className="space-y-4">
                              <div className="group">
                                 <label className="block text-[10px] uppercase tracking-widest text-text-muted mb-2 group-focus-within:text-primary transition-colors">
                                    {(formData.accountType === 'Recruiter' || formData.accountType === 'Alumni/Mentor') ? 'Company_/_Organization' : 'Institution_Name'}
                                 </label>
                                 <div className="relative">
                                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                    <input
                                       type="text"
                                       name="institution"
                                       value={formData.institution}
                                       onChange={handleChange}
                                       placeholder={(formData.accountType === 'Recruiter' || formData.accountType === 'Alumni/Mentor') ? "ENTER_COMPANY_NAME..." : "ENTER_INSTITUTION_ID..."}
                                       className="w-full bg-black/50 border border-white/10 py-3 pl-12 pr-4 text-sm text-white focus:border-primary focus:outline-none transition-colors font-mono uppercase"
                                       required
                                    />
                                 </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                 {(formData.accountType === 'Recruiter' || formData.accountType === 'Alumni/Mentor') ? (
                                    <>
                                       <div className="group">
                                          <label className="block text-[10px] uppercase tracking-widest text-text-muted mb-2 group-focus-within:text-primary transition-colors">
                                             Role_/_Position
                                          </label>
                                          <div className="relative">
                                             <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                             <input
                                                type="text"
                                                name="course" // Reusing course field for Role/Position to keep state simple
                                                value={formData.course}
                                                onChange={handleChange}
                                                placeholder="HR_MANAGER..."
                                                className="w-full bg-black/50 border border-white/10 py-3 pl-12 pr-4 text-sm text-white focus:border-primary focus:outline-none transition-colors font-mono uppercase"
                                                required
                                             />
                                          </div>
                                       </div>
                                       <div className="group">
                                          <label className="block text-[10px] uppercase tracking-widest text-text-muted mb-2 group-focus-within:text-primary transition-colors">
                                             Experience
                                          </label>
                                          <div className="relative">
                                             <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                             <select
                                                name="graduationYear" // Reusing graduationYear for Experience to keep state simple
                                                value={formData.graduationYear}
                                                onChange={handleChange}
                                                className="w-full bg-black/50 border border-white/10 py-3 pl-12 pr-4 text-sm text-white focus:border-primary focus:outline-none transition-colors font-mono appearance-none"
                                                required
                                             >
                                                <option value="">SELECT_EXP</option>
                                                {['0-2 YEARS', '3-5 YEARS', '5-10 YEARS', '10+ YEARS'].map(exp => (
                                                   <option key={exp} value={exp}>{exp}</option>
                                                ))}
                                             </select>
                                          </div>
                                       </div>
                                    </>
                                 ) : (
                                    <>
                                       <div className="group">
                                          <label className="block text-[10px] uppercase tracking-widest text-text-muted mb-2 group-focus-within:text-primary transition-colors">
                                             Grad_Year
                                          </label>
                                          <div className="relative">
                                             <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                             <div className="flex space-x-2">
                                                <select
                                                   name="graduationMonth"
                                                   value={formData.graduationMonth}
                                                   onChange={handleChange}
                                                   className="w-1/2 bg-black/50 border border-white/10 py-3 pl-12 pr-4 text-sm text-white focus:border-primary focus:outline-none transition-colors font-mono appearance-none"
                                                   required
                                                >
                                                   <option value="">SELECT_MONTH</option>
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
                                                   className="w-1/2 bg-black/50 border border-white/10 py-3 pl-4 pr-4 text-sm text-white focus:border-primary focus:outline-none transition-colors font-mono appearance-none"
                                                   required
                                                >
                                                   <option value="">SELECT_YEAR</option>
                                                   {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map(year => (
                                                      <option key={year} value={year}>{year}</option>
                                                   ))}
                                                </select>
                                             </div>
                                          </div>
                                       </div>
                                       <div className="group">
                                          <label className="block text-[10px] uppercase tracking-widest text-text-muted mb-2 group-focus-within:text-primary transition-colors">
                                             Stream/Course
                                          </label>
                                          <div className="relative">
                                             <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                             <input
                                                type="text"
                                                name="course"
                                                value={formData.course}
                                                onChange={handleChange}
                                                placeholder="PROGRAM_ID..."
                                                className="w-full bg-black/50 border border-white/10 py-3 pl-12 pr-4 text-sm text-white focus:border-primary focus:outline-none transition-colors font-mono uppercase"
                                                required
                                             />
                                          </div>
                                       </div>
                                    </>
                                 )}
                              </div>
                           </div>
                        </motion.div>
                     )}

                     {/* Step 4: Profile Setup */}
                     {currentStep === 4 && (
                        <motion.div
                           key="step4"
                           initial={{ opacity: 0, x: 20 }}
                           animate={{ opacity: 1, x: 0 }}
                           exit={{ opacity: 0, x: -20 }}
                           transition={{ duration: 0.3 }}
                           className="space-y-6"
                        >
                           <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-6">Skill Modules</h2>

                           <div>
                              <label className="block text-[10px] uppercase tracking-widest text-text-muted mb-4">
                                 Add_Custom_Module
                              </label>
                              <div className="flex space-x-2 mb-6">
                                 <input
                                    type="text"
                                    value={customSkill}
                                    onChange={(e) => setCustomSkill(e.target.value)}
                                    onKeyDown={(e) => {
                                       if (e.key === 'Enter') {
                                           e.preventDefault();
                                           handleAddCustomSkill();
                                       }
                                    }}
                                    placeholder="E.G. NEXT_JS"
                                    className="flex-1 bg-black/50 border border-white/10 py-3 px-4 text-sm text-white focus:border-primary focus:outline-none transition-colors font-mono uppercase"
                                 />
                                 <button
                                    type="button"
                                    onClick={handleAddCustomSkill}
                                    className="px-6 py-3 bg-white/10 hover:bg-primary hover:text-black border border-white/10 text-white font-bold transition-colors text-xs uppercase tracking-widest"
                                 >
                                    Add
                                 </button>
                              </div>

                              <label className="block text-[10px] uppercase tracking-widest text-text-muted mb-4">
                                 Skill_Database / Selected
                              </label>
                              <div className="flex flex-wrap gap-2">
                                 {formData.skills.map(skill => (
                                    <button
                                       key={skill}
                                       type="button"
                                       onClick={() => handleSkillToggle(skill)}
                                       className="px-2 py-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider transition-all border bg-primary text-black border-primary"
                                       title="Click to remove"
                                    >
                                       {skill} <span className="opacity-50 hover:opacity-100 font-bold text-sm leading-none block ml-1">×</span>
                                    </button>
                                 ))}
                                 
                                 {skillOptions.filter(s => !formData.skills.includes(s)).map(skill => (
                                    <button
                                       key={skill}
                                       type="button"
                                       onClick={() => handleSkillToggle(skill)}
                                       className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition-all border bg-transparent text-text-muted border-white/10 hover:border-white/50 hover:text-white"
                                    >
                                       + {skill}
                                    </button>
                                 ))}
                              </div>
                           </div>

                           <div>
                              <label className="block text-[10px] uppercase tracking-widest text-text-muted mb-2">
                                 Bio_Data
                              </label>
                              <textarea
                                 name="bio"
                                 value={formData.bio}
                                 onChange={handleChange}
                                 placeholder="INPUT_USER_SUMMARY..."
                                 rows={3}
                                 className="w-full p-4 bg-black/50 border border-white/10 text-white placeholder:text-text-muted focus:border-primary focus:outline-none transition-colors font-mono text-sm resize-none"
                              />
                           </div>
                        </motion.div>
                     )}


                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-10 pt-6 border-t border-white/10">
                     {currentStep > 1 && (
                        <button
                           type="button"
                           onClick={prevStep}
                           className="px-6 py-2 border border-white/10 text-text-muted hover:text-white hover:border-white transition-colors text-xs uppercase tracking-widest font-bold flex items-center gap-2"
                        >
                           <ArrowLeft className="w-3 h-3" />
                           Back
                        </button>
                     )}

                     <button
                        type="submit"
                        disabled={(currentStep === 1 && !formData.accountType) || isLoading}
                        className={`
                   ml-auto px-8 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-primary transition-colors flex items-center gap-2 clip-diagonal
                   ${((currentStep === 1 && !formData.accountType) || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                     >
                        {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <span>{currentStep === totalSteps ? 'Finalize_Setup' : 'Proceed'}</span>}
                        {currentStep < totalSteps && !isLoading && <ArrowRight className="w-3 h-3" />}
                     </button>
                  </div>
               </form>
            </div>

            {/* Footer */}
            <div className="text-center mt-8">
               <Link to="/student/login" className="text-xs text-text-muted hover:text-primary transition-colors uppercase tracking-widest">
                  Return to Login Sequence
               </Link>
            </div>

         </motion.div>
      </div>
   );
};

export default Register;
