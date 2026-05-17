import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Terminal, Cpu, Zap, Shield, ArrowRight, Loader2, Check } from 'lucide-react';
import { loginWithEmail, loginWithGoogle, setAuthPersistence } from '../../lib/authService';
import { getUserProfile } from '../../lib/userService';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student' // Default role
  });
  const [rememberMe, setRememberMe] = useState(false);
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
    if (formData.email && formData.password) {
      setIsLoading(true);
      try {
        await setAuthPersistence(rememberMe);
        const user = await loginWithEmail(formData.email, formData.password);
        let profile = null;
        try {
          profile = await getUserProfile(user.uid);
        } catch (e) {
          console.error(e);
        }
        const role = (profile && profile.role) || formData.role;

        toast.success('ACCESS GRANTED', {
          style: {
            background: '#000',
            border: '1px solid #ccff00',
            color: '#ccff00',
            fontFamily: 'monospace',
          },
          icon: '🟩',
        });

        if (role === 'mentor' || role === 'Alumni/Mentor') {
          navigate('/mentor-dashboard');
        } else {
          navigate('/student/dashboard');
        }
      } catch (error) {
        toast.error('AUTH FAILED: ' + error.message, {
          style: {
            background: '#000',
            border: '1px solid #ff003c',
            color: '#ff003c',
            fontFamily: 'monospace',
          },
          icon: '🟥',
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error('ACCESS DENIED: MISSING CREDENTIALS', {
        style: {
          background: '#000',
          border: '1px solid #ff003c',
          color: '#ff003c',
          fontFamily: 'monospace',
        },
        icon: '🟥',
      });
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await setAuthPersistence(rememberMe);
      const user = await loginWithGoogle();
      
      // If we get here, it means they ALREADY had a Firestore profile
      let profile = null;
      try {
        profile = await getUserProfile(user.uid);
      } catch (e) {
        console.error(e);
      }
      
      const role = (profile && profile.role) || formData.role;

      toast.success('ACCESS GRANTED', {
        style: {
          background: '#000',
          border: '1px solid #ccff00',
          color: '#ccff00',
          fontFamily: 'monospace',
        },
        icon: '🟩',
      });
      if (role === 'mentor' || role === 'Alumni/Mentor') {
        navigate('/mentor-dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (error) {
       if (error.code === 'auth/profile-missing' || error.message === 'profile_missing') {
          // This is a NEW user from Google Auth who doesn't have a Firestore profile yet.
          // Route them to the registration flow and pass along their Google data
          toast.success('GOOGLE AUTHENTICATION SUCCESSFUL. PLEASE COMPLETE REGISTRATION.', {
             style: {
                background: '#000',
                border: '1px solid #ccff00',
                color: '#ccff00',
                fontFamily: 'monospace',
             },
             icon: '🟩',
          });
          navigate('/student/register', { 
            state: { 
              googleUser: {
                uid: error.user.uid,
                email: error.user.email,
                displayName: error.user.displayName,
                photoURL: error.user.photoURL
              },
              preselectedRole: formData.role === 'recruiter' ? 'Recruiter' : formData.role === 'mentor' ? 'Alumni/Mentor' : 'College Student'
            } 
          });
       } else {
          toast.error('AUTH FAILED: ' + error.message, {
            style: {
              background: '#000',
              border: '1px solid #ff003c',
              color: 'ff003c',
              fontFamily: 'monospace',
            },
            icon: '🟥',
          });
       }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] pointer-events-none"
      />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "circOut" }}
        className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 p-4"
      >

        {/* Left Side: Brand & Info */}
        <div className="flex flex-col justify-between space-y-12 lg:pr-12">
          <div>
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 border border-primary/30 bg-primary/10 px-4 py-2 rounded-none mb-8"
            >
              <Terminal size={18} className="text-primary" />
              <span className="text-primary text-sm tracking-widest uppercase">System v2.0.4 Online</span>
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-6xl lg:text-8xl font-black text-white tracking-tighter leading-[0.8] mb-6 glitch-wrapper"
              data-text="STUDENT FREELANCE"
            >
              STUDENT<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-cyan-400 animate-pulse">FREELANCE</span><br />
              HUB_
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-text-muted text-lg max-w-md border-l-2 border-primary pl-6"
            >
              Secure marketplace protocol initiated. Connect with verified entities. Monetize your skills in a decentralized economy.
            </motion.p>
          </div>

          <div className="hidden lg:grid grid-cols-2 gap-4">
            {[
              { icon: Shield, label: "VERIFIED_USERS", val: "100%" },
              { icon: Zap, label: "LATENCY", val: "<50ms" },
              { icon: Cpu, label: "ACTIVE_NODES", val: "500+" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + (i * 0.1) }}
                className="bg-surface border border-white/5 p-4 hover:border-primary/50 transition-colors group"
              >
                <item.icon className="text-text-muted group-hover:text-primary mb-2 transition-colors" />
                <div className="text-xs text-text-muted tracking-widest">{item.label}</div>
                <div className="text-xl font-bold text-white group-hover:text-primary transition-colors">{item.val}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Side: Login Terminal */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-black/80 backdrop-blur-md border border-white/10 p-8 lg:p-12 relative overflow-hidden"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%)"
          }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] -mr-16 -mt-16 pointer-events-none"></div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
              <span className="w-2 h-6 bg-primary mr-3"></span>
              AUTHENTICATION
            </h2>
            <p className="text-text-muted text-sm">Enter you credentials to bypass the firewall.</p>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'student' })}
              className={`py-2 text-xs uppercase tracking-widest border transition-colors ${formData.role === 'student' ? 'bg-[#ccff00] text-black border-[#ccff00] font-bold' : 'border-white/20 text-text-muted hover:border-[#ccff00] hover:text-[#ccff00]'}`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'recruiter' })}
              className={`py-2 text-xs uppercase tracking-widest border transition-colors ${formData.role === 'recruiter' ? 'bg-[#cc33ff] text-white border-[#cc33ff] font-bold' : 'border-white/20 text-text-muted hover:border-[#cc33ff] hover:text-[#cc33ff]'}`}
            >
              Recruiter
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'mentor' })}
              className={`py-2 text-xs uppercase tracking-widest border transition-colors ${formData.role === 'mentor' ? 'bg-[#00ccff] text-black border-[#00ccff] font-bold' : 'border-white/20 text-text-muted hover:border-[#00ccff] hover:text-[#00ccff]'}`}
            >
              Mentor
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-primary uppercase tracking-widest">User_ID / Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-surface border-b-2 border-white/20 px-4 py-3 text-white focus:outline-none focus:border-primary focus:bg-white/5 transition-all text-lg placeholder:text-white/20"
                placeholder="student@university.edu"
              />
            </div>

            <div className="space-y-2 relative">
              <label className="text-xs font-bold text-primary uppercase tracking-widest">Passcode</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-surface border-b-2 border-white/20 px-4 py-3 text-white focus:outline-none focus:border-primary focus:bg-white/5 transition-all text-lg placeholder:text-white/20"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center space-x-2 cursor-pointer group" onClick={() => setRememberMe(!rememberMe)}>
                <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${rememberMe ? 'border-primary' : 'border-white/30 group-hover:border-primary'}`}>
                  {rememberMe && <Check className="w-3 h-3 text-primary" />}
                </div>
                <span className="text-xs text-text-muted group-hover:text-white transition-colors uppercase tracking-wider">Remember_Me</span>
              </label>
              <Link to="/student/forgot-password" className="text-xs text-text-muted hover:text-primary uppercase tracking-wider transition-colors">
                Reset_Passcode?
              </Link>
            </div>

            <button
              type="button"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-white hover:text-black text-black font-bold py-4 uppercase tracking-widest transition-all clip-diagonal flex items-center justify-center space-x-2 group mt-8 disabled:opacity-50"
              onClick={handleSubmit}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <>
                <span>Initiate Session</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </>}
            </button>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="py-3 border border-white/10 hover:border-white/30 hover:bg-white/5 text-white text-xs uppercase tracking-widest transition-all disabled:opacity-50 inline-flex justify-center items-center gap-2"
              >
                Via Google
              </button>
              <button
                type="button"
                className="py-3 border border-white/10 hover:border-white/30 hover:bg-white/5 text-white text-xs uppercase tracking-widest transition-all"
              >
                Via LinkedIn
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-text-muted text-xs">
              New User? <Link to="/student/register" className="text-primary hover:underline decoration-primary">Initialize Registration Protocol</Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
