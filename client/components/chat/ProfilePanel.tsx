"use client";

import React from "react";
import {
  X,
  Bell,
  Image as ImageIcon,
  Link,
  FileText,
  Ban,
  Trash2,
  ChevronRight,
  Unlock,
} from "lucide-react";

import { Conversation } from "@/types/conversation";

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: string;
}

interface ProfilePanelProps {
  user: User | null;
  chat?: Conversation | null;
  isBlocked?: boolean;
  onClose: () => void;
  onDeleteChat?: (chatId: string) => Promise<void>;
  onBlockUser?: (userId: string, username: string) => Promise<void>;
  onUnblockUser?: (userId: string, username: string) => Promise<void>;
}

export function ProfilePanel({
  user,
  chat,
  isBlocked = false,
  onClose,
  onDeleteChat,
  onBlockUser,
  onUnblockUser,
}: ProfilePanelProps) {
  const [confirmModal, setConfirmModal] = React.useState<{
    type: "delete" | "block" | "unblock";
    targetName: string;
    targetId: string;
  } | null>(null);
  const [actionLoading, setActionLoading] = React.useState(false);

  if (!user && !chat?.isGroup) return null;

  const isGroup = Boolean(chat?.isGroup);
  const titleName = isGroup ? chat?.name || "Group Chat" : user?.username || "User";
  const targetId = isGroup ? chat!.id : user!.id;

  const formatLastSeen = (dateStr?: string) => {
    if (!dateStr) return "Offline";
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Last seen just now";
    if (minutes < 60) return `Last seen ${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Last seen ${hours}h ago`;
    return `Last seen ${new Date(dateStr).toLocaleDateString()}`;
  };

  const handleConfirmAction = async () => {
    if (!confirmModal) return;
    setActionLoading(true);
    try {
      if (confirmModal.type === "delete" && chat?.id && onDeleteChat) {
        await onDeleteChat(chat.id);
      } else if (confirmModal.type === "block" && onBlockUser) {
        await onBlockUser(confirmModal.targetId, confirmModal.targetName);
      } else if (confirmModal.type === "unblock" && onUnblockUser) {
        await onUnblockUser(confirmModal.targetId, confirmModal.targetName);
      }
    } finally {
      setActionLoading(false);
      setConfirmModal(null);
    }
  };

  return (
    <div className="w-full h-full bg-white/80 dark:bg-black/40 backdrop-blur-3xl border-l border-black/5 dark:border-white/5 flex flex-col z-20 relative">
      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#120b22] border border-black/10 dark:border-white/10 p-6 rounded-3xl shadow-2xl max-w-sm w-full space-y-4 text-center">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto ${confirmModal.type === "unblock" ? "bg-indigo-500/10 text-indigo-500" : "bg-red-500/10 text-red-500"}`}>
              {confirmModal.type === "delete" ? (
                <Trash2 className="w-6 h-6" />
              ) : confirmModal.type === "unblock" ? (
                <Unlock className="w-6 h-6" />
              ) : (
                <Ban className="w-6 h-6" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                {confirmModal.type === "delete"
                  ? isGroup
                    ? "Delete Group Chat?"
                    : "Delete Conversation?"
                  : confirmModal.type === "unblock"
                  ? `Unblock ${confirmModal.targetName}?`
                  : `Block ${confirmModal.targetName}?`}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {confirmModal.type === "delete"
                  ? "This action is permanent and will remove all message history for this chat."
                  : confirmModal.type === "unblock"
                  ? "This user will be able to send you direct messages again."
                  : "Blocked users will no longer be able to message you in direct chats."}
              </p>
            </div>
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setConfirmModal(null)}
                disabled={actionLoading}
                className="flex-1 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={actionLoading}
                className={`flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition-colors shadow-lg flex items-center justify-center ${
                  confirmModal.type === "unblock"
                    ? "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/25"
                    : "bg-red-600 hover:bg-red-500 shadow-red-500/25"
                }`}
              >
                {actionLoading
                  ? "Processing..."
                  : confirmModal.type === "delete"
                  ? "Delete"
                  : confirmModal.type === "unblock"
                  ? "Unblock"
                  : "Block"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="h-[88px] px-6 flex items-center justify-between border-b border-black/5 dark:border-white/5 shrink-0 bg-white/50 dark:bg-black/20 backdrop-blur-xl">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white tracking-tight">
          {isGroup ? "Group Info" : "Contact Info"}
        </h2>

        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors text-zinc-500 dark:text-zinc-300"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Profile Header */}
        <div className="flex flex-col items-center p-8 border-b border-black/5 dark:border-white/5">
          {isGroup ? (
            <>
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl border-4 border-white dark:border-[#1a1423] mb-5">
                👥
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                {chat?.name || "Group Chat"}
              </h3>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1">
                {chat?.members?.length || 0} members
              </p>
            </>
          ) : user ? (
            <>
              <div className="w-28 h-28 rounded-full overflow-hidden mb-5 shadow-xl border-4 border-white dark:border-[#1a1423]">
                <img
                  src={
                    user.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.username
                    )}`
                  }
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                {user.username}
              </h3>

              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1">
                {user.email}
              </p>

              {user.isOnline ? (
                <p className="text-sm text-green-500 font-medium mt-2">Online</p>
              ) : (
                <p className="text-sm text-zinc-400 font-medium mt-2">
                  {formatLastSeen(user.lastSeen)}
                </p>
              )}
            </>
          ) : null}
        </div>

        {/* Group Members List */}
        {isGroup && chat?.members && (
          <div className="p-6 border-b border-black/5 dark:border-white/5 space-y-3">
            <h4 className="text-xs font-bold uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">
              Members ({chat.members.length})
            </h4>

            <div className="space-y-2">
              {chat.members.map(({ user: memberUser }) => (
                <div
                  key={memberUser.id}
                  className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={
                          memberUser.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            memberUser.username
                          )}`
                        }
                        alt={memberUser.username}
                        className="w-10 h-10 rounded-full object-cover shadow-sm"
                      />
                      {memberUser.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                        {memberUser.username}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                        {memberUser.isOnline
                          ? "Online"
                          : formatLastSeen(memberUser.lastSeen)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-6 border-b border-black/5 dark:border-white/5">
          <button className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors group border border-transparent hover:border-black/5 dark:hover:border-white/10">
            <div className="flex items-center">
              <Bell className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
              <span className="ml-3 font-medium text-[15px]">
                Mute Notifications
              </span>
            </div>

            <div className="w-11 h-6 bg-black/10 dark:bg-white/10 rounded-full relative">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
            </div>
          </button>
        </div>

        {/* Placeholder sections */}
        <div className="p-6 border-b border-black/5 dark:border-white/5 space-y-2">
          {[
            {
              icon: ImageIcon,
              label: "Media",
              color: "text-indigo-500",
            },
            {
              icon: FileText,
              label: "Files",
              color: "text-blue-500",
            },
            {
              icon: Link,
              label: "Links",
              color: "text-emerald-500",
            },
          ].map(({ icon: Icon, label, color }) => (
            <button
              key={label}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center">
                <Icon className={`w-5 h-5 ${color}`} />
                <span className="ml-3">{label}</span>
              </div>

              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </button>
          ))}
        </div>

        {/* Danger Zone */}
        <div className="p-6 space-y-2">
          {!isGroup && user && (
            isBlocked ? (
              <button
                onClick={() =>
                  setConfirmModal({
                    type: "unblock",
                    targetName: user.username,
                    targetId: user.id,
                  })
                }
                className="w-full flex items-center p-3.5 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 transition-colors"
              >
                <Unlock className="w-5 h-5" />
                <span className="ml-3 font-medium">Unblock User</span>
              </button>
            ) : (
              <button
                onClick={() =>
                  setConfirmModal({
                    type: "block",
                    targetName: user.username,
                    targetId: user.id,
                  })
                }
                className="w-full flex items-center p-3.5 rounded-2xl hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 transition-colors"
              >
                <Ban className="w-5 h-5" />
                <span className="ml-3 font-medium">Block User</span>
              </button>
            )
          )}

          {chat && (
            <button
              onClick={() =>
                setConfirmModal({
                  type: "delete",
                  targetName: titleName,
                  targetId: chat.id,
                })
              }
              className="w-full flex items-center p-3.5 rounded-2xl hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              <span className="ml-3 font-medium">
                {isGroup ? "Delete Group" : "Delete Chat"}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}