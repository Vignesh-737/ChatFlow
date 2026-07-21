"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Phone,
  Video,
  Search,
  MoreVertical,
  Paperclip,
  Send,
  Smile,
  ChevronLeft,
  MessageCircle,
  ArrowDown,
  Clock,
  Check,
  AlertCircle,
  RefreshCw,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Conversation, MessageItem } from "@/types/conversation";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface ChatWindowProps {
  chat: Conversation | null;
  loadingMessages?: boolean;
  onBack: () => void;
  onToggleProfile: () => void;
  onSendMessage?: (content: string) => Promise<void>;
}

export function ChatWindow({
  chat,
  loadingMessages = false,
  onBack,
  onToggleProfile,
  onSendMessage,
}: ChatWindowProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync state when active chat changes
  useEffect(() => {
    if (chat?.messages) {
      setMessages(chat.messages);
    } else {
      setMessages([]);
    }
  }, [chat]);

  // Fetch messages if chat selected but messages empty
  useEffect(() => {
    if (!chat?.id) return;

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${chat.id}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };

    fetchMessages();
  }, [chat?.id]);

  // Auto scroll to bottom
  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom("auto");
  }, [chat?.id]);

  useEffect(() => {
    if (!showScrollBottom) {
      scrollToBottom("smooth");
    }
  }, [messages.length]);

  // Handle scroll detection for floating scroll-to-bottom button
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const isScrolledUp =
      container.scrollHeight - container.scrollTop - container.clientHeight > 150;
    setShowScrollBottom(isScrolledUp);
  };

  // Auto-growing textarea handler
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  };

  // Keyboard handler: Enter sends, Shift+Enter newlines
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Send message with Optimistic UI
  const handleSend = async () => {
    const content = inputText.trim();
    if (!content || !chat?.id || sending) return;

    // Reset textarea
    setInputText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Optimistic Message Object
    const tempId = `optimistic-${Date.now()}`;
    const optimisticMsg: MessageItem = {
      id: tempId,
      content,
      senderId: user?.id || "",
      conversationId: chat.id,
      createdAt: new Date().toISOString(),
      status: "sending",
      sender: {
        id: user?.id || "",
        username: user?.username || "Me",
      },
    };

    // Add optimistic message to list immediately
    setMessages((prev) => [...prev, optimisticMsg]);
    setSending(true);

    try {
      if (onSendMessage) {
        await onSendMessage(content);
      } else {
        const res = await api.post("/messages", {
          conversationId: chat.id,
          content,
        });

        const realMessage: MessageItem = res.data.data || res.data;
        realMessage.status = "sent";

        // Replace optimistic message with server message
        setMessages((prev) =>
          prev.map((msg) => (msg.id === tempId ? realMessage : msg))
        );
      }
    } catch (err) {
      console.error("Failed to send message", err);
      toast.error("Failed to send message");

      // Mark message as error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, status: "error" } : msg
        )
      );
    } finally {
      setSending(false);
    }
  };

  // Retry sending failed message
  const handleRetrySend = async (failedMsg: MessageItem) => {
    if (!chat?.id) return;

    // Update status back to sending
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === failedMsg.id ? { ...msg, status: "sending" } : msg
      )
    );

    try {
      const res = await api.post("/messages", {
        conversationId: chat.id,
        content: failedMsg.content,
      });

      const realMessage: MessageItem = res.data.data || res.data;
      realMessage.status = "sent";

      setMessages((prev) =>
        prev.map((msg) => (msg.id === failedMsg.id ? realMessage : msg))
      );
    } catch (err) {
      console.error("Retry failed", err);
      toast.error("Failed to resend message");
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === failedMsg.id ? { ...msg, status: "error" } : msg
        )
      );
    }
  };

  if (!chat) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50/50 dark:bg-transparent relative p-6 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center max-w-sm"
        >
          <div className="w-24 h-24 rounded-[32px] bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center mb-6 shadow-2xl backdrop-blur-xl relative">
            <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
              💬
            </div>
            <MessageCircle className="w-10 h-10 text-indigo-500" />
          </div>
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Your Messages
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm leading-relaxed">
            Select a conversation from the sidebar or start a new chat to begin messaging with teammates.
          </p>
        </motion.div>
      </div>
    );
  }

  const otherUser =
    chat.members.find((m) => m.user?.id !== user?.id)?.user ??
    chat.members[0]?.user;

  if (!otherUser) return null;

  // Group messages by Date
  const formatDateLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) return "Today";
    
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";

    return d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="w-full h-full flex flex-col bg-zinc-50 dark:bg-transparent relative z-0">
      {/* Sticky Header */}
      <div className="h-[88px] px-4 lg:px-6 flex items-center justify-between border-b border-black/5 dark:border-white/5 bg-white/70 dark:bg-black/20 backdrop-blur-2xl shrink-0 z-20">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="md:hidden mr-3 p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
          </button>

          <button
            onClick={onToggleProfile}
            className="flex items-center text-left hover:bg-black/5 dark:hover:bg-white/5 p-2 -ml-2 rounded-2xl transition-colors group"
          >
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
            <div className="ml-4 hidden sm:block">
              <h3 className="font-semibold text-zinc-900 dark:text-white text-[15px]">
                {chat.name || otherUser.username}
              </h3>
              <p className="text-[13px] text-zinc-500 dark:text-zinc-400 font-medium flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>Online</span>
              </p>
            </div>
          </button>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={() => toast.info("Voice call feature coming soon!")}
            className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-zinc-600 dark:text-zinc-300"
          >
            <Phone className="w-5 h-5" />
          </button>
          <button
            onClick={() => toast.info("Video call feature coming soon!")}
            className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-zinc-600 dark:text-zinc-300 hidden sm:block"
          >
            <Video className="w-5 h-5" />
          </button>
          <button
            onClick={() => toast.info("Message search coming soon!")}
            className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-zinc-600 dark:text-zinc-300 hidden md:block"
          >
            <Search className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-black/10 dark:bg-white/10 mx-2 hidden sm:block" />
          <button
            onClick={onToggleProfile}
            className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-zinc-600 dark:text-zinc-300"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 scrollbar-hide relative"
      >
        {loadingMessages ? (
          /* Messages Loading Skeleton */
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`w-1/2 h-14 rounded-2xl animate-pulse ${
                    i % 2 === 0
                      ? "bg-indigo-500/20 rounded-br-none"
                      : "bg-black/5 dark:bg-white/5 rounded-bl-none"
                  }`}
                />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          /* Empty Messages State */
          <div className="h-full flex flex-col items-center justify-center text-center py-12">
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-semibold text-zinc-900 dark:text-white">
              No messages yet
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs">
              Say hello to {otherUser.username} to break the ice!
            </p>
          </div>
        ) : (
          <>
            {/* Date separator & Message List */}
            <div className="flex justify-center my-4">
              <span className="px-4 py-1.5 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-full text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider backdrop-blur-md shadow-sm">
                Today
              </span>
            </div>

            {messages.map((msg, idx) => {
              const isMe = msg.senderId === user?.id;
              const isSending = msg.status === "sending";
              const isError = msg.status === "error";

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.3) }}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  {!isMe && (
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        otherUser.username
                      )}`}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover mr-3 self-end mb-1 hidden sm:block shadow-sm shrink-0"
                    />
                  )}

                  <div
                    className={`max-w-[85%] lg:max-w-[70%] flex flex-col ${
                      isMe ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`px-5 py-3.5 rounded-[24px] relative group ${
                        isMe
                          ? "bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-br-[8px] shadow-[0_4px_20px_rgba(99,102,241,0.3)] border border-indigo-400/20"
                          : "bg-white dark:bg-white/10 text-zinc-900 dark:text-white rounded-bl-[8px] border border-black/5 dark:border-white/10 shadow-md backdrop-blur-xl"
                      }`}
                    >
                      <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                        {msg.content}
                      </p>
                    </div>

                    <div className="flex items-center space-x-1.5 mt-1.5 px-1">
                      <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>

                      {isMe && (
                        <span className="text-zinc-400 dark:text-zinc-500">
                          {isSending ? (
                            <Clock className="w-3 h-3 animate-spin text-indigo-400" />
                          ) : isError ? (
                            <button
                              onClick={() => handleRetrySend(msg)}
                              className="flex items-center space-x-1 text-red-400 text-[10px] hover:underline"
                            >
                              <AlertCircle className="w-3 h-3 text-red-400" />
                              <span>Failed. Retry</span>
                            </button>
                          ) : (
                            <Check className="w-3.5 h-3.5 text-indigo-400" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </>
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center space-x-2 text-xs text-zinc-500 dark:text-zinc-400 pl-2"
          >
            <div className="flex space-x-1 bg-white/60 dark:bg-white/10 p-3 rounded-2xl rounded-bl-sm border border-black/5 dark:border-white/10 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
            </div>
            <span className="font-medium text-[11px]">
              {otherUser.username} is typing...
            </span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating Scroll-to-Bottom Button */}
      <AnimatePresence>
        {showScrollBottom && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={() => scrollToBottom("smooth")}
            className="absolute bottom-24 right-8 p-3 rounded-full bg-indigo-600 text-white shadow-xl hover:bg-indigo-500 transition-colors z-20 flex items-center space-x-1 border border-indigo-400/30"
          >
            <ArrowDown className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="p-4 lg:p-6 bg-white/70 dark:bg-black/20 backdrop-blur-2xl border-t border-black/5 dark:border-white/5 z-20 shrink-0">
        <div className="flex items-end space-x-2 bg-white/90 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-[28px] p-2 pr-2 shadow-sm focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:border-indigo-500/30 transition-all relative">
          <button
            type="button"
            onClick={() => toast.info("Attachments coming soon!")}
            className="p-3.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-zinc-500 dark:text-zinc-400 shrink-0"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 max-h-32 bg-transparent border-none focus:outline-none resize-none py-3.5 text-[15px] text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-500 scrollbar-hide"
          />

          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-3.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-zinc-500 dark:text-zinc-400 shrink-0 hidden sm:block"
          >
            <Smile className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleSend}
            disabled={!inputText.trim() || sending}
            className={`p-3.5 rounded-full transition-all shrink-0 ${
              inputText.trim() && !sending
                ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 cursor-pointer"
                : "bg-zinc-300 dark:bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50"
            }`}
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5 ml-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}