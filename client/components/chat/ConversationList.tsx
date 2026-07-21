"use client";

import React, { useState } from "react";
import { Search, Plus, MessageSquare, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Conversation } from "@/types/conversation";
import { useAuth } from "@/context/AuthContext";

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  loading?: boolean;
  onSelect: (id: string) => void;
  onOpenNewChat: () => void;
}

export function ConversationList({
  conversations,
  activeId,
  loading = false,
  onSelect,
  onOpenNewChat,
}: ConversationListProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter((chat) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    
    // Check group name if available
    if (chat.name && chat.name.toLowerCase().includes(q)) return true;

    // Check member usernames or emails
    return chat.members.some(
      (m) =>
        m.user.username.toLowerCase().includes(q) ||
        m.user.email?.toLowerCase().includes(q)
    );
  });

  const formatTimestamp = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div className="w-full h-full flex flex-col bg-white/60 dark:bg-black/40 backdrop-blur-2xl border-r border-black/5 dark:border-white/5 z-10 relative overflow-hidden">
      {/* Header */}
      <div className="p-4 lg:p-6 pb-3 shrink-0 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
              Messages
            </h2>
            {conversations.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                {conversations.length}
              </span>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenNewChat}
            className="p-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 transition-all flex items-center space-x-1.5 px-3.5 text-xs font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Chat</span>
          </motion.button>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-indigo-500/30 focus:bg-white/80 dark:focus:bg-black/60 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-hide">
        {loading ? (
          /* Skeleton Loaders */
          <div className="space-y-2 p-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-full flex items-center p-3 rounded-2xl animate-pulse bg-black/5 dark:bg-white/5 space-x-4"
              >
                <div className="w-12 h-12 rounded-full bg-zinc-300 dark:bg-zinc-700/60 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-zinc-300 dark:bg-zinc-700/60 rounded w-1/3" />
                  <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-500 flex items-center justify-center mb-3">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h4 className="text-base font-semibold text-zinc-900 dark:text-white">
              {searchQuery ? "No matching conversations" : "No conversations yet"}
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-[200px] mt-1">
              {searchQuery
                ? "Try searching with a different term or start a new chat"
                : "Click 'New Chat' above to start a conversation with a teammate"}
            </p>

            {!searchQuery && (
              <button
                onClick={onOpenNewChat}
                className="mt-4 px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-semibold transition-colors"
              >
                Start your first chat
              </button>
            )}
          </div>
        ) : (
          <AnimatePresence>
            {filteredConversations.map((chat) => {
              const otherUser =
                chat.members.find((m) => m.user?.id !== user?.id)?.user ??
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
                  whileHover={{ scale: 0.99 }}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full flex items-center p-3 rounded-2xl transition-all text-left relative overflow-hidden group ${
                    isActive
                      ? "bg-white/90 dark:bg-white/10 shadow-md border border-black/5 dark:border-white/10 backdrop-blur-md"
                      : "hover:bg-black/5 dark:hover:bg-white/5 border border-transparent"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeChatIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-9 bg-indigo-500 rounded-r-full shadow-[0_0_12px_rgba(99,102,241,0.6)]"
                    />
                  )}

                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        chat.name || otherUser.username
                      )}`}
                      alt={otherUser.username}
                      className="w-12 h-12 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-[#1a1423] rounded-full" />
                  </div>

                  {/* Chat Info */}
                  <div className="ml-4 flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3
                        className={`font-semibold truncate pr-2 text-[15px] ${
                          isActive
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-zinc-900 dark:text-white"
                        }`}
                      >
                        {chat.name || otherUser.username}
                      </h3>

                      <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 shrink-0">
                        {formatTimestamp(lastMsg?.createdAt || chat.updatedAt)}
                      </span>
                    </div>

                    <p className="text-sm truncate text-zinc-500 dark:text-zinc-400">
                      {lastMsg?.content ? (
                        <span>{lastMsg.content}</span>
                      ) : (
                        <span className="italic text-xs text-indigo-500/70">
                          Start a conversation...
                        </span>
                      )}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Floating Action Button for Mobile / Quick Action */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onOpenNewChat}
        className="absolute bottom-5 right-5 w-12 h-12 rounded-full bg-indigo-600 text-white shadow-xl shadow-indigo-500/40 flex items-center justify-center sm:hidden z-20"
      >
        <Sparkles className="w-5 h-5" />
      </motion.button>
    </div>
  );
}