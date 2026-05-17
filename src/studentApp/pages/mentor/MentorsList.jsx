import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Calendar, Users, MessageCircle, Loader2 } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { getMentors } from '../../../lib/userService';
import toast from 'react-hot-toast';

const MentorsList = () => {
    const navigate = useNavigate();
    const [mentors, setMentors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const data = await getMentors();
                setMentors(data);
            } catch (error) {
                console.error("Failed to fetch mentors", error);
                toast.error("Failed to fetch mentors");
            } finally {
                setIsLoading(false);
            }
        };
        fetchMentors();
    }, []);

    return (
        <div className="min-h-screen bg-background font-mono selection:bg-primary selection:text-black">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6 lg:p-10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
                        <h1 className="text-3xl font-bold mb-2 uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-cyan-400 animate-gradient-x">Alumni Mentors</h1>
                        <p className="text-text-muted mb-8 text-sm uppercase tracking-wider">Connect with verified graduates for neural downloads</p>

                        {isLoading ? (
                            <div className="flex justify-center items-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : mentors.length === 0 ? (
                            <div className="text-center py-20 text-text-muted border border-white/5 bg-surface">
                                No mentors available on the network currently.
                            </div>
                        ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {mentors.map((mentor) => (
                                <div key={mentor.id} className="bg-surface border border-white/10 p-6 hover:border-primary/50 transition-colors group relative overflow-hidden">
                                    <div className="flex items-start space-x-4 mb-6">
                                        <div className="w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center text-3xl">👨‍💼</div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-white uppercase tracking-wider group-hover:text-primary transition-colors">{mentor.name || 'Unknown Mentor'}</h3>
                                            <p className="text-text-muted text-xs font-mono mb-1">{mentor.roleTitle || mentor.role || 'Mentor'}</p>
                                            <p className="text-text-muted text-[10px] uppercase tracking-widest">{mentor.education || mentor.experience || ''}</p>
                                            <div className="flex items-center space-x-2 mt-2">
                                                <Star className="w-3 h-3 fill-primary text-primary" />
                                                <span className="text-xs text-secondary-foreground font-bold">{mentor.rating || 0} <span className="text-text-muted font-normal">({mentor.mentees || 0}+ mentees)</span></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-6">
                                        <p className="text-[10px] text-primary uppercase tracking-widest mb-1">Modules</p>
                                        <p className="text-sm text-white font-light">{mentor.skills && mentor.skills.length > 0 ? mentor.skills.join(', ') : (mentor.expertise || 'Career Guidance, Mentorship')}</p>
                                    </div>

                                    <div className="flex space-x-3">
                                        <button className="flex-1 bg-white text-black font-bold py-2 px-4 uppercase text-[10px] tracking-widest hover:bg-primary transition-colors clip-diagonal">
                                            Request_Uplink
                                        </button>
                                        <Link to={`/mentors/${mentor.id}`} className="px-4 py-2 border border-white/20 text-white hover:border-white transition-colors uppercase text-[10px] tracking-widest text-center">
                                            Profile
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                        )}

                        <div className="bg-surface border border-white/10 p-6 flex flex-col justify-center gap-4 group hover:border-primary/30 transition-all cursor-pointer" onClick={() => navigate('/community')}>
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded">
                                    <MessageCircle className="text-primary w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white uppercase">Mentor Community Discussions</h2>
                                    <p className="text-sm text-text-muted transition-colors group-hover:text-white">Join public threads, ask questions, and get replies from alumni.</p>
                                </div>
                            </div>
                        </div>

                    </motion.div>
                </main>
            </div>
        </div>
    );
};
export default MentorsList;
