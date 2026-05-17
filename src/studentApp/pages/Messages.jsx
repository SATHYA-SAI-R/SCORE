import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Paperclip, Smile, MoreVertical, Phone, Video, Search, Shield, Zap } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuthStore } from "../store/authStore";
import { subscribeToConversations, subscribeToMessages, sendMessage, editMessage } from "../../lib/messageService";
import { getUserProfile } from "../../lib/userService";

const nameCache = {};

const Messages = () => {
   const { user } = useAuthStore();
   const [contacts, setContacts] = useState([]);
   const [activeChat, setActiveChat] = useState(null);
   const [messages, setMessages] = useState([]);
   const [newMessage, setNewMessage] = useState("");
   const [editingMsgId, setEditingMsgId] = useState(null);
   const [editText, setEditText] = useState("");

   useEffect(() => {
     if (user?.uid) {
       const unsub = subscribeToConversations(user.uid, async (data) => {
          const mappedContacts = await Promise.all(data.map(async conv => {
            const otherId = conv.participants?.find(id => id !== user.uid) || "Unknown User";
            let otherNameStr = conv.names ? conv.names[otherId] || otherId : otherId;
            
            if (otherNameStr === otherId && otherId !== "Unknown User") {
               if (nameCache[otherId]) {
                   otherNameStr = nameCache[otherId];
               } else {
                   try {
                       const profile = await getUserProfile(otherId);
                       if (profile && profile.name) {
                          otherNameStr = profile.name;
                          nameCache[otherId] = profile.name;
                       }
                   } catch(e) {
                      console.error("Failed to fetch profile for message contact", e);
                   }
               }
            }

            return {
               id: conv.id,
               name: otherNameStr,
               lastMessage: conv.lastMessage,
               status: 'online', 
               unread: 0,
               avatar: otherNameStr.charAt(0).toUpperCase()
            }
          }));
          setContacts(mappedContacts);
          // Auto select first chat if none selected
          setActiveChat(prev => {
             if (!prev && mappedContacts.length > 0) {
                 return mappedContacts[0].id;
             }
             return prev;
          });
       });
       return () => unsub();
     }
   }, [user]);

   useEffect(() => {
      if (activeChat && user?.uid) {
         const unsub = subscribeToMessages(activeChat, (data) => {
            const mappedMessages = data.map(m => ({
               id: m.id,
               sender: m.senderId === user.uid ? 'me' : m.senderId,
               text: m.text,
               time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
               isOwn: m.senderId === user.uid,
               isEdited: m.isEdited || false
            }));
            setMessages(mappedMessages);
         });
         return () => unsub();
      } else {
         setMessages([]);
      }
   }, [activeChat, user]);

   const activeContact = contacts.find((c) => c.id === activeChat);

   const handleSendMessage = async () => {
      if (!newMessage.trim() || !activeChat || !user) return;
      
      const text = newMessage;
      setNewMessage(""); 
      try {
         await sendMessage(activeChat, user.uid, text);
      } catch (err) {
         console.error("Failed to send message", err);
      }
   };

   const handleEditMessage = async (msgId) => {
      if (!editText.trim() || !activeChat) {
         setEditingMsgId(null);
         return;
      }
      try {
         await editMessage(activeChat, msgId, editText);
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

               {/* Contact List / Frequency Band */}
               <div className="w-80 bg-surface border border-white/10 flex flex-col relative z-10 hidden md:flex">
                  <div className="p-4 border-b border-white/10 bg-black/50">
                     <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                        <input
                           type="text"
                           placeholder="SCAN_FREQUENCIES..."
                           className="w-full bg-background border border-white/10 py-2 pl-9 pr-4 text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors font-mono uppercase"
                        />
                     </div>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                     <div className="px-4 py-2 text-[10px] text-text-muted uppercase tracking-widest border-b border-white/5">
                        Active_<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-cyan-400 animate-gradient-x">Nodes</span> ({contacts.length})
                     </div>
                     {contacts.map(contact => (
                        <button
                           key={contact.id}
                           onClick={() => setActiveChat(contact.id)}
                           className={`w-full p-4 flex items-center space-x-3 hover:bg-white/5 transition-all text-left border-b border-white/5 relative group ${activeChat === contact.id ? 'bg-white/5' : ''
                              }`}
                        >
                           {activeChat === contact.id && (
                              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary shadow-[0_0_10px_rgba(204,255,0,0.5)]"></div>
                           )}

                           <div className="relative">
                              <div className={`w-10 h-10 flex items-center justify-center font-bold border border-white/20 text-white ${activeChat === contact.id ? 'bg-primary text-black border-primary' : 'bg-surface'
                                 }`}>
                                 {contact.avatar}
                              </div>
                              {contact.status === 'online' && (
                                 <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-black border border-primary rounded-none">
                                    <div className="w-full h-full bg-primary animate-pulse"></div>
                                 </div>
                              )}
                           </div>

                           <div className="flex-1 overflow-hidden">
                              <div className="flex justify-between items-center mb-1">
                                 <span className={`text-xs font-bold truncate ${activeChat === contact.id ? 'text-primary' : 'text-white'
                                    }`}>
                                    {contact.name}
                                 </span>
                                 {contact.unread > 0 && (
                                    <span className="text-[10px] bg-accent text-black px-1 font-bold">
                                       {contact.unread}
                                    </span>
                                 )}
                              </div>
                              <p className="text-[10px] text-text-muted truncate font-mono">
                                 {contact.lastMessage}
                              </p>
                           </div>
                        </button>
                     ))}
                  </div>
               </div>

               {/* Chat Interface / Comms Link */}
               <div className="flex-1 bg-black/80 border border-white/10 flex flex-col relative z-10 backdrop-blur-sm">
                  {/* Header */}
                  <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-surface/50">
                     <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(204,255,0,1)]"></div>
                        <div>
                           <h2 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-cyan-400 animate-gradient-x">
                              {activeContact?.name}
                              <Shield className="w-3 h-3 text-primary" />
                           </h2>
                           <p className="text-[10px] text-text-muted uppercase tracking-widest flex items-center gap-2">
                              <Zap className="w-3 h-3 text-accent" />
                              Encrypted_Channel_v4
                           </p>
                        </div>
                     </div>

                     <div className="flex items-center space-x-4 text-text-muted">
                        <button className="hover:text-primary transition-colors border border-transparent hover:border-primary/50 p-1">
                           <Phone className="w-4 h-4" />
                        </button>
                        <button className="hover:text-primary transition-colors border border-transparent hover:border-primary/50 p-1">
                           <Video className="w-4 h-4" />
                        </button>
                        <button className="hover:text-primary transition-colors border border-transparent hover:border-primary/50 p-1">
                           <MoreVertical className="w-4 h-4" />
                        </button>
                     </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 relative">
                     <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] pointer-events-none" />

                     {messages.map((msg) => (
                        <motion.div
                           key={msg.id}
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                           <div className={`max-w-[70%] relative group`}>
                              {editingMsgId === msg.id ? (
                                 <div className={`
                                     px-4 py-3 text-sm font-mono border
                                     ${msg.isOwn
                                             ? 'bg-primary/10 border-primary text-white clip-diagonal-reverse'
                                             : 'bg-surface border-white/20 text-text-muted clip-diagonal'
                                          }
                                  `}>
                                     <input 
                                        type="text"
                                        autoFocus
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        onKeyDown={(e) => {
                                           if (e.key === 'Enter') handleEditMessage(msg.id);
                                           if (e.key === 'Escape') setEditingMsgId(null);
                                        }}
                                        className="w-full bg-transparent border-none focus:outline-none text-white font-mono tracking-wide"
                                     />
                                     <div className="text-[10px] uppercase tracking-widest mt-2 text-right opacity-70">
                                        esc to cancel • enter to save
                                     </div>
                                 </div>
                              ) : (
                                  <div className={`
                                px-4 py-3 text-sm font-mono border relative pr-8
                                ${msg.isOwn
                                        ? 'bg-primary/10 border-primary text-white clip-diagonal-reverse'
                                        : 'bg-surface border-white/20 text-text-muted clip-diagonal'
                                     }
                             `}>
                                     {msg.text}
                                     {msg.isEdited && (
                                        <span className="text-[10px] text-zinc-500 italic ml-2">(edited)</span>
                                     )}
                                     {msg.isOwn && (
                                        <button 
                                           onClick={() => {
                                              setEditingMsgId(msg.id);
                                              setEditText(msg.text);
                                           }}
                                           className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-white/50 hover:text-primary transition-colors text-[10px] uppercase font-bold"
                                        >
                                           edit
                                        </button>
                                     )}
                                  </div>
                              )}
                              <div className={`
                            text-[10px] mt-1 opacity-50 uppercase tracking-widest
                            ${msg.isOwn ? 'text-right text-primary' : 'text-left text-text-muted'}
                         `}>
                                 {msg.time}
                              </div>
                           </div>
                        </motion.div>
                     ))}
                  </div>

                  {/* Input Area */}
                  <div className="p-4 border-t border-white/10 bg-surface/30">
                     <div className="flex items-center gap-4 bg-background border border-white/10 p-2 pr-2">
                        <button className="p-2 text-text-muted hover:text-white transition-colors">
                           <Paperclip className="w-4 h-4" />
                        </button>
                        <input
                           type="text"
                           value={newMessage}
                           onChange={(e) => setNewMessage(e.target.value)}
                           onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                           placeholder="ENTER_MESSAGE_DATA..."
                           className="flex-1 bg-transparent border-none text-white placeholder:text-text-muted focus:outline-none text-sm font-mono"
                        />
                        <button className="p-2 text-text-muted hover:text-white transition-colors">
                           <Smile className="w-4 h-4" />
                        </button>
                        <button
                           onClick={handleSendMessage}
                           className="bg-primary hover:bg-white text-black p-2 transition-colors"
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

export default Messages;