import { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
};

export default function GlassCard({
  children,
  className = "",
}: GlassCardProps) {
  return (
    <div
      className={`
        rounded-[32px]
        border border-white/10
        bg-white/[0.06]
        backdrop-blur-3xl
        shadow-[0_8px_40px_rgba(0,0,0,0.35)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}