"use client";

import { useState, useEffect, useRef } from "react";
import { Send, User, Users, Search, Paperclip, Smile, MoreVertical } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Message {
  _id: string;
  sender: {
    _id: string;
    username: string;
    profileImage?: string;
  };
  content: string;
  createdAt: string;
  group?: string;
}

interface ChatModuleProps {
  initialRecipientId?: string;
  initialGroupId?: string;
}

export default function ChatModule({ initialRecipientId, initialGroupId }: ChatModuleProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    if (!user) return;
    try {
      const query = initialGroupId ? `group=${initialGroupId}` : `recipient=${initialRecipientId}`;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/messages?${query}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('lms_token')}` }
      });
      const data = await res.json();
      if (data.success) setMessages(data.data);
    } catch (err) {
      console.error("Fetch messages err:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, [initialRecipientId, initialGroupId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      const payload = initialGroupId 
        ? { group: initialGroupId, content: newMessage }
        : { recipient: initialRecipientId, content: newMessage };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/messages`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('lms_token')}` 
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setNewMessage("");
        fetchMessages();
      }
    } catch (err) {
      console.error("Send message err:", err);
    }
  };

  return (
    <div className="flex flex-col h-[600px] rounded-[2.5rem] border border-white/10 bg-[#111f16]/95 shadow-2xl backdrop-blur-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-mint/10 border border-mint/20 flex items-center justify-center text-mint">
            {initialGroupId ? <Users size={24} /> : <User size={24} />}
          </div>
          <div>
            <h3 className="font-black text-white tracking-tight">
              {initialGroupId ? "Course Group Discussion" : "Private Session"}
            </h3>
            <p className="text-[10px] text-mint font-black uppercase tracking-widest flex items-center gap-2">
               <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse" />
               Live Connection
            </p>
          </div>
        </div>
        <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg._id} className={`flex ${msg.sender._id === user?._id ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] group`}>
              {msg.sender._id !== user?._id && (
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                  {msg.sender.username}
                </p>
              )}
              <div className={`p-4 rounded-3xl ${
                msg.sender._id === user?._id 
                ? "bg-mint text-[#08120f] rounded-tr-none shadow-[0_10px_30px_rgba(214,255,0,0.15)]" 
                : "bg-white/5 border border-white/10 text-slate-100 rounded-tl-none"
              }`}>
                <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                <p className={`text-[9px] mt-2 font-black uppercase tracking-tighter ${
                  msg.sender._id === user?._id ? "text-[#08120f]/50" : "text-slate-500"
                }`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-6 border-t border-white/10 bg-white/[0.02]">
        <div className="relative flex items-center gap-4">
          <button type="button" className="p-3 rounded-2xl bg-white/5 text-slate-400 hover:text-white transition-all border border-white/5">
            <Paperclip size={20} />
          </button>
          <input 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Compose a masterwork..."
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white placeholder-slate-500 outline-none focus:border-mint/50 focus:bg-white/[0.08] transition-all"
          />
          <button type="submit" className="p-4 rounded-2xl bg-mint text-[#08120f] shadow-xl shadow-mint/10 hover:scale-110 active:scale-95 transition-all">
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
