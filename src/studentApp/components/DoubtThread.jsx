import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Loader2, User } from 'lucide-react';
import { getDoubtWithReplies, addReplyToDoubt, resolveDoubt } from '../../lib/doubtService';
import toast from 'react-hot-toast';

const DoubtThread = ({ doubtId, currentUser, onClose, onResolved }) => {
  const [doubt, setDoubt] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchDoubt();
  }, [doubtId]);

  const fetchDoubt = async () => {
    setIsLoading(true);
    try {
      const data = await getDoubtWithReplies(doubtId);
      setDoubt(data);
    } catch (error) {
      toast.error('Failed to load doubt thread.');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setIsSubmitting(true);
    try {
      await addReplyToDoubt(
        doubtId,
        currentUser.uid,
        currentUser.name || 'Anonymous',
        currentUser.role || 'Student',
        replyText
      );
      setReplyText("");
      fetchDoubt(); // Refresh the thread
      toast.success('Reply posted successfully!');
    } catch (error) {
      toast.error('Failed to post reply.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolve = async () => {
    if (!window.confirm("Are you sure this doubt is cleared? It will be removed from the active forum.")) return;
    
    setIsSubmitting(true);
    try {
      await resolveDoubt(doubtId);
      toast.success("Thread closed. It will no longer appear on the forum.");
      if (onResolved) onResolved();
      else onClose();
    } catch (err) {
      toast.error('Failed to resolve doubt.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-background border border-white/20 w-full max-w-3xl max-h-[90vh] flex flex-col relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-surface/50">
          <h2 className="text-lg font-bold uppercase tracking-wider text-white">Doubt Thread</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 transition-colors">
            <X className="w-5 h-5 text-text-muted hover:text-white" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : doubt ? (
            <>
              {/* Original Post */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-white uppercase tracking-wider">{doubt.authorName}</p>
                      <p className="text-xs text-text-muted font-mono">{new Date(doubt.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  {currentUser?.uid === doubt.authorId && (
                    <button 
                      onClick={handleResolve}
                      disabled={isSubmitting}
                      className="bg-black text-primary border border-primary hover:bg-primary/10 transition-colors uppercase text-[10px] tracking-widest font-bold px-3 py-1 clip-diagonal flex items-center shrink-0"
                    >
                      {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : "Close Thread"}
                    </button>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-primary">{doubt.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed whitespace-pre-wrap">{doubt.description}</p>
                
                {doubt.tags && doubt.tags.length > 0 && (
                  <div className="flex gap-2">
                    {doubt.tags.map(tag => (
                      <span key={tag} className="text-[10px] bg-white/5 text-primary border border-primary/20 px-2 py-1 uppercase">{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="h-px bg-white/10 w-full" />

              {/* Replies Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-4">
                  Responses ({doubt.replies?.length || 0})
                </h4>
                
                {doubt.replies?.map((reply, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={reply.id} 
                    className={`p-4 border ${reply.userRole.toLowerCase().includes('mentor') ? 'border-primary/30 bg-primary/5' : 'border-white/10 bg-surface'} flex space-x-4`}
                  >
                    <div className="w-8 h-8 shrink-0 rounded-full bg-black flex items-center justify-center border border-white/10">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-bold text-sm text-white">{reply.userName}</span>
                        <span className={`text-[10px] uppercase px-1.5 py-0.5 border ${reply.userRole.toLowerCase().includes('mentor') ? 'text-primary border-primary' : 'text-text-muted border-white/20'}`}>
                          {reply.userRole}
                        </span>
                        <span className="text-[10px] text-text-muted font-mono">{new Date(reply.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-text-muted whitespace-pre-wrap">{reply.text}</p>
                    </div>
                  </motion.div>
                ))}
                
                {(!doubt.replies || doubt.replies.length === 0) && (
                  <div className="text-center py-8 text-text-muted border border-white/5 border-dashed">
                    No responses yet. Be the first to share your knowledge!
                  </div>
                )}
              </div>
            </>
          ) : (
             <div className="text-center text-red-400">Doubt not found.</div>
          )}
        </div>

        {/* Reply Input Box */}
        <div className="p-4 border-t border-white/10 bg-surface">
          <form onSubmit={handleReply} className="flex gap-4">
            <input 
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a response..."
              className="flex-1 bg-black/50 border border-white/20 p-3 text-sm text-white placeholder-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all font-mono"
            />
            <button 
              type="submit"
              disabled={isSubmitting || !replyText.trim()}
              className="bg-primary hover:bg-primary-hover text-black font-bold uppercase text-xs tracking-wider px-6 py-3 shrink-0 flex items-center justify-center disabled:opacity-50 transition-colors clip-diagonal"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4 mr-2" /> Send</>}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default DoubtThread;
