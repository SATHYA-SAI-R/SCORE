import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Hash, Users, Send, Smile, Paperclip, Shield, Plus } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useAuthStore } from '../../store/authStore';
import { subscribeToMessages, sendMessage, editMessage } from '../../../lib/messageService';
import { getUserProfile } from '../../../lib/userService';

const CommunityDiscussion = () => {
    const { user } = useAuthStore();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [namesMap, setNamesMap] = useState({});
    const messagesEndRef = useRef(null);
    
    // Track currently active channel tab
    const [activeChannel, setActiveChannel] = useState("global_community_chat");
    
    // Edit state
    const [editingMsgId, setEditingMsgId] = useState(null);
    const [editText, setEditText] = useState("");

    useEffect(() => {
        const unsub = subscribeToMessages(activeChannel, (data) => {
            const mappedMessages = data.map(m => ({
                id: m.id,
                senderId: m.senderId,
                text: m.text,
                senderRole: m.senderRole || 'Student',
                senderName: m.senderName || m.senderId, // Will resolve names async below
                time: (() => {
                    try {
                        if (!m.timestamp) return "--:--";
                        const d = m.timestamp.seconds ? new Date(m.timestamp.seconds * 1000) : new Date(m.timestamp);
                        return isNaN(d) ? "--:--" : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    } catch(e) { return "--:--"; }
                })(),
                isOwn: m.senderId === user?.uid,
                isEdited: m.isEdited || false,
                timestamp: (() => {
                    if (!m.timestamp) return new Date().toISOString();
                    return m.timestamp.seconds ? new Date(m.timestamp.seconds * 1000).toISOString() : new Date(m.timestamp).toISOString();
                })()
            }));
            setMessages(mappedMessages);
        });
        return () => unsub();
    }, [user, activeChannel]);

    // Async resolve user names
    useEffect(() => {
      const resolveNames = async () => {
         const newNamesMap = { ...namesMap };
         let changed = false;
         
         for (const msg of messages) {
            if (msg.senderId && !newNamesMap[msg.senderId]) {
               try {
                  const prof = await getUserProfile(msg.senderId);
                  newNamesMap[msg.senderId] = prof.name || 'Unknown';
                  changed = true;
               } catch(e) {
                  newNamesMap[msg.senderId] = 'Unknown';
                  changed = true;
               }
            }
         }
         
         if(changed) setNamesMap(newNamesMap);
      };
      resolveNames();
    }, [messages]);

    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !user) return;
        const text = newMessage;
        setNewMessage(""); 
        
        try {
            // Include everyone dynamically (we just care about appending msgs here)
            await sendMessage(activeChannel, user.uid, text, [user.uid]);
        } catch (err) {
            console.error("Failed to send message", err);
        }
    };

    const handleEditMessage = async (msgId) => {
        if (!editText.trim()) {
           setEditingMsgId(null);
           return;
        }
        try {
            await editMessage(activeChannel, msgId, editText);
            setEditingMsgId(null);
            setEditText("");
        } catch (err) {
            console.error("Failed to edit message", err);
        }
    };

    return (
        <div className="min-h-screen bg-background font-mono selection:bg-primary selection:text-black flex flex-col">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 flex p-4 lg:p-6 gap-6 relative">
                    {/* Background Grid */}
                    <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

                   {/* Server Channels Panel */}
                   <div className="w-64 bg-surface border border-white/10 flex flex-col relative z-10 hidden md:flex">
                      <div className="p-4 border-b border-white/10 bg-black/50 shadow-md">
                         <h2 className="text-sm font-bold uppercase tracking-widest text-white flex items-center">
                            <Shield className="w-4 h-4 text-primary mr-2" />
                            Mentor_Hub
                         </h2>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto py-4">
                         <div className="px-4 mb-2">
                             <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest flex items-center mb-2">
                                Text Channels
                             </span>
                             <div className="space-y-1">
                                <button 
                                    onClick={() => setActiveChannel('global_community_chat')}
                                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-wider font-bold transition-colors ${activeChannel === 'global_community_chat' ? 'bg-white/5 text-primary border-l-2 border-primary' : 'text-text-muted hover:text-white hover:bg-white/5'}`}
                                >
                                   <Hash className="w-4 h-4" /> Global_Chat
                                </button>
                                <button 
                                    onClick={() => setActiveChannel('announcements_chat')}
                                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-wider font-bold transition-colors ${activeChannel === 'announcements_chat' ? 'bg-white/5 text-primary border-l-2 border-primary' : 'text-text-muted hover:text-white hover:bg-white/5'}`}
                                >
                                   <Hash className="w-4 h-4" /> Announcements
                                </button>
                                <button 
                                    onClick={() => setActiveChannel('resources_chat')}
                                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-wider font-bold transition-colors ${activeChannel === 'resources_chat' ? 'bg-white/5 text-primary border-l-2 border-primary' : 'text-text-muted hover:text-white hover:bg-white/5'}`}
                                >
                                   <Hash className="w-4 h-4" /> Resources
                                </button>
                             </div>
                         </div>
                      </div>
                      
                      <div className="p-4 border-t border-white/10 bg-black/50 flex items-center gap-3">
                         <div className="w-8 h-8 bg-white/10 flex justify-center items-center text-primary font-bold uppercase border border-white/20">
                             {user?.name?.charAt(0) || 'U'}
                         </div>
                         <div>
                            <div className="text-xs font-bold text-white uppercase">{user?.name}</div>
                            <div className="text-[10px] text-text-muted flex items-center gap-1 font-mono uppercase">
                               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Online
                            </div>
                         </div>
                      </div>
                   </div>

                    {/* Chat Box Panel */}
                    <div className="flex-1 bg-black/80 border border-white/10 flex flex-col relative z-10 backdrop-blur-md">
                         <div className="h-14 border-b border-white/10 flex items-center px-6 bg-surface/50 shadow-md z-10 relative">
                             <Hash className="w-5 h-5 text-text-muted mr-3" />
                             <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                                {activeChannel === 'global_community_chat' ? 'Global_Chat' : activeChannel === 'announcements_chat' ? 'Announcements' : 'Resources'}
                             </h2>
                             <div className="ml-auto flex items-center gap-2 text-[10px] text-text-muted font-mono uppercase tracking-widest">
                                 <Users className="w-4 h-4 text-primary" /> Active Hub
                             </div>
                         </div>

                         {/* Messages Area Layout exactly like Discord -> Left Aligned with Avatar */}
                         <div className="flex-1 overflow-y-auto p-4 space-y-2 relative custom-scrollbar">
                           <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] pointer-events-none" />

                             {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                                   <MessageSquare className="w-12 h-12 text-primary/30" />
                                    <h3 className="text-xl font-bold uppercase text-white">Welcome Context Initiated</h3>
                                   <p className="text-text-muted text-sm font-mono max-w-sm uppercase">This is the start of the #{activeChannel.split('_')[0]} channel. Send a message to initiate connection.</p>
                                </div>
                             ) : (
                                 messages.map((msg, index) => {
                                    // Calculate if we should group messages from same user
                                    const prevMsg = messages[index - 1];
                                    const showHeader = !prevMsg || prevMsg.senderId !== msg.senderId || (new Date(msg.timestamp) - new Date(prevMsg.timestamp) > 5 * 60 * 1000); // 5 min gap
                                    const resolvedName = namesMap[msg.senderId] || msg.senderName || 'Anonymous';
                                    
                                    return (
                                     <motion.div
                                         key={msg.id}
                                         initial={{ opacity: 0, x: -10 }}
                                         animate={{ opacity: 1, x: 0 }}
                                         className={`flex hover:bg-white/5 px-2 py-1 -mx-2 group rounded-sm ${showHeader ? 'mt-4' : 'mt-0'}`}
                                     >
                                         <div className="flex gap-4 w-full">
                                            {/* Avatar or time placeholder */}
                                            <div className="w-10 flex shrink-0 justify-center">
                                                {showHeader ? (
                                                   <div className="w-10 h-10 rounded-full bg-surface border border-white/20 flex items-center justify-center font-bold text-white uppercase overflow-hidden shrink-0 mt-0.5">
                                                      {(resolvedName || 'A').charAt(0)}
                                                   </div>
                                                ) : (
                                                   <span className="text-[10px] text-text-muted opacity-0 group-hover:opacity-100 mt-1 font-mono uppercase tracking-tighter">
                                                      {msg.time}
                                                   </span>
                                                )}
                                            </div>

                                             {/* Message Content */}
                                             <div className="flex flex-col flex-1 pb-1">
                                                 {showHeader && (
                                                     <div className="flex items-end gap-2 mb-1">
                                                         <span className={`text-sm font-bold hover:underline cursor-pointer ${msg.isOwn ? 'text-primary' : 'text-cyan-400'}`}>
                                                             {resolvedName}
                                                         </span>
                                                         <span className="text-[10px] text-text-muted font-mono uppercase tracking-widest">
                                                             {new Date(msg.timestamp).toLocaleDateString()} {msg.time}
                                                         </span>
                                                     </div>
                                                 )}
                                                 
                                                 {editingMsgId === msg.id ? (
                                                    <div className="mt-1">
                                                       <div className="flex items-center gap-2 bg-surface border border-white/20 p-2">
                                                          <input 
                                                             type="text"
                                                             autoFocus
                                                             value={editText}
                                                             onChange={(e) => setEditText(e.target.value)}
                                                             onKeyDown={(e) => {
                                                                if (e.key === 'Enter') handleEditMessage(msg.id);
                                                                if (e.key === 'Escape') setEditingMsgId(null);
                                                             }}
                                                             className="flex-1 bg-transparent border-none text-white focus:outline-none text-sm font-mono tracking-wide"
                                                          />
                                                       </div>
                                                       <div className="text-[10px] text-text-muted uppercase tracking-widest mt-1">
                                                          escape to <span className="text-white cursor-pointer hover:underline" onClick={() => setEditingMsgId(null)}>cancel</span> • enter to <span className="text-primary cursor-pointer hover:underline" onClick={() => handleEditMessage(msg.id)}>save</span>
                                                       </div>
                                                    </div>
                                                 ) : (
                                                    <div className="text-[13px] text-white/90 font-mono leading-relaxed whitespace-pre-wrap group-hover:bg-white/5 inline-block pr-8 relative">
                                                        {msg.text}
                                                        {msg.isEdited && (
                                                           <span className="text-[10px] text-text-muted italic ml-2">(edited)</span>
                                                        )}
                                                        {msg.isOwn && (
                                                           <button 
                                                              onClick={() => {
                                                                 setEditingMsgId(msg.id);
                                                                 setEditText(msg.text);
                                                              }} 
                                                              className="absolute -right-4 top-0 opacity-0 group-hover:opacity-100 text-text-muted hover:text-primary transition-colors text-[10px] uppercase font-bold"
                                                           >
                                                              edit
                                                           </button>
                                                        )}
                                                    </div>
                                                 )}
                                             </div>
                                         </div>
                                     </motion.div>
                                    );
                                 })
                             )}
                             <div ref={messagesEndRef} />
                         </div>

                         {/* Input Area */}
                         <div className="p-4 px-6 mb-2">
                             <div className="flex items-center gap-3 bg-surface border border-white/20 p-2 relative overflow-hidden focus-within:border-primary transition-colors">
                                 {/* Accent line on left of input */}
                                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/10" />
                                 
                                 <button className="p-2 ml-2 bg-white/5 rounded-full text-text-muted hover:text-white hover:bg-white/10 transition-colors">
                                     <Plus className="w-4 h-4" />
                                 </button>
                                 
                                 <input
                                     type="text"
                                     value={newMessage}
                                     onChange={(e) => setNewMessage(e.target.value)}
                                     onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                     placeholder={`Message #${activeChannel.split('_')[0]}...`}
                                     className="flex-1 bg-transparent border-none text-white placeholder-white/30 focus:outline-none text-sm font-mono tracking-wide"
                                 />
                                 
                                 <button className="p-2 text-text-muted hover:text-white transition-colors">
                                     <Smile className="w-5 h-5" />
                                 </button>
                                 <button
                                     onClick={handleSendMessage}
                                     disabled={!newMessage.trim()}
                                     className="bg-primary disabled:opacity-50 disabled:cursor-not-allowed text-black p-2 ml-1"
                                 >
                                     <Send className="w-4 h-4" />
                                 </button>
                             </div>
                         </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CommunityDiscussion;
