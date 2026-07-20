"use client";

import React from "react";
import { Search, Edit } from "lucide-react";
import { motion } from "framer-motion";
import { Conversation } from "@/types/conversation";
import { useAuth } from "@/context/AuthContext";

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export function ConversationList({
  conversations,
  activeId,
  onSelect,
}: ConversationListProps) {
  const { user } = useAuth();

  return (
    <div className="w-full h-full flex flex-col bg-white/60 dark:bg-black/40 backdrop-blur-2xl border-r border-black/5 dark:border-white/5 z-10">
      {/* Header */}
      <div className="p-4 lg:p-6 pb-2 shrink-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Messages
          </h2>

          <button className="p-2.5 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors text-zinc-700 dark:text-zinc-300 shadow-sm">
            <Edit className="w-4 h-4" />
          </button>
        </div>

        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500 group-focus-within:text-indigo-500 transition-colors" />

          <input
            type="text"
            placeholder="Search messages..."
            className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-indigo-500/30 focus:bg-white/80 dark:focus:bg-black/60 rounded-2xl py-3 pl-10 pr-4 text-sm text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-hide">
        {conversations.length === 0 && (
          <div className="text-center text-zinc-500 py-10">
            No conversations yet
          </div>
        )}

        {conversations.map((chat) => {
          const otherUser =
            chat.members.find((m) => m.user.id !== user?.id)?.user ??
            chat.members[0]?.user;

          if (!otherUser) return null;

          const lastMsg =
            chat.messages && chat.messages.length > 0
              ? chat.messages[chat.messages.length - 1]
              : null;
              
          const isActive = activeId === chat.id;

          return (
            <motion.button
              key={chat.id}
              onClick={() => onSelect(chat.id)}
              whileHover={{ scale: 0.98 }}
              whileTap={{ scale: 0.96 }}
              className={`w-full flex items-center p-3 rounded-2xl transition-all text-left relative overflow-hidden ${
                isActive
                  ? "bg-white/80 dark:bg-white/10 shadow-sm border border-black/5 dark:border-white/10 backdrop-blur-md"
                  : "hover:bg-black/5 dark:hover:bg-white/5 border border-transparent"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full" />
              )}

              {/* Avatar */}
              <div className="relative shrink-0">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    otherUser.username
                  )}`}
                  alt={otherUser.username}
                  className="w-12 h-12 rounded-full object-cover shadow-sm"
                />

                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-[#1a1423] rounded-full" />
              </div>

              {/* Chat Info */}
              <div className="ml-4 flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-zinc-900 dark:text-white truncate pr-2 text-[15px]">
                    {otherUser.username}
                  </h3>

                  <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 flex-shrink-0">
                    {lastMsg
                      ? new Date(lastMsg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </span>
                </div>

                <p className="text-sm truncate text-zinc-500 dark:text-zinc-400">
                  {lastMsg?.content ?? "No messages yet"}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}