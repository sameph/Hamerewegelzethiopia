"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ChatModule from "@/components/lms/shared/ChatModule";
import { User, Search, MessageSquare, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Conversation {
  user: {
    _id: string;
    username: string;
    profileImage?: string;
  };
  lastMessage: string;
  lastMessageAt: string;
}

export default function MessagesPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const initialRecipient = searchParams.get("recipient");
  const initialGroup = searchParams.get("group");
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedRecipientId, setSelectedRecipientId] = useState<string | null>(initialRecipient);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(initialGroup);
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/messages/conversations`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('lms_token')}` }
      });
      const data = await res.json();
      if (data.success) {
        setConversations(data.data);
        if (data.data.length > 0 && !selectedRecipientId) {
          // setSelectedRecipientId(data.data[0].user._id);
        }
      }
    } catch (err) {
      console.error("Fetch conversations err:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[700px] animate-in fade-in duration-700">
      {/* Sidebar: Conversations List */}
      <div className="lg:col-span-1 flex flex-col rounded-[2.5rem] border border-white/10 bg-[#111f16]/95 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-8 px-2">
          <h2 className="text-2xl font-black text-white tracking-tighter">Messages</h2>
          <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-mint text-[#08120f] shadow-lg shadow-mint/10 hover:scale-110 transition-all">
            <Plus size={20} />
          </button>
        </div>

        <div className="relative mb-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            placeholder="Search mentors or peers..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-xs text-white placeholder-slate-600 outline-none focus:border-mint/50 transition-all"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />
            ))
          ) : conversations.length === 0 ? (
            <div className="py-20 text-center">
              <MessageSquare className="mx-auto text-slate-700 mb-4" size={48} />
              <p className="text-slate-500 text-sm italic font-medium">No active connections found.</p>
            </div>
          ) : conversations.map((conv) => (
            <button 
              key={conv.user._id}
              onClick={() => { setSelectedRecipientId(conv.user._id); setSelectedGroupId(null); }}
              className={`w-full group flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 border ${
                selectedRecipientId === conv.user._id 
                ? "bg-mint border-mint/20 shadow-lg shadow-mint/5 scale-[1.02]" 
                : "bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10"
              }`}
            >
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br from-mint/20 to-blue-500/20 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform ${
                selectedRecipientId === conv.user._id ? "bg-white/20" : ""
              }`}>
                {conv.user.profileImage || <User size={20} className={selectedRecipientId === conv.user._id ? "text-[#08120f]" : "text-mint"} />}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`text-sm font-black truncate transition-colors ${
                    selectedRecipientId === conv.user._id ? "text-[#08120f]" : "text-white group-hover:text-mint"
                  }`}>
                    {conv.user.username}
                  </h4>
                  <span className={`text-[9px] font-black uppercase shrink-0 ${
                    selectedRecipientId === conv.user._id ? "text-[#08120f]/50" : "text-slate-500"
                  }`}>
                    {new Date(conv.lastMessageAt).toLocaleDateString()}
                  </span>
                </div>
                <p className={`text-xs mt-1 truncate ${
                  selectedRecipientId === conv.user._id ? "text-[#08120f]/70" : "text-slate-400"
                }`}>
                  {conv.lastMessage}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Chat Window */}
      <div className="lg:col-span-2">
        {selectedRecipientId ? (
          <ChatModule initialRecipientId={selectedRecipientId} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full rounded-[2.5rem] border border-white/10 bg-[#111f16]/95 shadow-2xl backdrop-blur-xl p-12 text-center">
            <div className="h-24 w-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-mint mb-6">
              <MessageSquare size={48} />
            </div>
            <h3 className="text-2xl font-black text-white tracking-widest uppercase">Secure Terminal</h3>
            <p className="text-slate-500 mt-2 max-w-sm font-medium">Select a recipient from the left to synchronize communications.</p>
          </div>
        )}
      </div>
    </div>
  );
}
