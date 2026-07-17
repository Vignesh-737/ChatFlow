"use client";

import React from "react";
import { motion } from "framer-motion";

export function AuthShowcase() {
  return (
    <div className="w-full flex flex-col items-center lg:items-start relative z-10">
      
      {/* Mobile-only compact logo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center lg:hidden mb-6"
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-b from-white/20 to-transparent p-[1px] mb-2 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
          <div className="w-full h-full rounded-full bg-[#0a0514] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 to-purple-600/30" />
            <img src="./logo.png" alt="Logo" className="w-full h-full object-cover rounded-full relative z-10" />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          ChatFlow
        </h1>
      </motion.div>

      {/* Desktop Showcase Area */}
      <div className="hidden lg:flex flex-col w-full">
        {/* Branding Header */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
           className="mb-10 xl:mb-12 flex items-center space-x-4"
        >
          <div className="w-12 h-12 xl:w-14 xl:h-14 rounded-2xl bg-gradient-to-b from-white/20 to-transparent p-[1px] shadow-[0_0_30px_rgba(99,102,241,0.3)]">
             <div className="w-full h-full rounded-2xl bg-[#0a0514] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 to-purple-600/30" />
                <img src="./logo.png" alt="Logo" className="w-full h-full object-cover rounded-2xl relative z-10" />
             </div>
          </div>
          <h1 className="text-3xl xl:text-4xl font-bold text-white tracking-tight">ChatFlow</h1>
        </motion.div>

        {/* Abstract Chat Mockup Graphic */}
        <div className="relative w-full max-w-[420px] aspect-[4/3] mb-10 xl:mb-12 perspective-1000">
           {/* Decorator panels */}
           <motion.div 
             initial={{ opacity: 0, rotate: -5, x: -20, y: 10 }}
             animate={{ opacity: 1, rotate: -2, x: 0, y: 0 }}
             transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
             className="absolute inset-0 bg-white/[0.02] border border-white/[0.05] rounded-3xl backdrop-blur-2xl shadow-2xl"
           />
           <motion.div 
             initial={{ opacity: 0, rotate: 5, y: 30 }}
             animate={{ opacity: 1, rotate: 2, y: 0 }}
             transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
             className="absolute inset-4 bg-white/[0.04] border border-white/[0.08] rounded-2xl backdrop-blur-xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col p-5 space-y-4"
           >
              {/* Chat Header */}
              <div className="flex items-center space-x-3 pb-3 border-b border-white/10">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 shrink-0 shadow-sm" />
                <div className="flex-1">
                  <div className="h-2 w-24 bg-white/30 rounded-full mb-2" />
                  <div className="h-1.5 w-16 bg-green-400/80 rounded-full" />
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex flex-col space-y-4 flex-1 justify-end">
                <motion.div 
                   initial={{ opacity: 0, x: -10, scale: 0.95 }}
                   animate={{ opacity: 1, x: 0, scale: 1 }}
                   transition={{ duration: 0.5, delay: 1.0 }}
                   className="self-start max-w-[80%] bg-white/10 rounded-2xl rounded-tl-sm px-4 py-3 backdrop-blur-sm border border-white/5"
                >
                  <div className="h-1.5 w-28 bg-white/50 rounded-full mb-2" />
                  <div className="h-1.5 w-20 bg-white/30 rounded-full" />
                </motion.div>
                
                <motion.div 
                   initial={{ opacity: 0, x: 10, scale: 0.95 }}
                   animate={{ opacity: 1, x: 0, scale: 1 }}
                   transition={{ duration: 0.5, delay: 1.6 }}
                   className="self-end max-w-[80%] bg-indigo-500/80 rounded-2xl rounded-tr-sm px-4 py-3 backdrop-blur-sm border border-indigo-400/20 shadow-lg"
                >
                  <div className="h-1.5 w-32 bg-white/80 rounded-full mb-2" />
                  <div className="h-1.5 w-24 bg-white/60 rounded-full" />
                </motion.div>

                <motion.div 
                   initial={{ opacity: 0, x: -10, scale: 0.95 }}
                   animate={{ opacity: 1, x: 0, scale: 1 }}
                   transition={{ duration: 0.5, delay: 2.2 }}
                   className="self-start max-w-[80%] bg-white/10 rounded-2xl rounded-tl-sm px-4 py-3 backdrop-blur-sm border border-white/5"
                >
                  <div className="flex space-x-1.5 items-center h-2">
                     <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-white/60" />
                     <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-white/60" />
                     <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-white/60" />
                  </div>
                </motion.div>
              </div>
           </motion.div>
        </div>

        {/* Tagline */}
        <div className="flex items-center gap-2 flex-wrap">
          {["Connect.", "Communicate.", "Flow."].map((word, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 2.6 + i * 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`text-lg font-semibold tracking-tight ${
                i === 2
                  ? "bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent"
                  : "text-white/80"
              }`}
            >
              {word}
            </motion.span>
          ))}
        </div>

      </div>

    </div>
  );
}
