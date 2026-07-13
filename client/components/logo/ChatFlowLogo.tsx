import { MessageCircle } from "lucide-react";

export default function ChatFlowLogo() {
  return (
    <div className="flex flex-col items-center gap-5">
      <div
        className="
        flex
        h-20
        w-20
        items-center
        justify-center
        rounded-[28px]
        border
        border-violet-400/20
        bg-gradient-to-br
        from-violet-500/20
        to-indigo-500/20
        backdrop-blur-3xl
        shadow-[0_0_60px_rgba(124,92,252,.25)]
      "
      >
        <MessageCircle
          size={38}
          className="text-violet-300"
        />
      </div>

      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight text-white">
          Chat
          <span className="text-violet-400">Flow</span>
        </h1>

        <p className="mt-2 text-zinc-400">
          Secure. Fast. Beautiful.
        </p>
      </div>
    </div>
  );
}