import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useAuthStore } from '../../store/authStore';
import { motion } from 'framer-motion';
import { getDoubts } from '../../../lib/doubtService';
import { getConversations } from '../../../lib/messageService';
import { getUserProfile } from '../../../lib/userService';
import {
    Users,
    MessageSquare,
    ArrowUp,
    Calendar,
    Activity,
    TrendingUp,
    ShieldCheck,
    PlusCircle,
    CheckCircle,
    Check,
    X as XIcon,
    User
} from 'lucide-react';

const MentorDashboardHome = () => {
    const { user } = useAuthStore();

    const [stats, setStats] = useState({
        totalSessions: 0,
        totalStudentsMentored: 0,
        communityRepliesCount: 0,
        uplinksReceived: 0
    });

    useEffect(() => {
        const fetchRealtimeStats = async () => {
            if (!user?.uid) return;
            try {
                // Fetch conversations to simulate "sessions" and "mentored students"
                const convos = await getConversations(user.uid);
                
                // Fetch doubts to count replies
                const doubts = await getDoubts(user.uid);
                let repliesCount = 0;
                doubts.forEach(d => {
                    if (d.replies && Array.isArray(d.replies)) {
                        repliesCount += d.replies.filter(r => r.userId === user.uid).length;
                    }
                });
                
                // Fetch user profile for uplinks/rating
                const profile = await getUserProfile(user.uid);
                
                setStats({
                    totalSessions: convos.length,
                    totalStudentsMentored: convos.length,
                    communityRepliesCount: repliesCount,
                    uplinksReceived: profile.rating || profile.uplinks || 0
                });
            } catch (err) {
                console.error("Failed to fetch mentor stats:", err);
            }
        };
        fetchRealtimeStats();
    }, [user?.uid]);

    // Lightweight Mentor Impact Score
    // computed dynamically: (sessionsCount * 5) + (communityRepliesCount * 2) + (uplinksReceived * 1)
    const impactScore = (stats.totalSessions * 5) + (stats.communityRepliesCount * 2) + (stats.uplinksReceived * 1);

    const upcomingSessions = [];

    const recentActivity = [
        { id: 1, action: "Replied to Community Thread", topic: "WebSockets Scaling", time: "2 hours ago" },
        { id: 2, action: "Completed Session", topic: "Next.js Authentication", time: "1 day ago" }
    ];

    const [isAvailable, setIsAvailable] = useState(user?.isAvailable ?? true);

    const toggleAvailability = () => {
        setIsAvailable(!isAvailable);
        // Note: In a real app we would update this in the backend too
    };

    return (
        <div className="min-h-screen bg-background font-mono selection:bg-primary selection:text-black flex flex-col text-white">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 p-6 lg:p-10 relative overflow-y-auto w-full">
                    <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-7xl mx-auto space-y-8">

                        {/* Welcome Section */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8">
                            <div>
                                <h1 className="text-3xl font-bold mb-2 uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-cyan-400 animate-gradient-x flex items-center gap-3">
                                    <ShieldCheck className="w-8 h-8 text-primary" />
                                    Welcome, {user?.name || 'Mentor'}
                                </h1>
                                <p className="text-text-muted text-sm uppercase tracking-wider">
                                    Mentor Interface Active // Global Impact Level: {impactScore > 200 ? 'Elite' : 'Advanced'}
                                </p>
                            </div>

                            <div className="flex bg-surface border border-primary/30 p-4 gap-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-2 h-full bg-primary/20 group-hover:bg-primary/50 transition-colors"></div>
                                <div className="flex flex-col justify-center">
                                    <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3 text-primary" /> Impact Score
                                    </span>
                                    <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">{impactScore}</span>
                                </div>
                            </div>
                        </div>

                        {/* Analytics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-surface border border-white/10 p-6 flex flex-col hover:bg-primary/10 hover:border-primary/30 transition-all group">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-primary text-xs uppercase tracking-widest font-bold">Total Sessions</h3>
                                    <Calendar className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
                                </div>
                                <div className="text-3xl text-white font-bold">{stats.totalSessions}</div>
                            </div>

                            <div className="bg-surface border border-white/10 p-6 flex flex-col hover:bg-cyan-400/10 hover:border-cyan-400/30 transition-all group">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-cyan-400 text-xs uppercase tracking-widest font-bold">Students Mentored</h3>
                                    <Users className="w-4 h-4 text-text-muted group-hover:text-cyan-400 transition-colors" />
                                </div>
                                <div className="text-3xl text-white font-bold">{stats.totalStudentsMentored}</div>
                            </div>

                            <div className="bg-surface border border-white/10 p-6 flex flex-col hover:bg-purple-400/10 hover:border-purple-400/30 transition-all group">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-purple-400 text-xs uppercase tracking-widest font-bold">Community Qs</h3>
                                    <MessageSquare className="w-4 h-4 text-text-muted group-hover:text-purple-400 transition-colors" />
                                </div>
                                <div className="text-3xl text-white font-bold">{stats.communityRepliesCount}</div>
                            </div>

                            <div className="bg-surface border border-white/10 p-6 flex flex-col hover:bg-primary/10 hover:border-primary/30 transition-all group">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-primary text-xs uppercase tracking-widest font-bold">Total Uplinks</h3>
                                    <ArrowUp className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
                                </div>
                                <div className="text-3xl text-white font-bold">{stats.uplinksReceived}</div>
                            </div>
                        </div>

                        {/* Main Grid: Upcoming & Activity vs Quick Actions & Community */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* Left Column - Broader */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Upcoming Sessions */}
                                <div className="bg-surface border border-white/10 flex flex-col relative">
                                    <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                        <h2 className="text-lg font-bold uppercase tracking-widest flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-primary" />
                                            Upcoming Sessions
                                        </h2>
                                        <span className="text-xs text-text-muted uppercase tracking-widest">Next 48H</span>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        {upcomingSessions.length > 0 ? (
                                            upcomingSessions.map(session => (
                                                <div key={session.id} className="flex justify-between items-center bg-black/40 border border-white/5 p-4 hover:border-primary/20 transition-all">
                                                    <div>
                                                        <p className="text-sm font-bold text-white mb-1 uppercase tracking-widest">{session.topic}</p>
                                                        <p className="text-xs text-text-muted flex items-center gap-2">
                                                            <Users className="w-3 h-3" /> {session.student}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-xs font-bold text-primary mb-1 uppercase tracking-widest">{session.time}</div>
                                                        <button className="text-[10px] text-text-muted uppercase border border-white/10 px-2 py-1 hover:bg-white/5 transition-colors">Reschedule</button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="flex flex-col items-center justify-center p-8 text-center bg-black/40 border border-white/5 border-dashed">
                                                <p className="text-text-muted mb-4 uppercase tracking-widest text-sm">No Active Sessions Yet</p>
                                                <div className="flex gap-4 mt-4">
                                                    <Link to="/community" className="px-4 py-2 bg-primary/10 text-primary border border-primary/30 text-xs font-bold uppercase tracking-widest hover:bg-primary/20 transition-colors">
                                                        View Community
                                                    </Link>
                                                    <button onClick={toggleAvailability} className="px-4 py-2 bg-white/5 text-white border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center gap-2">
                                                        {isAvailable ? <Check className="w-3 h-3 text-green-500" /> : <XIcon className="w-3 h-3 text-red-500" />} Update Availability
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Recent Activity */}
                                <div className="bg-surface border border-white/10 flex flex-col relative">
                                    <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                        <h2 className="text-lg font-bold uppercase tracking-widest flex items-center gap-2">
                                            <Activity className="w-5 h-5 text-cyan-400" />
                                            Recent Activity
                                        </h2>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        {recentActivity.map((activity, idx) => (
                                            <div key={activity.id} className="flex gap-4 relative">
                                                {idx !== recentActivity.length - 1 && (
                                                    <div className="absolute left-2.5 top-8 bottom-0 w-px bg-white/10 -mb-6"></div>
                                                )}
                                                <div className="w-5 h-5 rounded-full bg-surface border border-white/20 flex items-center justify-center shrink-0 z-10 mt-0.5">
                                                    <CheckCircle className="w-3 h-3 text-text-muted" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-white mb-1">{activity.action} - <span className="font-bold">{activity.topic}</span></p>
                                                    <p className="text-xs text-text-muted">{activity.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Narrower */}
                            <div className="space-y-8">
                                {/* Quick Actions */}
                                <div className="bg-surface border border-white/10 flex flex-col relative">
                                    <div className="p-6 border-b border-white/10">
                                        <h2 className="text-lg font-bold uppercase tracking-widest">Quick Actions</h2>
                                    </div>
                                    <div className="p-6 flex flex-col gap-3">
                                        <button onClick={toggleAvailability} className="w-full flex justify-between items-center gap-3 bg-primary/10 border border-primary/30 p-3 hover:bg-primary/20 transition-colors text-primary uppercase text-xs font-bold tracking-widest">
                                            <span className="flex items-center gap-3"><PlusCircle className="w-4 h-4" /> Add Availability</span>
                                            {isAvailable ? <span className="text-green-500 text-[10px] flex items-center gap-1"><Check className="w-3 h-3" /> Available</span> : <span className="text-red-500 text-[10px] flex items-center gap-1"><XIcon className="w-3 h-3" /> Busy</span>}
                                        </button>
                                        <Link to="/student/mentorship" className="w-full flex items-center gap-3 bg-white/5 border border-white/10 p-3 hover:bg-white/10 transition-colors text-white uppercase text-xs tracking-widest">
                                            <MessageSquare className="w-4 h-4 text-purple-400" /> Reply to Doubts
                                        </Link>
                                        <Link to="/student/profile" className="w-full flex items-center gap-3 bg-white/5 border border-white/10 p-3 hover:bg-white/10 transition-colors text-white uppercase text-xs tracking-widest">
                                            <User className="w-4 h-4 text-cyan-400" /> View Profile
                                        </Link>
                                    </div>
                                </div>

                                {/* Community Engagement Panel */}
                                <div className="bg-surface border border-white/10 flex flex-col relative">
                                    <div className="p-6 border-b border-white/10">
                                        <h2 className="text-lg font-bold uppercase tracking-widest flex items-center gap-2">
                                            <MessageSquare className="w-5 h-5 text-purple-400" />
                                            Community Pulse
                                        </h2>
                                    </div>
                                    <div className="p-6">
                                        <div className="mb-6">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs uppercase tracking-widest text-text-muted">Top Contributor Status</span>
                                                <span className="text-xs font-bold text-primary">85%</span>
                                            </div>
                                            <div className="w-full h-1 bg-white/10">
                                                <div className="h-full bg-primary w-[85%]"></div>
                                            </div>
                                            <p className="text-[10px] text-text-muted mt-2 uppercase">15 more impact points to rank up.</p>
                                        </div>

                                        <p className="text-sm font-light text-white/80 leading-relaxed mb-4">
                                            There are currently <span className="text-primary font-bold">12 unanswered doubts</span> in the community requiring mentor attention.
                                        </p>
                                        <Link to="/community" className="w-full inline-block text-center bg-primary text-black font-bold py-3 uppercase text-xs tracking-widest hover:bg-white transition-colors clip-diagonal">
                                            Jump to Discussion
                                        </Link>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default MentorDashboardHome;
