import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Calendar, Loader2, MessageSquare, Users, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { getMentors } from '../../lib/userService';
import { getDoubts, createDoubt } from '../../lib/doubtService';
import { sendMessage } from '../../lib/messageService';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import DoubtCard from '../components/DoubtCard';
import DoubtThread from '../components/DoubtThread';

const AlumniMentorship = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('doubts'); // 'doubts' | 'mentors'
  
  // Mentors state
  const [mentors, setMentors] = useState([]);
  const [isMentorsLoading, setIsMentorsLoading] = useState(true);

  // Doubts state
  const [doubts, setDoubts] = useState([]);
  const [isDoubtsLoading, setIsDoubtsLoading] = useState(true);
  const [selectedDoubt, setSelectedDoubt] = useState(null);
  const [showPostDoubtModal, setShowPostDoubtModal] = useState(false);
  
  // New doubt form state
  const [newDoubtTitle, setNewDoubtTitle] = useState('');
  const [newDoubtDesc, setNewDoubtDesc] = useState('');
  const [newDoubtTags, setNewDoubtTags] = useState('');

  useEffect(() => {
    fetchMentors();
    fetchDoubts();
  }, []);

  const fetchMentors = async () => {
    setIsMentorsLoading(true);
    try {
      const data = await getMentors();
      setMentors(data);
    } catch (error) {
      console.error("Failed to fetch mentors", error);
      toast.error("Failed to fetch mentors");
    } finally {
      setIsMentorsLoading(false);
    }
  };

  const fetchDoubts = async () => {
    setIsDoubtsLoading(true);
    try {
      const data = await getDoubts(user?.uid);
      setDoubts(data);
    } catch (error) {
      console.error("Failed to fetch doubts", error);
      toast.error("Failed to fetch doubt threads");
    } finally {
      setIsDoubtsLoading(false);
    }
  };

  const handlePostDoubt = async (e) => {
    e.preventDefault();
    if (!newDoubtTitle.trim() || !newDoubtDesc.trim()) return;

    try {
      const tagsArray = newDoubtTags.split(',').map(t => t.trim()).filter(t => t);
      await createDoubt(user.uid, user.name || 'Student', newDoubtTitle, newDoubtDesc, tagsArray);
      toast.success('Doubt posted successfully!');
      setShowPostDoubtModal(false);
      setNewDoubtTitle('');
      setNewDoubtDesc('');
      setNewDoubtTags('');
      fetchDoubts();
    } catch (error) {
      toast.error('Failed to post doubt.');
    }
  };

  const handleUplink = async (mentor) => {
    if (!user) {
      toast.error("You must be logged in.");
      return;
    }

    try {
      // Create a unique conversation ID for these two users
      const conversationId = [user.uid, mentor.id].sort().join('_');
      
      const initialMessage = `Hello ${mentor.name}! I am a student interested in your mentorship. Could we connect?`;
      
      await sendMessage(
        conversationId,
        user.uid,
        initialMessage,
        [user.uid, mentor.id] // Participants Array
      );

      toast.success(`Uplink sent to ${mentor.name}!`, {
        style: {
          background: '#000000',
          color: '#CCFF00',
          border: '1px solid #333333',
          fontFamily: 'monospace',
        },
        icon: '🔗',
      });

      // Navigate to Messages page
      navigate('/student/messages');
      
    } catch (error) {
      console.error(error);
      toast.error("Failed to establish uplink.");
    }
  };

  return (
    <div className="min-h-screen bg-background font-mono selection:bg-primary selection:text-black">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-10 relative overflow-hidden">
          {/* Background Grid */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
            <h1 className="text-3xl font-bold mb-2 uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-cyan-400 animate-gradient-x">MenTors_&_Forums</h1>
            <p className="text-text-muted mb-8 text-sm uppercase tracking-wider">Connect with verified graduates or discuss technical roadmaps</p>

            {/* Tabs */}
            <div className="flex space-x-4 border-b border-white/10 mb-8">
              <button 
                onClick={() => setActiveTab('doubts')}
                className={`flex items-center space-x-2 pb-4 border-b-2 transition-colors uppercase text-sm font-bold tracking-wider ${activeTab === 'doubts' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-white'}`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Doubt Forums</span>
              </button>
              <button 
                onClick={() => setActiveTab('mentors')}
                className={`flex items-center space-x-2 pb-4 border-b-2 transition-colors uppercase text-sm font-bold tracking-wider ${activeTab === 'mentors' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-white'}`}
              >
                <Users className="w-4 h-4" />
                <span>Mentor Network</span>
              </button>
            </div>

            {/* Doubts Tab Content */}
            {activeTab === 'doubts' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white uppercase tracking-widest">Active Threads</h2>
                  {user?.role !== 'recruiter' && (
                    <button 
                      onClick={() => setShowPostDoubtModal(true)}
                      className="bg-primary text-black font-bold uppercase text-xs tracking-wider px-4 py-2 flex items-center hover:bg-primary-hover transition-colors clip-diagonal"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Ask a Question
                    </button>
                  )}
                </div>

                {isDoubtsLoading ? (
                  <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : doubts.length === 0 ? (
                  <div className="text-center py-20 text-text-muted border border-white/5 bg-surface">
                    No active doubts observed in the network.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {doubts.map((doubt) => (
                      <DoubtCard 
                        key={doubt.id} 
                        doubt={doubt} 
                        onClick={() => setSelectedDoubt(doubt.id)} 
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Mentors Tab Content */}
            {activeTab === 'mentors' && (
              <div>
                {isMentorsLoading ? (
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
                        <div className="w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center text-3xl">
                          👨‍💼
                        </div>
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
                        <button onClick={() => handleUplink(mentor)} className="flex-1 bg-white text-black font-bold py-2 px-4 uppercase text-[10px] tracking-widest hover:bg-primary transition-colors clip-diagonal">
                          Request_Uplink
                        </button>
                        <Link to={`/mentors/${mentor.id}`} className="px-4 py-2 border border-white/20 text-white hover:border-white transition-colors uppercase text-[10px] tracking-widest flex items-center justify-center">
                          Profile
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                )}

                <div className="bg-surface border border-white/10 p-6 relative">
                  <div className="absolute left-0 top-6 bottom-6 w-1 bg-secondary"></div>
                  <h2 className="text-xl font-bold text-white mb-6 uppercase flex items-center">
                    <div className="w-2 h-2 bg-secondary rounded-full mr-3 animate-pulse"></div>
                    Upcoming_Sessions
                  </h2>
                  <div className="flex items-center justify-between p-4 bg-black/40 border border-white/5">
                    <div>
                      <div className="font-bold text-white uppercase text-sm mb-1">Career Guidance Session</div>
                      <div className="text-xs text-text-muted font-mono">with Ravi Mehta (Software Architect)</div>
                    </div>
                    <div className="flex items-center space-x-2 text-primary border border-primary/20 px-3 py-1 bg-primary/5">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs font-bold font-mono">FEB 20, 15:00</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
          </motion.div>
        </main>
      </div>

      {/* Post Doubt Modal */}
      {showPostDoubtModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface border border-white/20 p-6 w-full max-w-md relative"
          >
            <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-6">Broadcast Query</h2>
            <form onSubmit={handlePostDoubt} className="space-y-4">
              <div>
                <label className="block text-xs text-primary uppercase tracking-widest mb-1">Query Subject</label>
                <input 
                  type="text" 
                  value={newDoubtTitle}
                  onChange={(e) => setNewDoubtTitle(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 p-3 text-white text-sm focus:border-primary focus:outline-none transition-colors"
                  placeholder="e.g. How to structure a React application?"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-primary uppercase tracking-widest mb-1">Details</label>
                <textarea 
                  value={newDoubtDesc}
                  onChange={(e) => setNewDoubtDesc(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 p-3 text-white text-sm min-h-[120px] focus:border-primary focus:outline-none transition-colors"
                  placeholder="Describe your issue or question..."
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-primary uppercase tracking-widest mb-1">Tags (Comma Separated)</label>
                <input 
                  type="text" 
                  value={newDoubtTags}
                  onChange={(e) => setNewDoubtTags(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 p-3 text-white text-sm focus:border-primary focus:outline-none transition-colors"
                  placeholder="React, Architecture, Frontend"
                />
              </div>
              <div className="flex space-x-3 pt-4 border-t border-white/10">
                <button type="button" onClick={() => setShowPostDoubtModal(false)} className="flex-1 py-3 text-xs font-bold uppercase tracking-widest text-text-muted hover:text-white transition-colors border border-white/10">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-3 text-xs font-bold uppercase tracking-widest text-black bg-primary hover:bg-primary-hover transition-colors clip-diagonal">
                  Broadcast
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Thread Modal */}
      {selectedDoubt && (
        <DoubtThread 
          doubtId={selectedDoubt} 
          currentUser={user} 
          onClose={() => setSelectedDoubt(null)}
          onResolved={() => {
            setSelectedDoubt(null);
            fetchDoubts();
          }} 
        />
      )}

    </div>
  );
};
export default AlumniMentorship;
