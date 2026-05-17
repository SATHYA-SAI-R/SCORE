import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Clock, User, ChevronLeft, ShieldCheck, ArrowUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useAuthStore } from '../../store/authStore';

const mockThread = {
    id: 't1',
    category: 'Web Development',
    title: 'How to scale WebSockets up to 1M users?',
    description: 'Looking for advice on infrastructure setup for NodeJS. I am currently reaching 10k connections easily, but I face issues with Redis PubSub bottlenecks. What is the standard approach to scale horizontally?',
    createdBy: { name: 'Alex Student', role: 'student' },
    createdAt: '2 hours ago',
    replies: [
        {
            id: 'r1',
            content: 'Use an API Gateway with native WebSocket support rather than putting load directly on node instances.',
            user: { name: 'Ravi Mehta', role: 'mentor', isTopContributor: true },
            createdAt: '1 hour ago'
        },
        {
            id: 'r2',
            content: 'I have tried that, usually costs too much on AWS.',
            user: { name: 'Alex Student', role: 'student' },
            createdAt: '30 mins ago'
        }
    ]
};

const CommunityThreadView = () => {
    const { category, threadId } = useParams();
    const { user } = useAuthStore();
    const [replyText, setReplyText] = useState('');
    const [uplinkCount, setUplinkCount] = useState(0);

    const canReply = user?.role === 'student' || user?.role === 'mentor';
    const isMentor = user?.role === 'mentor';
    const canUplink = user?.role === 'student';

    const submitReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        try {
            const response = await fetch('/api/community/replies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    threadId,
                    userId: user?._id || user?.id,
                    content: replyText
                })
            });

            if (!response.ok) throw new Error('Reply transmission failed');

            await response.json();

            toast.success('Reply transmitted securely.', {
                style: { background: '#000', color: '#ccff00', border: '1px solid #ccff00', fontFamily: 'monospace' },
                icon: '💬'
            });
            setReplyText('');
            // Note: In a real app we'd trigger a re-fetch of thread data here
        } catch (error) {
            toast.error('Failed to transmit reply.');
        }
    };

    const handleUplink = async () => {
        if (!canUplink) return;

        try {
            const response = await fetch(`/api/community/threads/${threadId}/uplink`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Uplink failed');

            const data = await response.json();

            if (data.uplinkCount !== undefined) {
                setUplinkCount(data.uplinkCount);
            } else {
                setUplinkCount(prev => prev + 1);
            }
            toast.success('Uplink transmitted. Mentors notified.', {
                style: { background: '#000', color: '#ccff00', border: '1px solid #ccff00', fontFamily: 'monospace' },
                icon: '📡'
            });
        } catch (error) {
            toast.error('Uplink transmission failed.');
        }
    };

    return (
        <div className="min-h-screen bg-background font-mono selection:bg-primary selection:text-black flex flex-col">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 p-6 lg:p-10 relative overflow-y-auto">
                    <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-4xl mx-auto">
                        <Link to={`/community/${category}`} className="inline-flex items-center space-x-2 text-text-muted hover:text-white transition-colors mb-6 group text-xs uppercase tracking-widest font-bold">
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span>Back to Category</span>
                        </Link>

                        <div className="bg-surface border border-white/10 p-8 mb-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-2 h-full bg-primary/20"></div>

                            <div className="flex items-center space-x-2 mb-4">
                                <span className="px-2 py-1 bg-white/5 border border-white/10 text-[10px] text-text-muted uppercase">
                                    {mockThread.category}
                                </span>
                                <span className="text-xs text-text-muted font-bold tracking-widest uppercase">ID: {threadId}</span>
                            </div>

                            <h1 className="text-2xl font-bold mb-4 uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-cyan-400 animate-gradient-x">
                                {mockThread.title}
                            </h1>

                            <div className="flex items-center gap-6 mb-6 text-xs text-text-muted uppercase tracking-widest pb-6 border-b border-white/10">
                                <div className="flex items-center gap-2">
                                    <User className="w-3 h-3" />
                                    <span>{mockThread.createdBy.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-3 h-3" />
                                    <span>{mockThread.createdAt}</span>
                                </div>
                            </div>

                            <p className="text-white/80 leading-relaxed font-light mb-6">
                                {mockThread.description}
                            </p>

                            <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-6">
                                <div className="flex items-center gap-4">
                                    {canUplink ? (
                                        <button
                                            onClick={handleUplink}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition-colors text-xs uppercase tracking-widest font-bold"
                                        >
                                            <ArrowUp className="w-3 h-3" />
                                            Uplink {uplinkCount > 0 && `(${uplinkCount})`}
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 text-text-muted border border-white/10 text-xs uppercase tracking-widest font-bold">
                                            <ArrowUp className="w-3 h-3" />
                                            Uplinks: {uplinkCount}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Replies List */}
                        <h2 className="text-lg font-bold text-white mb-6 uppercase flex items-center">
                            <div className="w-2 h-2 bg-secondary rounded-full mr-3 animate-pulse"></div>
                            Neural Interface Replies
                        </h2>

                        <div className="space-y-4 mb-8">
                            {mockThread.replies.map((reply) => (
                                <div key={reply.id} className={`bg-surface border p-6 relative ${reply.user.role === 'mentor' ? 'border-primary/50 bg-primary/5' : 'border-white/10'}`}>
                                    {reply.user.role === 'mentor' && (
                                        <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-black text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 clip-diagonal">
                                            <ShieldCheck className="w-3 h-3" /> MENTOR {reply.user.isTopContributor && "• TOP CONTRIBUTOR"}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-4 mb-4 text-xs text-text-muted uppercase tracking-widest">
                                        <span className={`font-bold ${reply.user.role === 'mentor' ? 'text-primary' : 'text-white'}`}>
                                            {reply.user.name}
                                        </span>
                                        <span>• {reply.createdAt}</span>
                                    </div>
                                    <p className="text-white/80 leading-relaxed font-light">{reply.content}</p>
                                </div>
                            ))}
                        </div>

                        {/* Conditional Reply Box */}
                        {canReply ? (
                            <form onSubmit={submitReply} className="bg-surface border border-white/10 p-6">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4">Transmit Reply</h3>
                                <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Initiate data transfer..."
                                    className="w-full h-32 bg-background border border-white/20 text-white placeholder-text-muted p-4 focus:outline-none focus:border-primary focus:bg-white/5 transition-all text-sm font-mono resize-none mb-4"
                                />
                                <button type="submit" className="bg-primary text-black font-bold py-3 px-6 uppercase text-[10px] tracking-widest hover:bg-white transition-colors clip-diagonal">
                                    Send_Packet
                                </button>
                            </form>
                        ) : (
                            <div className="p-6 border border-white/10 text-center text-text-muted uppercase text-sm font-mono bg-surface">
                                Recruiters have read-only access to this sector.
                            </div>
                        )}

                    </motion.div>
                </main>
            </div>
        </div>
    );
};
export default CommunityThreadView;
