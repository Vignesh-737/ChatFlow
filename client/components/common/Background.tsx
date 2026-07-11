import { ReactNode } from "react";

type BackgroundProps = {
  children: ReactNode;
};

export default function Background({
  children,
}: BackgroundProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09090B] px-6">
      {/* Ambient glow */}
      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-500/10 blur-[150px]" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </main>
  );
}