import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Briefcase, GraduationCap, ChevronLeft, Calendar, MessageCircle, ShieldCheck, Zap, Loader2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getUserProfile } from '../../../lib/userService';

const MentorProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [mentor, setMentor] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMentor = async () => {
            try {
                const profile = await getUserProfile(id);
                setMentor(profile);
            } catch (err) {
                console.error("Failed to fetch mentor profile", err);
                toast.error("Mentor profile not found");
                navigate(-1);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMentor();
    }, [id, navigate]);

    const handleUplink = () => {
        toast.success(`Uplink requested with ${mentor.name}. Stand by for response.`, {
            style: {
                background: '#000000',
                color: '#CCFF00',
                border: '1px solid #333333',
                fontFamily: 'Space Grotesk, sans-serif',
            },
            iconTheme: {
                primary: '#CCFF00',
                secondary: '#000',
            },
        });
    };

    return (
        <div className="min-h-screen bg-background font-mono selection:bg-primary selection:text-black flex flex-col">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 p-6 lg:p-10 relative overflow-y-auto">
                    <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-4xl mx-auto">
                        <button onClick={() => navigate(-1)} className="inline-flex items-center space-x-2 text-text-muted hover:text-white transition-colors mb-6 group text-xs uppercase tracking-widest font-bold">
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span>RETURN TO FEED</span>
                        </button>

                        {isLoading ? (
                            <div className="flex justify-center items-center py-20">
                                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                            </div>
                        ) : !mentor ? (
                            <div className="text-center py-20 text-text-muted border border-white/5 bg-surface">
                                Profile not found.
                            </div>
                        ) : (
                            <>
                        <div className="bg-surface border border-white/10 p-8 mb-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-2 h-full bg-primary/20"></div>

                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                {/* Profile Avatar */}
                                <div className="w-32 h-32 bg-white/5 border border-white/10 flex items-center justify-center text-6xl relative">
                                    👨‍💼
                                    <div className="absolute -bottom-3 -right-3 bg-primary text-black p-1 px-2 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 clip-diagonal">
                                        <ShieldCheck className="w-3 h-3" /> MENTOR
                                    </div>
                                </div>

                                {/* Profile Info */}
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold mb-2 uppercase tracking-tighter text-white">
                                        {mentor.name || 'Unknown User'}
                                    </h1>
                                    <p className="text-primary text-sm font-mono mb-4 uppercase tracking-widest flex items-center gap-2">
                                        <Briefcase className="w-4 h-4" /> {mentor.roleTitle || mentor.role || 'Mentor'}
                                    </p>

                                    <div className="flex flex-wrap gap-4 text-xs text-text-muted uppercase tracking-widest mb-6 border-b border-white/10 pb-6">
                                        <div className="flex items-center gap-2">
                                            <GraduationCap className="w-4 h-4" />
                                            <span>{mentor.education || mentor.experience || 'Not Specified'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            <span>{mentor.location || 'Remote'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-secondary-foreground">
                                            <Star className="w-4 h-4 fill-primary text-primary" />
                                            <span className="font-bold text-white">{mentor.rating || 0}</span>
                                            <span className="font-normal text-text-muted">({mentor.mentees || 0}+ mentees)</span>
                                        </div>
                                    </div>

                                    <div className="mb-8">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-3">Transmission Bio</h3>
                                        <p className="text-white/80 leading-relaxed font-light">{mentor.bio || 'No transmission bio available.'}</p>
                                    </div>

                                    <div className="mb-8">
                                        <h3 className="text-[10px] text-primary uppercase tracking-widest mb-2">Specialized Modules</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {mentor.skills && mentor.skills.length > 0 ? mentor.skills.map((mod, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] text-white uppercase tracking-widest">
                                                    {mod.trim()}
                                                </span>
                                            )) : (
                                                <span className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] text-white uppercase tracking-widest">
                                                    {mentor.expertise || 'Career Guidance'}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {(mentor.portfolio || mentor.portfolioImage) && (
                                        <div className="mb-8">
                                            <h3 className="text-[10px] text-primary uppercase tracking-widest mb-2">Showcase / Work</h3>
                                            
                                            {mentor.portfolio && (
                                              <a href={mentor.portfolio.startsWith('http') ? mentor.portfolio : `https://${mentor.portfolio}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white hover:text-primary transition-colors text-xs mb-4">
                                                  <ExternalLink className="w-4 h-4" /> {mentor.portfolio}
                                              </a>
                                            )}

                                            {mentor.portfolioImage && (
                                              <div className="max-h-[300px] w-full overflow-hidden border border-white/10 mt-2 bg-black/40">
                                                  <img src={mentor.portfolioImage} alt="Portfolio Showcase" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
                                              </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button onClick={handleUplink} className="flex-1 bg-white text-black font-bold py-4 px-6 uppercase text-xs tracking-widest hover:bg-primary transition-colors clip-diagonal flex items-center justify-center gap-2">
                                            <Zap className="w-4 h-4" />
                                            Request 1:1 Uplink
                                        </button>

                                        <Link to="/community/General%20Doubts" className="flex-1 bg-surface border border-primary/50 text-primary font-bold py-4 px-6 uppercase text-xs tracking-widest hover:bg-primary/10 transition-colors flex items-center justify-center gap-2">
                                            <MessageCircle className="w-4 h-4" />
                                            Ask Doubts in Community
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Availability */}
                        <div className="bg-surface border border-white/10 p-6 relative">
                            <div className="absolute left-0 top-6 bottom-6 w-1 bg-secondary"></div>
                            <h2 className="text-lg font-bold text-white mb-6 uppercase flex items-center">
                                <div className="w-2 h-2 bg-secondary rounded-full mr-3 animate-pulse"></div>
                                Available Chrono-Slots
                            </h2>
                            <div className="flex items-center justify-between p-4 bg-black/40 border border-white/5 mb-3 group hover:border-primary/30 transition-colors cursor-pointer" onClick={handleUplink}>
                                <div>
                                    <div className="font-bold text-white uppercase text-sm mb-1 group-hover:text-primary transition-colors">Resume Review / Interview Prep</div>
                                    <div className="text-xs text-text-muted font-mono">30-min Video Call</div>
                                </div>
                                <div className="flex items-center space-x-2 text-primary border border-primary/20 px-3 py-2 bg-primary/5 clip-diagonal group-hover:bg-primary group-hover:text-black transition-colors">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-xs font-bold font-mono">MAR 2, 18:00</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-black/40 border border-white/5 group hover:border-primary/30 transition-colors cursor-pointer" onClick={handleUplink}>
                                <div>
                                    <div className="font-bold text-white uppercase text-sm mb-1 group-hover:text-primary transition-colors">Career Trajectory Guidance</div>
                                    <div className="text-xs text-text-muted font-mono">45-min Video Call</div>
                                </div>
                                <div className="flex items-center space-x-2 text-primary border border-primary/20 px-3 py-2 bg-primary/5 clip-diagonal group-hover:bg-primary group-hover:text-black transition-colors">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-xs font-bold font-mono">MAR 5, 14:30</span>
                                </div>
                            </div>
                        </div>
                        </>
                        )}
                    </motion.div>
                </main>
            </div>
        </div>
    );
};
export default MentorProfile;
