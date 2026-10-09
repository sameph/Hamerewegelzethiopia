"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Send, 
  Paperclip, 
  MoreVertical, 
  CheckCheck, 
  MessageSquare,
  ArrowLeft,
  Loader2,
  User as UserIcon
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

export default function TeacherMessagesModule() {
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
        fetchConversations();
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 10000);
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
     <div className="flex h-[600px] flex-col items-center justify-center gap-4 bg-[#0d1610] rounded-[3rem] border border-white/10">
        <Loader2 className="h-8 w-8 animate-spin text-mint" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Establishing Uplink...</p>
     </div>
  );

  return (
    <div className="flex h-[750px] gap-6 animate-in fade-in duration-700 bg-black/20 p-6 rounded-[3.5rem]">
      {/* Conversations Sidebar */}
      <div className={`${isMobileListVisible ? 'flex' : 'hidden'} lg:flex w-full lg:w-80 flex-col rounded-[2.5rem] border border-white/10 bg-[#0d1610] overflow-hidden shadow-2xl`}>
        <div className="p-6 border-b border-white/5">
           <h2 className="text-xl font-black text-white tracking-tight uppercase">Instructor Inbox</h2>
           <div className="relative mt-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                placeholder="Search students..."
                className="w-full rounded-xl bg-white/5 border border-white/5 py-3 pl-11 pr-4 text-xs text-white placeholder-slate-600 outline-none focus:border-mint/30 transition-all"
              />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          {conversations.map((conv) => (
            <button 
              key={conv.user._id}
              onClick={() => setSelectedConversation(conv)}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 group ${selectedConversation?.user._id === conv.user._id ? 'bg-mint/10 border border-mint/20' : 'hover:bg-white/5 border border-transparent'}`}
            >
              <div className="relative shrink-0">
                 <div className="h-11 w-11 rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                    <img src={conv.user.profileImage || "/placeholder-user.png"} alt="" className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                 </div>
              </div>
              <div className="flex-1 text-left min-w-0">
                 <div className="flex justify-between items-center mb-0.5">
                    <span className="font-bold text-white truncate text-xs">{conv.user.username}</span>
                    <span className="text-[8px] font-black text-slate-500 uppercase">{new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                 </div>
                 <p className="text-[10px] text-slate-500 truncate font-medium">{conv.lastMessage}</p>
              </div>
            </button>
          ))}
          {conversations.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
               <MessageSquare size={32} className="mb-3" />
               <p className="text-[9px] font-black uppercase tracking-widest">No student inquiries</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`${!isMobileListVisible ? 'flex' : 'hidden'} lg:flex flex-1 flex-col rounded-[2.5rem] border border-white/10 bg-[#0d1610] overflow-hidden shadow-2xl`}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-5 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <button onClick={() => setIsMobileListVisible(true)} className="lg:hidden p-2 text-slate-500 hover:text-white">
                     <ArrowLeft size={18} />
                  </button>
                  <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 overflow-hidden">
                     <img src={selectedConversation.user.profileImage || "/placeholder-user.png"} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div>
                     <h3 className="font-black text-white text-sm">{selectedConversation.user.username}</h3>
                     <span className="text-[9px] font-black uppercase text-mint tracking-[0.2em]">Student in Session</span>
                  </div>
               </div>
               <div className="flex items-center gap-1">
                  <button className="p-2 text-slate-500 hover:text-white transition-colors"><Search size={18} /></button>
                  <button className="p-2 text-slate-500 hover:text-white transition-colors"><MoreVertical size={18} /></button>
               </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gradient-to-b from-transparent to-mint/[0.01]">
               {msgLoading ? (
                  <div className="flex h-full items-center justify-center">
                     <Loader2 className="animate-spin text-mint" size={24} />
                  </div>
               ) : (
                 messages.map((msg, idx) => {
                   const isMe = msg.sender._id === (user?._id || (user as any)?.id);
                   return (
                     <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in duration-500`}>
                        <div className={`max-w-[85%] space-y-1.5 ${isMe ? 'items-end' : 'items-start'}`}>
                           <div className={`p-4 rounded-3xl text-xs font-bold leading-relaxed ${isMe ? 'bg-mint text-[#08120f] rounded-tr-none' : 'bg-white/5 text-white border border-white/10 rounded-tl-none'}`}>
                              {msg.content}
                           </div>
                           <div className={`flex items-center gap-2 px-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                              <span className="text-[8px] font-black text-slate-500 uppercase">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              {isMe && <CheckCheck size={10} className="text-mint" />}
                           </div>
                        </div>
                     </div>
                   );
                 })
               )}
            </div>

            {/* Input */}
            <div className="p-6 bg-white/[0.02] border-t border-white/5">
               <form onSubmit={handleSendMessage} className="relative flex items-center gap-3">
                  <button type="button" className="p-3 rounded-xl bg-white/5 text-slate-500 hover:text-white transition-all">
                     <Paperclip size={18} />
                  </button>
                  <div className="relative flex-1">
                     <input 
                       value={newMessage}
                       onChange={(e) => setNewMessage(e.target.value)}
                       placeholder="Draft operational response..."
                       className="w-full rounded-2xl bg-white/5 border border-white/5 py-4 px-6 text-xs text-white placeholder-slate-700 outline-none focus:border-mint/20 transition-all pr-14"
                     />
                     <button 
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl bg-mint text-[#08120f] flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-20 shadow-lg shadow-mint/10"
                     >
                        <Send size={16} />
                     </button>
                  </div>
               </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-6">
             <div className="h-24 w-24 rounded-[2rem] bg-mint/5 border border-mint/20 flex items-center justify-center text-mint animate-pulse">
                <MessageSquare size={40} strokeWidth={1} />
             </div>
             <div>
                <h4 className="text-2xl font-black text-white tracking-tighter uppercase mb-2">Awaiting Transmissions</h4>
                <p className="text-[10px] text-slate-500 max-w-[200px] mx-auto font-black uppercase tracking-widest leading-loose">Select a student from the register for real-time pedagogical synchronization.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
