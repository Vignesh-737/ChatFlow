import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
};

export default function GlassCard({
  children,
  className,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        `
        relative
        overflow-hidden
        rounded-[36px]
        border
        border-white/10
        bg-white/[0.05]
        backdrop-blur-[40px]
        shadow-[0_20px_80px_rgba(0,0,0,.45)]
        `,
        className
      )}
    >
      {/* Reflection */}
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/60 to-transparent" />

      {children}
    </div>
  );
}