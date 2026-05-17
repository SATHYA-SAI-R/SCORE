import React from 'react';
import { MessageSquare, User } from 'lucide-react';

const DoubtCard = ({ doubt, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-surface border border-white/10 p-5 hover:border-primary/50 transition-colors group cursor-pointer relative overflow-hidden flex flex-col h-full"
    >
      <div className="flex-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <User className="w-4 h-4 text-text-muted" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">{doubt.authorName}</p>
              <p className="text-[10px] text-text-muted font-mono">{new Date(doubt.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          {doubt.status === 'resolved' && (
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#FF003C] border border-[#FF003C]/30 bg-[#FF003C]/10 px-2 py-0.5">
              Closed
            </div>
          )}
        </div>
        
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {doubt.title}
        </h3>
        
        <p className="text-sm text-text-muted mb-4 line-clamp-3">
          {doubt.description}
        </p>

        {doubt.tags && doubt.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {doubt.tags.map((tag, index) => (
              <span key={index} className="text-[10px] uppercase tracking-widest px-2 py-1 bg-white/5 text-primary border border-primary/20">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
        <div className="flex items-center space-x-2 text-text-muted group-hover:text-white transition-colors">
          <MessageSquare className="w-4 h-4" />
          <span className="text-xs font-mono">{doubt.repliesCount || 0} Replies</span>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
          View Thread 
          <span className="ml-1">→</span>
        </span>
      </div>
    </div>
  );
};

export default DoubtCard;
