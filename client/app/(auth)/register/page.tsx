"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="fixed inset-0 w-full h-full bg-[#05010d] flex overflow-hidden selection:bg-indigo-500/30">
      
      {/* Animated Ambient Background Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/30 blur-[120px] rounded-full mix-blend-screen" 
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/30 blur-[120px] rounded-full mix-blend-screen" 
        />
        
        {/* Subtle Noise Texture */}
        <div 
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
        />
      </div>

      {/* Container - Locked to screen height */}
      <div className="relative z-10 w-full h-full flex flex-col lg:flex-row">
        
        {/* Left Side - Branding */}
        <div className="hidden lg:flex w-1/2 h-full flex-col justify-center px-12 lg:px-64">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="w-44 h-44 rounded-full bg-gradient-to-b from-white/20 to-transparent p-[1px] mb-6 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
              <div className="w-full h-full rounded-full bg-[#0a0514] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 to-purple-600/30" />
                <img src="./logo.png" alt="" />
              </div>
            </div>
            
            <h1 className="text-4xl xl:text-5xl font-bold text-white tracking-tight">
              ChatFlow
            </h1>
          </motion.div>
        </div>

        {/* Right Side - Form (Perfectly Centered, Fits Intentionally) */}
        <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="w-[96%] sm:w-full max-w-[440px]"
          >
            <RegisterForm />
          </motion.div>
        </div>

      </div>
    </div>
  );
}