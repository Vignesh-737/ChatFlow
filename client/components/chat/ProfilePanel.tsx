// components/chat/ProfilePanel.tsx
"use client";

import React from "react";
import { X, Bell, Image as ImageIcon, Link, FileText, Ban, Trash2, ChevronRight } from "lucide-react";
import { User } from "../../types";

interface ProfilePanelProps {
  user: User | null;
  onClose: () => void;
}

export function ProfilePanel({ user, onClose }: ProfilePanelProps) {
  if (!user) return null;

  return (
    <div className="w-full h-full bg-white/80 dark:bg-black/40 backdrop-blur-3xl border-l border-black/5 dark:border-white/5 flex flex-col z-20">
      {/* Header */}
      <div className="h-[88px] px-6 flex items-center justify-between border-b border-black/5 dark:border-white/5 shrink-0 bg-white/50 dark:bg-black/20 backdrop-blur-xl">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white tracking-tight">Contact Info</h2>
        <button onClick={onClose} className="p-2.5 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors text-zinc-500 dark:text-zinc-300">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Profile Info */}
        <div className="flex flex-col items-center p-8 border-b border-black/5 dark:border-white/5">
          <div className="w-28 h-28 rounded-full overflow-hidden mb-5 shadow-xl border-4 border-white dark:border-[#1a1423]">
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{user.name}</h3>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1">{user.status === 'online' ? 'Online' : 'Offline'}</p>
        </div>

        {/* Actions */}
        <div className="p-6 border-b border-black/5 dark:border-white/5">
          <button className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors group border border-transparent hover:border-black/5 dark:hover:border-white/10">
            <div className="flex items-center">
              <Bell className="w-5 h-5 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
              <span className="ml-3 font-medium text-[15px] text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">Mute Notifications</span>
            </div>
            <div className="w-11 h-6 bg-black/10 dark:bg-white/10 rounded-full relative transition-colors shadow-inner">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
            </div>
          </button>
        </div>

        {/* Media */}
        <div className="p-6 border-b border-black/5 dark:border-white/5 space-y-2">
          <button className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors group border border-transparent hover:border-black/5 dark:hover:border-white/10">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
                <ImageIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="ml-3 font-medium text-[15px] text-zinc-700 dark:text-zinc-300">Media</span>
            </div>
            <div className="flex items-center text-zinc-400">
              <span className="text-xs font-semibold mr-2">124</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
          
          <button className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors group border border-transparent hover:border-black/5 dark:hover:border-white/10">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="ml-3 font-medium text-[15px] text-zinc-700 dark:text-zinc-300">Files</span>
            </div>
            <div className="flex items-center text-zinc-400">
              <span className="text-xs font-semibold mr-2">12</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
          
          <button className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors group border border-transparent hover:border-black/5 dark:hover:border-white/10">
            <div className="flex items-center">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl">
                <Link className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="ml-3 font-medium text-[15px] text-zinc-700 dark:text-zinc-300">Links</span>
            </div>
            <div className="flex items-center text-zinc-400">
              <span className="text-xs font-semibold mr-2">45</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>

        {/* Danger Zone */}
        <div className="p-6 space-y-2">
          <button className="w-full flex items-center p-3.5 rounded-2xl hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-500/20">
            <Ban className="w-5 h-5" />
            <span className="ml-3 font-medium text-[15px]">Block User</span>
          </button>
          <button className="w-full flex items-center p-3.5 rounded-2xl hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-500/20">
            <Trash2 className="w-5 h-5" />
            <span className="ml-3 font-medium text-[15px]">Delete Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
}