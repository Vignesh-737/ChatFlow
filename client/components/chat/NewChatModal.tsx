"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, UserPlus, MessageSquare, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { UserItem, Conversation } from "@/types/conversation";
import { toast } from "sonner";

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectConversation: (conversationId: string, newConversation?: Conversation) => void;
}

export function NewChatModal({
  isOpen,
  onClose,
  onSelectConversation,
}: NewChatModalProps) {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [creatingUserId, setCreatingUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await api.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
        toast.error("Failed to load users list");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isOpen]);

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartChat = async (targetUser: UserItem) => {
    setCreatingUserId(targetUser.id);
    try {
      const res = await api.post("/conversations", { userId: targetUser.id });
      const convData = res.data.conversation || res.data;
      
      toast.success(`Chat started with ${targetUser.username}`);
      onSelectConversation(convData.id, convData);
      onClose();
    } catch (err: any) {
      console.error("Failed to start chat", err);
      toast.error(err?.response?.data?.message || "Failed to start conversation");
    } finally {
      setCreatingUserId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        {/* Backdrop click */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md bg-white/90 dark:bg-[#120b22]/90 border border-black/10 dark:border-white/10 rounded-3xl shadow-2xl backdrop-blur-2xl overflow-hidden z-10 flex flex-col max-h-[85vh]"
        >
          {/* Top Glow Highlights */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

          {/* Header */}
          <div className="p-5 border-b border-black/5 dark:border-white/5 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                  New Conversation
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Select a user to start messaging
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors text-zinc-500 dark:text-zinc-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Input */}
          <div className="p-4 shrink-0">
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-indigo-500/30 focus:bg-white/80 dark:focus:bg-black/60 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Users List */}
          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1.5 scrollbar-hide">
            {loading ? (
              <div className="p-8 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-3 p-3 rounded-2xl animate-pulse bg-black/5 dark:bg-white/5"
                  >
                    <div className="w-10 h-10 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3.5 bg-zinc-300 dark:bg-zinc-700 rounded w-1/3" />
                      <div className="h-2.5 bg-zinc-300 dark:bg-zinc-700 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 dark:text-zinc-400">
                <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-40 text-indigo-500" />
                <p className="text-sm font-medium">No users found</p>
                <p className="text-xs text-zinc-400 mt-1">
                  Try searching with a different keyword
                </p>
              </div>
            ) : (
              filteredUsers.map((user) => {
                const isCreating = creatingUserId === user.id;

                return (
                  <motion.button
                    key={user.id}
                    whileHover={{ scale: 0.99 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleStartChat(user)}
                    disabled={creatingUserId !== null}
                    className="w-full flex items-center justify-between p-3 rounded-2xl transition-all text-left bg-white/40 dark:bg-white/5 hover:bg-indigo-500/10 dark:hover:bg-indigo-500/20 border border-black/5 dark:border-white/5 hover:border-indigo-500/30 group"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.username
                        )}`}
                        alt={user.username}
                        className="w-10 h-10 rounded-full object-cover shadow-sm shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-sm text-zinc-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {user.username}
                        </h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 ml-2">
                      {isCreating ? (
                        <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 group-hover:bg-indigo-500 text-indigo-600 group-hover:text-white flex items-center justify-center transition-all">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
