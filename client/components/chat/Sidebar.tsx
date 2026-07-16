// components/chat/Sidebar.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, Home, Users, Sparkles, Archive, Settings, LogOut } from "lucide-react";
import { ThemeToggle } from "../ui/ThemeToggle";
import { currentUser } from "../../data/mock";
import axios from "axios";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const navItems = [
  { icon: Home, label: "Home", active: false },
  { icon: MessageCircle, label: "Messages", active: true },
  { icon: Users, label: "Groups", active: false },
  { icon: Sparkles, label: "AI Assistant", active: false },
  { icon: Archive, label: "Archive", active: false },
];

export function Sidebar() {
    const router=useRouter();
    const Logout=async()=>{
        try {
            await api.post("/auth/logout");
            router.push("/login")
        } catch (error) {
            console.error(error)
        }
    }
  return (
    <div className="w-20 lg:w-64 h-full flex flex-col justify-between p-4 border-r border-black/5 dark:border-white/5 bg-white/40 dark:bg-black/20 backdrop-blur-3xl z-20 transition-all duration-300">
      <div className="flex flex-col space-y-8">
        {/* Logo */}
        <div className="flex rounded-full items-center justify-center lg:justify-start px-2 mt-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)] shrink-0">
            <img src="./Logo.png" alt="" />
          </div>
          <span className="hidden lg:block ml-3 font-bold text-xl tracking-tight text-zinc-900 dark:text-white">ChatFlow</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-2">
          {navItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                className={`relative flex items-center justify-center lg:justify-start p-3 rounded-2xl transition-all group overflow-hidden ${
                  item.active 
                    ? "text-indigo-600 dark:text-indigo-400" 
                    : "text-zinc-500 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                {item.active && (
                  <motion.div layoutId="activeNavIndicator" className="absolute inset-0 bg-black/5 dark:bg-white/10 rounded-2xl border border-black/5 dark:border-white/10 shadow-sm" />
                )}
                <Icon className="w-5 h-5 relative z-10" />
                <span className="hidden lg:block ml-3 font-medium relative z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col space-y-4 items-center lg:items-stretch">
        <button className="flex items-center justify-center lg:justify-start p-3 rounded-2xl text-zinc-500 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
          <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
          <span className="hidden lg:block ml-3 font-medium">Settings</span>
        </button>

        <button className="flex items-center justify-center lg:justify-start p-3 rounded-2xl text-red-500/80 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors group" onClick={()=>Logout()}>
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="hidden lg:block ml-3 font-medium">Logout</span>
        </button>
        
        <div className="flex items-center justify-center lg:justify-start p-2">
           <ThemeToggle />
        </div>

        <button className="flex items-center justify-center lg:justify-start p-2 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors mt-2 border border-transparent hover:border-black/5 dark:hover:border-white/10">
          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 shadow-sm">
            <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="hidden lg:flex flex-col ml-3 text-left">
            <span className="text-sm font-semibold text-zinc-900 dark:text-white">{currentUser.name}</span>
            <span className="text-xs text-green-500 font-medium">Online</span>
          </div>
        </button>
      </div>
    </div>
  );
}