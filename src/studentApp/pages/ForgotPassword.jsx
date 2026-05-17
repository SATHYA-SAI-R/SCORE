import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Hexagon, ArrowRight, Loader2, Mail } from 'lucide-react';
import { resetPassword } from '../../lib/authService';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
   const navigate = useNavigate();
   const [email, setEmail] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const [isSubmitted, setIsSubmitted] = useState(false);
   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

   useEffect(() => {
      const handleMouseMove = (e) => {
         setMousePosition({
            x: (e.clientX / window.innerWidth) * 20 - 10,
            y: (e.clientY / window.innerHeight) * 20 - 10,
         });
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
   }, []);

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!email) {
         toast.error('INVALID INPUT: Email required', {
            style: { background: '#000', border: '1px solid #ff003c', color: '#ff003c', fontFamily: 'monospace' },
            icon: '🟥'
         });
         return;
      }
      
      setIsLoading(true);
      try {
         await resetPassword(email);
         setIsSubmitted(true);
         toast.success('RESET PROTOCOL SENT', {
            style: { background: '#000', border: '1px solid #ccff00', color: '#ccff00', fontFamily: 'monospace' },
            icon: '🟩'
         });
      } catch (error) {
         toast.error('PROTOCOL FAILED: ' + error.message, {
            style: { background: '#000', border: '1px solid #ff003c', color: '#ff003c', fontFamily: 'monospace' },
            icon: '🟥'
         });
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="relative min-h-screen bg-background overflow-hidden flex items-center justify-center font-mono selection:bg-primary selection:text-black">
         {/* Dynamic Background Grid */}
         <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
               backgroundImage: 'linear-gradient(rgba(51, 51, 51, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(51, 51, 51, 0.5) 1px, transparent 1px)',
               backgroundSize: '40px 40px',
               transform: `perspective(1000px) rotateX(60deg) translateY(${mousePosition.y * 2}px) translateX(${mousePosition.x * 2}px) scale(2)`,
            }}
         />

         {/* Floating Particles/Orbs */}
         <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none"
         />

         {/* Main Container */}
         <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "circOut" }}
            className="relative z-10 w-full max-w-md p-4"
         >
            <div className="bg-black/80 backdrop-blur-md border border-white/10 p-8 lg:p-12 relative overflow-hidden"
               style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%)" }}>
               
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] -mr-16 -mt-16 pointer-events-none"></div>

               <Link to="/student/login" className="inline-flex flex-col items-center justify-center w-full mb-8 group">
                  <div className="w-16 h-16 bg-surface border border-white/20 flex items-center justify-center group-hover:border-primary transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] mb-4">
                     <Hexagon className="w-8 h-8 text-primary group-hover:animate-pulse transition-all" />
                  </div>
                  <span className="text-2xl font-black text-white uppercase tracking-tighter shadow-neon">S_CORE_</span>
                  <span className="text-[10px] text-primary uppercase tracking-[0.5em] mt-1">Recovery_Terminal</span>
               </Link>

               {isSubmitted ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                     <div className="w-16 h-16 border border-primary/50 text-primary flex items-center justify-center mx-auto mb-6 bg-primary/10">
                        <Mail className="w-8 h-8" />
                     </div>
                     <h2 className="text-xl font-bold text-white mb-4 uppercase">Reset Link Dispatched</h2>
                     <p className="text-text-muted text-sm mb-8 leading-relaxed">
                        If an active clearance matches <span className="text-primary">{email}</span>, a recovery link has been transmitted.
                     </p>
                     <button
                        onClick={() => navigate('/student/login')}
                        className="w-full bg-white hover:bg-primary text-black font-bold py-4 uppercase tracking-widest transition-all clip-diagonal"
                     >
                        Return to Login
                     </button>
                  </motion.div>
               ) : (
                  <>
                     <div className="mb-8 border-l-2 border-primary pl-4">
                        <h2 className="text-lg font-bold text-white mb-1 uppercase tracking-wider">Passcode Override</h2>
                        <p className="text-text-muted text-xs">Enter your registered email to request temporary access reconfiguration.</p>
                     </div>

                     <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2 relative">
                           <label className="text-[10px] font-bold text-primary uppercase tracking-widest block">Identity Verification</label>
                           <div className="relative">
                              <input
                                 type="email"
                                 value={email}
                                 onChange={(e) => setEmail(e.target.value)}
                                 className="w-full bg-black border border-white/20 pl-4 py-3 pr-12 text-white focus:outline-none focus:border-primary transition-all text-sm font-mono placeholder:text-white/20"
                                 placeholder="USER@HOST.EDU"
                                 required
                              />
                           </div>
                        </div>

                        <button
                           type="submit"
                           disabled={isLoading}
                           className="w-full bg-primary hover:bg-white hover:text-black text-black font-bold py-4 uppercase tracking-widest transition-all clip-diagonal flex items-center justify-center space-x-2 group mt-8 disabled:opacity-50"
                        >
                           {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <>
                              <span>Transmit Request</span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                           </>}
                        </button>
                     </form>

                     <div className="mt-8 text-center">
                        <Link to="/student/login" className="text-text-muted text-[10px] hover:text-primary transition-colors uppercase tracking-widest underline decoration-dashed underline-offset-4">
                           Abort & Return
                        </Link>
                     </div>
                  </>
               )}
            </div>
         </motion.div>
      </div>
   );
};

export default ForgotPassword;
