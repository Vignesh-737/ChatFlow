// components/chat/ChatWindow.tsx
"use client";

import React from "react";
import { Phone, Video, Search, MoreVertical, Paperclip, Send, Smile, ChevronLeft, MessageCircle } from "lucide-react";
import { Conversation } from "@/types/conversation";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

interface ChatWindowProps {
  chat: Conversation | null;
  onBack: () => void;
  onToggleProfile: () => void;
}

export function ChatWindow({ chat, onBack, onToggleProfile }: ChatWindowProps) {
  const { user } = useAuth();
  const messages = chat.messages ?? [];
  if (!chat) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50/50 dark:bg-transparent">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-[32px] bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center mb-6 shadow-xl backdrop-blur-xl">
            <MessageCircle className="w-10 h-10 text-zinc-300 dark:text-zinc-600" />
          </div>
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-white tracking-tight">Your Messages</h3>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">Select a conversation to start chatting</p>
        </motion.div>
      </div>
    );
  }
  
    const otherUser =
      chat.members.find((m) => m.user.id !== user?.id)?.user ??
      chat.members[0]?.user;

    if (!otherUser) {
      return null;
    }

  return (
    <div className="w-full h-full flex flex-col bg-zinc-50 dark:bg-transparent relative z-0">
      {/* Header */}
      <div className="h-[88px] px-4 lg:px-6 flex items-center justify-between border-b border-black/5 dark:border-white/5 bg-white/70 dark:bg-black/20 backdrop-blur-2xl shrink-0 z-10">
        <div className="flex items-center">
          <button onClick={onBack} className="md:hidden mr-3 p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
          </button>
          
          <button onClick={onToggleProfile} className="flex items-center text-left hover:bg-black/5 dark:hover:bg-white/5 p-2 -ml-2 rounded-2xl transition-colors">
            <div className="relative shrink-0">
              <img src={"https://ui-avatars.com/api/?name=" + otherUser.username} alt={otherUser.username} className="w-12 h-12 rounded-full object-cover shadow-sm" />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-[#1a1423] rounded-full" />
            </div>
            <div className="ml-4 hidden sm:block">
              <h3 className="font-semibold text-zinc-900 dark:text-white text-[15px]">{otherUser.username}</h3>
              <p className="text-[13px] text-zinc-500 dark:text-zinc-400 font-medium">
                Online
              </p>            
            </div>
          </button>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2">
          <button className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-zinc-600 dark:text-zinc-300">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-zinc-600 dark:text-zinc-300 hidden sm:block">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-zinc-600 dark:text-zinc-300 hidden md:block">
            <Search className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-black/10 dark:bg-white/10 mx-2 hidden sm:block" />
          <button className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-zinc-600 dark:text-zinc-300">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 scrollbar-hide">
        <div className="flex justify-center my-4">
          <span className="px-4 py-1.5 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-full text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider backdrop-blur-md shadow-sm">
            Today
          </span>
        </div>

        {messages.map((msg, idx) => {
          const isMe = msg.senderId === user?.id;
          return (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {!isMe && (
                <img src={"https://ui-avatars.com/api/?name=" + otherUser.username} alt="Avatar" className="w-8 h-8 rounded-full object-cover mr-3 self-end mb-5 hidden sm:block shadow-sm" />
              )}
              <div className={`max-w-[85%] lg:max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div 
                  className={`px-5 py-3.5 rounded-[24px] ${
                    isMe 
                      ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-br-[8px] shadow-[0_4px_20px_rgba(99,102,241,0.3)] border border-indigo-400/20' 
                      : 'bg-white dark:bg-white/10 text-zinc-900 dark:text-white rounded-bl-[8px] border border-black/5 dark:border-white/10 shadow-md backdrop-blur-xl'
                  }`}
                >
                  <p className="text-[15px] leading-relaxed">{msg.content}</p>
                </div>
                <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 mt-1.5 px-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="p-4 lg:p-6 bg-white/70 dark:bg-black/20 backdrop-blur-2xl border-t border-black/5 dark:border-white/5 z-10 shrink-0">
        <div className="flex items-end space-x-2 bg-white/90 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-[28px] p-2 pr-2 shadow-sm focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:border-indigo-500/30 transition-all">
          <button className="p-3.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-zinc-500 dark:text-zinc-400 shrink-0">
            <Paperclip className="w-5 h-5" />
          </button>
          
          <textarea 
            placeholder="Type a message..." 
            rows={1}
            className="flex-1 max-h-32 bg-transparent border-none focus:outline-none resize-none py-3.5 text-[15px] text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-500 scrollbar-hide"
          />
          
          <button className="p-3.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-zinc-500 dark:text-zinc-400 shrink-0 hidden sm:block">
            <Smile className="w-5 h-5" />
          </button>
          
          <button className="p-3.5 rounded-full bg-indigo-600 hover:bg-indigo-500 transition-colors text-white shadow-lg shadow-indigo-500/30 shrink-0">
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}