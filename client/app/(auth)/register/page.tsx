"use client";

import React from "react";
import { motion } from "framer-motion";
import { AuthShowcase } from "@/components/auth/AuthShowcase";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="fixed inset-0 w-full h-full bg-[#05010d] flex overflow-hidden selection:bg-indigo-500/30">
      
      {/* Animated Ambient Background Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 150, -50, 0], 
            y: [0, -100, 50, 0],
            scale: [1, 1.1, 0.9, 1],
            opacity: [0.4, 0.6, 0.4] 
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-[60%] h-[60%] bg-indigo-600/30 blur-[60px] rounded-full mix-blend-screen" 
        />
        <motion.div 
          animate={{ 
            x: [0, -120, 80, 0], 
            y: [0, 150, -60, 0],
            scale: [1, 1.2, 0.8, 1],
            opacity: [0.4, 0.6, 0.4] 
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 right-0 w-[60%] h-[60%] bg-purple-600/30 blur-[60px] rounded-full mix-blend-screen" 
        />
      </div>

      {/* Container - Locked to screen height */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center lg:flex-row">
        
        {/* Left Side - Branding Showcase */}
        <div className="flex w-full lg:w-1/2 h-auto lg:h-full flex-col justify-center items-center lg:items-start pb-6 lg:pb-0 lg:px-24 xl:px-32 2xl:px-40 shrink-0">
          <AuthShowcase />
        </div>

        {/* Right Side - Form (Perfectly Centered, Fits Intentionally) */}
        <div className="w-full lg:w-1/2 h-auto lg:h-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
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