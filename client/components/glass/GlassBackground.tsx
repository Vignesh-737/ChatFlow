import { ReactNode } from "react";

type GlassBackgroundProps = {
  children: ReactNode;
};

export default function GlassBackground({
  children,
}: GlassBackgroundProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08090F]">
      {/* Top Glow */}
      <div className="absolute left-1/2 top-[-220px] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-violet-500/15 blur-[180px]" />

      {/* Bottom Left */}
      <div className="absolute bottom-[-250px] left-[-150px] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[180px]" />

      {/* Bottom Right */}
      <div className="absolute right-[-150px] top-[40%] h-[400px] w-[400px] rounded-full bg-purple-400/10 blur-[180px]" />

      {/* Noise */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        {children}
      </div>
    </main>
  );
}