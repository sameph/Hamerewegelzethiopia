"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Send, 
  Paperclip, 
  MoreVertical, 
  CheckCheck, 
  User,
  MessageSquare,
  Clock,
  Filter,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface Message {
  _id: string;
  sender: {
    _id: string;
    username: string;
    profileImage?: string;
  };
  recipient?: string;
  content: string;
  createdAt: string;
}

interface Conversation {
  user: {
    _id: string;
    username: string;
    profileImage?: string;
  };
  lastMessage: string;
  lastMessageAt: string;
}

export default function MessagesClient() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [isMobileListVisible, setIsMobileListVisible] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchConversations = async () => {
    try {
      const res = await fetch(`${API_URL}/messages/conversations`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('lms_token')}` }
      });
      const data = await res.json();
      if (data.success) {
        setConversations(data.data);
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const fetchMessages = async (recipientId: string) => {
    setMsgLoading(true);
    try {
      const res = await fetch(`${API_URL}/messages?recipient=${recipientId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('lms_token')}` }
      });
      const data = await res.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (err) { console.error(err); }
    setMsgLoading(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const res = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('lms_token')}` 
        },
        body: JSON.stringify({
          recipient: selectedConversation.user._id,
          content: newMessage
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessages([...messages, {
          ...data.data,
          sender: { _id: user?._id || (user as any)?.id, username: user?.username || "Me" }
        }]);
        setNewMessage("");
        fetchConversations(); // Update last message in list
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 10000); // Polling every 10s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.user._id);
      setIsMobileListVisible(false);
    }
  }, [selectedConversation]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (loading) return (
     <div className="flex h-full flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-mint" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Initializing Comms...</p>
     </div>
  );

  return (
    <div className="flex h-[calc(100vh-160px)] gap-6 animate-in fade-in duration-700">
      {/* Conversations Sidebar */}
      <div className={`${isMobileListVisible ? 'flex' : 'hidden'} lg:flex w-full lg:w-96 flex-col rounded-[2.5rem] border border-white/10 bg-[#0d1610] overflow-hidden`}>
        <div className="p-8 border-b border-white/5">
           <h2 className="text-2xl font-black text-white tracking-tight uppercase">Transmissions</h2>
           <div className="relative mt-6">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                placeholder="Search frequencies..."
                className="w-full rounded-2xl bg-white/5 border border-white/5 py-4 pl-14 pr-6 text-sm text-white placeholder-slate-600 outline-none focus:border-mint/30 transition-all"
              />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {conversations.map((conv) => (
            <button 
              key={conv.user._id}
              onClick={() => setSelectedConversation(conv)}
              className={`w-full flex items-center gap-4 p-5 rounded-3xl transition-all duration-300 group ${selectedConversation?.user._id === conv.user._id ? 'bg-mint/10 border border-mint/20' : 'hover:bg-white/5 border border-transparent'}`}
            >
              <div className="relative">
                 <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                    <img src={conv.user.profileImage || "/placeholder-user.png"} alt="" className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                 </div>
                 <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-mint border-4 border-[#0d1610]" />
              </div>
              <div className="flex-1 text-left min-w-0">
                 <div className="flex justify-between items-center mb-1">
                    <span className="font-black text-white truncate text-sm">{conv.user.username}</span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase">{new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                 </div>
                 <p className="text-xs text-slate-500 truncate font-medium">{conv.lastMessage}</p>
              </div>
            </button>
          ))}
          {conversations.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
               <MessageSquare size={40} className="mb-4" />
               <p className="text-[10px] font-black uppercase tracking-widest">No active channels</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`${!isMobileListVisible ? 'flex' : 'hidden'} lg:flex flex-1 flex-col rounded-[2.5rem] border border-white/10 bg-[#0d1610] overflow-hidden`}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <button onClick={() => setIsMobileListVisible(true)} className="lg:hidden p-2 text-slate-500 hover:text-white">
                     <ArrowLeft size={20} />
                  </button>
                  <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                     <img src={selectedConversation.user.profileImage || "/placeholder-user.png"} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div>
                     <h3 className="font-black text-white text-base">{selectedConversation.user.username}</h3>
                     <span className="text-[10px] font-black uppercase text-mint tracking-widest">Target Active</span>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <button className="p-3 text-slate-500 hover:text-white transition-colors"><Search size={20} /></button>
                  <button className="p-3 text-red-500/50 hover:text-red-500 transition-colors"><MoreVertical size={20} /></button>
               </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-gradient-to-b from-transparent to-mint/[0.02]">
               {msgLoading ? (
                  <div className="flex h-full items-center justify-center">
                     <Loader2 className="animate-spin text-mint" />
                  </div>
               ) : (
                 messages.map((msg, idx) => {
                   const isMe = msg.sender._id === (user?._id || (user as any)?.id);
                   return (
                     <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-${isMe ? 'right' : 'left'}-4 duration-500`}>
                        <div className={`max-w-[80%] space-y-2 ${isMe ? 'items-end' : 'items-start'}`}>
                           <div className={`p-5 rounded-[2rem] text-sm font-medium leading-relaxed shadow-xl ${isMe ? 'bg-mint text-[#08120f] rounded-tr-none' : 'bg-white/5 text-white border border-white/10 rounded-tl-none'}`}>
                              {msg.content}
                           </div>
                           <div className={`flex items-center gap-2 px-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                              <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              {isMe && <CheckCheck size={12} className="text-mint" />}
                           </div>
                        </div>
                     </div>
                   );
                 })
               )}
            </div>

            {/* Input */}
            <div className="p-8 bg-white/[0.02] border-t border-white/5">
               <form onSubmit={handleSendMessage} className="relative flex items-center gap-4">
                  <button type="button" className="p-4 rounded-2xl bg-white/5 text-slate-500 hover:text-white transition-all">
                     <Paperclip size={20} />
                  </button>
                  <div className="relative flex-1">
                     <input 
                       value={newMessage}
                       onChange={(e) => setNewMessage(e.target.value)}
                       placeholder="Type your transmission..."
                       className="w-full rounded-[2rem] bg-white/5 border border-white/5 py-5 px-8 text-sm text-white placeholder-slate-600 outline-none focus:border-mint/30 transition-all pr-20"
                     />
                     <button 
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-12 w-12 rounded-2xl bg-mint text-[#08120f] flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-20 shadow-lg shadow-mint/20"
                     >
                        <Send size={18} />
                     </button>
                  </div>
               </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-8 bg-gradient-to-br from-mint/[0.02] to-transparent">
             <div className="h-32 w-32 rounded-[3rem] bg-mint/5 border border-mint/20 flex items-center justify-center text-mint animate-pulse">
                <MessageSquare size={60} strokeWidth={1} />
             </div>
             <div>
                <h4 className="text-3xl font-black text-white tracking-tighter uppercase mb-3">Communication Secure</h4>
                <p className="text-slate-500 max-w-sm mx-auto font-medium">Select a designated channel to initiate a secure end-to-end encrypted transmission.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
