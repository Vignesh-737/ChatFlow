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
  CheckCheck,
  AlertCircle,
  RefreshCw,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Conversation, MessageItem } from "@/types/conversation";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { socket } from "@/lib/socket";
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
  // Track whether we already emitted typing-start so we don't spam the server
  const isEmittingTyping = useRef(false);
  // Auto-stop typing after 2 s of no keypresses
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch all messages from API whenever the active conversation changes.
  // This is the single source of truth — we do NOT sync from chat.messages
  // because that object is updated by the socket listener in page.tsx and
  // would overwrite our locally accumulated messages on every new message.
  useEffect(() => {
    if (!chat?.id) {
      setMessages([]);
      return;
    }

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

  // Real-time socket listener for incoming messages
  useEffect(() => {
    if (!chat?.id) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join-room", chat.id);

    const handleNewMessage = (newMessage: MessageItem) => {
      if (newMessage.conversationId === chat.id) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMessage.id)) {
            return prev;
          }
          // Remove any temporary optimistic message with matching content and sender
          const filtered = prev.filter(
            (m) =>
              !(
                m.status === "sending" &&
                m.content === newMessage.content &&
                (m.senderId === newMessage.senderId ||
                  m.senderId === newMessage.sender?.id)
              )
          );
          return [...filtered, newMessage];
        });
      }
    };

    socket.on("new-message", handleNewMessage);

    // Typing events from the OTHER user in this conversation
    const handleUserTyping = ({ conversationId }: { conversationId: string }) => {
      if (conversationId === chat.id) setIsTyping(true);
    };

    const handleUserStopTyping = ({ conversationId }: { conversationId: string }) => {
      if (conversationId === chat.id) setIsTyping(false);
    };
    
    const handleMessagesRead = ({ messageIds, conversationId }: { messageIds: string[], conversationId: string }) => {
      if (conversationId === chat.id) {
        setMessages((prev) =>
          prev.map((m) => (messageIds.includes(m.id) ? { ...m, isRead: true } : m))
        );
      }
    };

    socket.on("user-typing", handleUserTyping);
    socket.on("user-stop-typing", handleUserStopTyping);
    socket.on("messages-read", handleMessagesRead);

    return () => {
      socket.off("new-message", handleNewMessage);
      socket.off("user-typing", handleUserTyping);
      socket.off("user-stop-typing", handleUserStopTyping);
      socket.off("messages-read", handleMessagesRead);
      // Make sure we stop typing when switching conversations
      if (isEmittingTyping.current) {
        socket.emit("typing-stop", { conversationId: chat.id });
        isEmittingTyping.current = false;
      }
    };
  }, [chat?.id]);

  // Auto scroll to bottom
  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Mark unread messages from other user as read
  useEffect(() => {
    if (!chat?.id || !user?.id || messages.length === 0) return;
    
    const unreadMessageIds = messages
      .filter((m) => {
        const mSenderId = m.senderId || m.sender?.id;
        return mSenderId !== user.id && !m.isRead;
      })
      .map((m) => m.id);

    if (unreadMessageIds.length > 0) {
      // Optimistically mark local state
      setMessages((prev) =>
        prev.map((m) => (unreadMessageIds.includes(m.id) ? { ...m, isRead: true } : m))
      );
      // Emit to server
      socket.emit("mark-messages-read", {
        messageIds: unreadMessageIds,
        conversationId: chat.id
      });
    }
  }, [messages, chat?.id, user?.id]);

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

  // Emit typing-stop and clear timeout helper
  const emitTypingStop = () => {
    if (!chat?.id) return;
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    if (isEmittingTyping.current) {
      socket.emit("typing-stop", { conversationId: chat.id });
      isEmittingTyping.current = false;
    }
  };

  // Auto-growing textarea handler + typing emit
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputText(value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }

    if (!chat?.id || !socket.connected) return;

    if (value.trim()) {
      // Emit typing-start only once until we stop
      if (!isEmittingTyping.current) {
        socket.emit("typing-start", { conversationId: chat.id });
        isEmittingTyping.current = true;
      }
      // Reset the 2-second idle timeout
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(emitTypingStop, 2000);
    } else {
      // Input cleared — stop immediately
      emitTypingStop();
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
    console.log("SEND CALLED");
    const content = inputText.trim();
    if (!content || !chat?.id || sending) return;

    // Reset textarea and stop typing indicator
    setInputText("");
    emitTypingStop();
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
    chat.members?.find((m) => m.user?.id !== user?.id)?.user ??
    chat.members?.[0]?.user;

  if (!otherUser) return null;

  const formatDateLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) return "Today";
    
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";

    return d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  };

  const formatLastSeen = (dateStr?: string) => {
    if (!dateStr) return "Offline";
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Last seen just now";
    if (minutes < 60) return `Last seen ${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Last seen ${hours} hour${hours !== 1 ? 's' : ''} ago`;
    return `Last seen ${new Date(dateStr).toLocaleDateString()}`;
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#f5effd]/50 dark:bg-transparent relative z-0">
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
              {otherUser.isOnline && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-[#1a1423] rounded-full" />
              )}
            </div>
            <div className="ml-4 hidden sm:block">
              <h3 className="font-semibold text-zinc-900 dark:text-white text-[15px]">
                {chat.name || otherUser.username}
              </h3>
              <p className="text-[13px] text-zinc-500 dark:text-zinc-400 font-medium flex items-center space-x-1.5">
                {otherUser.isOnline ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-green-600 dark:text-green-400">Online</span>
                  </>
                ) : (
                  <span>{formatLastSeen(otherUser.lastSeen)}</span>
                )}
              </p>
            </div>
          </button>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2">
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
              const senderId = msg.senderId || msg.sender?.id;
              const isOwnMessage = Boolean(user?.id && senderId === user.id);
              const isSending = msg.status === "sending";
              const isError = msg.status === "error";

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.3) }}
                  className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                >
                  {!isOwnMessage && (
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        msg.sender?.username || otherUser.username
                      )}`}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover mr-3 self-end mb-1 hidden sm:block shadow-sm shrink-0"
                    />
                  )}

                  <div
                    className={`max-w-[85%] lg:max-w-[70%] flex flex-col ${
                      isOwnMessage ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`px-5 py-3.5 rounded-[24px] relative group ${
                        isOwnMessage
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

                      {isOwnMessage && (
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
                          ) : msg.isRead ? (
                            <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
                          ) : (
                            <Check className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
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
        <AnimatePresence>
          {isTyping && (
            <motion.div
              key="typing-indicator"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center space-x-2 pl-2"
            >
              <div className="flex items-center space-x-1.5 bg-white dark:bg-white/10 px-4 py-3 rounded-2xl rounded-bl-sm border border-black/5 dark:border-white/10 shadow-md backdrop-blur-xl">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-duration:0.9s]" />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-duration:0.9s] [animation-delay:0.18s]" />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-duration:0.9s] [animation-delay:0.36s]" />
              </div>
              <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                {otherUser.username} is typing...
              </span>
            </motion.div>
          )}
        </AnimatePresence>

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
            className="flex-1 max-h-32 bg-transparent border-none focus:outline-none resize-none py-3.5 text-[15px] text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-500 [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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