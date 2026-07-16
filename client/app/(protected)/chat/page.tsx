// app/(protected)/chat/page.tsx
"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/chat/Sidebar";
import { ConversationList } from "@/components/chat/ConversationList";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { ProfilePanel } from "@/components/chat/ProfilePanel";
import { mockConversations, currentUser } from "@/data/mock";

export default function ChatPage() {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  const activeChat = mockConversations.find(c => c.id === activeChatId) || null;
  const activeUser = activeChat?.participants.find(p => p.id !== currentUser.id) || null;

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    setShowProfile(false);
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-[#f4f4f5] dark:bg-[#05010d] flex overflow-hidden selection:bg-indigo-500/30 font-sans">
      
      {/* Background Ambient Glows (Responsive & Theme Adaptive) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/10 dark:bg-indigo-600/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/10 dark:bg-purple-600/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      </div>

      <div className="relative z-10 w-full h-full flex">
        
        {/* Left Sidebar */}
        <div className="hidden md:flex h-full shrink-0">
          <Sidebar />
        </div>

        {/* Conversation List */}
        <div className={`h-full w-full md:w-[320px] lg:w-[360px] xl:w-[400px] shrink-0 ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
          <ConversationList activeId={activeChatId} onSelect={handleSelectChat} />
        </div>

        {/* Main Chat Window */}
        <div className={`flex-1 h-full min-w-0 ${activeChatId ? 'flex' : 'hidden md:flex'}`}>
          <ChatWindow 
            chat={activeChat} 
            onBack={() => setActiveChatId(null)} 
            onToggleProfile={() => setShowProfile(!showProfile)} 
          />
        </div>

        {/* Right Profile Panel */}
        {showProfile && activeUser && (
          <div className="hidden xl:flex w-[360px] shrink-0 h-full shadow-[-20px_0_40px_rgba(0,0,0,0.05)] dark:shadow-[-20px_0_40px_rgba(0,0,0,0.2)]">
            <ProfilePanel user={activeUser} onClose={() => setShowProfile(false)} />
          </div>
        )}

      </div>
    </div>
  );
}