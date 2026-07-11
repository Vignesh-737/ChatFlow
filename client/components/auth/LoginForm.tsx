"use client";

import GlassCard from "../common/GlassCard";
import Logo from "./Logo"
import { motion } from "framer-motion";

export default function LoginForm() {
  return (
    <motion.div
  initial={{
    opacity: 0,
    y: 30,
    scale: 0.96,
  }}
  animate={{
    opacity: 1,
    y: 0,
    scale: 1,
  }}
  transition={{
    duration: 0.7,
    ease: "easeOut",
  }}
>
  <GlassCard className="w-full max-w-md p-8">
      <div className="space-y-8">
        <Logo />

        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Welcome back
          </h1>

          <p className="text-zinc-400">
            Sign in to continue to ChatFlow
          </p>
        </div>

        <form className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm text-zinc-300">
              Email
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              className="
              h-12
              w-full
              rounded-2xl
              border
              border-white/10
              bg-white/5
              px-4
              text-white
              outline-none
              transition-all
              duration-300
              placeholder:text-zinc-500
              focus:border-violet-400
              focus:bg-white/10
              focus:ring-2
              focus:ring-violet-500/30
              "
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-zinc-300">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              className="
              h-12
              w-full
              rounded-2xl
              border
              border-white/10
              bg-white/5
              px-4
              text-white
              outline-none
              transition-all
              duration-300
              placeholder:text-zinc-500
              focus:border-violet-400
              focus:bg-white/10
              focus:ring-2
              focus:ring-violet-500/30
              "
            />
          </div>

          <button
            className="
            h-12
            w-full
            rounded-2xl
            bg-gradient-to-r
            from-violet-500
            to-indigo-500
            font-medium
            text-white
            transition-all
            duration-300
            hover:scale-[1.02]
            hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]
            active:scale-[0.98]
            "
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-zinc-400">
          Don't have an account?{" "}
          <span className="cursor-pointer text-violet-400 hover:text-violet-300">
            Create account
          </span>
        </p>
      </div>
    </GlassCard>
</motion.div>
  );
}