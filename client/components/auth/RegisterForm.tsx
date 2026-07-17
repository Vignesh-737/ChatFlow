"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import axios from "axios"
import { toast } from "sonner";


const registerSchema = z.object({
  username: z.string().min(3, "Min 3 chars"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Min 8 chars"),
  confirmPassword: z.string(),
  rememberMe: z.boolean(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();


  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      rememberMe: false,
    }
  });

  const rememberMe = watch("rememberMe");

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const resData= await axios.post(`${process.env.NEXT_PUBLIC_REGISTER_URL}`,{
        username:data.username,
        email:data.email,
        password:data.password
      })
      
      router.push("/login");
      
    } catch (error) {
      console.error(error);
      toast.error("Registration Failed", {
        description: "The server is currently offline or busy. Please try again later.",
      });
    }

  };

  return (
    <div className="w-full rounded-[24px] bg-gradient-to-br from-white/[0.06] to-white/[0.01] backdrop-blur-[48px] border border-white/[0.1] shadow-[0_24px_40px_-12px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] p-5 sm:p-7 relative overflow-hidden">
      
      {/* Inner Borders & Highlights */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

      {/* Header */}
      <div className="mb-5 text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">Create account</h2>
      </div>

      {/* Form */}
      <form className="space-y-3.5" onSubmit={handleSubmit(onSubmit)}>
        
        {/* Username */}
        <div className="flex flex-col relative">
          <div className="relative group h-11 sm:h-12">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className={`h-4 w-4 transition-colors duration-300 ${errors.username ? 'text-red-400' : 'text-white/40 group-focus-within:text-indigo-400'}`} />
            </div>
            <input
              type="text"
              placeholder="Username"
              {...register("username")}
              className={`w-full h-full bg-white/[0.03] hover:bg-white/[0.05] focus:bg-white/[0.07] border ${errors.username ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20' : 'border-white/[0.08] focus:border-indigo-500/50 focus:ring-indigo-500/20'} rounded-2xl pl-11 pr-4 text-white placeholder-white/50 focus:outline-none focus:ring-4 transition-all text-[13px] [&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]`}
            />
          </div>
          {errors.username && <span className="absolute -bottom-3.5 left-2 text-[10px] text-red-400">{errors.username.message}</span>}
        </div>

        {/* Email */}
        <div className="flex flex-col relative">
          <div className="relative group h-11 sm:h-12">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className={`h-4 w-4 transition-colors duration-300 ${errors.email ? 'text-red-400' : 'text-white/40 group-focus-within:text-indigo-400'}`} />
            </div>
            <input
              type="email"
              placeholder="Email address"
              {...register("email")}
              className={`w-full h-full bg-white/[0.03] hover:bg-white/[0.05] focus:bg-white/[0.07] border ${errors.email ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20' : 'border-white/[0.08] focus:border-indigo-500/50 focus:ring-indigo-500/20'} rounded-2xl pl-11 pr-4 text-white placeholder-white/50 focus:outline-none focus:ring-4 transition-all text-[13px] [&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]`}
            />
          </div>
          {errors.email && <span className="absolute -bottom-3.5 left-2 text-[10px] text-red-400">{errors.email.message}</span>}
        </div>

        {/* Password */}
        <div className="flex flex-col relative">
          <div className="relative group h-11 sm:h-12">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className={`h-4 w-4 transition-colors duration-300 ${errors.password ? 'text-red-400' : 'text-white/40 group-focus-within:text-indigo-400'}`} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
              className={`w-full h-full bg-white/[0.03] hover:bg-white/[0.05] focus:bg-white/[0.07] border ${errors.password ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20' : 'border-white/[0.08] focus:border-indigo-500/50 focus:ring-indigo-500/20'} rounded-2xl pl-11 pr-11 text-white placeholder-white/50 focus:outline-none focus:ring-4 transition-all text-[13px] [&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <span className="absolute -bottom-3.5 left-2 text-[10px] text-red-400">{errors.password.message}</span>}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col relative">
          <div className="relative group h-11 sm:h-12">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className={`h-4 w-4 transition-colors duration-300 ${errors.confirmPassword ? 'text-red-400' : 'text-white/40 group-focus-within:text-indigo-400'}`} />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              {...register("confirmPassword")}
              className={`w-full h-full bg-white/[0.03] hover:bg-white/[0.05] focus:bg-white/[0.07] border ${errors.confirmPassword ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20' : 'border-white/[0.08] focus:border-indigo-500/50 focus:ring-indigo-500/20'} rounded-2xl pl-11 pr-11 text-white placeholder-white/50 focus:outline-none focus:ring-4 transition-all text-[13px] [&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && <span className="absolute -bottom-3.5 left-2 text-[10px] text-red-400">{errors.confirmPassword.message}</span>}
        </div>

        {/* Remember Me */}
        <div className="pt-2 flex items-center justify-between">
          <label className="flex items-center space-x-2.5 cursor-pointer group">
            <div className="relative flex items-center justify-center w-4 h-4 rounded-[5px] border border-white/10 bg-white/5 group-hover:border-white/20 transition-colors overflow-hidden">
              <input
                type="checkbox"
                className="sr-only"
                {...register("rememberMe")}
              />
              <AnimatePresence>
                {rememberMe && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute inset-0 bg-indigo-500 flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <span className="text-[11px] sm:text-xs text-white/60 group-hover:text-white/90 transition-colors">Remember me</span>
          </label>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ y: -1, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 sm:h-12 relative group overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_auto] hover:bg-right flex items-center justify-center space-x-2 text-white text-[13px] font-semibold shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.5)] transition-all duration-500 disabled:opacity-70 disabled:cursor-not-allowed mt-1"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-white/40" />
          <span className="relative z-10">{isSubmitting ? "Creating..." : "Create Account"}</span>
          <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </form>

      {/* Divider */}
      <div className="my-5 flex items-center justify-between">
        <div className="h-px bg-white/10 flex-1" />
        <span className="px-3 text-[10px] uppercase tracking-wider text-white/40 font-medium">or continue with</span>
        <div className="h-px bg-white/10 flex-1" />
      </div>

      {/* Social Auth */}
      <motion.button
        whileHover={{ y: -1, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        type="button"
        className="w-full h-11 sm:h-12 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] flex items-center justify-center space-x-2 text-[13px] text-white/90 font-medium transition-all shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
      >
        <GoogleIcon />
        <span>Google</span>
      </motion.button>

      {/* Footer */}
      <p className="mt-5 sm:mt-6 text-center text-[11px] sm:text-[12px] text-white/60">
        Already have an account?{" "}
        <a href="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors font-semibold">
          Login
        </a>
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}