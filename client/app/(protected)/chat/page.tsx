// app/(protected)/chat/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Sidebar } from "@/components/chat/Sidebar";
import { ConversationList } from "@/components/chat/ConversationList";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { ProfilePanel } from "@/components/chat/ProfilePanel";
import { NewChatModal } from "@/components/chat/NewChatModal";
import { SettingsModal } from "@/components/chat/SettingsModal";
import { api } from "@/lib/api";
import { socket } from "@/lib/socket";
import { Conversation, MessageItem } from "@/types/conversation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function ChatPage() {
  const { user } = useAuth();

  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "groups">("all");
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    try {
      const res = await api.get("/conversations");
      setConversations(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Connect socket and listen for new-message to update conversation list in real-time
  useEffect(() => {
    if (!user) return;

    if (!socket.connected) {
      socket.connect();
    }

    conversations.forEach((c) => {
      socket.emit("join-room", c.id);
    });

    const handleNewMessage = (newMessage: MessageItem) => {
      if (
        newMessage.senderId !== user?.id &&
        newMessage.conversationId !== activeChatId
      ) {
        const senderName = newMessage.sender?.username || "Someone";
        toast.custom((t) => (
          <div
            onClick={() => {
              setActiveChatId(newMessage.conversationId || null);
              toast.dismiss(t);
            }}
            className="flex items-center space-x-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl p-3.5 rounded-2xl shadow-2xl border border-indigo-500/20 cursor-pointer hover:scale-[1.02] transition-all max-w-sm w-full"
          >
            <div className="relative shrink-0">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  senderName
                )}`}
                alt={senderName}
                className="w-10 h-10 rounded-full object-cover shadow-sm border border-indigo-400/30"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white dark:border-zinc-900" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-tight">
                  {senderName}
                </p>
                <span className="text-[10px] text-zinc-400">now</span>
              </div>
              <p className="text-xs text-zinc-700 dark:text-zinc-200 truncate mt-0.5 font-medium">
                {newMessage.content}
              </p>
            </div>
          </div>
        ));
      }

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === newMessage.conversationId) {
            const updatedMessages = c.messages ? [...c.messages] : [];
            if (!updatedMessages.some((m) => m.id === newMessage.id)) {
              updatedMessages.push(newMessage);
            }
            return {
              ...c,
              updatedAt: newMessage.createdAt,
              messages: updatedMessages,
            };
          }
          return c;
        })
      );
    };

    const handleUserStatusChanged = ({
      userId,
      isOnline,
      lastSeen,
    }: {
      userId: string;
      isOnline: boolean;
      lastSeen?: string;
    }) => {
      setConversations((prev) =>
        prev.map((c) => ({
          ...c,
          members: c.members.map((m) =>
            m.user.id === userId
              ? { ...m, user: { ...m.user, isOnline, lastSeen } }
              : m
          ),
        }))
      );
    };

    socket.on("new-message", handleNewMessage);
    socket.on("user-status-changed", handleUserStatusChanged);

    return () => {
      socket.off("new-message", handleNewMessage);
      socket.off("user-status-changed", handleUserStatusChanged);
    };
  }, [user?.id, conversations.map((c) => c.id).join(",")]);

  const activeChat =
    conversations.find((c) => c.id === activeChatId) ?? null;

  const activeUser =
    activeChat?.members?.find((m) => m.user?.id !== user?.id)?.user ?? null;

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    setShowProfile(false);
  };

  const handleNewConversationCreated = (
    conversationId: string,
    newConversation?: Conversation
  ) => {
    if (newConversation) {
      setConversations((prev) => {
        const exists = prev.some((c) => c.id === newConversation.id);
        if (exists) return prev;
        return [newConversation, ...prev];
      });
    } else {
      fetchConversations();
    }
    setActiveChatId(conversationId);
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-[#f2ebfc] dark:bg-[#05010d] flex overflow-hidden selection:bg-indigo-500/30 font-sans">
      {/* Background Ambient Glows (Responsive & Theme Adaptive) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/10 dark:bg-indigo-600/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/10 dark:bg-purple-600/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
          }}
        />
      </div>

      <div className="relative z-10 w-full h-full flex">
        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              />
              {/* Drawer */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                className="fixed inset-y-0 left-0 w-[280px] bg-white dark:bg-[#05010d] z-50 md:hidden flex"
              >
                <Sidebar
                  expanded
                  activeTab={activeTab}
                  onSelectTab={(tab) => {
                    setActiveTab(tab);
                    setIsMobileMenuOpen(false);
                  }}
                  onOpenSettings={() => {
                    setIsSettingsOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  onOpenGroupModal={() => {
                    setIsNewChatOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="absolute top-4 right-4 p-2 bg-black/5 dark:bg-white/10 rounded-full text-zinc-900 dark:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Left Navigation Sidebar */}
        <div className="hidden md:flex h-full shrink-0">
          <Sidebar
            expanded
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenGroupModal={() => setIsNewChatOpen(true)}
          />
        </div>

        {/* Conversation List Sidebar */}
        <div
          className={`h-full w-full md:w-[320px] lg:w-[360px] xl:w-[400px] shrink-0 ${
            activeChatId ? "hidden md:flex" : "flex"
          }`}
        >
          <ConversationList
            conversations={conversations}
            activeId={activeChatId}
            loading={loading}
            activeTab={activeTab}
            onSelect={handleSelectChat}
            onOpenNewChat={() => setIsNewChatOpen(true)}
            onOpenCreateGroup={() => setIsNewChatOpen(true)}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          />
        </div>

        {/* Main Chat Window */}
        <div
          className={`flex-1 h-full min-w-0 ${
            activeChatId ? "flex" : "hidden md:flex"
          }`}
        >
          <ChatWindow
            chat={activeChat}
            onBack={() => setActiveChatId(null)}
            onToggleProfile={() => setShowProfile(!showProfile)}
          />
        </div>

        {/* Right Profile Panel */}
        {showProfile && (activeUser || activeChat?.isGroup) && (
          <div className="hidden xl:flex w-[360px] shrink-0 h-full shadow-[-20px_0_40px_rgba(0,0,0,0.05)] dark:shadow-[-20px_0_40px_rgba(0,0,0,0.2)]">
            <ProfilePanel
              user={activeUser}
              chat={activeChat}
              isBlocked={Boolean(activeUser && blockedUserIds.includes(activeUser.id))}
              onClose={() => setShowProfile(false)}
              onDeleteChat={async (chatId) => {
                try {
                  await api.delete(`/conversations/${chatId}`);
                  setConversations((prev) => prev.filter((c) => c.id !== chatId));
                  if (activeChatId === chatId) {
                    setActiveChatId(null);
                  }
                  setShowProfile(false);
                  toast.success("Chat deleted successfully");
                } catch (err: any) {
                  console.error(err);
                  toast.error(err?.response?.data?.message || "Failed to delete chat");
                }
              }}
              onBlockUser={async (userId, username) => {
                setBlockedUserIds((prev) => [...prev, userId]);
                setShowProfile(false);
                toast.success(`User ${username} has been blocked`);
              }}
              onUnblockUser={async (userId, username) => {
                setBlockedUserIds((prev) => prev.filter((id) => id !== userId));
                setShowProfile(false);
                toast.success(`User ${username} has been unblocked`);
              }}
            />
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      <NewChatModal
        isOpen={isNewChatOpen}
        onClose={() => setIsNewChatOpen(false)}
        onSelectConversation={handleNewConversationCreated}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}